import { useMemo, useState } from 'react'
import { Model } from 'survey-core'
import { Survey } from 'survey-react-ui'
import 'survey-core/survey-core.css'
import { SAMPLES, SAMPLE_KEYS } from './samples.js'
import { APP_BASE_URL, N8N_BASE_URL, N8N_WEBHOOK_PATH, N8N_WEBHOOK_URL } from './config.js'
import { loadSettings, saveSettings, clearSettings, webhookFromSettings } from './settings.js'

// Chỉ dùng SurveyJS Form Library (survey-core + survey-react-ui, giấy phép MIT).
// KHÔNG dùng Survey Creator (thương mại, cần licence).
// Form do Muse soạn sẵn trong src/samples.js — app này chỉ liệt kê form,
// cho điền form, và công bố API/URL để ứng dụng khác dùng.

function countFields(json) {
  return (json.pages || []).reduce((n, p) => n + (p.elements ? p.elements.length : 0), 0)
}

// URL gốc của app (bỏ dấu / cuối), để link chạy đúng cả ở local lẫn live.
function appBase() {
  return window.location.origin + window.location.pathname.replace(/\/$/, '')
}

// settings: cài đặt n8n đã lưu trên trình duyệt (null khi chưa lưu).
// Khi có cài đặt đã lưu, webhook trong đó ghi đè webhook mặc định của form
// và link điền được sinh lại từ cài đặt đó; khi chưa lưu thì dùng link dán
// sẵn (fillUrl) hoặc tự sinh như trước.
function urlsFor(id, settings) {
  const base = appBase()
  const form = SAMPLES[id]
  const hook = settings ? webhookFromSettings(settings) : form.webhookUrl
  const suffix = hook ? `&webhook=${encodeURIComponent(hook)}` : ''
  return {
    // Link điền dán sẵn trong samples.js (fillUrl) chỉ dùng khi chưa có
    // cài đặt đã lưu; không có thì tự sinh từ ?form= + webhook (nếu có).
    fillUrl: settings ? `${base}?form=${id}${suffix}` : (form.fillUrl || `${base}?form=${id}${suffix}`),
    jsonUrl: `${base}/forms/${id}.json`,
    embedUrl: `${base}?form=${id}&embed=1${suffix}`,
    iframe: `<iframe src="${base}?form=${id}&embed=1${suffix}" width="100%" height="700" frameborder="0"></iframe>`,
  }
}

function initialFormId() {
  try {
    const id = new URLSearchParams(window.location.search).get('form')
    return id && SAMPLES[id] ? id : null
  } catch {
    return null
  }
}

function isEmbed() {
  try {
    return new URLSearchParams(window.location.search).get('embed') === '1'
  } catch {
    return false
  }
}

// Webhook n8n gắn trên link (?webhook=<url đã mã hóa>). Link có webhook
// được ưu tiên hơn webhookUrl mặc định của form trong samples.js.
function webhookUrlFromLink() {
  try {
    const w = new URLSearchParams(window.location.search).get('webhook')
    return w ? decodeURIComponent(w) : ''
  } catch {
    return ''
  }
}

