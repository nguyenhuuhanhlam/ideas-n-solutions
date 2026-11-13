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
    /// Kích thước file (byte) sau thay đổi này. Với Removed: kích
    /// thước biết được lần cuối trước khi xóa. None khi không stat
    /// được (thư mục, file đã mất mà chưa từng thấy). Gắn lúc flush,
    /// không phải lúc summarize (xem `SizeTracker`).
    pub size: Option<u64>,
    /// Chênh lệch kích thước so với lần biết trước đó (byte, có dấu).
    /// Chỉ có khi cả size cũ và mới đều biết. None cho lần đầu thấy
    /// file và cho Removed.
    pub delta: Option<i64>,
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
            size: None,
            delta: None,
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
                        size: None,
                        delta: None,
                    })
                }
                RenameMode::From => Some(Summary {
                    kind: Kind::Renamed,
                    from: Some(event.paths[0].clone()),
                    path: event.paths[0].clone(),
                    side: Some(RenameSide::From),
                    tracker,
                    time,
                    size: None,
                    delta: None,
                }),
                RenameMode::To => Some(Summary {
                    kind: Kind::Renamed,
                    from: None,
                    path: event.paths[0].clone(),
                    side: Some(RenameSide::To),
                    tracker,
                    time,
                    size: None,
                    delta: None,
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
                    size: None,
                    delta: None,
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
            size: None,
            delta: None,
        }),
        EventKind::Remove(_) => Some(Summary {
            kind: Kind::Removed,
            path: event.paths[0].clone(),
            from: None,
            side: None,
            tracker: None,
            time,
            size: None,
            delta: None,
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
                                size: None,
                                delta: None,
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

/// Ghi nhớ kích thước file đã thấy để tính chênh lệch (delta) cho
/// lần thay đổi sau. Logic thuần (không stat ở đây): `main.rs` stat
/// file lúc flush rồi gọi `observe`.
///
/// Vì sao gắn size lúc flush thay vì lúc nhận event: `Coalescer`
/// gộp nhiều event trong cửa sổ debounce thành 1 dòng — size gắn
/// lúc nhận event sẽ lỗi thời ngay khi event sau trong cùng cửa sổ
/// đổi file tiếp. Stat 1 lần lúc flush cho ra size mới nhất và
/// delta đúng (so với lần flush trước), lại ít syscall hơn.
///
/// Không quét trước thư mục lúc khởi động (đắt với cây thư mục lớn,
/// tốn RAM): delta chỉ xuất hiện từ lần thứ hai thấy cùng 1 file.
/// Lần đầu thấy file chỉ hiện size, không có delta — README ghi rõ.
#[derive(Default)]
pub struct SizeTracker {
    sizes: HashMap<PathBuf, u64>,
}

impl SizeTracker {
    pub fn new() -> Self {
        Self::default()
    }

    /// Ghi nhận 1 event đã gộp sắp được in. `current` là kích thước
    /// stat được lúc flush (None = không phải file thường / đã mất).
    /// Trả về (size để hiện, delta so với lần biết trước).
    /// - File còn: delta = mới − cũ (nếu đã biết cũ); cập nhật cache.
    /// - File mất (`removed`): trả size biết lần cuối rồi quên cache.
    /// - Stat lỗi nhưng không phải Removed: giữ cache, hiện size cũ
    ///   (nếu có) để log không trống vô cớ.
    pub fn observe(
        &mut self,
        path: &Path,
        current: Option<u64>,
        removed: bool,
    ) -> (Option<u64>, Option<i64>) {
        match current {
            Some(n) => {
                let delta = self.sizes.get(path).map(|old| n as i64 - *old as i64);
                self.sizes.insert(path.to_path_buf(), n);
                (Some(n), delta)
            }
            None => {
                if removed {
                    (self.sizes.remove(path), None)
                } else {
                    (self.sizes.get(path).copied(), None)
                }
            }
        }
    }

    /// Đổi tên: chuyển cache từ nguồn sang đích để delta của đích
    /// tính đúng (thường là ±0). Nếu đích đã có cache (file bị ghi
    /// đè bởi lần đổi tên, kiểu lưu atomic) thì giữ cache của đích
    /// — delta khi đó mới đúng (so với nội dung cũ của đích).
    pub fn rename(&mut self, from: &Path, to: &Path) {
        if let Some(size) = self.sizes.remove(from) {
            self.sizes.entry(to.to_path_buf()).or_insert(size);
        }
    }
}

/// Định dạng byte cho người đọc, đơn vị 1024, 1 chữ số thập phân
/// với dấu phẩy (kiểu Việt Nam): `512 B`, `15,1 KB`, `2,0 MB`.
pub fn format_bytes(n: u64) -> String {
    const KB: f64 = 1024.0;
    const MB: f64 = 1024.0 * 1024.0;
    const GB: f64 = 1024.0 * 1024.0 * 1024.0;
    let n = n as f64;
    if n < KB {
        format!("{} B", n as u64)
    } else if n < MB {
        format!("{:.1} KB", n / KB).replace('.', ",")
    } else if n < GB {
        format!("{:.1} MB", n / MB).replace('.', ",")
    } else {
        format!("{:.1} GB", n / GB).replace('.', ",")
    }
}

/// Định dạng delta có dấu: `+2,8 KB`, `-512 B`, `±0 B`.
fn format_delta(d: i64) -> String {
    if d == 0 {
        return "±0 B".to_string();
    }
    let sign = if d > 0 { "+" } else { "-" };
    format!("{sign}{}", format_bytes(d.unsigned_abs()))
}

/// Phần kích thước trong dòng log dạng đọc được:
/// `15,1 KB (+2,8 KB)`, `15,1 KB` (chưa biết delta), `—` (không rõ).
fn size_part(summary: &Summary) -> String {
    match summary.size {
        None => "—".to_string(),
        Some(n) => match summary.delta {
            Some(d) => format!("{} ({})", format_bytes(n), format_delta(d)),
            None => format_bytes(n),
        },
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

/// Dạng đọc được: `2026-11-12 22:55:01  MODIFIED  lam@may1  15,1 KB (+2,8 KB)  D:\code\main.rs`
/// Rename đủ 2 đầu: `...  RENAMED   lam@may1  15,1 KB  cũ -> mới`.
/// Chỉ biết 1 đầu: `...  RENAMED   lam@may1  12,3 KB  cũ -> ?` (đổi tên đi)
/// hoặc `...  RENAMED   lam@may1  12,3 KB  ? -> mới` (đổi tên từ ngoài vào).
/// Không rõ size (thư mục, file mất mà chưa từng thấy): cột size là `—`.
pub fn format_human(summary: &Summary, identity: &Identity) -> String {
    let who = identity.label();
    let size = size_part(summary);
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
            "{}  {:<8}  {}  {}  {}",
            summary.time,
            summary.kind.label(),
            who,
            size,
            target
        );
    }
    format!(
        "{}  {:<8}  {}  {}  {}",
        summary.time,
        summary.kind.label(),
        who,
        size,
        summary.path.display()
    )
}

/// 1 dòng JSON: `{"time":"...","event":"modified","path":"...","user":"lam","pc":"may1","size":15432,"delta":2871}`
/// Rename có thêm `"direction":"both"|"from"|"to"|"any"`, và Both
/// có thêm `"from":"..."` (tên cũ). `"size"` là byte (số nguyên),
/// chỉ có khi stat được; `"delta"` là chênh lệch byte (có dấu),
/// chỉ có khi cả size cũ và mới đều biết.
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
    if let Some(size) = summary.size {
        out.push_str(&format!(",\"size\":{size}"));
    }
    if let Some(delta) = summary.delta {
        out.push_str(&format!(",\"delta\":{delta}"));
    }
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
        \x20 file-watcher --config watch.json [tùy-chọn]\n\
        \n\
        Tùy chọn:\n\
        \x20 --config <file>       đọc cấu hình từ file JSON (xem watch.example.json; file text cũ vẫn đọc được)\n\
        \x20 --no-recursive        chỉ theo dõi tầng trên cùng (mặc định: đệ quy)\n\
        \x20 --debounce-ms <n>     gộp các event dồn dập trong n mili-giây (mặc định 200; 0 = in ngay)\n\
        \x20 --ext <a,b,c>         chỉ hiện file có đuôi này (vd: rs,md,txt)\n\
        \x20 --ignore <a,b>        bỏ qua đường dẫn chứa chuỗi này (vd: .tmp,~$,node_modules)\n\
        \x20 --log <file>          ghi thêm mọi dòng event vào file (append)\n\
        \x20 --json                in mỗi event 1 dòng JSON thay vì dạng đọc được\n\
        \x20 --exec \"<lệnh>\"       chạy lệnh mỗi khi có event ({{path}} {{event}} {{time}} {{from}} {{user}} {{pc}} {{size}} {{delta}})\n\
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
        \x20 file-watcher --config watch.json --serve\n\
        \x20 file-watcher --serve --port 9000\n\
        \n\
        Giao diện web chỉ nghe trên 127.0.0.1 (máy này), mở trình duyệt\n\
        vào http://127.0.0.1:8787 (hoặc cổng đã chọn). Khi bật --serve mà\n\
        không có --config, app dùng file watch.json ở thư mục hiện tại\n\
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

/// 1 file được ghim trong giao diện web (tab Đã ghim).
/// Ghim là đường dẫn cố định: file bị đổi tên thì ghim ở lại đường
/// dẫn cũ, không chạy theo tên mới (chốt với user 2026-11-13).
/// `command` để dành cho quy trình xử lý riêng theo file (vd: chạy
/// lệnh khi file này bị sửa) — chưa dùng ở 0.5.0, luôn None; file
/// cấu hình hiện chỉ lưu đường dẫn.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Pin {
    pub path: PathBuf,
    pub command: Option<String>,
}

impl Pin {
    pub fn new(path: PathBuf) -> Self {
        Pin {
            path,
            command: None,
        }
    }
}

/// Cài đặt đi kèm danh sách thư mục trong file cấu hình.
/// Giá trị mặc định = giá trị mặc định của CLI.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Settings {
    pub exts: Vec<String>,
    pub ignores: Vec<String>,
    pub debounce_ms: u64,
    pub recursive: bool,
    pub pins: Vec<Pin>,
}

