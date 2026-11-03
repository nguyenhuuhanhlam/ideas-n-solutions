//! Real settings window, built with egui/eframe.
//!
//! Why a separate thread: the tray / clipboard listener owns the Win32
//! message loop on the main thread, and eframe owns its own event loop.
//! Windows allows a second UI thread with its own windows, so the
//! settings window runs on a spawned thread and never blocks clipboard
//! handling. Only one settings window may be open at a time
//! (`SETTINGS_OPEN`); a second Settings click while it is open is a
//! no-op for now (bring-to-front is a later improvement).
//!
//! Flow: the window edits a *copy* of the config. Cancel / closing the
//! window discards it. Save validates, writes `config.json` (settings
//! only, never clipboard text), then posts `WM_CONFIG_RELOADED` to the
//! Win32 window so the core reloads the file immediately, without a
//! restart. If eframe fails to start on this thread, the fallback is
//! still the config file, reported in a message box.

use crate::config::AppConfig;
use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::atomic::{AtomicBool, Ordering};
use windows::Win32::Foundation::{HWND, LPARAM, WPARAM};
use windows::Win32::UI::WindowsAndMessaging::{MessageBoxW, PostMessageW, MB_OK};
use windows::core::w;

static SETTINGS_OPEN: AtomicBool = AtomicBool::new(false);

fn get_bool(params: &serde_json::Value, key: &str, default: bool) -> bool {
    params.get(key).and_then(|v| v.as_bool()).unwrap_or(default)
}

fn get_str(params: &serde_json::Value, key: &str, default: &str) -> String {
    params
        .get(key)
        .and_then(|v| v.as_str())
        .unwrap_or(default)
        .to_string()
}

fn get_u64(params: &serde_json::Value, key: &str, default: u64) -> u64 {
    params.get(key).and_then(|v| v.as_u64()).unwrap_or(default)
}

fn set_param(params: &mut serde_json::Value, key: &str, value: serde_json::Value) {
    if !params.is_object() {
        *params = serde_json::Value::Object(serde_json::Map::new());
    }
    if let Some(obj) = params.as_object_mut() {
        obj.insert(key.to_string(), value);
    }
}

pub struct SettingsApp {
    config: AppConfig,
    path: PathBuf,
    hwnd_addr: isize,
    max_chars_str: String,
    link_default_scheme: String,
    link_max_len_str: String,
    fbclid_strip_str: String,
    raw_params: HashMap<String, String>,
    status: String,
}

impl SettingsApp {
    fn new(config: AppConfig, path: PathBuf, hwnd_addr: isize) -> Self {
        let max_chars_str = config.max_chars.to_string();
        let mut link_default_scheme = "https".to_string();
        let mut link_max_len_str = "2048".to_string();
        let mut fbclid_strip_str = "fbclid".to_string();
        let mut raw_params = HashMap::new();
        for m in &config.modules {
            match m.id.as_str() {
                "link_detector" => {
                    link_default_scheme = get_str(&m.params, "default_scheme", "https");
                    link_max_len_str = get_u64(&m.params, "max_len", 2048).to_string();
                }
                "fbclid_stripper" => {
                    let strip: Vec<String> = m
                        .params
                        .get("strip")
                        .and_then(|v| v.as_array())
                        .map(|arr| {
                            arr.iter()
                                .filter_map(|v| v.as_str().map(|s| s.to_string()))
                                .collect()
                        })
                        .unwrap_or_else(|| vec!["fbclid".to_string()]);
                    fbclid_strip_str = strip.join(", ");
                }
                _ => {
                    raw_params.insert(
                        m.id.clone(),
                        serde_json::to_string_pretty(&m.params)
                            .unwrap_or_else(|_| "{}".to_string()),
                    );
                }
            }
        }
        Self {
            config,
            path,
            hwnd_addr,
            max_chars_str,
            link_default_scheme,
            link_max_len_str,
            fbclid_strip_str,
            raw_params,
            status: String::new(),
        }
    }

