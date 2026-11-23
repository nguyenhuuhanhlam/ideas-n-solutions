//! Xuất dữ liệu: bảng text, JSON, CSV và chi tiết 1 driver.
//! Toàn bộ hàm ở đây đều thuần (không gọi Win32) nên test được
//! trên mọi hệ điều hành.

use crate::{PrinterDriver, PrinterInfo};

// ---------------------------------------------------------------------------
// Bảng text
// ---------------------------------------------------------------------------

/// Vẽ bảng text: tiêu đề + dòng kẻ ngang + các hàng, cột căn trái,
/// độ rộng tính theo số ký tự (không phải byte, để tiếng Việt không
/// bị lệch cột).
pub fn render_table(headers: &[&str], rows: &[Vec<String>]) -> String {
    let cols = headers.len();
    let mut widths: Vec<usize> = headers.iter().map(|h| h.chars().count()).collect();
    for row in rows {
        for (i, cell) in row.iter().enumerate().take(cols) {
            widths[i] = widths[i].max(cell.chars().count());
        }
    }
    let mut out = String::new();
    let mut line = String::new();
    for (i, h) in headers.iter().enumerate() {
        if i > 0 {
            line.push_str("  ");
        }
        line.push_str(h);
        for _ in h.chars().count()..widths[i] {
            line.push(' ');
        }
    }
    out.push_str(line.trim_end());
    out.push('\n');
    let total: usize = widths.iter().sum::<usize>() + 2 * (cols.saturating_sub(1));
    out.push_str(&"-".repeat(total));
    out.push('\n');
    for row in rows {
        let mut line = String::new();
        for i in 0..cols {
            if i > 0 {
                line.push_str("  ");
            }
            let cell = row.get(i).map(|s| s.as_str()).unwrap_or("");
            line.push_str(cell);
            for _ in cell.chars().count()..widths[i] {
                line.push(' ');
            }
        }
        out.push_str(line.trim_end());
        out.push('\n');
    }
    out
}

/// Bảng danh sách driver: tên, môi trường, kiểu, ngày, phiên bản, hãng.
pub fn drivers_table(drivers: &[PrinterDriver]) -> String {
    let rows: Vec<Vec<String>> = drivers
        .iter()
        .map(|d| {
            vec![
                d.name.clone(),
                d.environment.clone(),
                d.model().to_string(),
                d.driver_date.clone().unwrap_or_else(|| "-".to_string()),
                d.driver_version.clone(),
                d.manufacturer.clone(),
            ]
        })
        .collect();
    render_table(
        &[
            "Tên driver",
            "Môi trường",
            "Kiểu",
            "Ngày driver",
            "Phiên bản",
            "Hãng",
        ],
        &rows,
    )
}

/// Bảng danh sách máy in: tên, driver, cổng, việc chờ.
pub fn printers_table(printers: &[PrinterInfo]) -> String {
    let rows: Vec<Vec<String>> = printers
        .iter()
        .map(|p| {
            vec![
                p.name.clone(),
                p.driver_name.clone(),
                p.port_name.clone(),
                p.jobs.to_string(),
                printer_status_text(p.status).to_string(),
            ]
        })
        .collect();
    render_table(
        &["Máy in", "Driver", "Cổng", "Việc chờ", "Trạng thái"],
        &rows,
    )
}

/// Diễn giải PRINTER_STATUS_* thành tiếng Việt ngắn gọn.
/// 0 = sẵn sàng. Khi nhiều bit cùng bật, ưu tiên trạng thái
/// nghiêm trọng nhất. Bit lạ giữ lại mã số để tra cứu.
///
/// Mã bit theo Win32 (wingdi.h):
/// PAUSED 0x1, ERROR 0x2, PAPER_JAM 0x8, PAPER_OUT 0x10,
/// OFFLINE 0x80, BUSY 0x200, PRINTING 0x400, TONER_LOW 0x20000,
/// NO_TONER 0x40000, DOOR_OPEN 0x400000, v.v.
pub fn printer_status_text(status: u32) -> String {
    if status == 0 {
        return "Sẵn sàng".to_string();
    }
    // Thứ tự: nghiêm trọng trước.
    const CHECKS: &[(u32, &str)] = &[
        (0x0000_0002, "Lỗi"),
        (0x0000_0080, "Ngoại tuyến"),
        (0x0000_0001, "Tạm dừng"),
        (0x0000_0008, "Kẹt giấy"),
        (0x0000_0010, "Hết giấy"),
        (0x0004_0000, "Hết mực"),
        (0x0040_0000, "Cửa đang mở"),
        (0x0002_0000, "Sắp hết mực"),
        (0x0000_0400, "Đang in"),
        (0x0000_4000, "Đang xử lý"),
        (0x0000_0200, "Bận"),
        (0x0001_0000, "Đang làm nóng"),
        (0x0000_8000, "Đang khởi động"),
    ];
    for (bit, text) in CHECKS {
        if status & bit != 0 {
            return text.to_string();
        }
    }
    format!("Khác (0x{status:08X})")
}

