//! Logic thuần của file-watcher: rút gọn event của `notify`, gộp event
//! dồn dập (debounce), lọc theo đuôi file / chuỗi bỏ qua, và format
//! đầu ra. Không có IO ở đây ngoài timestamp, nên test được bằng
//! `cargo test` mà không cần chạm vào hệ thống file thật.

pub mod web;

use std::collections::HashMap;
use std::path::{Path, PathBuf};

use notify::EventKind;

/// Loại thay đổi đã rút gọn (4 loại duy nhất in ra log).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Kind {
    Created,
    Modified,
    Removed,
    Renamed,
}

impl Kind {
    /// Nhãn in hoa cho dạng human-readable.
    pub fn label(self) -> &'static str {
        match self {
            Kind::Created => "CREATED",
            Kind::Modified => "MODIFIED",
            Kind::Removed => "REMOVED",
            Kind::Renamed => "RENAMED",
        }
    }

    /// Tên thường cho JSON và placeholder `{event}` của `--exec`.
    pub fn name(self) -> &'static str {
        match self {
            Kind::Created => "created",
            Kind::Modified => "modified",
            Kind::Removed => "removed",
            Kind::Renamed => "renamed",
        }
    }
}

/// Nửa nào của một lần đổi tên mà event này mô tả.
/// Các backend của `notify` báo rename rất khác nhau:
/// - inotify (Linux): 3 event cho 1 lần đổi tên — From, To, rồi Both
///   (cả 3 chung 1 tracker = cookie của inotify).
/// - ReadDirectoryChangesW (Windows): chỉ 2 event — From rồi To,
///   kề nhau, không có Both, không có tracker.
/// - FSEvents (macOS) / kqueue (BSD): From hoặc Any.
/// `Coalescer` dùng thông tin này để gộp về đúng 1 dòng.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum RenameSide {
    /// Chỉ biết tên cũ (đổi tên ra khỏi thư mục đang theo dõi,
    /// hoặc nửa đầu của một cặp From/To).
    From,
    /// Chỉ biết tên mới (đổi tên từ ngoài vào, hoặc nửa sau của
    /// một cặp From/To).
    To,
    /// Biết cả 2 đầu (nguồn -> đích).
    Both,
    /// Không rõ chiều (backend không cho biết).
    Any,
}

/// Một thay đổi đã rút gọn, sẵn sàng in ra.
#[derive(Debug, Clone)]
pub struct Summary {
    pub kind: Kind,
    /// Đường dẫn mới (với rename: đích; với From-single: tên cũ).
    pub path: PathBuf,
    /// Với rename Both: tên cũ. Với From-single: tên cũ (= path,
    /// để placeholder `{from}` của --exec vẫn có giá trị).
    /// To/Any-single: None.
    pub from: Option<PathBuf>,
    /// Some(_) khi kind == Renamed: nửa nào của lần đổi tên.
    pub side: Option<RenameSide>,
    /// Tracker của `notify` (inotify: cookie của lần đổi tên).
    /// From/To/Both của cùng 1 lần đổi tên chung 1 tracker.
    /// None trên backend không hỗ trợ (vd: Windows).
    pub tracker: Option<usize>,
    /// Thời điểm nhận event đầu tiên, dạng `YYYY-MM-DD HH:MM:SS` (giờ địa phương).
    pub time: String,
}

impl Summary {
    /// Khóa gộp: rename không bao giờ gộp chung với event thường,
    /// vì cặp (nguồn, đích) là một thay đổi khác hẳn. Các nửa
    /// From/To/Both cũng có khóa riêng để `Coalescer` ghép cặp.
    fn key(&self) -> String {
        match self.side {
            Some(RenameSide::Both) => format!(
                "R:{}>{}",
                self.from.as_ref().map(|p| p.display().to_string()).unwrap_or_default(),
                self.path.display()
            ),
            Some(RenameSide::From) => format!("R:F>{}", self.path.display()),
            Some(RenameSide::To) => format!("R:T>{}", self.path.display()),
            Some(RenameSide::Any) => format!("R:?>{}", self.path.display()),
            None => format!("P:{}", self.path.display()),
        }
    }
}

/// Thời gian hiện tại, giờ địa phương, dạng `YYYY-MM-DD HH:MM:SS`.
pub fn now_string() -> String {
    chrono::Local::now().format("%Y-%m-%d %H:%M:%S").to_string()
}

/// Rút gọn một `notify::Event` thành `Summary`.
/// Trả về None cho các event nên bỏ qua: đọc file (Access) và Other.
pub fn summarize(event: &notify::Event, time: String) -> Option<Summary> {
    if event.paths.is_empty() {
        return None;
    }
    match &event.kind {
        EventKind::Create(_) => Some(Summary {
            kind: Kind::Created,
            path: event.paths[0].clone(),
            from: None,
            side: None,
            tracker: None,
            time,
        }),
        EventKind::Modify(notify::event::ModifyKind::Name(mode)) => {
            use notify::event::RenameMode;
            let tracker = event.tracker();
            match mode {
                RenameMode::Both if event.paths.len() >= 2 => {
                    // Đủ 2 đầu: paths[0] = nguồn, paths[1] = đích.
                    Some(Summary {
                        kind: Kind::Renamed,
                        from: Some(event.paths[0].clone()),
                        path: event.paths[1].clone(),
                        side: Some(RenameSide::Both),
                        tracker,
                        time,
                    })
                }
                RenameMode::From => Some(Summary {
                    kind: Kind::Renamed,
                    from: Some(event.paths[0].clone()),
                    path: event.paths[0].clone(),
                    side: Some(RenameSide::From),
                    tracker,
                    time,
                }),
                RenameMode::To => Some(Summary {
                    kind: Kind::Renamed,
                    from: None,
                    path: event.paths[0].clone(),
                    side: Some(RenameSide::To),
                    tracker,
                    time,
                }),
                // Any, hoặc Both nhưng chỉ có 1 đường dẫn: giữ nguyên
                // đường dẫn duy nhất, chiều không rõ.
                _ => Some(Summary {
                    kind: Kind::Renamed,
                    from: None,
                    path: event.paths[0].clone(),
                    side: Some(RenameSide::Any),
                    tracker,
                    time,
                }),
            }
        }
        EventKind::Modify(_) => Some(Summary {
            kind: Kind::Modified,
            path: event.paths[0].clone(),
            from: None,
            side: None,
            tracker: None,
            time,
        }),
        EventKind::Remove(_) => Some(Summary {
            kind: Kind::Removed,
            path: event.paths[0].clone(),
            from: None,
            side: None,
            tracker: None,
            time,
        }),
        // Access (đọc file) và Other: ồn, không phải thay đổi nội dung.
        _ => None,
    }
}

