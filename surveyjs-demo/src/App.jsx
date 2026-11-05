import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Model } from 'survey-core'
import { Survey } from 'survey-react-ui'
import 'survey-core/survey-core.css'
import { SAMPLES, SAMPLE_KEYS, DEFAULT_SAMPLE } from './samples.js'

const CreatorPane = lazy(() => import('./CreatorPane.jsx'))

const LS_KEY = 'surveyjs-demo-json-v1'
const LS_SAMPLE = 'surveyjs-demo-sample-v1'

function loadInitialJson() {
  try {
    const saved = localStorage.getItem(LS_KEY)
    if (saved) return JSON.parse(saved)
  } catch { /* bỏ qua JSON hỏng, dùng mẫu mặc định */ }
  return SAMPLES[DEFAULT_SAMPLE].json
}

export default function App() {
  const [tab, setTab] = useState('creator')
  const [sampleKey, setSampleKey] = useState(() => localStorage.getItem(LS_SAMPLE) || DEFAULT_SAMPLE)
  const [surveyJson, setSurveyJson] = useState(loadInitialJson)
  const [result, setResult] = useState(null)
  const [fillKey, setFillKey] = useState(0)
  const [savedAt, setSavedAt] = useState('')

  // Creator được lazy-load ở CreatorPane.jsx. Lưu form = cập nhật JSON + localStorage.
  const handleCreatorSave = (json) => {
    setSurveyJson(json)
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(json))
      setSavedAt(new Date().toLocaleTimeString('vi-VN'))
    } catch { /* localStorage đầy / bị chặn thì vẫn giữ JSON trong state */ }
  }

  // Đổi mẫu -> nạp JSON mẫu vào state (CreatorPane sẽ đồng bộ theo sampleKey).
  useEffect(() => {
    const json = SAMPLES[sampleKey].json
    setSurveyJson(json)
    setResult(null)
    try {
      localStorage.setItem(LS_SAMPLE, sampleKey)
      localStorage.setItem(LS_KEY, JSON.stringify(json))
    } catch { /* ignore */ }
  }, [sampleKey])

  // Model điền form, tạo lại mỗi khi JSON đổi.
  const model = useMemo(() => {
    const m = new Model(surveyJson)
    m.onComplete.add((sender) => setResult(sender.data))
    return m
  }, [surveyJson])

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(surveyJson, null, 2))
      setSavedAt('Đã copy JSON')
    } catch {
      setSavedAt('Không copy được — hãy bôi đen JSON ở tab JSON')
    }
  }

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(surveyJson, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'form.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app">
      <h1>SurveyJS Demo — React + Vite</h1>
      <p className="sub">
        Kéo-thả tạo form ở tab Tạo form, điền thử ở tab Điền thử, xem JSON ở tab JSON.
        Form được lưu vào localStorage, tải lại trang vẫn còn.
      </p>

      <div className="toolbar">
        <label>
          Form mẫu:{' '}
          <select value={sampleKey} onChange={(e) => setSampleKey(e.target.value)}>
            {SAMPLE_KEYS.map((k) => (
              <option key={k} value={k}>{SAMPLES[k].label}</option>
            ))}
          </select>
        </label>
        <button onClick={copyJson}>Copy JSON</button>
        <button onClick={downloadJson}>Tải form.json</button>
        {savedAt && <span className="hint">{savedAt}</span>}
      </div>

      <div className="tabs">
        <button className={tab === 'creator' ? 'active' : ''} onClick={() => setTab('creator')}>1. Tạo form (Creator)</button>
        <button className={tab === 'fill' ? 'active' : ''} onClick={() => setTab('fill')}>2. Điền thử (Survey)</button>
        <button className={tab === 'json' ? 'active' : ''} onClick={() => setTab('json')}>3. JSON</button>
      </div>

      {tab === 'creator' && (
        <div className="card">
          <p className="hint">
            Kéo câu hỏi từ Toolbox bên trái vào form, bấm vào câu hỏi để sửa ở panel phải.
            Sửa xong bấm Save / chờ auto-save — JSON ở tab 2 và 3 sẽ đổi theo.
            Thử logic: ở form Đơn nghỉ phép, nhập Số ngày nghỉ &gt; 3 sẽ hiện ô Lý do chi tiết.
          </p>
          <div className="creator-wrap">
            <Suspense fallback={<p className="hint">Đang tải Survey Creator…</p>}>
              <CreatorPane json={surveyJson} sampleKey={sampleKey} onSave={handleCreatorSave} />
            </Suspense>
          </div>
        </div>
      )}

      {tab === 'fill' && (
        <div className="card">
          <Survey key={`${fillKey}-${JSON.stringify(surveyJson).length}`} model={model} />
          {result && (
            <div className="result">
              <div className="success">Đã gửi xong. Dữ liệu nhận được:</div>
              <pre>{JSON.stringify(result, null, 2)}</pre>
              <button onClick={() => { setResult(null); setFillKey((k) => k + 1) }}>Điền lại từ đầu</button>
            </div>
          )}
        </div>
      )}

      {tab === 'json' && (
        <div className="card">
          <p className="hint">
            Đây là toàn bộ định nghĩa form — chỉ là JSON thuần. Lưu file này lại là có form,
            gửi JSON này cho Survey là render ra form, không cần code lại từng field.
          </p>
          <pre>{JSON.stringify(surveyJson, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
