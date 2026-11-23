//! Gọi Print Spooler API (winspool.drv) qua crate `windows`.
//!
//! Chỉ biên dịch trên Windows. Ba API chính:
//! - `EnumPrinterDriversW` (level 6 -> DRIVER_INFO_6): toàn bộ thông tin
//!   driver, kể cả ngày/phiên bản/hãng và danh sách file phụ thuộc.
//! - `EnumPrintersW` (level 2 -> PRINTER_INFO_2): máy in nào dùng driver nào.
//! - `AddPrinterDriverExW` (level 6): cài driver từ bộ file trong thư mục
//!   backup (lệnh restore).
//!
//! Các API Enum* đều dùng mẫu gọi 2 lần: lần 1 với buffer rỗng để hỏi kích
//! thước cần thiết (trả lỗi ERROR_INSUFFICIENT_BUFFER là bình thường),
//! lần 2 với buffer vừa đủ.

use windows::core::{HSTRING, PCWSTR, PWSTR};
use windows::Win32::Foundation::FILETIME;
use windows::Win32::Graphics::Printing::{
    AddPrinterDriverExW, EnumPrinterDriversW, EnumPrintersW, APD_COPY_ALL_FILES,
    APD_COPY_FROM_DIRECTORY, DRIVER_INFO_6W, PRINTER_ENUM_CONNECTIONS, PRINTER_ENUM_LOCAL,
    PRINTER_INFO_2W,
};

use crate::{
    format_driver_version, format_filetime, parse_driver_date, parse_driver_version,
    parse_multi_sz, DriverQuery, PrinterDriver, PrinterInfo, ResolvedDriverFiles,
};

/// Đổi chuỗi PWSTR (có thể null) thành String. Chuỗi lỗi UTF-16 được
/// thay bằng ký tự thay thế thay vì làm hỏng toàn bộ kết quả.
fn pwstr_to_string(p: windows::core::PWSTR) -> String {
    if p.is_null() {
        return String::new();
    }
    unsafe {
        // as_wide() đọc tới \0 đầu tiên; buffer do spooler cấp nên
        // luôn kết thúc bằng \0.
        String::from_utf16_lossy(p.as_wide())
    }
}

/// Đổi chuỗi multi-sz (PWSTR trỏ tới danh sách \0, kết thúc \0\0)
/// thành Vec<String>. Quét có giới hạn để không đọc quá xa nếu dữ
/// liệu spooler trả về bị hỏng.
fn pwstr_multi_sz_to_vec(p: windows::core::PWSTR) -> Vec<String> {
    if p.is_null() {
        return Vec::new();
    }
    const MAX_UNITS: usize = 1_000_000;
    unsafe {
        let base = p.as_ptr();
        // Tìm \0\0 kết thúc danh sách (giới hạn MAX_UNITS).
        let mut len = 0usize;
        while len + 1 < MAX_UNITS {
            let a = *base.add(len);
            let b = *base.add(len + 1);
            if a == 0 && b == 0 {
                break;
            }
            len += 1;
        }
        let slice = std::slice::from_raw_parts(base, len + 2);
        parse_multi_sz(slice)
    }
}

/// Tách mã lỗi Win32 gốc từ HRESULT (HRESULT từ Win32 có dạng
/// 0x80070000 | mã). Trả mã gốc, ví dụ 122, 5, 1722.
fn win32_code(err: &windows::core::Error) -> u32 {
    let code = err.code().0 as u32;
    if code & 0xFFFF_0000 == 0x8007_0000 {
        code & 0xFFFF
    } else {
        code
    }
}

/// Đổi lỗi Win32 thành thông báo đọc được: "lỗi Win32 5: ...".
fn win32_message(err: windows::core::Error) -> String {
    let msg = err.message().trim().to_string();
    if msg.is_empty() {
        format!("lỗi Win32 {}", win32_code(&err))
    } else {
        format!("lỗi Win32 {}: {}", win32_code(&err), msg)
    }
}

