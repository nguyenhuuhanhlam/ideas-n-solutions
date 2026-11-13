//! Giao diện web local cho file-watcher.
//!
//! HTTP server tối giản viết tay bằng `std::net::TcpListener` — không
//! thêm dependency nào, giữ đúng tiêu chí nhẹ/nhanh của app (CLI vẫn
//! chỉ có 2 dependency trực tiếp). Chỉ bind `127.0.0.1` nên chỉ máy
//! này mở được.
//!
//! - `GET /` — trang giao diện duy nhất (nhúng sẵn trong binary).
//! - `GET /events?after=N` — SSE: stream event realtime (JSON 1 dòng,
//!   cùng định dạng với `--json`), kèm heartbeat mỗi ~15 giây.
//! - `GET /api/config` — cấu hình hiện tại (thư mục, đệ quy,
//!   debounce, exts, ignores, file cấu hình, danh sách ghim).
//! - `GET /api/log?after=N` — log gần đây (tối đa 1000 dòng, có số
//!   thứ tự tăng dần để client nối tiếp qua SSE mà không sót/trùng).
//! - `POST /api/dirs` — thêm/xóa thư mục theo dõi (áp dụng ngay,
//!   lưu vào file cấu hình).
//! - `POST /api/config` — đổi cài đặt (áp dụng ngay, lưu vào file).
//! - `POST /api/pins` — ghim/bỏ ghim 1 file (lưu vào file cấu hình
//!   lưu vào file cấu hình JSON; không đổi watcher).
//!
//! Mọi thay đổi từ giao diện đều: áp dụng live trước, lưu file sau;
//! lưu lỗi thì rollback thay đổi live và trả lỗi cho giao diện.

use std::collections::{HashMap, VecDeque};
use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex, MutexGuard};
use std::time::Duration;

use notify::{RecursiveMode, Watcher};

use crate::{
    json_escape, save_config, split_list, strip_verbatim_prefix, Filter, Identity, Pin, Settings,
};

/// Trang giao diện duy nhất, nhúng vào binary lúc build.
const UI_HTML: &str = include_str!("ui.html");

/// Số dòng log giữ lại trong bộ nhớ để trang web tải lần đầu.
const MAX_LOG: usize = 1000;
/// Giới hạn kích thước header/body của 1 request (chống request lạ).
const MAX_HEADER_BYTES: usize = 64 * 1024;
const MAX_BODY_BYTES: usize = 1024 * 1024;

/// Trạng thái dùng chung giữa vòng lặp watcher (luồng chính) và
/// server web (luồng riêng + 1 luồng mỗi kết nối). Mọi truy cập đều
/// qua Mutex với critical section ngắn — vòng lặp watcher không bao
/// giờ giữ lock khi đang chờ event.
pub struct SharedState {
    watcher: notify::RecommendedWatcher,
    roots: Vec<PathBuf>,
    filter: Filter,
    debounce_ms: u64,
    recursive: bool,
    config_path: Option<PathBuf>,
    /// Định danh máy + user (cố định trong suốt phiên chạy).
    identity: Identity,
    /// File được ghim từ giao diện web (tab Đã ghim). Chỉ là trạng
    /// thái hiển thị, không ảnh hưởng watcher; lưu vào file cấu hình.
    pins: Vec<Pin>,
    /// (số thứ tự tăng dần, 1 dòng JSON của event).
    log: VecDeque<(u64, String)>,
    seq: u64,
}

#[derive(Clone)]
pub struct Shared(Arc<Mutex<SharedState>>);

/// Khóa Mutex, tự hồi phục nếu luồng khác panic trong lúc giữ lock
/// (watcher chạy dài ngày không được chết chỉ vì 1 lần panic lạ).
fn lock(state: &Mutex<SharedState>) -> MutexGuard<'_, SharedState> {
    state.lock().unwrap_or_else(|e| e.into_inner())
}

impl Shared {
    pub fn new(
        watcher: notify::RecommendedWatcher,
        roots: Vec<PathBuf>,
        filter: Filter,
        debounce_ms: u64,
        recursive: bool,
        config_path: Option<PathBuf>,
        identity: Identity,
        pins: Vec<Pin>,
    ) -> Self {
        Shared(Arc::new(Mutex::new(SharedState {
            watcher,
            roots,
            filter,
            debounce_ms,
            recursive,
            config_path,
            identity,
            pins,
            log: VecDeque::new(),
            seq: 0,
        })))
    }

