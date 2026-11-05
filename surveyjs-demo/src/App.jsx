import { useMemo, useState } from 'react'
import { Model } from 'survey-core'
import { Survey } from 'survey-react-ui'
import 'survey-core/survey-core.css'
import { SAMPLES, SAMPLE_KEYS } from './samples.js'

// Chỉ dùng SurveyJS Form Library (survey-core + survey-react-ui, giấy phép MIT).
// KHÔNG dùng Survey Creator (thương mại, cần licence).
// Form do Muse soạn sẵn trong src/samples.js — app này chỉ liệt kê form,
// cho điền form, và công bố API/URL để ứng dụng khác dùng.

const LIVE_BASE = 'https://nguyenhuuhanhlam.github.io/ideas-n-solutions/surveyjs-demo'

function countFields(json) {
  return (json.pages || []).reduce((n, p) => n + (p.elements ? p.elements.length : 0), 0)
}

// URL gốc của app (bỏ dấu / cuối), để link chạy đúng cả ở local lẫn live.
function appBase() {
  return window.location.origin + window.location.pathname.replace(/\/$/, '')
}

function urlsFor(id) {
  const base = appBase()
  const form = SAMPLES[id]
  const hook = form.webhookUrl
  const suffix = hook ? `&webhook=${encodeURIComponent(hook)}` : ''
  return {
    // Link điền dán sẵn trong samples.js (fillUrl) được ưu tiên dùng nguyên
    // văn; không có thì tự sinh từ ?form= + webhook mặc định (nếu có).
    fillUrl: form.fillUrl || `${base}?form=${id}${suffix}`,
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

  // Model điền form, tạo lại mỗi khi đổi form.
  const model = useMemo(() => {
    if (!selected) return null
    const m = new Model(selected.json)
    m.onComplete.add((sender) => {
      setResult(sender.data)
      setSendStatus('')
      // Gửi kết quả về webhook n8n (nếu có): ưu tiên ?webhook= trên link,
      // không có thì dùng webhookUrl mặc định của form trong samples.js.
      // Không có webhook nào thì form chỉ hiện kết quả như trước.
      const target = webhookUrlFromLink() || selected.webhookUrl || ''
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

  if (selected) {
    const u = urlsFor(selectedId)
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
      <p className="sub">
        Các form có sẵn, soạn sẵn bởi Muse. Chọn một form để điền, hoặc lấy link/API
        của form để dùng trong ứng dụng khác. Chỉ dùng SurveyJS Form Library miễn phí (MIT).
      </p>

      <div className="card api-box">
        <h2>API danh sách form</h2>
        <UrlRow
          label="Danh sách tất cả form (JSON)"
          value={`${LIVE_BASE}/forms/index.json`}
          onCopy={() => copyText(`${LIVE_BASE}/forms/index.json`, 'Đã copy link danh sách form')}
        />
        <p className="hint">
          Mỗi form có 1 file JSON riêng: <code>{LIVE_BASE}/forms/&lt;id&gt;.json</code> — ví dụ{' '}
          <code>{LIVE_BASE}/forms/nghiPhep.json</code>. Ứng dụng khác chỉ cần fetch file JSON
          đó rồi render bằng SurveyJS Form Library, hoặc mở link điền form là dùng ngay.
        </p>
        {copied && <p className="hint">{copied}</p>}
      </div>

      <div className="form-grid">
        {SAMPLE_KEYS.map((id) => {
          const form = SAMPLES[id]
          const u = urlsFor(id)
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
