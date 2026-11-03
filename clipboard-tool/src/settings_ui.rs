//! Native Win32 settings window (modeless, same thread as the tray).
//!
//! Why native, not egui/eframe: the eframe version failed to start on
//! the user's Windows machine (its fallback message box was the only
//! thing that appeared). eframe needs a winit event loop on its own
//! thread plus a working GPU/OpenGL context; a plain Win32 window
//! needs neither. It is created on the same thread that already runs
//! the tray message loop, so the existing `GetMessage` / `DispatchMessage`
//! loop in `win.rs` pumps its messages automatically, clipboard
//! handling keeps running while it is open, and closing it never quits
//! the app (its `WM_DESTROY` deliberately does NOT post a quit message).
//!
//! Flow: the window edits a *copy* of the config held in a static.
//! Cancel / closing discards it. Save validates, writes `config.json`
//! (settings only, never clipboard text), then posts
//! `WM_CONFIG_RELOADED` to the main window so the core reloads
//! immediately, without a restart. Only one settings window may be
//! open at a time; a second Settings click brings the open one to
//! the front.
//!
//! HWNDs are stored as `isize` addresses in the static state, because
//! `HWND` itself is not `Send` and a static must be. All access happens
//! on the Win32 thread, so rebuilding the HWND from its address there
//! is safe.

use crate::config::AppConfig;
use std::path::PathBuf;
use std::sync::{Mutex, OnceLock};
use windows::core::{w, PCWSTR};
use windows::Win32::Foundation::{HWND, LPARAM, LRESULT, WPARAM};
use windows::Win32::UI::WindowsAndMessaging::{
    CreateWindowExW, DefWindowProcW, DestroyWindow, GetWindowTextW, RegisterClassW,
    SendMessageW, SetForegroundWindow, SetWindowTextW, ShowWindow,
    BM_GETCHECK, BM_SETCHECK, BN_CLICKED, HMENU, SW_SHOW, WINDOW_EX_STYLE, WINDOW_STYLE,
    WM_CLOSE, WM_COMMAND, WM_CREATE, WM_DESTROY, WNDCLASSW, WS_BORDER, WS_CHILD,
    WS_OVERLAPPEDWINDOW, WS_TABSTOP, WS_VISIBLE, WS_VSCROLL,
};

// Control ids.
const IDC_AUTO_RUN: usize = 2001;
const IDC_OVERWRITE: usize = 2002;
const IDC_MAX_CHARS: usize = 2003;
const IDC_LINK_ENABLED: usize = 2010;
const IDC_LINK_MISSING: usize = 2011;
const IDC_LINK_LOCALHOST: usize = 2012;
const IDC_LINK_IP: usize = 2013;
const IDC_LINK_SCHEME: usize = 2014;
const IDC_LINK_MAXLEN: usize = 2015;
const IDC_FB_ENABLED: usize = 2020;
const IDC_FB_STRIP: usize = 2021;
const IDC_FB_CASE: usize = 2022;
const IDC_ORDER_LIST: usize = 2030;
const IDC_ORDER_UP: usize = 2031;
const IDC_ORDER_DOWN: usize = 2032;
const IDC_SAVE: usize = 2040;
const IDC_CANCEL: usize = 2041;
const IDC_STATUS: usize = 2042;

// Win32 message numbers not exported as constants in windows 0.58.
const LB_ADDSTRING: u32 = 0x0180;
const LB_INSERTSTRING: u32 = 0x0181;
const LB_DELETESTRING: u32 = 0x0182;
const LB_GETCURSEL: u32 = 0x0187;
const LB_SETCURSEL: u32 = 0x0186;
const LB_GETTEXT: u32 = 0x0189;
const LB_GETCOUNT: u32 = 0x018B;

fn wide(s: &str) -> Vec<u16> {
    s.encode_utf16().chain(std::iter::once(0)).collect()
}