enum Merge {
    /// Giữ event cũ (event mới không thêm thông tin).
    Keep,
    /// Thay bằng event mới (trạng thái cuối đã đổi hẳn).
    Replace,
    /// Hủy cả hai (file chỉ tồn tại thoáng qua trong cửa sổ debounce).
    Drop,
}

/// Quy tắc gộp 2 event liên tiếp trên cùng 1 đường dẫn:
/// - Create rồi Modify -> chỉ Create (file mới, nội dung ghi sau đó
///   là một phần của lần tạo).
/// - Create rồi Remove -> bỏ cả hai (file tạm, sinh ra rồi mất ngay).
/// - Modify rồi Remove -> chỉ Remove (trạng thái cuối: file đã mất).
/// - Remove rồi Create -> chỉ Create (file lại tồn tại ở cuối).
/// - Cùng loại -> giữ cái đầu tiên.
fn merge(existing: Kind, incoming: Kind) -> Merge {
    match (existing, incoming) {
        (Kind::Created, Kind::Modified) => Merge::Keep,
        (Kind::Created, Kind::Removed) => Merge::Drop,
        (Kind::Modified, Kind::Removed) => Merge::Replace,
        (Kind::Removed, Kind::Created) => Merge::Replace,
        (a, b) if a == b => Merge::Keep,
        _ => Merge::Replace,
    }
}

struct Entry {
    summary: Summary,
    dropped: bool,
}

/// Gom các event dồn dập trong một cửa sổ debounce thành các dòng
/// log gọn. Giữ thứ tự xuất hiện lần đầu của mỗi đường dẫn.
/// Ngoài gộp theo đường dẫn, còn ghép các nửa rename (From/To/Both)
/// về đúng 1 dòng cho mỗi lần đổi tên (xem `RenameSide`).
#[derive(Default)]
pub struct Coalescer {
    order: Vec<Entry>,
    index: HashMap<String, usize>,
    /// Vị trí của From-single vừa push gần nhất — chỉ có nghĩa khi
    /// nó là event vừa push ngay trước đó (để ghép cặp với To-single
    /// kề sau, kiểu Windows). Mọi push khác đều xóa nó.
    last_from: Option<usize>,
}

impl Coalescer {
    pub fn new() -> Self {
        Self::default()
    }

    /// Đánh dấu hủy một mục theo khóa (nếu có) và gỡ khỏi index.
    /// Chỉ hủy khi tracker tương thích: 2 tracker đều có mà khác nhau
    /// thì chắc chắn là 2 lần đổi tên khác nhau, không được hủy.
    fn drop_if_tracker_compatible(&mut self, key: &str, tracker: Option<usize>) {
        if let Some(i) = self.index.get(key).copied() {
            let other = self.order[i].summary.tracker;
            let compatible = match (other, tracker) {
                (Some(a), Some(b)) => a == b,
                _ => true,
            };
            if compatible {
                self.order[i].dropped = true;
                self.index.remove(key);
            }
        }
    }

    pub fn push(&mut self, summary: Summary) {
        // 1. Ghép cặp From -> To kề nhau (kiểu Windows: backend chỉ
        //    báo 2 nửa, không có Both). Chỉ ghép khi From-single là
        //    event vừa push ngay trước đó — nếu có event khác chen
        //    giữa thì không dám chắc 2 nửa thuộc cùng 1 lần đổi tên
        //    (vd: 1 file đổi tên ra ngoài, 1 file khác đổi tên vào
        //    trong cùng cửa sổ), thà in 2 dòng còn hơn ghép sai.
        if summary.side == Some(RenameSide::To) {
            if let Some(i) = self.last_from {
                // Dùng get() thay vì index trực tiếp: phòng khi
                // last_from trỏ vào mục đã bị dọn (không bao giờ
                // được phép panic ở đây — watcher chạy dài ngày).
                if let Some(entry) = self.order.get(i) {
                    if !entry.dropped && entry.summary.side == Some(RenameSide::From) {
                        let from_path = entry.summary.path.clone();
                        let from_tracker = entry.summary.tracker;
                        let from_time = entry.summary.time.clone();
                        let old_key = format!("R:F>{}", from_path.display());
                        let new_key =
                            format!("R:{}>{}", from_path.display(), summary.path.display());
                        self.index.remove(&old_key);
                        self.last_from = None;
                        if self.index.contains_key(&new_key) {
                            // Cặp này đã có Both rồi (bản sao thừa):
                            // hủy nửa From, giữ Both đã có.
                            self.order[i].dropped = true;
                        } else {
                            self.index.insert(new_key, i);
                            self.order[i].summary = Summary {
                                kind: Kind::Renamed,
                                path: summary.path.clone(),
                                from: Some(from_path),
                                side: Some(RenameSide::Both),
                                tracker: from_tracker,
                                time: from_time,
                            };
                        }
                        return;
                    }
                }
            }
            self.last_from = None;
        }

        // 2. Rename "nuốt" Create của nguồn: file vừa tạo trong cửa sổ
        //    này rồi đổi tên ngay (kiểu lưu atomic của editor: ghi file
        //    tạm rồi rename đè lên file thật) thì chỉ còn dòng rename —
        //    dòng create của tên tạm là ồn. Modified của nguồn vẫn giữ
        //    (file đã tồn tại từ trước, sửa rồi đổi tên là 2 việc thật).
        //    Áp dụng cho Both (nguồn = from) và From-single (nguồn = path).
        let source: Option<PathBuf> = match summary.side {
            Some(RenameSide::Both) => summary.from.clone(),
            Some(RenameSide::From) => Some(summary.path.clone()),
            _ => None,
        };
        if let Some(src) = &source {
            let src_key = format!("P:{}", src.display());
            if let Some(i) = self.index.get(&src_key).copied() {
                if self.order[i].summary.kind == Kind::Created {
                    self.order[i].dropped = true;
                    self.index.remove(&src_key);
                }
            }
        }

        // 3. Both dọn các nửa đơn của cùng lần đổi tên (kiểu inotify:
        //    From, To rồi Both — 2 nửa đơn đã vào trước đó). Khớp theo
        //    đường dẫn + tracker (khi cả 2 đều có tracker mà khác nhau
        //    thì không phải cùng lần đổi tên, xem
        //    `drop_if_tracker_compatible`).
        if summary.side == Some(RenameSide::Both) {
            if let Some(from) = &summary.from {
                let from_key = format!("R:F>{}", from.display());
                self.drop_if_tracker_compatible(&from_key, summary.tracker);
            }
            let to_key = format!("R:T>{}", summary.path.display());
            self.drop_if_tracker_compatible(&to_key, summary.tracker);
        }

        // 4. Gộp theo khóa như thường.
        let key = summary.key();
        let is_from_single = summary.side == Some(RenameSide::From);
        if let Some(&i) = self.index.get(&key) {
            let entry = &mut self.order[i];
            match merge(entry.summary.kind, summary.kind) {
                Merge::Keep => {}
                Merge::Replace => entry.summary = summary,
                Merge::Drop => {
                    // Đánh dấu hủy và gỡ khỏi index: nếu cùng đường
                    // dẫn lại có event mới trong cửa sổ này (vd: tạo
                    // lại sau khi xóa), nó được tính như một mục mới.
                    entry.dropped = true;
                    self.index.remove(&key);
                }
            }
            self.last_from = if is_from_single { Some(i) } else { None };
        } else {
            self.index.insert(key, self.order.len());
            self.order.push(Entry {
                summary,
                dropped: false,
            });
            self.last_from = if is_from_single {
                Some(self.order.len() - 1)
            } else {
                None
            };
        }
    }

