# SurveyJS Demo — Danh sách form + API (chỉ dùng phần miễn phí)

App liệt kê các form có sẵn, cho điền form, và công bố API/URL để ứng
dụng khác dùng. Chỉ dùng `survey-core` + `survey-react-ui` (giấy phép MIT,
miễn phí). KHÔNG dùng Survey Creator (thương mại, cần licence).

Form do Muse soạn sẵn trong `src/samples.js` — app không có phần soạn form.

## Chạy local

```bash
cd surveyjs-demo
npm install
npm run dev
```

Mở http://localhost:5173

## Thêm form mới (Muse làm)

1. Thêm 1 entry vào `SAMPLES` trong `src/samples.js` (id, title, description, pages).
2. Chạy `npm run build` — script `prebuild` tự sinh lại file API trong
   `public/forms/` từ `src/samples.js`, Vite copy sang `dist/forms/`.
3. Push lên `main` như mọi app khác trong repo.

## API cho ứng dụng khác

Base live: `https://nguyenhuuhanhlam.github.io/ideas-n-solutions/surveyjs-demo`

| Dùng để làm gì | URL |
| --- | --- |
| Danh sách tất cả form | `<base>/forms/index.json` |
| JSON định nghĩa 1 form | `<base>/forms/<id>.json` (vd: `forms/nghiPhep.json`) |
| Link điền form | `<base>?form=<id>` (vd: `?form=nghiPhep`) |
| Nhúng form vào web/app khác | `<base>?form=<id>&embed=1` (chỉ hiện form, không header/danh sách) |

Nhúng bằng iframe:

```html
<iframe src="<base>?form=nghiPhep&embed=1" width="100%" height="700" frameborder="0"></iframe>
```

Khi điền xong trong iframe, form gửi kết quả ra app cha bằng postMessage:

```js
window.addEventListener('message', (e) => {
  if (e.data?.type === 'surveyjs-demo:complete') {
    console.log(e.data.form, e.data.data) // id form + dữ liệu đã điền
  }
})
```

Ứng dụng khác cũng có thể tự render form bằng SurveyJS Form Library:
fetch `<base>/forms/<id>.json` rồi `new Model(json)`.

## Build (kiểm chứng trước khi push)

```bash
npm run build
npm run preview
```

## Form có sẵn

- **Đơn nghỉ phép** (`nghi-phep`): logic `visibleIf` — nghỉ trên 3 ngày mới hiện ô lý do chi tiết.
- **Khảo sát hài lòng** (`khaoSat`): chấm ≤ 3 sao mới hiện ô góp ý.
- **Đăng ký sự kiện** (`dangKy`): form 2 trang, tick ăn trưa mới hiện ô ăn kiêng.
