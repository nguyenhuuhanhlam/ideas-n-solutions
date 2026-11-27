# Ideas & Solutions

Kho chứa các bản mẫu test ý tưởng và giải pháp. Mỗi app nằm trong một thư mục
riêng, có `package.json` và cấu hình build riêng; app mới chỉ cần thêm một
thư mục mới và một thẻ vào trang chủ ở `index.html`.

## Các app

| App | Thư mục | Demo |
| --- | --- | --- |
| Timeline Projects — quản lý dự án trên trục thời gian: kéo thả dời lịch, sửa task trực tiếp | `timeline-projects/` | https://nguyenhuuhanhlam.github.io/ideas-n-solutions/timeline-projects/ |
| Team Assistant Simulator — mô phỏng trợ lý trung tâm cho team kiến trúc: tách việc cho AI qua cổng duyệt | `team-assistant-sim/` | https://nguyenhuuhanhlam.github.io/ideas-n-solutions/team-assistant-sim/ |
| Platformer Game — game 2D chặt chém kiểu NES, 1 file HTML tĩnh không cần build | `platformer-game/` | https://nguyenhuuhanhlam.github.io/ideas-n-solutions/platformer-game/ |
| TuTi Learn English — học tiếng Anh cơ bản qua bài tập chấm điểm, chia động từ 7 nhóm | `english-learning/` | https://nguyenhuuhanhlam.github.io/ideas-n-solutions/english-learning/ |
| Form Hub — điền form trực tiếp + công bố API (link điền, JSON form, nhúng iframe) | `surveyjs-demo/` | https://nguyenhuuhanhlam.github.io/ideas-n-solutions/surveyjs-demo/ |
| Synaps Draft — vẽ kiến trúc 2D chính xác theo mm, xem 3D đồng bộ, xuất DXF qua API local | `synaps-draft/` | https://nguyenhuuhanhlam.github.io/ideas-n-solutions/synaps-draft/ |
| Group Photos — chụp ảnh mobile up lên Cloudinary, cả nhóm xem chung mọi máy | `photo-app/` | https://nguyenhuuhanhlam.github.io/ideas-n-solutions/photo-app/ |
| Command Map — kho lệnh dạng mindmap, bấm lệnh là copy, đồng bộ Firebase qua đăng nhập Google | `command-map/` | https://nguyenhuuhanhlam.github.io/ideas-n-solutions/command-map/ |
| Mientay Website — demo tái thiết kế mientay.com.vn theo bố cục kienviet.net, đủ 34 dự án thật | `mientay-demo/` | https://nguyenhuuhanhlam.github.io/ideas-n-solutions/mientay-demo/ |
| Hairline UI — kit giao diện hairline grid dùng lại: chỉ line 1px, không card/shadow/bo góc | `hairline-ui/` | https://nguyenhuuhanhlam.github.io/ideas-n-solutions/hairline-ui/demo.html |

## App desktop (không deploy lên Pages)

| App | Thư mục | Chạy |
| --- | --- | --- |
| Clipboard Tool — tool tray Windows: tự chuẩn hoá link và bỏ `fbclid`, không lưu xuống đĩa | `clipboard-tool/` | Windows: `cargo build --release` rồi chạy `target/release/clipboard-tool.exe` (xem `clipboard-tool/README.md`) |
| File Watcher — CLI Rust theo dõi thay đổi file không polling, web local xem log realtime | `file-watcher/` | `cargo build --release` rồi chạy `target/release/file-watcher` (Windows: `file-watcher.exe`) (xem `file-watcher/README.md`) |

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
