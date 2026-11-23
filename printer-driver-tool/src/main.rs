//! CLI: printer-driver-tool
//!
//! Liệt kê driver máy in đã cài trên Windows 11, xem chi tiết,
//! xuất JSON/CSV và sao lưu file driver. Tự parse tham số dòng lệnh
//! (không dùng crate parse CLI, theo triết lý nhẹ của file-watcher).

use printer_driver_tool::backup::{backup_driver, report_text};
use printer_driver_tool::format::{
    driver_detail, drivers_table, drivers_to_csv, drivers_to_json, printers_table, printers_to_csv,
    printers_to_json,
};
use printer_driver_tool::{
    find_drivers_by_name, install_driver, list_drivers, list_printers, parse_manifest,
    resolve_restore_files, DriverQuery,
};

const VERSION: &str = env!("CARGO_PKG_VERSION");

const HELP: &str = "printer-driver-tool — lấy driver máy in trên Windows 11

CÁCH DÙNG:
  printer-driver-tool [lệnh] [tùy chọn]

LỆNH:
  list                        Liệt kê driver đã cài (lệnh mặc định)
  show <tên driver>           Chi tiết 1 driver (kèm file + kích thước)
  printers                    Liệt kê máy in và driver mỗi máy đang dùng
  export                      Xuất danh sách driver (mặc định JSON)
  backup <tên driver> <thư mục>  Sao lưu toàn bộ file của 1 driver
                              (+ manifest driver-info.json)
  restore <thư mục backup>    Cài driver từ bản backup lên máy này
                              (cần quyền administrator)

TÙY CHỌN CHUNG:
  --force                     restore: cài đè khi driver đã tồn tại
  --server \\\\MAY             Máy chủ in từ xa (mặc định: máy này)
  --env \"Windows x64\"        Môi trường driver (mặc định: môi trường
                              hiện tại; các giá trị thường gặp:
                              \"Windows x64\", \"Windows NT x86\",
                              \"Windows ARM64\")
  --json, --csv               Định dạng xuất cho list / printers / export
  --out <file>                Ghi kết quả export ra file thay vì stdout
  -h, --help                  Hiện trợ giúp này
  -V, --version               Hiện phiên bản

VÍ DỤ:
  printer-driver-tool
  printer-driver-tool show \"Microsoft IPP Class Driver\"
  printer-driver-tool printers
  printer-driver-tool export --format csv --out drivers.csv
  printer-driver-tool backup \"HP LaserJet Pro\" D:\\driver-backup
  printer-driver-tool restore D:\\driver-backup
  printer-driver-tool list --server \\\\MAY-CHU-IN --json

GHI CHÚ:
  - Liệt kê không cần quyền admin. Sao lưu có thể cần chạy terminal
    với quyền administrator nếu file driver nằm trong thư mục hệ thống
    bị khóa đọc. Restore BẮT BUỘC chạy với quyền administrator
    (Windows yêu cầu quyền SeLoadDriverPrivilege để cài driver).
  - Driver v4 (Windows 11, IPP) thường dùng chung file hệ thống nên
    bản sao lưu có thể gồm file dùng chung, không chỉ file riêng.
  - Restore chỉ cài driver, chưa tạo máy in — muốn in được còn phải
    thêm máy in và cổng (bằng tay hoặc lệnh Add-Printer của PowerShell).
  - Backup từ máy x64 thì restore lên máy x64. Driver v4/inbox như
    Microsoft IPP Class Driver thì khỏi restore, máy Win 11 nào cũng có.
";

/// Định dạng xuất.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum OutputFormat {
    Table,
    Json,
    Csv,
}

/// Tham số đã parse.
#[derive(Debug, Default)]
struct Args {
    command: Option<String>,
    positionals: Vec<String>,
    server: Option<String>,
    env: Option<String>,
    format: Option<OutputFormat>,
    out: Option<String>,
    force: bool,
    help: bool,
    version: bool,
}

