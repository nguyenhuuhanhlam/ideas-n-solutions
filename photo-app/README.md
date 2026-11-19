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

## Đăng nhập tạm thời

App có màn hình đăng nhập trước khi vào xem/up ảnh, để chặn người lạ
tình cờ mở link trong thời gian kiểm tra. Tài khoản duy nhất cấu hình
trong `src/auth.js` (tên đăng nhập + hash SHA-256 của mật khẩu, không lưu
mật khẩu dạng text trong code); đăng nhập xong thì nhớ trong
localStorage, bấm nút đăng xuất ở header để thoát.

Lưu ý: đây không phải bảo mật thật — app là trang tĩnh, ai đọc code cũng
có thể qua được cổng này và gọi thẳng API Cloudinary. Khi cần bảo mật
thật thì phải có backend + đăng nhập phía server và chuyển sang upload
có chữ ký.

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