export default function App() {
  const [selectedId, setSelectedId] = useState(initialFormId)
  const [showJsonId, setShowJsonId] = useState(null)
  const [copied, setCopied] = useState('')
  const [result, setResult] = useState(null)
  const [fillKey, setFillKey] = useState(0)
  const [sendStatus, setSendStatus] = useState('')
  const [settings, setSettings] = useState(loadSettings)
  const [showSettings, setShowSettings] = useState(false)
  const [draftBase, setDraftBase] = useState('')
  const [draftPath, setDraftPath] = useState('')
  const [settingsMsg, setSettingsMsg] = useState('')
  const [settingsError, setSettingsError] = useState('')
  const embed = isEmbed()

  const selected = selectedId ? SAMPLES[selectedId] : null

  const copyText = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(label)
    } catch {
      setCopied('Không copy được — hãy copy tay từ ô bên dưới.')
    }
  }

  const openForm = (id) => {
    setSelectedId(id)
    setResult(null)
    setShowJsonId(null)
    try {
      const url = new URL(window.location.href)
      url.searchParams.set('form', id)
      window.history.pushState({}, '', url)
    } catch { /* ignore */ }
  }

  const backToList = () => {
    setSelectedId(null)
    setResult(null)
    try {
      const url = new URL(window.location.href)
      url.searchParams.delete('form')
      window.history.pushState({}, '', url)
    } catch { /* ignore */ }
  }

  const openSettings = () => {
    const s = loadSettings()
    setDraftBase(s ? s.n8nBaseUrl : N8N_BASE_URL)
    setDraftPath(s ? s.n8nWebhookPath : N8N_WEBHOOK_PATH)
    setSettingsMsg('')
    setSettingsError('')
    setShowSettings(true)
  }

  const saveSettingsForm = () => {
    const base = draftBase.trim().replace(/\/+$/, '')
    const path = draftPath.trim() || N8N_WEBHOOK_PATH
    if (!/^https:\/\/.+/.test(base)) {
      setSettingsError('Địa chỉ máy n8n phải bắt đầu bằng https://')
      setSettingsMsg('')
      return
    }
    const next = {
      n8nBaseUrl: base,
      n8nWebhookPath: path.startsWith('/') ? path : '/' + path,
    }
    saveSettings(next)
    setSettings(next)
    setSettingsError('')
    setSettingsMsg('Đã lưu cài đặt. Link điền và webhook từ giờ dùng địa chỉ mới.')
  }

  const resetSettings = () => {
    clearSettings()
    setSettings(null)
    setDraftBase(N8N_BASE_URL)
    setDraftPath(N8N_WEBHOOK_PATH)
    setSettingsError('')
    setSettingsMsg('Đã khôi phục mặc định trong code.')
  }

// Theme compact cho form điền: bố cục không khung (panelless, bỏ thẻ bao
// quanh từng câu hỏi) + đơn vị khoảng cách 6px (mặc định 8px) + cỡ chữ
// 14px (mặc định 16px). Chỉ thu gọn hiển thị, không đổi JSON hay logic form.
const COMPACT_THEME = {
  themeName: 'default',
  colorPalette: 'light',
  isPanelless: true,
  cssVariables: {
    '--sjs-base-unit': '6px',
    '--sjs-font-size': '14px',
  },
}

