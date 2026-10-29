// Dữ liệu mẫu — cây Tailscale, buổi hỏi đáp 28-10-2026.
// Cấu trúc đã chốt với user (22:52, 28-10-2026 — thay cấu trúc cũ “mỗi câu hỏi 1 node”):
// - Bản ghi nhớ nội dung chính của phiên làm việc, hạn chế sinh quá nhiều node.
// - Nút gốc (ví dụ “Muse Q&A”, có thể 1 hoặc nhiều nút gốc cho các dạng chủ đề khác nhau)
//   → topic → subtopic, tối đa 1–4 nhánh subtopic, tóm tắt tối ưu nội dung.
// - Chỉ ghi khi user yêu cầu ghi nhận, không tự ghi mọi câu hỏi đáp.
// - Node đơn giản: tiêu đề = chủ đề tóm tắt, chi tiết = câu trả lời tóm tắt.
// - Đưa bản tóm tắt cho user duyệt trước khi ghi.
// - Chủ đề trùng lắp thì gộp vào chi tiết của subtopic đã có, không tạo node mới.
export const MAPS = [
  {
    id: 'muse-qa',
    title: 'Muse Q&A',
    date: '29-10-2026',
    note: 'Bản ghi nhớ nội dung chính các buổi hỏi đáp · Topic Tailscale, Render ngoại thất SketchUp · mỗi topic tối đa 4 subtopic',
  },
]

