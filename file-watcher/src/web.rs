//! Giao diện web local cho file-watcher.
//!
//! HTTP server tối giản viết tay bằng `std::net::TcpListener` — không
//! thêm dependency nào, giữ đúng tiêu chí nhẹ/nhanh của app (CLI vẫn
//! chỉ có 2 dependency trực tiếp). Chỉ bind `127.0.0.1` nên chỉ máy
//! này mở được.
//!
//! - `GET /` — trang giao diện duy nhất (nhúng sẵn trong binary).
//! - `GET /events?after=N` — SSE: stream event realtime (JSON 1 dòng,
//!   cùng định dạng với `--json`), kèm heartbeat mỗi ~15 giây.
//! - `GET /api/config` — cấu hình hiện tại (thư mục, đệ quy,
//!   debounce, cổng, exts, ignores, file cấu hình, danh sách ghim).
//! - `GET /api/log?after=N` — log gần đây (tối đa 1000 dòng, có số
//!   thứ tự tăng dần để client nối tiếp qua SSE mà không sót/trùng).
//! - `POST /api/dirs` — thêm/xóa thư mục theo dõi (áp dụng ngay,
//!   lưu vào file cấu hình).
//! - `POST /api/config` — đổi cài đặt (áp dụng ngay, lưu vào file);
//!   đổi cổng thì server bind lại ngay, trả về cổng mới.
//! - `POST /api/pins` — ghim/bỏ ghim 1 file (lưu vào file cấu hình
//!   lưu vào file cấu hình JSON; không đổi watcher).
//!
//! Mọi thay đổi từ giao diện đều: áp dụng live trước, lưu file sau;
//! lưu lỗi thì rollback thay đổi live và trả lỗi cho giao diện.

use std::collections::{HashMap, VecDeque};
use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex, MutexGuard};
use std::time::Duration;

use notify::{RecursiveMode, Watcher};

use crate::{
    json_escape, save_config, split_list, strip_verbatim_prefix, Filter, Identity, Pin, Settings,
};

/// Trang giao diện duy nhất, nhúng vào binary lúc build.
const UI_HTML: &str = include_str!("ui.html");

/// Số dòng log giữ lại trong bộ nhớ để trang web tải lần đầu.
const MAX_LOG: usize = 1000;
/// Giới hạn kích thước header/body của 1 request (chống request lạ).
const MAX_HEADER_BYTES: usize = 64 * 1024;
const MAX_BODY_BYTES: usize = 1024 * 1024;

/// Trạng thái dùng chung giữa vòng lặp watcher (luồng chính) và
/// server web (luồng riêng + 1 luồng mỗi kết nối). Mọi truy cập đều
/// qua Mutex với critical section ngắn — vòng lặp watcher không bao
/// giờ giữ lock khi đang chờ event.
pub struct SharedState {
    watcher: notify::RecommendedWatcher,
    roots: Vec<PathBuf>,
    filter: Filter,
    debounce_ms: u64,
    recursive: bool,
    config_path: Option<PathBuf>,
    /// Cổng web UI hiện tại (đổi được từ giao diện, lưu vào file).
    port: u16,
    /// Listener mới đã bind sẵn, chờ vòng lặp serve đổi sang (khi
    /// giao diện đổi port). Vòng lặp lấy ra rồi drop listener cũ.
    pending_listener: Option<(TcpListener, u16)>,
    /// Định danh máy + user (cố định trong suốt phiên chạy).
    identity: Identity,
    /// File được ghim từ giao diện web (tab Đã ghim). Chỉ là trạng
    /// thái hiển thị, không ảnh hưởng watcher; lưu vào file cấu hình.
    pins: Vec<Pin>,
    /// (số thứ tự tăng dần, 1 dòng JSON của event).
    log: VecDeque<(u64, String)>,
    seq: u64,
}

#[derive(Clone)]
pub struct Shared(Arc<Mutex<SharedState>>);

/// Khóa Mutex, tự hồi phục nếu luồng khác panic trong lúc giữ lock
/// (watcher chạy dài ngày không được chết chỉ vì 1 lần panic lạ).
fn lock(state: &Mutex<SharedState>) -> MutexGuard<'_, SharedState> {
    state.lock().unwrap_or_else(|e| e.into_inner())
}

