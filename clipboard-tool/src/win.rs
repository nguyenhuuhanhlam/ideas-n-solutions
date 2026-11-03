//! Windows-only frame: hidden window + tray icon + clipboard listener.
//!
//! This is the frame the core plugs into. It owns NO module logic and
//! NO storage: on `WM_CLIPBOARDUPDATE` it snapshots the text, hands it
//! to the pipeline on a worker thread, and writes back at most once.
//!
//! Loop protection: the hash of the last text *we* wrote is kept in RAM.
//! A clipboard update whose hash matches it is our own write and is
//! ignored, so the pipeline never re-processes its own output.
//!
//! Stale-result protection: every copy gets a sequence number. Only the
//! newest sequence may write back; an older pipeline result that lands
//! late is discarded instead of overwriting a newer copy.
//!
//! Settings window: a native Win32 modeless window (see
//! `settings_ui`), on this same thread. It edits a copy of the config,
//! writes `config.json` on Save, and posts `WM_CONFIG_RELOADED` here
//! so the core reloads immediately without a restart. Closing it
//! without saving discards the copy.

use crate::config::AppConfig;
use crate::pipeline::run_pipeline;
use std::collections::VecDeque;
use std::sync::{Mutex, OnceLock};
use windows::core::{w, PCWSTR};
use windows::Win32::Foundation::{
    HANDLE, HGLOBAL, HWND, LPARAM, LRESULT, WPARAM,
};
use windows::Win32::System::DataExchange::{
    AddClipboardFormatListener, CloseClipboard, EmptyClipboard, GetClipboardData,
    IsClipboardFormatAvailable, OpenClipboard, SetClipboardData,
};
use windows::Win32::System::Memory::{GlobalAlloc, GlobalLock, GlobalUnlock, GMEM_MOVEABLE};
use windows::Win32::UI::Shell::{
    Shell_NotifyIconW, NIM_ADD, NIM_DELETE, NIF_ICON, NIF_MESSAGE, NIF_TIP,
    NOTIFYICONDATAW,
};
use windows::Win32::UI::WindowsAndMessaging::{
    AppendMenuW, CreatePopupMenu, CreateWindowExW, DefWindowProcW, DestroyWindow,
    DispatchMessageW, GetCursorPos, GetMessageW, LoadIconW, PostMessageW,
    PostQuitMessage, RegisterClassW, SetForegroundWindow, TrackPopupMenu, TranslateMessage,
    HMENU, IDI_APPLICATION, MF_STRING, MSG, TPM_RIGHTBUTTON, WINDOW_EX_STYLE,
    WINDOW_STYLE, WM_COMMAND, WM_DESTROY, WM_USER, WNDCLASSW,
};

const CF_UNICODETEXT: u32 = 13;
const WM_CLIPBOARDUPDATE: u32 = 0x031D;
const WM_RBUTTONUP: u32 = 0x0205;
const WM_LBUTTONDBLCLK: u32 = 0x0203;
const WM_TRAY: u32 = WM_USER + 1;
const WM_PIPELINE_RESULT: u32 = WM_USER + 2;
pub const WM_CONFIG_RELOADED: u32 = WM_USER + 3;

const MENU_PAUSE: usize = 1001;
const MENU_SETTINGS: usize = 1002;
const MENU_QUIT: usize = 1003;

struct State {
    config: AppConfig,
    config_path: std::path::PathBuf,
    paused: bool,
    last_written_hash: u64,
    seq: u64,
}

struct PipelineOutput {
    seq: u64,
    output: String,
    changed: bool,
}

static STATE: OnceLock<Mutex<State>> = OnceLock::new();
static RESULT_QUEUE: OnceLock<Mutex<VecDeque<PipelineOutput>>> = OnceLock::new();

fn state() -> &'static Mutex<State> {
    STATE.get_or_init(|| {
        Mutex::new(State {
            config: AppConfig::default(),
            config_path: std::path::PathBuf::from("config.json"),
            paused: false,
            last_written_hash: 0,
            seq: 0,
        })
    })
}

fn result_queue() -> &'static Mutex<VecDeque<PipelineOutput>> {
    RESULT_QUEUE.get_or_init(|| Mutex::new(VecDeque::new()))
}

/// FNV-1a 64, loop-guard only, not cryptographic.
fn hash_text(text: &str) -> u64 {
    let mut h: u64 = 0xcbf29ce484222325;
    for b in text.as_bytes() {
        h ^= *b as u64;
        h = h.wrapping_mul(0x100000001b3);
    }
    h
}