export const NODES = [
  {
    id: 'root',
    parentId: null,
    kind: 'root',
    title: 'Muse Q&A',
    detail: 'Bản ghi nhớ nội dung chính các buổi hỏi đáp với Muse. Mỗi topic là một phiên làm việc, mỗi topic tối đa 4 subtopic tóm tắt tối ưu nội dung.',
    source: 'Quy tắc đã chốt 28-10-2026',
    date: '28-10-2026',
    position: { x: 10, y: 280 },
  },
  {
    id: 'topic-tailscale',
    parentId: 'root',
    kind: 'topic',
    title: 'Tailscale',
    detail: 'Buổi hỏi đáp ngày 28-10-2026. Đã gom 5 câu hỏi thành 4 subtopic: tổng quan và độ tin cậy, giá, cài đặt macOS, truy xuất folder.',
    source: 'Buổi hỏi đáp 28-10-2026',
    date: '28-10-2026',
    position: { x: 380, y: 280 },
  },
  {
    id: 'sub-overview',
    parentId: 'topic-tailscale',
    kind: 'subtopic',
    title: 'Tổng quan và độ tin cậy',
    detail: 'Tailscale tạo mạng riêng ảo (tailnet) nối các máy ở xa như cùng một mạng LAN. Mỗi máy được cấp IP riêng dạng 100.x, chỉ máy cùng tài khoản mới thấy nhau. Không cần public IP, không cần mở cổng router, không cần DDNS. Lưu lượng mã hóa WireGuard, truy cập được dịch vụ nội bộ từ xa như MCP server, MySQL, NAS, camera. Công ty ở Toronto, thành lập 2019 bởi cựu kỹ sư Google. Đầu 2026 hơn 5 triệu user, hơn 20.000 doanh nghiệp, khách gồm Hugging Face, Mozilla, Mercari, Instacart. Đạt SOC 2 Type 2, lưu lượng đi trực tiếp giữa các máy, mã hóa đầu cuối.',
    source: 'Trả lời trong buổi hỏi đáp + nguồn công khai, kiểm chứng 28-10-2026',
    date: '28-10-2026',
    position: { x: 760, y: 40 },
  },
  {
    id: 'sub-price',
    parentId: 'topic-tailscale',
    kind: 'subtopic',
    title: 'Giá',
    detail: 'Có bản free. Bản Personal $0 cho cá nhân: 3 user, 100 thiết bị, gần đủ tính năng chính. Personal Plus $5/tháng: 6 user, 100 thiết bị, chia sẻ với gia đình.',
    source: 'tailscale.com/pricing, kiểm chứng 28-10-2026',
    date: '28-10-2026',
    position: { x: 760, y: 200 },
  },
  {
    id: 'sub-macos',
    parentId: 'topic-tailscale',
    kind: 'subtopic',
    title: 'Cài đặt macOS',
    detail: 'Có bản macOS, 2 cách cài: từ Mac App Store, hoặc bản Standalone tải từ tailscale.com/download (ít bị giới hạn sandbox hơn, hợp cho tính năng nâng cao). Giao diện mới cần macOS 13 Ventura trở lên, máy còn macOS 12 Monterey thì vẫn dùng giao diện cũ. Đăng nhập cùng tài khoản là vào chung mạng với máy Windows hiện tại.',
    source: 'Trả lời trong buổi hỏi đáp',
    date: '28-10-2026',
    position: { x: 760, y: 360 },
  },
  {
    id: 'sub-folder',
    parentId: 'topic-tailscale',
    kind: 'subtopic',
    title: 'Truy xuất folder',
    detail: 'Muse truy xuất được folder qua Tailscale, nhưng Tailscale chỉ lo phần đường mạng, không tự mở folder. Cần thêm 1 dịch vụ trên máy Windows chia sẻ đúng folder đó qua mạng, ví dụ thêm tool đọc file vào MCP server đang chạy ở cổng 8001, chạy 1 web server nhỏ trỏ vào folder, hoặc Windows File Sharing / SFTP. Máy ảo của Muse chỉ kết nối TCP ra ngoài qua Tailscale, không mount ổ đĩa trực tiếp được.',
    source: 'Trả lời trong buổi hỏi đáp',
    date: '28-10-2026',
    position: { x: 760, y: 520 },
  },
  {
    id: 'topic-sketchup-render',
    parentId: 'root',
    kind: 'topic',
    title: 'Render ngoại thất SketchUp',
    detail: 'Buổi hỏi đáp ngày 29-10-2026: tìm prompt tốt để render ngoại thất kiến trúc từ file SketchUp. Đã gom 6 prompt thành 4 subtopic: nguyên tắc và xuất ảnh, ban ngày và golden hour, buổi tối và phong cách khác, SketchUp AI Render và negative prompt.',
    source: 'Buổi hỏi đáp 29-10-2026',
    date: '29-10-2026',
    position: { x: 380, y: 880 },
  },
  {
    id: 'sub-sketchup-principle',
    parentId: 'topic-sketchup-render',
    kind: 'subtopic',
    title: 'Nguyên tắc và xuất ảnh',
    detail: 'Giữ nguyên hình khối, tỉ lệ và góc máy là câu khóa quan trọng nhất, vì AI dễ tự thêm tầng, đổi cửa sổ, đổi mặt đứng. Xuất ảnh dạng Shaded hoặc Shaded with Textures, tắt Profiles, ẩn guides và section plane, dùng Two-Point Perspective, FOV khoảng 35–60° cho đỡ méo hình.',
    source: 'Buổi hỏi đáp 29-10-2026 · Cad2Real, SketchUp guide',
    date: '29-10-2026',
    position: { x: 760, y: 640 },
  },
  {
    id: 'sub-sketchup-day-golden',
    parentId: 'topic-sketchup-render',
    kind: 'subtopic',
    title: 'Ban ngày và golden hour',
    detail: 'Mẫu khung chung: giữ đúng geometry, proportions và camera, mặt đứng trắng + lam gỗ ấm, kính full chiều cao, mái phẳng, sân vườn, nắng nhẹ, ảnh kiến trúc chi tiết cao. Ban ngày nắng đẹp thêm đá tự nhiên, cửa kính mở ra terrace, cây cọ, lối đá. Golden hour thêm ánh sáng ấm, bóng dài, kính sáng đèn từ trong, phản chiếu hồ bơi, tông điện ảnh.',
    source: 'Buổi hỏi đáp 29-10-2026',
    date: '29-10-2026',
    position: { x: 760, y: 800 },
  },
  {
    id: 'sub-sketchup-night-style',
    parentId: 'topic-sketchup-render',
    kind: 'subtopic',
    title: 'Buổi tối và phong cách khác',
    detail: 'Blue hour: khung thép đen + kính, đèn trong nhà ấm tương phản trời xanh đậm, đèn lối đi, phản chiếu mặt nước. Tối giản: bê tông thô + thép đen, cửa trượt kính lớn, sân rải sỏi, cây tạo hình, sáng dịu trời âm u. Nhà phố trời mưa nhẹ: gạch tối, khung cửa thép rộng, vỉa hè ướt tạo phản chiếu trên gạch và kính.',
    source: 'Buổi hỏi đáp 29-10-2026',
    date: '29-10-2026',
    position: { x: 760, y: 960 },
  },
  {
    id: 'sub-sketchup-ai-note',
    parentId: 'topic-sketchup-render',
    kind: 'subtopic',
    title: 'SketchUp AI Render và negative prompt',
    detail: 'Prompt SketchUp AI Render nên dưới 500 ký tự, viết như nói chuyện bình thường, nêu rõ vật liệu, ánh sáng, cảnh quan, phong cách, tránh các ký tự $, ..., +, =. Negative prompt nếu tool có hỗ trợ: distorted geometry, extra floors, changed windows, warped perspective, cartoon, low detail, blurry, extra buildings.',
    source: 'Buổi hỏi đáp 29-10-2026 · SketchUp Help, Best Practices for Custom Prompts',
    date: '29-10-2026',
    position: { x: 760, y: 1120 },
  },
]

// Bản tóm tắt demo cho luồng “đưa trước khi ghi” — chưa ghi, chờ user duyệt.
// Lần này là gộp vào chi tiết subtopic đã có, không tạo node mới.
export const DRAFT_PROPOSAL = {
  map: 'Muse Q&A',
  targetId: 'sub-price',
  targetTitle: 'Giá',
  title: 'Bổ sung vào subtopic “Giá”',
  detail: 'Thêm vào chi tiết hiện tại: “Starter $6/user/tháng cho team nhỏ: 100 + 10 thiết bị/user, có split tunneling, MagicDNS và ACL cơ bản.”',
  reason: 'Trùng chủ đề với subtopic “Giá” nên đề xuất gộp vào chi tiết của subtopic đó, không tạo node mới, để giữ tối đa 4 nhánh.',
  appendText: ' Starter $6/user/tháng cho team nhỏ: 100 + 10 thiết bị/user, có split tunneling, MagicDNS và ACL cơ bản.',
}
