//! Thư viện lõi của printer-driver-tool.
//!
//! Phần thuần (không gọi Win32) nằm ở đây để chạy test được trên mọi hệ
//! điều hành. Phần gọi Print Spooler nằm trong module `win` (chỉ biên
//! dịch trên Windows); ngoài Windows, các hàm liệt kê trả lỗi rõ ràng.

pub mod backup;
pub mod format;
#[cfg(windows)]
pub mod win;

// ---------------------------------------------------------------------------
// Mô hình dữ liệu
// ---------------------------------------------------------------------------

/// Một driver máy in đã cài, lấy từ DRIVER_INFO_6 của Win32.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct PrinterDriver {
    /// Tên driver, ví dụ "Microsoft IPP Class Driver".
    pub name: String,
    /// Môi trường, ví dụ "Windows x64".
    pub environment: String,
    /// cVersion: 3 = driver v3, 4 = driver v4.
    pub version: u32,
    /// Đường dẫn đầy đủ tới file driver chính (.dll).
    pub driver_path: String,
    /// File dữ liệu (.inf / .gpd / .ppd...).
    pub data_file: String,
    /// File cấu hình (.dll UI).
    pub config_file: String,
    /// File trợ giúp (.hlp), thường rỗng.
    pub help_file: String,
    /// Các file phụ thuộc (multi-sz trong DRIVER_INFO_6).
    pub dependent_files: Vec<String>,
    /// Tên language monitor / port monitor.
    pub monitor_name: String,
    /// Kiểu dữ liệu mặc định, ví dụ "RAW".
    pub default_data_type: String,
    /// Tên cũ của driver (khi driver được đổi tên).
    pub previous_names: Vec<String>,
    /// Ngày driver (FILETIME), dạng "dd-mm-yyyy". None khi driver
    /// không khai báo ngày (FILETIME = 0).
    pub driver_date: Option<String>,
    /// Phiên bản driver dạng "a.b.c.d" (từ dwlDriverVersion).
    /// Chuỗi rỗng khi driver không khai báo.
    pub driver_version: String,
    /// Hãng sản xuất.
    pub manufacturer: String,
    /// URL của hãng.
    pub oem_url: String,
}

impl PrinterDriver {
    /// Kiểu driver theo cVersion: "v3", "v4", hoặc "?" khi lạ.
    pub fn model(&self) -> &'static str {
        match self.version {
            3 => "v3",
            4 => "v4",
            _ => "?",
        }
    }

    /// Toàn bộ file thuộc về driver này, đã bỏ chuỗi rỗng và trùng lặp:
    /// file chính + data + config + help + các file phụ thuộc.
    pub fn all_files(&self) -> Vec<String> {
        let mut out: Vec<String> = Vec::new();
        for f in std::iter::once(&self.driver_path)
            .chain(std::iter::once(&self.data_file))
            .chain(std::iter::once(&self.config_file))
            .chain(std::iter::once(&self.help_file))
            .chain(self.dependent_files.iter())
        {
            if !f.is_empty() && !out.contains(f) {
                out.push(f.clone());
            }
        }
        out
    }
}

/// Một máy in (local hoặc đã kết nối), lấy từ PRINTER_INFO_2.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct PrinterInfo {
    pub name: String,
    pub driver_name: String,
    pub port_name: String,
    pub share_name: String,
    pub location: String,
    pub comment: String,
    /// Trạng thái máy in (PRINTER_STATUS_*). 0 = sẵn sàng.
    pub status: u32,
    /// Số việc in đang chờ.
    pub jobs: u32,
}

/// Điều kiện truy vấn driver.
#[derive(Debug, Clone, Default)]
pub struct DriverQuery {
    /// Máy chủ in từ xa, dạng "MAY" hoặc "\\\\MAY". None = máy này.
    pub server: Option<String>,
    /// Môi trường driver, ví dụ "Windows x64". None = môi trường hiện tại.
    pub environment: Option<String>,
}

