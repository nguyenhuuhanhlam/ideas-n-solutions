# QA Mindmap — Lưu hỏi đáp thành mindmap

Bản mẫu trong kho ideas-n-solutions. Lưu thông tin trong các buổi hỏi đáp thành mindmap.

## Quy tắc đã chốt — 28-10-2026

- Chỉ ghi khi user yêu cầu ghi nhận, không tự ghi mọi câu hỏi đáp.
- Node đơn giản: tiêu đề là chủ đề tóm tắt, chi tiết là câu trả lời tóm tắt.
- Đưa bản tóm tắt cho user duyệt trước khi ghi.
- Chủ đề trùng lắp thì bổ sung node con, không tạo node trùng riêng.

## Bản mẫu hiện tại

Cây Tailscale, buổi hỏi đáp 28-10-2026: gốc Tailscale + 5 node hỏi đáp
(là gì, có free không, có bản macOS không, Muse có truy xuất được folder
qua Tailscale không, có nổi tiếng và đáng tin không) + 1 node con
“Personal Plus $5/tháng” dưới node “có free không” làm ví dụ trùng chủ đề.

Panel phải có demo luồng duyệt: bản tóm tắt đề xuất node con
“Starter $6/user/tháng” dưới node “có free không” — bấm “Duyệt và ghi
node con” thì node mới xuất hiện trên cây.

## Chạy / build

```sh
npm ci
npm run build -- --base=/ideas-n-solutions/qa-mindmap/
npm run preview
```

Live (sau khi push main): https://nguyenhuuhanhlam.github.io/ideas-n-solutions/qa-mindmap/