fn style_button_checkbox() -> WINDOW_STYLE {
    // WS_CHILD | WS_VISIBLE | WS_TABSTOP | BS_AUTOCHECKBOX(3)
    WINDOW_STYLE(WS_CHILD.0 | WS_VISIBLE.0 | WS_TABSTOP.0 | 3)
}

fn style_button() -> WINDOW_STYLE {
    // WS_CHILD | WS_VISIBLE | WS_TABSTOP | BS_PUSHBUTTON(0)
    WINDOW_STYLE(WS_CHILD.0 | WS_VISIBLE.0 | WS_TABSTOP.0)
}

fn style_edit() -> WINDOW_STYLE {
    // WS_CHILD | WS_VISIBLE | WS_TABSTOP | WS_BORDER | ES_AUTOHSCROLL(128)
    WINDOW_STYLE(WS_CHILD.0 | WS_VISIBLE.0 | WS_TABSTOP.0 | WS_BORDER.0 | 128)
}

fn style_static() -> WINDOW_STYLE {
    WINDOW_STYLE(WS_CHILD.0 | WS_VISIBLE.0)
}

fn style_listbox() -> WINDOW_STYLE {
    // WS_CHILD | WS_VISIBLE | WS_TABSTOP | WS_BORDER | WS_VSCROLL | LBS_NOTIFY(1)
    WINDOW_STYLE(WS_CHILD.0 | WS_VISIBLE.0 | WS_TABSTOP.0 | WS_BORDER.0 | WS_VSCROLL.0 | 1)
}

struct SettingsState {
    config: AppConfig,
    path: PathBuf,
    main_hwnd_addr: isize,
    settings_hwnd_addr: isize,
    ctrl: std::collections::HashMap<usize, isize>,
}

static STATE: OnceLock<Mutex<SettingsState>> = OnceLock::new();
static CLASS_REGISTERED: std::sync::atomic::AtomicBool =
    std::sync::atomic::AtomicBool::new(false);

fn state() -> &'static Mutex<SettingsState> {
    STATE.get_or_init(|| {
        Mutex::new(SettingsState {
            config: AppConfig::default(),
            path: PathBuf::from("config.json"),
            main_hwnd_addr: 0,
            settings_hwnd_addr: 0,
            ctrl: std::collections::HashMap::new(),
        })
    })
}

fn hwnd_from(addr: isize) -> HWND {
    HWND(addr as *mut std::ffi::c_void)
}

fn create_control(
    parent: HWND,
    class: PCWSTR,
    text: &str,
    style: WINDOW_STYLE,
    x: i32,
    y: i32,
    w: i32,
    h: i32,
    id: usize,
) -> Option<HWND> {
    let text_w = wide(text);
    unsafe {
        CreateWindowExW(
            WINDOW_EX_STYLE(0),
            class,
            PCWSTR(text_w.as_ptr()),
            style,
            x,
            y,
            w,
            h,
            parent,
            HMENU(id as *mut std::ffi::c_void),
            None,
            None,
        )
        .ok()
    }
}

fn set_text(hwnd: HWND, text: &str) {
    let text_w = wide(text);
    unsafe {
        let _ = SetWindowTextW(hwnd, PCWSTR(text_w.as_ptr()));
    }
}

fn get_text(hwnd: HWND) -> String {
    unsafe {
        let mut buf = vec![0u16; 4096];
        let len = GetWindowTextW(hwnd, &mut buf);
        if len <= 0 {
            return String::new();
        }
        String::from_utf16_lossy(&buf[..len as usize])
    }
}

fn set_check(hwnd: HWND, checked: bool) {
    unsafe {
        let _ = SendMessageW(
            hwnd,
            BM_SETCHECK,
            WPARAM(if checked { 1 } else { 0 }),
            LPARAM(0),
        );
    }
}

fn get_check(hwnd: HWND) -> bool {
    unsafe { SendMessageW(hwnd, BM_GETCHECK, WPARAM(0), LPARAM(0)).0 == 1 }
}

