// Cài đặt n8n lưu trên trình duyệt (localStorage).
//
// App có 2 tầng cấu hình:
// - Mặc định trong code: src/config.js (N8N_BASE_URL, N8N_WEBHOOK_PATH) —
//   áp dụng cho mọi người mở link, đổi bằng cách sửa code + push.
// - Cài đặt đã lưu ở đây: ghi đè mặc định, CHỈ trên trình duyệt này.
//   Đổi máy n8n thì vào màn hình Cài đặt trong app, sửa và lưu là xong,
//   không cần build lại hay push. Muốn đổi mặc định cho mọi người thì
//   vẫn sửa src/config.js như trước.

import { N8N_BASE_URL, N8N_WEBHOOK_PATH } from './config.js'

const KEY = 'surveyjs-demo-settings-v1'

// Đọc cài đặt đã lưu, trả về null khi chưa lưu gì.
export function loadSettings() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return {
      n8nBaseUrl: typeof parsed.n8nBaseUrl === 'string' ? parsed.n8nBaseUrl : '',
      n8nWebhookPath:
        typeof parsed.n8nWebhookPath === 'string' ? parsed.n8nWebhookPath : '',
    }
  } catch {
    return null
  }
}

export function saveSettings(s) {
  localStorage.setItem(
    KEY,
    JSON.stringify({
      n8nBaseUrl: s.n8nBaseUrl || '',
      n8nWebhookPath: s.n8nWebhookPath || '',
    }),
  )
}

export function clearSettings() {
  localStorage.removeItem(KEY)
}

// URL webhook n8n đầy đủ từ một bộ cài đặt (đã lưu hoặc mặc định).
export function webhookFromSettings(s) {
  const base = ((s && s.n8nBaseUrl) || N8N_BASE_URL).replace(/\/+$/, '')
  const path = (s && s.n8nWebhookPath) || N8N_WEBHOOK_PATH
  return base + (path.startsWith('/') ? path : '/' + path)
}

// URL webhook đang có hiệu lực trên trình duyệt này.
export function effectiveWebhookUrl() {
  const s = loadSettings()
  return s ? webhookFromSettings(s) : `${N8N_BASE_URL}${N8N_WEBHOOK_PATH}`
}