impl DriverQuery {
    /// Tên máy chủ đã chuẩn hóa dạng UNC ("\\\\MAY"), hoặc None.
    pub fn normalized_server(&self) -> Option<String> {
        self.server.as_deref().and_then(normalize_server)
    }
}

// ---------------------------------------------------------------------------
// Truy vấn spooler (Windows thật / stub ngoài Windows)
// ---------------------------------------------------------------------------

/// Liệt kê driver đã cài trên máy local hoặc máy chủ từ xa.
#[cfg(windows)]
pub fn list_drivers(query: &DriverQuery) -> Result<Vec<PrinterDriver>, String> {
    win::list_drivers(query)
}

/// Ngoài Windows: tool này chỉ chạy trên Windows nên trả lỗi rõ ràng.
#[cfg(not(windows))]
pub fn list_drivers(_query: &DriverQuery) -> Result<Vec<PrinterDriver>, String> {
    Err("Tool này chỉ chạy trên Windows (cần Print Spooler API).".to_string())
}

/// Liệt kê máy in (local + đã kết nối) và driver mỗi máy đang dùng.
#[cfg(windows)]
pub fn list_printers(server: Option<&str>) -> Result<Vec<PrinterInfo>, String> {
    win::list_printers(server)
}

/// Ngoài Windows: trả lỗi rõ ràng.
#[cfg(not(windows))]
pub fn list_printers(_server: Option<&str>) -> Result<Vec<PrinterInfo>, String> {
    Err("Tool này chỉ chạy trên Windows (cần Print Spooler API).".to_string())
}

// ---------------------------------------------------------------------------
// Hàm thuần (test được trên mọi hệ điều hành)
// ---------------------------------------------------------------------------

/// Chuẩn hóa tên máy chủ thành UNC: "MAY" -> "\\\\MAY".
/// Chuỗi rỗng / toàn khoảng trắng -> None.
pub fn normalize_server(name: &str) -> Option<String> {
    let name = name.trim();
    if name.is_empty() {
        return None;
    }
    if let Some(stripped) = name.strip_prefix("\\\\") {
        if stripped.is_empty() {
            None
        } else {
            Some(name.to_string())
        }
    } else {
        Some(format!("\\\\{name}"))
    }
}

/// Đổi FILETIME (số tick 100ns từ 01-01-1601, giờ UTC) thành ngày
/// "dd-mm-yyyy". Trả None khi tick = 0 (driver không khai báo ngày)
/// hoặc khi giá trị nằm trước 01-01-1970.
pub fn format_filetime(ticks: u64) -> Option<String> {
    const TICKS_PER_SECOND: u64 = 10_000_000;
    const EPOCH_DIFF_SECONDS: u64 = 11_644_473_600; // 1601 -> 1970
    if ticks == 0 {
        return None;
    }
    let unix_seconds = ticks / TICKS_PER_SECOND;
    if unix_seconds < EPOCH_DIFF_SECONDS {
        return None;
    }
    let days = ((unix_seconds - EPOCH_DIFF_SECONDS) / 86_400) as i64;
    let (y, m, d) = civil_from_days(days);
    Some(format!("{d:02}-{m:02}-{y:04}"))
}

/// Đổi số ngày kể từ 01-01-1970 thành (năm, tháng, ngày).
/// Thuật toán civil-from-days của Howard Hinnant.
fn civil_from_days(z: i64) -> (i64, u32, u32) {
    let z = z + 719_468;
    let era = if z >= 0 { z } else { z - 146_096 } / 146_097;
    let doe = (z - era * 146_097) as u64; // [0, 146096]
    let yoe = (doe - doe / 1460 + doe / 36_524 - doe / 146_096) / 365; // [0, 399]
    let y = yoe as i64 + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100); // [0, 365]
    let mp = (5 * doy + 2) / 153; // [0, 11]
    let d = (doy - (153 * mp + 2) / 5 + 1) as u32; // [1, 31]
    let m = if mp < 10 { mp + 3 } else { mp - 9 } as u32; // [1, 12]
    (if m <= 2 { y + 1 } else { y }, m, d)
}