impl Shared {
    pub fn new(
        watcher: notify::RecommendedWatcher,
        roots: Vec<PathBuf>,
        filter: Filter,
        debounce_ms: u64,
        recursive: bool,
        config_path: Option<PathBuf>,
        identity: Identity,
        pins: Vec<Pin>,
        port: u16,
    ) -> Self {
        Shared(Arc::new(Mutex::new(SharedState {
            watcher,
            roots,
            filter,
            debounce_ms,
            recursive,
            config_path,
            identity,
            pins,
            port,
            pending_listener: None,
            log: VecDeque::new(),
            seq: 0,
        })))
    }

    /// Cổng web UI hiện tại.
    pub fn port(&self) -> u16 {
        lock(&self.0).port
    }

    /// Vòng lặp serve lấy listener đang chờ đổi cổng (nếu có).
    fn take_pending_listener(&self) -> Option<(TcpListener, u16)> {
        lock(&self.0).pending_listener.take()
    }

    /// Đẩy 1 event (đã format JSON) vào log cho giao diện web.
    /// Gọi từ vòng lặp watcher sau mỗi lần flush.
    pub fn push_event(&self, json_line: String) {
        let mut st = lock(&self.0);
        st.seq += 1;
        let seq = st.seq;
        st.log.push_back((seq, json_line));
        while st.log.len() > MAX_LOG {
            st.log.pop_front();
        }
    }

    /// Ảnh chụp cấu hình hiện tại cho vòng lặp watcher (lọc + debounce)
    /// và cho API. Clone Filter rẻ (2 Vec<String> ngắn).
    pub fn snapshot(&self) -> (Filter, u64) {
        let st = lock(&self.0);
        (st.filter.clone(), st.debounce_ms)
    }

    /// Các event có số thứ tự > `after` (để trang web tải lần đầu
    /// và SSE nối tiếp). Trả về tối đa MAX_LOG dòng.
    pub fn log_since(&self, after: u64) -> Vec<(u64, String)> {
        let st = lock(&self.0);
        st.log
            .iter()
            .filter(|(seq, _)| *seq > after)
            .cloned()
            .collect()
    }

    /// JSON cho `GET /api/config`.
    fn config_json(&self) -> String {
        let st = lock(&self.0);
        let list = |items: &[String]| -> String {
            items
                .iter()
                .map(|s| format!("\"{}\"", json_escape(s)))
                .collect::<Vec<_>>()
                .join(",")
        };
        let dirs: Vec<String> = st
            .roots
            .iter()
            .map(|p| p.to_string_lossy().into_owned())
            .collect();
        let config_file = match &st.config_path {
            Some(p) => format!("\"{}\"", json_escape(&p.to_string_lossy())),
            None => "null".to_string(),
        };
        // `command` để dành cho quy trình riêng theo file, hiện luôn null.
        let pins: Vec<String> = st
            .pins
            .iter()
            .map(|p| {
                format!(
                    "{{\"path\":\"{}\",\"command\":null}}",
                    json_escape(&p.path.to_string_lossy())
                )
            })
            .collect();
        format!(
            "{{\"dirs\":[{}],\"recursive\":{},\"debounce_ms\":{},\"port\":{},\"exts\":[{}],\"ignores\":[{}],\"config_file\":{},\"events\":{},\"user\":\"{}\",\"pc\":\"{}\",\"pins\":[{}]}}",
            list(&dirs),
            st.recursive,
            st.debounce_ms,
            st.port,
            list(&st.filter.exts),
            list(&st.filter.ignores),
            config_file,
            st.seq,
            json_escape(&st.identity.user),
            json_escape(&st.identity.pc),
            pins.join(",")
        )
    }

    /// Lưu file cấu hình từ trạng thái hiện tại (gọi khi đang giữ lock).
    fn save_locked(st: &SharedState) -> Result<(), String> {
        let Some(path) = &st.config_path else {
            return Ok(());
        };
        let settings = Settings {
            exts: st.filter.exts.clone(),
            ignores: st.filter.ignores.clone(),
            debounce_ms: st.debounce_ms,
            recursive: st.recursive,
            pins: st.pins.clone(),
            port: st.port,
        };
        save_config(path, &st.roots, &settings)
    }