    fn save(&mut self) -> bool {
        // Global numbers.
        let max_chars: usize = match self.max_chars_str.trim().parse() {
            Ok(v) => v,
            Err(_) => {
                self.status = "Lỗi: Giới hạn ký tự phải là số nguyên.".to_string();
                return false;
            }
        };
        self.config.max_chars = max_chars;

        // Per-module string/number buffers -> params.
        for m in self.config.modules.iter_mut() {
            match m.id.as_str() {
                "link_detector" => {
                    if self.link_default_scheme != "http"
                        && self.link_default_scheme != "https"
                    {
                        self.status =
                            "Lỗi: Scheme mặc định phải là http hoặc https.".to_string();
                        return false;
                    }
                    let max_len: u64 = match self.link_max_len_str.trim().parse() {
                        Ok(v) => v,
                        Err(_) => {
                            self.status =
                                "Lỗi: max_len của link_detector phải là số nguyên.".to_string();
                            return false;
                        }
                    };
                    set_param(
                        &mut m.params,
                        "default_scheme",
                        serde_json::Value::String(self.link_default_scheme.clone()),
                    );
                    set_param(&mut m.params, "max_len", serde_json::json!(max_len));
                }
                "fbclid_stripper" => {
                    let strip: Vec<String> = self
                        .fbclid_strip_str
                        .split(',')
                        .map(|s| s.trim().to_string())
                        .filter(|s| !s.is_empty())
                        .collect();
                    if strip.is_empty() {
                        self.status =
                            "Lỗi: Danh sách strip của fbclid_stripper đang rỗng. Tắt module thay vì để rỗng.".to_string();
                        return false;
                    }
                    set_param(&mut m.params, "strip", serde_json::json!(strip));
                }
                _ => {
                    if let Some(raw) = self.raw_params.get(&m.id) {
                        match serde_json::from_str::<serde_json::Value>(raw) {
                            Ok(v) => m.params = v,
                            Err(e) => {
                                self.status =
                                    format!("Lỗi: params JSON của {} không hợp lệ: {}", m.id, e);
                                return false;
                            }
                        }
                    }
                }
            }
        }

        // Order follows the displayed order.
        for (idx, m) in self.config.modules.iter_mut().enumerate() {
            m.order = (idx + 1) as u32;
        }

        let text = match serde_json::to_string_pretty(&self.config) {
            Ok(t) => t,
            Err(e) => {
                self.status = format!("Lỗi: không serialize được config: {}", e);
                return false;
            }
        };
        if let Err(e) = std::fs::write(&self.path, text) {
            self.status = format!("Lỗi: không ghi được {}: {}", self.path.display(), e);
            return false;
        }

        // Tell the Win32 thread to reload the file immediately.
        unsafe {
            let hwnd = HWND(self.hwnd_addr as *mut std::ffi::c_void);
            let _ = PostMessageW(hwnd, crate::win::WM_CONFIG_RELOADED, WPARAM(0), LPARAM(0));
        }
        self.status = format!(
            "Đã lưu {}. Core sẽ nạp lại ngay, không cần restart. Bấm Đóng để thoát.",
            self.path.display()
        );
        true
    }
}

