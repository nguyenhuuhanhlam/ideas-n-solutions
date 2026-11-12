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
//! Layout: a Win32 tab control (`SysTabControl32`) splits the window
//! into General, Link Detector, Facebook, Translator and Query
//! Stripper tabs, so each module's settings live on its own page
//! instead of one long stacked form. Save / Cancel / Status and the File: line stay visible on
//! every tab; switching tabs only shows/hides that tab's controls
//! (hidden controls still exist, so Save reads all tabs). The tab
//! control needs `InitCommonControlsEx(ICC_TAB_CLASSES)` before the
//! window is created; tab switches arrive as `TCN_SELCHANGE` via
//! `WM_NOTIFY`.
//!
//! HWNDs are stored as `isize` addresses in the static state, because
//! `HWND` itself is not `Send` and a static must be. All access happens
//! on the Win32 thread, so rebuilding the HWND from its address there
//! is safe.
//!
//! Modern look: the Common Controls v6 visual styles come from the
//! manifest embedded by build.rs (see `clipboard-tool.manifest`),
//! and every control gets the Segoe UI 9pt font via `WM_SETFONT`
//! (see `create_ui_font`). No runtime library is involved: `windows`
//! was already a dependency and `embed-resource` is build-time only.

use crate::config::AppConfig;
use std::path::PathBuf;
use std::sync::{Mutex, OnceLock};
use windows::core::{w, PCWSTR, PWSTR};
use windows::Win32::Foundation::{HWND, LPARAM, LRESULT, WPARAM};
use windows::Win32::Graphics::Gdi::{CreateFontW, DeleteObject, HGDIOBJ, HFONT};
use windows::Win32::UI::Controls::{
    InitCommonControlsEx, INITCOMMONCONTROLSEX, ICC_TAB_CLASSES, TCITEMW, TCIF_TEXT,
};
use windows::Win32::UI::WindowsAndMessaging::{
    CreateWindowExW, DefWindowProcW, DestroyWindow, GetWindowTextW, RegisterClassW,
    SendMessageW, SetForegroundWindow, SetWindowTextW, ShowWindow,
    BM_GETCHECK, BM_SETCHECK, BN_CLICKED, HMENU, SW_HIDE, SW_SHOW, WINDOW_EX_STYLE,
    WINDOW_STYLE, WM_CLOSE, WM_COMMAND, WM_CREATE, WM_DESTROY, WM_NOTIFY, WM_SETFONT,
    WNDCLASSW, WS_BORDER, WS_CHILD, WS_OVERLAPPEDWINDOW, WS_TABSTOP, WS_VISIBLE,
    WS_VSCROLL,
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
const IDC_TRANSLATOR: usize = 2050;
const IDC_TR_MAX_WORDS: usize = 2051;
const IDC_TR_MAX_LEN: usize = 2052;
const IDC_QS_ENABLED: usize = 2060;
const IDC_QS_HOSTS: usize = 2061;
// The tab control itself, plus static labels that must be shown/hidden
// with their tab (unlike the File: line above the tabs, which is global).
const IDC_TABS: usize = 2000;
const LBL_MAX_CHARS: usize = 2100;
const LBL_ORDER: usize = 2101;
const LBL_LINK_SCHEME: usize = 2102;
const LBL_LINK_MAXLEN: usize = 2103;
const LBL_FB_STRIP: usize = 2104;
const LBL_TR_WORDS: usize = 2105;
const LBL_TR_LEN: usize = 2106;
const LBL_TR_INFO: usize = 2107;
const LBL_QS_HOSTS: usize = 2108;
const LBL_QS_INFO: usize = 2109;

// Tab control messages / notifications (TCM_FIRST = 0x1300).
const TCM_GETCURSEL: u32 = 0x130B;
const TCM_INSERTITEMW: u32 = 0x133E;
const TCN_SELCHANGE: i32 = -551;

// (control id, tab index): 0 General, 1 Link Detector, 2 Facebook,
// 3 Translator, 4 Query Stripper. Save / Cancel / Status / File: /
// the tab control itself are deliberately absent: they stay visible
// on every tab.
const TAB_CONTROLS: &[(usize, usize)] = &[
    (IDC_AUTO_RUN, 0),
    (IDC_OVERWRITE, 0),
    (LBL_MAX_CHARS, 0),
    (IDC_MAX_CHARS, 0),
    (LBL_ORDER, 0),
    (IDC_ORDER_LIST, 0),
    (IDC_ORDER_UP, 0),
    (IDC_ORDER_DOWN, 0),
    (IDC_LINK_ENABLED, 1),
    (IDC_LINK_MISSING, 1),
    (IDC_LINK_LOCALHOST, 1),
    (IDC_LINK_IP, 1),
    (LBL_LINK_SCHEME, 1),
    (IDC_LINK_SCHEME, 1),
    (LBL_LINK_MAXLEN, 1),
    (IDC_LINK_MAXLEN, 1),
    (IDC_FB_ENABLED, 2),
    (LBL_FB_STRIP, 2),
    (IDC_FB_STRIP, 2),
    (IDC_FB_CASE, 2),
    (IDC_TRANSLATOR, 3),
    (LBL_TR_WORDS, 3),
    (IDC_TR_MAX_WORDS, 3),
    (LBL_TR_LEN, 3),
    (IDC_TR_MAX_LEN, 3),
    (LBL_TR_INFO, 3),
    (IDC_QS_ENABLED, 4),
    (LBL_QS_HOSTS, 4),
    (IDC_QS_HOSTS, 4),
    (LBL_QS_INFO, 4),
];

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
    // Segoe UI font handle (HFONT as address, 0 = none). Created in
    // create_controls, deleted in WM_DESTROY; it must outlive every
    // control that uses it.
    font_addr: isize,
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
            font_addr: 0,
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
    let hwnd = unsafe {
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
    };
    // Every control gets the Segoe UI font (created in create_controls
    // before the first control). Without it, Win32 falls back to the
    // old default GUI font, which is what makes a dialog look dated.
    if let Some(h) = hwnd {
        apply_font(h);
    }
    hwnd
}