    /// Đẩy 1 event (đã format JSON) vào log cho giao diện web.
    /// Gọi từ vòng lặp watcher sau mỗi lần flush.
    pub fn push_event(&self, json_line: String) {
        let mut st = lock(&self.0);
        st.seq += 1;
        let seq = st.seq;
        st.log.push_back((seq, json_line));
        while st.log.len() > MAX_LOG {
            st.log.pop_front();
        }
    }

    /// Ảnh chụp cấu hình hiện tại cho vòng lặp watcher (lọc + debounce)
    /// và cho API. Clone Filter rẻ (2 Vec<String> ngắn).
    pub fn snapshot(&self) -> (Filter, u64) {
        let st = lock(&self.0);
        (st.filter.clone(), st.debounce_ms)
    }

    /// Các event có số thứ tự > `after` (để trang web tải lần đầu
    /// và SSE nối tiếp). Trả về tối đa MAX_LOG dòng.
    pub fn log_since(&self, after: u64) -> Vec<(u64, String)> {
        let st = lock(&self.0);
        st.log
            .iter()
            .filter(|(seq, _)| *seq > after)
            .cloned()
            .collect()
    }

    /// JSON cho `GET /api/config`.
    fn config_json(&self) -> String {
        let st = lock(&self.0);
        let list = |items: &[String]| -> String {
            items
                .iter()
                .map(|s| format!("\"{}\"", json_escape(s)))
                .collect::<Vec<_>>()
                .join(",")
        };
        let dirs: Vec<String> = st
            .roots
            .iter()
            .map(|p| p.to_string_lossy().into_owned())
            .collect();
        let config_file = match &st.config_path {
            Some(p) => format!("\"{}\"", json_escape(&p.to_string_lossy())),
            None => "null".to_string(),
        };
        // `command` để dành cho quy trình riêng theo file, hiện luôn null.
        let pins: Vec<String> = st
            .pins
            .iter()
            .map(|p| {
                format!(
                    "{{\"path\":\"{}\",\"command\":null}}",
                    json_escape(&p.path.to_string_lossy())
                )
            })
            .collect();
        format!(
            "{{\"dirs\":[{}],\"recursive\":{},\"debounce_ms\":{},\"exts\":[{}],\"ignores\":[{}],\"config_file\":{},\"events\":{},\"user\":\"{}\",\"pc\":\"{}\",\"pins\":[{}]}}",
            list(&dirs),
            st.recursive,
            st.debounce_ms,
            list(&st.filter.exts),
            list(&st.filter.ignores),
            config_file,
            st.seq,
            json_escape(&st.identity.user),
            json_escape(&st.identity.pc),
            pins.join(",")
        )
    }

    /// Lưu file cấu hình từ trạng thái hiện tại (gọi khi đang giữ lock).
    fn save_locked(st: &SharedState) -> Result<(), String> {
        let Some(path) = &st.config_path else {
            return Ok(());
        };
        let settings = Settings {
            exts: st.filter.exts.clone(),
            ignores: st.filter.ignores.clone(),
            debounce_ms: st.debounce_ms,
            recursive: st.recursive,
            pins: st.pins.clone(),
        };
        save_config(path, &st.roots, &settings)
    }

    /// Thêm 1 thư mục: kiểm tra tồn tại -> watch live -> lưu file.
    /// Lưu lỗi thì bỏ watch vừa thêm (rollback).
    pub fn add_dir(&self, dir: &str) -> Result<(), String> {
        // Bỏ tiền tố verbatim \\?\ mà canonicalize sinh ra trên
        // Windows — nếu không thư mục lưu vào watch.json và hiện
        // ở sidebar đều mang tiền tố thừa đó.
        let canon = strip_verbatim_prefix(&Path::new(dir).canonicalize().map_err(|_| {
            format!("folder does not exist or is not readable: {dir}")
        })?);
        if !canon.is_dir() {
            return Err(format!("not a folder: {dir}"));
        }
        let mut st = lock(&self.0);
        if st.roots.contains(&canon) {
            return Err(format!(
                "folder is already being watched: {}",
                canon.display()
            ));
        }
        let mode = mode_of(st.recursive);
        if let Err(e) = st.watcher.watch(&canon, mode) {
            return Err(format!("cannot watch {}: {e}", canon.display()));
        }
        st.roots.push(canon);
        if let Err(e) = Self::save_locked(&st) {
            let removed = st.roots.pop().unwrap();
            let _ = st.watcher.unwatch(&removed);
            return Err(e);
        }
        Ok(())
    }