    /// Thêm 1 thư mục: kiểm tra tồn tại -> watch live -> lưu file.
    /// Lưu lỗi thì bỏ watch vừa thêm (rollback).
    pub fn add_dir(&self, dir: &str) -> Result<(), String> {
        // Bỏ tiền tố verbatim \\?\ mà canonicalize sinh ra trên
        // Windows — nếu không thư mục lưu vào watch.json và hiện
        // ở sidebar đều mang tiền tố thừa đó.
        let canon = strip_verbatim_prefix(&Path::new(dir).canonicalize().map_err(|_| {
            format!("folder does not exist or is not readable: {dir}")
        })?);
        if !canon.is_dir() {
            return Err(format!("not a folder: {dir}"));
        }
        let mut st = lock(&self.0);
        if st.roots.contains(&canon) {
            return Err(format!(
                "folder is already being watched: {}",
                canon.display()
            ));
        }
        let mode = mode_of(st.recursive);
        if let Err(e) = st.watcher.watch(&canon, mode) {
            return Err(format!("cannot watch {}: {e}", canon.display()));
        }
        st.roots.push(canon);
        if let Err(e) = Self::save_locked(&st) {
            let removed = st.roots.pop().unwrap();
            let _ = st.watcher.unwatch(&removed);
            return Err(e);
        }
        Ok(())
    }

    /// Xóa 1 thư mục khỏi danh sách theo dõi (unwatch live + lưu file).
    pub fn remove_dir(&self, dir: &str) -> Result<(), String> {
        // Bỏ \\?\ như add_dir để so khớp được với thư mục đã lưu.
        let canon = strip_verbatim_prefix(
            &Path::new(dir)
                .canonicalize()
                .map_err(|_| format!("folder does not exist: {dir}"))?,
        );
        let mut st = lock(&self.0);
        let Some(pos) = st.roots.iter().position(|r| r == &canon) else {
            return Err(format!(
                "folder is not in the watch list: {}",
                canon.display()
            ));
        };
        let removed = st.roots.remove(pos);
        let _ = st.watcher.unwatch(&removed);
        if let Err(e) = Self::save_locked(&st) {
            let mode = mode_of(st.recursive);
            let _ = st.watcher.watch(&removed, mode);
            st.roots.insert(pos, removed);
            return Err(e);
        }
        Ok(())
    }

    /// Ghim 1 file (tab Đã ghim). Đường dẫn phải tuyệt đối; tồn tại
    /// thì canonicalize, chưa tồn tại thì giữ nguyên để ghim trước
    /// file sẽ xuất hiện sau. Ghim trùng thì không làm gì
    /// (idempotent). Chỉ lưu trạng thái + file cấu hình, không đổi
    /// watcher — file ngoài vùng theo dõi vẫn ghim được, giao diện
    /// sẽ đánh dấu "ngoài vùng theo dõi".
    pub fn add_pin(&self, path: &str) -> Result<(), String> {
        let normalized = normalize_pin_path(path)?;
        let mut st = lock(&self.0);
        if find_pin(&st.pins, &normalized, path).is_some() {
            return Ok(());
        }
        st.pins.push(Pin::new(normalized));
        if let Err(e) = Self::save_locked(&st) {
            st.pins.pop();
            return Err(e);
        }
        Ok(())
    }

    /// Bỏ ghim 1 file. Không có trong danh sách thì vẫn Ok
    /// (idempotent — giao diện có thể gọi lại sau khi mất mạng).
    pub fn remove_pin(&self, path: &str) -> Result<(), String> {
        let normalized = normalize_pin_path(path)?;
        let mut st = lock(&self.0);
        let Some(pos) = find_pin(&st.pins, &normalized, path) else {
            return Ok(());
        };
        let removed = st.pins.remove(pos);
        if let Err(e) = Self::save_locked(&st) {
            st.pins.insert(pos, removed);
            return Err(e);
        }
        Ok(())
    }

