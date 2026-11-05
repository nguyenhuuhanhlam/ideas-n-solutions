# SurveyJS Demo — React + Vite

Demo SurveyJS trong React + Vite: kéo-thả tạo form bằng Survey Creator,
điền thử bằng Survey, xem JSON định nghĩa form.

## Chạy local

```bash
cd surveyjs-demo
npm install
npm run dev
```

Mở http://localhost:5173

## Build (kiểm chứng trước khi push)

```bash
npm run build
npm run preview
```

## Deploy lên GitHub Pages

App nằm trong repo ideas-n-solutions, theo đúng mẫu các app khác:

1. Thêm bước build trong `.github/workflows/deploy-pages.yml`:
   - `npm ci` trong `surveyjs-demo`
   - `npm run build -- --base=/ideas-n-solutions/surveyjs-demo/`
   - copy `surveyjs-demo/dist` vào `_site/surveyjs-demo/`
   - thêm `surveyjs-demo/package-lock.json` vào `cache-dependency-path`
2. Thêm thẻ app vào `index.html` ở root và một dòng vào bảng trong `README.md` ở root.
3. Push lên `main` — live tại
   https://nguyenhuuhanhlam.github.io/ideas-n-solutions/surveyjs-demo/

## Form mẫu

- **Đơn nghỉ phép**: logic `visibleIf` — nghỉ trên 3 ngày mới hiện ô lý do chi tiết.
- **Khảo sát hài lòng**: chấm ≤ 3 sao mới hiện ô góp ý.
- **Đăng ký sự kiện**: form 2 trang, tick ăn trưa mới hiện ô ăn kiêng.

Form đang sửa được lưu vào `localStorage` (`surveyjs-demo-json-v1`),
tải lại trang vẫn còn. Nút Copy JSON / Tải form.json để lấy JSON mang đi dùng.