/// Chi tiết 1 driver dạng cặp khóa-giá trị, kèm trạng thái file
/// (kích thước hoặc "không tìm thấy file") khi `file_sizes` cung cấp.
/// `file_sizes`: hàm nhận đường dẫn -> Some(kích thước byte) hoặc None.
pub fn driver_detail<F>(d: &PrinterDriver, mut file_sizes: F) -> String
where
    F: FnMut(&str) -> Option<u64>,
{
    let mut out = String::new();
    let mut kv = |k: &str, v: &str| {
        out.push_str(k);
        out.push_str(": ");
        out.push_str(if v.is_empty() { "-" } else { v });
        out.push('\n');
    };
    kv("Tên driver", &d.name);
    kv("Môi trường", &d.environment);
    kv("Kiểu driver", d.model());
    kv("Ngày driver", d.driver_date.as_deref().unwrap_or("-"));
    kv("Phiên bản", &d.driver_version);
    kv("Hãng", &d.manufacturer);
    kv("URL hãng", &d.oem_url);
    kv("Monitor", &d.monitor_name);
    kv("Kiểu dữ liệu mặc định", &d.default_data_type);
    if !d.previous_names.is_empty() {
        kv("Tên cũ", &d.previous_names.join(", "));
    }
    out.push_str("File:\n");
    for f in d.all_files() {
        let status = match file_sizes(&f) {
            Some(size) => format_size(size),
            None => "không tìm thấy file".to_string(),
        };
        out.push_str("  ");
        out.push_str(&f);
        out.push_str("  (");
        out.push_str(&status);
        out.push_str(")\n");
    }
    out
}

/// Định dạng kích thước file: B, KB, MB với 1 chữ số thập phân khi cần.
pub fn format_size(bytes: u64) -> String {
    if bytes < 1024 {
        format!("{bytes} B")
    } else if bytes < 1024 * 1024 {
        format!("{:.1} KB", bytes as f64 / 1024.0)
    } else {
        format!("{:.1} MB", bytes as f64 / (1024.0 * 1024.0))
    }
}

// ---------------------------------------------------------------------------
// JSON (viết tay, không cần serde)
// ---------------------------------------------------------------------------

/// Escape chuỗi cho JSON: dấu ", \, và ký tự điều khiển.
pub fn json_escape(s: &str) -> String {
    let mut out = String::with_capacity(s.len() + 2);
    for c in s.chars() {
        match c {
            '"' => out.push_str("\\\""),
            '\\' => out.push_str("\\\\"),
            '\n' => out.push_str("\\n"),
            '\r' => out.push_str("\\r"),
            '\t' => out.push_str("\\t"),
            c if (c as u32) < 0x20 => out.push_str(&format!("\\u{:04x}", c as u32)),
            c => out.push(c),
        }
    }
    out
}

fn json_str(s: &str) -> String {
    format!("\"{}\"", json_escape(s))
}

fn json_str_array(items: &[String]) -> String {
    let parts: Vec<String> = items.iter().map(|s| json_str(s)).collect();
    format!("[{}]", parts.join(", "))
}

/// Các field của 1 driver, dạng `"key": value, ...` (không có ngoặc
/// nhọn ngoài), để `driver_to_json` và `backup_manifest_json` dùng chung.
fn driver_fields_json(d: &PrinterDriver) -> String {
    let date = match &d.driver_date {
        Some(v) => json_str(v),
        None => "null".to_string(),
    };
    format!(
        "\"name\": {}, \"environment\": {}, \"model\": {}, \"version\": {}, \
         \"driver_date\": {}, \"driver_version\": {}, \"manufacturer\": {}, \
         \"oem_url\": {}, \"driver_path\": {}, \"data_file\": {}, \
         \"config_file\": {}, \"help_file\": {}, \"dependent_files\": {}, \
         \"monitor_name\": {}, \"default_data_type\": {}, \"previous_names\": {}",
        json_str(&d.name),
        json_str(&d.environment),
        json_str(d.model()),
        d.version,
        date,
        json_str(&d.driver_version),
        json_str(&d.manufacturer),
        json_str(&d.oem_url),
        json_str(&d.driver_path),
        json_str(&d.data_file),
        json_str(&d.config_file),
        json_str(&d.help_file),
        json_str_array(&d.dependent_files),
        json_str(&d.monitor_name),
        json_str(&d.default_data_type),
        json_str_array(&d.previous_names),
    )
}