impl Default for Settings {
    fn default() -> Self {
        Settings {
            exts: Vec::new(),
            ignores: Vec::new(),
            debounce_ms: 200,
            recursive: true,
            pins: Vec::new(),
        }
    }
}

/// Giá trị JSON tối thiểu, đủ cho file cấu hình (không dùng serde để
/// giữ đúng 2 dependency của crate). Số giữ nguyên chuỗi gốc để kiểm
/// tra số nguyên chính xác khi cần.
#[derive(Debug, Clone, PartialEq)]
enum JsonValue {
    Null,
    Bool(bool),
    Number(String),
    Str(String),
    Array(Vec<JsonValue>),
    Object(Vec<(String, JsonValue)>),
}

/// Parser JSON đệ quy viết tay (RFC 8259): object, array, string (cả
/// escape \uXXXX và cặp surrogate), number, true/false/null. Giới hạn
/// độ sâu 64 để file lạ không làm tràn stack. Lỗi kèm vị trí byte để
/// người sửa file biết chỗ nào sai.
struct JsonParser<'a> {
    src: &'a [u8],
    pos: usize,
}

impl<'a> JsonParser<'a> {
    fn new(src: &'a str) -> Self {
        JsonParser {
            src: src.as_bytes(),
            pos: 0,
        }
    }