/// Mẫu gọi 2 lần dùng chung cho các API Enum* của spooler:
/// lần 1 hỏi kích thước, lần 2 đọc dữ liệu. Nếu danh sách thay đổi
/// giữa chừng (lỗi 122 với kích thước mới lớn hơn), thử lại 1 lần.
/// Trả (buffer, số mục).
fn enum_buffer<F>(mut call: F, what: &str) -> Result<(Vec<u8>, u32), String>
where
    F: FnMut(Option<&mut [u8]>, &mut u32, &mut u32) -> windows::core::Result<()>,
{
    let mut needed: u32 = 0;
    let mut returned: u32 = 0;
    match call(None, &mut needed, &mut returned) {
        Ok(()) if returned == 0 => return Ok((Vec::new(), 0)),
        Ok(()) => {} // Hiếm: lần 1 đã đủ, vẫn cần buffer để đọc.
        Err(e) => {
            if needed == 0 {
                return Err(format!("Không liệt kê được {what}: {}", win32_message(e)));
            }
            // needed > 0: lỗi chỉ là "buffer chưa đủ", tiếp tục lần 2.
        }
    }
    for _ in 0..2 {
        let mut buf = vec![0u8; needed as usize];
        let mut ret2: u32 = 0;
        let mut need2: u32 = needed;
        match call(Some(&mut buf), &mut need2, &mut ret2) {
            Ok(()) => return Ok((buf, ret2)),
            Err(e) => {
                // 122 = ERROR_INSUFFICIENT_BUFFER: danh sách phình ra
                // giữa chừng, thử lại với kích thước mới.
                if win32_code(&e) == 122 && need2 > needed {
                    needed = need2;
                    continue;
                }
                return Err(format!("Không liệt kê được {what}: {}", win32_message(e)));
            }
        }
    }
    Err(format!(
        "Không liệt kê được {what}: danh sách thay đổi liên tục, thử chạy lại."
    ))
}

/// Đổi Option<HSTRING> thành PCWSTR (null khi None).
fn opt_pcwstr(s: &Option<HSTRING>) -> PCWSTR {
    match s {
        Some(h) => PCWSTR(h.as_ptr()),
        None => PCWSTR::null(),
    }
}

/// Liệt kê driver đã cài (local hoặc trên máy chủ từ xa).
pub fn list_drivers(query: &DriverQuery) -> Result<Vec<PrinterDriver>, String> {
    let server = query.normalized_server().map(HSTRING::from);
    let environment = query.environment.as_deref().map(HSTRING::from);
    let server_param = opt_pcwstr(&server);
    let env_param = opt_pcwstr(&environment);

    let (buf, count) = enum_buffer(
        |b, needed, returned| unsafe {
            EnumPrinterDriversW(server_param, env_param, 6, b, needed, returned)
        },
        "driver",
    )?;

    // Buffer chứa mảng DRIVER_INFO_6W ở đầu; dùng read_unaligned vì
    // Vec<u8> không đảm bảo căn lề 8 byte.
    let count = count as usize;
    let mut out = Vec::with_capacity(count);
    for i in 0..count {
        let info: DRIVER_INFO_6W = unsafe {
            let ptr = buf.as_ptr().add(i * std::mem::size_of::<DRIVER_INFO_6W>())
                as *const DRIVER_INFO_6W;
            ptr.read_unaligned()
        };
        let ticks = info.ftDriverDate.dwLowDateTime as u64
            | ((info.ftDriverDate.dwHighDateTime as u64) << 32);
        out.push(PrinterDriver {
            name: pwstr_to_string(info.pName),
            environment: pwstr_to_string(info.pEnvironment),
            version: info.cVersion,
            driver_path: pwstr_to_string(info.pDriverPath),
            data_file: pwstr_to_string(info.pDataFile),
            config_file: pwstr_to_string(info.pConfigFile),
            help_file: pwstr_to_string(info.pHelpFile),
            dependent_files: pwstr_multi_sz_to_vec(info.pDependentFiles),
            monitor_name: pwstr_to_string(info.pMonitorName),
            default_data_type: pwstr_to_string(info.pDefaultDataType),
            previous_names: pwstr_multi_sz_to_vec(info.pszzPreviousNames),
            driver_date: format_filetime(ticks),
            driver_version: format_driver_version(info.dwlDriverVersion),
            manufacturer: pwstr_to_string(info.pszMfgName),
            oem_url: pwstr_to_string(info.pszOEMUrl),
        });
    }
    out.sort_by(|a, b| a.name.to_lowercase().cmp(&b.name.to_lowercase()));
    Ok(out)
}

