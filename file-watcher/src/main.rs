//! file-watcher: CLI lắng nghe thay đổi file trong 1 hoặc nhiều thư mục.
//!
//! Nhẹ và nhanh nhờ:
//! - `notify` dùng API của hệ điều hành (ReadDirectoryChangesW /
//!   inotify / FSEvents): không polling, lúc rảnh CPU ~ 0.
//! - Vòng lặp chính block trên channel, chỉ tỉnh dậy khi có event.
//! - Chỉ 2 dependency (notify + chrono), không async runtime.
//! - Debounce gộp các event dồn dập (vd: 1 lần lưu file của editor)
//!   thành 1 dòng log duy nhất.
//!
//! Với `--serve`, app mở thêm giao diện web trên 127.0.0.1 để cấu
//! hình thư mục theo dõi và xem log realtime (xem `web.rs`). Giao
//! diện dùng chung trạng thái với vòng lặp watcher qua `Shared`
//! (thêm/xóa thư mục áp dụng ngay, không cần khởi động lại).

use std::fs::{File, OpenOptions};
use std::io::{BufWriter, Write};
use std::path::{Path, PathBuf};
use std::sync::mpsc::{self, RecvTimeoutError};
use std::time::Duration;

use file_watcher::{
    detect_identity, format_human, format_json, load_config, now_string, parse_args, summarize,
    usage, Coalescer, Filter, Identity, Settings, Summary, VERSION,
};
use file_watcher::web::{serve, Shared};
use notify::{Config, RecommendedWatcher, RecursiveMode, Watcher};

fn main() {
    std::process::exit(real_main());
}