fn read_clipboard_text(hwnd: HWND) -> Option<String> {
    unsafe {
        if OpenClipboard(hwnd).is_err() {
            return None;
        }
        let text = (|| {
            if IsClipboardFormatAvailable(CF_UNICODETEXT).is_err() {
                return None;
            }
            let data = GetClipboardData(CF_UNICODETEXT).ok()?;
            if data.0.is_null() {
                return None;
            }
            let locked = GlobalLock(HGLOBAL(data.0));
            if locked.is_null() {
                return None;
            }
            let ptr = locked as *const u16;
            let mut len = 0usize;
            while *ptr.add(len) != 0 {
                len += 1;
            }
            let slice = std::slice::from_raw_parts(ptr, len);
            let text = String::from_utf16_lossy(slice);
            let _ = GlobalUnlock(HGLOBAL(data.0));
            Some(text)
        })();
        let _ = CloseClipboard();
        text
    }
}

fn write_clipboard_text(hwnd: HWND, text: &str) -> bool {
    unsafe {
        if OpenClipboard(hwnd).is_err() {
            return false;
        }
        let ok = (|| {
            if EmptyClipboard().is_err() {
                return false;
            }
            let utf16: Vec<u16> = text.encode_utf16().chain(std::iter::once(0)).collect();
            let bytes = utf16.len() * 2;
            let mem = match GlobalAlloc(GMEM_MOVEABLE, bytes).ok() {
                Some(m) => m,
                None => return false,
            };
            let locked = GlobalLock(mem);
            if locked.is_null() {
                return false;
            }
            std::ptr::copy_nonoverlapping(
                utf16.as_ptr(),
                locked as *mut u16,
                utf16.len(),
            );
            let _ = GlobalUnlock(mem);
            SetClipboardData(CF_UNICODETEXT, HANDLE(mem.0)).is_ok()
        })();
        let _ = CloseClipboard();
        ok
    }
}

fn show_tray_menu(hwnd: HWND) {
    unsafe {
        let menu = match CreatePopupMenu() {
            Ok(m) => m,
            Err(_) => return,
        };
        let paused = state().lock().map(|s| s.paused).unwrap_or(false);
        let pause_label: Vec<u16> = if paused {
            "Resume\0".encode_utf16().collect()
        } else {
            "Pause\0".encode_utf16().collect()
        };
        let _ = AppendMenuW(
            menu,
            MF_STRING,
            MENU_PAUSE,
            PCWSTR(pause_label.as_ptr()),
        );
        let _ = AppendMenuW(
            menu,
            MF_STRING,
            MENU_SETTINGS,
            w!("Settings..."),
        );
        let _ = AppendMenuW(menu, MF_STRING, MENU_QUIT, w!("Quit"));
        let mut point = windows::Win32::Foundation::POINT { x: 0, y: 0 };
        if GetCursorPos(&mut point).is_ok() {
            let _ = SetForegroundWindow(hwnd);
            let _ = TrackPopupMenu(
                menu,
                TPM_RIGHTBUTTON,
                point.x,
                point.y,
                0,
                hwnd,
                None,
            );
        }
        let _ = DestroyMenu(menu);
    }
}

use windows::Win32::UI::WindowsAndMessaging::DestroyMenu;

