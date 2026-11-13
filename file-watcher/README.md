# file-watcher

CLI lắng nghe thay đổi file trong 1 hoặc nhiều thư mục, viết bằng Rust.
Tiêu chí: **nhẹ, nhanh** — chạy nền cả ngày không đáng kể tài nguyên.

Với `--serve`, app mở thêm giao diện web local (http://127.0.0.1:8787)
để cấu hình thư mục theo dõi và xem log theo thời gian thực — vẫn 1
file binary duy nhất, không thêm dependency (xem "Giao diện web").

## Vì sao nhẹ, nhanh

- **Không polling.** Dùng API thông báo của hệ điều hành qua crate
  `notify` 8.x: `ReadDirectoryChangesW` (Windows), inotify (Linux),
  FSEvents (macOS). Vòng lặp chính block trên channel, chỉ tỉnh dậy
  khi có event.
- **Chỉ 2 dependency trực tiếp:** `notify` (nhận event) và `chrono`
  (giờ địa phương). Không async runtime, không framework parse CLI
  (tự parse vài chục dòng), không serde (JSON ghi tay, config là
  file text thuần). Giao diện web dùng `std::net::TcpListener`
  viết tay (không thêm crate nào), trang HTML nhúng sẵn trong binary.
- **Profile release tối ưu:** `opt-level = 3`, LTO toàn bộ,
  1 codegen unit, strip symbol, `panic = "abort"`.

Số đo thật trên Linux (build release, đo ngày 2026-11-13, bản 0.2.0
với `--serve` đang bật):

| Chỉ số | Giá trị |
| --- | --- |
| Kích thước binary | 726.192 byte (~709 KiB), 1 file duy nhất |
| RAM lúc rảnh | ~2,7 MB (RSS) |
| CPU lúc rảnh | 0,0% (đo trong 5 giây) |
| Luồng | 3 (main + backend của OS + server web) |

Bản CLI thuần 0.1.0 đo ngày 2026-11-12 là ~625 KiB / ~2,5 MB /
2 luồng — giao diện web chỉ thêm ~84 KiB binary và ~0,2 MB RAM.
Bản 0.3.0 (thêm user + PC ID vào log): binary 735.064 byte
(~718 KiB). Bản 0.4.0 (thêm size + delta): binary 768.400 byte
(~750 KiB).

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

# Đọc cấu hình từ file JSON (xem watch.example.json)
file-watcher --config watch.json

# Ghi thêm vào file log + chạy lệnh mỗi khi có thay đổi
file-watcher . --log events.log --exec "echo {event} {path}"

# Dạng JSON 1 dòng/event, để pipe sang tool khác
file-watcher . --json > events.jsonl

# Giao diện web: cấu hình thư mục + xem log realtime
file-watcher --config watch.json --serve
file-watcher --serve --port 9000
```

Nhấn `Ctrl+C` để dừng. Banner khởi động in ra stderr nên stdout
luôn sạch — pipe sang file hay tool khác chỉ nhận event.

### Tùy chọn

| Tùy chọn | Mặc định | Nghĩa |
| --- | --- | --- |
| `--config <file>` | — | Đọc cấu hình từ file JSON (xem "File cấu hình"). Đường dẫn tương đối hiểu theo thư mục chứa file. Gộp chung với thư mục gõ trên CLI, trùng nhau tự loại. File text cũ (1 dòng = 1 thư mục, dòng `@...` là cài đặt) vẫn đọc bình thường. |
| `--serve` | tắt | Bật giao diện web local trên http://127.0.0.1:8787 (xem "Giao diện web"). Khi bật mà không có `--config`, app dùng file `watch.json` ở thư mục hiện tại (nếu có) và lưu thay đổi vào đó. Cho phép khởi động với 0 thư mục rồi thêm sau trên giao diện. |
| `--port <n>` | 8787 | Cổng giao diện web (1–65535; chỉ có nghĩa với `--serve`). Cổng bị chiếm thì app báo lỗi và thoát ngay (exit 2). |
| `--no-recursive` | đệ quy | Chỉ theo dõi tầng trên cùng của mỗi thư mục. |
| `--debounce-ms <n>` | 200 | Gộp các event dồn dập trong n mili-giây thành 1 dòng (xem "Quy tắc gộp"). `0` = in ngay từng event, không gộp. |
| `--ext <a,b,c>` | tất cả | Chỉ hiện file có đuôi này (không phân biệt hoa/thường, vd: `rs,md,txt`). |
| `--ignore <a,b>` | — | Bỏ qua đường dẫn chứa chuỗi này (không phân biệt hoa/thường, vd: `.tmp,~$,node_modules`). |
| `--log <file>` | — | Ghi thêm mọi dòng event vào file (append, cùng định dạng với stdout). File log nằm trong thư mục đang theo dõi vẫn an toàn: event do chính nó gây ra được tự loại, không vòng lặp. |
| `--json` | dạng đọc | In mỗi event 1 dòng JSON thay vì dạng đọc được. |
| `--exec "<lệnh>"` | — | Chạy lệnh mỗi khi có event, không chờ kết quả (không chặn watcher). Placeholder: `{path}` `{event}` `{time}` `{from}` `{user}` `{pc}` `{size}` `{delta}` — `{size}`/`{delta}` là số byte thô, rỗng khi không rõ. Chạy qua `cmd /C` trên Windows, `sh -c` trên Linux/macOS. |
| `--pc-id <id>` | hostname | Ghi đè PC ID trong log (mặc định: hostname của máy, xem "User + PC ID trong log"). |
| `-h, --help` | — | Hiện hướng dẫn. |
| `-V, --version` | — | Hiện phiên bản. |

Thư mục không tồn tại, không phải thư mục, hoặc file log không mở
được đều báo lỗi rõ ràng và thoát ngay (exit 1), không chạy nửa vời.

## Giao diện web (`--serve`)

```sh
file-watcher --config watch.json --serve
```

Mở trình duyệt vào http://127.0.0.1:8787 (hoặc cổng đã chọn với
`--port`). Server chỉ bind `127.0.0.1` nên chỉ máy này mở được,
không truy cập được từ máy khác trong mạng.

- **Cấu hình thư mục:** thêm/xóa thư mục theo dõi (gõ đường dẫn đầy
  đủ — trình duyệt không chọn được thư mục trên máy). Thêm/xóa áp
  dụng ngay, không cần khởi động lại, và lưu ngay vào file cấu hình.
- **Cài đặt:** đệ quy (bật/tắt), debounce (ms), chỉ đuôi file, bỏ
  qua chuỗi — nút Áp dụng lưu ngay vào file cấu hình. Đổi đệ quy
  thì app watch lại toàn bộ thư mục với chế độ mới; đổi bộ lọc áp
  dụng ngay cho event tiếp theo.
- **Log realtime:** event mới hiện ngay qua SSE (Server-Sent Events),
  màu theo loại (tạo/sửa/xóa/đổi tên), có lọc theo loại + tìm theo
  tên file, tạm dừng, tự cuộn, xóa log hiển thị. Trang tải lần đầu
  nhận tối đa 1000 dòng log gần nhất.
- **Badge thư mục cha:** mỗi dòng log chỉ hiện tên file kèm badge
  là 2 đoạn cuối của thư mục cha (vd: `…/project/src`) thay vì
  full path dài. Rê chuột vào badge thấy full path, bấm vào badge
  để copy full path + tên file. Dòng đổi tên chỉ gắn badge ở tên
  mới, tên cũ hiện chữ thường.
- **Nhóm (collapse):** event của cùng 1 file trong 5 phút gộp
  thành 1 nhóm; nhóm từ 3 event trở lên thu gọn mặc định, hiện số
  lượng, khoảng giờ, event mới nhất và chênh lệch ròng (`tổng`).
  Bấm vào nhóm để mở ra xem từng event. Event mới vào nhóm đang
  thu gọn chỉ tăng số đếm (kèm chớp sáng nhẹ), không tự bung ra.
  Khi đang gõ tìm kiếm, các nhóm tự bung ra để thấy dòng khớp.
- **Tabs:** log chia 3 tab — **Tất cả** (chỉ file đang tồn tại),
  **Đã ghim** (event của file đã ghim), **Đã xóa** (toàn bộ lịch sử
  của file đã bị xóa, kể cả tạo/sửa trước khi xóa). File bị xóa rồi
  tạo lại: lịch sử cũ ở lại tab Đã xóa, event mới quay về Tất cả.
- **Ghim file:** bấm 📌 ở dòng log hoặc nhóm để ghim file đó (bấm
  lại để bỏ ghim), hoặc gõ đường dẫn trong tab Đã ghim. Ghim là
  đường dẫn cố định, không chạy theo đổi tên. File ngoài vùng theo
  dõi vẫn ghim được, hiện trạng thái "ngoài vùng theo dõi". Ghim
  lưu vào file cấu hình JSON (mục `"pins"`) nên khởi động lại vẫn
  còn; dữ liệu ghim đã để sẵn chỗ cho lệnh xử lý riêng theo file
  (sẽ làm sau).
- **Phong cách hairline grid:** nền sáng (tối theo hệ thống qua
  `prefers-color-scheme`), mọi phân tách chỉ bằng đường line 1px,
  không card nổi, không shadow, không bo góc. Dải stat 4 ô đếm
  event theo loại (tạo/sửa/xóa/đổi tên) trong 1000 dòng gần nhất,
  kèm giờ event mới nhất của từng loại.
- **Sidebar co dãn + thu gọn:** mặc định rộng 320px để nội dung
  vừa 1 trang, không phải cuộn. Kéo tay nắm ở đường line giữa
  sidebar và nội dung để đổi chiều rộng (160–480px, tối đa nửa màn
  hình; bấm đúp tay nắm để về 320px; phím mũi tên khi tay nắm đang
  focus). Nút ‹ ở đầu topbar thu gọn hẳn sidebar, bấm › để mở lại.
  Chiều rộng và trạng thái thu gọn lưu trong trình duyệt nên mở
  lại vẫn giữ.
- **Cuộn không thanh trượt:** sidebar và log đều ẩn thanh cuộn;
  khi còn nội dung phía trên/dưới thì mép tương ứng hiện vệt mờ
  nhạt, mờ dần khi cuộn tới cuối. Cuộn bằng chuột/bàn phím như
  bình thường.
- **Khởi động rỗng:** `--serve` không cần thư mục nào — mở giao diện
  rồi thêm thư mục sau cũng được; file `watch.json` được tạo khi lưu
  thay đổi đầu tiên.

API dùng nội bộ (không cần nhớ để xài giao diện):

| Endpoint | Nghĩa |
| --- | --- |
| `GET /` | Trang giao diện (1 file HTML nhúng sẵn). |
| `GET /events?after=N` | SSE stream event realtime (JSON, số thứ tự tăng dần). |
| `GET /api/config` | Cấu hình hiện tại (JSON). |
| `GET /api/log?after=N` | Log gần đây, các event có số thứ tự > N. |
| `POST /api/dirs` | Thêm/xóa thư mục (`action=add\|remove&dir=...`). |
| `POST /api/config` | Đổi cài đặt (`recursive` / `debounce_ms` / `exts` / `ignores`). |
| `POST /api/pins` | Ghim/bỏ ghim file (`action=add\|remove&path=...`). |

## File cấu hình

File cấu hình là JSON (xem `watch.example.json`):

```json
{
  "dirs": ["D:\\code\\project", "C:\\Users\\ten\\Documents\\ghi-chu"],
  "recursive": true,
  "debounce_ms": 200,
  "exts": ["rs", "md"],
  "ignores": ["target", "node_modules"],
  "pins": [{ "path": "D:\\code\\project\\quan-trong.txt", "command": null }]
}
```

- Mọi trường đều không bắt buộc (thiếu thì dùng mặc định: đệ quy
  bật, debounce 200ms, không lọc đuôi, không bỏ qua, không ghim).
- `"pins"` ghim file để theo dõi riêng trong giao diện web (tab Đã
  ghim). `"command"` để dành cho lệnh xử lý riêng theo file (chưa
  dùng — luôn `null`). Ghim trùng nhau tự loại bỏ.
- Khóa lạ, sai kiểu hoặc JSON sai cú pháp thì app báo lỗi rõ ràng
  và dừng, không chạy với cài đặt đoán mò.
- File cũ dạng text (1 dòng = 1 thư mục, dòng `@exts`/`@ignore`/
  `@debounce`/`@recursive`/`@pin` là cài đặt) vẫn đọc bình thường.
  Khi lưu từ giao diện web, file được ghi lại dạng JSON.
- Đường dẫn tương đối hiểu theo thư mục chứa file cấu hình.
- **Thứ tự ưu tiên:** flag CLI thắng file cấu hình — nhưng chỉ khi
  user gõ rõ flag đó (`--ext`, `--ignore`, `--debounce-ms`,
  `--no-recursive`). Không gõ thì cài đặt trong file được giữ.
- Giao diện web lưu file qua file tạm rồi đổi tên, nên app bị ngắt
  giữa lúc lưu cũng không hỏng file gốc.

## Định dạng đầu ra

Dạng đọc được (mặc định), giờ địa phương — mỗi dòng ghi kèm
`user@pc` của máy chạy và kích thước file (+ delta nếu biết):

```
2026-11-12 22:55:01  CREATED   lam@desktop-iua61p0  100 B  D:\code\project\src\main.rs
2026-11-12 22:55:02  MODIFIED  lam@desktop-iua61p0  150 B (+50 B)  D:\code\project\src\main.rs
2026-11-12 22:55:03  REMOVED   lam@desktop-iua61p0  150 B  D:\code\project\cu.txt
2026-11-12 22:55:04  RENAMED   lam@desktop-iua61p0  150 B (±0 B)  D:\code\project\cu.txt -> D:\code\project\moi.txt
2026-11-12 22:55:05  RENAMED   lam@desktop-iua61p0  12,3 KB  D:\code\project\ra-ngoai.txt -> ?
2026-11-12 22:55:06  RENAMED   lam@desktop-iua61p0  12,3 KB  ? -> D:\code\project\tu-ngoai-vao.txt
```

Rename có 3 dạng: đủ 2 đầu (`cũ -> mới`), chỉ biết tên cũ
(`cũ -> ?`, đổi tên ra khỏi thư mục đang theo dõi), chỉ biết tên
mới (`? -> mới`, đổi tên từ ngoài vào).

Dạng JSON (`--json`), 1 object 1 dòng:

```json
{"time":"2026-11-12 22:55:04","event":"renamed","path":"D:\\code\\project\\moi.txt","direction":"both","from":"D:\\code\\project\\cu.txt","user":"lam","pc":"desktop-iua61p0","size":15432,"delta":0}
{"time":"2026-11-12 22:55:02","event":"modified","path":"D:\\code\\project\\src\\main.rs","user":"lam","pc":"desktop-iua61p0","size":15432,"delta":2871}
```

`event` là 1 trong 4 giá trị `created` / `modified` / `removed` /
`renamed`. Rename có thêm `"direction": "both" | "from" | "to" |
"any"`, và `both` có thêm `"from"` (tên cũ). Mọi event đều có
`"user"` và `"pc"` — kể cả event qua SSE và `/api/log` của giao
diện web. `"size"` là kích thước byte (số nguyên), `"delta"` là
chênh lệch byte so với lần biết trước (có dấu) — cả hai chỉ xuất
hiện khi biết được (xem dưới đây).

## Kích thước file + thay đổi (delta)

Mỗi dòng log ghi kèm kích thước file sau thay đổi đó, và — khi
sửa file — chênh lệch so với lần biết trước (`+2,8 KB`, `-512 B`,
`±0 B` nếu sửa mà size không đổi). Đây là thay đổi về kích thước,
không phải diff nội dung file.

- **Lần đầu thấy file** chỉ hiện size, chưa có delta: app không
  quét trước thư mục lúc khởi động (đắt với cây thư mục lớn),
  nên delta xuất hiện từ lần thứ hai thấy cùng 1 file. File có
  sẵn từ trước khi chạy app cũng vậy: lần sửa đầu chỉ hiện size,
  lần sửa sau mới có delta.
- **Xóa file** hiện kích thước biết được lần cuối trước khi xóa
  (không có delta — file đã mất).
- **Đổi tên** chuyển size đã biết sang tên mới nên delta vẫn
  đúng (thường là `±0 B`); đổi tên đè lên file khác (kiểu lưu
  atomic của editor) thì delta tính so với nội dung cũ của file
  đích.
- **Thư mục** hiện `—` (size thư mục theo OS không có nghĩa,
  vd: 4096 trên Linux) và không có delta.
- Size được stat 1 lần lúc in log (cuối cửa sổ debounce) nên
  luôn là size mới nhất sau cả đợt thay đổi dồn dập, không phải
  size ở event đầu tiên trong đợt đó.
- Giao diện web hiện cùng 1 cột size + delta trên từng dòng log;
  `--exec` dùng được qua placeholder `{size}` `{delta}` (số byte
  thô, rỗng khi không rõ).

## User + PC ID trong log

Mỗi dòng log ghi kèm user đang chạy và PC ID của máy, để gom log
từ nhiều máy vẫn biết event nào từ máy nào. Nhận tự động lúc khởi
động, không cần cấu hình:

- **User:** biến môi trường `USERNAME` (Windows) / `USER` /
  `LOGNAME`; không có thì chạy lệnh `whoami` (`DOMAIN\user` trên
  Windows được rút gọn thành `user`).
- **PC ID:** hostname của máy — `COMPUTERNAME` (Windows) /
  `HOSTNAME` / file `/etc/hostname`; không có thì chạy lệnh
  `hostname`. Lệnh chỉ chạy 1 lần lúc khởi động và chỉ khi biến
  môi trường thiếu (bash không export `HOSTNAME` cho tiến trình
  con, và có máy để trống `/etc/hostname`).
- Không nhận được bằng cách nào thì ghi `unknown`, không để trống.

Muốn PC ID khác hostname (vd: tên gợi nhớ hơn, hoặc 2 máy trùng
hostname), dùng flag `--pc-id`:

```sh
file-watcher D:\code\project --pc-id may-phong-ke-toan
```

Định danh cũng hiện trên banner khởi động (`máy: lam@desktop-iua61p0`),
trên đầu giao diện web, trong `GET /api/config` (`"user"`, `"pc"`),
và dùng được trong `--exec` qua placeholder `{user}` `{pc}`.

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
  format đầu ra, parse CLI, đọc/ghi file cấu hình (gồm dòng cài đặt
  `@...`), nhận định danh user + PC ID, theo dõi kích thước file
  (`SizeTracker`). Cả crate có 20 unit test (`cargo test`).
- `src/main.rs` — vòng lặp watcher: mở watcher, nhận event qua
  channel, in ra stdout / file log / chạy `--exec`, đẩy event vào
  log của giao diện web.
- `src/web.rs` — giao diện web: HTTP server viết tay bằng
  `std::net::TcpListener` (không thêm dependency), SSE log realtime,
  API cấu hình/thư mục/ghim. Trạng thái dùng chung với vòng lặp watcher
  qua `Shared` (Mutex) nên thêm/xóa thư mục áp dụng ngay.
- `src/ui.html` — trang giao diện duy nhất, nhúng vào binary lúc
  build (`include_str!`), vanilla JS, không framework, không asset
  ngoài. Nhóm/collapse, tabs, badge copy, ghim đều xử lý ở client
  (server chỉ lưu ghim + phục vụ event).

## Chưa có (hướng mở rộng)

- Quy trình xử lý riêng theo file ghim (vd: file ghim bị sửa thì
  chạy 1 lệnh riêng) — dữ liệu ghim đã có sẵn chỗ cho lệnh.
- Tray app Windows có cửa sổ Settings chọn thư mục (kiểu
  Clipboard Tool) thay vì CLI.
- Chạy nền dạng service / autostart khi đăng nhập Windows.
- Lọc theo loại event (`--kinds create,modify`) hoặc pattern
  glob thay vì chuỗi con.
- Ghi log xoay vòng theo ngày / giới hạn dung lượng.