    /// Xóa 1 thư mục khỏi danh sách theo dõi (unwatch live + lưu file).
    pub fn remove_dir(&self, dir: &str) -> Result<(), String> {
        // Bỏ \\?\ như add_dir để so khớp được với thư mục đã lưu.
        let canon = strip_verbatim_prefix(
            &Path::new(dir)
                .canonicalize()
                .map_err(|_| format!("folder does not exist: {dir}"))?,
        );
        let mut st = lock(&self.0);
        let Some(pos) = st.roots.iter().position(|r| r == &canon) else {
            return Err(format!(
                "folder is not in the watch list: {}",
                canon.display()
            ));
        };
        let removed = st.roots.remove(pos);
        let _ = st.watcher.unwatch(&removed);
        if let Err(e) = Self::save_locked(&st) {
            let mode = mode_of(st.recursive);
            let _ = st.watcher.watch(&removed, mode);
            st.roots.insert(pos, removed);
            return Err(e);
        }
        Ok(())
    }

    /// Ghim 1 file (tab Đã ghim). Đường dẫn phải tuyệt đối; tồn tại
    /// thì canonicalize, chưa tồn tại thì giữ nguyên để ghim trước
    /// file sẽ xuất hiện sau. Ghim trùng thì không làm gì
    /// (idempotent). Chỉ lưu trạng thái + file cấu hình, không đổi
    /// watcher — file ngoài vùng theo dõi vẫn ghim được, giao diện
    /// sẽ đánh dấu "ngoài vùng theo dõi".
    pub fn add_pin(&self, path: &str) -> Result<(), String> {
        let normalized = normalize_pin_path(path)?;
        let mut st = lock(&self.0);
        if find_pin(&st.pins, &normalized, path).is_some() {
            return Ok(());
        }
        st.pins.push(Pin::new(normalized));
        if let Err(e) = Self::save_locked(&st) {
            st.pins.pop();
            return Err(e);
        }
        Ok(())
    }

    /// Bỏ ghim 1 file. Không có trong danh sách thì vẫn Ok
    /// (idempotent — giao diện có thể gọi lại sau khi mất mạng).
    pub fn remove_pin(&self, path: &str) -> Result<(), String> {
        let normalized = normalize_pin_path(path)?;
        let mut st = lock(&self.0);
        let Some(pos) = find_pin(&st.pins, &normalized, path) else {
            return Ok(());
        };
        let removed = st.pins.remove(pos);
        if let Err(e) = Self::save_locked(&st) {
            st.pins.insert(pos, removed);
            return Err(e);
        }
        Ok(())
    }

    /// Đổi cài đặt (chỉ đổi các trường được truyền vào).
    /// Đổi `recursive` thì watch lại toàn bộ thư mục với chế độ mới;
    /// watch lại lỗi thì giữ nguyên chế độ cũ và trả lỗi.
    pub fn apply_settings(
        &self,
        recursive: Option<bool>,
        debounce_ms: Option<u64>,
        exts: Option<Vec<String>>,
        ignores: Option<Vec<String>>,
    ) -> Result<(), String> {
        let mut st = lock(&self.0);
        let old_recursive = st.recursive;
        let old_debounce = st.debounce_ms;
        let old_filter = st.filter.clone();
        let new_recursive = recursive.unwrap_or(old_recursive);

        // Đổi chế độ đệ quy: watch lại toàn bộ trước khi đổi state.
        if new_recursive != old_recursive {
            let mode = mode_of(new_recursive);
            let mut failed: Vec<String> = Vec::new();
            for root in st.roots.clone() {
                let _ = st.watcher.unwatch(&root);
                if let Err(e) = st.watcher.watch(&root, mode) {
                    failed.push(format!("{}: {e}", root.display()));
                }
            }
            if !failed.is_empty() {
                // Rollback: watch lại toàn bộ bằng chế độ cũ.
                let old_mode = mode_of(old_recursive);
                for root in st.roots.clone() {
                    let _ = st.watcher.unwatch(&root);
                    let _ = st.watcher.watch(&root, old_mode);
                }
                return Err(format!(
                    "cannot change recursive mode ({}): {}",
                    if new_recursive { "recursive" } else { "non-recursive" },
                    failed.join("; ")
                ));
            }
        }

        st.recursive = new_recursive;
        if let Some(d) = debounce_ms {
            st.debounce_ms = d;
        }
        if let Some(e) = exts {
            st.filter.exts = e;
        }
        if let Some(i) = ignores {
            st.filter.ignores = i;
        }
        if let Err(e) = Self::save_locked(&st) {
            // Rollback state + chế độ watch.
            if st.recursive != old_recursive {
                let old_mode = mode_of(old_recursive);
                for root in st.roots.clone() {
                    let _ = st.watcher.unwatch(&root);
                    let _ = st.watcher.watch(&root, old_mode);
                }
            }
            st.recursive = old_recursive;
            st.debounce_ms = old_debounce;
            st.filter = old_filter;
            return Err(e);
        }
        Ok(())
    }
}

