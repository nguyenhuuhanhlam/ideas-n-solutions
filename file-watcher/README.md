# file-watcher

CLI lắng nghe thay đổi file trong 1 hoặc nhiều thư mục, viết bằng Rust.
Tiêu chí: **nhẹ, nhanh** — chạy nền cả ngày không đáng kể tài nguyên.

## Vì sao nhẹ, nhanh

- **Không polling.** Dùng API thông báo của hệ điều hành qua crate
  `notify` 8.x: `ReadDirectoryChangesW` (Windows), inotify (Linux),
  FSEvents (macOS). Vòng lặp chính block trên channel, chỉ tỉnh dậy
  khi có event.
- **Chỉ 2 dependency trực tiếp:** `notify` (nhận event) và `chrono`
  (giờ địa phương). Không async runtime, không framework parse CLI
  (tự parse vài chục dòng), không serde (JSON ghi tay, config là
  file text thuần).
- **Profile release tối ưu:** `opt-level = 3`, LTO toàn bộ,
  1 codegen unit, strip symbol, `panic = "abort"`.

Số đo thật trên Linux (build release, đo ngày 2026-11-12):

| Chỉ số | Giá trị |
| --- | --- |
| Kích thước binary | 639.648 byte (~625 KiB), 1 file duy nhất |
| RAM lúc rảnh | ~2,5 MB (RSS) |
| CPU lúc rảnh | 0,0% (đo trong 5 giây) |
| Luồng | 2 (main + backend của OS) |

Trên Windows con số sẽ khác đôi chút, nhưng cùng tầm đó (exe 1 file,
không cần DLL kèm theo, không cần cài Rust trên máy chạy).

## Build

```sh
cargo build --release
```

- Windows: chạy `target\release\file-watcher.exe`
- Linux/macOS: chạy `target/release/file-watcher`

Code đã `cargo check` sạch cho target `x86_64-pc-windows-gnu`
(không lỗi), nhưng exe Windows chưa được chạy thử trên máy Windows
thật — cần test lại trên máy chính.

## Dùng

```sh
# Theo dõi 1 thư mục (đệ quy, mặc định)
file-watcher D:\code\project

# Nhiều thư mục, chỉ file .rs/.md, bỏ qua target và node_modules
file-watcher C:\a D:\b --ext rs,md --ignore target,node_modules

# Đọc danh sách thư mục từ file (xem watch.example.txt)
file-watcher --config watch.txt

# Ghi thêm vào file log + chạy lệnh mỗi khi có thay đổi
file-watcher . --log events.log --exec "echo {event} {path}"

# Dạng JSON 1 dòng/event, để pipe sang tool khác
file-watcher . --json > events.jsonl
```

Nhấn `Ctrl+C` để dừng. Banner khởi động in ra stderr nên stdout
luôn sạch — pipe sang file hay tool khác chỉ nhận event.

### Tùy chọn

| Tùy chọn | Mặc định | Nghĩa |
| --- | --- | --- |
| `--config <file>` | — | Đọc danh sách thư mục từ file text: 1 dòng = 1 thư mục, dòng trống và dòng bắt đầu bằng `#` được bỏ qua. Đường dẫn tương đối hiểu theo thư mục chứa file. Gộp chung với thư mục gõ trên CLI, trùng nhau tự loại. |
| `--no-recursive` | đệ quy | Chỉ theo dõi tầng trên cùng của mỗi thư mục. |
| `--debounce-ms <n>` | 200 | Gộp các event dồn dập trong n mili-giây thành 1 dòng (xem "Quy tắc gộp"). `0` = in ngay từng event, không gộp. |
| `--ext <a,b,c>` | tất cả | Chỉ hiện file có đuôi này (không phân biệt hoa/thường, vd: `rs,md,txt`). |
| `--ignore <a,b>` | — | Bỏ qua đường dẫn chứa chuỗi này (không phân biệt hoa/thường, vd: `.tmp,~$,node_modules`). |
| `--log <file>` | — | Ghi thêm mọi dòng event vào file (append, cùng định dạng với stdout). File log nằm trong thư mục đang theo dõi vẫn an toàn: event do chính nó gây ra được tự loại, không vòng lặp. |
| `--json` | dạng đọc | In mỗi event 1 dòng JSON thay vì dạng đọc được. |
| `--exec "<lệnh>"` | — | Chạy lệnh mỗi khi có event, không chờ kết quả (không chặn watcher). Placeholder: `{path}` `{event}` `{time}` `{from}`. Chạy qua `cmd /C` trên Windows, `sh -c` trên Linux/macOS. |
| `-h, --help` | — | Hiện hướng dẫn. |
| `-V, --version` | — | Hiện phiên bản. |

Thư mục không tồn tại, không phải thư mục, hoặc file log không mở
được đều báo lỗi rõ ràng và thoát ngay (exit 1), không chạy nửa vời.