fn ctrl(id: usize) -> Option<HWND> {
    state()
        .lock()
        .ok()
        .and_then(|s| s.ctrl.get(&id).copied())
        .filter(|a| *a != 0)
        .map(hwnd_from)
}

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

fn create_controls(parent: HWND) {
    let (config, path) = {
        let s = state().lock().unwrap();
        (s.config.clone(), s.path.clone())
    };
    let mut ctrls: std::collections::HashMap<usize, isize> =
        std::collections::HashMap::new();
    let mut put = |id: usize, hwnd: Option<HWND>| {
        if let Some(h) = hwnd {
            ctrls.insert(id, h.0 as isize);
        }
    };

    // File path (read-only info, not editable here).
    put(
        0,
        create_control(
            parent,
            w!("STATIC"),
            &format!("File: {}", path.display()),
            style_static(),
            16,
            12,
            540,
            20,
            0,
        ),
    );
    put(
        0,
        create_control(
            parent,
            w!("STATIC"),
            "General",
            style_static(),
            16,
            40,
            200,
            20,
            0,
        ),
    );
    put(
        IDC_AUTO_RUN,
        create_control(
            parent,
            w!("BUTTON"),
            "Run automatically on every copy",
            style_button_checkbox(),
            16,
            64,
            300,
            22,
            IDC_AUTO_RUN,
        ),
    );
    put(
        IDC_OVERWRITE,
        create_control(
            parent,
            w!("BUTTON"),
            "Overwrite clipboard with the final pipeline result",
            style_button_checkbox(),
            16,
            88,
            360,
            22,
            IDC_OVERWRITE,
        ),
    );
    put(
        0,
        create_control(
            parent,
            w!("STATIC"),
            "Max chars (longer text is skipped):",
            style_static(),
            16,
            116,
            320,
            20,
            0,
        ),
    );
    put(
        IDC_MAX_CHARS,
        create_control(
            parent,
            w!("EDIT"),
            &config.max_chars.to_string(),
            style_edit(),
            340,
            112,
            140,
            22,
            IDC_MAX_CHARS,
        ),
    );

    // Module order list.
    put(
        0,
        create_control(
            parent,
            w!("STATIC"),
            "Module order (runs top to bottom):",
            style_static(),
            16,
            146,
            300,
            20,
            0,
        ),
    );
    let list = create_control(
        parent,
        w!("LISTBOX"),
        "",
        style_listbox(),
        16,
        168,
        320,
        52,
        IDC_ORDER_LIST,
    );
    put(IDC_ORDER_LIST, list);
    if let Some(list_hwnd) = list {
        let mut ordered = config.modules.clone();
        ordered.sort_by_key(|m| m.order);
        for m in &ordered {
            let text_w = wide(&m.id);
            unsafe {
                let _ = SendMessageW(
                    list_hwnd,
                    LB_ADDSTRING,
                    WPARAM(0),
                    LPARAM(text_w.as_ptr() as isize),
                );
            }
        }
    }
    put(
        IDC_ORDER_UP,
        create_control(
            parent,
            w!("BUTTON"),
            "Up",
            style_button(),
            350,
            168,
            70,
            24,
            IDC_ORDER_UP,
        ),
    );
    put(
        IDC_ORDER_DOWN,
        create_control(
            parent,
            w!("BUTTON"),
            "Down",
            style_button(),
            350,
            196,
            70,
            24,
            IDC_ORDER_DOWN,
        ),
    );

    // Link detector section.
    let link = config.modules.iter().find(|m| m.id == "link_detector");
    let (link_enabled, missing, localhost, ip, scheme, maxlen) = match link {
        Some(m) => (
            m.enabled,
            get_bool(&m.params, "allow_missing_scheme", true),
            get_bool(&m.params, "allow_localhost", true),
            get_bool(&m.params, "allow_ip", true),
            get_str(&m.params, "default_scheme", "https"),
            get_u64(&m.params, "max_len", 2048).to_string(),
        ),
        None => (false, true, true, true, "https".to_string(), "2048".to_string()),
    };
    put(
        0,
        create_control(
            parent,
            w!("STATIC"),
            "Module: link_detector",
            style_static(),
            16,
            236,
            300,
            20,
            0,
        ),
    );
    let c = create_control(
        parent,
        w!("BUTTON"),
        "Enable this module",
        style_button_checkbox(),
        16,
        258,
        200,
        22,
        IDC_LINK_ENABLED,
    );
    put(IDC_LINK_ENABLED, c);
    if let Some(h) = c {
        set_check(h, link_enabled);
    }
    let checks: [(usize, &str, bool, i32); 3] = [
        (IDC_LINK_MISSING, "Allow missing scheme (example.com -> https://...)", missing, 282),
        (IDC_LINK_LOCALHOST, "Allow localhost", localhost, 306),
        (IDC_LINK_IP, "Allow IP addresses", ip, 330),
    ];
    for (id, label, value, y) in checks {
        let h = create_control(
            parent,
            w!("BUTTON"),
            label,
            style_button_checkbox(),
            16,
            y,
            360,
            22,
            id,
        );
        put(id, h);
        if let Some(h) = h {
            set_check(h, value);
        }
    }
    put(
        0,
        create_control(
            parent,
            w!("STATIC"),
            "Default scheme:",
            style_static(),
            16,
            358,
            140,
            20,
            0,
        ),
    );
    put(
        IDC_LINK_SCHEME,
        create_control(
            parent,
            w!("EDIT"),
            &scheme,
            style_edit(),
            160,
            354,
            120,
            22,
            IDC_LINK_SCHEME,
        ),
    );
    put(
        0,
        create_control(
            parent,
            w!("STATIC"),
            "Max length for link detection:",
            style_static(),
            300,
            358,
            180,
            20,
            0,
        ),
    );
    put(
        IDC_LINK_MAXLEN,
        create_control(
            parent,
            w!("EDIT"),
            &maxlen,
            style_edit(),
            480,
            354,
            80,
            22,
            IDC_LINK_MAXLEN,
        ),
    );

    // Fbclid stripper section.
    let fb = config.modules.iter().find(|m| m.id == "fbclid_stripper");
    let (fb_enabled, strip, case_insensitive) = match fb {
        Some(m) => {
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
            (
                m.enabled,
                strip.join(", "),
                get_bool(&m.params, "case_insensitive", true),
            )
        }
        None => (false, "fbclid".to_string(), true),
    };
    put(
        0,
        create_control(
            parent,
            w!("STATIC"),
            "Module: fbclid_stripper",
            style_static(),
            16,
            390,
            300,
            20,
            0,
        ),
    );
    let c = create_control(
        parent,
        w!("BUTTON"),
        "Enable this module",
        style_button_checkbox(),
        16,
        412,
        200,
        22,
        IDC_FB_ENABLED,
    );
    put(IDC_FB_ENABLED, c);
    if let Some(h) = c {
        set_check(h, fb_enabled);
    }
    put(
        0,
        create_control(
            parent,
            w!("STATIC"),
            "Parameters to strip (comma-separated):",
            style_static(),
            16,
            440,
            300,
            20,
            0,
        ),
    );
    put(
        IDC_FB_STRIP,
        create_control(
            parent,
            w!("EDIT"),
            &strip,
            style_edit(),
            16,
            462,
            360,
            22,
            IDC_FB_STRIP,
        ),
    );
    let c = create_control(
        parent,
        w!("BUTTON"),
        "Match parameter names case-insensitively",
        style_button_checkbox(),
        16,
        490,
        380,
        22,
        IDC_FB_CASE,
    );
    put(IDC_FB_CASE, c);
    if let Some(h) = c {
        set_check(h, case_insensitive);
    }

    // Global checkboxes initial state (created above, set here so the
    // helper does not need the config inside the creation calls).
    if let Some(h) = ctrl(IDC_AUTO_RUN) {
        set_check(h, config.auto_run);
    }
    if let Some(h) = ctrl(IDC_OVERWRITE) {
        set_check(h, config.overwrite_clipboard);
    }
    // Note: ctrl() reads from the static, which is updated just below;
    // the two checkboxes above are set again after the state update in
    // the WM_CREATE handler path via the same helper, so this block is
    // intentionally harmless if it no-ops on first creation.
    put(
        IDC_SAVE,
        create_control(
            parent,
            w!("BUTTON"),
            "Save",
            style_button(),
            16,
            524,
            90,
            28,
            IDC_SAVE,
        ),
    );
    put(
        IDC_CANCEL,
        create_control(
            parent,
            w!("BUTTON"),
            "Close (discard)",
            style_button(),
            118,
            524,
            140,
            28,
            IDC_CANCEL,
        ),
    );
    put(
        IDC_STATUS,
        create_control(
            parent,
            w!("STATIC"),
            "After saving, the window stays open so you can verify. Closing without saving discards changes.",
            style_static(),
            16,
            564,
            540,
            40,
            IDC_STATUS,
        ),
    );

    if let Ok(mut s) = state().lock() {
        for (id, addr) in ctrls {
            s.ctrl.insert(id, addr);
        }
        // Set global checkboxes now that the map is populated.
        if let Some(addr) = s.ctrl.get(&IDC_AUTO_RUN).copied() {
            set_check(hwnd_from(addr), config.auto_run);
        }
        if let Some(addr) = s.ctrl.get(&IDC_OVERWRITE).copied() {
            set_check(hwnd_from(addr), config.overwrite_clipboard);
        }
    }
}

