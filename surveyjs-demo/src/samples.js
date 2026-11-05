// 3 form mẫu bằng JSON của SurveyJS.
// Mỗi form đều có: bắt buộc, validate, logic rẽ nhánh (visibleIf).

export const SAMPLES = {
  nghiPhep: {
    label: 'Đơn nghỉ phép',
    // Link điền dán sẵn (đã kèm webhook n8n). App dùng link này làm link
    // điền chính thức của form thay vì tự sinh. Muốn đổi link thì dán link
    // mới vào đây, không cần sửa code chỗ khác.
    fillUrl: 'https://nguyenhuuhanhlam.github.io/ideas-n-solutions/surveyjs-demo/?form=nghiPhep&webhook=https%3A%2F%2Fnguyens-mac-mini.taila4a8f3.ts.net%2Fwebhook%2Fsurvey-submit',
    // Webhook mặc định: khi điền xong, app gửi kết quả về đây.
    // Link có ?webhook= sẽ được ưu tiên hơn giá trị này.
    webhookUrl: 'https://nguyens-mac-mini.taila4a8f3.ts.net/webhook/survey-submit',
    json: {
      title: 'Đơn nghỉ phép',
      description: 'Mẫu này demo logic rẽ nhánh: nghỉ trên 3 ngày thì bắt buộc ghi lý do chi tiết.',
      pages: [
        {
          name: 'page1',
          elements: [
            { type: 'text', name: 'hoTen', title: 'Họ và tên', isRequired: true },
            { type: 'text', name: 'email', title: 'Email', inputType: 'email', isRequired: true,
              validators: [{ type: 'email' }] },
            { type: 'dropdown', name: 'loaiNghi', title: 'Loại nghỉ', isRequired: true,
              choices: ['Nghỉ phép năm', 'Nghỉ ốm', 'Nghỉ việc riêng', 'Nghỉ thai sản'] },
            { type: 'text', name: 'tuNgay', title: 'Từ ngày', inputType: 'date', isRequired: true },
            { type: 'text', name: 'soNgay', title: 'Số ngày nghỉ', inputType: 'number', isRequired: true,
              validators: [{ type: 'numeric', minValue: 1, maxValue: 30 }] },
            { type: 'comment', name: 'lyDoChiTiet', title: 'Lý do chi tiết',
              visibleIf: '{soNgay} > 3', isRequired: true,
              description: 'Chỉ hiện khi nghỉ trên 3 ngày (visibleIf).' },
            { type: 'comment', name: 'ghiChu', title: 'Ghi chú thêm' },
          ],
        },
      ],
    },
  },
  khaoSat: {
    label: 'Khảo sát hài lòng',
    json: {
      title: 'Khảo sát mức độ hài lòng',
      description: 'Mẫu này demo rating + hiện ô góp ý khi chấm thấp.',
      pages: [
        {
          name: 'page1',
          elements: [
            { type: 'rating', name: 'haiLong', title: 'Bạn hài lòng với dịch vụ ở mức nào?', isRequired: true, rateMax: 5 },
            { type: 'comment', name: 'gopY', title: 'Bạn chưa hài lòng ở điểm nào? Cho chúng tôi biết để cải thiện.',
              visibleIf: '{haiLong} <= 3', isRequired: true },
            { type: 'radiogroup', name: 'gioiThieu', title: 'Bạn có giới thiệu chúng tôi cho người khác không?',
              choices: ['Chắc chắn có', 'Có thể', 'Không'] },
            { type: 'checkbox', name: 'kenh', title: 'Bạn biết đến chúng tôi qua kênh nào?',
              choices: ['Facebook', 'Google', 'Bạn bè giới thiệu', 'Khác'] },
          ],
        },
      ],
    },
  },
  dangKy: {
    label: 'Đăng ký sự kiện',
    json: {
      title: 'Đăng ký tham dự sự kiện',
      description: 'Mẫu nhiều trang: thông tin cá nhân ở trang 1, chọn buổi ở trang 2.',
      pages: [
        {
          name: 'thongTin',
          title: 'Thông tin cá nhân',
          elements: [
            { type: 'text', name: 'hoTen', title: 'Họ và tên', isRequired: true },
            { type: 'text', name: 'sdt', title: 'Số điện thoại', inputType: 'tel', isRequired: true },
            { type: 'dropdown', name: 'vaiTro', title: 'Bạn là', isRequired: true,
              choices: ['Sinh viên', 'Nhân viên văn phòng', 'Quản lý', 'Khác'] },
          ],
        },
        {
          name: 'chonBuoi',
          title: 'Chọn buổi tham dự',
          elements: [
            { type: 'checkbox', name: 'buoi', title: 'Buổi muốn tham dự', isRequired: true,
              choices: ['Sáng thứ 7', 'Chiều thứ 7', 'Sáng Chủ nhật'] },
            { type: 'boolean', name: 'anTrua', title: 'Đăng ký ăn trưa tại sự kiện?' },
            { type: 'comment', name: 'anKieng', title: 'Ăn kiêng / dị ứng (nếu có)',
              visibleIf: '{anTrua} = true' },
          ],
        },
      ],
    },
  },
}

export const SAMPLE_KEYS = Object.keys(SAMPLES)
export const DEFAULT_SAMPLE = 'nghiPhep'
