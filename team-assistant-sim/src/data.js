// Dữ liệu giả lập — chỉ phục vụ prototype, không phải dữ liệu thật.
// Phạm vi theo buổi thảo luận 27-10-2026 (xem ~/workspace/team-assistant-idea/ghi-chu-thiet-ke.md):
// team ~10 người, lĩnh vực kiến trúc, 1 dự án chung, mỗi member 1 kênh riêng.

export const PROJECT = {
  name: 'Trung tâm Văn hóa Ven Sông',
  phase: 'Thiết kế cơ sở',
  code: 'TVS-2026',
  note: 'Workspace chung là “sự thật duy nhất”: chỉ bản đã duyệt mới được ghi nhận vào đây.',
}

export const MEMBERS = [
  { id: 'quan', name: 'Trần Minh Quân', role: 'Quản lý dự án', kind: 'manager', initials: 'MQ', color: '#ffd166' },
  { id: 'an', name: 'Lê Thu An', role: 'Kiến trúc sư chủ trì', kind: 'member', initials: 'TA', color: '#8ab8ff' },
  { id: 'bao', name: 'Phạm Quốc Bảo', role: 'Kiến trúc sư', kind: 'member', initials: 'QB', color: '#7ee0a3' },
  { id: 'chi', name: 'Nguyễn Hà Chi', role: 'Kiến trúc sư', kind: 'member', initials: 'HC', color: '#f2a0c0' },
  { id: 'duc', name: 'Đỗ Minh Đức', role: 'Kỹ sư kết cấu', kind: 'member', initials: 'MĐ', color: '#c3a6ff' },
  { id: 'huong', name: 'Vũ Lan Hương', role: 'Kiến trúc sư nội thất', kind: 'member', initials: 'LH', color: '#ffb27d' },
  { id: 'son', name: 'Hoàng Thanh Sơn', role: 'Kỹ sư MEP', kind: 'member', initials: 'TS', color: '#7fd4d4' },
  { id: 'tram', name: 'Bùi Ngọc Trâm', role: 'Chuyên viên hồ sơ / BOQ', kind: 'member', initials: 'NT', color: '#e8e07a' },
  { id: 'tuananh', name: 'Ngô Tuấn Anh', role: 'Kiến trúc sư cảnh quan', kind: 'member', initials: 'TA2', color: '#9fd48a' },
  { id: 'linh', name: 'Đặng Phương Linh', role: 'Chuyên viên khách hàng', kind: 'member', initials: 'PL', color: '#ff9d9d' },
]

export const AGENTS = [
  { id: 'tracuu', name: 'Tra cứu', desc: 'Quy chuẩn, tiêu chuẩn, vật liệu, tiền lệ', icon: '🔎', color: '#8ab8ff' },
  { id: 'cad2d', name: 'Vẽ 2D / CAD', desc: 'Mặt bằng, mặt đứng, mặt cắt', icon: '📐', color: '#7ee0a3' },
  { id: 'render3d', name: '3D / Render', desc: 'Mô hình 3D, phối cảnh, vật liệu', icon: '🧊', color: '#c3a6ff' },
  { id: 'hoso', name: 'Hồ sơ', desc: 'Thuyết minh, spec, BOQ, dự toán', icon: '📄', color: '#ffd166' },
  { id: 'qlda', name: 'Quản lý dự án', desc: 'Tiến độ, phân công, nhắc hạn', icon: '🗂️', color: '#7fd4d4' },
  { id: 'khachhang', name: 'Khách hàng', desc: 'Soạn thư, tóm tắt cho chủ đầu tư', icon: '✉️', color: '#f2a0c0' },
]