    fn err(&self, msg: &str) -> String {
        format!("lỗi JSON tại vị trí {}: {msg}", self.pos)
    }

    fn peek(&self) -> Option<u8> {
        self.src.get(self.pos).copied()
    }

    fn skip_ws(&mut self) {
        while matches!(self.peek(), Some(b' ' | b'\t' | b'\n' | b'\r')) {
            self.pos += 1;
        }
    }

    fn parse(&mut self) -> Result<JsonValue, String> {
        self.skip_ws();
        let v = self.parse_value(0)?;
        self.skip_ws();
        if self.pos != self.src.len() {
            return Err(self.err("còn ký tự thừa sau giá trị JSON"));
        }
        Ok(v)
    }

    fn parse_value(&mut self, depth: usize) -> Result<JsonValue, String> {
        if depth > 64 {
            return Err(self.err("JSON lồng nhau quá sâu (quá 64 cấp)"));
        }
        self.skip_ws();
        match self.peek() {
            Some(b'{') => self.parse_object(depth),
            Some(b'[') => self.parse_array(depth),
            Some(b'"') => Ok(JsonValue::Str(self.parse_string()?)),
            Some(b't') => self.parse_literal("true", JsonValue::Bool(true)),
            Some(b'f') => self.parse_literal("false", JsonValue::Bool(false)),
            Some(b'n') => self.parse_literal("null", JsonValue::Null),
            Some(b'-') | Some(b'0'..=b'9') => self.parse_number(),
            Some(_) => Err(self.err("ký tự không hợp lệ, chờ giá trị JSON")),
            None => Err(self.err("hết file giữa chừng, chờ giá trị JSON")),
        }
    }

    fn parse_literal(&mut self, lit: &str, value: JsonValue) -> Result<JsonValue, String> {
        if self.src[self.pos..].starts_with(lit.as_bytes()) {
            self.pos += lit.len();
            Ok(value)
        } else {
            Err(self.err("giá trị true/false/null viết sai"))
        }
    }

    fn parse_object(&mut self, depth: usize) -> Result<JsonValue, String> {
        self.pos += 1; // '{'
        let mut entries = Vec::new();
        self.skip_ws();
        if self.peek() == Some(b'}') {
            self.pos += 1;
            return Ok(JsonValue::Object(entries));
        }
        loop {
            self.skip_ws();
            if self.peek() != Some(b'"') {
                return Err(self.err("chờ tên khóa (chuỗi trong ngoặc kép)"));
            }
            let key = self.parse_string()?;
            if entries.iter().any(|(k, _)| k == &key) {
                return Err(format!("lỗi JSON: khóa trùng lặp \"{key}\""));
            }
            self.skip_ws();
            if self.peek() != Some(b':') {
                return Err(self.err("chờ dấu ':' sau tên khóa"));
            }
            self.pos += 1;
            let value = self.parse_value(depth + 1)?;
            entries.push((key, value));
            self.skip_ws();
            match self.peek() {
                Some(b',') => {
                    self.pos += 1;
                }
                Some(b'}') => {
                    self.pos += 1;
                    return Ok(JsonValue::Object(entries));
                }
                _ => return Err(self.err("chờ ',' hoặc '}' trong object")),
            }
        }
    }

    fn parse_array(&mut self, depth: usize) -> Result<JsonValue, String> {
        self.pos += 1; // '['
        let mut items = Vec::new();
        self.skip_ws();
        if self.peek() == Some(b']') {
            self.pos += 1;
            return Ok(JsonValue::Array(items));
        }
        loop {
            let value = self.parse_value(depth + 1)?;
            items.push(value);
            self.skip_ws();
            match self.peek() {
                Some(b',') => {
                    self.pos += 1;
                }
                Some(b']') => {
                    self.pos += 1;
                    return Ok(JsonValue::Array(items));
                }
                _ => return Err(self.err("chờ ',' hoặc ']' trong array")),
            }
        }
    }