    /// Đổi cài đặt (chỉ đổi các trường được truyền vào). Trả về cổng
    /// web UI hiện tại sau khi áp dụng (để giao diện biết có cần
    /// chuyển sang cổng mới không).
    /// Đổi `recursive` thì watch lại toàn bộ thư mục với chế độ mới;
    /// watch lại lỗi thì giữ nguyên chế độ cũ và trả lỗi.
    /// Đổi `port`: bind listener mới TRƯỚC khi đổi bất cứ gì —
    /// bind lỗi (cổng bị chiếm) thì không đổi gì cả. Bind được rồi
    /// mới đổi state + lưu file; lưu lỗi thì rollback toàn bộ và
    /// hủy listener mới. Thành công thì listener mới chờ vòng lặp
    /// serve đổi sang (trong ~50ms).
    pub fn apply_settings(
        &self,
        recursive: Option<bool>,
        debounce_ms: Option<u64>,
        exts: Option<Vec<String>>,
        ignores: Option<Vec<String>>,
        port: Option<u16>,
    ) -> Result<u16, String> {
        let mut st = lock(&self.0);
        let old_recursive = st.recursive;
        let old_debounce = st.debounce_ms;
        let old_filter = st.filter.clone();
        let old_port = st.port;
        let new_recursive = recursive.unwrap_or(old_recursive);
        let new_port = port.unwrap_or(old_port);

        // Đổi cổng: bind trước để biết chắc cổng mới dùng được.
        let mut new_listener = None;
        if new_port != old_port {
            match TcpListener::bind(("127.0.0.1", new_port)) {
                Ok(l) => new_listener = Some(l),
                Err(e) => {
                    return Err(format!("cannot listen on port {new_port}: {e}"));
                }
            }
        }

        // Đổi chế độ đệ quy: watch lại toàn bộ trước khi đổi state.
        if new_recursive != old_recursive {
            let mode = mode_of(new_recursive);
            let mut failed: Vec<String> = Vec::new();
            for root in st.roots.clone() {
                let _ = st.watcher.unwatch(&root);
                if let Err(e) = st.watcher.watch(&root, mode) {
                    failed.push(format!("{}: {e}", root.display()));
                }
            }
            if !failed.is_empty() {
                // Rollback: watch lại toàn bộ bằng chế độ cũ.
                let old_mode = mode_of(old_recursive);
                for root in st.roots.clone() {
                    let _ = st.watcher.unwatch(&root);
                    let _ = st.watcher.watch(&root, old_mode);
                }
                return Err(format!(
                    "cannot change recursive mode ({}): {}",
                    if new_recursive { "recursive" } else { "non-recursive" },
                    failed.join("; ")
                ));
            }
        }

        st.recursive = new_recursive;
        if let Some(d) = debounce_ms {
            st.debounce_ms = d;
        }
        if let Some(e) = exts {
            st.filter.exts = e;
        }
        if let Some(i) = ignores {
            st.filter.ignores = i;
        }
        st.port = new_port;
        if let Err(e) = Self::save_locked(&st) {
            // Rollback state + chế độ watch + cổng (listener mới
            // bị drop cùng new_listener, cổng mới được trả lại).
            if st.recursive != old_recursive {
                let old_mode = mode_of(old_recursive);
                for root in st.roots.clone() {
                    let _ = st.watcher.unwatch(&root);
                    let _ = st.watcher.watch(&root, old_mode);
                }
            }
            st.recursive = old_recursive;
            st.debounce_ms = old_debounce;
            st.filter = old_filter;
            st.port = old_port;
            return Err(e);
        }
        if let Some(l) = new_listener {
            st.pending_listener = Some((l, new_port));
        }
        Ok(new_port)
    }
}

fn mode_of(recursive: bool) -> RecursiveMode {
    if recursive {
        RecursiveMode::Recursive
    } else {
        RecursiveMode::NonRecursive
    }
}

/// Chuẩn hóa đường dẫn ghim: phải tuyệt đối; tồn tại thì
/// canonicalize (gộp symlink, đúng chữ hoa/thường thật trên
/// Windows); chưa tồn tại thì giữ nguyên. Trên Windows đổi `/`
/// thành `\` cho nhất quán với đường dẫn event.
fn normalize_pin_path(path: &str) -> Result<PathBuf, String> {
    let p = Path::new(path);
    if !p.is_absolute() {
        return Err(format!("pinned path must be absolute: {path}"));
    }
    if let Ok(canon) = p.canonicalize() {
        return Ok(strip_verbatim_prefix(&canon));
    }
    #[cfg(windows)]
    {
        Ok(PathBuf::from(path.replace('/', "\\")))
    }
    #[cfg(not(windows))]
    {
        Ok(p.to_path_buf())
    }
}

/// Tìm ghim khớp: so cả dạng đã chuẩn hóa lẫn chuỗi gốc, vì file
/// ghim lúc chưa tồn tại (lưu dạng thô) có thể đã xuất hiện sau đó
/// (chuẩn hóa ra dạng khác) — cả 2 đều phải nhận ra là cùng 1 ghim.
fn find_pin(pins: &[Pin], normalized: &Path, raw: &str) -> Option<usize> {
    pins.iter()
        .position(|p| p.path == normalized || p.path.to_string_lossy() == raw)
}

