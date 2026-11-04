# Chia Động Từ — Hệ thống bài tập chia động từ tiếng Anh

App web riêng về chia động từ (Vite + React), tách khỏi English Basic.
Phân loại theo dạng động từ / thì, mỗi nhóm có bảng chia + quy tắc viết
rồi làm bài tập có chấm điểm.

## Phân loại (6 nhóm × 15 câu = 90 câu)

1. **To be** — hiện tại am/is/are, quá khứ was/were; không thêm -s/-ed.
2. **Hiện tại đơn** — thói quen, sự thật: -s/-es/-ies, do/does.
3. **Hiện tại tiếp diễn** — be + V-ing, cách viết -ing (making, running).
4. **Quá khứ đơn có quy tắc** — thêm -ed/-d/-ied, gấp đôi phụ âm (stopped).
5. **Quá khứ đơn bất quy tắc** — học thuộc V2 (went, saw, bought);
   sau didn't/Did vẫn dùng V1 (didn't go, không phải didn't went).
6. **Tương lai** — will + V (quyết định, dự đoán) và be going to + V
   (kế hoạch đã định).

Ngoài ra:

- **Bài tổng hợp phân loại**: 20 câu ngẫu nhiên từ cả 6 nhóm, cuối bài
  mỗi câu sai đều ghi rõ thuộc nhóm nào để ôn lại đúng chỗ.
- **Tra cứu động từ bất quy tắc**: 47 động từ (V1 — V2 — V3 — nghĩa),
  gõ tiếng Anh hoặc tiếng Việt để lọc.

## Chấm điểm

Mỗi câu 10 điểm, chấm ngay sau mỗi câu kèm giải thích. Cuối bài có
tổng điểm, tỉ lệ % và số sao (≥ 90%: 3 sao, ≥ 70%: 2 sao, ≥ 50%: 1 sao);
đạt từ 70% được tính là hoàn thành nhóm. Tiến độ lưu riêng trên trình
duyệt qua localStorage (khác English Basic), không cần tài khoản.

## Chạy local

```sh
npm ci
npm run dev
```

## Deploy

Build với base `/ideas-n-solutions/chia-dong-tu/` qua workflow
`.github/workflows/deploy-pages.yml` ở root repo, giống các app khác.
