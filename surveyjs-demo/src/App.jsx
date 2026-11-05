import { useEffect, useMemo, useState } from 'react'
import { Model } from 'survey-core'
import { Survey } from 'survey-react-ui'
import 'survey-core/survey-core.css'
import { SAMPLES, SAMPLE_KEYS, DEFAULT_SAMPLE } from './samples.js'

// Chỉ dùng SurveyJS Form Library (survey-core + survey-react-ui, giấy phép MIT).
// KHÔNG dùng Survey Creator (thương mại, cần licence) nên không còn banner licence.

const LS_KEY = 'surveyjs-demo-json-v1'
const LS_SAMPLE = 'surveyjs-demo-sample-v1'

const FIELD_TEMPLATES = {
  text: { type: 'text', title: 'Câu hỏi ngắn' },
  comment: { type: 'comment', title: 'Câu hỏi dài' },
  dropdown: { type: 'dropdown', title: 'Chọn một đáp án', choices: ['Lựa chọn 1', 'Lựa chọn 2'] },
  radiogroup: { type: 'radiogroup', title: 'Chọn một đáp án', choices: ['Lựa chọn 1', 'Lựa chọn 2'] },
  checkbox: { type: 'checkbox', title: 'Chọn nhiều đáp án', choices: ['Lựa chọn 1', 'Lựa chọn 2'] },
  rating: { type: 'rating', title: 'Đánh giá', rateMax: 5 },
  boolean: { type: 'boolean', title: 'Câu hỏi Có / Không' },
  date: { type: 'text', title: 'Ngày', inputType: 'date' },
}

function loadInitialJson() {
  try {
    const saved = localStorage.getItem(LS_KEY)
    if (saved) return JSON.parse(saved)
  } catch { /* bỏ qua JSON hỏng, dùng mẫu mặc định */ }
  return SAMPLES[DEFAULT_SAMPLE].json
}

function saveJson(json) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(json)) } catch { /* ignore */ }
}