/// Đổi dwlDriverVersion (4 số 16-bit đóng gói) thành "a.b.c.d".
/// Trả chuỗi rỗng khi version = 0 (driver không khai báo).
pub fn format_driver_version(v: u64) -> String {
    if v == 0 {
        return String::new();
    }
    format!(
        "{}.{}.{}.{}",
        (v >> 48) & 0xFFFF,
        (v >> 32) & 0xFFFF,
        (v >> 16) & 0xFFFF,
        v & 0xFFFF
    )
}

/// Phân tích chuỗi multi-sz (danh sách chuỗi kết thúc bằng \0,
/// toàn bộ danh sách kết thúc bằng \0\0) thành Vec<String>.
/// Chuỗi rỗng ở giữa được bỏ; gặp \0\0 thì dừng.
pub fn parse_multi_sz(units: &[u16]) -> Vec<String> {
    let mut out = Vec::new();
    let mut cur: Vec<u16> = Vec::new();
    for &u in units {
        if u == 0 {
            if cur.is_empty() {
                break; // \0\0: hết danh sách
            }
            out.push(String::from_utf16_lossy(&cur));
            cur.clear();
        } else {
            cur.push(u);
        }
    }
    if !cur.is_empty() {
        // Không có \0 kết thúc (chuỗi bị cắt): vẫn lấy phần còn lại.
        out.push(String::from_utf16_lossy(&cur));
    }
    out
}

/// Kiểm tra đường dẫn tuyệt đối kiểu Windows: "C:\...", "C:/...",
/// hoặc UNC "\\\\MAY\...". Cần kiểm tra tay vì trên Linux,
/// `Path::is_absolute` không hiểu "C:\...".
pub fn is_windows_absolute(path: &str) -> bool {
    let b = path.as_bytes();
    if path.starts_with("\\\\") {
        return true;
    }
    b.len() >= 3 && b[0].is_ascii_alphabetic() && b[1] == b':' && (b[2] == b'\\' || b[2] == b'/')
}

/// Giải quyết đường dẫn file driver: tuyệt đối thì giữ nguyên,
/// tương đối (thường chỉ là tên file) thì ghép với thư mục driver.
pub fn resolve_driver_file(path: &str, driver_dir: &std::path::Path) -> std::path::PathBuf {
    let p = std::path::Path::new(path);
    if p.is_absolute() || is_windows_absolute(path) {
        p.to_path_buf()
    } else {
        driver_dir.join(path)
    }
}