fn listbox_order() -> Vec<String> {
    let Some(list) = ctrl(IDC_ORDER_LIST) else {
        return Vec::new();
    };
    unsafe {
        let count = SendMessageW(list, LB_GETCOUNT, WPARAM(0), LPARAM(0)).0;
        let mut out = Vec::new();
        for i in 0..count {
            let mut buf = vec![0u16; 256];
            let len = SendMessageW(
                list,
                LB_GETTEXT,
                WPARAM(i as usize),
                LPARAM(buf.as_mut_ptr() as isize),
            )
            .0;
            if len > 0 {
                out.push(String::from_utf16_lossy(&buf[..len as usize]));
            }
        }
        out
    }
}

fn move_listbox_item(delta: isize) {
    let Some(list) = ctrl(IDC_ORDER_LIST) else {
        return;
    };
    unsafe {
        let cur = SendMessageW(list, LB_GETCURSEL, WPARAM(0), LPARAM(0)).0;
        if cur < 0 {
            return;
        }
        let target = cur + delta;
        let count = SendMessageW(list, LB_GETCOUNT, WPARAM(0), LPARAM(0)).0;
        if target < 0 || target >= count {
            return;
        }
        let mut buf = vec![0u16; 256];
        let len = SendMessageW(
            list,
            LB_GETTEXT,
            WPARAM(cur as usize),
            LPARAM(buf.as_mut_ptr() as isize),
        )
        .0;
        if len <= 0 {
            return;
        }
        let text = String::from_utf16_lossy(&buf[..len as usize]);
        let _ = SendMessageW(list, LB_DELETESTRING, WPARAM(cur as usize), LPARAM(0));
        let text_w = wide(&text);
        let _ = SendMessageW(
            list,
            LB_INSERTSTRING,
            WPARAM(target as usize),
            LPARAM(text_w.as_ptr() as isize),
        );
        let _ = SendMessageW(list, LB_SETCURSEL, WPARAM(target as usize), LPARAM(0));
    }
}