/// Chạy server web trên listener đã bind sẵn (bind ở luồng chính để
/// biết cổng thực tế trước khi tạo Shared). Chạy mãi (tới khi process
/// dừng). Mỗi kết nối xử lý trong 1 luồng riêng.
///
/// Vòng lặp accept ở chế độ non-blocking, kiểm tra mỗi ~50ms để
/// nhận listener mới khi giao diện đổi cổng: listener cũ bị drop
/// (các kết nối đang mở trên cổng cũ không bị ảnh hưởng), listener
/// mới thay vào ngay. 50ms là đủ nhanh để trình duyệt chuyển cổng
/// mà không thấy chờ, và đủ chậm để lúc rảnh CPU vẫn ~0.
pub fn serve(mut listener: TcpListener, shared: Shared) -> std::io::Result<()> {
    listener.set_nonblocking(true)?;
    loop {
        if let Some((new_listener, _port)) = shared.take_pending_listener() {
            new_listener.set_nonblocking(true)?;
            listener = new_listener;
        }
        match listener.accept() {
            Ok((stream, _)) => {
                // Socket accept từ listener non-blocking cũng ở chế
                // độ non-blocking (trên Linux) — trả về blocking để
                // handle_connection đọc bình thường.
                if stream.set_nonblocking(false).is_err() {
                    continue;
                }
                let shared = shared.clone();
                std::thread::spawn(move || handle_connection(stream, &shared));
            }
            Err(ref e) if e.kind() == std::io::ErrorKind::WouldBlock => {
                std::thread::sleep(Duration::from_millis(50));
            }
            Err(_) => {
                std::thread::sleep(Duration::from_millis(50));
            }
        }
    }
}

struct Request {
    method: String,
    path: String,
    query: String,
    body: Vec<u8>,
}

impl Request {
    /// Tham số `after=N` trong query string (mặc định 0).
    fn query_after(&self) -> u64 {
        for pair in self.query.split('&') {
            if let Some((k, v)) = pair.split_once('=') {
                if k == "after" {
                    return v.parse().unwrap_or(0);
                }
            }
        }
        0
    }
}

fn find_subslice(haystack: &[u8], needle: &[u8]) -> Option<usize> {
    haystack
        .windows(needle.len())
        .position(|window| window == needle)
}

/// Đọc 1 HTTP request: header tới `\r\n\r\n` rồi body theo
/// Content-Length. Trả None khi kết nối hỏng / request quá lớn.
fn read_request(stream: &mut TcpStream) -> Option<Request> {
    let mut buf: Vec<u8> = Vec::new();
    let mut chunk = [0u8; 4096];
    loop {
        let n = stream.read(&mut chunk).ok()?;
        if n == 0 {
            return None;
        }
        buf.extend_from_slice(&chunk[..n]);
        if buf.len() > MAX_HEADER_BYTES + MAX_BODY_BYTES {
            return None;
        }
        if let Some(pos) = find_subslice(&buf, b"\r\n\r\n") {
            let head = &buf[..pos];
            let mut rest = buf[pos + 4..].to_vec();
            let head_str = String::from_utf8_lossy(head);
            let mut lines = head_str.lines();
            let first = lines.next()?;
            let mut parts = first.split_whitespace();
            let method = parts.next()?.to_string();
            let target = parts.next()?.to_string();
            let mut content_length = 0usize;
            for line in lines {
                if let Some((k, v)) = line.split_once(':') {
                    if k.trim().eq_ignore_ascii_case("content-length") {
                        content_length = v.trim().parse().unwrap_or(0);
                    }
                }
            }
            if content_length > MAX_BODY_BYTES {
                return None;
            }
            while rest.len() < content_length {
                let n = stream.read(&mut chunk).ok()?;
                if n == 0 {
                    return None;
                }
                rest.extend_from_slice(&chunk[..n]);
            }
            rest.truncate(content_length);
            let (path, query) = match target.split_once('?') {
                Some((p, q)) => (percent_decode(p), q.to_string()),
                None => (percent_decode(&target), String::new()),
            };
            return Some(Request {
                method,
                path,
                query,
                body: rest,
            });
        }
    }
}

/// Trả 1 response đầy đủ (có Content-Length) rồi đóng kết nối.
fn respond(stream: &mut TcpStream, status: u16, content_type: &str, body: &[u8]) {
    let reason = match status {
        200 => "OK",
        400 => "Bad Request",
        404 => "Not Found",
        _ => "OK",
    };
    let head = format!(
        "HTTP/1.1 {status} {reason}\r\nContent-Type: {content_type}\r\nContent-Length: {}\r\nConnection: close\r\n\r\n",
        body.len()
    );
    let _ = stream.write_all(head.as_bytes());
    let _ = stream.write_all(body);
    let _ = stream.flush();
}