/// 1 driver thành object JSON (1 dòng, không thụt đầu dòng).
pub fn driver_to_json(d: &PrinterDriver) -> String {
    format!("{{{}}}", driver_fields_json(d))
}

/// Manifest backup v2: object JSON của driver + mảng "files" ánh xạ
/// từng đường dẫn gốc sang tên file thật trong thư mục backup
/// (kể cả file đã bị đổi tên thành `__2` do trùng tên).
/// `files`: (đường dẫn gốc, tên file trong thư mục backup).
pub fn backup_manifest_json(d: &PrinterDriver, files: &[(String, String)]) -> String {
    let mut files_json = String::from("[");
    for (i, (source, file)) in files.iter().enumerate() {
        if i > 0 {
            files_json.push_str(", ");
        }
        files_json.push_str(&format!(
            "{{\"source\": {}, \"file\": {}}}",
            json_str(source),
            json_str(file)
        ));
    }
    files_json.push(']');
    format!("{{{}, \"files\": {}}}", driver_fields_json(d), files_json)
}

/// Danh sách driver thành JSON array, mỗi object 1 dòng.
pub fn drivers_to_json(drivers: &[PrinterDriver]) -> String {
    let mut out = String::from("[\n");
    for (i, d) in drivers.iter().enumerate() {
        if i > 0 {
            out.push_str(",\n");
        }
        out.push_str("  ");
        out.push_str(&driver_to_json(d));
    }
    out.push_str("\n]\n");
    out
}

/// 1 máy in thành object JSON.
pub fn printer_to_json(p: &PrinterInfo) -> String {
    format!(
        "{{\"name\": {}, \"driver_name\": {}, \"port_name\": {}, \
         \"share_name\": {}, \"location\": {}, \"comment\": {}, \
         \"status\": {}, \"jobs\": {}}}",
        json_str(&p.name),
        json_str(&p.driver_name),
        json_str(&p.port_name),
        json_str(&p.share_name),
        json_str(&p.location),
        json_str(&p.comment),
        p.status,
        p.jobs,
    )
}

/// Danh sách máy in thành JSON array.
pub fn printers_to_json(printers: &[PrinterInfo]) -> String {
    let mut out = String::from("[\n");
    for (i, p) in printers.iter().enumerate() {
        if i > 0 {
            out.push_str(",\n");
        }
        out.push_str("  ");
        out.push_str(&printer_to_json(p));
    }
    out.push_str("\n]\n");
    out
}

// ---------------------------------------------------------------------------
// CSV
// ---------------------------------------------------------------------------

/// Escape 1 ô CSV: bao trong "..." và nhân đôi " nếu chứa , " \n \r.
pub fn csv_escape(s: &str) -> String {
    if s.contains(',') || s.contains('"') || s.contains('\n') || s.contains('\r') {
        format!("\"{}\"", s.replace('"', "\"\""))
    } else {
        s.to_string()
    }
}

/// Danh sách driver thành CSV (dòng đầu là tiêu đề).
pub fn drivers_to_csv(drivers: &[PrinterDriver]) -> String {
    let mut out = String::from(
        "name,environment,model,version,driver_date,driver_version,manufacturer,oem_url,\
         driver_path,data_file,config_file,help_file,dependent_files,monitor_name,\
         default_data_type,previous_names\n",
    );
    for d in drivers {
        let row = [
            d.name.as_str(),
            d.environment.as_str(),
            d.model(),
            &d.version.to_string(),
            d.driver_date.as_deref().unwrap_or(""),
            d.driver_version.as_str(),
            d.manufacturer.as_str(),
            d.oem_url.as_str(),
            d.driver_path.as_str(),
            d.data_file.as_str(),
            d.config_file.as_str(),
            d.help_file.as_str(),
            &d.dependent_files.join(";"),
            d.monitor_name.as_str(),
            d.default_data_type.as_str(),
            &d.previous_names.join(";"),
        ];
        let cells: Vec<String> = row.iter().map(|c| csv_escape(c)).collect();
        out.push_str(&cells.join(","));
        out.push('\n');
    }
    out
}

