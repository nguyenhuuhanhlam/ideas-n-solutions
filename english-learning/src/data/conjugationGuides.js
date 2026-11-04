// Hướng dẫn chia động từ chi tiết cho từng nhóm (hiển thị ở chi tiết nhóm).
// Mỗi hướng dẫn gồm: sơ đồ bảng (diagram), sơ đồ luồng các bước làm
// (flow: hộp bước nối bằng mũi tên, gặp câu hỏi thì rẽ 2 nhánh rồi đi
// tiếp), mẹo nhớ và ví dụ đặc biệt về số ít / số nhiều — phần hay gây
// nhầm nhất cho trẻ. Nội dung ở trình độ tiểu học: chỉ dùng quy tắc và
// ví dụ đã kiểm chứng.
export const conjugationGuides = {
  'to-be': {
    table: {
      idKey: 'subject',
      columns: [
        { key: 'subject', header: 'Chủ ngữ' },
        { key: 'present', header: 'Hiện tại' },
        { key: 'past', header: 'Quá khứ' },
        { key: 'example', header: 'Ví dụ' },
      ],
      rows: [
        { subject: 'I (tôi)', present: 'am', past: 'was', example: 'I am happy. / I was happy yesterday.' },
        { subject: 'He / She / It (anh ấy, cô ấy, nó)', present: 'is', past: 'was', example: 'She is a teacher. / She was a teacher.' },
        { subject: 'You / We / They (bạn, chúng tôi, họ)', present: 'are', past: 'were', example: 'They are friends. / They were friends.' },
        { subject: 'Lan (1 người)', present: 'is', past: 'was', example: 'Lan is kind.' },
        { subject: 'Lan and Minh (2 người)', present: 'are', past: 'were', example: 'Lan and Minh are kind.' },
      ],
    },
    flow: [
      { label: 'Tìm chủ ngữ', sub: 'Ai hoặc cái gì làm chủ ngữ trong câu?' },
      {
        decision: 'Chủ ngữ là 1 hay nhiều?',
        branches: [
          { tag: '1 người / vật', result: 'is / was', note: 'Riêng "I" dùng am / was' },
          { tag: 'Nhiều người / vật', result: 'are / were', note: 'You, we, they, 2 tên trở lên' },
        ],
      },
      { label: 'Phủ định: thêm not', sub: "isn't, aren't, wasn't, weren't" },
      { label: 'Câu hỏi: đảo be lên trước', sub: 'Is she happy? / Are they happy?' },
    ],
    tips: [
      'Chỉ mình "I" dùng am — gặp "I" là nhớ ngay am.',
      'Tên 1 người = is, 2 tên nối bằng "and" = are.',
      'Hỏi tuổi luôn dùng are với "you": How old are you? (you luôn đi với are, kể cả khi hỏi 1 người).',
    ],
    specials: [
      { example: 'Everyone is happy.', why: 'Everyone (mọi người) nghe như nhiều người, nhưng động từ coi như số ít → is, không phải are.' },
      { example: 'People are happy.', why: 'People (mọi người, con người) đã là dạng số nhiều → are.' },
      { example: 'Children are happy.', why: 'Children là số nhiều của child (không thêm -s mà đổi hẳn từ) → are.' },
      { example: 'My family is happy.', why: 'Cả gia đình coi là 1 nhóm → is.' },
    ],
  },
  'present-simple': {
    table: {
      idKey: 'subject',
      columns: [
        { key: 'subject', header: 'Chủ ngữ' },
        { key: 'verb', header: 'Động từ' },
        { key: 'example', header: 'Ví dụ' },
      ],
      rows: [
        { subject: 'I / You / We / They', verb: 'nguyên thể (play)', example: 'They play football.' },
        { subject: 'He / She / It', verb: '+ -s (plays)', example: 'She plays football.' },
        { subject: 'Lan (1 người)', verb: '+ -s', example: 'Lan plays football.' },
        { subject: 'Lan and Minh (2 người)', verb: 'nguyên thể', example: 'Lan and Minh play football.' },
        { subject: 'Đuôi s / x / ch / sh', verb: '+ -es', example: 'watch → watches, fix → fixes, brush → brushes' },
        { subject: 'Phụ âm + y', verb: 'đổi y → ies', example: 'study → studies, fly → flies' },
        { subject: 'Nguyên âm + y', verb: '+ -s', example: 'play → plays (trước y là nguyên âm a nên giữ y)' },
      ],
    },
    flow: [
      { label: 'Tìm chủ ngữ', sub: 'Ai hoặc cái gì làm hành động?' },
      {
        decision: 'Chủ ngữ là ai?',
        branches: [
          { tag: 'he / she / it, 1 tên', result: '+ -s / -es / -ies', note: 'She plays, Lan plays' },
          { tag: 'I / you / we / they, 2 tên', result: 'giữ nguyên thể', note: 'They play, Lan and Minh play' },
        ],
      },
      { label: 'Xem đuôi động từ để chọn -s, -es hay -ies', sub: 's/x/ch/sh → -es · phụ âm + y → -ies · nguyên âm + y → -s' },
      { label: 'Phủ định / câu hỏi: dùng don’t / doesn’t, Do / Does', sub: 'Động từ về NGUYÊN THỂ — She doesn’t play (không phải plays)' },
    ],
    tips: [
      'Đọc thành vần: "He, She, It — nhớ thêm s".',
      'Thấy doesn’t là động từ về nguyên thể ngay.',
      'Dấu hiệu hay gặp: every day, always, usually, often.',
    ],
    specials: [
      { example: 'Everyone likes ice cream.', why: 'Everyone coi như số ít → likes (thêm -s), dù nghĩa là "mọi người".' },
      { example: 'Children play football.', why: 'Children đã là số nhiều → play (nguyên thể, không thêm -s).' },
      { example: 'People like music.', why: 'People là số nhiều → like.' },
      { example: 'The dog plays. / The dogs play.', why: '1 con chó → plays; nhiều con chó (dogs) → play. Đếm chủ ngữ trước rồi mới chia.' },
    ],
  },
  'present-continuous': {
    table: {
      idKey: 'subject',
      columns: [
        { key: 'subject', header: 'Chủ ngữ' },
        { key: 'be', header: 'be' },
        { key: 'verb', header: 'V-ing' },
        { key: 'example', header: 'Ví dụ' },
      ],
      rows: [
        { subject: 'I', be: 'am', verb: 'reading', example: 'I am reading now.' },
        { subject: 'He / She / It', be: 'is', verb: 'reading', example: 'She is reading now.' },
        { subject: 'You / We / They', be: 'are', verb: 'reading', example: 'They are reading now.' },
        { subject: 'Lan (1 người)', be: 'is', verb: 'reading', example: 'Lan is reading now.' },
        { subject: 'Lan and Minh (2 người)', be: 'are', verb: 'reading', example: 'Lan and Minh are reading now.' },
      ],
    },
    flow: [
      { label: 'Tìm chủ ngữ', sub: 'Ai đang làm hành động ngay lúc nói?' },
      { label: 'Chọn be theo chủ ngữ', sub: 'I → am · he/she/it → is · you/we/they → are' },
      { label: 'Thêm -ing vào động từ', sub: 'bỏ e cuối (make → making) · gấp đôi phụ âm (run → running) · lie → lying' },
      { label: 'Phủ định / câu hỏi', sub: 'be + not + V-ing (is not playing) · đảo be lên trước: Is she playing?' },
    ],
    tips: [
      'Dấu hiệu: now, at the moment, Look!, Listen!, right now.',
      'be + V-ing = ĐANG làm (ngay lúc nói), khác với hiện tại đơn là thói quen.',
      'Chỉ "I" dùng am — gặp "I" là am, không bao giờ is/are.',
    ],
    specials: [
      { example: 'Children are playing.', why: 'Children là số nhiều → are (không phải is).' },
      { example: 'Everyone is playing.', why: 'Everyone coi như số ít → is.' },
      { example: 'Lan and Minh are playing.', why: '2 tên nối bằng "and" = số nhiều → are.' },
    ],
  },
  'past-regular': {
    table: {
      idKey: 'rule',
      columns: [
        { key: 'rule', header: 'Quy tắc' },
        { key: 'example', header: 'Ví dụ' },
      ],
      rows: [
        { rule: 'Thường: + -ed', example: 'work → worked, visit → visited' },
        { rule: 'Tận cùng bằng e: chỉ + -d', example: 'live → lived' },
        { rule: 'Phụ âm + y: đổi y → ied', example: 'study → studied (nhưng play → played vì trước y là nguyên âm)' },
        { rule: '1 âm tiết, nguyên âm ngắn + 1 phụ âm: gấp đôi phụ âm + -ed', example: 'stop → stopped, plan → planned' },
      ],
    },
    flow: [
      { label: 'Xem đuôi động từ', sub: 'Động từ tận cùng bằng gì?' },
      { label: 'Áp đúng quy tắc', sub: '+ -ed · tận cùng e → + -d · phụ âm + y → -ied · gấp đôi phụ âm → -ed' },
      { label: 'Nhớ: quá khứ KHÔNG chia theo chủ ngữ', sub: 'He played = They played — dạng giống hệt nhau' },
      { label: 'Phủ định / câu hỏi: didn’t / Did', sub: 'Động từ về nguyên thể — didn’t play (không phải played)' },
    ],
    tips: [
      'Dấu hiệu: yesterday, last night, last week, ago, in 2020.',
      'Thấy didn’t là động từ về nguyên thể ngay.',
      'Đọc to cặp: work–worked, live–lived, study–studied để nhớ quy tắc theo tai.',
    ],
    specials: [
      { example: 'He played. / They played.', why: 'Cùng một dạng played — quá khứ không phân biệt số ít/số nhiều.' },
      { example: 'Children played football.', why: 'Children là số nhiều nhưng played vẫn không đổi.' },
      { example: 'Everyone played football.', why: 'Everyone là số ít nhưng played cũng không đổi — quá khứ "bình đẳng" với mọi chủ ngữ.' },
    ],
  },
  'past-irregular': {
    table: {
      idKey: 'group',
      columns: [
        { key: 'group', header: 'Nhóm nhớ' },
        { key: 'example', header: 'V1 → V2' },
      ],
      rows: [
        { group: 'Đổi nguyên âm', example: 'sing → sang, swim → swam, drink → drank' },
        { group: 'Thêm -ought / -aught', example: 'buy → bought, think → thought, catch → caught, teach → taught' },
        { group: 'Giữ nguyên dạng', example: 'cut → cut, put → put, read → read (đọc là /red/)' },
        { group: 'Học thuộc riêng', example: 'go → went, see → saw, eat → ate, take → took, give → gave, find → found' },
      ],
    },
    flow: [
      { label: 'Nhận dạng nhóm của động từ', sub: 'đổi nguyên âm · -ought/-aught · giữ nguyên · học thuộc riêng' },
      { label: 'Lấy dạng V2 của nhóm đó', sub: 'Quên thì tra bảng V1–V2–V3 ở phần Tra cứu, đừng đoán' },
      { label: 'Nhớ: quá khứ KHÔNG chia theo chủ ngữ', sub: 'He went = They went' },
      { label: 'Phủ định / câu hỏi: didn’t / Did', sub: 'Dùng V1 — Did you go…? (không phải went)' },
    ],
    tips: [
      'Đọc to thành vần 3 cột: go – went – gone, see – saw – seen.',
      'Nhóm -ought hay gặp trong bài kiểm tra: buy–bought, think–thought.',
      'Nhóm giữ nguyên rất dễ ăn điểm: cut, put, read.',
    ],
    specials: [
      { example: 'He went. / They went.', why: 'Cùng một dạng went — quá khứ không phân biệt số ít/số nhiều.' },
      { example: 'Children went to school.', why: 'Children là số nhiều nhưng went vẫn không đổi.' },
      { example: 'Everyone went home.', why: 'Everyone là số ít nhưng went cũng không đổi.' },
      { example: 'Did you go to school?', why: 'Đã có Did thì động từ về V1 (go), tuyệt đối không dùng went.' },
    ],
  },
  future: {
    table: {
      idKey: 'use',
      columns: [
        { key: 'use', header: 'Khi nào dùng' },
        { key: 'form', header: 'Công thức' },
        { key: 'example', header: 'Ví dụ' },
      ],
      rows: [
        { use: 'Quyết định ngay lúc nói', form: 'will + V nguyên thể', example: 'I will help you!' },
        { use: 'Dự đoán', form: 'will + V nguyên thể', example: 'It will rain tomorrow.' },
        { use: 'Kế hoạch đã định từ trước', form: 'am/is/are + going to + V', example: 'We are going to travel next month.' },
      ],
    },
    flow: [
      {
        decision: 'Việc này đã định từ trước chưa?',
        branches: [
          { tag: 'Chưa — vừa nghĩ ra', result: 'will + V nguyên thể', note: 'I will help you!' },
          { tag: 'Rồi — đã lên kế hoạch', result: 'be going to + V', note: 'We are going to travel.' },
        ],
      },
      { label: 'will không đổi theo chủ ngữ', sub: 'I will = He will = They will' },
      { label: 'be going to thì be đổi theo chủ ngữ', sub: 'I am · he/she/it is · you/we/they are' },
      { label: 'Sau will và going to, động từ luôn nguyên thể', sub: 'không thêm -s, -ing, -ed' },
    ],
    tips: [
      'Dấu hiệu: tomorrow, tonight, next week, next month, soon.',
      'won’t = will not (phủ định của will).',
      'Mẹo phân biệt nhanh: "vừa nghĩ ra" → will; "đã lên kế hoạch" → going to.',
    ],
    specials: [
      { example: 'Everyone will help.', why: 'will không đổi theo chủ ngữ — everyone hay they đều dùng will.' },
      { example: 'Children are going to play.', why: 'Children là số nhiều → are going to.' },
      { example: 'I am going to read.', why: 'Chỉ "I" dùng am going to.' },
      { example: 'Lan and Minh are going to travel.', why: '2 người → are going to.' },
    ],
  },
}