    pub fn is_empty(&self) -> bool {
        self.order.iter().all(|e| e.dropped)
    }

    /// Lấy ra các summary đã gộp (theo thứ tự xuất hiện), xóa sạch
    /// để chuẩn bị cho cửa sổ tiếp theo.
    pub fn take(&mut self) -> Vec<Summary> {
        let items = std::mem::take(&mut self.order);
        self.index.clear();
        // BẮT BUỘC: last_from trỏ vào order cũ — không xóa thì cửa sổ
        // sau push To-single sẽ index ra ngoài vec và panic (lỗi thật,
        // bắt được khi test rename-in ngày 2026-11-12).
        self.last_from = None;
        items
            .into_iter()
            .filter(|e| !e.dropped)
            .map(|e| e.summary)
            .collect()
    }
}

/// Bộ lọc đầu ra: đuôi file cho phép và chuỗi đường dẫn cần bỏ qua.
/// Cả hai đều so khớp không phân biệt hoa/thường.
#[derive(Default, Clone)]
pub struct Filter {
    /// Đuôi file (không có dấu chấm, đã lowercase). Rỗng = nhận tất cả.
    pub exts: Vec<String>,
    /// Chuỗi con trong đường dẫn -> bỏ qua. Rỗng = không bỏ gì.
    pub ignores: Vec<String>,
}

impl Filter {
    /// Với rename chỉ xét đường dẫn đích: file đổi tên ra khỏi vùng
    /// bị bỏ qua vẫn đáng ghi nhận.
    pub fn allows(&self, summary: &Summary) -> bool {
        if !self.exts.is_empty() {
            let ok = summary
                .path
                .extension()
                .and_then(|e| e.to_str())
                .map(|e| {
                    let lower = e.to_lowercase();
                    self.exts.iter().any(|x| x == &lower)
                })
                .unwrap_or(false);
            if !ok {
                return false;
            }
        }
        if !self.ignores.is_empty() {
            let hay = summary.path.to_string_lossy().to_lowercase();
            if self.ignores.iter().any(|n| hay.contains(n)) {
                return false;
            }
        }
        true
    }
}

/// Escape chuỗi cho JSON (chỉ đủ dùng cho 1 object 1 dòng).
pub fn json_escape(s: &str) -> String {
    let mut out = String::with_capacity(s.len() + 2);
    for c in s.chars() {
        match c {
            '"' => out.push_str("\\\""),
            '\\' => out.push_str("\\\\"),
            '\n' => out.push_str("\\n"),
            '\r' => out.push_str("\\r"),
            '\t' => out.push_str("\\t"),
            c if (c as u32) < 0x20 => {
                out.push_str(&format!("\\u{:04x}", c as u32));
            }
            c => out.push(c),
        }
    }
    out
}

/// Định danh máy + user chạy watcher, ghi kèm vào mỗi dòng log để
/// gom log từ nhiều máy vẫn biết event nào từ máy nào, user nào.
///
/// - `user`: tên tài khoản đang chạy — biến môi trường USERNAME
///   (Windows) / USER / LOGNAME, nếu không có thì chạy lệnh `whoami`
///   (có sẵn trên Windows/Linux/macOS).
/// - `pc`: "PC ID" = tên máy (hostname) — COMPUTERNAME (Windows) /
///   HOSTNAME / file /etc/hostname, nếu không có thì chạy lệnh
///   `hostname`. Hostname là cách user vẫn gọi tên các máy của mình
///   (vd: desktop-iua61p0, nhhlx1carbon), đủ để phân biệt log giữa
///   các máy. Muốn ID khác thì dùng flag `--pc-id` để ghi đè.
/// - Không đọc được bằng cách nào thì là "unknown", không bao giờ
///   để trống.
///
/// Lệnh `hostname`/`whoami` chỉ chạy 1 lần lúc khởi động và chỉ khi
/// biến môi trường không có — cần thiết vì HOSTNAME là biến shell
/// của bash, không export nên tiến trình con không thấy, và có máy
/// để trống /etc/hostname (bắt được khi test live trên VM
/// 2026-11-13: cả 2 đều thiếu, chỉ còn lệnh mới ra tên máy).
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Identity {
    pub user: String,
    pub pc: String,
}

impl Identity {
    /// Dạng gọn hiện trên banner và giao diện web: `user@pc`.
    pub fn label(&self) -> String {
        format!("{}@{}", self.user, self.pc)
    }
}

fn non_empty(var: &str) -> Option<String> {
    std::env::var(var)
        .ok()
        .map(|v| v.trim().to_string())
        .filter(|v| !v.is_empty())
}

fn detect_hostname() -> String {
    // Windows: COMPUTERNAME. Unix: HOSTNAME, rồi /etc/hostname.
    if let Some(name) = non_empty("COMPUTERNAME") {
        return name;
    }
    if let Some(name) = non_empty("HOSTNAME") {
        return name;
    }
    #[cfg(unix)]
    if let Ok(content) = std::fs::read_to_string("/etc/hostname") {
        let name = content.trim().to_string();
        if !name.is_empty() {
            return name;
        }
    }
    // Lưới cuối: lệnh hostname có sẵn trên Windows/Linux/macOS.
    if let Some(name) = run_command_once("hostname") {
        return name;
    }
    "unknown".to_string()
}

/// Chạy 1 lệnh hệ thống, lấy stdout đã trim. Chỉ dùng 1 lần lúc
/// khởi động để nhận định danh khi biến môi trường thiếu.
fn run_command_once(cmd: &str) -> Option<String> {
    let output = std::process::Command::new(cmd).output().ok()?;
    if !output.status.success() {
        return None;
    }
    let text = String::from_utf8_lossy(&output.stdout).trim().to_string();
    if text.is_empty() {
        None
    } else {
        Some(text)
    }
}

pub fn detect_identity() -> Identity {
    let user = non_empty("USERNAME")
        .or_else(|| non_empty("USER"))
        .or_else(|| non_empty("LOGNAME"))
        .or_else(|| {
            run_command_once("whoami").map(|u| {
                // whoami trên Windows trả về DOMAIN\user — chỉ lấy
                // phần user cho khớp với USERNAME.
                u.rsplit('\\').next().unwrap_or(&u).to_string()
            })
        })
        .unwrap_or_else(|| "unknown".to_string());
    Identity {
        user,
        pc: detect_hostname(),
    }
}

