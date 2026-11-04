# English Basic — Học tiếng Anh cơ bản qua bài tập

App web (Vite + React), giao diện tiếng Việt, nội dung tiếng Anh cơ bản.
Nhấn mạnh làm bài tập có chấm điểm, không phải chỉ đọc lý thuyết.

## Cách học

1. Mỗi bài: đọc nhanh 1 mẫu câu + 8 từ vựng (kèm ví dụ).
2. Làm 10 câu: trắc nghiệm, điền từ vào chỗ trống, dịch câu.
3. Chấm ngay sau mỗi câu: đúng/sai + giải thích.
4. Cuối bài: tổng điểm / 100, số sao (≥ 90: 3 sao, ≥ 70: 2 sao,
   ≥ 50: 1 sao), danh sách câu sai để ôn lại.
5. Đạt từ 70 điểm được tính là hoàn thành bài.

Ngoài ra có chế độ **Ôn tập tổng hợp**: 10 câu ngẫu nhiên từ tất cả các bài.

Tiến độ (điểm cao nhất, số lần làm, bài đã đạt) lưu trên trình duyệt
qua localStorage, không cần tài khoản.

## Các bài (6 bài × 10 câu = 60 câu)

1. Chào hỏi và giới thiệu
2. Số đếm và tuổi
3. Gia đình
4. Sinh hoạt hằng ngày (thì hiện tại đơn với he/she)
5. Màu sắc và đồ vật (a/an, This is…)
6. Đồ ăn và thức uống (like / do not like)

## Chạy local

```sh
npm ci
npm run dev
```

## Deploy

Build với base `/ideas-n-solutions/english-learning/` qua workflow
`.github/workflows/deploy-pages.yml` ở root repo, giống các app khác.