/// The standard Windows UI font: Segoe UI 9pt. Height is negative so
/// it means the character height (not the cell height): -12 = 9pt at
/// 96 DPI. Returns a null HFONT on failure; callers treat that as
/// "no font", and controls simply keep their default font.
fn create_ui_font() -> HFONT {
    unsafe {
        CreateFontW(
            -12, // 9pt at 96 DPI
            0,   // default width
            0,   // no escapement
            0,   // no orientation
            400, // FW_NORMAL
            0,   // not italic
            0,   // not underlined
            0,   // not struck out
            0,   // DEFAULT_CHARSET
            0,   // OUT_DEFAULT_PRECIS
            0,   // CLIP_DEFAULT_PRECIS
            0,   // DEFAULT_QUALITY
            0,   // DEFAULT_PITCH | FF_DONTCARE
            w!("Segoe UI"),
        )
    }
}

/// Send WM_SETFONT to one control, using the font stored in state.
/// A no-op until create_controls has created the font.
fn apply_font(hwnd: HWND) {
    let font_addr = state().lock().map(|s| s.font_addr).unwrap_or(0);
    if font_addr != 0 {
        unsafe {
            let _ = SendMessageW(
                hwnd,
                WM_SETFONT,
                WPARAM(font_addr as usize),
                LPARAM(1), // redraw
            );
        }
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

/// Show one tab's controls, hide the other tabs'. Controls absent
/// from TAB_CONTROLS (Save, Cancel, Status, File:, the tab control)
/// are never touched. Hidden controls still exist, so do_save can
/// read every tab's fields regardless of the visible tab.
fn show_tab(index: usize) {
    for (id, tab) in TAB_CONTROLS {
        if let Some(h) = ctrl(*id) {
            unsafe {
                let _ = ShowWindow(h, if *tab == index { SW_SHOW } else { SW_HIDE });
            }
        }
    }
}

fn create_tab_control(parent: HWND) -> Option<HWND> {
    // WS_CHILD | WS_VISIBLE | WS_CLIPSIBLINGS.
    let style = WINDOW_STYLE(WS_CHILD.0 | WS_VISIBLE.0 | 0x04000000);
    let tabs = create_control(parent, w!("SysTabControl32"), "", style, 12, 40, 576, 470, IDC_TABS)?;
    for (i, title) in ["General", "Link Detector", "Facebook", "Translator", "Query Stripper"]
        .iter()
        .enumerate()
    {
        let text_w = wide(title);
        let mut item = TCITEMW::default();
        item.mask = TCIF_TEXT;
        item.pszText = PWSTR(text_w.as_ptr() as *mut u16);
        unsafe {
            let _ = SendMessageW(
                tabs,
                TCM_INSERTITEMW,
                WPARAM(i),
                LPARAM(&item as *const TCITEMW as isize),
            );
        }
    }
    Some(tabs)
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
    // Create the UI font before the first control, so create_control
    // can apply it to every control as it is created. (A previous
    // font, if any, was deleted in WM_DESTROY when the old window
    // closed, so this never leaks.)
    let font = create_ui_font();
    if !font.0.is_null() {
        if let Ok(mut s) = state().lock() {
            s.font_addr = font.0 as isize;
        }
    }
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
    // Tab strip under the File: line. Tab content starts below it
    // (y ~= 76); Save / Cancel / Status stay below the tab control.
    put(IDC_TABS, create_tab_control(parent));
    put(
        IDC_AUTO_RUN,
        create_control(
            parent,
            w!("BUTTON"),
            "Run automatically on every copy",
            style_button_checkbox(),
            16,
            80,
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
            108,
            360,
            22,
            IDC_OVERWRITE,
        ),
    );
    put(
        LBL_MAX_CHARS,
        create_control(
            parent,
            w!("STATIC"),
            "Max chars (longer text is skipped):",
            style_static(),
            16,
            136,
            320,
            20,
            LBL_MAX_CHARS,
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
            132,
            140,
            22,
            IDC_MAX_CHARS,
        ),
    );

    // Module order list.
    put(
        LBL_ORDER,
        create_control(
            parent,
            w!("STATIC"),
            "Module order (runs top to bottom):",
            style_static(),
            16,
            164,
            300,
            20,
            LBL_ORDER,
        ),
    );
    let list = create_control(
        parent,
        w!("LISTBOX"),
        "",
        style_listbox(),
        16,
        186,
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
            186,
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
            214,
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
    let c = create_control(
        parent,
        w!("BUTTON"),
        "Enable this module",
        style_button_checkbox(),
        16,
        80,
        200,
        22,
        IDC_LINK_ENABLED,
    );
    put(IDC_LINK_ENABLED, c);
    if let Some(h) = c {
        set_check(h, link_enabled);
    }
    let checks: [(usize, &str, bool, i32); 3] = [
        (IDC_LINK_MISSING, "Allow missing scheme (example.com -> https://...)", missing, 108),
        (IDC_LINK_LOCALHOST, "Allow localhost", localhost, 136),
        (IDC_LINK_IP, "Allow IP addresses", ip, 164),
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
        LBL_LINK_SCHEME,
        create_control(
            parent,
            w!("STATIC"),
            "Default scheme:",
            style_static(),
            16,
            196,
            140,
            20,
            LBL_LINK_SCHEME,
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
            192,
            120,
            22,
            IDC_LINK_SCHEME,
        ),
    );
    put(
        LBL_LINK_MAXLEN,
        create_control(
            parent,
            w!("STATIC"),
            "Max length for link detection:",
            style_static(),
            300,
            196,
            180,
            20,
            LBL_LINK_MAXLEN,
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
            192,
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
    let c = create_control(
        parent,
        w!("BUTTON"),
        "Enable this module",
        style_button_checkbox(),
        16,
        80,
        200,
        22,
        IDC_FB_ENABLED,
    );
    put(IDC_FB_ENABLED, c);
    if let Some(h) = c {
        set_check(h, fb_enabled);
    }
    put(
        LBL_FB_STRIP,
        create_control(
            parent,
            w!("STATIC"),
            "Parameters to strip (comma-separated):",
            style_static(),
            16,
            108,
            300,
            20,
            LBL_FB_STRIP,
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
            132,
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
        164,
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
    // Translator tab. It is a notifier, not a pipeline module, so it
    // does not appear in the module order listbox on the General tab.
    // Its max_words / max_len were previously config-only; they are
    // editable here now that the tab gives them room.
    let c = create_control(
        parent,
        w!("BUTTON"),
        "Show translation balloon",
        style_button_checkbox(),
        16,
        80,
        260,
        22,
        IDC_TRANSLATOR,
    );
    put(IDC_TRANSLATOR, c);
    if let Some(h) = c {
        set_check(h, config.translator.enabled);
    }
    put(
        LBL_TR_WORDS,
        create_control(
            parent,
            w!("STATIC"),
            "Max words in a copied phrase:",
            style_static(),
            16,
            108,
            200,
            20,
            LBL_TR_WORDS,
        ),
    );
    put(
        IDC_TR_MAX_WORDS,
        create_control(
            parent,
            w!("EDIT"),
            &config.translator.max_words.to_string(),
            style_edit(),
            220,
            104,
            100,
            22,
            IDC_TR_MAX_WORDS,
        ),
    );
    put(
        LBL_TR_LEN,
        create_control(
            parent,
            w!("STATIC"),
            "Max chars in a copied phrase:",
            style_static(),
            16,
            136,
            200,
            20,
            LBL_TR_LEN,
        ),
    );
    put(
        IDC_TR_MAX_LEN,
        create_control(
            parent,
            w!("EDIT"),
            &config.translator.max_len.to_string(),
            style_edit(),
            220,
            132,
            100,
            22,
            IDC_TR_MAX_LEN,
        ),
    );
    put(
        LBL_TR_INFO,
        create_control(
            parent,
            w!("STATIC"),
            "Translator never overwrites the clipboard: it only shows a balloon with the translation of the copied word or short phrase. On a miss it shows nothing.",
            style_static(),
            16,
            168,
            540,
            60,
            LBL_TR_INFO,
        ),
    );

    // Query stripper section.
    let qs = config.modules.iter().find(|m| m.id == "query_stripper");
    let (qs_enabled, hosts) = match qs {
        Some(m) => {
            let hosts: Vec<String> = m
                .params
                .get("hosts")
                .and_then(|v| v.as_array())
                .map(|arr| {
                    arr.iter()
                        .filter_map(|v| v.as_str().map(|s| s.to_string()))
                        .collect()
                })
                .unwrap_or_else(|| vec!["shopee.vn".to_string()]);
            (m.enabled, hosts.join(", "))
        }
        None => (true, "shopee.vn".to_string()),
    };
    let c = create_control(
        parent,
        w!("BUTTON"),
        "Enable this module",
        style_button_checkbox(),
        16,
        80,
        200,
        22,
        IDC_QS_ENABLED,
    );
    put(IDC_QS_ENABLED, c);
    if let Some(h) = c {
        set_check(h, qs_enabled);
    }
    put(
        LBL_QS_HOSTS,
        create_control(
            parent,
            w!("STATIC"),
            "Hosts (comma-separated):",
            style_static(),
            16,
            108,
            200,
            20,
            LBL_QS_HOSTS,
        ),
    );
    put(
        IDC_QS_HOSTS,
        create_control(
            parent,
            w!("EDIT"),
            &hosts,
            style_edit(),
            16,
            132,
            360,
            22,
            IDC_QS_HOSTS,
        ),
    );
    put(
        LBL_QS_INFO,
        create_control(
            parent,
            w!("STATIC"),
            "For these hosts, everything after the ? is removed, including the ? itself. Other hosts are left untouched.",
            style_static(),
            16,
            164,
            540,
            40,
            LBL_QS_INFO,
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
        if let Some(addr) = s.ctrl.get(&IDC_TRANSLATOR).copied() {
            set_check(hwnd_from(addr), config.translator.enabled);
        }
    }
    // Start on the General tab; every other tab's controls are hidden
    // until their tab is clicked. This must run after the map above
    // is populated, because show_tab reads control HWNDs from it.
    show_tab(0);
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
    let tr_max_words: usize = match ctrl(IDC_TR_MAX_WORDS).map(get_text) {
        Some(t) => match t.trim().parse() {
            Ok(v) if v >= 1 => v,
            _ => {
                set_status("Error: Translator max words must be an integer >= 1.");
                return;
            }
        },
        None => {
            set_status("Error: Could not read the translator max words field.");
            return;
        }
    };
    let tr_max_len: usize = match ctrl(IDC_TR_MAX_LEN).map(get_text) {
        Some(t) => match t.trim().parse() {
            Ok(v) if v >= 1 => v,
            _ => {
                set_status("Error: Translator max chars must be an integer >= 1.");
                return;
            }
        },
        None => {
            set_status("Error: Could not read the translator max chars field.");
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
    let qs_hosts: Vec<String> = ctrl(IDC_QS_HOSTS)
        .map(get_text)
        .unwrap_or_default()
        .split(',')
        .map(|s| s.trim().to_string())
        .filter(|s| !s.is_empty())
        .collect();
    if qs_hosts.is_empty() {
        set_status("Error: Query stripper hosts list is empty. Disable the module instead of leaving it empty.");
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
    if let Some(v) = ctrl(IDC_TRANSLATOR).map(get_check) {
        new_config.translator.enabled = v;
    }
    new_config.translator.max_words = tr_max_words;
    new_config.translator.max_len = tr_max_len;
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
            "query_stripper" => {
                m.enabled = ctrl(IDC_QS_ENABLED).map(get_check).unwrap_or(m.enabled);
                set_param(&mut m.params, "hosts", serde_json::json!(qs_hosts));
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
        WM_NOTIFY => {
            // NMHDR layout (64-bit): hwndFrom at 0, idFrom at 8,
            // code (i32) at 16. Read directly instead of depending on
            // the crate's NMHDR location.
            let base = lparam.0 as *const u8;
            let id_from = unsafe { *(base.add(8) as *const usize) };
            let code = unsafe { *(base.add(16) as *const i32) };
            if id_from == IDC_TABS && code == TCN_SELCHANGE {
                if let Some(tabs) = ctrl(IDC_TABS) {
                    let cur = unsafe {
                        SendMessageW(tabs, TCM_GETCURSEL, WPARAM(0), LPARAM(0)).0
                    };
                    if cur >= 0 {
                        show_tab(cur as usize);
                    }
                }
            }
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
                // Delete the UI font now that every control using it
                // is gone (child windows are destroyed with the parent).
                if s.font_addr != 0 {
                    unsafe {
                        let _ = DeleteObject(HGDIOBJ(s.font_addr as *mut std::ffi::c_void));
                    }
                    s.font_addr = 0;
                }
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
        // The SysTabControl32 class needs comctl32 initialised first.
        let icc = INITCOMMONCONTROLSEX {
            dwSize: std::mem::size_of::<INITCOMMONCONTROLSEX>() as u32,
            dwICC: ICC_TAB_CLASSES,
        };
        let _ = InitCommonControlsEx(&icc);
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