unsafe extern "system" fn wnd_proc(
    hwnd: HWND,
    msg: u32,
    wparam: WPARAM,
    lparam: LPARAM,
) -> LRESULT {
    match msg {
        WM_CLIPBOARDUPDATE => {
            let (paused, auto_run, config) = {
                let s = state().lock().unwrap();
                (s.paused, s.config.auto_run, s.config.clone())
            };
            if !paused && auto_run {
                if let Some(text) = read_clipboard_text(hwnd) {
                    if !text.is_empty() && hash_text(&text) != state().lock().unwrap().last_written_hash
                    {
                        let seq = {
                            let mut s = state().lock().unwrap();
                            s.seq += 1;
                            s.seq
                        };
                        // HWND itself is not Send, so pass its address
                        // across the thread boundary and rebuild it there.
                        let hwnd_addr = hwnd.0 as isize;
                        std::thread::spawn(move || {
                            let result = run_pipeline(&text, &config);
                            if result.changed {
                                result_queue().lock().unwrap().push_back(PipelineOutput {
                                    seq,
                                    output: result.output,
                                    changed: true,
                                });
                            }
                            unsafe {
                                let hwnd2 = HWND(hwnd_addr as *mut std::ffi::c_void);
                                let _ =
                                    PostMessageW(hwnd2, WM_PIPELINE_RESULT, WPARAM(0), LPARAM(0));
                            }
                        });
                    }
                }
            }
            LRESULT(0)
        }
        WM_PIPELINE_RESULT => {
            let mut queue = result_queue().lock().unwrap();
            while let Some(item) = queue.pop_front() {
                let (current_seq, overwrite) = {
                    let s = state().lock().unwrap();
                    (s.seq, s.config.overwrite_clipboard)
                };
                if item.seq != current_seq || !item.changed || !overwrite {
                    continue;
                }
                {
                    let mut s = state().lock().unwrap();
                    s.last_written_hash = hash_text(&item.output);
                }
                write_clipboard_text(hwnd, &item.output);
            }
            LRESULT(0)
        }
        WM_TRAY => {
            let code = lparam.0 as u32;
            if code == WM_RBUTTONUP {
                show_tray_menu(hwnd);
            } else if code == WM_LBUTTONDBLCLK {
                let (config, path) = {
                    let s = state().lock().unwrap();
                    (s.config.clone(), s.config_path.clone())
                };
                crate::settings_ui::open_settings(hwnd, path, config);
            }
            LRESULT(0)
        }
        WM_CONFIG_RELOADED => {
            // Settings window saved config.json; reload it now.
            // `paused` is runtime state, not settings, so it is kept.
            let path = state().lock().unwrap().config_path.clone();
            if let Ok(new_config) = AppConfig::load_or_default(&path) {
                if let Ok(mut s) = state().lock() {
                    s.config = new_config;
                }
            }
            LRESULT(0)
        }
        WM_COMMAND => {
            let id = (wparam.0 & 0xffff) as usize;
            match id {
                MENU_QUIT => {
                    let _ = DestroyWindow(hwnd);
                }
                MENU_PAUSE => {
                    if let Ok(mut s) = state().lock() {
                        s.paused = !s.paused;
                    }
                }
                MENU_SETTINGS => {
                    let (config, path) = {
                        let s = state().lock().unwrap();
                        (s.config.clone(), s.config_path.clone())
                    };
                    crate::settings_ui::open_settings(hwnd, path, config);
                }
                _ => {}
            }
            LRESULT(0)
        }
        WM_DESTROY => {
            unsafe {
                let mut data = NOTIFYICONDATAW::default();
                data.cbSize = std::mem::size_of::<NOTIFYICONDATAW>() as u32;
                data.hWnd = hwnd;
                data.uID = 1;
                let _ = Shell_NotifyIconW(NIM_DELETE, &mut data);
                PostQuitMessage(0);
            }
            LRESULT(0)
        }
        _ => unsafe { DefWindowProcW(hwnd, msg, wparam, lparam) },
    }
}

/// Run the Windows tray app. Blocks until Quit.
pub fn run(config: AppConfig, config_path: std::path::PathBuf) -> Result<(), String> {
    {
        let mut s = state().lock().map_err(|e| e.to_string())?;
        s.config = config;
        s.config_path = config_path;
    }
    unsafe {
        let class_name = w!("ClipToolHidden");
        let wc = WNDCLASSW {
            style: Default::default(),
            lpfnWndProc: Some(wnd_proc),
            hInstance: Default::default(),
            lpszClassName: class_name,
            ..Default::default()
        };
        if RegisterClassW(&wc) == 0 {
            return Err("RegisterClassW failed".to_string());
        }
        let hwnd = CreateWindowExW(
            WINDOW_EX_STYLE(0),
            class_name,
            w!(""),
            WINDOW_STYLE(0),
            0,
            0,
            0,
            0,
            None,
            None,
            None,
            None,
        )
        .map_err(|e| format!("CreateWindowExW failed: {:?}", e))?;

        // Tray icon.
        let mut data = NOTIFYICONDATAW::default();
        data.cbSize = std::mem::size_of::<NOTIFYICONDATAW>() as u32;
        data.hWnd = hwnd;
        data.uID = 1;
        data.uFlags = NIF_MESSAGE | NIF_ICON | NIF_TIP;
        data.uCallbackMessage = WM_TRAY;
        data.hIcon = LoadIconW(None, IDI_APPLICATION).unwrap_or_default();
        let tip: Vec<u16> = "Clipboard Tool\0".encode_utf16().collect();
        let tip_len = tip.len().min(data.szTip.len());
        data.szTip[..tip_len].copy_from_slice(&tip[..tip_len]);
        if !Shell_NotifyIconW(NIM_ADD, &mut data).as_bool() {
            return Err("Shell_NotifyIconW failed".to_string());
        }

        // Clipboard listener (Win32::System::DataExchange in windows 0.58).
        AddClipboardFormatListener(hwnd)
            .map_err(|e| format!("AddClipboardFormatListener failed: {:?}", e))?;

        let mut msg = MSG::default();
        loop {
            let ret = GetMessageW(&mut msg, None, 0, 0);
            if ret.0 == 0 || ret.0 == -1 {
                break;
            }
            let _ = TranslateMessage(&msg);
            let _ = DispatchMessageW(&msg);
        }
        Ok(())
    }
}

// Keep HMENU import used in signatures above on all windows builds.
#[allow(dead_code)]
fn _menu_marker(_m: HMENU) {}