/// Dạng đọc được: `2026-11-12 22:55:01  MODIFIED  lam@may1  D:\code\main.rs`
/// Rename đủ 2 đầu: `...  RENAMED   lam@may1  cũ -> mới`.
/// Chỉ biết 1 đầu: `...  RENAMED   lam@may1  cũ -> ?` (đổi tên đi)
/// hoặc `...  RENAMED   lam@may1  ? -> mới` (đổi tên từ ngoài vào).
pub fn format_human(summary: &Summary, identity: &Identity) -> String {
    let who = identity.label();
    if summary.kind == Kind::Renamed {
        let target = match summary.side {
            Some(RenameSide::Both) => format!(
                "{} -> {}",
                summary.from.as_ref().map(|p| p.display().to_string()).unwrap_or_default(),
                summary.path.display()
            ),
            Some(RenameSide::From) => format!("{} -> ?", summary.path.display()),
            Some(RenameSide::To) => format!("? -> {}", summary.path.display()),
            _ => summary.path.display().to_string(),
        };
        return format!(
            "{}  {:<8}  {}  {}",
            summary.time,
            summary.kind.label(),
            who,
            target
        );
    }
    format!(
        "{}  {:<8}  {}  {}",
        summary.time,
        summary.kind.label(),
        who,
        summary.path.display()
    )
}

/// 1 dòng JSON: `{"time":"...","event":"modified","path":"...","user":"lam","pc":"may1"}`
/// Rename có thêm `"direction":"both"|"from"|"to"|"any"`, và Both
/// có thêm `"from":"..."` (tên cũ).
pub fn format_json(summary: &Summary, identity: &Identity) -> String {
    let mut out = format!(
        "{{\"time\":\"{}\",\"event\":\"{}\",\"path\":\"{}\"",
        json_escape(&summary.time),
        summary.kind.name(),
        json_escape(&summary.path.to_string_lossy())
    );
    if summary.kind == Kind::Renamed {
        let direction = match summary.side {
            Some(RenameSide::Both) => "both",
            Some(RenameSide::From) => "from",
            Some(RenameSide::To) => "to",
            _ => "any",
        };
        out.push_str(&format!(",\"direction\":\"{direction}\""));
        if summary.side == Some(RenameSide::Both) {
            if let Some(from) = &summary.from {
                out.push_str(&format!(",\"from\":\"{}\"", json_escape(&from.to_string_lossy())));
            }
        }
    }
    out.push_str(&format!(
        ",\"user\":\"{}\",\"pc\":\"{}\"",
        json_escape(&identity.user),
        json_escape(&identity.pc)
    ));
    out.push('}');
    out
}

/// Tùy chọn dòng lệnh đã parse xong.
#[derive(Debug, Default)]
pub struct Args {
    /// Thư mục theo dõi (đường dẫn như user gõ, chưa canonicalize).
    pub dirs: Vec<String>,
    /// File cấu hình chứa danh sách thư mục (1 dòng = 1 thư mục).
    pub config: Option<String>,
    /// Mặc định true; `--no-recursive` tắt đi.
    pub recursive: bool,
    /// Cửa sổ gộp event, mili-giây. 0 = in ngay, không gộp.
    pub debounce_ms: u64,
    /// Đuôi file cho phép (lowercase, không dấu chấm). Rỗng = tất cả.
    pub exts: Vec<String>,
    /// Chuỗi con trong đường dẫn -> bỏ qua (lowercase).
    pub ignores: Vec<String>,
    /// File log append thêm (cùng định dạng với stdout).
    pub log: Option<String>,
    /// In JSON thay vì dạng đọc được.
    pub json: bool,
    /// Lệnh chạy mỗi khi có event (placeholder {path} {event} {time} {from}).
    pub exec: Option<String>,
    /// Ghi đè PC ID tự nhận (mặc định: hostname của máy).
    pub pc_id: Option<String>,
    /// Bật giao diện web local (localhost) để cấu hình + xem log realtime.
    pub serve: bool,
    /// Cổng của giao diện web (mặc định 8787).
    pub port: u16,
    pub help: bool,
    pub version: bool,
    /// Các flag dưới đây ghi lại "user có gõ rõ flag này không", để
    /// khi gộp với file cấu hình thì CLI thắng — nếu không, giá trị
    /// mặc định của CLI sẽ vô tình đè cài đặt trong file.
    pub exts_set: bool,
    pub ignores_set: bool,
    pub debounce_set: bool,
    pub recursive_set: bool,
    pub port_set: bool,
}

impl Args {
    fn new() -> Self {
        Args {
            recursive: true,
            debounce_ms: 200,
            port: 8787,
            ..Default::default()
        }
    }
}

pub const VERSION: &str = env!("CARGO_PKG_VERSION");

pub fn usage() -> String {
    format!(
        "file-watcher {VERSION} — lắng nghe thay đổi file trong 1 hoặc nhiều thư mục (nhẹ, nhanh, không polling)\n\
        \n\
        Dùng:\n\
        \x20 file-watcher <thư-mục...> [tùy-chọn]\n\
        \x20 file-watcher --config watch.txt [tùy-chọn]\n\
        \n\
        Tùy chọn:\n\
        \x20 --config <file>       đọc danh sách thư mục từ file text (1 dòng = 1 thư mục, # là ghi chú)\n\
        \x20 --no-recursive        chỉ theo dõi tầng trên cùng (mặc định: đệ quy)\n\
        \x20 --debounce-ms <n>     gộp các event dồn dập trong n mili-giây (mặc định 200; 0 = in ngay)\n\
        \x20 --ext <a,b,c>         chỉ hiện file có đuôi này (vd: rs,md,txt)\n\
        \x20 --ignore <a,b>        bỏ qua đường dẫn chứa chuỗi này (vd: .tmp,~$,node_modules)\n\
        \x20 --log <file>          ghi thêm mọi dòng event vào file (append)\n\
        \x20 --json                in mỗi event 1 dòng JSON thay vì dạng đọc được\n\
        \x20 --exec \"<lệnh>\"       chạy lệnh mỗi khi có event ({{path}} {{event}} {{time}} {{from}} {{user}} {{pc}})\n\
        \x20 --pc-id <id>          ghi đè PC ID trong log (mặc định: hostname của máy)\n\
        \x20 --serve              bật giao diện web local để cấu hình thư mục + xem log realtime\n\
        \x20 --port <n>           cổng giao diện web (mặc định 8787; chỉ có nghĩa với --serve)\n\
        \x20 -h, --help            hiện hướng dẫn này\n\
        \x20 -V, --version         hiện phiên bản\n\
        \n\
        Ví dụ:\n\
        \x20 file-watcher D:\\code\\project\n\
        \x20 file-watcher C:\\a D:\\b --ext rs,md --ignore target,node_modules\n\
        \x20 file-watcher . --log events.log --exec \"echo {{event}} {{path}}\"\n\
        \x20 file-watcher --config watch.txt --serve\n\
        \x20 file-watcher --serve --port 9000\n\
        \n\
        Giao diện web chỉ nghe trên 127.0.0.1 (máy này), mở trình duyệt\n\
        vào http://127.0.0.1:8787 (hoặc cổng đã chọn). Khi bật --serve mà\n\
        không có --config, app dùng file watch.txt ở thư mục hiện tại\n\
        (nếu có) và lưu thay đổi từ giao diện vào đó.\n"
    )
}