// Quy tắc duyệt trong prototype — GIẢ ĐỊNH ĐỂ MÔ PHỎNG, CHƯA CHỐT (27-10 user nói chưa cần đi sâu):
// - Tiêu chí "đủ" để AI tự duyệt và danh sách "không bao giờ tự duyệt" vẫn để ngỏ.
// - Prototype tạm đặt: BOQ/dự toán và phát hành bản vẽ KHÔNG bao giờ tự duyệt;
//   tra cứu / phối cảnh nháp thì AI được tự duyệt nếu checklist đạt.
export const APPROVAL_RULES = [
  { type: 'Tra cứu quy chuẩn', auto: true, note: 'AI tự duyệt nếu trích đúng điều khoản + nguồn.' },
  { type: 'Phối cảnh / 3D nháp', auto: true, note: 'AI tự duyệt nếu đúng phương án + đúng Rev nền.' },
  { type: 'Bản vẽ 2D', auto: false, note: 'Không tự duyệt — bản vẽ trước phát hành cần KTS kiểm tra và ký.' },
  { type: 'BOQ / Dự toán', auto: false, note: 'Không tự duyệt — liên quan tiền, chờ quản lý.' },
  { type: 'Thư cho khách hàng', auto: false, note: 'Không tự duyệt — chờ quản lý soát câu chữ.' },
]

export const INITIAL_WORKSPACE = [
  { id: 'ws1', title: 'Mặt bằng tổng thể — Rev A', kind: 'Bản vẽ 2D', by: 'Lê Thu An', approvedBy: 'Quản lý', time: '24-10-2026 09:12', rev: 'Rev A' },
  { id: 'ws2', title: 'Quyết định đã chốt: Phương án sảnh chính hướng sông', kind: 'Quyết định', by: 'Trần Minh Quân', approvedBy: 'Quản lý', time: '24-10-2026 16:40', rev: '—' },
  { id: 'ws3', title: 'Thuyết minh thiết kế cơ sở — v0.9', kind: 'Hồ sơ', by: 'Bùi Ngọc Trâm', approvedBy: 'AI tự duyệt', time: '25-10-2026 11:05', rev: 'v0.9' },
]

