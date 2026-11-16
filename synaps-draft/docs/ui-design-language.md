# Ngôn ngữ UI Synaps Draft — cách dùng UI (để dùng lại cho các app khác)

Tài liệu này ghi lại cách dùng UI của app Synaps Draft: màu sắc, chữ, bố cục,
các thành phần và quy tắc hiển thị. Dùng làm chuẩn khi phát triển các app khác.

## 1. Nguyên tắc chung

- Editor sáng, gần trắng; canvas chiếm toàn màn hình, là trung tâm.
- Không thanh menu trên, không thanh trạng thái dưới.
- Mọi điều khiển nổi trên canvas, bo tròn lớn, bóng nhẹ.
- Chỉ dùng đen / trắng / xám + duy nhất 1 màu xanh accent.
- Thông báo ngắn bằng toast; không có thanh trạng thái thường trực.
- Tính năng chưa có vẫn hiển thị ở dạng mờ (disabled), không ẩn đi.

## 2. Màu sắc

| Tên | Hex | Dùng cho |
|---|---|---|
| canvas | `#FCFCFC` | Nền canvas |
| ink | `#111111` | Chữ chính, nút chính, ô đang chọn, toast |
| grey | `#6B7280` | Chữ phụ, icon phụ |
| border | `#E5E7EB` | Viền panel, nút, ô nhập |
| field | `#F2F2F3` | Nền ô nhập, tab đang chọn, nền khi hover |
| accent | `#3B9BD6` | Chọn, snap, nét nháp, focus — màu xanh duy nhất |

## 3. Chữ

- Font Inter (400/500/600/700); không dùng serif.
- Cỡ: tên app 15px đậm vừa; tiêu đề mục 14px đậm vừa; nội dung 14px;
  chữ phụ 12px; nhãn ô nhập 11px; chữ trong pill chọn 12px đậm vừa.
- Số liệu dùng chữ số có độ rộng bằng nhau (tabular) để không nhảy khi đổi số.

## 4. Bố cục màn hình

- Canvas toàn màn hình. Các cụm điều khiển nổi trên canvas, cách mép 12px:
  - Trái: panel + toolbar icon dọc, cao toàn màn hình, cách nhau 8px.
  - Giữa trên: pill chuyển chế độ xem, căn giữa ngang.
  - Phải trên: các nút hành động chính (Import, Export, Share) + hoàn tác /
    làm lại / lưu / mới.
  - Phải dưới: pill đơn vị + pill Zoom.
  - Giữa dưới: toast.
- Thứ tự lớp: canvas dưới cùng, cụm nổi ở trên, toast trên cụm nổi,
  dialog trên cùng.
- Màn hình hẹp (< 768px): chỉ xem toàn màn hình — ẩn panel, toolbar và cụm
  phải trên, không có nút mở lại; chỉ còn pill chuyển view giữa trên và pill
  đơn vị/Zoom góc phải dưới.

## 5. Panel trái

- Rộng 300px, bo góc 18px, viền màu border, nền trắng, bóng lớn.
- Đầu panel: icon 32×32 bo 8px nền đen chữ trắng + tên app 15px đậm vừa +
  tên workspace 12px xám + nút thu gọn.
- Tab: bo 8px, chữ 14px đậm vừa; tab đang chọn nền field chữ đen, tab khác
  chữ xám (hover chữ đen).
- Nội dung: lề trong 16px, cuộn dọc; các mục cách nhau 16px.

## 6. Toolbar icon dọc

- Rộng 56px, bo góc 16px, viền, nền trắng, bóng lớn, lề trong 6px, các nút
  cách nhau 4px.
- Nút 40×40, bo 8px, icon 20px nét 1.5.
- Công cụ đang chọn: nền đen chữ trắng (ô đen là dấu hiệu chọn duy nhất).
- Nút chưa dùng được: màu xám nhạt, con trỏ cấm.
- Vạch chia: đường ngang 1px rộng 32px màu border.
- Thứ tự: nút ẩn/hiện panel | chọn | nhóm sắp có | công cụ vẽ | nhóm sắp có.
  Mỗi nút có chú thích khi rê chuột, ghi rõ phím tắt nếu có.

## 7. Nút & pill

- Nút chính: pill tròn hoàn toàn, nền đen, chữ trắng 14px đậm vừa, lề trong
  12px/6px (nhỏ) hoặc 16px/8px (trong dialog); hover đen tuyền; khi mờ thì
  mờ 50%.