/// Parse tham số dòng lệnh. Trả Err(String) với thông báo lỗi khi
/// cú pháp sai (main in ra stderr + gợi ý --help, exit 2).
fn parse_args(argv: &[String]) -> Result<Args, String> {
    let mut args = Args::default();
    let mut i = 0;
    while i < argv.len() {
        let a = &argv[i];
        match a.as_str() {
            "-h" | "--help" => args.help = true,
            "-V" | "--version" => args.version = true,
            "--force" => args.force = true,
            "--json" => args.format = Some(OutputFormat::Json),
            "--csv" => args.format = Some(OutputFormat::Csv),
            "--server" | "--env" | "--out" | "--format" => {
                i += 1;
                let v = argv
                    .get(i)
                    .ok_or_else(|| format!("Thiếu giá trị sau {a}"))?;
                match a.as_str() {
                    "--server" => args.server = Some(v.clone()),
                    "--env" => args.env = Some(v.clone()),
                    "--out" => args.out = Some(v.clone()),
                    "--format" => {
                        args.format = Some(match v.to_lowercase().as_str() {
                            "json" => OutputFormat::Json,
                            "csv" => OutputFormat::Csv,
                            "table" => OutputFormat::Table,
                            other => {
                                return Err(format!(
                                    "Định dạng không hỗ trợ: {other} (chọn json, csv hoặc table)"
                                ))
                            }
                        });
                    }
                    _ => unreachable!(),
                }
            }
            _ if a.starts_with("--server=") => {
                args.server = Some(a["--server=".len()..].to_string());
            }
            _ if a.starts_with("--env=") => {
                args.env = Some(a["--env=".len()..].to_string());
            }
            _ if a.starts_with("--out=") => {
                args.out = Some(a["--out=".len()..].to_string());
            }
            _ if a.starts_with("--format=") => {
                let v = a["--format=".len()..].to_lowercase();
                args.format = Some(match v.as_str() {
                    "json" => OutputFormat::Json,
                    "csv" => OutputFormat::Csv,
                    "table" => OutputFormat::Table,
                    _ => {
                        return Err(format!(
                            "Định dạng không hỗ trợ: {v} (chọn json, csv hoặc table)"
                        ))
                    }
                });
            }
            _ if a.starts_with('-') => {
                return Err(format!("Tùy chọn không rõ: {a}"));
            }
            _ => {
                if args.command.is_none() {
                    args.command = Some(a.clone());
                } else {
                    args.positionals.push(a.clone());
                }
            }
        }
        i += 1;
    }
    Ok(args)
}

/// Trên Windows: chuyển console sang UTF-8 để tiếng Việt không bị
/// lỗi font trên cmd/PowerShell cũ. Lỗi (nếu có) được bỏ qua.
#[cfg(windows)]
fn set_utf8_console() {
    use windows::Win32::System::Console::{SetConsoleCP, SetConsoleOutputCP};
    unsafe {
        let _ = SetConsoleOutputCP(65001);
        let _ = SetConsoleCP(65001);
    }
}

#[cfg(not(windows))]
fn set_utf8_console() {}

fn query_from(args: &Args) -> DriverQuery {
    DriverQuery {
        server: args.server.clone(),
        environment: args.env.clone(),
    }
}

/// Ghi text ra stdout hoặc file (--out). Trả Err khi ghi file lỗi.
fn emit(text: &str, out: &Option<String>) -> Result<(), String> {
    match out {
        Some(path) => {
            std::fs::write(path, text).map_err(|e| format!("Không ghi được file {path}: {e}"))
        }
        None => {
            print!("{text}");
            Ok(())
        }
    }
}

fn cmd_list(args: &Args) -> Result<(), String> {
    let drivers = list_drivers(&query_from(args))?;
    if drivers.is_empty() {
        eprintln!("Không tìm thấy driver máy in nào.");
        return Ok(());
    }
    let text = match args.format.unwrap_or(OutputFormat::Table) {
        OutputFormat::Table => drivers_table(&drivers),
        OutputFormat::Json => drivers_to_json(&drivers),
        OutputFormat::Csv => drivers_to_csv(&drivers),
    };
    emit(&text, &args.out)?;
    if args.out.is_none() && args.format.unwrap_or(OutputFormat::Table) == OutputFormat::Table {
        eprintln!("\nTổng: {} driver.", drivers.len());
    }
    Ok(())
}

fn cmd_show(args: &Args) -> Result<(), String> {
    let name = args
        .positionals
        .first()
        .ok_or("Thiếu tên driver. Ví dụ: show \"Microsoft IPP Class Driver\"")?;
    let drivers = list_drivers(&query_from(args))?;
    let found = find_drivers_by_name(&drivers, name);
    if found.is_empty() {
        let mut msg = format!("Không tìm thấy driver \"{name}\".\nDriver đã cài:\n");
        for d in &drivers {
            msg.push_str(&format!("  - {} ({})\n", d.name, d.environment));
        }
        return Err(msg);
    }
    let mut out = String::new();
    for (i, d) in found.iter().enumerate() {
        if i > 0 {
            out.push('\n');
        }
        out.push_str(&driver_detail(d, |p| {
            std::fs::metadata(p).ok().map(|m| m.len())
        }));
    }
    emit(&out, &args.out)
}

