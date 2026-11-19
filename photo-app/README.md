# Ảnh nhóm (photo-app)

Web app mobile-first: chụp ảnh up thẳng lên Cloudinary, cả nhóm cùng xem
trên mọi máy. Không backend — app tĩnh hoàn toàn.

## Cách hoạt động

- **Up ảnh:** trực tiếp từ trình duyệt bằng upload preset unsigned
  (`photo_app`), gắn tag `photo_app`, vào folder `photo-app`.
- **Xem mọi máy:** đọc danh sách ảnh qua endpoint list JSON theo tag
  (`image/list/photo_app.json`, public — cần bật Resource list trong
  Console → Settings → Security).
- **Tiết kiệm credit bản free:** nén ảnh trước khi up (cạnh dài tối đa
  1600px, JPEG 82%), lưới dùng thumbnail 400px, ảnh xem tối đa 1600px,
  `f_auto,q_auto`.
- **Ảnh vừa up hiện ngay** dù list JSON còn cache ~60s (gộp tạm ở client).

## Tính năng

- Chụp bằng camera sau (`capture="environment"`) hoặc chọn nhiều ảnh.
- Tiến trình up từng ảnh (tối đa 3 ảnh song song), up lỗi có nút thử lại.
- Lưới ảnh mới nhất trước; kéo xuống để làm mới; quay lại app tự tải lại.
- Trình xem: vuốt trái/phải chuyển ảnh, vuốt xuống để đóng, pinch 2 ngón
  hoặc double-tap để phóng to, chạm để ẩn/hiện thanh công cụ. Desktop:
  kéo chuột, phím mũi tên, Esc.
- PWA: thêm vào màn hình chính dùng như app (`manifest.webmanifest`).

## Cấu hình

Đổi tài khoản Cloudinary trong `src/config.js` (`CLOUD_NAME`,
`UPLOAD_PRESET`, `TAG`). Không có secret trong code — preset unsigned và
cloud name đều là thông tin public.

## Chạy local / build

```sh
npm install
npm run dev      # http://localhost:5173
npm run build -- --base=/ideas-n-solutions/photo-app/
```

Deploy lên GitHub Pages qua workflow ở root repo (build với base là
subpath Pages của app).