fn json_ok(stream: &mut TcpStream) {
    respond(stream, 200, "application/json", b"{\"ok\":true}");
}

/// `{"ok":true,"port":N}` — dùng cho POST /api/config để giao diện
/// biết cổng hiện tại (có thể vừa đổi) mà chuyển trang theo.
fn json_ok_port(stream: &mut TcpStream, port: u16) {
    let body = format!("{{\"ok\":true,\"port\":{port}}}");
    respond(stream, 200, "application/json", body.as_bytes());
}

fn json_err(stream: &mut TcpStream, message: &str) {
    let body = format!("{{\"ok\":false,\"error\":\"{}\"}}", json_escape(message));
    respond(stream, 400, "application/json", body.as_bytes());
}

fn handle_connection(mut stream: TcpStream, shared: &Shared) {
    let _ = stream.set_read_timeout(Some(Duration::from_secs(10)));
    let Some(req) = read_request(&mut stream) else {
        return;
    };
    let _ = stream.set_read_timeout(None);
    match (req.method.as_str(), req.path.as_str()) {
        ("GET", "/") => respond(&mut stream, 200, "text/html; charset=utf-8", UI_HTML.as_bytes()),
        ("GET", "/events") => handle_events(stream, shared, req.query_after()),
        ("GET", "/api/config") => {
            let body = shared.config_json();
            respond(&mut stream, 200, "application/json", body.as_bytes());
        }
        ("GET", "/api/log") => {
            let items = shared.log_since(req.query_after());
            let mut out = String::from("{\"events\":[");
            for (i, (seq, json)) in items.iter().enumerate() {
                if i > 0 {
                    out.push(',');
                }
                // json đã là object {"time":...}; chèn "seq" vào đầu.
                if let Some(rest) = json.strip_prefix('{') {
                    out.push_str(&format!("{{\"seq\":{seq},{rest}"));
                } else {
                    out.push_str(json);
                }
            }
            out.push_str("]}");
            respond(&mut stream, 200, "application/json", out.as_bytes());
        }
        ("POST", "/api/dirs") => {
            let form = parse_form(&req.body);
            let dir = form.get("dir").cloned().unwrap_or_default();
            let result = match form.get("action").map(|s| s.as_str()) {
                Some("add") => shared.add_dir(&dir),
                Some("remove") => shared.remove_dir(&dir),
                _ => Err("action must be add or remove".to_string()),
            };
            match result {
                Ok(()) => json_ok(&mut stream),
                Err(e) => json_err(&mut stream, &e),
            }
        }
        ("POST", "/api/pins") => {
            let form = parse_form(&req.body);
            let path = form.get("path").cloned().unwrap_or_default();
            let result = match form.get("action").map(|s| s.as_str()) {
                Some("add") => shared.add_pin(&path),
                Some("remove") => shared.remove_pin(&path),
                _ => Err("action must be add or remove".to_string()),
            };
            match result {
                Ok(()) => json_ok(&mut stream),
                Err(e) => json_err(&mut stream, &e),
            }
        }
        ("POST", "/api/config") => {
            let form = parse_form(&req.body);
            let recursive = match form.get("recursive").map(|s| s.as_str()) {
                Some("true") => Some(true),
                Some("false") => Some(false),
                Some(other) => {
                    json_err(&mut stream, &format!("recursive must be true or false, got: {other}"));
                    return;
                }
                None => None,
            };
            let debounce_ms = match form.get("debounce_ms") {
                Some(v) => match v.parse::<u64>() {
                    Ok(n) => Some(n),
                    Err(_) => {
                        json_err(&mut stream, &format!("debounce_ms must be an integer >= 0, got: {v}"));
                        return;
                    }
                },
                None => None,
            };
            let exts = form.get("exts").map(|v| split_list(v));
            let ignores = form.get("ignores").map(|v| split_list(v));
            let port = match form.get("port") {
                Some(v) => match v.parse::<u32>() {
                    Ok(n) if (1..=65535).contains(&n) => Some(n as u16),
                    _ => {
                        json_err(&mut stream, &format!("port must be an integer 1-65535, got: {v}"));
                        return;
                    }
                },
                None => None,
            };
            match shared.apply_settings(recursive, debounce_ms, exts, ignores, port) {
                Ok(new_port) => json_ok_port(&mut stream, new_port),
                Err(e) => json_err(&mut stream, &e),
            }
        }
        _ => respond(&mut stream, 404, "text/plain; charset=utf-8", "not found".as_bytes()),
    }
}