pub(crate) fn split_list(value: &str) -> Vec<String> {
    value
        .split(',')
        .map(|s| s.trim().trim_start_matches('.').to_lowercase())
        .filter(|s| !s.is_empty())
        .collect()
}

/// Parse argv (không gồm tên chương trình). Hỗ trợ cả `--flag value`
/// và `--flag=value`. Lỗi trả về thông báo tiếng Việt để in ra stderr.
pub fn parse_args<I, S>(argv: I) -> Result<Args, String>
where
    I: IntoIterator<Item = S>,
    S: AsRef<str>,
{
    let mut args = Args::new();
    let mut positional_only = false;
    let mut iter = argv.into_iter().peekable();

    while let Some(item) = iter.next() {
        let arg = item.as_ref();
        if positional_only {
            args.dirs.push(arg.to_string());
            continue;
        }
        if arg == "--" {
            positional_only = true;
            continue;
        }
        // Tách --flag=value (chỉ cho flag có giá trị).
        let (flag, inline_value) = match arg.strip_prefix("--") {
            Some(rest) => match rest.split_once('=') {
                Some((f, v)) => (format!("--{f}"), Some(v.to_string())),
                None => (arg.to_string(), None),
            },
            None => (arg.to_string(), None),
        };
        // Flag có giá trị: lấy từ --flag=value hoặc từ tham số kế tiếp.
        let take_value = |iter: &mut std::iter::Peekable<I::IntoIter>| -> Result<String, String> {
            if let Some(v) = inline_value.clone() {
                return Ok(v);
            }
            match iter.next() {
                Some(v) => Ok(v.as_ref().to_string()),
                None => Err(format!("thiếu giá trị cho {flag}")),
            }
        };
        match flag.as_str() {
            "-h" | "--help" => args.help = true,
            "-V" | "--version" => args.version = true,
            "--no-recursive" => {
                args.recursive = false;
                args.recursive_set = true;
            }
            "--json" => args.json = true,
            "--serve" => args.serve = true,
            "--config" => args.config = Some(take_value(&mut iter)?),
            "--log" => args.log = Some(take_value(&mut iter)?),
            "--exec" => args.exec = Some(take_value(&mut iter)?),
            "--pc-id" => args.pc_id = Some(take_value(&mut iter)?),
            "--port" => {
                let v = take_value(&mut iter)?;
                let port = v
                    .parse::<u32>()
                    .map_err(|_| format!("--port phải là số nguyên 1-65535, nhận được: {v}"))?;
                if !(1..=65535).contains(&port) {
                    return Err(format!("--port phải là số nguyên 1-65535, nhận được: {v}"));
                }
                args.port = port as u16;
                args.port_set = true;
            }
            "--debounce-ms" => {
                let v = take_value(&mut iter)?;
                args.debounce_ms = v
                    .parse::<u64>()
                    .map_err(|_| format!("--debounce-ms phải là số nguyên >= 0, nhận được: {v}"))?;
                args.debounce_set = true;
            }
            "--ext" => {
                args.exts = split_list(&take_value(&mut iter)?);
                args.exts_set = true;
            }
            "--ignore" => {
                args.ignores = split_list(&take_value(&mut iter)?);
                args.ignores_set = true;
            }
            _ => {
                if flag.starts_with('-') {
                    return Err(format!("tham số không rõ: {flag}"));
                }
                args.dirs.push(flag);
            }
        }
    }
    if args.port_set && !args.serve {
        return Err("--port chỉ có nghĩa khi dùng kèm --serve".to_string());
    }
    Ok(args)
}

/// Cài đặt đi kèm danh sách thư mục trong file cấu hình.
/// Giá trị mặc định = giá trị mặc định của CLI.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Settings {
    pub exts: Vec<String>,
    pub ignores: Vec<String>,
    pub debounce_ms: u64,
    pub recursive: bool,
}

impl Default for Settings {
    fn default() -> Self {
        Settings {
            exts: Vec::new(),
            ignores: Vec::new(),
            debounce_ms: 200,
            recursive: true,
        }
    }
}

/// Đọc file cấu hình: 1 dòng = 1 thư mục, dòng trống và dòng bắt đầu
/// bằng `#` được bỏ qua. Ngoài ra, dòng bắt đầu bằng `@` là cài đặt:
///
/// ```text
/// @exts rs,md
/// @ignore target,node_modules
/// @debounce 200
/// @recursive true
/// ```
///
/// Đường dẫn tương đối được hiểu tương đối theo thư mục chứa file cấu
/// hình. File cũ (chỉ có thư mục, không có dòng @) vẫn đọc bình thường.
pub fn load_config(config_path: &str) -> Result<(Vec<String>, Settings), String> {
    let text = std::fs::read_to_string(config_path)
        .map_err(|e| format!("không đọc được file cấu hình {config_path}: {e}"))?;
    let base = Path::new(config_path)
        .parent()
        .filter(|p| !p.as_os_str().is_empty());
    let mut dirs = Vec::new();
    let mut settings = Settings::default();
    for (lineno, raw) in text.lines().enumerate() {
        let line = raw.trim();
        if line.is_empty() || line.starts_with('#') {
            continue;
        }
        if let Some(rest) = line.strip_prefix('@') {
            let (key, value) = match rest.split_once(char::is_whitespace) {
                Some((k, v)) => (k, v.trim()),
                None => (rest, ""),
            };
            match key {
                "exts" => settings.exts = split_list(value),
                "ignore" => settings.ignores = split_list(value),
                "debounce" => {
                    settings.debounce_ms = value.parse::<u64>().map_err(|_| {
                        format!("{config_path} dòng {}: @debounce phải là số nguyên >= 0, nhận được: {value}", lineno + 1)
                    })?;
                }
                "recursive" => match value {
                    "true" => settings.recursive = true,
                    "false" => settings.recursive = false,
                    _ => {
                        return Err(format!(
                            "{config_path} dòng {}: @recursive phải là true hoặc false, nhận được: {value}",
                            lineno + 1
                        ));
                    }
                },
                _ => {
                    return Err(format!(
                        "{config_path} dòng {}: cài đặt không rõ: @{key} (chỉ có @exts, @ignore, @debounce, @recursive)",
                        lineno + 1
                    ));
                }
            }
            continue;
        }
        let path = Path::new(line);
        if path.is_absolute() || base.is_none() {
            dirs.push(line.to_string());
        } else {
            dirs.push(base.unwrap().join(path).to_string_lossy().into_owned());
        }
    }
    Ok((dirs, settings))
}