export default function App() {
  const [tab, setTab] = useState('edit')
  const [sampleKey, setSampleKey] = useState(() => localStorage.getItem(LS_SAMPLE) || DEFAULT_SAMPLE)
  const [surveyJson, setSurveyJson] = useState(loadInitialJson)
  const [editorText, setEditorText] = useState(() => JSON.stringify(loadInitialJson(), null, 2))
  const [editorError, setEditorError] = useState('')
  const [editorStatus, setEditorStatus] = useState('')
  const [newFieldType, setNewFieldType] = useState('text')
  const [result, setResult] = useState(null)
  const [fillKey, setFillKey] = useState(0)
  const [savedAt, setSavedAt] = useState('')

  // Đổi mẫu -> nạp JSON mẫu vào state + editor.
  useEffect(() => {
    const json = SAMPLES[sampleKey].json
    setSurveyJson(json)
    setEditorText(JSON.stringify(json, null, 2))
    setEditorError('')
    setEditorStatus('')
    setResult(null)
    try { localStorage.setItem(LS_SAMPLE, sampleKey) } catch { /* ignore */ }
    saveJson(json)
  }, [sampleKey])

  // Model điền form, tạo lại mỗi khi JSON đổi.
  const model = useMemo(() => {
    const m = new Model(surveyJson)
    m.onComplete.add((sender) => setResult(sender.data))
    return m
  }, [surveyJson])

  const applyEditor = () => {
    try {
      const json = JSON.parse(editorText)
      if (!json || typeof json !== 'object' || (!json.pages && !json.elements)) {
        throw new Error('JSON phải là object có pages hoặc elements.')
      }
      setSurveyJson(json)
      saveJson(json)
      setEditorError('')
      setEditorStatus('Đã áp dụng — sang tab Điền thử để xem form mới.')
      setResult(null)
    } catch (e) {
      setEditorError('JSON chưa hợp lệ: ' + e.message)
      setEditorStatus('')
    }
  }

  const addField = () => {
    let json
    try {
      json = JSON.parse(editorText)
    } catch (e) {
      setEditorError('JSON chưa hợp lệ, sửa lỗi trước khi thêm câu hỏi: ' + e.message)
      return
    }
    if (!json.pages || !json.pages[0] || !Array.isArray(json.pages[0].elements)) {
      setEditorError('Form mẫu này không có pages[0].elements nên chưa thêm được câu hỏi nhanh.')
      return
    }
    const existing = new Set(json.pages[0].elements.map((el) => el.name))
    let n = json.pages[0].elements.length + 1
    while (existing.has('cauHoi' + n)) n++
    const field = { ...FIELD_TEMPLATES[newFieldType], name: 'cauHoi' + n }
    json.pages[0].elements.push(field)
    setEditorText(JSON.stringify(json, null, 2))
    setSurveyJson(json)
    saveJson(json)
    setEditorError('')
    setEditorStatus(`Đã thêm "${field.title}" (cauHoi${n}) vào cuối trang 1.`)
    setResult(null)
  }

  const resetSample = () => {
    const json = SAMPLES[sampleKey].json
    setSurveyJson(json)
    setEditorText(JSON.stringify(json, null, 2))
    setEditorError('')
    setEditorStatus('Đã khôi phục về form mẫu.')
    setResult(null)
    saveJson(json)
  }

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(surveyJson, null, 2))
      setSavedAt('Đã copy JSON')
    } catch {
      setSavedAt('Không copy được — hãy bôi đen JSON trong ô soạn')
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
        Chỉ dùng SurveyJS Form Library miễn phí (MIT) để render form. Soạn form bằng JSON
        ở tab Soạn form, điền thử ở tab Điền thử. Form được lưu vào localStorage, tải lại trang vẫn còn.
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
        <button className={tab === 'edit' ? 'active' : ''} onClick={() => setTab('edit')}>1. Soạn form (JSON)</button>
        <button className={tab === 'fill' ? 'active' : ''} onClick={() => setTab('fill')}>2. Điền thử (Survey)</button>
      </div>

      {tab === 'edit' && (
        <div className="card">
          <p className="hint">
            Sửa JSON rồi bấm Áp dụng để xem form mới ở tab Điền thử. Muốn thêm nhanh một câu hỏi
            thì chọn loại rồi bấm Thêm câu hỏi — câu hỏi mới sẽ chèn vào cuối trang 1.
            Thử logic: ở form Đơn nghỉ phép, nhập Số ngày nghỉ &gt; 3 sẽ hiện ô Lý do chi tiết.
          </p>
          <div className="toolbar">
            <label>
              Thêm câu hỏi:{' '}
              <select value={newFieldType} onChange={(e) => setNewFieldType(e.target.value)}>
                <option value="text">Câu hỏi ngắn (text)</option>
                <option value="comment">Câu hỏi dài (comment)</option>
                <option value="dropdown">Chọn một (dropdown)</option>
                <option value="radiogroup">Chọn một (radio)</option>
                <option value="checkbox">Chọn nhiều (checkbox)</option>
                <option value="rating">Đánh giá (rating)</option>
                <option value="boolean">Có / Không (boolean)</option>
                <option value="date">Ngày (date)</option>
              </select>
            </label>
            <button onClick={addField}>Thêm câu hỏi</button>
            <button className="primary" onClick={applyEditor}>Áp dụng JSON</button>
            <button onClick={resetSample}>Khôi phục mẫu</button>
          </div>
          {editorError && <div className="error">{editorError}</div>}
          {editorStatus && <div className="success">{editorStatus}</div>}
          <textarea
            className="editor"
            value={editorText}
            onChange={(e) => setEditorText(e.target.value)}
            spellCheck={false}
            aria-label="JSON định nghĩa form"
          />
          <p className="hint">
            Gợi ý: đổi <code>title</code>, <code>isRequired</code>, <code>choices</code> hoặc thêm{' '}
            <code>visibleIf: {'"{soNgay} > 3"'}</code> cho một câu hỏi để thử logic rẽ nhánh.
          </p>
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
    </div>
  )
}