/// SSE: stream event realtime bằng chunked encoding. Mỗi event là 1
/// chunk `id: <seq>\ndata: <json>\n\n`. Heartbeat `: ping` mỗi ~15s.
/// Ghi lỗi = client đã ngắt, luồng kết thúc.
fn handle_events(mut stream: TcpStream, shared: &Shared, mut after: u64) {
    let head = "HTTP/1.1 200 OK\r\nContent-Type: text/event-stream\r\nCache-Control: no-cache\r\nTransfer-Encoding: chunked\r\nConnection: keep-alive\r\n\r\n";
    if stream.write_all(head.as_bytes()).is_err() {
        return;
    }
    let _ = stream.flush();
    let mut idle_ticks = 0u32;
    loop {
        let items = shared.log_since(after);
        if items.is_empty() {
            idle_ticks += 1;
            if idle_ticks % 150 == 0 && write_chunk(&mut stream, b": ping\n\n").is_err() {
                return;
            }
        } else {
            idle_ticks = 0;
            for (seq, json) in items {
                after = seq;
                let frame = format!("id: {seq}\ndata: {json}\n\n");
                if write_chunk(&mut stream, frame.as_bytes()).is_err() {
                    return;
                }
            }
        }
        std::thread::sleep(Duration::from_millis(100));
    }
}

fn write_chunk(stream: &mut TcpStream, data: &[u8]) -> std::io::Result<()> {
    stream.write_all(format!("{:x}\r\n", data.len()).as_bytes())?;
    stream.write_all(data)?;
    stream.write_all(b"\r\n")?;
    stream.flush()
}

/// Parse body `application/x-www-form-urlencoded` thành map.
fn parse_form(body: &[u8]) -> HashMap<String, String> {
    let mut map = HashMap::new();
    for pair in String::from_utf8_lossy(body).split('&') {
        if pair.is_empty() {
            continue;
        }
        let (k, v) = match pair.split_once('=') {
            Some((k, v)) => (k, v),
            None => (pair, ""),
        };
        map.insert(percent_decode(k), percent_decode(v));
    }
    map
}

