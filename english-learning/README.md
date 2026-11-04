# English Basic — Học tiếng Anh cơ bản qua bài tập

App web (Vite + React), giao diện tiếng Việt, nội dung tiếng Anh cơ bản.
Nhấn mạnh làm bài tập có chấm điểm, không phải chỉ đọc lý thuyết.

## Cách học

1. Mỗi bài: đọc nhanh 1 quy tắc/mẫu câu + 8 từ vựng (kèm ví dụ).
2. Làm bài tập: trắc nghiệm, điền từ/chia động từ vào chỗ trống, dịch câu.
3. Chấm ngay sau mỗi câu: đúng/sai + giải thích.
4. Cuối bài: tổng điểm và tỉ lệ % đúng, số sao (≥ 90%: 3 sao,
   ≥ 70%: 2 sao, ≥ 50%: 1 sao), danh sách câu sai để ôn lại.
5. Đạt từ 70% được tính là hoàn thành bài.

Ngoài ra có chế độ **Ôn tập tổng hợp**: 10 câu ngẫu nhiên từ tất cả các bài.

Tiến độ (điểm cao nhất, số lần làm, bài đã đạt) lưu trên trình duyệt
qua localStorage, không cần tài khoản.

## Các bài (90 câu)

1. Chào hỏi và giới thiệu (10 câu)
2. Số đếm và tuổi (10 câu)
3. Gia đình (10 câu)
4. Sinh hoạt hằng ngày (thì hiện tại đơn với he/she) (10 câu)
5. Màu sắc và đồ vật (a/an, This is…) (10 câu)
6. Đồ ăn và thức uống (like / do not like) (10 câu)
7. Chia động từ to be — am / is / are, phủ định, câu hỏi (lớp 6) (15 câu)
8. Chia động từ thường — hiện tại đơn: -s / -es / -ies, do / does, don't / doesn't (lớp 6) (15 câu)

## Chạy local

```sh
npm ci
npm run dev
```

## Deploy

Build với base `/ideas-n-solutions/english-learning/` qua workflow
`.github/workflows/deploy-pages.yml` ở root repo, giống các app khác.
