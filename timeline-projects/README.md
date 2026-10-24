# Timeline Projects — quản lý dự án trên 1 trục thời gian

App này thuộc repo [ideas-n-solutions](https://github.com/nguyenhuuhanhlam/ideas-n-solutions)
(và nằm trong thư mục `timeline-projects/` của repo). Demo live:
https://nguyenhuuhanhlam.github.io/ideas-n-solutions/timeline-projects/

### Quản lý dữ liệu (từ 2026-10-24)

App khởi đầu **rỗng** — dữ liệu demo cũ đã được reset. Nút **Quản lý** trên thanh
menu mở panel thêm/xóa:

- **Nhân viên**: thêm theo tên (màu tự gán); xóa bằng nút 2 bước. Không xóa
  được người còn task đang giao.
- **Dự án**: thêm theo tên + khoảng ngày (mặc định 30 ngày từ hôm nay); xóa
  bằng nút 2 bước, xóa luôn task của dự án đó.
- **Nạp dữ liệu demo**: sinh lại bộ demo cũ (25 dự án, 15 nhân viên) để test,
  ghi đè dữ liệu hiện tại. **Xóa toàn bộ dữ liệu**: về trạng thái rỗng.

Dữ liệu được lưu bền vào **localStorage** của trình duyệt đang dùng
(`timeline-projects-data-v1`) — chưa có backend nên đổi máy/trình duyệt khác
sẽ không thấy dữ liệu này. Kéo thả task/project trên timeline cũng lưu ngay
khi thả chuột.

### Thêm task cho dự án

- Bấm tên dự án trên timeline để mở panel dự án rồi bấm **Thêm task…**,
  hoặc trong panel Quản lý bấm **+ Task** ở hàng dự án, hoặc bấm
  **Thêm task mới…** trong panel của một task cùng dự án.
- Form thêm task: tên, người làm (chọn trong toàn bộ nhân viên — người chưa
  trong nhóm sẽ tự được thêm vào dự án), ngày bắt đầu/kết thúc, tiến độ.
  Task mới bắt đầu với 0 task con.
- Quy tắc cứng vẫn áp dụng: task mới không được trùng thời gian với task
  khác của cùng người trong cùng dự án — form báo rõ task bị trùng.

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
| **Bấm đúp vào một thanh task** (hoặc nút "Sửa task…" trong panel) | Mở **form sửa task**: tên, người làm (trong nhóm của project), ngày bắt đầu/kết thúc, tiến độ. Form chặn lưu khi khoảng mới trùng task khác của cùng người; task con tự co/giãn theo khoảng mới. Bấm đúp vào vùng trống vẫn là phóng to như trước |
| **Bấm đúp vào một thanh task con** ở mức chi tiết nhất (hoặc chọn task con trong panel rồi bấm "Sửa task con…") | Mở **form sửa task con**: tên đầu việc, **nội dung chi tiết**, ngày bắt đầu/kết thúc, tiến độ riêng. Form chặn lưu khi task con nằm ngoài khoảng của task chính hoặc chồng lên task con khác. Panel hiện khối riêng cho task con đang chọn (nội dung, tiến độ); thanh task con trên canvas cũng tô đậm theo tiến độ |
| Bấm **icon phễu** ở cuối nhãn tên nhân viên | **Lọc riêng nhân viên đó**: chỉ còn các project mà nhân viên có task, và trong mỗi project chỉ còn hàng/task của nhân viên đó (thanh tổng ở LOD 0 cũng chỉ tính trên task của họ). Bấm lại icon của chính họ, bấm chip "Đang lọc" trên header hoặc `Esc` để bỏ lọc |
| Bấm **icon khung ngắm** ở cuối tiêu đề công trình (nhãn project) | **Chế độ tập trung dự án — chia đôi màn hình**: bên trái vẫn là timeline nhưng chỉ còn dự án đó, bên phải là **không gian dự án** với 5 tab: Tổng quan (mô tả, chủ đầu tư, nhà thầu, giá trị hợp đồng, các mốc chính), Công việc (bảng task — bấm 1 hàng để chọn task tương ứng trên timeline), Nhân sự (bảng khối lượng + nút lọc theo từng người), Hồ sơ (danh sách file PDF/DWG/XLSX/DOCX/JPG sinh từ chính các task), Biểu đồ (đường cong tiến độ S-curve kế hoạch/thực tế, cột khối lượng theo nhân viên, donut trạng thái). Thoát bằng nút × ở panel, chip "Đang tập trung" trên header, `Esc`, hoặc bấm lại icon khung ngắm |
| Click **tên project** (nhãn dính mép trái) | **Nổi bật project đó**: mọi project xung quanh chuyển sang sắc xám (gray shade), chỉ project đang chọn giữ màu; click lại vào tên đó, click vùng trống, bấm `Esc` hoặc nút chip trên header để bỏ |
| Nút trên header | Phóng to / Thu nhỏ / Về hôm nay / Toàn cảnh (chuyển động có tween) |

### Mô hình đã chốt khi thảo luận (và đã áp vào bản mẫu)

- Tối đa ~**100 project**, mỗi project **≤ 20 task**; task chạy **song song**
  vì nhiều người cùng làm một project.
- Bên trong lane của project, task xếp **theo hàng của người làm**
  (màu thanh = màu của người đó). **Quy tắc cứng: các task chính của cùng
  1 người không bao giờ trùng nhau** — dữ liệu sinh ra đã xếp nối tiếp theo
  từng người, và khi kéo/kéo mép, task bị chặn tại task kề trước/sau của
  chính người đó; co/giãn cả project cũng có bước sửa chồng lấn do làm tròn.
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
- Dữ liệu giả (`src/data.js`): **25 project, 15 nhân viên**, sinh có seed cố
  định; mỗi nhân viên tham gia nhiều project (6–12 project); task của mỗi
  người xếp nối tiếp trong từng project. Project đang chạy quanh "hôm nay"
  được xếp lên đầu.

### Đã kiểm chứng tự động (headless)

- Build pass; mở trang không lỗi console.
- Zoom tổng hợp 4 nấc: 2,60 → 46,32 px/ngày, LOD 1 → LOD 3, 91 thanh hiển thị.
- Click chọn đúng task, panel hiện đúng người làm / ngày / tiến độ / task con.
- Kéo task +100px ở LOD 3: ngày dời đúng +2 ngày (24-08-2026 → 26-08-2026).

### Giới hạn của bản mẫu

- Dữ liệu giả, kéo task chỉ đổi trong bộ nhớ (tải lại trang là mất).
- Chưa có phụ thuộc giữa các task, chưa sửa bằng form, chưa lưu backend.
- Zoom bằng pinch cảm ứng chưa làm (test bằng chuột là chính).
