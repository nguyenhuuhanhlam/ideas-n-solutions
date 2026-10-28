# QA Mindmap — Lưu hỏi đáp thành mindmap

Bản mẫu trong kho ideas-n-solutions. Lưu thông tin trong các buổi hỏi đáp thành mindmap.

## Cấu trúc đã chốt — 28-10-2026

Bản ghi nhớ nội dung chính của phiên làm việc, hạn chế sinh quá nhiều node:

- Nút gốc (ví dụ “Muse Q&A”, có thể 1 hoặc nhiều nút gốc cho các dạng chủ đề khác nhau)
  → topic → subtopic, tối đa 1–4 nhánh subtopic, tóm tắt tối ưu nội dung.
- Chỉ ghi khi user yêu cầu ghi nhận, không tự ghi mọi câu hỏi đáp.
- Node đơn giản: tiêu đề là chủ đề tóm tắt, chi tiết là câu trả lời tóm tắt.
- Đưa bản tóm tắt cho user duyệt trước khi ghi.
- Chủ đề trùng lắp thì gộp vào chi tiết của subtopic đã có, không tạo node mới.

## Bản mẫu hiện tại

Gốc Muse Q&A → topic Tailscale (buổi hỏi đáp 28-10-2026) → 4 subtopic:
tổng quan và độ tin cậy, giá, cài đặt macOS, truy xuất folder.
5 câu hỏi gốc đã gom vào 4 subtopic này.

Panel phải có demo luồng duyệt: bản tóm tắt đề xuất gộp
“Starter $6/user/tháng” vào chi tiết subtopic “Giá” — bấm
“Duyệt và gộp vào subtopic” thì chi tiết của node “Giá” dài thêm,
số node không đổi, vẫn 4 subtopic.

## Gộp subtopic + kéo thả node (thêm 28-10-2026)

- Chọn nhiều subtopic bằng Ctrl / Shift+Click (Cmd+Click trên Mac),
  hoặc kéo khung chọn trên nền ở chế độ Chọn, rồi bấm
  “Gộp thành 1 node” ở thanh gộp hiện ra: tiêu đề node gộp lấy tên
  của node đầu tiên (theo thứ tự trên xuống dưới), chi tiết chia
  thành từng section theo node gốc — gộp 3 node thì 3 section.
- Chế độ Chọn (mặc định): kéo nền để khoanh chọn nhiều node.
  Chế độ Kéo hình: kéo nền để di chuyển cả hình. Kéo thân node
  để di chuyển vị trí, vị trí mới được giữ trong phiên này.
- Viền node đang chọn là xanh dương, để không lẫn với viền vàng của nút gốc.

## Chạy / build

```sh
npm ci
npm run build -- --base=/ideas-n-solutions/qa-mindmap/
npm run preview
```

Live (sau khi push main): https://nguyenhuuhanhlam.github.io/ideas-n-solutions/qa-mindmap/