// Kịch bản mẫu — mỗi kịch bản là 1 lệnh member gửi ở kênh riêng.
// subtasks: agent nào làm, làm gì, mất bao lâu (giả lập), ra "bản nháp" gì.
export const SCENARIOS = [
  {
    id: 's1', memberId: 'an', title: 'Vẽ lại mặt bằng tầng 1 theo phương án B',
    request: 'Vẽ lại mặt bằng tầng 1 theo phương án B: mở rộng sảnh chính về phía sông, giữ nguyên lõi thang. Cần cả phối cảnh sảnh để trình khách.',
    type: 'Bản vẽ 2D', autoEligible: false,
    subtasks: [
      { agentId: 'cad2d', job: 'Vẽ lại mặt bằng tầng 1 — phương án B', ms: 2600, output: 'MB-T1-PhuongAnB.dwg (nháp) — sảnh mở về phía sông, lõi thang giữ nguyên' },
      { agentId: 'render3d', job: 'Dựng phối cảnh sảnh chính', ms: 3400, output: 'Phối cảnh sảnh chính — góc nhìn từ sông (nháp)' },
    ],
    checklist: ['Đúng phương án B đã chốt', 'Lõi thang không đổi', 'Khớp Rev A đang hiệu lực'],
    checkPass: true,
    note: 'Bản vẽ 2D không tự duyệt → chờ quản lý, dù checklist đạt.',
  },
  {
    id: 's2', memberId: 'tram', title: 'Lập BOQ phần thô tầng 1–3',
    request: 'Lập BOQ phần thô tầng 1–3 theo mặt bằng Rev A, tách riêng bê tông / thép / ván khuôn.',
    type: 'BOQ / Dự toán', autoEligible: false,
    subtasks: [
      { agentId: 'hoso', job: 'Bóc khối lượng phần thô tầng 1–3', ms: 3000, output: 'BOQ-Tho-T1-T3.xlsx (nháp) — bê tông 412 m³, thép 38,6 t' },
      { agentId: 'tracuu', job: 'Đối chiếu đơn giá vật liệu tháng 10', ms: 1800, output: 'Bảng đơn giá tham chiếu 10-2026 (nháp)' },
    ],
    checklist: ['Khối lượng khớp Rev A', 'Đơn giá có nguồn', 'Tách đúng 3 hạng mục'],
    checkPass: true,
    note: 'BOQ liên quan tiền → không bao giờ tự duyệt, chờ quản lý.',
  },
  {
    id: 's3', memberId: 'chi', title: 'Tra cứu quy chuẩn PCCC cho thang thoát hiểm',
    request: 'Thang thoát hiểm tầng 1–3 cần bề rộng tối thiểu bao nhiêu theo quy chuẩn PCCC hiện hành? Trích đúng điều khoản.',
    type: 'Tra cứu quy chuẩn', autoEligible: true,
    subtasks: [
      { agentId: 'tracuu', job: 'Tra cứu quy chuẩn PCCC — thang thoát hiểm', ms: 2200, output: 'Trích dẫn QCVN 06:2022/BXD, Điều 3.2.x — bề rộng tối thiểu 1,2 m (nháp)' },
    ],
    checklist: ['Trích đúng điều khoản', 'Có nguồn QCVN', 'Áp đúng loại công trình'],
    checkPass: true,
    note: 'Tra cứu đủ checklist → AI tự duyệt cho qua, ghi nhận ngay.',
  },
  {
    id: 's4', memberId: 'bao', title: 'Mâu thuẫn: diện tích sảnh chính',
    request: 'Tôi đề xuất tăng diện tích sảnh chính thêm 20 m² để làm khu triển lãm nhỏ.',
    type: 'Bản vẽ 2D', autoEligible: false, conflictWith: 'chi',
    subtasks: [
      { agentId: 'cad2d', job: 'Thử phương án sảnh +20 m²', ms: 2400, output: 'MB-T1-Sanh+20m2.dwg (nháp) — sảnh mở rộng, lấn 20 m² khu triển lãm' },
    ],
    checklist: ['Không lấn lõi thang', 'Khớp Rev A'],
    checkPass: true,
    note: 'Mâu thuẫn với yêu cầu của Hà Chi (muốn giữ sảnh, tăng phòng họp) → leo thang lên quản lý, trợ lý không tự chọn.',
    conflictNote: 'Hà Chi đã yêu cầu trước đó: “Giữ nguyên sảnh, tăng phòng họp thêm 15 m²”. Hai yêu cầu cùng sửa mặt bằng tầng 1 nên mâu thuẫn.',
  },
  {
    id: 's5', memberId: 'linh', title: 'Soạn thư cập nhật tiến độ cho chủ đầu tư',
    request: 'Soạn thư cập nhật tiến độ tuần này cho chủ đầu tư: mặt bằng Rev A đã duyệt, đang làm phương án B tầng 1.',
    type: 'Thư cho khách hàng', autoEligible: false,
    subtasks: [
      { agentId: 'qlda', job: 'Tổng hợp tiến độ tuần từ workspace', ms: 1600, output: 'Tiến độ tuần: Rev A đã duyệt; phương án B tầng 1 đang làm' },
      { agentId: 'khachhang', job: 'Soạn thư cho chủ đầu tư', ms: 2400, output: 'Thư cập nhật tiến độ — bản nháp (chờ quản lý soát)' },
    ],
    checklist: ['Số liệu khớp workspace', 'Giọng văn đúng mực'],
    checkPass: false,
    checkFailReason: 'AI đánh giá chưa đủ: thư nhắc “phương án B” nhưng phương án B chưa được duyệt — dễ gây hiểu lầm cho khách.',
    note: 'Checklist không đạt → AI không tự duyệt, chờ quản lý quyết định.',
  },
]

export function memberName(id) {
  return MEMBERS.find((m) => m.id === id)?.name || id
}
export function agentName(id) {
  return AGENTS.find((a) => a.id === id)?.name || id
}