fn real_main() -> i32 {
    let argv: Vec<String> = std::env::args().skip(1).collect();
    let args = match parse_args(argv) {
        Ok(a) => a,
        Err(msg) => {
            eprintln!("Lỗi: {msg}\n");
            eprint!("{}", usage());
            return 1;
        }
    };
    if args.help {
        print!("{}", usage());
        return 0;
    }
    if args.version {
        println!("file-watcher {VERSION}");
        return 0;
    }

    // Định danh máy + user, ghi kèm vào mỗi dòng log. PC ID mặc định
    // là hostname, --pc-id ghi đè khi cần tên khác.
    let mut identity = detect_identity();
    if let Some(pc_id) = &args.pc_id {
        if !pc_id.trim().is_empty() {
            identity.pc = pc_id.trim().to_string();
        }
    }

    // File cấu hình: --config nếu có; với --serve mà không có --config
    // thì mặc định dùng watch.txt ở thư mục hiện tại (nếu có).
    let config_path: Option<PathBuf> = match &args.config {
        Some(c) => Some(PathBuf::from(c)),
        None if args.serve => Some(PathBuf::from("watch.txt")),
        None => None,
    };

    // Đọc file cấu hình (thư mục + cài đặt @...). File --config chỉ
    // định rõ mà không đọc được thì báo lỗi và dừng — trừ khi đang
    // --serve: lúc đó coi như bắt đầu rỗng, giao diện web sẽ tạo file
    // khi user thêm thư mục đầu tiên.
    let mut settings = Settings::default();
    let mut raw_dirs = args.dirs.clone();
    if let Some(config) = &config_path {
        let config_str = config.to_string_lossy().into_owned();
        match load_config(&config_str) {
            Ok((mut dirs, cfg_settings)) => {
                settings = cfg_settings;
                raw_dirs.append(&mut dirs);
            }
            Err(msg) => {
                if args.serve && args.config.is_none() {
                    // watch.txt mặc định chưa có: bắt đầu rỗng.
                } else if args.serve && !config.exists() {
                    // File --config chưa tồn tại: bắt đầu rỗng, sẽ
                    // tạo khi lưu từ giao diện web.
                } else {
                    eprintln!("Lỗi: {msg}");
                    return 1;
                }
            }
        }
    }

    // CLI thắng file cấu hình — nhưng chỉ với flag user gõ rõ (xem
    // *_set trong Args), nếu không giá trị mặc định của CLI sẽ đè
    // cài đặt trong file.
    if args.exts_set {
        settings.exts = args.exts.clone();
    }
    if args.ignores_set {
        settings.ignores = args.ignores.clone();
    }
    if args.debounce_set {
        settings.debounce_ms = args.debounce_ms;
    }
    if args.recursive_set {
        settings.recursive = args.recursive;
    }

    if raw_dirs.is_empty() && !args.serve {
        eprintln!("Lỗi: chưa chỉ định thư mục nào để theo dõi.\n");
        eprint!("{}", usage());
        return 1;
    }

    // Canonicalize + kiểm tra từng thư mục, loại trùng.
    let mut roots: Vec<PathBuf> = Vec::new();
    for dir in &raw_dirs {
        match Path::new(dir).canonicalize() {
            Ok(canon) if canon.is_dir() => {
                if !roots.contains(&canon) {
                    roots.push(canon);
                }
            }
            Ok(_) => {
                eprintln!("Lỗi: không phải thư mục: {dir}");
                return 1;
            }
            Err(_) => {
                eprintln!("Lỗi: thư mục không tồn tại hoặc không đọc được: {dir}");
                return 1;
            }
        }
    }

    // File log: mở ngay để lỗi quyền / đường dẫn báo sớm. Ghi nhớ
    // đường dẫn tuyệt đối của nó để tự loại event do chính mình ghi.
    let mut log_writer: Option<BufWriter<File>> = None;
    let mut log_path: Option<PathBuf> = None;
    if let Some(log) = &args.log {
        match OpenOptions::new().create(true).append(true).open(log) {
            Ok(file) => {
                log_path = Some(absolute_log_path(log));
                log_writer = Some(BufWriter::new(file));
            }
            Err(e) => {
                eprintln!("Lỗi: không mở được file log {log}: {e}");
                return 1;
            }
        }
    }

    let filter = Filter {
        exts: settings.exts.clone(),
        ignores: settings.ignores.clone(),
    };
    let recursive = settings.recursive;

    let (tx, rx) = mpsc::channel();
    let mut watcher = match RecommendedWatcher::new(tx, Config::default()) {
        Ok(w) => w,
        Err(e) => {
            eprintln!("Lỗi: không tạo được watcher: {e}");
            return 2;
        }
    };
    let mode = if recursive {
        RecursiveMode::Recursive
    } else {
        RecursiveMode::NonRecursive
    };
    for root in &roots {
        if let Err(e) = watcher.watch(root, mode) {
            eprintln!("Lỗi: không theo dõi được {}: {e}", root.display());
            return 2;
        }
    }

    // Trạng thái dùng chung với giao diện web (thêm/xóa thư mục,
    // đổi cài đặt, log realtime). Watcher chuyển vào đây để luồng
    // web có thể watch/unwatch trực tiếp.
    let shared = Shared::new(
        watcher,
        roots.clone(),
        filter,
        settings.debounce_ms,
        recursive,
        config_path.clone(),
        identity.clone(),
    );

    // Giao diện web: bind ở luồng chính để cổng bị chiếm báo lỗi ngay.
    if args.serve {
        match std::net::TcpListener::bind(("127.0.0.1", args.port)) {
            Ok(listener) => {
                let server_shared = shared.clone();
                std::thread::spawn(move || {
                    if let Err(e) = serve(listener, server_shared) {
                        eprintln!("Lỗi: giao diện web dừng: {e}");
                    }
                });
            }
            Err(e) => {
                eprintln!(
                    "Lỗi: không bật được giao diện web trên cổng {}: {e}",
                    args.port
                );
                return 2;
            }
        }
    }

    // Banner ra stderr để stdout luôn sạch (pipe sang file / tool khác
    // chỉ nhận event, kể cả khi dùng --json).
    eprintln!(
        "file-watcher {VERSION} — đang lắng nghe {} thư mục ({}; debounce {}ms)",
        roots.len(),
        if recursive { "đệ quy" } else { "không đệ quy" },
        settings.debounce_ms
    );
    eprintln!("  máy: {}", identity.label());
    for root in &roots {
        eprintln!("  {}", root.display());
    }
    if !settings.exts.is_empty() {
        eprintln!("  chỉ hiện đuôi: {}", settings.exts.join(", "));
    }
    if !settings.ignores.is_empty() {
        eprintln!("  bỏ qua chuỗi: {}", settings.ignores.join(", "));
    }
    if let Some(log) = &args.log {
        eprintln!("  ghi log thêm vào: {log}");
    }
    if args.exec.is_some() {
        eprintln!("  chạy lệnh mỗi event (--exec)");
    }
    if args.serve {
        eprintln!(
            "  giao diện web: http://127.0.0.1:{} (chỉ máy này mở được)",
            args.port
        );
        match &config_path {
            Some(p) => eprintln!("  file cấu hình: {}", p.display()),
            None => eprintln!("  không có file cấu hình: thay đổi từ giao diện chỉ giữ trong phiên này"),
        }
    }
    eprintln!("Nhấn Ctrl+C để dừng.");

    let mut coalescer = Coalescer::new();
    let stdout = std::io::stdout();

    // Vòng lặp chính: recv() block cho tới khi có event nên lúc rảnh
    // không tốn CPU; khi có event thì gom thêm trong cửa sổ debounce.
    // Filter + debounce đọc lại từ trạng thái dùng chung cho MỖI event
    // (xem handle_event) và mỗi lần chờ, để thay đổi từ giao diện web
    // áp dụng ngay cả với event đang dồn dập — nếu chỉ đọc 1 lần ở
    // đầu batch thì batch đầu tiên sau khi đổi cài đặt vẫn dùng bộ
    // lọc cũ (bắt được khi test live ngày 2026-11-13).
    loop {
        let first = match rx.recv() {
            Ok(item) => item,
            Err(_) => break, // watcher đã dừng (không xảy ra khi chạy thường)
        };
        handle_event(first, &shared, log_path.as_ref(), &mut coalescer);

        loop {
            let debounce = Duration::from_millis(shared.snapshot().1);
            match rx.recv_timeout(debounce) {
                Ok(item) => handle_event(item, &shared, log_path.as_ref(), &mut coalescer),
                Err(RecvTimeoutError::Timeout) => break,
                Err(RecvTimeoutError::Disconnected) => {
                    flush(
                        &mut coalescer,
                        &args.json,
                        &args.exec,
                        &mut log_writer,
                        &stdout,
                        &shared,
                        &identity,
                    );
                    return 0;
                }
            }
        }
        flush(
            &mut coalescer,
            &args.json,
            &args.exec,
            &mut log_writer,
            &stdout,
            &shared,
            &identity,
        );
    }
    0
}

