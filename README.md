# Ideas & Solutions

Kho chứa các bản mẫu test ý tưởng và giải pháp. Mỗi app nằm trong một thư mục
riêng, có `package.json` và cấu hình build riêng; app mới chỉ cần thêm một
thư mục mới và một thẻ vào trang chủ ở `index.html`.

## Các app

| App | Thư mục | Demo |
| --- | --- | --- |
| Timeline Projects — quản lý dự án trên 1 trục thời gian | `timeline-projects/` | https://nguyenhuuhanhlam.github.io/ideas-n-solutions/timeline-projects/ |
| Team Assistant — mô phỏng trợ lý trung tâm cho team kiến trúc | `team-assistant-sim/` | https://nguyenhuuhanhlam.github.io/ideas-n-solutions/team-assistant-sim/ |

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