/// Tìm driver theo tên, khớp chính xác không phân biệt hoa/thường.
/// Trả toàn bộ driver trùng tên (cùng tên có thể tồn tại ở nhiều
/// môi trường khác nhau, ví dụ "Windows x64" và "Windows NT x86").
pub fn find_drivers_by_name<'a>(
    drivers: &'a [PrinterDriver],
    name: &str,
) -> Vec<&'a PrinterDriver> {
    drivers
        .iter()
        .filter(|d| d.name.eq_ignore_ascii_case(name))
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sample_driver() -> PrinterDriver {
        PrinterDriver {
            name: "Microsoft IPP Class Driver".to_string(),
            environment: "Windows x64".to_string(),
            version: 4,
            driver_path: "C:\\Windows\\System32\\spool\\drivers\\x64\\3\\ippdriver.dll".to_string(),
            data_file: "C:\\Windows\\System32\\spool\\drivers\\x64\\3\\ippdriver.inf".to_string(),
            config_file: String::new(),
            help_file: String::new(),
            dependent_files: vec![
                "mscms.dll".to_string(),
                "C:\\Windows\\System32\\spool\\drivers\\x64\\3\\ippdriver.dll".to_string(),
            ],
            monitor_name: String::new(),
            default_data_type: "RAW".to_string(),
            previous_names: vec![],
            driver_date: Some("15-01-2024".to_string()),
            driver_version: "10.0.19041.1".to_string(),
            manufacturer: "Microsoft".to_string(),
            oem_url: String::new(),
        }
    }

    #[test]
    fn model_names() {
        let mut d = sample_driver();
        assert_eq!(d.model(), "v4");
        d.version = 3;
        assert_eq!(d.model(), "v3");
        d.version = 99;
        assert_eq!(d.model(), "?");
    }

    #[test]
    fn all_files_dedups_and_skips_empty() {
        let files = sample_driver().all_files();
        assert_eq!(files.len(), 3); // driver_path, data_file, mscms.dll
        assert!(files.contains(&"mscms.dll".to_string()));
        assert!(!files.iter().any(|f| f.is_empty()));
    }

    #[test]
    fn normalize_server_cases() {
        assert_eq!(normalize_server(""), None);
        assert_eq!(normalize_server("   "), None);
        assert_eq!(normalize_server("MAY-IN"), Some("\\\\MAY-IN".to_string()));
        assert_eq!(
            normalize_server("\\\\MAY-IN"),
            Some("\\\\MAY-IN".to_string())
        );
        assert_eq!(
            normalize_server("  MAY-IN  "),
            Some("\\\\MAY-IN".to_string())
        );
        assert_eq!(normalize_server("\\\\"), None);
    }

    #[test]
    fn filetime_conversion() {
        assert_eq!(format_filetime(0), None);
        // 15-01-2024 00:00 UTC = unix 1705276800.
        let ticks = (1705276800u64 + 11_644_473_600) * 10_000_000;
        assert_eq!(format_filetime(ticks), Some("15-01-2024".to_string()));
        // 29-02-2024 (năm nhuận).
        let ticks = (1709164800u64 + 11_644_473_600) * 10_000_000;
        assert_eq!(format_filetime(ticks), Some("29-02-2024".to_string()));
        // Trước 1970 -> None.
        assert_eq!(format_filetime(10_000_000), None);
    }

    #[test]
    fn driver_version_format() {
        assert_eq!(format_driver_version(0), "");
        let v = (10u64 << 48) | (0u64 << 32) | (19041u64 << 16) | 1;
        assert_eq!(format_driver_version(v), "10.0.19041.1");
    }

    #[test]
    fn multi_sz_parsing() {
        let units: Vec<u16> = "a.dll\0b.dll\0\0".encode_utf16().collect();
        assert_eq!(parse_multi_sz(&units), vec!["a.dll", "b.dll"]);
        // Rỗng hoàn toàn (\0\0).
        assert!(parse_multi_sz(&[0, 0]).is_empty());
        // Không có \0\0 cuối: vẫn lấy phần còn lại.
        let units: Vec<u16> = "x.dll\0".encode_utf16().collect();
        assert_eq!(parse_multi_sz(&units), vec!["x.dll"]);
        // Chuỗi rỗng ở giữa được bỏ.
        let units: Vec<u16> = "a\0\0b\0\0".encode_utf16().collect();
        assert_eq!(parse_multi_sz(&units), vec!["a"]);
    }

    #[test]
    fn windows_absolute_detection() {
        assert!(is_windows_absolute("C:\\Windows\\System32\\x.dll"));
        assert!(is_windows_absolute("D:/data/x.dll"));
        assert!(is_windows_absolute("\\\\MAY\\share\\x.dll"));
        assert!(!is_windows_absolute("mscms.dll"));
        assert!(!is_windows_absolute("sub\\x.dll"));
        assert!(!is_windows_absolute(""));
    }

    #[test]
    fn resolve_relative_joins_driver_dir() {
        let dir = std::path::Path::new("C:\\Windows\\System32\\spool\\drivers\\x64\\3");
        let abs = resolve_driver_file("C:\\Windows\\x.dll", dir);
        assert_eq!(abs, std::path::PathBuf::from("C:\\Windows\\x.dll"));
        let rel = resolve_driver_file("mscms.dll", dir);
        assert_eq!(
            rel,
            dir.join("mscms.dll"),
            "file tương đối phải ghép với thư mục driver"
        );
    }

    #[test]
    fn find_by_name_case_insensitive() {
        let drivers = vec![sample_driver()];
        assert_eq!(
            find_drivers_by_name(&drivers, "microsoft ipp class driver").len(),
            1
        );
        assert!(find_drivers_by_name(&drivers, "khong co").is_empty());
    }
}