// Model điền form, tạo lại mỗi khi đổi form.
  const model = useMemo(() => {
    if (!selected) return null
    const m = new Model(selected.json)
    m.applyTheme(COMPACT_THEME)
    m.onComplete.add((sender) => {
      setResult(sender.data)
      setSendStatus('')
      // Gửi kết quả về webhook n8n (nếu có). Thứ tự ưu tiên: ?webhook= trên
      // link, rồi cài đặt n8n đã lưu trên trình duyệt, rồi webhookUrl mặc
      // định của form trong samples.js.
      // Không có webhook nào thì form chỉ hiện kết quả như trước.
      const target = webhookUrlFromLink() || (settings ? webhookFromSettings(settings) : selected.webhookUrl) || ''
      if (target) {
        fetch(target, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            form: selectedId,
            submittedAt: new Date().toISOString(),
            data: sender.data,
          }),
        })
          .then((r) => {
            if (!r.ok) throw new Error('HTTP ' + r.status)
            setSendStatus('Đã gửi tới n8n.')
          })
          .catch(() => setSendStatus('Gửi tới n8n thất bại — kiểm tra lại webhook/CORS.'))
      }
      // Báo kết quả cho app cha khi form được nhúng bằng iframe.
      try {
        if (window.parent !== window) {
          window.parent.postMessage(
            { type: 'surveyjs-demo:complete', form: selectedId, data: sender.data },
            '*',
          )
        }
      } catch { /* ignore */ }
    })
    return m
  }, [selected, selectedId])

  // Chế độ nhúng (?embed=1): chỉ hiện form, không hiện danh sách/header.
  if (embed && selected) {
    return (
      <div className="app app--embed">
        <div className="card">
          <Survey key={`${fillKey}-${selectedId}`} model={model} />
          {result && (
            <div className="result">
              <div className="success">Đã gửi xong. Dữ liệu nhận được:</div>
              {sendStatus && <p className="hint">{sendStatus}</p>}
              <pre>{JSON.stringify(result, null, 2)}</pre>
              <button onClick={() => { setResult(null); setFillKey((k) => k + 1) }}>Điền lại từ đầu</button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Màn hình Cài đặt n8n.
  if (showSettings) {
    const previewBase = draftBase.trim().replace(/\/+$/, '')
    const previewPath = draftPath.trim() || N8N_WEBHOOK_PATH
    const preview = previewBase
      ? previewBase + (previewPath.startsWith('/') ? previewPath : '/' + previewPath)
      : ''
    return (
      <div className="app">
        <button onClick={() => setShowSettings(false)}>← Danh sách form</button>
        <h1>Cài đặt n8n</h1>
        <p className="sub">
          Địa chỉ máy chạy n8n. Lưu xong thì link điền, mã nhúng và kết quả
          gửi đi đều dùng địa chỉ mới, không cần sửa code hay push lại.
        </p>
        <div className="card settings-form">
          <div className="field">
            <label>Địa chỉ máy chạy n8n</label>
            <input
              value={draftBase}
              onChange={(e) => setDraftBase(e.target.value)}
              placeholder={N8N_BASE_URL}
            />
            <p className="hint">Ví dụ: https://ten-may.tailnet.ts.net — không có dấu / ở cuối.</p>
          </div>
          <div className="field">
            <label>Đường dẫn webhook trong n8n</label>
            <input
              value={draftPath}
              onChange={(e) => setDraftPath(e.target.value)}
              placeholder={N8N_WEBHOOK_PATH}
            />
          </div>
          <p className="hint">Webhook đầy đủ: {preview ? <code>{preview}</code> : '—'}</p>
          {settingsError && <p className="error">{settingsError}</p>}
          {settingsMsg && <p className="hint">{settingsMsg}</p>}
          <div className="toolbar">
            <button className="primary" onClick={saveSettingsForm}>Lưu cài đặt</button>
            <button onClick={resetSettings}>Khôi phục mặc định</button>
          </div>
          <p className="hint">
            Cài đặt chỉ lưu trên trình duyệt này. Người khác mở link vẫn dùng
            mặc định trong code (<code>{N8N_WEBHOOK_URL}</code>); muốn đổi mặc
            định cho mọi người thì sửa <code>src/config.js</code>. Link nào đã
            có sẵn ?webhook= thì giữ nguyên, không bị cài đặt ghi đè.
          </p>
        </div>
      </div>
    )
  }

  if (selected) {
    const u = urlsFor(selectedId, settings)
    return (
      <div className="app">
        <button onClick={backToList}>← Danh sách form</button>
        <h1>{selected.json.title}</h1>
        <p className="sub">{selected.json.description}</p>

        <div className="card">
          <Survey key={`${fillKey}-${selectedId}`} model={model} />
          {result && (
            <div className="result">
              <div className="success">Đã gửi xong. Dữ liệu nhận được:</div>
              {sendStatus && <p className="hint">{sendStatus}</p>}
              <pre>{JSON.stringify(result, null, 2)}</pre>
              <button onClick={() => copyText(JSON.stringify(result, null, 2), 'Đã copy kết quả')}>Copy kết quả</button>{' '}
              <button onClick={() => { setResult(null); setFillKey((k) => k + 1) }}>Điền lại từ đầu</button>
            </div>
          )}
        </div>

        <div className="card api-box">
          <h2>API của form này</h2>
          <UrlRow label="Link điền form" value={u.fillUrl} onCopy={() => copyText(u.fillUrl, 'Đã copy link điền form')} />
          <UrlRow label="JSON định nghĩa form" value={u.jsonUrl} onCopy={() => copyText(u.jsonUrl, 'Đã copy link JSON')} />
          <UrlRow label="Link nhúng (chỉ form)" value={u.embedUrl} onCopy={() => copyText(u.embedUrl, 'Đã copy link nhúng')} />
          <UrlRow label="Mã nhúng iframe" value={u.iframe} onCopy={() => copyText(u.iframe, 'Đã copy mã iframe')} />
          <p className="hint">
            Khi điền xong trong iframe, form gửi kết quả ra app cha bằng{' '}
            <code>postMessage({'{type: "surveyjs-demo:complete", form: "{selectedId}", data: {...}}'})</code>.
          </p>
          {copied && <p className="hint">{copied}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <h1>Danh sách form</h1>
      <div className="toolbar">
        <button onClick={openSettings}>⚙️ Cài đặt n8n</button>
        {settings ? (
          <span className="hint">Đang dùng cài đặt đã lưu — webhook: <code>{webhookFromSettings(settings)}</code></span>
        ) : (
          <span className="hint">Webhook mặc định: <code>{N8N_WEBHOOK_URL}</code></span>
        )}
      </div>
      <p className="sub">
        Các form có sẵn, soạn sẵn bởi Muse. Chọn một form để điền, hoặc lấy link/API
        của form để dùng trong ứng dụng khác. Chỉ dùng SurveyJS Form Library miễn phí (MIT).
      </p>

      <div className="card api-box">
        <h2>API danh sách form</h2>
        <UrlRow
          label="Danh sách tất cả form (JSON)"
          value={`${APP_BASE_URL}/forms/index.json`}
          onCopy={() => copyText(`${APP_BASE_URL}/forms/index.json`, 'Đã copy link danh sách form')}
        />
        <p className="hint">
          Mỗi form có 1 file JSON riêng: <code>{APP_BASE_URL}/forms/&lt;id&gt;.json</code> — ví dụ{' '}
          <code>{APP_BASE_URL}/forms/nghiPhep.json</code>. Ứng dụng khác chỉ cần fetch file JSON
          đó rồi render bằng SurveyJS Form Library, hoặc mở link điền form là dùng ngay.
        </p>
        {copied && <p className="hint">{copied}</p>}
      </div>

      <div className="form-grid">
        {SAMPLE_KEYS.map((id) => {
          const form = SAMPLES[id]
          const u = urlsFor(id, settings)
          const open = showJsonId === id
          return (
            <div className="card form-card" key={id}>
              <h2>{form.json.title}</h2>
              <p className="hint">{form.json.description}</p>
              <p className="hint">
                ID: <code>{id}</code> · {countFields(form.json)} câu hỏi ·{' '}
                {(form.json.pages || []).length} trang
              </p>
              <div className="toolbar">
                <button className="primary" onClick={() => openForm(id)}>Điền form</button>
                <button onClick={() => copyText(u.fillUrl, `Đã copy link điền form ${form.json.title}`)}>Copy link điền</button>
                <button onClick={() => copyText(u.jsonUrl, `Đã copy link JSON form ${form.json.title}`)}>Copy link JSON</button>
                <button onClick={() => copyText(u.iframe, `Đã copy mã iframe form ${form.json.title}`)}>Copy iframe</button>
                <button onClick={() => setShowJsonId(open ? null : id)}>
                  {open ? 'Ẩn JSON' : 'Xem JSON'}
                </button>
              </div>
              {open && <pre>{JSON.stringify(form.json, null, 2)}</pre>}
            </div>
          )
        })}
      </div>
      {copied && <p className="hint">{copied}</p>}
    </div>
  )
}

function UrlRow({ label, value, onCopy }) {
  return (
    <div className="url-row">
      <span className="hint">{label}</span>
      <code>{value}</code>
      <button onClick={onCopy}>Copy</button>
    </div>
  )
}