/// Liệt kê máy in local + máy in đã kết nối trên máy này (hoặc máy chủ).
pub fn list_printers(server: Option<&str>) -> Result<Vec<PrinterInfo>, String> {
    let server_h = server.and_then(crate::normalize_server).map(HSTRING::from);
    let name_param = opt_pcwstr(&server_h);
    let flags = PRINTER_ENUM_LOCAL | PRINTER_ENUM_CONNECTIONS;

    let (buf, count) = enum_buffer(
        |b, needed, returned| unsafe { EnumPrintersW(flags, name_param, 2, b, needed, returned) },
        "máy in",
    )?;

    let count = count as usize;
    let mut out = Vec::with_capacity(count);
    for i in 0..count {
        let info: PRINTER_INFO_2W = unsafe {
            let ptr = buf.as_ptr().add(i * std::mem::size_of::<PRINTER_INFO_2W>())
                as *const PRINTER_INFO_2W;
            ptr.read_unaligned()
        };
        out.push(PrinterInfo {
            name: pwstr_to_string(info.pPrinterName),
            driver_name: pwstr_to_string(info.pDriverName),
            port_name: pwstr_to_string(info.pPortName),
            share_name: pwstr_to_string(info.pShareName),
            location: pwstr_to_string(info.pLocation),
            comment: pwstr_to_string(info.pComment),
            status: info.Status,
            jobs: info.cJobs,
        });
    }
    out.sort_by(|a, b| a.name.to_lowercase().cmp(&b.name.to_lowercase()));
    Ok(out)
}

// ---------------------------------------------------------------------------
// Cài driver (lệnh restore)
// ---------------------------------------------------------------------------

/// Đổi HSTRING thành PWSTR trỏ tới buffer của nó.
fn pwstr_of(h: &HSTRING) -> PWSTR {
    PWSTR(h.as_ptr() as *mut u16)
}

/// Đổi danh sách chuỗi thành multi-sz (mỗi chuỗi + \0, kết thúc bằng \0).
fn multi_sz(items: &[String]) -> Vec<u16> {
    let mut out = Vec::new();
    for s in items {
        out.extend(s.encode_utf16());
        out.push(0);
    }
    out.push(0);
    out
}

fn filetime_from_ticks(ticks: u64) -> FILETIME {
    FILETIME {
        dwLowDateTime: ticks as u32,
        dwHighDateTime: (ticks >> 32) as u32,
    }
}

/// DRIVER_INFO_6W kèm bộ nhớ sở hữu cho các chuỗi trỏ tới.
///
/// Các HSTRING/Vec<u16> cấp phát trên heap nên địa chỉ buffer của chúng
/// không đổi khi struct ngoài bị di chuyển — các PWSTR trong `info`
/// vẫn trỏ đúng. Chỉ đọc `info` qua `as_ptr()` sau khi dựng xong,
/// không sửa các buffer sau đó.
struct DriverInfo6Owned {
    _name: HSTRING,
    _environment: Option<HSTRING>,
    _driver_path: HSTRING,
    _data_file: HSTRING,
    _config_file: HSTRING,
    _help_file: HSTRING,
    _dependent_files: Vec<u16>,
    _monitor_name: HSTRING,
    _default_data_type: HSTRING,
    _previous_names: Vec<u16>,
    _manufacturer: HSTRING,
    _oem_url: HSTRING,
    info: DRIVER_INFO_6W,
}