fn mode_of(recursive: bool) -> RecursiveMode {
    if recursive {
        RecursiveMode::Recursive
    } else {
        RecursiveMode::NonRecursive
    }
}

/// Chuẩn hóa đường dẫn ghim: phải tuyệt đối; tồn tại thì
/// canonicalize (gộp symlink, đúng chữ hoa/thường thật trên
/// Windows); chưa tồn tại thì giữ nguyên. Trên Windows đổi `/`
/// thành `\` cho nhất quán với đường dẫn event.
fn normalize_pin_path(path: &str) -> Result<PathBuf, String> {
    let p = Path::new(path);
    if !p.is_absolute() {
        return Err(format!("pinned path must be absolute: {path}"));
    }
    if let Ok(canon) = p.canonicalize() {
        return Ok(strip_verbatim_prefix(&canon));
    }
    #[cfg(windows)]
    {
        Ok(PathBuf::from(path.replace('/', "\\")))
    }
    #[cfg(not(windows))]
    {
        Ok(p.to_path_buf())
    }
}

/// Tìm ghim khớp: so cả dạng đã chuẩn hóa lẫn chuỗi gốc, vì file
/// ghim lúc chưa tồn tại (lưu dạng thô) có thể đã xuất hiện sau đó
/// (chuẩn hóa ra dạng khác) — cả 2 đều phải nhận ra là cùng 1 ghim.
fn find_pin(pins: &[Pin], normalized: &Path, raw: &str) -> Option<usize> {
    pins.iter()
        .position(|p| p.path == normalized || p.path.to_string_lossy() == raw)
}

/// Chạy server web trên listener đã bind sẵn (bind ở luồng chính để
/// lỗi cổng bị chiếm báo ngay khi khởi động thay vì im lặng).
/// Chặn mãi (tới khi process dừng). Mỗi kết nối xử lý trong 1 luồng riêng.
pub fn serve(listener: TcpListener, shared: Shared) -> std::io::Result<()> {
    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
                let shared = shared.clone();
                std::thread::spawn(move || handle_connection(stream, &shared));
            }
            Err(_) => continue,
        }
    }
    Ok(())
}

struct Request {
    method: String,
    path: String,
    query: String,
    body: Vec<u8>,
}

impl Request {
    /// Tham số `after=N` trong query string (mặc định 0).
    fn query_after(&self) -> u64 {
        for pair in self.query.split('&') {
            if let Some((k, v)) = pair.split_once('=') {
                if k == "after" {
                    return v.parse().unwrap_or(0);
                }
            }
        }
        0
    }
}

fn find_subslice(haystack: &[u8], needle: &[u8]) -> Option<usize> {
    haystack
        .windows(needle.len())
        .position(|window| window == needle)
}

/// Đọc 1 HTTP request: header tới `\r\n\r\n` rồi body theo
/// Content-Length. Trả None khi kết nối hỏng / request quá lớn.
fn read_request(stream: &mut TcpStream) -> Option<Request> {
    let mut buf: Vec<u8> = Vec::new();
    let mut chunk = [0u8; 4096];
    loop {
        let n = stream.read(&mut chunk).ok()?;
        if n == 0 {
            return None;
        }
        buf.extend_from_slice(&chunk[..n]);
        if buf.len() > MAX_HEADER_BYTES + MAX_BODY_BYTES {
            return None;
        }
        if let Some(pos) = find_subslice(&buf, b"\r\n\r\n") {
            let head = &buf[..pos];
            let mut rest = buf[pos + 4..].to_vec();
            let head_str = String::from_utf8_lossy(head);
            let mut lines = head_str.lines();
            let first = lines.next()?;
            let mut parts = first.split_whitespace();
            let method = parts.next()?.to_string();
            let target = parts.next()?.to_string();
            let mut content_length = 0usize;
            for line in lines {
                if let Some((k, v)) = line.split_once(':') {
                    if k.trim().eq_ignore_ascii_case("content-length") {
                        content_length = v.trim().parse().unwrap_or(0);
                    }
                }
            }
            if content_length > MAX_BODY_BYTES {
                return None;
            }
            while rest.len() < content_length {
                let n = stream.read(&mut chunk).ok()?;
                if n == 0 {
                    return None;
                }
                rest.extend_from_slice(&chunk[..n]);
            }
            rest.truncate(content_length);
            let (path, query) = match target.split_once('?') {
                Some((p, q)) => (percent_decode(p), q.to_string()),
                None => (percent_decode(&target), String::new()),
            };
            return Some(Request {
                method,
                path,
                query,
                body: rest,
            });
        }
    }
}