/// Giải mã percent-encoding (`%XX` + `+` thành khoảng trắng).
/// `%` không hợp lệ được giữ nguyên thay vì lỗi.
fn percent_decode(s: &str) -> String {
    fn hex(b: u8) -> Option<u8> {
        match b {
            b'0'..=b'9' => Some(b - b'0'),
            b'a'..=b'f' => Some(b - b'a' + 10),
            b'A'..=b'F' => Some(b - b'A' + 10),
            _ => None,
        }
    }
    let bytes = s.as_bytes();
    let mut out = Vec::with_capacity(bytes.len());
    let mut i = 0;
    while i < bytes.len() {
        match bytes[i] {
            b'+' => {
                out.push(b' ');
                i += 1;
            }
            b'%' if i + 2 < bytes.len() => match (hex(bytes[i + 1]), hex(bytes[i + 2])) {
                (Some(h), Some(l)) => {
                    out.push((h << 4) | l);
                    i += 3;
                }
                _ => {
                    out.push(b'%');
                    i += 1;
                }
            },
            b => {
                out.push(b);
                i += 1;
            }
        }
    }
    String::from_utf8_lossy(&out).into_owned()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn form_and_percent_decode() {
        assert_eq!(percent_decode("D%3A%5Ccode%5Cproject"), "D:\\code\\project");
        assert_eq!(percent_decode("a+b%20c"), "a b c");
        assert_eq!(percent_decode("100%"), "100%");
        assert_eq!(percent_decode("%zz"), "%zz");
        assert_eq!(percent_decode("ti%E1%BA%BFng"), "tiếng");
        let form = parse_form(b"action=add&dir=C%3A%5Ca%20b&empty=");
        assert_eq!(form.get("action").unwrap(), "add");
        assert_eq!(form.get("dir").unwrap(), "C:\\a b");
        assert_eq!(form.get("empty").unwrap(), "");
        assert!(parse_form(b"").is_empty());
    }

    fn test_shared(port: u16) -> Shared {
        let (tx, _rx) = std::sync::mpsc::channel();
        let watcher = notify::RecommendedWatcher::new(tx, notify::Config::default()).unwrap();
        Shared::new(
            watcher,
            vec![],
            Filter {
                exts: vec![],
                ignores: vec![],
            },
            200,
            true,
            None,
            Identity {
                user: "t".to_string(),
                pc: "p".to_string(),
            },
            vec![],
            port,
        )
    }

    /// GET thô qua TcpStream, trả (status, body). None khi không nối được.
    fn http_get(port: u16, path: &str) -> Option<(u16, String)> {
        let mut stream = std::net::TcpStream::connect(("127.0.0.1", port)).ok()?;
        stream.set_read_timeout(Some(Duration::from_secs(2))).ok()?;
        let req = format!("GET {path} HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n");
        stream.write_all(req.as_bytes()).ok()?;
        let mut buf = String::new();
        stream.read_to_string(&mut buf).ok()?;
        let (head, body) = buf.split_once("\r\n\r\n")?;
        let status = head.split_whitespace().nth(1)?.parse().ok()?;
        Some((status, body.to_string()))
    }

    fn http_post_form(port: u16, path: &str, body: &str) -> Option<(u16, String)> {
        let mut stream = std::net::TcpStream::connect(("127.0.0.1", port)).ok()?;
        stream.set_read_timeout(Some(Duration::from_secs(2))).ok()?;
        let req = format!(
            "POST {path} HTTP/1.1\r\nHost: x\r\nContent-Type: application/x-www-form-urlencoded\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{body}",
            body.len()
        );
        stream.write_all(req.as_bytes()).ok()?;
        let mut buf = String::new();
        stream.read_to_string(&mut buf).ok()?;
        let (head, resp_body) = buf.split_once("\r\n\r\n")?;
        let status = head.split_whitespace().nth(1)?.parse().ok()?;
        Some((status, resp_body.to_string()))
    }

    fn free_port() -> u16 {
        let probe = TcpListener::bind(("127.0.0.1", 0)).unwrap();
        let p = probe.local_addr().unwrap().port();
        drop(probe);
        p
    }

    #[test]
    fn apply_settings_port_same_free_and_busy() {
        let shared = test_shared(8787);
        // Cùng cổng: Ok, không có listener chờ đổi.
        assert_eq!(
            shared
                .apply_settings(None, None, None, None, Some(8787))
                .unwrap(),
            8787
        );
        assert!(shared.take_pending_listener().is_none());
        // Cổng trống: Ok + có listener chờ, cổng hiện tại đã đổi.
        let free = free_port();
        assert_eq!(
            shared
                .apply_settings(None, None, None, None, Some(free))
                .unwrap(),
            free
        );
        assert_eq!(shared.port(), free);
        let (l, p) = shared.take_pending_listener().unwrap();
        assert_eq!(p, free);
        assert_eq!(l.local_addr().unwrap().port(), free);
        // Cổng bị chiếm: lỗi, cổng hiện tại giữ nguyên.
        let busy = TcpListener::bind(("127.0.0.1", 0)).unwrap();
        let busy_port = busy.local_addr().unwrap().port();
        let res = shared.apply_settings(None, None, None, None, Some(busy_port));
        assert!(res.is_err());
        assert_eq!(shared.port(), free);
        assert!(shared.take_pending_listener().is_none());
    }

    #[test]
    fn port_change_rebinds_live() {
        let port1 = free_port();
        let mut port2 = free_port();
        while port2 == port1 {
            port2 = free_port();
        }
        let shared = test_shared(port1);
        let listener = TcpListener::bind(("127.0.0.1", port1)).unwrap();
        let s2 = shared.clone();
        std::thread::spawn(move || {
            let _ = serve(listener, s2);
        });
        // Chờ server lên trên cổng đầu.
        let mut up = false;
        for _ in 0..50 {
            if let Some((200, body)) = http_get(port1, "/api/config") {
                assert!(body.contains(&format!("\"port\":{port1}")));
                up = true;
                break;
            }
            std::thread::sleep(Duration::from_millis(20));
        }
        assert!(up, "server khong len tren cong dau");
        // Đổi cổng qua API.
        let (status, body) = http_post_form(port1, "/api/config", &format!("port={port2}")).unwrap();
        assert_eq!(status, 200);
        assert!(body.contains(&format!("\"port\":{port2}")), "{body}");
        assert_eq!(shared.port(), port2);
        // Cổng mới phục vụ trong vòng ~2s; cổng cũ không còn nghe.
        let mut moved = false;
        for _ in 0..100 {
            if let Some((200, body)) = http_get(port2, "/api/config") {
                assert!(body.contains(&format!("\"port\":{port2}")));
                moved = true;
                break;
            }
            std::thread::sleep(Duration::from_millis(20));
        }
        assert!(moved, "server khong chuyen sang cong moi");
        assert!(http_get(port1, "/api/config").is_none(), "cong cu van nghe");
    }
}