fn do_save(hwnd: HWND) {
    let status = match ctrl(IDC_STATUS) {
        Some(h) => h,
        None => return,
    };
    let set_status = |msg: &str| set_text(status, msg);

    let max_chars: usize = match ctrl(IDC_MAX_CHARS).map(get_text) {
        Some(t) => match t.trim().parse() {
            Ok(v) => v,
            Err(_) => {
                set_status("Error: Max chars must be an integer.");
                return;
            }
        },
        None => {
            set_status("Error: Could not read the max chars field.");
            return;
        }
    };
    let scheme = ctrl(IDC_LINK_SCHEME).map(get_text).unwrap_or_default();
    let scheme = scheme.trim().to_string();
    if scheme != "http" && scheme != "https" {
        set_status("Error: Default scheme must be http or https.");
        return;
    }
    let maxlen: u64 = match ctrl(IDC_LINK_MAXLEN).map(get_text) {
        Some(t) => match t.trim().parse() {
            Ok(v) => v,
            Err(_) => {
                set_status("Error: link_detector max_len must be an integer.");
                return;
            }
        },
        None => {
            set_status("Error: Could not read the max_len field.");
            return;
        }
    };
    let strip: Vec<String> = ctrl(IDC_FB_STRIP)
        .map(get_text)
        .unwrap_or_default()
        .split(',')
        .map(|s| s.trim().to_string())
        .filter(|s| !s.is_empty())
        .collect();
    if strip.is_empty() {
        set_status("Error: Strip list is empty. Disable the module instead of leaving it empty.");
        return;
    }

    // Do NOT call listbox_order() while holding the state lock: it locks
    // the same mutex itself and would deadlock the Win32 thread on Save.
    let (path, main_hwnd_addr) = {
        let s = state().lock().unwrap();
        (s.path.clone(), s.main_hwnd_addr)
    };
    let order = listbox_order();
    let mut new_config = {
        let s = state().lock().unwrap();
        s.config.clone()
    };
    new_config.auto_run = ctrl(IDC_AUTO_RUN).map(get_check).unwrap_or(true);
    new_config.overwrite_clipboard = ctrl(IDC_OVERWRITE).map(get_check).unwrap_or(true);
    new_config.max_chars = max_chars;
    // Order from the listbox; modules not in the list keep their order.
    for (idx, id) in order.iter().enumerate() {
        if let Some(m) = new_config.modules.iter_mut().find(|m| &m.id == id) {
            m.order = (idx + 1) as u32;
        }
    }
    for m in new_config.modules.iter_mut() {
        match m.id.as_str() {
            "link_detector" => {
                m.enabled = ctrl(IDC_LINK_ENABLED).map(get_check).unwrap_or(m.enabled);
                set_param(
                    &mut m.params,
                    "allow_missing_scheme",
                    serde_json::json!(ctrl(IDC_LINK_MISSING).map(get_check).unwrap_or(true)),
                );
                set_param(
                    &mut m.params,
                    "allow_localhost",
                    serde_json::json!(ctrl(IDC_LINK_LOCALHOST).map(get_check).unwrap_or(true)),
                );
                set_param(
                    &mut m.params,
                    "allow_ip",
                    serde_json::json!(ctrl(IDC_LINK_IP).map(get_check).unwrap_or(true)),
                );
                set_param(
                    &mut m.params,
                    "default_scheme",
                    serde_json::Value::String(scheme.clone()),
                );
                set_param(&mut m.params, "max_len", serde_json::json!(maxlen));
            }
            "fbclid_stripper" => {
                m.enabled = ctrl(IDC_FB_ENABLED).map(get_check).unwrap_or(m.enabled);
                set_param(&mut m.params, "strip", serde_json::json!(strip));
                set_param(
                    &mut m.params,
                    "case_insensitive",
                    serde_json::json!(ctrl(IDC_FB_CASE).map(get_check).unwrap_or(true)),
                );
            }
            _ => {}
        }
    }

    let text = match serde_json::to_string_pretty(&new_config) {
        Ok(t) => t,
        Err(e) => {
            set_status(&format!("Error: Could not serialize config: {}", e));
            return;
        }
    };
    if let Err(e) = std::fs::write(&path, text) {
        set_status(&format!("Error: Could not write {}: {}", path.display(), e));
        return;
    }
    if let Ok(mut s) = state().lock() {
        s.config = new_config;
    }
    unsafe {
        let main_hwnd = hwnd_from(main_hwnd_addr);
        let _ = windows::Win32::UI::WindowsAndMessaging::PostMessageW(
            main_hwnd,
            crate::win::WM_CONFIG_RELOADED,
            WPARAM(0),
            LPARAM(0),
        );
    }
    let _ = hwnd;
    set_status(&format!(
        "Saved {}. Core will reload immediately, no restart needed.",
        path.display()
    ));
}

