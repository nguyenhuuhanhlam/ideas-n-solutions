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
  rồi bấm ⧉ ở thanh gộp hiện ra: tiêu đề node gộp lấy tên
  của node đầu tiên (theo thứ tự trên xuống dưới), chi tiết chia
  thành từng section theo node gốc — gộp 3 node thì 3 section.
- Kéo nền để di chuyển cả hình, bấm node để xem chi tiết.
  Kéo thân node để di chuyển vị trí, vị trí mới được giữ trong
  phiên này.
- Viền node đang chọn là xanh dương, để không lẫn với viền vàng của nút gốc.

## Sắp xếp vị trí + mặc định đóng subtopic (thêm 29-10-2026)

- Mặc định các topic đóng, subtopic ẩn: mở app chỉ thấy nút gốc
  + các topic, bấm +N trên topic để mở nhánh. Nút ＋ / － vẫn
  mở / thu toàn bộ; tìm kiếm (Enter) hoặc bấm tên nhánh
  trong panel phải chỉ mở đúng nhánh cần tới, các nhánh khác vẫn đóng.
- Sắp xếp VỊ TRÍ, không phải đổi thứ tự câu hỏi: vị trí mặc định
  đã cân đối sẵn — gốc nằm giữa 2 topic, subtopic cách đều nhau
  150px, giữa 2 nhóm topic cách thêm 40px. Kéo lệch rồi thì bấm
  ▦ trên thanh công cụ để tính lại toàn bộ cây cho đều và đẹp,
  xong tự vừa khung hình. Nút ↑ ↓ đổi thứ tự đã bỏ (đính chính
  29-10-2026: “sắp xếp lại node” ở đây là vị trí, không phải thứ tự).

## Sửa 29-10-2026: pan như team-assistant-sim + nút icon

- Canvas đúng mẫu team-assistant-sim: kéo nền để di chuyển cả
  hình, bấm node để xem chi tiết, kéo thân node để di chuyển vị
  trí. Không còn 2 chế độ Chọn / Kéo hình, không còn kéo khung
  chọn trên nền; chọn nhiều subtopic để gộp vẫn bằng
  Ctrl / Shift+Click (Cmd+Click trên Mac).
- Đính chính “sắp xếp lại node”: nút ↑ ↓ đổi thứ tự đã bỏ, thay
  bằng nút ▦ sắp xếp lại vị trí cho đều và đẹp (xem mục trên).
- Các nút thao tác chuyển về dạng icon, nhãn đầy đủ trong title
  + aria-label: thanh công cụ ＋ mở hết / － thu hết / ⤢ vừa
  khung hình / ↺ đặt lại, thanh gộp ⧉ / ✕, duyệt ✓ / ✕.

## Chạy / build

```sh
npm ci
npm run build -- --base=/ideas-n-solutions/qa-mindmap/
npm run preview
```

Live (sau khi push main): https://nguyenhuuhanhlam.github.io/ideas-n-solutions/qa-mindmap/
