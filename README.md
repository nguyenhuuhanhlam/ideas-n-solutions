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
| TuTi Learn English — học tiếng Anh cơ bản qua bài tập có chấm điểm, phân loại bằng tabs (6 bài cơ bản + tab Chia động từ 6 nhóm × 15 câu + tab Tra cứu 47 động từ bất quy tắc, ôn tập tổng hợp) | `english-learning/` | https://nguyenhuuhanhlam.github.io/ideas-n-solutions/english-learning/ |
| Form Hub — danh sách form có sẵn + API cho ứng dụng khác (link điền, JSON form, nhúng iframe); chỉ dùng Form Library miễn phí (MIT) | `surveyjs-demo/` | https://nguyenhuuhanhlam.github.io/ideas-n-solutions/surveyjs-demo/ |

## App desktop (không deploy lên Pages)

| App | Thư mục | Chạy |
| --- | --- | --- |
| Clipboard Tool — tool tray trên Windows, nghe clipboard text thuần, chạy module Rust tự động (phát hiện link http/https, loại bỏ `fbclid`, giữ các param còn lại); không lưu clipboard xuống đĩa | `clipboard-tool/` | Windows: `cargo build --release` rồi chạy `target/release/clipboard-tool.exe` (xem `clipboard-tool/README.md`) |

App này cố tình không có thẻ ở trang chủ `index.html` và không có bước
build trong workflow Pages, vì nó là app desktop Windows, không phải app web.

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
`npm ci` / `npm run build` cho nó.