impl eframe::App for SettingsApp {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        egui::CentralPanel::default().show(ctx, |ui| {
            egui::ScrollArea::vertical().show(ui, |ui| {
                ui.heading("Clipboard Tool — Settings");
                ui.label(format!("File: {}", self.path.display()));
                ui.separator();

                ui.heading("Chung");
                ui.checkbox(&mut self.config.auto_run, "Chạy tự động mỗi lần copy");
                ui.checkbox(
                    &mut self.config.overwrite_clipboard,
                    "Ghi đè clipboard bằng kết quả cuối pipeline",
                );
                ui.horizontal(|ui| {
                    ui.label("Giới hạn ký tự (text dài hơn sẽ bỏ qua):");
                    ui.text_edit_singleline(&mut self.max_chars_str);
                });
                ui.separator();

                ui.heading("Module (chạy theo thứ tự từ trên xuống)");
                let mut swap: Option<(usize, usize)> = None;
                let count = self.config.modules.len();
                for i in 0..count {
                    ui.separator();
                    let id = self.config.modules[i].id.clone();
                    ui.horizontal(|ui| {
                        ui.checkbox(&mut self.config.modules[i].enabled, "");
                        ui.label(format!("{} ({})", id, id));
                        if i > 0 && ui.button("↑").clicked() {
                            swap = Some((i, i - 1));
                        }
                        if i + 1 < count && ui.button("↓").clicked() {
                            swap = Some((i, i + 1));
                        }
                    });
                    match id.as_str() {
                        "link_detector" => {
                            let mut v = get_bool(
                                &self.config.modules[i].params,
                                "allow_missing_scheme",
                                true,
                            );
                            if ui
                                .checkbox(&mut v, "Cho phép thiếu scheme (example.com -> https://...)")
                                .changed()
                            {
                                set_param(
                                    &mut self.config.modules[i].params,
                                    "allow_missing_scheme",
                                    serde_json::json!(v),
                                );
                            }
                            let mut v = get_bool(
                                &self.config.modules[i].params,
                                "allow_localhost",
                                true,
                            );
                            if ui.checkbox(&mut v, "Cho phép localhost").changed() {
                                set_param(
                                    &mut self.config.modules[i].params,
                                    "allow_localhost",
                                    serde_json::json!(v),
                                );
                            }
                            let mut v =
                                get_bool(&self.config.modules[i].params, "allow_ip", true);
                            if ui.checkbox(&mut v, "Cho phép địa chỉ IP").changed() {
                                set_param(
                                    &mut self.config.modules[i].params,
                                    "allow_ip",
                                    serde_json::json!(v),
                                );
                            }
                            ui.horizontal(|ui| {
                                ui.label("Scheme mặc định:");
                                ui.text_edit_singleline(&mut self.link_default_scheme);
                            });
                            ui.horizontal(|ui| {
                                ui.label("Độ dài tối đa để xét link:");
                                ui.text_edit_singleline(&mut self.link_max_len_str);
                            });
                        }
                        "fbclid_stripper" => {
                            ui.horizontal(|ui| {
                                ui.label("Param cần loại (cách nhau bằng dấu phẩy):");
                                ui.text_edit_singleline(&mut self.fbclid_strip_str);
                            });
                            let mut v = get_bool(
                                &self.config.modules[i].params,
                                "case_insensitive",
                                true,
                            );
                            if ui
                                .checkbox(&mut v, "So khớp tên param không phân biệt hoa thường")
                                .changed()
                            {
                                set_param(
                                    &mut self.config.modules[i].params,
                                    "case_insensitive",
                                    serde_json::json!(v),
                                );
                            }
                        }
                        _ => {
                            ui.label("Params (JSON):");
                            if let Some(raw) = self.raw_params.get_mut(&id) {
                                ui.text_edit_multiline(raw);
                            }
                        }
                    }
                }
                if let Some((a, b)) = swap {
                    self.config.modules.swap(a, b);
                }

                ui.separator();
                ui.horizontal(|ui| {
                    if ui.button("Lưu").clicked() {
                        self.save();
                    }
                    if ui.button("Đóng (không lưu)").clicked() {
                        ctx.send_viewport_cmd(egui::ViewportCommand::Close);
                    }
                });
                if !self.status.is_empty() {
                    ui.label(&self.status);
                }
                ui.label("Lưu xong vẫn mở cửa sổ để bạn kiểm chứng. Đóng cửa sổ thì thay đổi chưa lưu sẽ mất.");
            });
        });
    }
}

/// Open the settings window on its own thread, unless one is already open.
pub fn open_settings(hwnd: HWND, path: PathBuf, config: AppConfig) {
    if SETTINGS_OPEN
        .compare_exchange(false, true, Ordering::SeqCst, Ordering::SeqCst)
        .is_err()
    {
        return;
    }
    let hwnd_addr = hwnd.0 as isize;
    std::thread::spawn(move || {
        let app = SettingsApp::new(config, path, hwnd_addr);
        let options = eframe::NativeOptions {
            viewport: egui::ViewportBuilder::default()
                .with_inner_size([580.0, 700.0])
                .with_title("Clipboard Tool — Settings"),
            ..Default::default()
        };
        let result = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
            eframe::run_native(
                "Clipboard Tool — Settings",
                options,
                Box::new(|_cc| Ok(Box::new(app) as Box<dyn eframe::App>)),
            )
        }));
        SETTINGS_OPEN.store(false, Ordering::SeqCst);
        match result {
            Ok(Ok(())) => {}
            Ok(Err(e)) => {
                eprintln!("clipboard-tool: settings window failed: {}", e);
                unsafe {
                    let hwnd2 = HWND(hwnd_addr as *mut std::ffi::c_void);
                    let _ = MessageBoxW(
                        hwnd2,
                        w!("Settings window failed to start. Edit config.json for now."),
                        w!("Clipboard Tool"),
                        MB_OK,
                    );
                }
            }
            Err(_) => {
                eprintln!("clipboard-tool: settings window panicked");
                unsafe {
                    let hwnd2 = HWND(hwnd_addr as *mut std::ffi::c_void);
                    let _ = MessageBoxW(
                        hwnd2,
                        w!("Settings window failed to start. Edit config.json for now."),
                        w!("Clipboard Tool"),
                        MB_OK,
                    );
                }
            }
        }
    });
}
