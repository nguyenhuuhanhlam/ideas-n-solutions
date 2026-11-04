# TuTi Learn English — Học tiếng Anh cơ bản qua bài tập

App web (Vite + React), giao diện tiếng Việt, nội dung tiếng Anh cơ bản.
Giao diện dùng Astryx thật (`@astryxdesign/core` + `@astryxdesign/theme-neutral`
0.7.7, theme Neutral) giống NSDT: bọc `<Theme>` trong `main.jsx`, và theme
theo đúng NSDT — toàn app dùng font Cascadia Mono (bundle qua
`@fontsource/cascadia-mono`, `src/app-fonts.css` ghi đè 3 biến font của
theme, y hệt NSDT), thay cho font Figtree mặc định của theme Neutral.
component Button, Card, ClickableCard, TabList/Tab, TextInput, Table,
ProgressBar, Banner, Badge, Heading, Text, VStack/HStack — props tra bằng
`npx @astryxdesign/cli component <Tên>` trước khi dùng, không CSS tự vẽ lại.
Nhấn mạnh làm bài tập có chấm điểm, không phải chỉ đọc lý thuyết.
Nội dung phân loại bằng tabs trên trang chính.

## Các tab

- **Tất cả**: toàn bộ bài cơ bản + nhóm chia động từ.
- **Bài cơ bản**: 6 bài giao tiếp và từ vựng (mỗi bài 10 câu).
- **Chia động từ**: 6 tab con, mỗi tab là 1 cách chia khác nhau
  (mỗi nhóm 15 câu) — to be, hiện tại đơn, hiện tại tiếp diễn,
  quá khứ đơn có quy tắc (-ed), quá khứ đơn bất quy tắc,
  tương lai (will / be going to).
- **Tra cứu**: bảng 47 động từ bất quy tắc (V1 — V2 — V3 — nghĩa),
  gõ tiếng Anh hoặc tiếng Việt để lọc.

## Cách học

1. Mỗi bài/nhóm: đọc nhanh 1 quy tắc/mẫu câu + 8 mục dạng mẫu (kèm ví dụ).
2. Làm bài tập: trắc nghiệm, điền dạng đúng vào chỗ trống, dịch câu.
3. Chấm ngay sau mỗi câu: đúng/sai + giải thích.
4. Cuối bài: tổng điểm và tỉ lệ % đúng, số sao (≥ 90%: 3 sao,
   ≥ 70%: 2 sao, ≥ 50%: 1 sao), danh sách câu sai để ôn lại.
5. Đạt từ 70% được tính là hoàn thành bài.

Ngoài ra có chế độ **Ôn tập tổng hợp**: 20 câu ngẫu nhiên từ tất cả
các bài và nhóm.

Tiến độ (điểm cao nhất, số lần làm, bài đã đạt) lưu trên trình duyệt
qua localStorage, không cần tài khoản. Điểm cũ của 2 bài chia động từ
trước khi gộp thành tabs được chuyển sang nhóm mới tương ứng
(to-be, present-simple).

## Các bài (150 câu)

Bài cơ bản (6 × 10 câu): chào hỏi và giới thiệu; số đếm và tuổi;
gia đình; sinh hoạt hằng ngày; màu sắc và đồ vật; đồ ăn và thức uống.

Chia động từ (6 × 15 câu): to be hiện tại/quá khứ; hiện tại đơn;
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