impl DriverInfo6Owned {
    fn new(driver: &PrinterDriver, files: &ResolvedDriverFiles) -> Self {
        let name = HSTRING::from(driver.name.as_str());
        let environment = if driver.environment.is_empty() {
            // NULL = môi trường hiện tại của máy gọi (theo tài liệu MS).
            None
        } else {
            Some(HSTRING::from(driver.environment.as_str()))
        };
        let driver_path = HSTRING::from(files.driver_path.to_string_lossy().as_ref());
        let data_file = HSTRING::from(files.data_file.to_string_lossy().as_ref());
        let config_file = HSTRING::from(files.config_file.to_string_lossy().as_ref());
        let help_file = HSTRING::from(files.help_file.to_string_lossy().as_ref());
        let dependent_strings: Vec<String> = files
            .dependent_files
            .iter()
            .map(|p| p.to_string_lossy().into_owned())
            .collect();
        let dependent_files: Option<Vec<u16>> = if dependent_strings.is_empty() {
            None // NULL = không có file phụ thuộc.
        } else {
            Some(multi_sz(&dependent_strings))
        };
        let monitor_name = HSTRING::from(driver.monitor_name.as_str());
        let default_data_type = HSTRING::from(driver.default_data_type.as_str());
        let previous_names: Option<Vec<u16>> = if driver.previous_names.is_empty() {
            None
        } else {
            Some(multi_sz(&driver.previous_names))
        };
        let manufacturer = HSTRING::from(driver.manufacturer.as_str());
        let oem_url = HSTRING::from(driver.oem_url.as_str());

        let ticks = driver
            .driver_date
            .as_deref()
            .and_then(parse_driver_date)
            .unwrap_or(0);
        let info = DRIVER_INFO_6W {
            cVersion: driver.version,
            pName: pwstr_of(&name),
            pEnvironment: environment.as_ref().map_or(PWSTR::null(), pwstr_of),
            pDriverPath: pwstr_of(&driver_path),
            pDataFile: pwstr_of(&data_file),
            pConfigFile: pwstr_of(&config_file),
            pHelpFile: pwstr_of(&help_file),
            pDependentFiles: dependent_files
                .as_ref()
                .map_or(PWSTR::null(), |v| PWSTR(v.as_ptr() as *mut u16)),
            pMonitorName: pwstr_of(&monitor_name),
            pDefaultDataType: pwstr_of(&default_data_type),
            pszzPreviousNames: previous_names
                .as_ref()
                .map_or(PWSTR::null(), |v| PWSTR(v.as_ptr() as *mut u16)),
            ftDriverDate: filetime_from_ticks(ticks),
            dwlDriverVersion: parse_driver_version(&driver.driver_version),
            pszMfgName: pwstr_of(&manufacturer),
            pszOEMUrl: pwstr_of(&oem_url),
            // Hardware ID / Provider chỉ dùng cho PnP matching, không cần
            // khi cài bằng file.
            pszHardwareID: PWSTR::null(),
            pszProvider: PWSTR::null(),
        };
        DriverInfo6Owned {
            _name: name,
            _environment: environment,
            _driver_path: driver_path,
            _data_file: data_file,
            _config_file: config_file,
            _help_file: help_file,
            _dependent_files: dependent_files.unwrap_or_default(),
            _monitor_name: monitor_name,
            _default_data_type: default_data_type,
            _previous_names: previous_names.unwrap_or_default(),
            _manufacturer: manufacturer,
            _oem_url: oem_url,
            info,
        }
    }

    fn as_ptr(&self) -> *const u8 {
        &self.info as *const DRIVER_INFO_6W as *const u8
    }
}

/// Cài driver lên máy local (hoặc máy chủ từ xa) từ bộ file đã giải
/// quyết trong thư mục backup.
///
/// Cờ dùng: APD_COPY_ALL_FILES | APD_COPY_FROM_DIRECTORY — theo tài liệu
/// Microsoft, APD_COPY_FROM_DIRECTORY nghĩa là "dùng tên file đầy đủ
/// trong DRIVER_INFO_6", spooler tự copy toàn bộ file vào thư mục
/// driver của hệ thống; thiếu file ở đúng đường dẫn đã khai thì lỗi.
///
/// Cần quyền administrator (SeLoadDriverPrivilege); không đủ quyền thì
/// API trả lỗi 5 và thông báo sẽ nói rõ.
pub fn install_driver(
    driver: &PrinterDriver,
    files: &ResolvedDriverFiles,
    server: Option<&str>,
) -> Result<(), String> {
    let owned = DriverInfo6Owned::new(driver, files);
    let server_h = server.and_then(crate::normalize_server).map(HSTRING::from);
    let server_param = opt_pcwstr(&server_h);
    let flags = APD_COPY_ALL_FILES | APD_COPY_FROM_DIRECTORY;
    let ok = unsafe { AddPrinterDriverExW(server_param, 6, owned.as_ptr(), flags) };
    if ok.as_bool() {
        return Ok(());
    }
    let err = windows::core::Error::from_win32();
    let code = win32_code(&err);
    let mut msg = format!(
        "Không cài được driver \"{}\": {}",
        driver.name,
        win32_message(err)
    );
    if code == 5 {
        msg.push_str(" (cần chạy terminal với quyền administrator)");
    }
    Err(msg)
}