/// Xử lý 1 item từ channel: lỗi watcher thì báo stderr và tiếp tục;
/// event thì rút gọn -> lọc (bộ lọc đọc mới từ trạng thái dùng chung
/// cho mỗi event) -> đưa vào bộ gộp.
fn handle_event(
    item: Result<notify::Event, notify::Error>,
    shared: &Shared,
    log_path: Option<&PathBuf>,
    coalescer: &mut Coalescer,
) {
    let event = match item {
        Ok(e) => e,
        Err(e) => {
            eprintln!("lỗi watcher: {e}");
            return;
        }
    };
    // Cờ Rescan = hàng đợi event của OS đã tràn, có thể đã bỏ sót
    // thay đổi. Không bịa event file, chỉ cảnh báo ra stderr.
    if event.flag() == Some(notify::event::Flag::Rescan) {
        eprintln!("cảnh báo: hàng đợi event tràn, có thể đã bỏ sót thay đổi — nên kiểm tra lại thư mục");
        return;
    }
    let Some(summary) = summarize(&event, now_string()) else {
        return;
    };
    // Bỏ event do chính file log của mình gây ra (khi file log nằm
    // trong thư mục đang theo dõi) để tránh vòng lặp tự kích hoạt.
    if let Some(log) = log_path {
        if summary.path == *log || summary.from.as_ref() == Some(log) {
            return;
        }
    }
    // Bộ lọc đọc mới cho mỗi event: rẻ (1 lock + clone 2 Vec ngắn),
    // đổi từ giao diện web áp dụng ngay.
    let (filter, _) = shared.snapshot();
    if !filter.allows(&summary) {
        return;
    }
    coalescer.push(summary);
}