    fn parse_string(&mut self) -> Result<String, String> {
        // self.peek() == '"'
        self.pos += 1;
        let mut out = String::new();
        loop {
            let Some(b) = self.peek() else {
                return Err(self.err("chuỗi chưa đóng ngoặc kép đã hết file"));
            };
            match b {
                b'"' => {
                    self.pos += 1;
                    return Ok(out);
                }
                b'\\' => {
                    self.pos += 1;
                    let esc = self.peek().ok_or_else(|| self.err("dấu \\ ở cuối file"))?;
                    self.pos += 1;
                    match esc {
                        b'"' => out.push('"'),
                        b'\\' => out.push('\\'),
                        b'/' => out.push('/'),
                        b'b' => out.push('\u{0008}'),
                        b'f' => out.push('\u{000C}'),
                        b'n' => out.push('\n'),
                        b'r' => out.push('\r'),
                        b't' => out.push('\t'),
                        b'u' => {
                            let cp = self.parse_hex4()?;
                            if (0xD800..0xDC00).contains(&cp) {
                                // Surrogate cao: chờ \uDC00-\uDFFF theo sau.
                                if self.peek() == Some(b'\\')
                                    && self.src.get(self.pos + 1) == Some(&b'u')
                                {
                                    self.pos += 2;
                                    let lo = self.parse_hex4()?;
                                    if (0xDC00..0xE000).contains(&lo) {
                                        let c = 0x10000 + ((cp - 0xD800) << 10) + (lo - 0xDC00);
                                        out.push(char::from_u32(c).unwrap_or('\u{FFFD}'));
                                    } else {
                                        return Err(self.err("cặp surrogate \\u không hợp lệ"));
                                    }
                                } else {
                                    return Err(self.err("surrogate cao \\u thiếu nửa sau"));
                                }
                            } else if (0xDC00..0xE000).contains(&cp) {
                                return Err(self.err("surrogate thấp \\u đứng một mình"));
                            } else {
                                out.push(char::from_u32(cp).unwrap_or('\u{FFFD}'));
                            }
                        }
                        _ => return Err(self.err("ký tự escape không hợp lệ sau dấu \\")),
                    }
                }
                0x00..=0x1F => {
                    return Err(self.err("ký tự điều khiển trong chuỗi phải viết dạng \\uXXXX"));
                }
                _ => {
                    // Ký tự UTF-8 thường: lấy cả char (không cắt giữa
                    // chừng). Đầu vào đã là String hợp lệ nên from_utf8
                    // chỉ lỗi khi gặp byte tiếp nối đứng lẻ.
                    let len = if b < 0x80 {
                        1
                    } else if b < 0xE0 {
                        2
                    } else if b < 0xF0 {
                        3
                    } else {
                        4
                    };
                    let chunk = self
                        .src
                        .get(self.pos..self.pos + len)
                        .ok_or_else(|| self.err("chuỗi UTF-8 bị cắt giữa chừng"))?;
                    let s = std::str::from_utf8(chunk)
                        .map_err(|_| self.err("chuỗi không phải UTF-8 hợp lệ"))?;
                    out.push(s.chars().next().unwrap());
                    self.pos += len;
                }
            }
        }
    }

    fn parse_hex4(&mut self) -> Result<u32, String> {
        if self.pos + 4 > self.src.len() {
            return Err(self.err("escape \\u thiếu 4 chữ số hex"));
        }
        let mut v: u32 = 0;
        for _ in 0..4 {
            let b = self.src[self.pos];
            let d = match b {
                b'0'..=b'9' => (b - b'0') as u32,
                b'a'..=b'f' => (b - b'a' + 10) as u32,
                b'A'..=b'F' => (b - b'A' + 10) as u32,
                _ => return Err(self.err("escape \\u chứa ký tự không phải hex")),
            };
            v = (v << 4) | d;
            self.pos += 1;
        }
        Ok(v)
    }

    fn parse_number(&mut self) -> Result<JsonValue, String> {
        let start = self.pos;
        if self.peek() == Some(b'-') {
            self.pos += 1;
        }
        match self.peek() {
            Some(b'0') => {
                self.pos += 1;
            }
            Some(b'1'..=b'9') => {
                while matches!(self.peek(), Some(b'0'..=b'9')) {
                    self.pos += 1;
                }
            }
            _ => return Err(self.err("số viết sai (chờ chữ số)")),
        }
        if self.peek() == Some(b'.') {
            self.pos += 1;
            if !matches!(self.peek(), Some(b'0'..=b'9')) {
                return Err(self.err("số viết sai (sau dấu . phải có chữ số)"));
            }
            while matches!(self.peek(), Some(b'0'..=b'9')) {
                self.pos += 1;
            }
        }
        if matches!(self.peek(), Some(b'e' | b'E')) {
            self.pos += 1;
            if matches!(self.peek(), Some(b'+' | b'-')) {
                self.pos += 1;
            }
            if !matches!(self.peek(), Some(b'0'..=b'9')) {
                return Err(self.err("số viết sai (sau e phải có chữ số)"));
            }
            while matches!(self.peek(), Some(b'0'..=b'9')) {
                self.pos += 1;
            }
        }
        let raw = std::str::from_utf8(&self.src[start..self.pos])
            .unwrap()
            .to_string();
        Ok(JsonValue::Number(raw))
    }
}

/// Đọc file cấu hình.
///
/// Định dạng chuẩn từ 0.8.0 là JSON (xem `watch.example.json`):
///
/// ```json
/// {
///   "dirs": ["D:\\code\\project"],
///   "recursive": true,
///   "debounce_ms": 200,
///   "exts": ["rs", "md"],
///   "ignores": ["target"],
///   "pins": [{ "path": "D:\\code\\project\\quan-trong.txt", "command": null }]
/// }
/// ```
///
/// Mọi trường đều không bắt buộc (thiếu thì dùng mặc định). Khóa lạ
/// hoặc sai kiểu thì báo lỗi rõ ràng, không chạy với cài đặt đoán mò.
///
/// File cũ dạng text (1 dòng = 1 thư mục, dòng `@...` là cài đặt)
/// vẫn đọc bình thường — nhận biết bằng nội dung (bắt đầu bằng `{`
/// hoặc `[` thì hiểu là JSON, còn lại là dạng cũ). Khi lưu từ giao
/// diện web, file luôn được ghi lại dạng JSON.
///
/// Đường dẫn tương đối được hiểu tương đối theo thư mục chứa file
/// cấu hình (cả thư mục lẫn pin).
pub fn load_config(config_path: &str) -> Result<(Vec<String>, Settings), String> {
    let text = std::fs::read_to_string(config_path)
        .map_err(|e| format!("không đọc được file cấu hình {config_path}: {e}"))?;
    let base = Path::new(config_path)
        .parent()
        .filter(|p| !p.as_os_str().is_empty());
    let trimmed = text.trim_start();
    if trimmed.starts_with('{') || trimmed.starts_with('[') {
        let mut parser = JsonParser::new(&text);
        let value = parser.parse().map_err(|e| format!("{config_path}: {e}"))?;
        config_from_json(&value, config_path, base)
    } else {
        parse_config_legacy(&text, config_path, base)
    }
}