/// Ghi lại file cấu hình (danh sách thư mục + cài đặt).
/// Ghi qua file tạm rồi đổi tên để không hỏng file gốc nếu app bị
/// ngắt giữa chừng. Thư mục được ghi nguyên văn như truyền vào
/// (nên truyền đường dẫn đã canonicalize từ giao diện web).
pub fn save_config(config_path: &Path, dirs: &[PathBuf], settings: &Settings) -> Result<(), String> {
    let mut out = String::from(
        "# file-watcher — thư mục theo dõi (tự lưu bởi giao diện web)\n\
         # 1 dòng = 1 thư mục. Dòng bắt đầu bằng @ là cài đặt.\n",
    );
    out.push_str(&format!(
        "@recursive {}\n@debounce {}\n",
        settings.recursive, settings.debounce_ms
    ));
    if !settings.exts.is_empty() {
        out.push_str(&format!("@exts {}\n", settings.exts.join(",")));
    }
    if !settings.ignores.is_empty() {
        out.push_str(&format!("@ignore {}\n", settings.ignores.join(",")));
    }
    for dir in dirs {
        out.push_str(&dir.to_string_lossy());
        out.push('\n');
    }
    let tmp_path = config_path.with_extension("tmp");
    std::fs::write(&tmp_path, out)
        .map_err(|e| format!("không ghi được file cấu hình tạm {}: {e}", tmp_path.display()))?;
    std::fs::rename(&tmp_path, config_path).map_err(|e| {
        let _ = std::fs::remove_file(&tmp_path);
        format!(
            "không lưu được file cấu hình {}: {e}",
            config_path.display()
        )
    })?;
    Ok(())
}

/// Đọc danh sách thư mục từ file cấu hình (bỏ qua các dòng cài đặt @).
pub fn load_config_dirs(config_path: &str) -> Result<Vec<String>, String> {
    Ok(load_config(config_path)?.0)
}

#[cfg(test)]
mod tests {
    use super::*;
    use notify::event::{CreateKind, ModifyKind, RemoveKind, RenameMode};
    use notify::EventKind::{Access, Create, Modify, Other, Remove};
    use std::path::PathBuf;

    fn ev(kind: EventKind, paths: &[&str]) -> notify::Event {
        notify::Event {
            kind,
            paths: paths.iter().map(PathBuf::from).collect(),
            attrs: Default::default(),
        }
    }

    fn sum(kind: Kind, path: &str) -> Summary {
        Summary {
            kind,
            path: PathBuf::from(path),
            from: None,
            side: None,
            tracker: None,
            time: "2026-11-12 22:00:00".to_string(),
        }
    }

    fn ren(side: RenameSide, path: &str, from: Option<&str>, tracker: Option<usize>) -> Summary {
        Summary {
            kind: Kind::Renamed,
            path: PathBuf::from(path),
            from: from.map(PathBuf::from),
            side: Some(side),
            tracker,
            time: "2026-11-12 22:00:00".to_string(),
        }
    }

    fn ident() -> Identity {
        Identity {
            user: "lam".to_string(),
            pc: "may1".to_string(),
        }
    }

    #[test]
    fn summarize_maps_kinds() {
        assert!(matches!(
            summarize(&ev(Create(CreateKind::File), &["/a/f.txt"]), "t".into()).unwrap().kind,
            Kind::Created
        ));
        assert!(matches!(
            summarize(
                &ev(Modify(ModifyKind::Data(notify::event::DataChange::Content)), &["/a/f.txt"]),
                "t".into()
            )
            .unwrap()
            .kind,
            Kind::Modified
        ));
        assert!(matches!(
            summarize(&ev(Remove(RemoveKind::File), &["/a/f.txt"]), "t".into()).unwrap().kind,
            Kind::Removed
        ));
        let renamed = summarize(
            &ev(
                Modify(ModifyKind::Name(RenameMode::Both)),
                &["/a/cu.txt", "/a/moi.txt"],
            ),
            "t".into(),
        )
        .unwrap();
        assert_eq!(renamed.kind, Kind::Renamed);
        assert_eq!(renamed.side, Some(RenameSide::Both));
        assert_eq!(renamed.from.unwrap(), PathBuf::from("/a/cu.txt"));
        assert_eq!(renamed.path, PathBuf::from("/a/moi.txt"));
        let from = summarize(
            &ev(Modify(ModifyKind::Name(RenameMode::From)), &["/a/cu.txt"]),
            "t".into(),
        )
        .unwrap();
        assert_eq!(from.side, Some(RenameSide::From));
        assert_eq!(from.from.unwrap(), PathBuf::from("/a/cu.txt"));
        let to = summarize(
            &ev(Modify(ModifyKind::Name(RenameMode::To)), &["/a/moi.txt"]),
            "t".into(),
        )
        .unwrap();
        assert_eq!(to.side, Some(RenameSide::To));
        assert!(to.from.is_none());
        let any = summarize(
            &ev(Modify(ModifyKind::Name(RenameMode::Any)), &["/a/x.txt"]),
            "t".into(),
        )
        .unwrap();
        assert_eq!(any.side, Some(RenameSide::Any));
        // Access và Other bị bỏ qua.
        assert!(summarize(
            &ev(Access(notify::event::AccessKind::Read), &["/a/f.txt"]),
            "t".into()
        )
        .is_none());
        assert!(summarize(&ev(Other, &["/a/f.txt"]), "t".into()).is_none());
        // Không có đường dẫn -> bỏ qua.
        assert!(summarize(&ev(Create(CreateKind::File), &[]), "t".into()).is_none());
    }

    #[test]
    fn coalescer_merges_same_path() {
        let mut c = Coalescer::new();
        // Create + Modify -> chỉ Create.
        c.push(sum(Kind::Created, "/a/x.rs"));
        c.push(sum(Kind::Modified, "/a/x.rs"));
        // Create + Remove -> mất hẳn (file tạm).
        c.push(sum(Kind::Created, "/a/tmp"));
        c.push(sum(Kind::Removed, "/a/tmp"));
        // Modify + Remove -> chỉ Remove.
        c.push(sum(Kind::Modified, "/a/y.rs"));
        c.push(sum(Kind::Removed, "/a/y.rs"));
        // Remove + Create -> chỉ Create.
        c.push(sum(Kind::Removed, "/a/z.rs"));
        c.push(sum(Kind::Created, "/a/z.rs"));
        let out = c.take();
        assert_eq!(out.len(), 3);
        assert_eq!(out[0].kind, Kind::Created);
        assert_eq!(out[0].path, PathBuf::from("/a/x.rs"));
        assert_eq!(out[1].kind, Kind::Removed);
        assert_eq!(out[1].path, PathBuf::from("/a/y.rs"));
        assert_eq!(out[2].kind, Kind::Created);
        assert_eq!(out[2].path, PathBuf::from("/a/z.rs"));
        assert!(c.is_empty());
    }

