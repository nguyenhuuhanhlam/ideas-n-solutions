// Cấu hình tập trung cho Form Hub.
//
// Muốn đổi máy chạy n8n thì CHỈ sửa N8N_BASE_URL ở đây rồi build lại +
// push — mọi link điền form, webhook mặc định trong samples.js, nút copy
// trong app và file API forms/index.json đều tự đổi theo, không cần sửa
// từng form hay tìm địa chỉ ghi cứng ở nhiều chỗ.

// Địa chỉ gốc của app trên GitHub Pages (dùng cho link điền dán sẵn và
// file API tĩnh). Đổi host Pages thì sửa dòng này.
export const APP_BASE_URL =
  'https://nguyenhuuhanhlam.github.io/ideas-n-solutions/surveyjs-demo'

// Địa chỉ công khai của máy chạy n8n — hiện là Tailscale Funnel của
// Mac Mini nguyens-mac-mini. Đổi máy n8n (đổi tên máy, đổi tailnet,
// chuyển sang domain/VPS khác) thì sửa đúng dòng này, không có dấu / ở cuối.
export const N8N_BASE_URL = 'https://nguyens-mac-mini.taila4a8f3.ts.net'

// Đường dẫn webhook nhận kết quả form trong n8n (path của node Webhook).
export const N8N_WEBHOOK_PATH = '/webhook/survey-submit'

// URL webhook đầy đủ (mặc định) — các form dùng chung khi không có
// webhook riêng.
export const N8N_WEBHOOK_URL = `${N8N_BASE_URL}${N8N_WEBHOOK_PATH}`
