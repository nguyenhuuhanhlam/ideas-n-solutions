//! Thư viện lõi của printer-driver-tool.
//!
//! Phần thuần (không gọi Win32) nằm ở đây để chạy test được trên mọi hệ
//! điều hành. Phần gọi Print Spooler nằm trong module `win` (chỉ biên
//! dịch trên Windows); ngoài Windows, các hàm liệt kê trả lỗi rõ ràng.

pub mod backup;
pub mod format;
pub mod json;
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

/// Cài driver lên máy local (hoặc máy chủ từ xa) từ bộ file đã giải
/// quyết trong thư mục backup. Cần quyền administrator.
#[cfg(windows)]
pub fn install_driver(
    driver: &PrinterDriver,
    files: &ResolvedDriverFiles,
    server: Option<&str>,
) -> Result<(), String> {
    win::install_driver(driver, files, server)
}

/// Ngoài Windows: trả lỗi rõ ràng.
#[cfg(not(windows))]
pub fn install_driver(
    _driver: &PrinterDriver,
    _files: &ResolvedDriverFiles,
    _server: Option<&str>,
) -> Result<(), String> {
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

/// Tên file (phần sau dấu \ hoặc / cuối cùng). Dùng riêng thay cho
/// `Path::file_name` vì trên Linux, `Path` không hiểu dấu \ của
/// đường dẫn Windows trong manifest.
pub fn windows_file_name(path: &str) -> &str {
    match path.rfind(|c| c == '/' || c == '\\') {
        Some(i) => &path[i + 1..],
        None => path,
    }
}

/// Đổi ngày "dd-mm-yyyy" ngược lại thành FILETIME ticks (100ns từ
/// 01-01-1601, giờ UTC). Trả None khi sai định dạng hoặc ngày không
/// có thật (vd 31-02-2024) — dùng khi dựng lại DRIVER_INFO_6 để restore.
pub fn parse_driver_date(s: &str) -> Option<u64> {
    let mut parts = s.split('-');
    let d: u32 = parts.next()?.parse().ok()?;
    let m: u32 = parts.next()?.parse().ok()?;
    let y: i64 = parts.next()?.parse().ok()?;
    if parts.next().is_some() {
        return None;
    }
    if !(1970..=2100).contains(&y) || !(1..=12).contains(&m) {
        return None;
    }
    if d < 1 || d > days_in_month(y, m) {
        return None;
    }
    let days = days_from_civil(y, m, d);
    let unix_seconds = days * 86_400;
    Some(((unix_seconds + 11_644_473_600) as u64) * 10_000_000)
}

/// Số ngày trong tháng, tính cả năm nhuận.
fn days_in_month(y: i64, m: u32) -> u32 {
    match m {
        1 | 3 | 5 | 7 | 8 | 10 | 12 => 31,
        4 | 6 | 9 | 11 => 30,
        2 => {
            if (y % 4 == 0 && y % 100 != 0) || y % 400 == 0 {
                29
            } else {
                28
            }
        }
        _ => 0,
    }
}

/// Đổi (năm, tháng, ngày) thành số ngày kể từ 01-01-1970.
/// Thuật toán days-from-civil của Howard Hinnant (ngược của civil_from_days).
fn days_from_civil(y: i64, m: u32, d: u32) -> i64 {
    let y = if m <= 2 { y - 1 } else { y };
    let era = if y >= 0 { y } else { y - 399 } / 400;
    let yoe = y - era * 400; // [0, 399]
    let mp = if m > 2 { m - 3 } else { m + 9 } as i64; // [0, 11]
    let doy = (153 * mp + 2) / 5 + d as i64 - 1; // [0, 365]
    let doe = yoe * 365 + yoe / 4 - yoe / 100 + doy; // [0, 146096]
    era * 146_097 + doe - 719_468
}

/// Đổi phiên bản "a.b.c.d" ngược lại thành u64 đóng gói (mỗi phần 16 bit).
/// Trả 0 khi chuỗi rỗng hoặc sai định dạng — 0 nghĩa là "không rõ phiên bản".
pub fn parse_driver_version(s: &str) -> u64 {
    if s.is_empty() {
        return 0;
    }
    let mut parts = [0u64; 4];
    for (i, p) in s.split('.').enumerate() {
        if i >= 4 {
            return 0;
        }
        match p.parse::<u64>() {
            Ok(v) if v <= 0xFFFF => parts[i] = v,
            _ => return 0,
        }
    }
    (parts[0] << 48) | (parts[1] << 32) | (parts[2] << 16) | parts[3]
}

// ---------------------------------------------------------------------------
// Đọc manifest backup (lệnh restore)
// ---------------------------------------------------------------------------

fn manifest_str(v: &json::JsonValue, key: &str) -> String {
    v.get(key)
        .and_then(|f| f.as_str())
        .unwrap_or("")
        .to_string()
}

fn manifest_req_str(v: &json::JsonValue, key: &str) -> Result<String, String> {
    match v.get(key).and_then(|f| f.as_str()) {
        Some(s) if !s.is_empty() => Ok(s.to_string()),
        _ => Err(format!("manifest thiếu trường bắt buộc: {key}")),
    }
}

fn manifest_str_array(v: &json::JsonValue, key: &str) -> Vec<String> {
    v.get(key)
        .and_then(|f| f.as_array())
        .map(|items| {
            items
                .iter()
                .filter_map(|i| i.as_str().map(|s| s.to_string()))
                .collect()
        })
        .unwrap_or_default()
}

/// Đọc manifest `driver-info.json` thành (driver, file map).
/// File map là danh sách (đường dẫn gốc, tên file trong thư mục backup),
/// chỉ có ở manifest v2 (từ bản 0.2.0). Manifest v1 (bản 0.1.0, không có
/// trường "files") vẫn đọc được, file map rỗng — restore sẽ tìm file
/// theo tên (xem `find_backup_file`).
pub fn parse_manifest(text: &str) -> Result<(PrinterDriver, Vec<(String, String)>), String> {
    let v = json::parse(text).map_err(|e| format!("manifest không phải JSON hợp lệ: {e}"))?;
    if !matches!(v, json::JsonValue::Object(_)) {
        return Err("manifest phải là 1 JSON object".to_string());
    }
    let version = v
        .get("version")
        .and_then(|f| f.as_u64())
        .ok_or("manifest thiếu trường bắt buộc: version")? as u32;
    let driver_date = match v.get("driver_date") {
        Some(f) if f.is_null() => None,
        Some(f) => f.as_str().map(|s| s.to_string()),
        None => None,
    };
    let driver = PrinterDriver {
        name: manifest_req_str(&v, "name")?,
        environment: manifest_str(&v, "environment"),
        version,
        driver_path: manifest_str(&v, "driver_path"),
        data_file: manifest_str(&v, "data_file"),
        config_file: manifest_str(&v, "config_file"),
        help_file: manifest_str(&v, "help_file"),
        dependent_files: manifest_str_array(&v, "dependent_files"),
        monitor_name: manifest_str(&v, "monitor_name"),
        default_data_type: manifest_str(&v, "default_data_type"),
        previous_names: manifest_str_array(&v, "previous_names"),
        driver_date,
        driver_version: manifest_str(&v, "driver_version"),
        manufacturer: manifest_str(&v, "manufacturer"),
        oem_url: manifest_str(&v, "oem_url"),
    };
    let mut file_map = Vec::new();
    if let Some(files) = v.get("files").and_then(|f| f.as_array()) {
        for item in files {
            if let (Some(src), Some(file)) = (
                item.get("source").and_then(|f| f.as_str()),
                item.get("file").and_then(|f| f.as_str()),
            ) {
                file_map.push((src.to_string(), file.to_string()));
            }
        }
    }
    Ok((driver, file_map))
}

/// Tìm file backup theo đường dẫn gốc: khớp đúng tên file trước,
/// nếu không có thì thử các tên đổi hậu tố `__2`, `__3`... (do backup
/// đổi tên khi trùng). Dùng cho manifest v1 không có file map.
pub fn find_backup_file(dir: &std::path::Path, original_path: &str) -> Option<std::path::PathBuf> {
    let base = windows_file_name(original_path);
    if base.is_empty() {
        return None;
    }
    let exact = dir.join(base);
    if exact.is_file() {
        return Some(exact);
    }
    let (stem, ext) = match base.rfind('.') {
        Some(i) if i > 0 => (&base[..i], Some(&base[i..])),
        _ => (base, None),
    };
    for n in 2..=100u32 {
        let candidate = match ext {
            Some(e) => format!("{stem}__{n}{e}"),
            None => format!("{stem}__{n}"),
        };
        let p = dir.join(candidate);
        if p.is_file() {
            return Some(p);
        }
    }
    None
}

/// Đường dẫn đầy đủ tới từng file driver trong thư mục backup,
/// đã giải quyết xong (đường dẫn rỗng nghĩa là manifest không có file đó).
#[derive(Debug, Clone)]
pub struct ResolvedDriverFiles {
    pub driver_path: std::path::PathBuf,
    pub data_file: std::path::PathBuf,
    pub config_file: std::path::PathBuf,
    pub help_file: std::path::PathBuf,
    pub dependent_files: Vec<std::path::PathBuf>,
}

impl ResolvedDriverFiles {
    /// Số file thực sự có (không tính đường dẫn rỗng).
    pub fn count(&self) -> usize {
        let mut n = 0;
        if !self.driver_path.as_os_str().is_empty() {
            n += 1;
        }
        if !self.data_file.as_os_str().is_empty() {
            n += 1;
        }
        if !self.config_file.as_os_str().is_empty() {
            n += 1;
        }
        if !self.help_file.as_os_str().is_empty() {
            n += 1;
        }
        n + self.dependent_files.len()
    }
}

/// Giải quyết toàn bộ file của driver trong thư mục backup:
/// ưu tiên file map (manifest v2), nếu không có thì tìm theo tên
/// (`find_backup_file`). Trả Err liệt kê file thiếu — restore không
/// cài dở dang khi thiếu file.
pub fn resolve_restore_files(
    driver: &PrinterDriver,
    file_map: &[(String, String)],
    dir: &std::path::Path,
) -> Result<ResolvedDriverFiles, String> {
    let mut missing: Vec<String> = Vec::new();
    let resolve_one = |original: &str, missing: &mut Vec<String>| -> std::path::PathBuf {
        if original.is_empty() {
            return std::path::PathBuf::new();
        }
        // Ưu tiên file map v2 (khớp đúng đường dẫn gốc).
        if let Some((_, file)) = file_map.iter().find(|(src, _)| src == original) {
            let p = dir.join(file);
            if p.is_file() {
                return p;
            }
            missing.push(format!(
                "{original} (manifest ghi file {file} nhưng không có trong thư mục backup)"
            ));
            return std::path::PathBuf::new();
        }
        // Fallback v1: tìm theo tên file.
        match find_backup_file(dir, original) {
            Some(p) => p,
            None => {
                missing.push(original.to_string());
                std::path::PathBuf::new()
            }
        }
    };

    let resolved = ResolvedDriverFiles {
        driver_path: resolve_one(&driver.driver_path, &mut missing),
        data_file: resolve_one(&driver.data_file, &mut missing),
        config_file: resolve_one(&driver.config_file, &mut missing),
        help_file: resolve_one(&driver.help_file, &mut missing),
        dependent_files: driver
            .dependent_files
            .iter()
            .map(|f| resolve_one(f, &mut missing))
            .filter(|p| !p.as_os_str().is_empty())
            .collect(),
    };
    if !missing.is_empty() {
        let mut msg = format!(
            "Thiếu {} file trong thư mục backup, không thể restore:\n",
            missing.len()
        );
        for f in &missing {
            msg.push_str(&format!("  - {f}\n"));
        }
        return Err(msg);
    }
    if resolved.driver_path.as_os_str().is_empty() {
        return Err("Manifest không có file driver chính (driver_path rỗng).".to_string());
    }
    Ok(resolved)
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

    #[test]
    fn windows_file_name_cases() {
        assert_eq!(windows_file_name("C:\\Windows\\x.dll"), "x.dll");
        assert_eq!(windows_file_name("\\\\MAY\\share\\a.inf"), "a.inf");
        assert_eq!(windows_file_name("/tmp/x.dll"), "x.dll");
        assert_eq!(windows_file_name("plain.dll"), "plain.dll");
        assert_eq!(windows_file_name("C:\\Windows\\"), "");
    }

    #[test]
    fn driver_date_round_trip() {
        // format_filetime và parse_driver_date phải ngược nhau.
        let ticks = (1705276800u64 + 11_644_473_600) * 10_000_000; // 15-01-2024
        let text = format_filetime(ticks).unwrap();
        assert_eq!(text, "15-01-2024");
        assert_eq!(parse_driver_date(&text), Some(ticks));
        // Năm nhuận.
        let ticks = (1709164800u64 + 11_644_473_600) * 10_000_000; // 29-02-2024
        assert_eq!(parse_driver_date("29-02-2024"), Some(ticks));
        // Ngày không có thật.
        assert_eq!(parse_driver_date("31-02-2024"), None);
        assert_eq!(parse_driver_date("29-02-2023"), None);
        assert_eq!(parse_driver_date("15-13-2024"), None);
        assert_eq!(parse_driver_date("15/01/2024"), None);
        assert_eq!(parse_driver_date(""), None);
    }

    #[test]
    fn driver_version_round_trip() {
        let v = (10u64 << 48) | (0u64 << 32) | (19041u64 << 16) | 1;
        assert_eq!(parse_driver_version(&format_driver_version(v)), v);
        assert_eq!(parse_driver_version(""), 0);
        assert_eq!(parse_driver_version("10.0.99999.1"), 0);
        assert_eq!(parse_driver_version("a.b.c.d"), 0);
        assert_eq!(parse_driver_version("1.2.3.4.5"), 0);
    }

    #[test]
    fn manifest_v2_parses_with_file_map() {
        let text = r#"{"name": "Test Driver", "environment": "Windows x64",
            "model": "v4", "version": 4, "driver_date": "15-01-2024",
            "driver_version": "10.0.19041.1", "manufacturer": "Hãng",
            "oem_url": "", "driver_path": "C:\\drv\\test.dll",
            "data_file": "C:\\drv\\test.inf", "config_file": "",
            "help_file": "", "dependent_files": ["a.dll"],
            "monitor_name": "", "default_data_type": "RAW",
            "previous_names": [],
            "files": [{"source": "C:\\drv\\test.dll", "file": "test.dll"},
                      {"source": "C:\\drv\\test.inf", "file": "test__2.inf"},
                      {"source": "a.dll", "file": "a.dll"}]}"#;
        let (d, map) = parse_manifest(text).unwrap();
        assert_eq!(d.name, "Test Driver");
        assert_eq!(d.version, 4);
        assert_eq!(d.driver_date.as_deref(), Some("15-01-2024"));
        assert_eq!(d.dependent_files, vec!["a.dll"]);
        assert_eq!(map.len(), 3);
        assert_eq!(
            map[1],
            ("C:\\drv\\test.inf".to_string(), "test__2.inf".to_string())
        );
    }

    #[test]
    fn manifest_v1_parses_without_file_map() {
        // Manifest bản 0.1.0: không có trường "files".
        let text = r#"{"name": "Old", "environment": "Windows x64",
            "model": "v3", "version": 3, "driver_date": null,
            "driver_version": "", "manufacturer": "", "oem_url": "",
            "driver_path": "C:\\drv\\old.dll", "data_file": "",
            "config_file": "", "help_file": "", "dependent_files": [],
            "monitor_name": "", "default_data_type": "RAW",
            "previous_names": []}"#;
        let (d, map) = parse_manifest(text).unwrap();
        assert_eq!(d.name, "Old");
        assert_eq!(d.driver_date, None);
        assert!(map.is_empty());
    }

    #[test]
    fn manifest_rejects_bad_input() {
        assert!(parse_manifest("không phải json").is_err());
        assert!(parse_manifest("[1, 2]").is_err());
        assert!(
            parse_manifest("{}").is_err(),
            "thiếu name + version phải lỗi"
        );
        assert!(parse_manifest(r#"{"name": "X"}"#).is_err());
    }

    #[test]
    fn find_backup_file_exact_then_suffixed() {
        let dir = std::env::temp_dir().join("pdt-test-find");
        let _ = std::fs::remove_dir_all(&dir);
        std::fs::create_dir_all(&dir).unwrap();
        std::fs::write(dir.join("a.dll"), b"x").unwrap();
        std::fs::write(dir.join("b__2.dll"), b"x").unwrap();

        assert_eq!(
            find_backup_file(&dir, "C:\\drv\\a.dll").unwrap(),
            dir.join("a.dll")
        );
        // b.dll không có bản đúng tên -> lấy b__2.dll.
        assert_eq!(
            find_backup_file(&dir, "C:\\drv\\b.dll").unwrap(),
            dir.join("b__2.dll")
        );
        assert!(find_backup_file(&dir, "C:\\drv\\c.dll").is_none());
        let _ = std::fs::remove_dir_all(&dir);
    }

    #[test]
    fn resolve_prefers_file_map_over_name_match() {
        let dir = std::env::temp_dir().join("pdt-test-resolve");
        let _ = std::fs::remove_dir_all(&dir);
        std::fs::create_dir_all(&dir).unwrap();
        std::fs::write(dir.join("drv.dll"), b"x").unwrap();
        std::fs::write(dir.join("drv__2.dll"), b"y").unwrap();

        let mut d = sample_driver();
        d.driver_path = "C:\\drv\\drv.dll".to_string();
        d.data_file = String::new();
        d.config_file = String::new();
        d.help_file = String::new();
        d.dependent_files = vec![];
        // File map chỉ rõ drv.dll gốc nằm ở drv__2.dll.
        let map = vec![("C:\\drv\\drv.dll".to_string(), "drv__2.dll".to_string())];
        let r = resolve_restore_files(&d, &map, &dir).unwrap();
        assert_eq!(r.driver_path, dir.join("drv__2.dll"));
        assert_eq!(r.count(), 1);

        // Không có file map: khớp đúng tên.
        let r = resolve_restore_files(&d, &[], &dir).unwrap();
        assert_eq!(r.driver_path, dir.join("drv.dll"));

        // Thiếu file: lỗi liệt kê rõ.
        let mut d2 = d.clone();
        d2.data_file = "C:\\drv\\khong-co.inf".to_string();
        let err = resolve_restore_files(&d2, &[], &dir).unwrap_err();
        assert!(err.contains("khong-co.inf"));
        let _ = std::fs::remove_dir_all(&dir);
    }
}
