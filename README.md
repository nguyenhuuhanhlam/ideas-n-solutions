# Ideas & Solutions

Kho chứa các bản mẫu test ý tưởng và giải pháp. Mỗi app nằm trong một thư mục
riêng, có `package.json` và cấu hình build riêng; app mới chỉ cần thêm một
thư mục mới và một thẻ vào trang chủ ở `index.html`.

## Các app

| App | Thư mục | Demo |
| --- | --- | --- |
| Timeline Projects — quản lý dự án trên 1 trục thời gian | `timeline-projects/` | https://nguyenhuuhanhlam.github.io/ideas-n-solutions/timeline-projects/ |
| Team Assistant — mô phỏng trợ lý trung tâm cho team kiến trúc | `team-assistant-sim/` | https://nguyenhuuhanhlam.github.io/ideas-n-solutions/team-assistant-sim/ |
| Platformer Game — prototype màn 1 kiểu NES, Canvas 2D + JS thuần, 1 file HTML tĩnh (không cần build) | `platformer-game/` | https://nguyenhuuhanhlam.github.io/ideas-n-solutions/platformer-game/ |
| TuTi Learn English — học tiếng Anh cơ bản qua bài tập có chấm điểm (bài cơ bản + chia động từ 6 nhóm + tra cứu 47 động từ bất quy tắc) | `english-learning/` | https://nguyenhuuhanhlam.github.io/ideas-n-solutions/english-learning/ |
| Form Hub — điền form trực tiếp + API cho ứng dụng khác (link điền, JSON form, nhúng iframe) | `surveyjs-demo/` | https://nguyenhuuhanhlam.github.io/ideas-n-solutions/surveyjs-demo/ |
| Synaps Draft — vẽ kiến trúc: drafting 2D chính xác (tường/cửa/cửa sổ, snap, mm) + xem 3D đồng bộ; xuất DXF qua API FastAPI local | `synaps-draft/` | https://nguyenhuuhanhlam.github.io/ideas-n-solutions/synaps-draft/ |
| Ảnh nhóm — chụp ảnh trên mobile up thẳng lên Cloudinary, cả nhóm xem chung mọi máy; trình xem vuốt/pinch zoom | `photo-app/` | https://nguyenhuuhanhlam.github.io/ideas-n-solutions/photo-app/ |
| Command Map — kho lệnh command dạng mindmap (sidebar root + canvas tự do, bấm lệnh là copy); UI demo dữ liệu mẫu, bản chính dùng Firebase | `command-map/` | https://nguyenhuuhanhlam.github.io/ideas-n-solutions/command-map/ |
| MIENTAY Website Demo — bản demo tái thiết kế mientay.com.vn theo bố cục tạp chí kienviet.net: đủ 34 dự án thật, lọc theo dịch vụ | `mientay-demo/` | https://nguyenhuuhanhlam.github.io/ideas-n-solutions/mientay-demo/ |
| Hairline UI — bộ kit giao diện dùng lại: phong cách hairline grid (chỉ line 1px, không card/shadow/bo góc), CSS + JS vanilla dùng chung | `hairline-ui/` | https://nguyenhuuhanhlam.github.io/ideas-n-solutions/hairline-ui/demo.html |

## App desktop (không deploy lên Pages)

| App | Thư mục | Chạy |
| --- | --- | --- |
| Clipboard Tool — tool tray Windows, nghe clipboard text thuần: chuẩn hoá link, loại bỏ `fbclid`; không lưu xuống đĩa | `clipboard-tool/` | Windows: `cargo build --release` rồi chạy `target/release/clipboard-tool.exe` (xem `clipboard-tool/README.md`) |
| File Watcher — CLI Rust nghe thay đổi file qua API hệ điều hành (không polling), ghi log kèm user/PC ID; giao diện web local xem log realtime | `file-watcher/` | `cargo build --release` rồi chạy `target/release/file-watcher` (Windows: `file-watcher.exe`) (xem `file-watcher/README.md`) |

Các app này chỉ có thẻ mô tả tĩnh ở trang chủ `index.html` (không có
bản demo web) và không có bước build trong workflow Pages, vì chúng là
app desktop, không phải app web.

## Deploy

GitHub Pages deploy từ `main` qua `.github/workflows/deploy-pages.yml`: build
từng app với base là subpath Pages của nó, rồi ghép với trang chủ ở root
(`index.html`) thành một site duy nhất. Trang chủ: https://nguyenhuuhanhlam.github.io/ideas-n-solutions/

## Thêm app mới

1. Tạo thư mục mới, ví dụ `my-new-app/`, chứa app Vite/React của riêng nó
   (xem `timeline-projects/` làm mẫu).
2. Thêm một bước build trong workflow với
   `--base=/ideas-n-solutions/my-new-app/` và copy `my-new-app/dist` vào
   thư mục deploy.
3. Thêm một thẻ app vào trang chủ `index.html` và một dòng vào bảng trên.

Ngoại lệ: `platformer-game/` là app HTML tĩnh 1 file, không cần build —
workflow chỉ copy `platformer-game/index.html` vào site, không có bước
`npm ci` / `npm run build` cho nó. `hairline-ui/` cũng là file tĩnh
(`demo.html` + CSS/JS), workflow copy cả thư mục vào site.