    #[test]
    fn coalescer_rename_swallows_source_create() {
        let mut c = Coalescer::new();
        // Lưu atomic: tạo file tạm rồi rename đè lên file thật.
        c.push(sum(Kind::Created, "/a/.tmp123"));
        c.push(ren(RenameSide::Both, "/a/final.txt", Some("/a/.tmp123"), None));
        let out = c.take();
        assert_eq!(out.len(), 1);
        assert_eq!(out[0].kind, Kind::Renamed);
        assert_eq!(out[0].path, PathBuf::from("/a/final.txt"));

        // Nhưng Modified của nguồn vẫn giữ lại.
        let mut c = Coalescer::new();
        c.push(sum(Kind::Modified, "/a/old.txt"));
        c.push(ren(RenameSide::Both, "/a/new.txt", Some("/a/old.txt"), None));
        let out = c.take();
        assert_eq!(out.len(), 2);
        assert_eq!(out[0].kind, Kind::Modified);
        assert_eq!(out[1].kind, Kind::Renamed);
    }

    #[test]
    fn coalescer_inotify_triple_becomes_one_line() {
        // inotify: 1 lần mv sinh ra From, To, Both (chung tracker).
        let mut c = Coalescer::new();
        c.push(ren(RenameSide::From, "/a/cu.txt", Some("/a/cu.txt"), Some(7)));
        c.push(ren(RenameSide::To, "/a/moi.txt", None, Some(7)));
        c.push(ren(RenameSide::Both, "/a/moi.txt", Some("/a/cu.txt"), Some(7)));
        let out = c.take();
        assert_eq!(out.len(), 1);
        assert_eq!(out[0].side, Some(RenameSide::Both));
        assert_eq!(
            format_human(&out[0], &ident()),
            "2026-11-12 22:00:00  RENAMED   lam@may1  /a/cu.txt -> /a/moi.txt"
        );
    }

    #[test]
    fn coalescer_both_cleans_interleaved_singles() {
        // Có event chen giữa From và To nên không ghép cặp kề được;
        // Both đến sau vẫn dọn sạch 2 nửa đơn.
        let mut c = Coalescer::new();
        c.push(ren(RenameSide::From, "/a/cu.txt", Some("/a/cu.txt"), Some(7)));
        c.push(sum(Kind::Created, "/a/other.txt"));
        c.push(ren(RenameSide::To, "/a/moi.txt", None, Some(7)));
        c.push(ren(RenameSide::Both, "/a/moi.txt", Some("/a/cu.txt"), Some(7)));
        let out = c.take();
        assert_eq!(out.len(), 2);
        assert_eq!(out[0].kind, Kind::Created);
        assert_eq!(out[1].side, Some(RenameSide::Both));
    }

    #[test]
    fn coalescer_windows_pair_becomes_one_line() {
        // Windows: chỉ có From rồi To kề nhau, không Both, không tracker.
        let mut c = Coalescer::new();
        c.push(ren(RenameSide::From, "/a/cu.txt", Some("/a/cu.txt"), None));
        c.push(ren(RenameSide::To, "/a/moi.txt", None, None));
        let out = c.take();
        assert_eq!(out.len(), 1);
        assert_eq!(out[0].side, Some(RenameSide::Both));
        assert_eq!(
            format_human(&out[0], &ident()),
            "2026-11-12 22:00:00  RENAMED   lam@may1  /a/cu.txt -> /a/moi.txt"
        );
    }

    #[test]
    fn coalescer_lone_rename_singles_stay_separate() {
        // From và To không kề nhau: có thể là 2 lần đổi tên khác nhau
        // (1 file ra ngoài, 1 file vào trong) — không được ghép sai.
        let mut c = Coalescer::new();
        c.push(ren(RenameSide::From, "/a/out.txt", Some("/a/out.txt"), None));
        c.push(sum(Kind::Created, "/a/x.txt"));
        c.push(ren(RenameSide::To, "/a/in.txt", None, None));
        let out = c.take();
        assert_eq!(out.len(), 3);
        assert_eq!(out[0].side, Some(RenameSide::From));
        assert_eq!(out[2].side, Some(RenameSide::To));
        assert_eq!(
            format_human(&out[0], &ident()),
            "2026-11-12 22:00:00  RENAMED   lam@may1  /a/out.txt -> ?"
        );
        assert_eq!(
            format_human(&out[2], &ident()),
            "2026-11-12 22:00:00  RENAMED   lam@may1  ? -> /a/in.txt"
        );
        assert!(format_json(&out[0], &ident()).contains("\"direction\":\"from\""));
        assert!(format_json(&out[2], &ident()).contains("\"direction\":\"to\""));
    }

    #[test]
    fn coalescer_both_keeps_different_tracker_single() {
        // From-single trùng đường dẫn nguồn nhưng tracker khác (lần
        // đổi tên khác) thì Both không được hủy nó.
        let mut c = Coalescer::new();
        c.push(ren(RenameSide::From, "/a/cu.txt", Some("/a/cu.txt"), Some(9)));
        c.push(sum(Kind::Created, "/a/other.txt"));
        c.push(ren(RenameSide::Both, "/a/moi.txt", Some("/a/cu.txt"), Some(7)));
        let out = c.take();
        assert_eq!(out.len(), 3);
        assert_eq!(out[0].side, Some(RenameSide::From));
        assert_eq!(out[2].side, Some(RenameSide::Both));
    }

    #[test]
    fn coalescer_no_pairing_across_windows() {
        // Hồi quy (lỗi thật 2026-11-12): take() phải xóa last_from,
        // nếu không cửa sổ sau push To-single sẽ index ra ngoài vec
        // và panic. From ở cửa sổ trước + To ở cửa sổ sau không được
        // ghép cặp (không kề nhau), To ở lại 1 mình.
        let mut c = Coalescer::new();
        c.push(ren(RenameSide::From, "/a/out.txt", Some("/a/out.txt"), None));
        let out = c.take();
        assert_eq!(out.len(), 1);
        c.push(ren(RenameSide::To, "/a/in.txt", None, None));
        let out = c.take();
        assert_eq!(out.len(), 1);
        assert_eq!(out[0].side, Some(RenameSide::To));
    }

    #[test]
    fn coalescer_recreate_after_ephemeral_is_kept() {
        let mut c = Coalescer::new();
        c.push(sum(Kind::Created, "/a/x"));
        c.push(sum(Kind::Removed, "/a/x"));
        c.push(sum(Kind::Created, "/a/x"));
        let out = c.take();
        assert_eq!(out.len(), 1);
        assert_eq!(out[0].kind, Kind::Created);
    }