fn cmd_printers(args: &Args) -> Result<(), String> {
    let printers = list_printers(args.server.as_deref())?;
    if printers.is_empty() {
        eprintln!("Không tìm thấy máy in nào.");
        return Ok(());
    }
    let text = match args.format.unwrap_or(OutputFormat::Table) {
        OutputFormat::Table => printers_table(&printers),
        OutputFormat::Json => printers_to_json(&printers),
        OutputFormat::Csv => printers_to_csv(&printers),
    };
    emit(&text, &args.out)?;
    if args.out.is_none() && args.format.unwrap_or(OutputFormat::Table) == OutputFormat::Table {
        eprintln!("\nTổng: {} máy in.", printers.len());
    }
    Ok(())
}

fn cmd_export(args: &Args) -> Result<(), String> {
    // export mặc định JSON; list mặc định bảng.
    let fmt = args.format.unwrap_or(OutputFormat::Json);
    let drivers = list_drivers(&query_from(args))?;
    let text = match fmt {
        OutputFormat::Table => drivers_table(&drivers),
        OutputFormat::Json => drivers_to_json(&drivers),
        OutputFormat::Csv => drivers_to_csv(&drivers),
    };
    emit(&text, &args.out)?;
    if let Some(path) = &args.out {
        eprintln!("Đã xuất {} driver ra {path}.", drivers.len());
    }
    Ok(())
}

fn cmd_backup(args: &Args) -> Result<(), String> {
    let name = args
        .positionals
        .first()
        .ok_or("Thiếu tên driver. Ví dụ: backup \"HP LaserJet Pro\" D:\\driver-backup")?;
    let dest = args
        .positionals
        .get(1)
        .ok_or("Thiếu thư mục đích. Ví dụ: backup \"HP LaserJet Pro\" D:\\driver-backup")?;
    let drivers = list_drivers(&query_from(args))?;
    let found = find_drivers_by_name(&drivers, name);
    if found.is_empty() {
        return Err(format!(
            "Không tìm thấy driver \"{name}\". Chạy `list` để xem driver đã cài."
        ));
    }
    if found.len() > 1 {
        let mut msg = format!(
            "Có {} driver trùng tên \"{name}\", thêm --env để chọn 1:\n",
            found.len()
        );
        for d in found {
            msg.push_str(&format!("  - {} ({})\n", d.name, d.environment));
        }
        return Err(msg);
    }
    let report = backup_driver(found[0], std::path::Path::new(dest))?;
    print!("{}", report_text(&report));
    Ok(())
}

fn cmd_restore(args: &Args) -> Result<(), String> {
    let dir = args
        .positionals
        .first()
        .ok_or("Thiếu thư mục backup. Ví dụ: restore D:\\driver-backup")?;
    let dir_path = std::path::Path::new(dir);
    let manifest_path = dir_path.join("driver-info.json");
    let text = std::fs::read_to_string(&manifest_path).map_err(|e| {
        if e.kind() == std::io::ErrorKind::NotFound {
            format!(
                "Không thấy driver-info.json trong {dir} — đây có phải thư mục backup của printer-driver-tool không?"
            )
        } else {
            format!("Không đọc được {}: {e}", manifest_path.display())
        }
    })?;
    let (driver, file_map) = parse_manifest(&text)?;
    let files = resolve_restore_files(&driver, &file_map, dir_path)?;

    // Driver đã tồn tại thì từ chối, trừ khi có --force.
    let query = DriverQuery {
        server: args.server.clone(),
        environment: None,
    };
    let existing = list_drivers(&query)?;
    let already = existing.iter().any(|d| {
        d.name.eq_ignore_ascii_case(&driver.name)
            && (driver.environment.is_empty() || d.environment == driver.environment)
    });
    if already && !args.force {
        return Err(format!(
            "Driver \"{}\" đã được cài sẵn{}. Dùng --force để cài đè.",
            driver.name,
            if driver.environment.is_empty() {
                String::new()
            } else {
                format!(" (môi trường {})", driver.environment)
            }
        ));
    }

    eprintln!(
        "Đang cài driver \"{}\" (môi trường {}, kiểu {}, {} file)...",
        driver.name,
        if driver.environment.is_empty() {
            "mặc định"
        } else {
            &driver.environment
        },
        driver.model(),
        files.count(),
    );
    install_driver(&driver, &files, args.server.as_deref())?;

    // Kiểm chứng: liệt kê lại, driver phải xuất hiện.
    let after = list_drivers(&query)?;
    let found = after.iter().any(|d| {
        d.name.eq_ignore_ascii_case(&driver.name)
            && (driver.environment.is_empty() || d.environment == driver.environment)
    });
    if found {
        println!(
            "Đã cài xong driver \"{}\" ({} file). Chạy `list` để xem, rồi thêm máy in để dùng.",
            driver.name,
            files.count()
        );
        Ok(())
    } else {
        Err(format!(
            "AddPrinterDriverEx báo thành công nhưng không thấy driver \"{}\" khi liệt kê lại. Thử chạy `list` để kiểm tra.",
            driver.name
        ))
    }
}