- Nút phụ: pill tròn, viền, nền trắng, chữ đen; hover nền field.
- Nút icon tròn: 36×36, viền, nền trắng, bóng nhỏ; icon 16px; khi mờ thì
  mờ 40%.
- Nhóm pill chọn (segmented): khung trắng viền bo tròn, lề trong 4px, bóng
  nhỏ; mỗi đoạn bo tròn, chữ 12px đậm vừa; đoạn đang chọn nền đen chữ trắng,
  đoạn khác chữ xám (hover chữ đen).
- Pill nổi trên canvas (độ dài đang vẽ, ô nhập kích thước): bo tròn, viền,
  nền trắng, bóng vừa, chữ 13px; ô nhập rộng 120px, chữ căn giữa.

## 8. Ô nhập & form

- Ô nhập: rộng toàn hàng, bo 8px, không viền, nền field, lề trong 10px/6px,
  chữ 14px; khi focus: viền xanh accent + nền trắng.
- Nhãn ô nhập: 11px xám, cách ô 4px; đơn vị đi kèm 12px xám.
- Tiêu đề mục: 14px đậm vừa đen; nhãn nhóm nhỏ: 12px đậm vừa xám.
- Công tắc: 36×20 pill, nút tròn 16px trắng bóng nhỏ.
- Nhóm chọn trong panel: nền field bo 8px lề trong 2px; mỗi lựa chọn bo 6px,
  chữ 12px.
- Hàng trong cây thư mục: bo 8px, hover nền field; nút thao tác chỉ hiện khi
  rê chuột vào hàng; số liệu 12px xám.
- Thẻ thư viện: lưới 2 cột, cách nhau 8px; thẻ bo 12px, viền, nền trắng,
  lề trong 12px, icon + nhãn 12px căn giữa.

## 9. Dialog

- Lớp phủ toàn màn hình, nền đen mờ 30%, lề 16px, căn giữa.
- Hộp: rộng tối đa ~512px, bo 24px, nền trắng, lề trong 20px, bóng rất lớn.
- Tiêu đề 16px đậm vừa; nút đóng bo 8px, hover nền field.
- Thẻ lựa chọn: bo 12px, viền, lề trong 12px; thẻ được chọn viền đen + nút
  radio đen.
- Vùng xem trước: nền field bo 12px lề trong 16px; khung đứt nét bên trong
  nền trắng.
- Chân dialog: trái ghi chú 14px xám; phải nút Hủy (pill phụ) + nút chính
  (pill đen).

## 10. Toast

- Nổi giữa dưới, pill tròn, nền đen chữ trắng 14px, lề trong 16px/8px, bóng
  lớn. Dùng cho mọi thông báo ngắn (đã lưu, lỗi mở file, lỗi xuất).

## 11. Màu & nét trên canvas

- Nền `#FCFCFC`; lưới `#E9E9E7`; trục `#D6D6D2`; thân tường `#8A8A8A`;
  viền tường `#6E6E6E`; cung mở/đường tâm `#A8A8A8`; chọn/nháp/snap
  `#3B9BD6`; chữ `#111111`; kích thước `#71717A`.
- Kích thước: mũi tên hở (không tô), nhãn bấm được để nhập số.
- Điểm bắt (snap): vòng tròn xanh + ký hiệu theo loại điểm (ô vuông: đầu
  mút; tròn: trung điểm; thoi: chân vuông góc; X: giao nhau).
- Nét vẽ giữ nguyên độ dày hiển thị ở mọi mức zoom: nét tường 1px, cánh cửa
  4px, cung mở 1.5px; nét đứt cung [8,5], nét đứt đường tâm [6,6] (đơn vị
  px trên màn hình).
- Zoom 100% = vừa khung hình (vật thể chiếm 80% khung nhìn); bấm pill Zoom
  hoặc Shift+1 để về 100%.

## 12. Icon

- Bộ icon lucide, nét 1.5 thống nhất. Cỡ: toolbar 20px, nút icon 16px,
  đầu panel 18px.

## 13. Quy tắc chung

- Bo góc: panel 18px, toolbar 16px, dialog 24px, nút/pill tròn hoàn toàn,
  ô nhập và thẻ nhỏ 8–12px.
- Bóng: panel/toolbar lớn, nút/pill nhỏ, pill nổi trên canvas vừa, dialog
  rất lớn, toast lớn.
- Hover: nền field; đang chọn: nền đen (giao diện) hoặc xanh accent (canvas).
- Trạng thái mờ: mờ 40–50% hoặc xám nhạt, con trỏ cấm.
- Không thêm màu ngoài bảng ở mục 2 và 11.