/// Đọc file cấu hình dạng text cũ (trước 0.8.0): 1 dòng = 1 thư mục,
/// dòng trống và dòng bắt đầu bằng `#` được bỏ qua, dòng bắt đầu
/// bằng `@` là cài đặt (`@exts`, `@ignore`, `@debounce`,
/// `@recursive`, `@pin`). Giữ lại để file cũ vẫn chạy được; file
/// mới dùng JSON (xem `load_config`).
fn parse_config_legacy(
    text: &str,
    config_path: &str,
    base: Option<&Path>,
) -> Result<(Vec<String>, Settings), String> {
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
                "pin" => {
                    // value là toàn bộ phần còn lại của dòng (đường
                    // dẫn có thể chứa khoảng trắng). Trùng nhau thì
                    // giữ dòng đầu tiên.
                    if value.is_empty() {
                        return Err(format!(
                            "{config_path} dòng {}: @pin thiếu đường dẫn",
                            lineno + 1
                        ));
                    }
                    let p = Path::new(value);
                    let resolved = if p.is_absolute() || base.is_none() {
                        p.to_path_buf()
                    } else {
                        base.unwrap().join(p)
                    };
                    let pin = Pin::new(resolved);
                    if !settings.pins.contains(&pin) {
                        settings.pins.push(pin);
                    }
                }
                _ => {
                    return Err(format!(
                        "{config_path} dòng {}: cài đặt không rõ: @{key} (chỉ có @exts, @ignore, @debounce, @recursive, @pin)",
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

/// Kiểm tra schema của object cấu hình JSON và đổi thành
/// (dirs, Settings). Mọi trường đều không bắt buộc (thiếu thì dùng
/// mặc định); khóa lạ hoặc sai kiểu thì báo lỗi rõ ràng.
fn config_from_json(
    value: &JsonValue,
    config_path: &str,
    base: Option<&Path>,
) -> Result<(Vec<String>, Settings), String> {
    let JsonValue::Object(entries) = value else {
        return Err(format!(
            "{config_path}: file cấu hình JSON phải là 1 object {{...}}"
        ));
    };
    let mut dirs = Vec::new();
    let mut settings = Settings::default();
    for (key, v) in entries {
        match key.as_str() {
            "dirs" => {
                dirs = json_string_list(v, config_path, "dirs")?
                    .into_iter()
                    .map(|d| resolve_config_path(&d, base))
                    .collect();
            }
            "recursive" => {
                let JsonValue::Bool(b) = v else {
                    return Err(format!(
                        "{config_path}: \"recursive\" phải là true hoặc false"
                    ));
                };
                settings.recursive = *b;
            }
            "debounce_ms" => {
                let JsonValue::Number(raw) = v else {
                    return Err(format!(
                        "{config_path}: \"debounce_ms\" phải là số nguyên >= 0"
                    ));
                };
                settings.debounce_ms = raw.parse::<u64>().map_err(|_| {
                    format!(
                        "{config_path}: \"debounce_ms\" phải là số nguyên >= 0, nhận được: {raw}"
                    )
                })?;
            }
            "exts" => {
                // Chuẩn hóa giống dạng cũ: trim, bỏ dấu chấm đầu, viết thường.
                settings.exts = json_string_list(v, config_path, "exts")?
                    .iter()
                    .flat_map(|s| split_list(s))
                    .collect();
            }
            "ignores" => {
                settings.ignores = json_string_list(v, config_path, "ignores")?
                    .iter()
                    .flat_map(|s| split_list(s))
                    .collect();
            }
            "pins" => {
                let JsonValue::Array(items) = v else {
                    return Err(format!("{config_path}: \"pins\" phải là 1 array"));
                };
                for item in items {
                    let JsonValue::Object(pin_entries) = item else {
                        return Err(format!(
                            "{config_path}: mỗi phần tử \"pins\" phải là 1 object {{\"path\": ...}}"
                        ));
                    };
                    let mut pin_path: Option<String> = None;
                    let mut command: Option<String> = None;
                    for (pk, pv) in pin_entries {
                        match pk.as_str() {
                            "path" => {
                                let JsonValue::Str(s) = pv else {
                                    return Err(format!(
                                        "{config_path}: \"pins[].path\" phải là chuỗi"
                                    ));
                                };
                                pin_path = Some(s.clone());
                            }
                            "command" => match pv {
                                JsonValue::Null => command = None,
                                JsonValue::Str(s) => command = Some(s.clone()),
                                _ => {
                                    return Err(format!(
                                        "{config_path}: \"pins[].command\" phải là chuỗi hoặc null"
                                    ));
                                }
                            },
                            _ => {
                                return Err(format!(
                                    "{config_path}: khóa không rõ trong pins: \"{pk}\" (chỉ có \"path\", \"command\")"
                                ));
                            }
                        }
                    }
                    let Some(p) = pin_path else {
                        return Err(format!("{config_path}: phần tử \"pins\" thiếu \"path\""));
                    };
                    let pin = Pin {
                        path: PathBuf::from(resolve_config_path(&p, base)),
                        command,
                    };
                    if !settings.pins.contains(&pin) {
                        settings.pins.push(pin);
                    }
                }
            }
            _ => {
                return Err(format!(
                    "{config_path}: khóa không rõ: \"{key}\" (chỉ có \"dirs\", \"recursive\", \"debounce_ms\", \"exts\", \"ignores\", \"pins\")"
                ));
            }
        }
    }
    Ok((dirs, settings))
}

/// Đọc 1 array chuỗi từ JSON (mỗi phần tử phải là chuỗi).
fn json_string_list(v: &JsonValue, config_path: &str, key: &str) -> Result<Vec<String>, String> {
    let JsonValue::Array(items) = v else {
        return Err(format!("{config_path}: \"{key}\" phải là 1 array chuỗi"));
    };
    let mut out = Vec::new();
    for item in items {
        let JsonValue::Str(s) = item else {
            return Err(format!("{config_path}: \"{key}\" chỉ được chứa chuỗi"));
        };
        out.push(s.clone());
    }
    Ok(out)
}

/// Đường dẫn trong file cấu hình: tuyệt đối thì giữ nguyên, tương đối
/// thì hiểu theo thư mục chứa file cấu hình.
fn resolve_config_path(p: &str, base: Option<&Path>) -> String {
    let path = Path::new(p);
    if path.is_absolute() || base.is_none() {
        p.to_string()
    } else {
        base.unwrap().join(path).to_string_lossy().into_owned()
    }
}

/// Ghi cấu hình thành JSON đẹp (thụt 2 khoảng trắng) để người đọc/
/// sửa tay được. Thứ tự khóa cố định: dirs, recursive, debounce_ms,
/// exts, ignores, pins. `dirs` và `pins` mỗi phần tử 1 dòng (đường
/// dẫn thường dài); `exts`/`ignores` gọn trên 1 dòng.
fn config_to_json(dirs: &[PathBuf], settings: &Settings) -> String {
    let mut out = String::from("{\n");
    out.push_str("  \"dirs\": [");
    if dirs.is_empty() {
        out.push_str("],\n");
    } else {
        out.push('\n');
        for d in dirs {
            out.push_str(&format!("    \"{}\",\n", json_escape(&d.to_string_lossy())));
        }
        out.truncate(out.len() - 2); // bỏ ",\n" của phần tử cuối
        out.push_str("\n  ],\n");
    }
    out.push_str(&format!("  \"recursive\": {},\n", settings.recursive));
    out.push_str(&format!("  \"debounce_ms\": {},\n", settings.debounce_ms));
    let short_list = |items: &[String]| -> String {
        items
            .iter()
            .map(|s| format!("\"{}\"", json_escape(s)))
            .collect::<Vec<_>>()
            .join(", ")
    };
    out.push_str(&format!("  \"exts\": [{}],\n", short_list(&settings.exts)));
    out.push_str(&format!(
        "  \"ignores\": [{}],\n",
        short_list(&settings.ignores)
    ));
    out.push_str("  \"pins\": [");
    if settings.pins.is_empty() {
        out.push_str("]\n");
    } else {
        out.push('\n');
        for pin in &settings.pins {
            let cmd = match &pin.command {
                Some(c) => format!("\"{}\"", json_escape(c)),
                None => "null".to_string(),
            };
            out.push_str(&format!(
                "    {{\n      \"path\": \"{}\",\n      \"command\": {}\n    }},\n",
                json_escape(&pin.path.to_string_lossy()),
                cmd
            ));
        }
        out.truncate(out.len() - 2); // bỏ ",\n" của phần tử cuối
        out.push_str("\n  ]\n");
    }
    out.push_str("}\n");
    out
}

/// Ghi lại file cấu hình dạng JSON (danh sách thư mục + cài đặt).
/// Ghi qua file tạm rồi đổi tên để không hỏng file gốc nếu app bị
/// ngắt giữa chừng. Thư mục được ghi nguyên văn như truyền vào
/// (nên truyền đường dẫn đã canonicalize từ giao diện web).
pub fn save_config(config_path: &Path, dirs: &[PathBuf], settings: &Settings) -> Result<(), String> {
    let out = config_to_json(dirs, settings);
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

/// Đọc danh sách thư mục từ file cấu hình (bỏ qua các cài đặt khác).
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
            size: None,
            delta: None,
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
            size: None,
            delta: None,
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
            "2026-11-12 22:00:00  RENAMED   lam@may1  —  /a/cu.txt -> /a/moi.txt"
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
            "2026-11-12 22:00:00  RENAMED   lam@may1  —  /a/cu.txt -> /a/moi.txt"
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
            "2026-11-12 22:00:00  RENAMED   lam@may1  —  /a/out.txt -> ?"
        );
        assert_eq!(
            format_human(&out[2], &ident()),
            "2026-11-12 22:00:00  RENAMED   lam@may1  —  ? -> /a/in.txt"
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
            "2026-11-12 22:00:00  RENAMED   lam@may1  —  /a/cũ.txt -> /a/mới.txt"
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
    fn config_legacy_and_roundtrip() {
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
        // File có dòng @: parse đủ cài đặt + @pin, lỗi rõ khi sai.
        std::fs::write(
            &path,
            "@exts rs,MD\n@ignore target, .tmp\n@debounce 50\n@recursive false\n@pin /a/quan trong.txt\n@pin rel/file.txt\n@pin /a/quan trong.txt\n/a/x\n",
        )
        .unwrap();
        let (dirs, settings) = load_config(path.to_str().unwrap()).unwrap();
        assert_eq!(dirs, vec!["/a/x"]);
        assert_eq!(settings.exts, vec!["rs", "md"]);
        assert_eq!(settings.ignores, vec!["target", "tmp"]);
        assert_eq!(settings.debounce_ms, 50);
        assert!(!settings.recursive);
        // @pin: đường dẫn có khoảng trắng giữ nguyên, trùng nhau loại
        // bỏ, tương đối hiểu theo thư mục chứa file cấu hình.
        assert_eq!(settings.pins.len(), 2);
        assert_eq!(settings.pins[0].path, PathBuf::from("/a/quan trong.txt"));
        assert!(settings.pins[1].path.ends_with("rel/file.txt"));
        assert!(settings.pins[0].command.is_none());
        std::fs::write(&path, "@debounce abc\n").unwrap();
        assert!(load_config(path.to_str().unwrap()).is_err());
        std::fs::write(&path, "@recursive maybe\n").unwrap();
        assert!(load_config(path.to_str().unwrap()).is_err());
        std::fs::write(&path, "@pin\n").unwrap();
        assert!(load_config(path.to_str().unwrap()).is_err());
        std::fs::write(&path, "@la-mot-cai-gi-do 1\n").unwrap();
        assert!(load_config(path.to_str().unwrap()).is_err());
        // Ghi lại (dạng JSON từ 0.8.0) rồi đọc lại: khớp (kể cả pin).
        let settings = Settings {
            exts: vec!["rs".to_string()],
            ignores: vec![],
            debounce_ms: 300,
            recursive: true,
            pins: vec![Pin::new(PathBuf::from("/a/ghim.txt"))],
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

    #[test]
    fn config_json_roundtrip() {
        let dir = std::env::temp_dir().join("file-watcher-test-config-json");
        let _ = std::fs::create_dir_all(&dir);
        let path = dir.join("watch.json");
        // File rỗng và {} đều đọc được với mặc định.
        std::fs::write(&path, "").unwrap();
        let (dirs, settings) = load_config(path.to_str().unwrap()).unwrap();
        assert!(dirs.is_empty());
        assert_eq!(settings, Settings::default());
        std::fs::write(&path, "{}").unwrap();
        let (dirs, settings) = load_config(path.to_str().unwrap()).unwrap();
        assert!(dirs.is_empty());
        assert_eq!(settings, Settings::default());
        // Đủ trường: chuẩn hóa exts/ignores, pin trùng loại bỏ,
        // command chuỗi và null đều giữ, đường dẫn tương đối hiểu
        // theo thư mục chứa file.
        std::fs::write(
            &path,
            r#"{
  "dirs": ["/a/code", "rel/dir"],
  "recursive": false,
  "debounce_ms": 50,
  "exts": ["RS", ".md"],
  "ignores": ["Target", " .tmp "],
  "pins": [
    { "path": "/a/quan trong.txt", "command": "echo xong" },
    { "path": "rel/file.txt", "command": null },
    { "path": "/a/quan trong.txt", "command": "echo xong" }
  ]
}"#,
        )
        .unwrap();
        let (dirs, settings) = load_config(path.to_str().unwrap()).unwrap();
        assert_eq!(dirs[0], "/a/code");
        assert!(dirs[1].ends_with("rel/dir"));
        assert!(!settings.recursive);
        assert_eq!(settings.debounce_ms, 50);
        assert_eq!(settings.exts, vec!["rs", "md"]);
        assert_eq!(settings.ignores, vec!["target", "tmp"]);
        assert_eq!(settings.pins.len(), 2);
        assert_eq!(settings.pins[0].path, PathBuf::from("/a/quan trong.txt"));
        assert_eq!(settings.pins[0].command.as_deref(), Some("echo xong"));
        assert!(settings.pins[1].path.ends_with("rel/file.txt"));
        assert!(settings.pins[1].command.is_none());
        // Ghi lại rồi đọc lại: khớp hoàn toàn, kể cả command.
        save_config(
            &path,
            &[PathBuf::from("/a/one"), PathBuf::from("/b/two")],
            &settings,
        )
        .unwrap();
        let saved = std::fs::read_to_string(&path).unwrap();
        assert!(saved.starts_with("{\n  \"dirs\": [\n"));
        assert!(saved.contains("\"command\": \"echo xong\""));
        assert!(saved.contains("\"command\": null"));
        let (dirs, back) = load_config(path.to_str().unwrap()).unwrap();
        assert_eq!(dirs, vec!["/a/one", "/b/two"]);
        assert_eq!(back, settings);
        assert!(!dir.join("watch.tmp").exists());
        let _ = std::fs::remove_dir_all(&dir);
    }

    #[test]
    fn config_json_errors() {
        let dir = std::env::temp_dir().join("file-watcher-test-config-json-err");
        let _ = std::fs::create_dir_all(&dir);
        let path = dir.join("watch.json");
        let bad = [
            // Sai kiểu.
            r#"{"dirs": "khong-phai-array"}"#,
            r#"{"debounce_ms": -5}"#,
            r#"{"debounce_ms": 12.5}"#,
            r#"{"recursive": "true"}"#,
            r#"{"exts": ["rs", 1]}"#,
            // Khóa lạ.
            r#"{"khoa-la": 1}"#,
            // Pin sai.
            r#"{"pins": [{"command": "x"}]}"#,
            r#"{"pins": [{"path": 1}]}"#,
            r#"{"pins": [{"path": "/a", "command": 1}]}"#,
            r#"{"pins": [{"path": "/a", "extra": 1}]}"#,
            // JSON sai.
            r#"{"dirs": [], "dirs": []}"#,
            r#"{"dirs": []} thừa"#,
            r#"{"dirs": [}"#,
            r#"[1, 2]"#,
        ];
        for content in bad {
            std::fs::write(&path, content).unwrap();
            assert!(
                load_config(path.to_str().unwrap()).is_err(),
                "phải lỗi: {content}"
            );
        }
        let _ = std::fs::remove_dir_all(&dir);
    }

    #[test]
    fn json_parser_basics() {
        // Chuỗi: escape + \u + cặp surrogate (U+1F600).
        let v = JsonParser::new(r#""a\nb\"c\\d\u0041\ud83d\ude00""#)
            .parse()
            .unwrap();
        assert_eq!(
            v,
            JsonValue::Str("a\nb\"c\\dA\u{1F600}".to_string())
        );
        // Số giữ nguyên chuỗi gốc.
        assert_eq!(
            JsonParser::new("123").parse().unwrap(),
            JsonValue::Number("123".to_string())
        );
        assert_eq!(
            JsonParser::new("-2.5e-2").parse().unwrap(),
            JsonValue::Number("-2.5e-2".to_string())
        );
        // Lồng nhau + rỗng.
        let v = JsonParser::new(r#"{"a": [1, true, null, {"b": "c"}]}"#)
            .parse()
            .unwrap();
        assert!(matches!(v, JsonValue::Object(_)));
        assert_eq!(
            JsonParser::new("{}").parse().unwrap(),
            JsonValue::Object(vec![])
        );
        assert_eq!(
            JsonParser::new("[]").parse().unwrap(),
            JsonValue::Array(vec![])
        );
        // Lỗi: chưa đóng chuỗi, object sai, literal sai, số 0 thừa,
        // lồng quá sâu.
        assert!(JsonParser::new(r#""chua-dong"#).parse().is_err());
        assert!(JsonParser::new("{,}").parse().is_err());
        assert!(JsonParser::new("tru").parse().is_err());
        assert!(JsonParser::new("01").parse().is_err());
        let deep = "[".repeat(100);
        assert!(JsonParser::new(&deep).parse().is_err());
    }

    #[test]
    fn format_bytes_units() {
        assert_eq!(format_bytes(0), "0 B");
        assert_eq!(format_bytes(512), "512 B");
        assert_eq!(format_bytes(1023), "1023 B");
        assert_eq!(format_bytes(1024), "1,0 KB");
        assert_eq!(format_bytes(1536), "1,5 KB");
        assert_eq!(format_bytes(15432), "15,1 KB");
        assert_eq!(format_bytes(1048576), "1,0 MB");
        assert_eq!(format_bytes(1073741824), "1,0 GB");
        assert_eq!(format_delta(2871), "+2,8 KB");
        assert_eq!(format_delta(-512), "-512 B");
        assert_eq!(format_delta(0), "±0 B");
    }

    #[test]
    fn size_tracker_deltas() {
        let mut t = SizeTracker::new();
        let a = Path::new("/a/f.txt");
        let b = Path::new("/a/g.txt");
        // Lần đầu thấy: có size, chưa có delta.
        assert_eq!(t.observe(a, Some(100), false), (Some(100), None));
        // Sửa to lên / nhỏ xuống / giữ nguyên.
        assert_eq!(t.observe(a, Some(150), false), (Some(150), Some(50)));
        assert_eq!(t.observe(a, Some(10), false), (Some(10), Some(-140)));
        assert_eq!(t.observe(a, Some(10), false), (Some(10), Some(0)));
        // Stat lỗi nhưng không phải Removed: giữ cache, hiện size cũ.
        assert_eq!(t.observe(a, None, false), (Some(10), None));
        // Xóa: trả size biết lần cuối rồi quên; thấy lại thì như mới.
        assert_eq!(t.observe(a, None, true), (Some(10), None));
        assert_eq!(t.observe(a, None, true), (None, None));
        assert_eq!(t.observe(a, Some(5), false), (Some(5), None));
        // Đổi tên: cache chuyển sang tên mới, delta tính tiếp.
        t.observe(b, Some(200), false);
        t.rename(b, Path::new("/a/h.txt"));
        assert_eq!(
            t.observe(Path::new("/a/h.txt"), Some(200), false),
            (Some(200), Some(0))
        );
        assert_eq!(t.observe(b, None, true), (None, None));
        // Đổi tên đè lên file đã có cache: giữ cache của đích.
        let c = Path::new("/a/tmp");
        let d = Path::new("/a/real.txt");
        t.observe(c, Some(999), false);
        t.observe(d, Some(50), false);
        t.rename(c, d);
        assert_eq!(t.observe(d, Some(60), false), (Some(60), Some(10)));
    }

    #[test]
    fn format_with_size_and_delta() {
        let mut s = sum(Kind::Modified, "/a/main.rs");
        s.size = Some(15432);
        s.delta = Some(2871);
        assert_eq!(
            format_human(&s, &ident()),
            "2026-11-12 22:00:00  MODIFIED  lam@may1  15,1 KB (+2,8 KB)  /a/main.rs"
        );
        assert!(format_json(&s, &ident()).contains("\"size\":15432"));
        assert!(format_json(&s, &ident()).contains("\"delta\":2871"));
        // Sửa nhưng size không đổi.
        s.delta = Some(0);
        assert!(format_human(&s, &ident()).contains("15,1 KB (±0 B)"));
        // Lần đầu thấy: có size, không delta.
        s.delta = None;
        assert!(format_human(&s, &ident()).contains("15,1 KB  /a/main.rs"));
        assert!(!format_json(&s, &ident()).contains("\"delta\""));
        // Không rõ size: cột size là —, JSON không có trường size.
        s.size = None;
        assert!(format_human(&s, &ident()).contains("lam@may1  —  /a/main.rs"));
        assert!(!format_json(&s, &ident()).contains("\"size\""));
    }
}