fn run(argv: &[String]) -> Result<(), String> {
    let args = parse_args(argv)?;
    if args.help {
        print!("{HELP}");
        return Ok(());
    }
    if args.version {
        println!("printer-driver-tool {VERSION}");
        return Ok(());
    }
    match args.command.as_deref().unwrap_or("list") {
        "list" => cmd_list(&args),
        "show" => cmd_show(&args),
        "printers" => cmd_printers(&args),
        "export" => cmd_export(&args),
        "backup" => cmd_backup(&args),
        "restore" => cmd_restore(&args),
        other => Err(format!(
            "Lệnh không rõ: {other}\nChạy `printer-driver-tool --help` để xem các lệnh."
        )),
    }
}

fn main() {
    set_utf8_console();
    let argv: Vec<String> = std::env::args().skip(1).collect();
    match run(&argv) {
        Ok(()) => {}
        Err(msg) => {
            // Lỗi cú pháp (parse) -> exit 2; lỗi chạy -> exit 1.
            let usage_error = msg.starts_with("Thiếu giá trị")
                || msg.starts_with("Tùy chọn không rõ")
                || msg.starts_with("Định dạng không hỗ trợ")
                || msg.starts_with("Lệnh không rõ")
                || msg.starts_with("Thiếu tên driver")
                || msg.starts_with("Thiếu thư mục đích")
                || msg.starts_with("Thiếu thư mục backup");
            eprintln!("Lỗi: {msg}");
            std::process::exit(if usage_error { 2 } else { 1 });
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn argv(s: &[&str]) -> Vec<String> {
        s.iter().map(|v| v.to_string()).collect()
    }

    #[test]
    fn parse_defaults() {
        let a = parse_args(&argv(&[])).unwrap();
        assert!(a.command.is_none());
        assert!(a.format.is_none());
    }

    #[test]
    fn parse_command_and_positionals() {
        let a = parse_args(&argv(&["backup", "HP", "D:\\bk"])).unwrap();
        assert_eq!(a.command.as_deref(), Some("backup"));
        assert_eq!(a.positionals, vec!["HP", "D:\\bk"]);
    }

    #[test]
    fn parse_flags_both_forms() {
        let a = parse_args(&argv(&[
            "list",
            "--server",
            "\\\\MAY",
            "--env=x64",
            "--json",
        ]))
        .unwrap();
        assert_eq!(a.server.as_deref(), Some("\\\\MAY"));
        assert_eq!(a.env.as_deref(), Some("x64"));
        assert_eq!(a.format, Some(OutputFormat::Json));
        let a = parse_args(&argv(&["export", "--format", "csv", "--out", "d.csv"])).unwrap();
        assert_eq!(a.format, Some(OutputFormat::Csv));
        assert_eq!(a.out.as_deref(), Some("d.csv"));
    }

    #[test]
    fn parse_rejects_unknown() {
        assert!(parse_args(&argv(&["--bogus"])).is_err());
        assert!(parse_args(&argv(&["--server"])).is_err());
        assert!(parse_args(&argv(&["--format", "xml"])).is_err());
    }

    #[test]
    fn run_rejects_unknown_command() {
        let err = run(&argv(&["delete"])).unwrap_err();
        assert!(err.contains("Lệnh không rõ"));
    }

    #[test]
    fn parse_restore_with_force() {
        let a = parse_args(&argv(&["restore", "D:\\bk", "--force"])).unwrap();
        assert_eq!(a.command.as_deref(), Some("restore"));
        assert!(a.force);
        assert_eq!(a.positionals, vec!["D:\\bk"]);
    }

    #[test]
    fn run_restore_requires_dir() {
        let err = run(&argv(&["restore"])).unwrap_err();
        assert!(err.contains("Thiếu thư mục backup"));
    }
}
