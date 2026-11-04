# TuTi Learn English — Học tiếng Anh cơ bản qua bài tập

App web (Vite + React), giao diện tiếng Việt, nội dung tiếng Anh cơ bản.
Giao diện dùng Astryx thật (`@astryxdesign/core` + `@astryxdesign/theme-neutral`
0.7.7, theme Neutral) giống NSDT: bọc `<Theme>` trong `main.jsx`, và theme
theo đúng NSDT — toàn app dùng font Cascadia Mono (bundle qua
`@fontsource/cascadia-mono`, `src/app-fonts.css` ghi đè 3 biến font của
theme, y hệt NSDT), thay cho font Figtree mặc định của theme Neutral.
component Button, Card, ClickableCard, TextInput, Table,
ProgressBar, Banner, Badge, Heading, Text, VStack/HStack — props tra bằng
`npx @astryxdesign/cli component <Tên>` trước khi dùng, không CSS tự vẽ lại.
Nhấn mạnh làm bài tập có chấm điểm, không phải chỉ đọc lý thuyết.
Layout theo template shell-nav của Astryx (giống khung NSDT): thanh trên
(TopNav) + menu trái có thể kéo giãn (SideNav + TreeList), phân loại bài
học nằm ở menu trái thay cho tabs. App dành cho trẻ em nên chữ to hơn
mặc định của theme khoảng 25% (body 16px → 20px, ghi đè các biến
`--font-size-*` trong `src/app-fonts.css`). Mỗi ý chính một màu, dùng
nhất quán ở menu trái, thẻ bài, chi tiết bài và màn hình làm bài
(variant màu phân loại của Astryx): Bài cơ bản 🔵 xanh dương, Chia
động từ 🟣 tím, Tra cứu 🟢 xanh lá, Ôn tập tổng hợp 🟠 cam; nút hành
động vẫn giữ primary, đúng/sai vẫn xanh lá/đỏ theo trạng thái. Riêng
dạng động từ được tô nhẹ: bảng tra cứu dùng Badge xanh lá nhạt cho
V1/V2/V3, dạng mẫu của nhóm chia động từ dùng Badge tím nhạt cho dạng
động từ. Nút "Chấm câu này" tách ra ngoài thẻ câu hỏi, nhỏ gọn (sm)
và màu secondary nhạt để không lẫn với nút đáp án đang chọn (primary).

## Phân loại (menu trái, kiểu shell-nav)

- **Tất cả**: toàn bộ bài cơ bản + nhóm chia động từ.
- **Bài cơ bản**: 6 bài giao tiếp và từ vựng.
- **Chia động từ**: 6 nhóm, mỗi nhóm là 1 cách chia khác nhau
  — to be, hiện tại đơn, hiện tại tiếp diễn,
  quá khứ đơn có quy tắc (-ed), quá khứ đơn bất quy tắc,
  tương lai (will / be going to).
- **Tra cứu**: bảng 47 động từ bất quy tắc (V1 — V2 — V3 — nghĩa),
  gõ tiếng Anh hoặc tiếng Việt để lọc.

## Cách học

1. Mỗi bài/nhóm: đọc nhanh 1 quy tắc/mẫu câu + 8 mục dạng mẫu (kèm ví dụ).
2. Làm bài tập: trắc nghiệm, điền dạng đúng vào chỗ trống, dịch câu.
   Mỗi lần làm bài lấy ngẫu nhiên 25 câu từ ngân hàng của bài đó,
   mỗi câu 1 điểm (tối đa 25 điểm/phiên), làm lại sẽ gặp câu khác.
3. Chấm ngay sau mỗi câu: đúng/sai + giải thích.
4. Cuối bài: tổng điểm /25 và tỉ lệ % đúng, số sao (≥ 90%: 3 sao,
   ≥ 70%: 2 sao, ≥ 50%: 1 sao), danh sách câu sai để ôn lại.
5. Đạt từ 70% được tính là hoàn thành bài (điểm lưu theo %, nên
   điểm cũ vẫn dùng được sau khi đổi từ 10 điểm/câu sang 1 điểm/câu).

Ngoài ra có chế độ **Ôn tập tổng hợp**: 25 câu ngẫu nhiên từ tất cả
các bài và nhóm.

Tiến độ (điểm cao nhất, số lần làm, bài đã đạt) lưu trên trình duyệt
qua localStorage, không cần tài khoản. Điểm cũ của 2 bài chia động từ
trước khi gộp thành tabs được chuyển sang nhóm mới tương ứng
(to-be, present-simple).

## Các bài (ngân hàng 1043 câu)

Ngân hàng câu hỏi sinh tự động bằng `tools/generate-questions.mjs`
(chạy lại cho cùng một file, có kiểm tra: trắc nghiệm đủ 4 đáp án
phân biệt và chứa đáp án đúng, điền từ có chỗ trống, không trùng câu
trong cùng bài). Câu hỏi là câu mới soạn theo đúng chủ đề, từ vựng và
dạng bài chuẩn của chương trình tiếng Anh tiểu học (mức Pre-A1/A1,
dạng bài Cambridge Young Learners Starters/Movers) — không sao chép
nguyên văn câu hỏi từ giáo trình có bản quyền nào.

Bài cơ bản (486 câu): chào hỏi và giới thiệu; số đếm và tuổi;
gia đình; sinh hoạt hằng ngày; màu sắc và đồ vật; đồ ăn và thức uống.

Chia động từ (557 câu): to be hiện tại/quá khứ; hiện tại đơn;
hiện tại tiếp diễn (be + V-ing); quá khứ đơn có quy tắc (-ed);
quá khứ đơn bất quy tắc; tương lai (will / be going to).

## Chạy local

```sh
npm ci
npm run dev
```

## Deploy

Build với base `/ideas-n-solutions/english-learning/` qua workflow
`.github/workflows/deploy-pages.yml` ở root repo, giống các app khác.