/// Danh sách máy in thành CSV.
pub fn printers_to_csv(printers: &[PrinterInfo]) -> String {
    let mut out =
        String::from("name,driver_name,port_name,share_name,location,comment,status,jobs\n");
    for p in printers {
        let row = [
            p.name.as_str(),
            p.driver_name.as_str(),
            p.port_name.as_str(),
            p.share_name.as_str(),
            p.location.as_str(),
            p.comment.as_str(),
            &p.status.to_string(),
            &p.jobs.to_string(),
        ];
        let cells: Vec<String> = row.iter().map(|c| csv_escape(c)).collect();
        out.push_str(&cells.join(","));
        out.push('\n');
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::PrinterDriver;

    fn sample_driver() -> PrinterDriver {
        PrinterDriver {
            name: "Test \"Driver\", v2".to_string(),
            environment: "Windows x64".to_string(),
            version: 4,
            driver_path: "C:\\drv\\test.dll".to_string(),
            data_file: "C:\\drv\\test.inf".to_string(),
            config_file: String::new(),
            help_file: String::new(),
            dependent_files: vec!["a.dll".to_string(), "b.dll".to_string()],
            monitor_name: String::new(),
            default_data_type: "RAW".to_string(),
            previous_names: vec!["Old Name".to_string()],
            driver_date: Some("15-01-2024".to_string()),
            driver_version: "10.0.19041.1".to_string(),
            manufacturer: "Hãng, Test".to_string(),
            oem_url: String::new(),
        }
    }

    #[test]
    fn table_aligns_columns() {
        let t = render_table(&["Tên", "Số"], &[vec!["a".to_string(), "1".to_string()]]);
        let lines: Vec<&str> = t.lines().collect();
        assert_eq!(lines.len(), 3);
        assert!(lines[0].starts_with("Tên"));
        assert!(lines[2].starts_with('a'));
    }

    #[test]
    fn table_with_vietnamese_widths() {
        // "Máy in" có 6 ký tự nhưng 7 byte: độ rộng phải tính theo ký tự.
        let t = printers_table(&[PrinterInfo {
            name: "Máy in A".to_string(),
            driver_name: "D".to_string(),
            port_name: "USB001".to_string(),
            share_name: String::new(),
            location: String::new(),
            comment: String::new(),
            status: 0,
            jobs: 0,
        }]);
        assert!(t.contains("Sẵn sàng"));
        assert!(t.contains("Máy in A"));
    }

    #[test]
    fn json_escapes_quotes_and_backslashes() {
        let j = driver_to_json(&sample_driver());
        assert!(j.contains("Test \\\"Driver\\\", v2"));
        assert!(j.contains("C:\\\\drv\\\\test.dll"));
        assert!(j.contains("\"dependent_files\": [\"a.dll\", \"b.dll\"]"));
        assert!(j.contains("\"driver_date\": \"15-01-2024\""));
    }

    #[test]
    fn json_null_date() {
        let mut d = sample_driver();
        d.driver_date = None;
        assert!(driver_to_json(&d).contains("\"driver_date\": null"));
    }

    #[test]
    fn manifest_round_trip() {
        // Manifest v2 do backup_manifest_json ghi ra phải đọc lại được
        // nguyên vẹn bằng parse_manifest (kể cả chuỗi có " và \).
        let d = sample_driver();
        let files = vec![
            ("C:\\drv\\test.dll".to_string(), "test.dll".to_string()),
            ("C:\\drv\\test.inf".to_string(), "test__2.inf".to_string()),
        ];
        let text = backup_manifest_json(&d, &files);
        let (back, map) = crate::parse_manifest(&text).unwrap();
        assert_eq!(back, d);
        assert_eq!(map, files);
    }

    #[test]
    fn csv_quotes_commas_and_quotes() {
        let c = drivers_to_csv(&[sample_driver()]);
        assert!(c.contains("\"Test \"\"Driver\"\", v2\""));
        assert!(c.contains("\"Hãng, Test\""));
        assert!(c.contains("a.dll;b.dll"));
    }

    #[test]
    fn detail_shows_files_with_sizes() {
        let text = driver_detail(&sample_driver(), |p| {
            if p.ends_with("test.dll") {
                Some(2048)
            } else {
                None
            }
        });
        assert!(text.contains("Tên driver: Test \"Driver\", v2"));
        assert!(text.contains("2.0 KB"));
        assert!(text.contains("không tìm thấy file"));
    }

    #[test]
    fn size_formatting() {
        assert_eq!(format_size(0), "0 B");
        assert_eq!(format_size(1023), "1023 B");
        assert_eq!(format_size(1024), "1.0 KB");
        assert_eq!(format_size(2_621_440), "2.5 MB");
    }

    #[test]
    fn status_text() {
        assert_eq!(printer_status_text(0), "Sẵn sàng");
        assert_eq!(printer_status_text(0x80), "Ngoại tuyến");
        assert_eq!(printer_status_text(0x01), "Tạm dừng");
        assert_eq!(printer_status_text(0x10), "Hết giấy");
        assert_eq!(printer_status_text(0x400), "Đang in");
        // Nhiều bit: lỗi được ưu tiên trước trạng thái đang in.
        assert_eq!(printer_status_text(0x402), "Lỗi");
        // Bit lạ: giữ mã số.
        assert_eq!(printer_status_text(0x0080_0000), "Khác (0x00800000)");
    }
}
