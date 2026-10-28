// Dữ liệu mẫu — cây Tailscale, buổi hỏi đáp 28-10-2026.
// Quy tắc đã chốt với user:
// - Chỉ ghi khi user yêu cầu ghi nhận, không tự ghi mọi câu hỏi đáp.
// - Node đơn giản: tiêu đề = chủ đề tóm tắt, chi tiết = câu trả lời tóm tắt.
// - Đưa bản tóm tắt cho user duyệt trước khi ghi.
// - Chủ đề trùng lắp thì bổ sung node con, không tạo node trùng riêng.
export const MAPS = [
  {
    id: 'tailscale',
    title: 'Tailscale',
    date: '28-10-2026',
    note: 'Buổi hỏi đáp 28-10-2026 · 5 câu hỏi đã ghi nhận · 1 node con trùng chủ đề',
  },
]

export const NODES = [
  {
    id: 'root',
    parentId: null,
    kind: 'root',
    title: 'Tailscale',
    detail: 'Mạng riêng ảo (tailnet) nối các máy ở xa như đang cùng một mạng LAN. Buổi hỏi đáp ngày 28-10-2026, đã ghi nhận 5 câu hỏi.',
    source: 'Buổi hỏi đáp 28-10-2026',
    date: '28-10-2026',
    position: { x: 10, y: 280 },
  },
  {
    id: 'q1',
    parentId: 'root',
    kind: 'question',
    title: 'Tailscale là gì?',
    detail: 'Chương trình tạo mạng riêng ảo cho các máy của bạn, dù chúng ở xa nhau. Mỗi máy được cấp IP riêng dạng 100.x, chỉ máy cùng tài khoản mới thấy nhau. Không cần public IP, không cần mở cổng trên router, không cần DDNS. Lưu lượng mã hóa WireGuard, truy cập được dịch vụ nội bộ từ xa như MCP server, MySQL, NAS, camera, máy in.',
    source: 'Trả lời trong buổi hỏi đáp',
    date: '28-10-2026',
    position: { x: 380, y: 20 },
  },
  {
    id: 'q2',
    parentId: 'root',
    kind: 'question',
    title: 'Tailscale có free không?',
    detail: 'Có, bản Personal là $0, dùng cho cá nhân, gồm 3 user và 100 thiết bị, gần như đủ tính năng chính. Với cách dùng hiện tại mới có 2 máy nên còn xa giới hạn.',
    source: 'tailscale.com/pricing, kiểm chứng 28-10-2026',
    date: '28-10-2026',
    position: { x: 380, y: 150 },
  },
  {
    id: 'q2a',
    parentId: 'q2',
    kind: 'child',
    title: 'Personal Plus $5/tháng',
    detail: 'Gói trả thêm khi cần nhiều người hơn: $5/tháng cho 6 user, 100 thiết bị, chia sẻ với gia đình. Đây là ví dụ cho quy tắc trùng lắp: thông tin này thuộc về node “Tailscale có free không?” nên được bổ sung làm node con, thay vì tạo một node trùng riêng ngang hàng.',
    source: 'tailscale.com/pricing, kiểm chứng 28-10-2026',
    date: '28-10-2026',
    position: { x: 760, y: 150 },
  },
  {
    id: 'q3',
    parentId: 'root',
    kind: 'question',
    title: 'Tailscale có bản macOS không?',
    detail: 'Có, 2 cách cài: từ Mac App Store, hoặc bản Standalone tải từ tailscale.com/download (ít bị giới hạn sandbox hơn, hợp cho tính năng nâng cao). Giao diện mới cần macOS 13 Ventura trở lên, máy còn macOS 12 Monterey thì vẫn dùng giao diện cũ. Đăng nhập cùng tài khoản là vào chung mạng với máy Windows hiện tại.',
    source: 'Trả lời trong buổi hỏi đáp',
    date: '28-10-2026',
    position: { x: 380, y: 280 },
  },
  {
    id: 'q4',
    parentId: 'root',
    kind: 'question',
    title: 'Muse có truy xuất được folder qua Tailscale không?',
    detail: 'Được, nhưng Tailscale chỉ lo phần đường mạng, không tự mở folder. Cần thêm 1 dịch vụ trên máy Windows chia sẻ đúng folder đó qua mạng, ví dụ thêm tool đọc file vào MCP server đang chạy ở cổng 8001, chạy 1 web server nhỏ trỏ vào folder, hoặc Windows File Sharing / SFTP. Máy ảo của Muse chỉ kết nối TCP ra ngoài qua Tailscale, không mount ổ đĩa trực tiếp được.',
    source: 'Trả lời trong buổi hỏi đáp',
    date: '28-10-2026',
    position: { x: 380, y: 410 },
  },
  {
    id: 'q5',
    parentId: 'root',
    kind: 'question',
    title: 'Tailscale có nổi tiếng và đáng tin không?',
    detail: 'Có. Công ty ở Toronto, thành lập năm 2019 bởi các kỹ sư cũ của Google. Đầu 2026 đã có hơn 5 triệu người dùng đăng ký, hơn 20.000 doanh nghiệp, khách hàng gồm Hugging Face, Mozilla, Mercari, Instacart. Đạt chứng nhận SOC 2 Type 2, client mã nguồn mở một phần, lưu lượng đi trực tiếp giữa các máy, mã hóa đầu cuối, hệ thống điều khiển chỉ lo trao đổi khóa.',
    source: 'Tổng hợp từ các nguồn công khai, kiểm chứng 28-10-2026',
    date: '28-10-2026',
    position: { x: 380, y: 540 },
  },
]

// Bản tóm tắt demo cho luồng “đưa trước khi ghi” — chưa ghi, chờ user duyệt.
export const DRAFT_PROPOSAL = {
  map: 'Tailscale',
  parentId: 'q2',
  parentTitle: 'Tailscale có free không?',
  title: 'Starter $6/user/tháng',
  detail: 'Gói cho team nhỏ khi vượt giới hạn bản Personal: $6/user/tháng, 100 + 10 thiết bị/user, có split tunneling, MagicDNS và ACL cơ bản.',
  reason: 'Trùng chủ đề với node “Tailscale có free không?” nên đề xuất bổ sung làm node con, không tạo node trùng riêng.',
}