## Định dạng đầu ra

Dạng đọc được (mặc định), giờ địa phương:

```
2026-11-12 22:55:01  CREATED   D:\code\project\src\main.rs
2026-11-12 22:55:02  MODIFIED  D:\code\project\src\main.rs
2026-11-12 22:55:03  REMOVED   D:\code\project\cu.txt
2026-11-12 22:55:04  RENAMED   D:\code\project\cu.txt -> D:\code\project\moi.txt
2026-11-12 22:55:05  RENAMED   D:\code\project\ra-ngoai.txt -> ?
2026-11-12 22:55:06  RENAMED   ? -> D:\code\project\tu-ngoai-vao.txt
```

Rename có 3 dạng: đủ 2 đầu (`cũ -> mới`), chỉ biết tên cũ
(`cũ -> ?`, đổi tên ra khỏi thư mục đang theo dõi), chỉ biết tên
mới (`? -> mới`, đổi tên từ ngoài vào).

Dạng JSON (`--json`), 1 object 1 dòng:

```json
{"time":"2026-11-12 22:55:04","event":"renamed","path":"D:\\code\\project\\moi.txt","direction":"both","from":"D:\\code\\project\\cu.txt"}
{"time":"2026-11-12 22:55:02","event":"modified","path":"D:\\code\\project\\src\\main.rs"}
```

`event` là 1 trong 4 giá trị `created` / `modified` / `removed` /
`renamed`. Rename có thêm `"direction": "both" | "from" | "to" |
"any"`, và `both` có thêm `"from"` (tên cũ).

## Quy tắc gộp (debounce)

Một lần lưu file của editor có thể bắn ra nhiều event (ghi, tạo file
tạm, đổi tên, xóa file tạm). Trong cửa sổ debounce (mặc định 200ms),
các event trên cùng 1 đường dẫn được gộp theo quy tắc:

- Tạo rồi sửa -> chỉ còn `CREATED` (nội dung ghi sau là một phần
  của lần tạo).
- Tạo rồi xóa -> bỏ cả hai (file chỉ tồn tại thoáng qua).
- Sửa rồi xóa -> chỉ còn `REMOVED` (trạng thái cuối: file đã mất).
- Xóa rồi tạo lại -> chỉ còn `CREATED`.
- Đổi tên "nuốt" lần tạo của tên nguồn: lưu kiểu atomic (ghi file
  tạm rồi rename đè lên file thật) chỉ còn 1 dòng `RENAMED`,
  không còn dòng `CREATED` của file tạm.
- Đổi tên luôn là đúng 1 dòng, dù backend của OS báo nhiều event:
  inotify báo tới 3 event (From, To, Both) cho 1 lần đổi tên,
  Windows báo 2 nửa (From rồi To) không có Both — cả hai đều được
  ghép về 1 dòng `cũ -> mới`. Hai nửa không kề nhau thì không ghép
  (có thể là 2 lần đổi tên khác nhau), thà in 2 dòng còn hơn ghép sai.

Event đọc file (Access) và event lạ (Other) không được in.

## Cảnh báo tràn hàng đợi

Khi thay đổi dồn dập quá nhanh, hàng đợi event của OS có thể tràn và
bỏ sót event. Trường hợp này app in cảnh báo ra stderr
(`cảnh báo: hàng đợi event tràn, có thể đã bỏ sót thay đổi`) thay vì
im lặng — event đã mất thì không bịa lại được.

## Giới hạn đã biết

- Ổ mạng / thư mục mount qua mạng: tùy hệ điều hành và loại ổ, OS
  có thể không báo đủ event — cần kiểm tra riêng nếu thư mục cần
  theo dõi nằm trên ổ mạng.
- Đổi tên chính thư mục đang theo dõi: watcher không tự chạy theo
  tên mới (giới hạn của `notify`); cần khởi động lại với tên mới.
- Đổi tên giữa 2 thư mục không cùng được theo dõi: chỉ hiện 1 đầu
  (`cũ -> ?` hoặc `? -> mới`).
- Symlink tới thư mục: `notify` mặc định không đi theo symlink.

## Cấu trúc code

- `src/lib.rs` — logic thuần: rút gọn event, gộp debounce, lọc,
  format đầu ra, parse CLI. Có 13 unit test (`cargo test`).
- `src/main.rs` — vòng lặp watcher: mở watcher, nhận event qua
  channel, in ra stdout / file log / chạy `--exec`.

## Chưa có (hướng mở rộng)

- Tray app Windows có cửa sổ Settings chọn thư mục (kiểu
  Clipboard Tool) thay vì CLI.
- Chạy nền dạng service / autostart khi đăng nhập Windows.
- Lọc theo loại event (`--kinds create,modify`) hoặc pattern
  glob thay vì chuỗi con.
- Ghi log xoay vòng theo ngày / giới hạn dung lượng.