/// Trả 1 response đầy đủ (có Content-Length) rồi đóng kết nối.
fn respond(stream: &mut TcpStream, status: u16, content_type: &str, body: &[u8]) {
    let reason = match status {
        200 => "OK",
        400 => "Bad Request",
        404 => "Not Found",
        _ => "OK",
    };
    let head = format!(
        "HTTP/1.1 {status} {reason}\r\nContent-Type: {content_type}\r\nContent-Length: {}\r\nConnection: close\r\n\r\n",
        body.len()
    );
    let _ = stream.write_all(head.as_bytes());
    let _ = stream.write_all(body);
    let _ = stream.flush();
}

fn json_ok(stream: &mut TcpStream) {
    respond(stream, 200, "application/json", b"{\"ok\":true}");
}

fn json_err(stream: &mut TcpStream, message: &str) {
    let body = format!("{{\"ok\":false,\"error\":\"{}\"}}", json_escape(message));
    respond(stream, 400, "application/json", body.as_bytes());
}

fn handle_connection(mut stream: TcpStream, shared: &Shared) {
    let _ = stream.set_read_timeout(Some(Duration::from_secs(10)));
    let Some(req) = read_request(&mut stream) else {
        return;
    };
    let _ = stream.set_read_timeout(None);
    match (req.method.as_str(), req.path.as_str()) {
        ("GET", "/") => respond(&mut stream, 200, "text/html; charset=utf-8", UI_HTML.as_bytes()),
        ("GET", "/events") => handle_events(stream, shared, req.query_after()),
        ("GET", "/api/config") => {
            let body = shared.config_json();
            respond(&mut stream, 200, "application/json", body.as_bytes());
        }
        ("GET", "/api/log") => {
            let items = shared.log_since(req.query_after());
            let mut out = String::from("{\"events\":[");
            for (i, (seq, json)) in items.iter().enumerate() {
                if i > 0 {
                    out.push(',');
                }
                // json đã là object {"time":...}; chèn "seq" vào đầu.
                if let Some(rest) = json.strip_prefix('{') {
                    out.push_str(&format!("{{\"seq\":{seq},{rest}"));
                } else {
                    out.push_str(json);
                }
            }
            out.push_str("]}");
            respond(&mut stream, 200, "application/json", out.as_bytes());
        }
        ("POST", "/api/dirs") => {
            let form = parse_form(&req.body);
            let dir = form.get("dir").cloned().unwrap_or_default();
            let result = match form.get("action").map(|s| s.as_str()) {
                Some("add") => shared.add_dir(&dir),
                Some("remove") => shared.remove_dir(&dir),
                _ => Err("action must be add or remove".to_string()),
            };
            match result {
                Ok(()) => json_ok(&mut stream),
                Err(e) => json_err(&mut stream, &e),
            }
        }
        ("POST", "/api/pins") => {
            let form = parse_form(&req.body);
            let path = form.get("path").cloned().unwrap_or_default();
            let result = match form.get("action").map(|s| s.as_str()) {
                Some("add") => shared.add_pin(&path),
                Some("remove") => shared.remove_pin(&path),
                _ => Err("action must be add or remove".to_string()),
            };
            match result {
                Ok(()) => json_ok(&mut stream),
                Err(e) => json_err(&mut stream, &e),
            }
        }
        ("POST", "/api/config") => {
            let form = parse_form(&req.body);
            let recursive = match form.get("recursive").map(|s| s.as_str()) {
                Some("true") => Some(true),
                Some("false") => Some(false),
                Some(other) => {
                    json_err(&mut stream, &format!("recursive must be true or false, got: {other}"));
                    return;
                }
                None => None,
            };
            let debounce_ms = match form.get("debounce_ms") {
                Some(v) => match v.parse::<u64>() {
                    Ok(n) => Some(n),
                    Err(_) => {
                        json_err(&mut stream, &format!("debounce_ms must be an integer >= 0, got: {v}"));
                        return;
                    }
                },
                None => None,
            };
            let exts = form.get("exts").map(|v| split_list(v));
            let ignores = form.get("ignores").map(|v| split_list(v));
            match shared.apply_settings(recursive, debounce_ms, exts, ignores) {
                Ok(()) => json_ok(&mut stream),
                Err(e) => json_err(&mut stream, &e),
            }
        }
        _ => respond(&mut stream, 404, "text/plain; charset=utf-8", "not found".as_bytes()),
    }
}

