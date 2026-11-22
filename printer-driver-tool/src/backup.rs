//! Sao lưu file của 1 driver ra thư mục: copy toàn bộ file thuộc
//! driver (file chính, data, config, help, file phụ thuộc) + ghi
//! manifest `driver-info.json` mô tả driver đó.

use std::collections::HashSet;
use std::path::{Path, PathBuf};

use crate::format::driver_to_json;
use crate::{resolve_driver_file, PrinterDriver};

/// Kết quả sao lưu 1 driver.
#[derive(Debug, Default)]
pub struct BackupReport {
    /// (tên file đích, số byte đã copy).
    pub copied: Vec<(String, u64)>,
    /// File nguồn không tồn tại (đường dẫn đầy đủ).
    pub missing: Vec<String>,
    /// (đường dẫn nguồn, lý do lỗi).
    pub failed: Vec<(String, String)>,
    /// Thư mục đích đã tạo.
    pub dest_dir: PathBuf,
}

impl BackupReport {
    /// Tổng số byte đã copy.
    pub fn total_bytes(&self) -> u64 {
        self.copied.iter().map(|(_, n)| n).sum()
    }
}

/// Đặt tên đích không trùng: nếu `name` đã có trong `used`, chèn
/// hậu tố __2, __3... trước phần mở rộng (vd "a.dll" -> "a__2.dll",
/// file không có mở rộng "x" -> "x__2").
/// Trả tên đã chọn và ghi nhận vào `used`.
pub fn unique_dest_name(used: &mut HashSet<String>, name: &str) -> String {
    if used.insert(name.to_string()) {
        return name.to_string();
    }
    let (stem, ext) = match name.rfind('.') {
        Some(i) if i > 0 => (&name[..i], Some(&name[i..])),
        _ => (name, None),
    };
    let mut n = 2;
    loop {
        let candidate = match ext {
            Some(e) => format!("{stem}__{n}{e}"),
            None => format!("{stem}__{n}"),
        };
        if used.insert(candidate.clone()) {
            return candidate;
        }
        n += 1;
    }
}

/// Sao lưu toàn bộ file của `driver` vào `dest_dir` (tạo thư mục
/// nếu chưa có). File nguồn tương đối được hiểu là nằm cùng thư mục
/// với file driver chính. Hai file nguồn khác nhau nhưng trùng tên
/// file thì file sau được đổi tên (__2, __3...).
///
/// Luôn ghi thêm `driver-info.json` (manifest) vào thư mục đích.
/// Trả Err chỉ khi không tạo được thư mục đích hoặc không ghi được
/// manifest; lỗi từng file được ghi vào report thay vì dừng cả quá trình.
pub fn backup_driver(driver: &PrinterDriver, dest_dir: &Path) -> Result<BackupReport, String> {
    std::fs::create_dir_all(dest_dir)
        .map_err(|e| format!("Không tạo được thư mục {}: {e}", dest_dir.display()))?;

    let driver_dir = Path::new(&driver.driver_path)
        .parent()
        .map(|p| p.to_path_buf())
        .unwrap_or_default();

    let mut report = BackupReport {
        dest_dir: dest_dir.to_path_buf(),
        ..Default::default()
    };
    let mut used: HashSet<String> = HashSet::new();

    for source in driver.all_files() {
        let src_path = resolve_driver_file(&source, &driver_dir);
        let file_name = src_path
            .file_name()
            .map(|n| n.to_string_lossy().into_owned())
            .unwrap_or_else(|| source.clone());
        let dest_name = unique_dest_name(&mut used, &file_name);
        let dest_path = dest_dir.join(&dest_name);
        match std::fs::copy(&src_path, &dest_path) {
            Ok(bytes) => report.copied.push((dest_name, bytes)),
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => {
                report.missing.push(src_path.display().to_string());
            }
            Err(e) => report
                .failed
                .push((src_path.display().to_string(), e.to_string())),
        }
    }

    // Manifest: mô tả driver để sau này biết file này của driver nào.
    let manifest = dest_dir.join("driver-info.json");
    std::fs::write(&manifest, driver_to_json(driver))
        .map_err(|e| format!("Không ghi được {}: {e}", manifest.display()))?;

    Ok(report)
}