    #[test]
    fn filter_ext_and_ignore() {
        let f = Filter {
            exts: vec!["rs".to_string(), "md".to_string()],
            ignores: vec!["target".to_string(), ".tmp".to_string()],
        };
        assert!(f.allows(&sum(Kind::Created, "/a/main.rs")));
        assert!(f.allows(&sum(Kind::Created, "/a/Doc.MD")));
        assert!(!f.allows(&sum(Kind::Created, "/a/note.txt")));
        assert!(!f.allows(&sum(Kind::Created, "/a/target/main.rs")));
        assert!(!f.allows(&sum(Kind::Created, "/a/x.rs.tmp")));
        assert!(!f.allows(&sum(Kind::Created, "/a/noext")));
    }

    #[test]
    fn json_escape_and_format() {
        assert_eq!(json_escape("a\"b\\c\nd"), "a\\\"b\\\\c\\nd");
        assert_eq!(json_escape("tiếng Việt"), "tiếng Việt");
        let s = ren(RenameSide::Both, "/a/mới.txt", Some("/a/cũ.txt"), None);
        assert_eq!(
            format_json(&s, &ident()),
            "{\"time\":\"2026-11-12 22:00:00\",\"event\":\"renamed\",\"path\":\"/a/mới.txt\",\"direction\":\"both\",\"from\":\"/a/cũ.txt\",\"user\":\"lam\",\"pc\":\"may1\"}"
        );
        assert_eq!(
            format_human(&s, &ident()),
            "2026-11-12 22:00:00  RENAMED   lam@may1  /a/cũ.txt -> /a/mới.txt"
        );
    }

    #[test]
    fn detect_identity_never_empty() {
        // Giá trị thật tùy máy chạy test, chỉ khẳng định không bao giờ
        // để trống và label() có dạng user@pc.
        let id = detect_identity();
        assert!(!id.user.is_empty());
        assert!(!id.pc.is_empty());
        assert_eq!(id.label(), format!("{}@{}", id.user, id.pc));
    }

    #[test]
    fn parse_args_basic() {
        let a = parse_args(["/a", "/b", "--ext", "rs,md", "--debounce-ms=0", "--json"]).unwrap();
        assert_eq!(a.dirs, vec!["/a", "/b"]);
        assert_eq!(a.exts, vec!["rs", "md"]);
        assert_eq!(a.debounce_ms, 0);
        assert!(a.json);
        assert!(a.recursive);
        let a = parse_args(["--no-recursive", "--", "--weird-dir"]).unwrap();
        assert!(!a.recursive);
        assert_eq!(a.dirs, vec!["--weird-dir"]);
        assert!(parse_args(["--unknown"]).is_err());
        assert!(parse_args(["--debounce-ms", "abc"]).is_err());
        assert!(parse_args(["--log"]).is_err());
        let a = parse_args(["--ignore", ".TMP, ~$"]).unwrap();
        assert_eq!(a.ignores, vec!["tmp", "~$"]);
        let a = parse_args(["--pc-id", "may-phong-ke-toan"]).unwrap();
        assert_eq!(a.pc_id.as_deref(), Some("may-phong-ke-toan"));
        assert!(parse_args(["--pc-id"]).is_err());
    }

    #[test]
    fn parse_args_serve_and_set_flags() {
        let a = parse_args(["--serve"]).unwrap();
        assert!(a.serve);
        assert_eq!(a.port, 8787);
        assert!(!a.port_set);
        let a = parse_args(["--serve", "--port", "9000"]).unwrap();
        assert_eq!(a.port, 9000);
        assert!(a.port_set);
        // --port mà không có --serve thì lỗi.
        assert!(parse_args(["--port", "9000"]).is_err());
        assert!(parse_args(["--serve", "--port", "0"]).is_err());
        assert!(parse_args(["--serve", "--port", "70000"]).is_err());
        // Cờ *_set chỉ bật khi user gõ rõ.
        let a = parse_args(["--ext", "rs"]).unwrap();
        assert!(a.exts_set);
        assert!(!a.ignores_set);
        assert!(!a.debounce_set);
        assert!(!a.recursive_set);
        let a = parse_args(["--no-recursive", "--debounce-ms", "50", "--ignore", "tmp"]).unwrap();
        assert!(a.recursive_set);
        assert!(a.debounce_set);
        assert!(a.ignores_set);
        assert!(!a.exts_set);
    }

    #[test]
    fn config_settings_roundtrip() {
        let dir = std::env::temp_dir().join("file-watcher-test-config");
        let _ = std::fs::create_dir_all(&dir);
        let path = dir.join("watch.txt");
        // File cũ chỉ có thư mục: đọc được, cài đặt mặc định.
        std::fs::write(&path, "# ghi chú\n\n/a/code\nb/relative\n").unwrap();
        let (dirs, settings) = load_config(path.to_str().unwrap()).unwrap();
        assert_eq!(dirs.len(), 2);
        assert_eq!(dirs[0], "/a/code");
        assert!(dirs[1].ends_with("b/relative"));
        assert_eq!(settings, Settings::default());
        // File có dòng @: parse đủ 4 cài đặt, lỗi rõ khi sai.
        std::fs::write(
            &path,
            "@exts rs,MD\n@ignore target, .tmp\n@debounce 50\n@recursive false\n/a/x\n",
        )
        .unwrap();
        let (dirs, settings) = load_config(path.to_str().unwrap()).unwrap();
        assert_eq!(dirs, vec!["/a/x"]);
        assert_eq!(settings.exts, vec!["rs", "md"]);
        assert_eq!(settings.ignores, vec!["target", "tmp"]);
        assert_eq!(settings.debounce_ms, 50);
        assert!(!settings.recursive);
        std::fs::write(&path, "@debounce abc\n").unwrap();
        assert!(load_config(path.to_str().unwrap()).is_err());
        std::fs::write(&path, "@recursive maybe\n").unwrap();
        assert!(load_config(path.to_str().unwrap()).is_err());
        std::fs::write(&path, "@la-mot-cai-gi-do 1\n").unwrap();
        assert!(load_config(path.to_str().unwrap()).is_err());
        // Ghi lại rồi đọc lại: khớp.
        let settings = Settings {
            exts: vec!["rs".to_string()],
            ignores: vec![],
            debounce_ms: 300,
            recursive: true,
        };
        save_config(
            &path,
            &[PathBuf::from("/a/one"), PathBuf::from("/b/two")],
            &settings,
        )
        .unwrap();
        let (dirs, back) = load_config(path.to_str().unwrap()).unwrap();
        assert_eq!(dirs, vec!["/a/one", "/b/two"]);
        assert_eq!(back, settings);
        // File tạm không còn sót lại.
        assert!(!dir.join("watch.tmp").exists());
        let _ = std::fs::remove_dir_all(&dir);
    }
}
