import { useMemo, useRef, useState } from 'react'
import {
  AGENTS, APPROVAL_RULES, INITIAL_WORKSPACE, MEMBERS, PROJECT,
  SCENARIOS, agentName, memberName,
} from './data.js'

const now = () => new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })

const STATUS_LABEL = {
  'phan-tach': 'Trợ lý đang tách việc',
  'dang-lam': 'Agent đang làm',
  'cho-xem-lai': 'Bản nháp — chờ bạn xem',
  'cho-duyet': 'AI đang kiểm tra để duyệt',
  'cho-quan-ly': 'Chờ quản lý duyệt',
  'leo-thang': 'Mâu thuẫn — chờ quản lý quyết',
  'da-duyet': 'Đã duyệt — đã ghi vào workspace',
  'tu-choi': 'Quản lý không duyệt',
  'dang-sua': 'Đang sửa lại theo góp ý',
}

let uid = 1
const nextId = (p) => `${p}-${uid++}`

function agentOf(id) {
  return AGENTS.find((a) => a.id === id)
}

export default function App() {
  const [viewer, setViewer] = useState({ kind: 'member', memberId: 'an' })
  const [activeChannel, setActiveChannel] = useState('an')
  const [tasks, setTasks] = useState([])
  const [workspace, setWorkspace] = useState(INITIAL_WORKSPACE)
  const [teamFeed, setTeamFeed] = useState([
    { id: 'tf0', text: 'Mặt bằng tổng thể Rev A đã duyệt — xem ở workspace chung.', by: 'Trần Minh Quân', time: '24-10-2026 09:12' },
  ])
  const [messages, setMessages] = useState([
    { id: 'm0', channelId: 'an', from: 'orchestrator', text: 'Chào Thu An, mình là trợ lý trung tâm của dự án Trung tâm Văn hóa Ven Sông. Gửi lệnh ở kênh riêng này, mình sẽ tách việc và giao cho các AI chuyên môn, rồi trả kết quả về đúng đây cho bạn.', time: '09:00' },
  ])
  const [audit, setAudit] = useState([
    { id: 'a0', time: '24-10-2026 09:12', text: 'Mặt bằng tổng thể Rev A được quản lý duyệt, ghi vào workspace.' },
  ])
  const [input, setInput] = useState('')
  const [inputType, setInputType] = useState('Tra cứu quy chuẩn')
  const [showRules, setShowRules] = useState(false)
  const [showHow, setShowHow] = useState(true)
  const taskSeq = useRef(101)
  const timers = useRef([])

  const later = (fn, ms) => {
    const t = setTimeout(fn, ms)
    timers.current.push(t)
    return t
  }

  const log = (text) => setAudit((prev) => [{ id: nextId('a'), time: now(), text }, ...prev])
  const say = (channelId, from, text) =>
    setMessages((prev) => [...prev, { id: nextId('m'), channelId, from, text, time: now() }])

  const updateTask = (id, patch) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  const updateSubtask = (taskId, idx, patch) =>
    setTasks((prev) => prev.map((t) => {
      if (t.id !== taskId) return t
      const subtasks = t.subtasks.map((s, i) => (i === idx ? { ...s, ...patch } : s))
      return { ...t, subtasks }
    }))

  // --- Mô phỏng agent chạy song song ---
  // Tiến độ giữ trong biến cục bộ của từng subtask (không đọc state trong updater)
  // để tránh gọi onDone 2 lần khi React gọi lại updater.
  const runSubtasks = (task, onDone) => {
    let finished = 0
    const total = task.subtasks.length
    task.subtasks.forEach((st, idx) => {
      updateSubtask(task.id, idx, { state: 'dang-lam', progress: 0 })
      const step = 200
      const inc = (step / st.ms) * 100
      let p = 0
      const iv = setInterval(() => {
        p = Math.min(100, p + inc)
        updateSubtask(task.id, idx, { progress: Math.round(p), state: p >= 100 ? 'xong' : 'dang-lam' })
        if (p >= 100) {
          clearInterval(iv)
          finished += 1
          if (finished === total) onDone(task)
        }
      }, step)
      timers.current.push(iv)
    })
  }

  const deliverDraft = (task) => {
    const isConflict = !!task.conflictWith
    if (isConflict) {
      updateTask(task.id, { status: 'leo-thang' })
      say(task.memberId, 'orchestrator', `Mình đã làm xong bản nháp cho “${task.title}”, nhưng phát hiện mâu thuẫn: ${task.conflictNote} Mình không tự chọn mà trình cả hai phương án lên quản lý. Bạn xem ở mục “Chờ quản lý quyết” bên phải.`)
      log(`${task.code} mâu thuẫn với yêu cầu của ${memberName(task.conflictWith)} — leo thang lên quản lý.`)
      return
    }
    updateTask(task.id, { status: 'cho-xem-lai' })
    say(task.memberId, 'orchestrator', `Xong bản nháp cho “${task.title}” rồi đây. ${task.subtasks.map((s) => s.output).join(' · ')} Bạn xem thử, chưa ưng thì bảo mình sửa, ưng rồi thì bấm “Gửi duyệt”. Trước khi duyệt thì đây vẫn chỉ là bản nháp, chưa ghi vào workspace chung.`)
    log(`${task.code} xong bản nháp, trả về kênh riêng của ${memberName(task.memberId)}.`)
  }

  const startTask = (spec) => {
    const code = `T-${taskSeq.current++}`
    const task = {
      id: nextId('t'), code, memberId: spec.memberId, title: spec.title,
      request: spec.request, type: spec.type, status: 'phan-tach',
      autoEligible: spec.autoEligible, checklist: spec.checklist,
      checkPass: spec.checkPass, checkFailReason: spec.checkFailReason,
      conflictWith: spec.conflictWith || null, conflictNote: spec.conflictNote || '',
      note: spec.note || '',
      subtasks: spec.subtasks.map((s) => ({ ...s, state: 'cho', progress: 0 })),
      approvedBy: null, rejectReason: '', announced: false,
    }
    setTasks((prev) => [task, ...prev])
    setActiveChannel(spec.memberId)
    say(spec.memberId, 'member', spec.request)
    say(spec.memberId, 'orchestrator', `Đã nhận. Mình tách “${spec.title}” thành ${spec.subtasks.length} việc nhỏ và giao cho ${spec.subtasks.map((s) => agentName(s.agentId)).join(' + ')} — việc nào xong trước trả trước, việc sau không phải chờ việc trước.`)
    log(`${code} — ${memberName(spec.memberId)} gửi lệnh: “${spec.title}”. Trợ lý giao cho ${spec.subtasks.map((s) => agentName(s.agentId)).join(', ')}.`)
    later(() => {
      updateTask(task.id, { status: 'dang-lam' })
      runSubtasks(task, (doneTask) => deliverDraft(doneTask))
    }, 900)
    return task
  }

  const startScenario = (sc) => startTask({ ...sc })

  const startCustom = () => {
    const text = input.trim()
    if (!text) return
    const low = text.toLowerCase()
    let subtasks
    if (/boq|dự toán|khối lượng|bóc/.test(low)) {
      subtasks = [{ agentId: 'hoso', job: 'Bóc khối lượng / lập bảng theo yêu cầu', ms: 2600, output: 'Bảng khối lượng (nháp) theo yêu cầu của bạn' }]
    } else if (/vẽ|mặt bằng|mặt đứng|mặt cắt|cad/.test(low)) {
      subtasks = [{ agentId: 'cad2d', job: 'Vẽ theo yêu cầu', ms: 2600, output: 'Bản vẽ (nháp) theo yêu cầu của bạn' }]
    } else if (/render|phối cảnh|3d/.test(low)) {
      subtasks = [{ agentId: 'render3d', job: 'Dựng phối cảnh / mô hình 3D', ms: 3000, output: 'Phối cảnh (nháp) theo yêu cầu của bạn' }]
    } else if (/thư|khách|chủ đầu tư|email/.test(low)) {
      subtasks = [
        { agentId: 'qlda', job: 'Tổng hợp tiến độ từ workspace', ms: 1500, output: 'Tiến độ hiện tại từ workspace' },
        { agentId: 'khachhang', job: 'Soạn thư', ms: 2200, output: 'Thư nháp cho chủ đầu tư' },
      ]
    } else {
      subtasks = [{ agentId: 'tracuu', job: 'Tra cứu và tổng hợp câu trả lời', ms: 2200, output: 'Câu trả lời có trích nguồn (nháp)' }]
    }
    const rule = APPROVAL_RULES.find((r) => r.type === inputType)
    startTask({
      memberId: activeChannel, title: text.length > 60 ? `${text.slice(0, 60)}…` : text,
      request: text, type: inputType, autoEligible: !!rule?.auto,
      subtasks,
      checklist: ['Đủ thông tin theo yêu cầu', 'Khớp Rev đang hiệu lực', 'Không mâu thuẫn quyết định đã chốt'],
      checkPass: true,
      note: rule ? rule.note : '',
    })
    setInput('')
  }

  // --- Duyệt ---
  const recordApproval = (task, approvedBy) => {
    const wsItem = {
      id: nextId('ws'), title: `${task.title} — ${task.type === 'Bản vẽ 2D' ? 'Rev B' : 'bản đã duyệt'}`,
      kind: task.type, by: memberName(task.memberId), approvedBy, time: now(), rev: task.type === 'Bản vẽ 2D' ? 'Rev B' : '—',
    }
    setWorkspace((prev) => [wsItem, ...prev])
    updateTask(task.id, { status: 'da-duyet', approvedBy })
    say(task.memberId, 'orchestrator', `Đã duyệt (${approvedBy}) và ghi nhận vào workspace chung: “${wsItem.title}”. Từ giờ cả team đều thấy bản này là bản chính thức. Bạn muốn báo lên nhóm thì bấm “Báo lên nhóm” — tin báo chỉ là tin ngắn trỏ tới workspace, không gửi kèm file.`)
    log(`${task.code} được ${approvedBy} duyệt — đã ghi vào workspace chung.`)
  }

  const submitForApproval = (task) => {
    updateTask(task.id, { status: 'cho-duyet' })
    say(task.memberId, 'orchestrator', 'Đã gửi duyệt. Mình kiểm tra checklist trước: ' + task.checklist.join(' · ') + '.')
    log(`${task.code} gửi duyệt — AI kiểm tra checklist.`)
    later(() => {
      if (task.autoEligible && task.checkPass) {
        recordApproval(task, 'AI tự duyệt')
      } else {
        const reason = !task.checkPass
          ? `AI đánh giá chưa đủ: ${task.checkFailReason || 'checklist chưa đạt.'}`
          : `Loại việc “${task.type}” không được tự duyệt theo quy tắc prototype.`
        updateTask(task.id, { status: 'cho-quan-ly' })
        say(task.memberId, 'orchestrator', `${reason} Mình chuyển cho quản lý duyệt, bạn không cần làm gì thêm.`)
        log(`${task.code} không tự duyệt được — chờ quản lý.`)
      }
    }, 1100)
  }

  const managerDecide = (task, approve, reason = '') => {
    if (approve) {
      recordApproval(task, 'Quản lý')
    } else {
      updateTask(task.id, { status: 'tu-choi', rejectReason: reason || 'Quản lý không duyệt.' })
      say(task.memberId, 'orchestrator', `Quản lý không duyệt “${task.title}”: ${reason || 'cần sửa lại.'} Bạn bảo mình sửa theo góp ý này nhé — sửa xong sẽ phải duyệt lại từ đầu, không có đường tắt vào workspace.`)
      log(`${task.code} bị quản lý từ chối: ${reason || 'không rõ lý do'}.`)
    }
  }

  const resolveConflict = (task, keepMine) => {
    if (keepMine) {
      updateTask(task.id, { status: 'cho-xem-lai' })
      say(task.memberId, 'orchestrator', `Quản lý đã quyết: giữ phương án của bạn (“${task.title}”). Phương án của ${memberName(task.conflictWith)} không được chọn và đã ghi vào nhật ký chung. Bạn xem lại bản nháp rồi gửi duyệt như bình thường.`)
      log(`Mâu thuẫn ${task.code}: quản lý chọn phương án của ${memberName(task.memberId)}.`)
    } else {
      updateTask(task.id, { status: 'tu-choi', rejectReason: `Quản lý chọn phương án của ${memberName(task.conflictWith)}.` })
      say(task.memberId, 'orchestrator', `Quản lý đã quyết: chọn phương án của ${memberName(task.conflictWith)}. Yêu cầu của bạn dừng ở đây, quyết định đã ghi vào nhật ký chung.`)
      log(`Mâu thuẫn ${task.code}: quản lý chọn phương án của ${memberName(task.conflictWith)}.`)
    }
  }

  const requestRevision = (task) => {
    updateTask(task.id, { status: 'dang-sua' })
    say(task.memberId, 'member', 'Bản này chưa ưng, sửa lại giúp mình nhé.')
    say(task.memberId, 'orchestrator', 'Ok, mình giao lại cho agent sửa. Sửa xong mình trả lại đây, rồi vẫn phải qua duyệt lại từ đầu.')
    log(`${task.code} — ${memberName(task.memberId)} yêu cầu sửa lại bản nháp.`)
    later(() => {
      updateTask(task.id, { status: 'dang-lam' })
      const rerun = { ...task, subtasks: task.subtasks.map((s) => ({ ...s, ms: 1300, state: 'cho', progress: 0 })) }
      runSubtasks(rerun, (doneTask) => deliverDraft(doneTask))
    }, 800)
  }

  const announceToTeam = (task) => {
    const item = {
      id: nextId('tf'),
      text: `${task.title} đã duyệt — xem ở workspace chung.`,
      by: memberName(task.memberId), time: now(),
    }
    setTeamFeed((prev) => [item, ...prev])
    updateTask(task.id, { announced: true })
    say(task.memberId, 'orchestrator', 'Đã báo lên nhóm — chỉ 1 tin ngắn trỏ tới workspace, không gửi kèm file hay bản vẽ.')
    log(`${task.code} — ${memberName(task.memberId)} yêu cầu báo lên nhóm (tin ngắn).`)
  }

  // --- Quyền xem ---
  const canReadChannel = (channelId) => {
    if (viewer.kind === 'orchestrator') return true
    if (viewer.kind === 'manager') return false
    return viewer.memberId === channelId
  }
  const visibleTasks = useMemo(() => {
    if (viewer.kind === 'member') return tasks.filter((t) => t.memberId === viewer.memberId)
    return tasks
  }, [tasks, viewer])
  const channelMessages = messages.filter((m) => m.channelId === activeChannel)
  const channelTasks = tasks.filter((t) => t.memberId === activeChannel)
  const managerQueue = tasks.filter((t) => t.status === 'cho-quan-ly' || t.status === 'leo-thang')
  const activeMember = MEMBERS.find((m) => m.id === activeChannel)
  const busyAgents = new Set(tasks.filter((t) => t.status === 'dang-lam' || t.status === 'dang-sua').flatMap((t) => t.subtasks.filter((s) => s.state === 'dang-lam').map((s) => s.agentId)))

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>🤖 Trợ lý trung tâm — mô phỏng</h1>
          <p className="sub">Dự án {PROJECT.name} · {PROJECT.code} · {PROJECT.phase} · Team 10 người, lĩnh vực kiến trúc</p>
        </div>
        <div className="viewer">
          <label>Xem dưới góc:</label>
          <select value={viewer.kind === 'member' ? `member:${viewer.memberId}` : viewer.kind} onChange={(e) => {
            const v = e.target.value
            if (v.startsWith('member:')) setViewer({ kind: 'member', memberId: v.split(':')[1] })
            else setViewer({ kind: v, memberId: viewer.memberId })
          }}>
            <optgroup label="Member (chỉ thấy việc của mình)">
              {MEMBERS.filter((m) => m.kind === 'member').map((m) => (
                <option key={m.id} value={`member:${m.id}`}>{m.name} — {m.role}</option>
              ))}
            </optgroup>
            <option value="manager">Trần Minh Quân — Quản lý (thấy toàn cảnh)</option>
            <option value="orchestrator">Trợ lý trung tâm (thấy luồng điều phối)</option>
          </select>
        </div>
      </header>

      {showHow && (
        <section className="how">
          <div>
            <strong>Cách chơi prototype này — đúng luồng đã chốt ngày 27-10:</strong>
            <ol>
              <li>Chọn 1 member ở cột trái → gửi lệnh ở kênh riêng (gõ tay hoặc bấm 1 kịch bản mẫu).</li>
              <li>Trợ lý tách việc, giao cho các AI chuyên môn chạy song song → trả bản nháp về đúng kênh riêng.</li>
              <li>Bạn xem nháp: chưa ưng thì “Yêu cầu sửa”, ưng thì “Gửi duyệt”.</li>
              <li>Cổng duyệt lai: AI tự duyệt nếu đủ checklist và loại việc cho phép; không thì chờ quản lý. Mâu thuẫn thì leo thang, quản lý quyết là cuối cùng.</li>
              <li>Chỉ khi duyệt xong mới ghi vào workspace chung. Sau đó bạn chủ động bấm “Báo lên nhóm” — tin báo chỉ là tin ngắn, không kèm file.</li>
            </ol>
          </div>
          <button className="ghost" onClick={() => setShowHow(false)}>Thu gọn ✕</button>
        </section>
      )}

      <main className="layout">
        {/* Cột trái: kênh riêng + agent */}
        <aside className="col left">
          <section className="panel">
            <h2>Kênh riêng của từng member</h2>
            <p className="hint">Không dùng group chat chung để giao việc. Mỗi người chỉ thấy kênh của mình.</p>
            <ul className="channels">
              {MEMBERS.map((m) => {
                const count = tasks.filter((t) => t.memberId === m.id && t.status !== 'da-duyet').length
                return (
                  <li key={m.id}>
                    <button className={activeChannel === m.id ? 'active' : ''} onClick={() => setActiveChannel(m.id)}>
                      <span className="avatar" style={{ background: m.color }}>{m.initials}</span>
                      <span className="ch-name">{m.name}<small>{m.role}</small></span>
                      {count > 0 && <span className="badge">{count}</span>}
                    </button>
                  </li>
                )
              })}
            </ul>
            <button className="team-channel" onClick={() => document.getElementById('teamfeed')?.scrollIntoView({ behavior: 'smooth' })}>
              📣 Kênh nhóm — chỉ nhận tin ngắn, không nhận file
            </button>
          </section>

          <section className="panel">
            <h2>AI chuyên môn</h2>
            <ul className="agents">
              {AGENTS.map((a) => (
                <li key={a.id}>
                  <span>{a.icon} <strong>{a.name}</strong><small>{a.desc}</small></span>
                  <span className={busyAgents.has(a.id) ? 'dot busy' : 'dot idle'} title={busyAgents.has(a.id) ? 'Đang làm' : 'Rảnh'} />
                </li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <h2>Kịch bản mẫu</h2>
            <p className="hint">Bấm là chạy ngay — mỗi kịch bản demo 1 nhánh của luồng.</p>
            <div className="scenarios">
              {SCENARIOS.map((s) => (
                <button key={s.id} onClick={() => startScenario(s)}>
                  <strong>{s.title}</strong>
                  <small>{memberName(s.memberId)} · {s.type}{s.conflictWith ? ' · ⚠️ mâu thuẫn' : ''}</small>
                </button>
              ))}
            </div>
          </section>
        </aside>

        {/* Cột giữa: kênh riêng đang mở */}
        <section className="col center">
          <div className="panel channel-head">
            <span className="avatar" style={{ background: activeMember?.color }}>{activeMember?.initials}</span>
            <div>
              <h2>Kênh riêng — {activeMember?.name}</h2>
              <p className="hint">{activeMember?.role} · Chỉ {activeMember?.name} và trợ lý trung tâm thấy nội dung này</p>
            </div>
            {viewer.kind === 'member' && viewer.memberId !== activeChannel && <span className="lock">🔒 Đây không phải kênh của bạn</span>}
          </div>

          {!canReadChannel(activeChannel) ? (
            <div className="panel locked">
              {viewer.kind === 'manager'
                ? <>🔒 <strong>Kênh riêng.</strong> Quản lý chỉ thấy tiêu đề và trạng thái task của cả team (xem cột phải), không đọc tin nhắn riêng của member.</>
                : <>🔒 <strong>Kênh riêng của {activeMember?.name}.</strong> Bạn đang xem dưới góc {memberName(viewer.memberId)} nên không đọc được nội dung kênh này. Chọn đúng tên mình ở cột trái để xem kênh của bạn.</>}
              <div className="locked-tasks">
                {channelTasks.map((t) => (
                  <div key={t.id} className="task-mini">{t.code} · {t.title} — {STATUS_LABEL[t.status]}</div>
                ))}
                {channelTasks.length === 0 && <p className="hint">Chưa có task nào ở kênh này.</p>}
              </div>
            </div>
          ) : (
            <>
              <div className="chat">
                {channelMessages.map((m) => (
                  <div key={m.id} className={`msg ${m.from}`}>
                    <span className="msg-from">{m.from === 'member' ? activeMember?.name : m.from === 'orchestrator' ? '🤖 Trợ lý trung tâm' : m.from}</span>
                    <p>{m.text}</p>
                    <span className="msg-time">{m.time}</span>
                  </div>
                ))}
                {channelMessages.length === 0 && <p className="hint">Chưa có tin nhắn nào.</p>}
              </div>

              {channelTasks.map((t) => (
                <article key={t.id} className="panel task">
                  <header>
                    <div><strong>{t.code} · {t.title}</strong><small>{t.type} · {STATUS_LABEL[t.status]}{t.approvedBy ? ` · Duyệt bởi: ${t.approvedBy}` : ''}</small></div>
                    <span className={`status ${t.status}`}>{STATUS_LABEL[t.status]}</span>
                  </header>
                  <ul className="subtasks">
                    {t.subtasks.map((s, i) => (
                      <li key={i}>
                        <span>{agentOf(s.agentId)?.icon} {agentOf(s.agentId)?.name} — {s.job}</span>
                        <span className="progress"><i style={{ width: `${s.progress || 0}%` }} /></span>
                        <small>{s.state === 'xong' ? '✓ xong' : s.state === 'dang-lam' ? `${s.progress || 0}%` : 'chờ'}</small>
                      </li>
                    ))}
                  </ul>
                  {t.subtasks.some((s) => s.state === 'xong') && (
                    <div className="draft">
                      <strong>Bản nháp:</strong>
                      <ul>{t.subtasks.filter((s) => s.state === 'xong').map((s, i) => <li key={i}>{s.output}</li>)}</ul>
                      <p className="hint">⚠️ Đây vẫn là bản nháp — chưa ghi vào workspace chung cho tới khi được duyệt.</p>
                    </div>
                  )}
                  {t.note && <p className="hint">💡 {t.note}</p>}
                  {t.status === 'leo-thang' && (
                    <div className="conflict">
                      <strong>⚠️ Mâu thuẫn, chờ quản lý quyết:</strong>
                      <p>{t.conflictNote}</p>
                      <p className="hint">Trợ lý không tự chọn. Quyết định của quản lý là cuối cùng và được ghi vào nhật ký chung.</p>
                    </div>
                  )}
                  {t.status === 'tu-choi' && t.rejectReason && <p className="reject">✕ {t.rejectReason}</p>}
                  <div className="actions">
                    {t.status === 'cho-xem-lai' && viewer.kind === 'member' && viewer.memberId === t.memberId && (
                      <>
                        <button className="primary" onClick={() => submitForApproval(t)}>Gửi duyệt</button>
                        <button onClick={() => requestRevision(t)}>Yêu cầu sửa lại</button>
                      </>
                    )}
                    {t.status === 'cho-xem-lai' && !(viewer.kind === 'member' && viewer.memberId === t.memberId) && (
                      <span className="hint">Chờ {memberName(t.memberId)} xem nháp và gửi duyệt.</span>
                    )}
                    {t.status === 'da-duyet' && !t.announced && viewer.kind === 'member' && viewer.memberId === t.memberId && (
                      <button className="primary" onClick={() => announceToTeam(t)}>📣 Báo lên nhóm</button>
                    )}
                    {t.status === 'da-duyet' && t.announced && <span className="hint">✓ Đã báo lên nhóm (tin ngắn).</span>}
                    {t.status === 'cho-quan-ly' && <span className="hint">Đang chờ quản lý duyệt ở cột phải.</span>}
                  </div>
                </article>
              ))}

              <div className="panel composer">
                <label>Gửi lệnh mới ở kênh này ({viewer.kind === 'member' ? `bạn là ${memberName(viewer.memberId)}` : 'bạn đang xem dưới góc khác — lệnh sẽ gửi dưới tên ' + activeMember?.name})</label>
                <div className="composer-row">
                  <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && startCustom()} placeholder="Ví dụ: Tra cứu chiều cao tối đa cho tầng tum theo quy chuẩn…" />
                  <select value={inputType} onChange={(e) => setInputType(e.target.value)}>
                    {APPROVAL_RULES.map((r) => <option key={r.type}>{r.type}</option>)}
                  </select>
                  <button className="primary" onClick={startCustom} disabled={!input.trim()}>Gửi cho trợ lý →</button>
                </div>
                <p className="hint">Trợ lý sẽ tự chọn agent theo nội dung lệnh. Loại việc quyết định cổng duyệt (xem “Quy tắc duyệt” ở cột phải).</p>
              </div>
            </>
          )}
        </section>

        {/* Cột phải: workspace + quản lý + tin nhóm + nhật ký */}
        <aside className="col right">
          <section className="panel">
            <h2>🏛️ Workspace chung — “sự thật duy nhất”</h2>
            <p className="hint">{PROJECT.note}</p>
            <ul className="ws">
              {workspace.map((w) => (
                <li key={w.id}><strong>{w.title}</strong><small>{w.kind} · {w.rev} · bởi {w.by} · duyệt: {w.approvedBy} · {w.time}</small></li>
              ))}
            </ul>
          </section>

          <section className="panel manager">
            <h2>👔 Hàng chờ quản lý {managerQueue.length > 0 && <span className="badge">{managerQueue.length}</span>}</h2>
            {managerQueue.length === 0 && <p className="hint">Không có gì chờ. Khi có task cần quản lý duyệt hoặc mâu thuẫn leo thang, nó sẽ hiện ở đây.</p>}
            {managerQueue.map((t) => (
              <div key={t.id} className="queue-item">
                <strong>{t.code} · {t.title}</strong>
                <small>{memberName(t.memberId)} · {t.type} · {t.status === 'leo-thang' ? 'Mâu thuẫn' : 'Chờ duyệt'}</small>
                {t.status === 'leo-thang' && <p>{t.conflictNote}</p>}
                {viewer.kind === 'manager' ? (
                  <div className="actions">
                    {t.status === 'leo-thang' ? (
                      <>
                        <button className="primary" onClick={() => resolveConflict(t, true)}>Chọn phương án của {memberName(t.memberId)}</button>
                        <button onClick={() => resolveConflict(t, false)}>Chọn phương án của {memberName(t.conflictWith)}</button>
                      </>
                    ) : (
                      <>
                        <button className="primary" onClick={() => managerDecide(t, true)}>Duyệt</button>
                        <button onClick={() => managerDecide(t, false, 'Cần sửa lại số liệu trước khi duyệt.')}>Không duyệt</button>
                      </>
                    )}
                  </div>
                ) : (
                  <p className="hint">Chuyển sang góc “Quản lý” ở thanh trên để quyết.</p>
                )}
              </div>
            ))}
            <p className="hint">Toàn cảnh team ({viewer.kind === 'manager' ? 'bạn đang xem dưới góc quản lý' : 'chuyển sang góc quản lý để thấy đủ'}): {visibleTasks.length} task trong phiên này — {visibleTasks.filter((t) => t.status === 'da-duyet').length} đã duyệt, {visibleTasks.filter((t) => t.status !== 'da-duyet').length} đang xử lý/chờ.</p>
          </section>

          <section className="panel" id="teamfeed">
            <h2>📣 Kênh nhóm — tin ngắn</h2>
            <p className="hint">Chỉ member yêu cầu mới báo. Tin chỉ trỏ tới workspace, không kèm file/kết quả.</p>
            <ul className="feed">
              {teamFeed.map((f) => (
                <li key={f.id}><strong>{f.by}:</strong> {f.text} <small>{f.time}</small></li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <h2>📜 Nhật ký (audit)</h2>
            <ul className="audit">
              {audit.slice(0, 8).map((a) => (
                <li key={a.id}><small>{a.time}</small> {a.text}</li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <button className="linklike" onClick={() => setShowRules(!showRules)}>
              {showRules ? '▾' : '▸'} Quy tắc duyệt trong prototype — giả định, chưa chốt
            </button>
            {showRules && (
              <>
                <p className="hint">Ngày 27-10 user nói chưa cần đi sâu: tiêu chí “đủ” để AI tự duyệt và danh sách “không bao giờ tự duyệt” vẫn để ngỏ. Prototype tạm đặt như sau để mô phỏng được:</p>
                <ul className="rules">
                  {APPROVAL_RULES.map((r) => (
                    <li key={r.type}><strong>{r.type}</strong> — {r.auto ? 'AI được tự duyệt' : 'Không tự duyệt'}<small>{r.note}</small></li>
                  ))}
                </ul>
              </>
            )}
          </section>
        </aside>
      </main>

      <footer className="foot">
        Prototype giả lập — không có AI thật, không gọi API, dữ liệu chỉ nằm trong trình duyệt và mất khi tải lại trang.
        Mô hình gốc: ~/workspace/team-assistant-idea/mo-hinh-tro-ly-team.html · UML: mo-hinh-uml-control-flow.html
      </footer>
    </div>
  )
}