unsafe extern "system" fn settings_wnd_proc(
    hwnd: HWND,
    msg: u32,
    wparam: WPARAM,
    lparam: LPARAM,
) -> LRESULT {
    match msg {
        WM_CREATE => {
            create_controls(hwnd);
            LRESULT(0)
        }
        WM_COMMAND => {
            let id = (wparam.0 & 0xffff) as usize;
            let code = ((wparam.0 >> 16) & 0xffff) as u32;
            if code == BN_CLICKED {
                match id {
                    IDC_SAVE => do_save(hwnd),
                    IDC_CANCEL => {
                        let _ = DestroyWindow(hwnd);
                    }
                    IDC_ORDER_UP => move_listbox_item(-1),
                    IDC_ORDER_DOWN => move_listbox_item(1),
                    _ => {}
                }
            }
            LRESULT(0)
        }
        WM_CLOSE => {
            unsafe {
                let _ = DestroyWindow(hwnd);
            }
            LRESULT(0)
        }
        WM_DESTROY => {
            if let Ok(mut s) = state().lock() {
                s.settings_hwnd_addr = 0;
                s.ctrl.clear();
            }
            LRESULT(0)
        }
        _ => unsafe { DefWindowProcW(hwnd, msg, wparam, lparam) },
    }
}

/// Open the settings window on the Win32 thread, or bring the open one
/// to the front. This must be called from the Win32 thread (it is,
/// via the tray window proc); it creates a modeless window and returns
/// immediately, the existing message loop pumps it.
pub fn open_settings(hwnd: HWND, path: PathBuf, config: AppConfig) {
    {
        let mut s = state().lock().unwrap();
        if s.settings_hwnd_addr != 0 {
            let existing = hwnd_from(s.settings_hwnd_addr);
            unsafe {
                let _ = ShowWindow(existing, SW_SHOW);
                let _ = SetForegroundWindow(existing);
            }
            return;
        }
        s.config = config;
        s.path = path;
        s.main_hwnd_addr = hwnd.0 as isize;
        s.ctrl.clear();
    }
    unsafe {
        if !CLASS_REGISTERED.swap(true, std::sync::atomic::Ordering::SeqCst) {
            let wc = WNDCLASSW {
                style: Default::default(),
                lpfnWndProc: Some(settings_wnd_proc),
                hInstance: Default::default(),
                lpszClassName: w!("ClipToolSettings"),
                ..Default::default()
            };
            let _ = RegisterClassW(&wc);
        }
        if let Ok(win_hwnd) = CreateWindowExW(
            WINDOW_EX_STYLE(0),
            w!("ClipToolSettings"),
            w!("Clipboard Tool - Settings"),
            WS_OVERLAPPEDWINDOW,
            100,
            100,
            600,
            660,
            None,
            None,
            None,
            None,
        ) {
            let _ = ShowWindow(win_hwnd, SW_SHOW);
            if let Ok(mut s) = state().lock() {
                s.settings_hwnd_addr = win_hwnd.0 as isize;
            }
        }
    }
}