/// Tóm tắt report thành text cho người dùng.
pub fn report_text(report: &BackupReport) -> String {
    let mut out = String::new();
    out.push_str(&format!(
        "Đã copy {} file (tổng {}) vào {}\n",
        report.copied.len(),
        crate::format::format_size(report.total_bytes()),
        report.dest_dir.display()
    ));
    for (name, size) in &report.copied {
        out.push_str(&format!(
            "  + {name} ({})\n",
            crate::format::format_size(*size)
        ));
    }
    if !report.missing.is_empty() {
        out.push_str(&format!(
            "Không tìm thấy {} file (đường dẫn driver khai báo nhưng file không còn):\n",
            report.missing.len()
        ));
        for f in &report.missing {
            out.push_str(&format!("  - {f}\n"));
        }
    }
    if !report.failed.is_empty() {
        out.push_str(&format!("Lỗi {} file:\n", report.failed.len()));
        for (f, why) in &report.failed {
            out.push_str(&format!("  ! {f}: {why}\n"));
        }
    }
    out.push_str("Manifest: driver-info.json\n");
    out
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::PrinterDriver;

    fn sample_driver() -> PrinterDriver {
        PrinterDriver {
            name: "Test Driver".to_string(),
            environment: "Windows x64".to_string(),
            version: 4,
            driver_path: String::new(),
            data_file: String::new(),
            config_file: String::new(),
            help_file: String::new(),
            dependent_files: vec![],
            monitor_name: String::new(),
            default_data_type: "RAW".to_string(),
            previous_names: vec![],
            driver_date: None,
            driver_version: String::new(),
            manufacturer: String::new(),
            oem_url: String::new(),
        }
    }

    #[test]
    fn unique_names() {
        let mut used = HashSet::new();
        assert_eq!(unique_dest_name(&mut used, "a.dll"), "a.dll");
        assert_eq!(unique_dest_name(&mut used, "a.dll"), "a__2.dll");
        assert_eq!(unique_dest_name(&mut used, "a.dll"), "a__3.dll");
        assert_eq!(unique_dest_name(&mut used, "x"), "x");
        assert_eq!(unique_dest_name(&mut used, "x"), "x__2");
        assert_eq!(unique_dest_name(&mut used, ".inf"), ".inf");
        assert_eq!(unique_dest_name(&mut used, ".inf"), ".inf__2");
    }

    #[test]
    fn backup_copies_files_and_manifest() {
        let base = std::env::temp_dir().join("pdt-test-backup");
        let _ = std::fs::remove_dir_all(&base);
        let src = base.join("src");
        let dst = base.join("dst");
        std::fs::create_dir_all(&src).unwrap();
        std::fs::write(src.join("drv.dll"), b"12345").unwrap();
        std::fs::write(src.join("drv.inf"), b"abc").unwrap();

        let mut d = sample_driver();
        d.driver_path = src.join("drv.dll").display().to_string();
        d.data_file = src.join("drv.inf").display().to_string();
        d.dependent_files = vec!["khong-co.dll".to_string()];

        let report = backup_driver(&d, &dst).unwrap();
        assert_eq!(report.copied.len(), 2);
        assert_eq!(report.total_bytes(), 8);
        assert_eq!(report.missing.len(), 1);
        assert!(dst.join("drv.dll").exists());
        assert!(dst.join("driver-info.json").exists());
        let manifest = std::fs::read_to_string(dst.join("driver-info.json")).unwrap();
        assert!(manifest.contains("Test Driver"));
        let _ = std::fs::remove_dir_all(&base);
    }
}