/// SSE: stream event realtime bằng chunked encoding. Mỗi event là 1
/// chunk `id: <seq>\ndata: <json>\n\n`. Heartbeat `: ping` mỗi ~15s.
/// Ghi lỗi = client đã ngắt, luồng kết thúc.
fn handle_events(mut stream: TcpStream, shared: &Shared, mut after: u64) {
    let head = "HTTP/1.1 200 OK\r\nContent-Type: text/event-stream\r\nCache-Control: no-cache\r\nTransfer-Encoding: chunked\r\nConnection: keep-alive\r\n\r\n";
    if stream.write_all(head.as_bytes()).is_err() {
        return;
    }
    let _ = stream.flush();
    let mut idle_ticks = 0u32;
    loop {
        let items = shared.log_since(after);
        if items.is_empty() {
            idle_ticks += 1;
            if idle_ticks % 150 == 0 && write_chunk(&mut stream, b": ping\n\n").is_err() {
                return;
            }
        } else {
            idle_ticks = 0;
            for (seq, json) in items {
                after = seq;
                let frame = format!("id: {seq}\ndata: {json}\n\n");
                if write_chunk(&mut stream, frame.as_bytes()).is_err() {
                    return;
                }
            }
        }
        std::thread::sleep(Duration::from_millis(100));
    }
}

fn write_chunk(stream: &mut TcpStream, data: &[u8]) -> std::io::Result<()> {
    stream.write_all(format!("{:x}\r\n", data.len()).as_bytes())?;
    stream.write_all(data)?;
    stream.write_all(b"\r\n")?;
    stream.flush()
}

/// Parse body `application/x-www-form-urlencoded` thành map.
fn parse_form(body: &[u8]) -> HashMap<String, String> {
    let mut map = HashMap::new();
    for pair in String::from_utf8_lossy(body).split('&') {
        if pair.is_empty() {
            continue;
        }
        let (k, v) = match pair.split_once('=') {
            Some((k, v)) => (k, v),
            None => (pair, ""),
        };
        map.insert(percent_decode(k), percent_decode(v));
    }
    map
}

/// Giải mã percent-encoding (`%XX` + `+` thành khoảng trắng).
/// `%` không hợp lệ được giữ nguyên thay vì lỗi.
fn percent_decode(s: &str) -> String {
    fn hex(b: u8) -> Option<u8> {
        match b {
            b'0'..=b'9' => Some(b - b'0'),
            b'a'..=b'f' => Some(b - b'a' + 10),
            b'A'..=b'F' => Some(b - b'A' + 10),
            _ => None,
        }
    }
    let bytes = s.as_bytes();
    let mut out = Vec::with_capacity(bytes.len());
    let mut i = 0;
    while i < bytes.len() {
        match bytes[i] {
            b'+' => {
                out.push(b' ');
                i += 1;
            }
            b'%' if i + 2 < bytes.len() => match (hex(bytes[i + 1]), hex(bytes[i + 2])) {
                (Some(h), Some(l)) => {
                    out.push((h << 4) | l);
                    i += 3;
                }
                _ => {
                    out.push(b'%');
                    i += 1;
                }
            },
            b => {
                out.push(b);
                i += 1;
            }
        }
    }
    String::from_utf8_lossy(&out).into_owned()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn form_and_percent_decode() {
        assert_eq!(percent_decode("D%3A%5Ccode%5Cproject"), "D:\\code\\project");
        assert_eq!(percent_decode("a+b%20c"), "a b c");
        assert_eq!(percent_decode("100%"), "100%");
        assert_eq!(percent_decode("%zz"), "%zz");
        assert_eq!(percent_decode("ti%E1%BA%BFng"), "tiếng");
        let form = parse_form(b"action=add&dir=C%3A%5Ca%20b&empty=");
        assert_eq!(form.get("action").unwrap(), "add");
        assert_eq!(form.get("dir").unwrap(), "C:\\a b");
        assert_eq!(form.get("empty").unwrap(), "");
        assert!(parse_form(b"").is_empty());
    }
}
