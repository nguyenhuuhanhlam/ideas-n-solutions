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

## Link điền dán sẵn và webhook n8n

Mỗi form trong `src/samples.js` có thể có thêm 2 trường (không bắt buộc):

```js
nghiPhep: {
  label: 'Đơn nghỉ phép',
  // Link điền dán sẵn: app dùng nguyên văn làm link điền chính thức
  // (nút "Copy link điền" và file forms/index.json). Muốn đổi link thì
  // dán link mới vào đây, không cần sửa code chỗ khác.
  fillUrl: 'https://nguyenhuuhanhlam.github.io/ideas-n-solutions/surveyjs-demo/?form=nghiPhep&webhook=https%3A%2F%2Fnguyens-mac-mini.taila4a8f3.ts.net%2Fwebhook%2Fsurvey-submit',
  // Webhook mặc định: khi điền xong, app gửi kết quả về đây.
  webhookUrl: 'https://nguyens-mac-mini.taila4a8f3.ts.net/webhook/survey-submit',
  json: { ... },
},
```

Khi điền xong, app POST về webhook (nếu có) với nội dung
`{form: "<id>", submittedAt: "<ISO>", data: {...}}` và hiện trạng thái
"Đã gửi tới n8n" hoặc "Gửi thất bại" ngay dưới kết quả. Thứ tự ưu tiên
webhook: `?webhook=` trên link trước, rồi `webhookUrl` trong `samples.js`,
cả hai đều không có thì form chỉ hiện kết quả như trước. Form không có
`fillUrl` thì link điền tự sinh như thường.

## Cài đặt n8n trong app

Trên trang chính có nút **⚙️ Cài đặt n8n**. Mở ra sửa được 2 thứ:

- **Địa chỉ máy chạy n8n** (phải bắt đầu bằng `https://`)
- **Đường dẫn webhook trong n8n** (mặc định `/webhook/survey-submit`)

Bấm **Lưu cài đặt** thì app lưu vào localStorage của trình duyệt
(`surveyjs-demo-settings-v1`). Từ lúc đó link điền, mã nhúng và kết quả
gửi đi đều dùng địa chỉ mới, không cần sửa code hay push lại. Bấm
**Khôi phục mặc định** thì xóa cài đặt đã lưu, quay về mặc định trong
`src/config.js`.

Thứ tự ưu tiên webhook khi điền xong: `?webhook=` trên link trước, rồi
cài đặt đã lưu, rồi `webhookUrl` trong `src/samples.js`. Lưu ý: cài đặt
chỉ có tác dụng trên trình duyệt đã lưu; người khác mở link vẫn dùng
mặc định trong code, và file `forms/index.json` (sinh lúc build) cũng
vậy. Muốn đổi mặc định cho mọi người thì sửa `src/config.js`.

## Đổi máy chạy n8n

Địa chỉ máy n8n chỉ nằm ở **một chỗ duy nhất**: `src/config.js`, dòng
`N8N_BASE_URL`. Đổi máy (đổi tên máy, đổi tailnet, chuyển sang domain/VPS
khác) thì sửa đúng dòng đó rồi chạy `npm run build` và push — link điền,
webhook mặc định và file `forms/index.json` đều tự đổi theo, không cần
sửa từng form. `src/config.js` cũng chứa `APP_BASE_URL` (địa chỉ app trên
Pages) và `N8N_WEBHOOK_PATH` (đường dẫn webhook trong n8n).

## Giao diện form (compact)

Form điền dùng theme compact của SurveyJS Form Library: bố cục không khung
(`isPanelless: true`, bỏ thẻ bao quanh từng câu hỏi), đơn vị khoảng cách
`--sjs-base-unit: 6px` (mặc định 8px) và cỡ chữ `--sjs-font-size: 14px`
(mặc định 16px). Theme nằm ở `COMPACT_THEME` trong `src/App.jsx`, áp lúc
tạo `Model` — chỉ thu gọn hiển thị, không đổi JSON hay logic form. Muốn
form thoáng hơn thì tăng 2 biến này hoặc bỏ `isPanelless`.

## Build (kiểm chứng trước khi push)

```bash
npm run build
npm run preview
```

## Form có sẵn

- **Đơn nghỉ phép** (`nghi-phep`): logic `visibleIf` — nghỉ trên 3 ngày mới hiện ô lý do chi tiết.
- **Khảo sát hài lòng** (`khaoSat`): chấm ≤ 3 sao mới hiện ô góp ý.
- **Đăng ký sự kiện** (`dangKy`): form 2 trang, tick ăn trưa mới hiện ô ăn kiêng.
