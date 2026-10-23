# Ideas & Solutions

Kho chứa các bản mẫu test ý tưởng. Bản mẫu hiện tại:

## Timeline Projects — quản lý dự án trên 1 trục thời gian

Phác thảo test cho ý tưởng: **mọi project xếp chồng thành từng lớp trên một
trục thời gian ngang duy nhất**, thao tác chính là **zoom phóng nhanh và kéo
chuột** (không phải form nhập liệu hay board).

### Cách chạy

```bash
npm install
npm run dev
```

### Thao tác để test

| Thao tác | Hành vi |
|---|---|
| Lăn chuột | Zoom **liên tục**, luôn phóng về điểm dưới con trỏ, chỉ giãn trục X (thời gian), kẹp trong [0,55 – 110 px/ngày] |
| Kéo nền trống | Pan ngang/dọc, thả ra trượt tiếp theo **quán tính** |
| Double-click | Phóng to tại điểm click |
| Kéo một thanh task | Dời task đó (task con đi theo), ngày bắt đầu/kết thúc cập nhật trong panel |
| Kéo **mép** một thanh task | Đổi thời lượng của task tổng đó — các task con **co/giãn theo đúng tỉ lệ** |
| Kéo **thanh tổng** của project (ở LOD 0) | Kéo thân: dời **toàn bộ project**; kéo mép: **co/giãn toàn bộ timeline của project** theo tỉ lệ quanh mép còn lại (mọi task/task con đi theo) |
| Click thanh / project | Mở panel chi tiết bên phải |
| Click **tên project** (nhãn dính mép trái) | **Nổi bật project đó**: mọi project xung quanh chuyển sang sắc xám (gray shade), chỉ project đang chọn giữ màu; click lại vào tên đó, click vùng trống, bấm `Esc` hoặc nút chip trên header để bỏ |
| Nút trên header | Phóng to / Thu nhỏ / Về hôm nay / Toàn cảnh (chuyển động có tween) |

### Mô hình đã chốt khi thảo luận (và đã áp vào bản mẫu)

- Tối đa ~**100 project**, mỗi project **≤ 20 task**; task chạy **song song**
  vì nhiều người cùng làm một project.
- Bên trong lane của project, task xếp **theo hàng của người làm**
  (màu thanh = màu của người đó) — trùng giờ của cùng một người tức là quá tải.
- Zoom có **min/max**, không zoom vô cực. Chuyển động liên tục nhưng **chi tiết
  đổi theo ngưỡng** (LOD):
  - `LOD 0` (< 1,5 px/ngày): chỉ thanh tổng của project + tiến độ + mốc task.
  - `LOD 1` (1,5–7): các task theo hàng người làm.
  - `LOD 2` (7–25): thêm nhãn task, nhãn người làm dính mép trái, tiến độ.
  - `LOD 3` (≥ 25): thêm **task con** ngay dưới thanh task cha.
  Chiều cao lane giãn/co có animation khi qua ngưỡng, không nhảy cục.
- Cuối tuần được tô mờ khi zoom đủ sâu; đường đỏ là **hôm nay** (22-10-2026
  trong dữ liệu giả). Ngày hiển thị dạng `dd-mm-yyyy`.

### Kỹ thuật

- React + Vite, render bằng **Konva** (Canvas 2D): toàn bộ timeline vẽ gộp
  bằng 1 Shape tùy biến (batch draw) + hit-test thủ công trên các thanh đang
  hiển thị — giữ được 60fps khi pan/zoom ở quy mô này (tối đa ~2.000 task,
  số thanh hiển thị đồng thời chỉ vài trăm). Lý do không dùng thư viện
  timeline/Gantt có sẵn và không dùng PixiJS/WebGL đã được thảo luận: xem
  lịch sử chat "Project management timeline idea".
- Dữ liệu giả (`src/data.js`): 100 project, sinh có seed cố định; task được
  phân tầng đều theo thời lượng project để zoom vào giai đoạn nào cũng có việc.
  Project đang chạy quanh "hôm nay" được xếp lên đầu.

### Đã kiểm chứng tự động (headless)

- Build pass; mở trang không lỗi console.
- Zoom tổng hợp 4 nấc: 2,60 → 46,32 px/ngày, LOD 1 → LOD 3, 91 thanh hiển thị.
- Click chọn đúng task, panel hiện đúng người làm / ngày / tiến độ / task con.
- Kéo task +100px ở LOD 3: ngày dời đúng +2 ngày (24-08-2026 → 26-08-2026).

### Giới hạn của bản mẫu

- Dữ liệu giả, kéo task chỉ đổi trong bộ nhớ (tải lại trang là mất).
- Chưa có phụ thuộc giữa các task, chưa sửa bằng form, chưa lưu backend.
- Zoom bằng pinch cảm ứng chưa làm (test bằng chuột là chính).
