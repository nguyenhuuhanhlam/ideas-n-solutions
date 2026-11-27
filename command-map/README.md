# Command Map

Web app lưu trữ lệnh command dạng mindmap: sidebar chứa các root (chủ đề),
click root thì canvas hiện cây của root đó. Canvas tự do — kéo thả node tùy ý,
zoom bằng con lăn, bấm vào dòng lệnh là copy.

## Giao diện

Hairline UI — dùng token và quy tắc của kit ở `hairline-ui/` (line 1px,
không card/shadow/radius, chữ 13px, heading uppercase 11px muted, icon
Lucide nét 1px, sáng/tối theo `prefers-color-scheme`; canvas cũng vẽ theo
palette sáng/tối tương ứng). Sprite icon copy ở `public/icons/`.

## Trạng thái

**UI demo** — dữ liệu mẫu, lưu tạm trong localStorage của trình duyệt.
Tầng dữ liệu nằm ở `src/data/store.js`: khi nối Firebase chỉ thay phần thân
các hàm trong file đó (đọc/ghi Firestore theo từng node, đăng nhập Google),
giao diện và canvas không phải sửa.

Thiết kế dữ liệu đã thống nhất:

- Firestore: mỗi root = 1 document metadata, mỗi node = 1 document riêng
  `{ rootId, parentId, title, command, note, x, y, collapsed, updatedAt }`
  dưới `users/{uid}/...`, rules chỉ cho chủ tài khoản đọc/ghi.
- Lệnh có biến chờ dạng `<tên-gói>`: khi copy, app hỏi giá trị rồi mới copy.

## Chạy thử

```bash
npm install
npm run dev
```

Build: `npm run build` (base `/ideas-n-solutions/command-map/` ghi trong
`vite.config.js`).