/// In toàn bộ event đã gộp: stdout + file log + lệnh --exec + đẩy
/// vào log của giao diện web (luôn dạng JSON). Mỗi dòng đều ghi kèm
/// user + PC ID của máy chạy.
/// Gom thành 1 lần ghi cho stdout/log để không xen kẽ khi pipe.
fn flush(
    coalescer: &mut Coalescer,
    json: &bool,
    exec: &Option<String>,
    log_writer: &mut Option<BufWriter<File>>,
    stdout: &std::io::Stdout,
    shared: &Shared,
    identity: &Identity,
) {
    if coalescer.is_empty() {
        // Vẫn phải dọn bộ gộp (các mục đã Drop) để cửa sổ sau sạch.
        let _ = coalescer.take();
        return;
    }
    let summaries = coalescer.take();
    let mut out = String::new();
    for s in &summaries {
        if *json {
            out.push_str(&format_json(s, identity));
        } else {
            out.push_str(&format_human(s, identity));
        }
        out.push('\n');
        shared.push_event(format_json(s, identity));
    }
    {
        let mut lock = stdout.lock();
        let _ = lock.write_all(out.as_bytes());
        let _ = lock.flush();
    }
    if let Some(log) = log_writer {
        let _ = log.write_all(out.as_bytes());
        let _ = log.flush();
    }
    if let Some(template) = exec {
        for s in &summaries {
            run_hook(template, s, identity);
        }
    }
}

/// Chạy lệnh --exec cho 1 event, không chờ kết quả (không chặn vòng
/// lặp watcher). Placeholder: {path} {event} {time} {from} {user} {pc}.
fn run_hook(template: &str, summary: &Summary, identity: &Identity) {
    let from = summary
        .from
        .as_ref()
        .map(|p| p.to_string_lossy().into_owned())
        .unwrap_or_default();
    let cmd = template
        .replace("{path}", &summary.path.to_string_lossy())
        .replace("{event}", summary.kind.name())
        .replace("{time}", &summary.time)
        .replace("{from}", &from)
        .replace("{user}", &identity.user)
        .replace("{pc}", &identity.pc);
    #[cfg(windows)]
    let spawned = std::process::Command::new("cmd").args(["/C", &cmd]).spawn();
    #[cfg(not(windows))]
    let spawned = std::process::Command::new("sh").args(["-c", &cmd]).spawn();
    if let Err(e) = spawned {
        eprintln!("không chạy được lệnh --exec: {e}");
    }
}

/// Đường dẫn tuyệt đối của file log để so sánh với event (event luôn
/// là đường dẫn tuyệt đối vì thư mục gốc đã được canonicalize).
/// Canonicalize thư mục cha để khớp cả khi đường dẫn chứa symlink.
fn absolute_log_path(log: &str) -> PathBuf {
    let path = Path::new(log);
    let abs = std::path::absolute(path).unwrap_or_else(|_| path.to_path_buf());
    if let (Some(parent), Some(name)) = (abs.parent(), abs.file_name()) {
        if let Ok(canon_parent) = parent.canonicalize() {
            return canon_parent.join(name);
        }
    }
    abs
}
