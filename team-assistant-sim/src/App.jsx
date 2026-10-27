import { useMemo, useRef, useState } from 'react'
import {
  Background, Controls, MiniMap, ReactFlow, useEdgesState, useNodesState,
} from '@xyflow/react'
import {
  AGENTS, APPROVAL_RULES, INITIAL_WORKSPACE, MEMBERS, PROJECT,
  SCENARIOS, agentName, memberName,
} from './data.js'
import {
  NODE_H, NODE_W, POS, agentPos, memberPos, nodeTypes,
} from './nodes.jsx'

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

function initialBaseNodes() {
  const nodes = [
    { id: 'hub', type: 'hub', position: POS.hub, data: {} },
    { id: 'gate', type: 'gate', position: POS.gate, data: {} },
    { id: 'manager', type: 'manager', position: POS.manager, data: {} },
    { id: 'workspace', type: 'workspace', position: POS.workspace, data: {} },
    { id: 'team', type: 'team', position: POS.team, data: {} },
  ]
  MEMBERS.forEach((m, i) => nodes.push({ id: `m-${m.id}`, type: 'member', position: memberPos(i), data: {} }))
  AGENTS.forEach((a, i) => nodes.push({ id: `a-${a.id}`, type: 'agent', position: agentPos(i), data: {} }))
  return nodes
}

const STATIC_EDGES = [
  ...MEMBERS.map((m) => ({ id: `e-m-${m.id}`, source: `m-${m.id}`, target: 'hub' })),
  ...AGENTS.map((a) => ({ id: `e-a-${a.id}`, source: 'hub', target: `a-${a.id}` })),
  { id: 'e-gate', source: 'hub', target: 'gate' },
  { id: 'e-manager', source: 'manager', target: 'gate', targetHandle: 'from-manager', sourceHandle: 'to-gate' },
  { id: 'e-workspace', source: 'gate', target: 'workspace' },
  { id: 'e-team', source: 'workspace', target: 'team' },
]

export default function App() {
  const [viewer, setViewer] = useState({ kind: 'member', memberId: 'an' })
  const [selected, setSelected] = useState({ kind: 'hub', id: 'hub' })
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
  const taskSeq = useRef(101)
  const timers = useRef([])
  const rfRef = useRef(null)

  const [baseNodes, setBaseNodes, onNodesChange] = useNodesState(initialBaseNodes())
  const [, , onEdgesChange] = useEdgesState([])

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

  // --- Vị trí token: tính từ vị trí hiện tại của các node (kéo node đi token vẫn bám theo) ---
  const nodeById = (id) => baseNodes.find((n) => n.id === id)
  const centerOf = (id) => {
    const n = nodeById(id)
    if (!n) return { x: 0, y: 0 }
    return { x: n.position.x + NODE_W[n.type] / 2, y: n.position.y + NODE_H[n.type] / 2 }
  }
  const posOf = (id) => nodeById(id)?.position || { x: 0, y: 0 }
  const mid = (a, b) => ({ x: (a.x + b.x) / 2 - NODE_W.token / 2, y: (a.y + b.y) / 2 - NODE_H.token / 2 })

  const tokenPosFor = (stage, task) => {
    const mP = posOf(`m-${task.memberId}`)
    const mC = centerOf(`m-${task.memberId}`)
    const oC = centerOf('hub')
    const gC = centerOf('gate')
    const wC = centerOf('workspace')
    const tmC = centerOf('team')
    const mgC = centerOf('manager')
    switch (stage) {
      case 'at-member': return { x: mP.x + NODE_W.member + 8, y: mP.y + 9 }
      case 'to-orc': case 'to-member': return mid(mC, oC)
      case 'at-orc': return { x: posOf('hub').x + NODE_W.hub + 8, y: posOf('hub').y + 26 }
      case 'to-gate': return mid(oC, gC)
      case 'at-gate': return { x: posOf('gate').x + NODE_W.gate + 8, y: posOf('gate').y + 20 }
      case 'to-workspace': return mid(gC, wC)
      case 'at-workspace': return { x: posOf('workspace').x + 20, y: posOf('workspace').y + NODE_H.workspace + 10 }
      case 'to-team': return mid(wC, tmC)
      case 'at-team': return { x: posOf('team').x + 20, y: posOf('team').y + NODE_H.team + 10 }
      case 'to-manager': return mid(oC, mgC)
      case 'at-manager': return { x: posOf('manager').x + NODE_W.manager + 8, y: posOf('manager').y + 9 }
      default: return mid(mC, oC)
    }
  }
  const subTokenPosFor = (stage, agentId) => {
    const oC = centerOf('hub')
    const aC = centerOf(`a-${agentId}`)
    const aP = posOf(`a-${agentId}`)
    if (stage === 'to-agent') return mid(oC, aC)
    if (stage === 'at-agent') return { x: aP.x + NODE_W.agent + 8, y: aP.y + 9 }
    if (stage === 'back') return mid(aC, oC)
    return mid(oC, aC)
  }

  // --- Mô phỏng agent chạy song song (token con chạy trợ lý → agent → về) ---
  const runSubtasks = (task, onDone) => {
    let finished = 0
    const total = task.subtasks.length
    task.subtasks.forEach((st, idx) => {
      updateSubtask(task.id, idx, { state: 'dang-lam', progress: 0, stage: 'to-agent' })
      later(() => {
        updateSubtask(task.id, idx, { stage: 'at-agent' })
        const step = 200
        const inc = (step / st.ms) * 100
        let p = 0
        const iv = setInterval(() => {
          p = Math.min(100, p + inc)
          updateSubtask(task.id, idx, { progress: Math.round(p), state: p >= 100 ? 'xong' : 'dang-lam' })
          if (p >= 100) {
            clearInterval(iv)
            updateSubtask(task.id, idx, { stage: 'back' })
            later(() => {
              updateSubtask(task.id, idx, { stage: 'done' })
              finished += 1
              if (finished === total) onDone(task)
            }, 650)
          }
        }, step)
        timers.current.push(iv)
      }, 450)
    })
  }

  const deliverDraft = (task) => {
    if (task.conflictWith) {
      updateTask(task.id, { status: 'leo-thang', tokenStage: 'to-manager' })
      say(task.memberId, 'orchestrator', `Mình đã làm xong bản nháp cho “${task.title}”, nhưng phát hiện mâu thuẫn: ${task.conflictNote} Mình không tự chọn mà trình cả hai phương án lên quản lý. Bấm vào node Quản lý hoặc Cổng duyệt để xem.`)
      log(`${task.code} mâu thuẫn với yêu cầu của ${memberName(task.conflictWith)} — leo thang lên quản lý.`)
      later(() => updateTask(task.id, { tokenStage: 'at-manager' }), 700)
      return
    }
    updateTask(task.id, { status: 'cho-xem-lai', tokenStage: 'to-member' })
    say(task.memberId, 'orchestrator', `Xong bản nháp cho “${task.title}” rồi đây. ${task.subtasks.map((s) => s.output).join(' · ')} Bạn xem thử ở node của mình, chưa ưng thì bảo mình sửa, ưng rồi thì bấm “Gửi duyệt”. Trước khi duyệt thì đây vẫn chỉ là bản nháp, chưa ghi vào workspace chung.`)
    log(`${task.code} xong bản nháp, trả về kênh riêng của ${memberName(task.memberId)}.`)
    later(() => updateTask(task.id, { tokenStage: 'at-member' }), 700)
  }

  const startTask = (spec) => {
    const code = `T-${taskSeq.current++}`
    const task = {
      id: nextId('t'), code, memberId: spec.memberId, title: spec.title,
      request: spec.request, type: spec.type, status: 'phan-tach', tokenStage: 'to-orc',
      autoEligible: spec.autoEligible, checklist: spec.checklist,
      checkPass: spec.checkPass, checkFailReason: spec.checkFailReason,
      conflictWith: spec.conflictWith || null, conflictNote: spec.conflictNote || '',
      note: spec.note || '',
      subtasks: spec.subtasks.map((s) => ({ ...s, state: 'cho', progress: 0, stage: 'cho' })),
      approvedBy: null, rejectReason: '', announced: false,
    }
    setTasks((prev) => [task, ...prev])
    setSelected({ kind: 'task', id: task.id })
    say(spec.memberId, 'member', spec.request)
    say(spec.memberId, 'orchestrator', `Đã nhận. Mình tách “${spec.title}” thành ${spec.subtasks.length} việc nhỏ và giao cho ${spec.subtasks.map((s) => agentName(s.agentId)).join(' + ')} — việc nào xong trước trả trước, việc sau không phải chờ việc trước.`)
    log(`${code} — ${memberName(spec.memberId)} gửi lệnh: “${spec.title}”. Trợ lý giao cho ${spec.subtasks.map((s) => agentName(s.agentId)).join(', ')}.`)
    later(() => {
      updateTask(task.id, { status: 'dang-lam', tokenStage: 'at-orc' })
      runSubtasks(task, (doneTask) => deliverDraft(doneTask))
    }, 900)
    return task
  }

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
    const channelId = selected.kind === 'member' ? selected.id : viewer.memberId
    startTask({
      memberId: channelId, title: text.length > 60 ? `${text.slice(0, 60)}…` : text,
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
    updateTask(task.id, { status: 'da-duyet', approvedBy, tokenStage: 'to-workspace' })
    say(task.memberId, 'orchestrator', `Đã duyệt (${approvedBy}) và ghi nhận vào workspace chung: “${wsItem.title}”. Từ giờ cả team đều thấy bản này là bản chính thức. Bạn muốn báo lên nhóm thì bấm “Báo lên nhóm” ở node task — tin báo chỉ là tin ngắn trỏ tới workspace, không gửi kèm file.`)
    log(`${task.code} được ${approvedBy} duyệt — đã ghi vào workspace chung.`)
    later(() => updateTask(task.id, { tokenStage: 'at-workspace' }), 700)
  }

  const submitForApproval = (task) => {
    updateTask(task.id, { status: 'cho-duyet', tokenStage: 'to-orc' })
    say(task.memberId, 'orchestrator', 'Đã gửi duyệt. Mình kiểm tra checklist trước: ' + task.checklist.join(' · ') + '.')
    log(`${task.code} gửi duyệt — AI kiểm tra checklist.`)
    later(() => updateTask(task.id, { tokenStage: 'to-gate' }), 500)
    later(() => updateTask(task.id, { tokenStage: 'at-gate' }), 1100)
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
    }, 1700)
  }

  const managerDecide = (task, approve, reason = '') => {
    if (approve) {
      recordApproval(task, 'Quản lý')
    } else {
      updateTask(task.id, { status: 'tu-choi', rejectReason: reason || 'Quản lý không duyệt.', tokenStage: 'to-member' })
      say(task.memberId, 'orchestrator', `Quản lý không duyệt “${task.title}”: ${reason || 'cần sửa lại.'} Bạn bảo mình sửa theo góp ý này nhé — sửa xong sẽ phải duyệt lại từ đầu, không có đường tắt vào workspace.`)
      log(`${task.code} bị quản lý từ chối: ${reason || 'không rõ lý do'}.`)
      later(() => updateTask(task.id, { tokenStage: 'at-member' }), 700)
    }
  }

  const resolveConflict = (task, keepMine) => {
    updateTask(task.id, { tokenStage: 'to-member' })
    if (keepMine) {
      updateTask(task.id, { status: 'cho-xem-lai' })
      say(task.memberId, 'orchestrator', `Quản lý đã quyết: giữ phương án của bạn (“${task.title}”). Phương án của ${memberName(task.conflictWith)} không được chọn và đã ghi vào nhật ký chung. Bạn xem lại bản nháp rồi gửi duyệt như bình thường.`)
      log(`Mâu thuẫn ${task.code}: quản lý chọn phương án của ${memberName(task.memberId)}.`)
    } else {
      updateTask(task.id, { status: 'tu-choi', rejectReason: `Quản lý chọn phương án của ${memberName(task.conflictWith)}.` })
      say(task.memberId, 'orchestrator', `Quản lý đã quyết: chọn phương án của ${memberName(task.conflictWith)}. Yêu cầu của bạn dừng ở đây, quyết định đã ghi vào nhật ký chung.`)
      log(`Mâu thuẫn ${task.code}: quản lý chọn phương án của ${memberName(task.conflictWith)}.`)
    }
    later(() => updateTask(task.id, { tokenStage: 'at-member' }), 700)
  }

  const requestRevision = (task) => {
    updateTask(task.id, { status: 'dang-sua', tokenStage: 'to-orc' })
    say(task.memberId, 'member', 'Bản này chưa ưng, sửa lại giúp mình nhé.')
    say(task.memberId, 'orchestrator', 'Ok, mình giao lại cho agent sửa. Sửa xong mình trả lại đây, rồi vẫn phải qua duyệt lại từ đầu.')
    log(`${task.code} — ${memberName(task.memberId)} yêu cầu sửa lại bản nháp.`)
    later(() => {
      updateTask(task.id, { status: 'dang-lam', tokenStage: 'at-orc' })
      const rerun = { ...task, subtasks: task.subtasks.map((s) => ({ ...s, ms: 1300, state: 'cho', progress: 0, stage: 'cho' })) }
      runSubtasks(rerun, (doneTask) => deliverDraft(doneTask))
    }, 900)
  }

  const announceToTeam = (task) => {
    const item = {
      id: nextId('tf'),
      text: `${task.title} đã duyệt — xem ở workspace chung.`,
      by: memberName(task.memberId), time: now(),
    }
    setTeamFeed((prev) => [item, ...prev])
    updateTask(task.id, { announced: true, tokenStage: 'to-team' })
    say(task.memberId, 'orchestrator', 'Đã báo lên nhóm — chỉ 1 tin ngắn trỏ tới workspace, không gửi kèm file hay bản vẽ.')
    log(`${task.code} — ${memberName(task.memberId)} yêu cầu báo lên nhóm (tin ngắn).`)
    later(() => updateTask(task.id, { tokenStage: 'at-team' }), 700)
  }

  // --- Quyền xem ---
  const canReadChannel = (channelId) => {
    if (viewer.kind === 'orchestrator') return true
    if (viewer.kind === 'manager') return false
    return viewer.memberId === channelId
  }
  const managerQueue = tasks.filter((t) => t.status === 'cho-quan-ly' || t.status === 'leo-thang')
  const inFlight = tasks.filter((t) => t.status !== 'da-duyet' && t.status !== 'tu-choi')

  // --- Nodes: vị trí từ state (kéo được), data tươi theo tasks ---
  const selKey = `${selected.kind}:${selected.id}`
  const nodes = useMemo(() => {
    const dataFor = (n) => {
      if (n.type === 'member') {
        const m = MEMBERS.find((x) => `m-${x.id}` === n.id)
        return { ...m, activeCount: tasks.filter((t) => t.memberId === m.id && t.status !== 'da-duyet' && t.status !== 'tu-choi').length, selected: selKey === `member:${m.id}` }
      }
      if (n.type === 'agent') {
        const a = AGENTS.find((x) => `a-${x.id}` === n.id)
        const active = tasks.flatMap((t) => t.subtasks.map((s) => ({ ...s, task: t }))).filter((s) => s.agentId === a.id && s.state === 'dang-lam')
        return { ...a, busy: active.length > 0, progress: active.length ? Math.max(...active.map((s) => s.progress || 0)) : 0, selected: selKey === `agent:${a.id}` }
      }
      if (n.type === 'hub') return { activeCount: inFlight.length, selected: selKey === 'hub:hub' }
      if (n.type === 'gate') return { queueCount: managerQueue.length, selected: selKey === 'gate:gate' }
      if (n.type === 'manager') {
        const m = MEMBERS.find((x) => x.kind === 'manager')
        return { ...m, queueCount: managerQueue.length, selected: selKey === 'manager:manager' }
      }
      if (n.type === 'workspace') return { count: workspace.length, selected: selKey === 'workspace:workspace' }
      if (n.type === 'team') return { count: teamFeed.length, selected: selKey === 'team:team' }
      return {}
    }
    const base = baseNodes.map((n) => ({ ...n, data: dataFor(n) }))
    const tokens = []
    tasks.forEach((t) => {
      if (t.tokenStage && t.tokenStage !== 'hidden') {
        tokens.push({
          id: `task-${t.id}`, type: 'task', draggable: false, selectable: true,
          position: tokenPosFor(t.tokenStage, t),
          data: { code: t.code, title: t.title, status: t.status, taskId: t.id },
        })
      }
      t.subtasks.forEach((s, i) => {
        if (s.stage === 'to-agent' || s.stage === 'at-agent' || s.stage === 'back') {
          tokens.push({
            id: `sub-${t.id}-${i}`, type: 'task', draggable: false, selectable: true,
            position: subTokenPosFor(s.stage, s.agentId),
            data: { code: t.code, title: `${agentName(s.agentId)} · ${s.job}`, status: t.status, taskId: t.id },
          })
        }
      })
    })
    return [...base, ...tokens]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseNodes, tasks, workspace, teamFeed, selKey])

  // --- Edges: sáng + chạy khi có task đang đi qua ---
  const edges = useMemo(() => {
    const animated = new Set()
    tasks.forEach((t) => {
      if (['phan-tach', 'dang-sua'].includes(t.status) || t.tokenStage === 'to-orc' || t.tokenStage === 'to-member') animated.add(`e-m-${t.memberId}`)
      if (t.status === 'dang-lam' || t.status === 'dang-sua') {
        t.subtasks.forEach((s) => {
          if (['to-agent', 'at-agent', 'back'].includes(s.stage)) animated.add(`e-a-${s.agentId}`)
        })
      }
      if (t.status === 'cho-duyet') { animated.add(`e-m-${t.memberId}`); animated.add('e-gate') }
      if (t.status === 'cho-quan-ly' || t.status === 'leo-thang') animated.add('e-manager')
      if (t.tokenStage === 'to-workspace' || t.tokenStage === 'at-workspace') animated.add('e-workspace')
      if (t.tokenStage === 'to-team' || t.tokenStage === 'at-team') animated.add('e-team')
    })
    return STATIC_EDGES.map((e) => ({
      ...e, animated: animated.has(e.id),
      style: { stroke: animated.has(e.id) ? '#ffd166' : '#5b6b84', strokeWidth: animated.has(e.id) ? 2.5 : 1.5 },
    }))
  }, [tasks])

  const onNodeClick = (_e, node) => {
    if (node.type === 'task') {
      setSelected({ kind: 'task', id: node.data.taskId })
      return
    }
    if (node.type === 'member') setSelected({ kind: 'member', id: node.id.replace('m-', '') })
    else if (node.type === 'agent') setSelected({ kind: 'agent', id: node.id.replace('a-', '') })
    else setSelected({ kind: node.type, id: node.id })
  }

  const resetLayout = () => {
    setBaseNodes(initialBaseNodes())
    later(() => rfRef.current?.fitView({ padding: 0.12 }), 50)
  }

  const selMember = selected.kind === 'member' ? MEMBERS.find((m) => m.id === selected.id) : null
  const selAgent = selected.kind === 'agent' ? AGENTS.find((a) => a.id === selected.id) : null
  const selTask = selected.kind === 'task' ? tasks.find((t) => t.id === selected.id) : null
  const selMemberTasks = selMember ? tasks.filter((t) => t.memberId === selMember.id) : []
  const selMemberMessages = selMember ? messages.filter((m) => m.channelId === selMember.id) : []

  const taskCard = (t, showActions = true) => (
    <article key={t.id} className="panel task">
      <header>
        <div><strong>{t.code} · {t.title}</strong><small>{t.type} · {STATUS_LABEL[t.status]}{t.approvedBy ? ` · Duyệt bởi: ${t.approvedBy}` : ''}</small></div>
        <span className={`status ${t.status}`}>{STATUS_LABEL[t.status]}</span>
      </header>
      <ul className="subtasks">
        {t.subtasks.map((s, i) => (
          <li key={i}>
            <span>{AGENTS.find((a) => a.id === s.agentId)?.icon} {agentName(s.agentId)} — {s.job}</span>
            <span className="progress"><i style={{ width: `${s.progress || 0}%` }} /></span>
            <small>{s.state === 'xong' ? '✓ xong' : s.state === 'dang-lam' ? `${s.progress || 0}%` : 'chờ'}</small>
          </li>
        ))}
      </ul>
      {t.subtasks.some((s) => s.state === 'xong') && (
        <div className="draft">
          <strong>{t.status === 'da-duyet' ? 'Kết quả đã duyệt:' : 'Bản nháp:'}</strong>
          <ul>{t.subtasks.filter((s) => s.state === 'xong').map((s, i) => <li key={i}>{s.output}</li>)}</ul>
          {t.status === 'da-duyet'
            ? <p className="hint">✓ Đã duyệt bởi {t.approvedBy} — đã ghi vào workspace chung.</p>
            : <p className="hint">⚠️ Đây vẫn là bản nháp — chưa ghi vào workspace chung cho tới khi được duyệt.</p>}
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
      {showActions && (
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
          {t.status === 'cho-quan-ly' && <span className="hint">Đang chờ quản lý duyệt (node Cổng duyệt).</span>}
        </div>
      )}
    </article>
  )

  const queueBlock = (
    <>
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
    </>
  )

  return (
    <div className="app2">
      <header className="topbar">
        <div>
          <h1>🤖 Trợ lý trung tâm — dạng node</h1>
          <p className="sub">Dự án {PROJECT.name} · {PROJECT.code} · {PROJECT.phase} · Team 10 người, lĩnh vực kiến trúc · Luồng chạy trái → phải</p>
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

      <div className="scen-bar">
        <span className="scen-label">Kịch bản mẫu — bấm là task chạy trên sơ đồ:</span>
        {SCENARIOS.map((s) => (
          <button key={s.id} onClick={() => startTask({ ...s })} title={s.request}>
            {s.title}{s.conflictWith ? ' ⚠️' : ''}
          </button>
        ))}
        <button className="ghost-btn" onClick={resetLayout} title="Thu toàn bộ sơ đồ vừa khung hình">⤢ Vừa khung hình</button>
      </div>

      <main className="flow-layout">
        <div className="canvas-wrap">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onInit={(inst) => { rfRef.current = inst }}
            fitView
            fitViewOptions={{ padding: 0.12 }}
            minZoom={0.3}
            maxZoom={1.6}
            colorMode="dark"
            proOptions={{ hideAttribution: true }}
          >
            <Background gap={22} size={1.5} />
            <Controls />
            <MiniMap pannable zoomable nodeColor={(n) => (n.type === 'task' ? '#ffd166' : n.type === 'hub' ? '#8ab8ff' : '#5b6b84')} />
          </ReactFlow>
          <div className="canvas-hint">Kéo thả để di chuyển node · lăn chuột để zoom · bấm vào 1 node để xem chi tiết ở panel phải · token vàng là task đang chạy</div>
        </div>

        <aside className="panel-col">
          {/* Chi tiết node đang chọn */}
          {selected.kind === 'member' && selMember && (
            <section className="panel">
              <h2>👤 Kênh riêng — {selMember.name}</h2>
              <p className="hint">{selMember.role} · Chỉ {selMember.name} và trợ lý trung tâm thấy nội dung này</p>
              {!canReadChannel(selMember.id) ? (
                <p>🔒 <strong>Kênh riêng.</strong> {viewer.kind === 'manager'
                  ? 'Quản lý chỉ thấy tiêu đề và trạng thái task của cả team, không đọc tin nhắn riêng của member.'
                  : `Bạn đang xem dưới góc ${memberName(viewer.memberId)} nên không đọc được nội dung kênh này. Chọn đúng tên mình ở thanh trên để xem kênh của bạn.`}</p>
              ) : (
                <>
                  <div className="chat">
                    {selMemberMessages.map((m) => (
                      <div key={m.id} className={`msg ${m.from}`}>
                        <span className="msg-from">{m.from === 'member' ? selMember.name : '🤖 Trợ lý trung tâm'}</span>
                        <p>{m.text}</p>
                        <span className="msg-time">{m.time}</span>
                      </div>
                    ))}
                  </div>
                  {selMemberTasks.map((t) => taskCard(t))}
                  {selMemberTasks.length === 0 && <p className="hint">Chưa có task nào ở kênh này — gửi lệnh mới ở dưới.</p>}
                  <div className="composer">
                    <label>Gửi lệnh mới ở kênh này</label>
                    <div className="composer-row">
                      <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && startCustom()} placeholder="Ví dụ: Tra cứu chiều cao tối đa cho tầng tum…" />
                      <select value={inputType} onChange={(e) => setInputType(e.target.value)}>
                        {APPROVAL_RULES.map((r) => <option key={r.type}>{r.type}</option>)}
                      </select>
                      <button className="primary" onClick={startCustom} disabled={!input.trim()}>Gửi →</button>
                    </div>
                  </div>
                </>
              )}
              {selMemberTasks.length > 0 && !canReadChannel(selMember.id) && selMemberTasks.map((t) => (
                <div key={t.id} className="task-mini">{t.code} · {t.title} — {STATUS_LABEL[t.status]}</div>
              ))}
            </section>
          )}

          {selected.kind === 'agent' && selAgent && (
            <section className="panel">
              <h2>{selAgent.icon} AI — {selAgent.name}</h2>
              <p className="hint">{selAgent.desc}</p>
              {tasks.flatMap((t) => t.subtasks.map((s, i) => ({ ...s, task: t, idx: i }))).filter((s) => s.agentId === selAgent.id && s.state !== 'cho').length === 0
                ? <p className="hint">Đang rảnh — chưa có việc nào giao cho AI này trong phiên này.</p>
                : tasks.flatMap((t) => t.subtasks.map((s) => ({ ...s, task: t }))).filter((s) => s.agentId === selAgent.id && s.state !== 'cho').map((s, i) => (
                  <div key={i} className="task-mini">{s.task.code} · {s.job} — {s.state === 'xong' ? '✓ xong' : `${s.progress || 0}%`}</div>
                ))}
            </section>
          )}

          {selected.kind === 'hub' && (
            <section className="panel">
              <h2>🤖 Trợ lý trung tâm</h2>
              <p className="hint">Nhận lệnh ở kênh riêng → tách việc → giao cho các AI chuyên môn chạy song song → trả bản nháp về đúng người yêu cầu → qua cổng duyệt mới ghi vào workspace.</p>
              <p>Đang xử lý: <strong>{inFlight.length} task</strong> · Đã duyệt trong phiên: <strong>{tasks.filter((t) => t.status === 'da-duyet').length}</strong></p>
              <p className="hint">Bấm vào node task màu vàng trên sơ đồ để xem chi tiết 1 task. Bấm vào node member để mở kênh riêng của người đó.</p>
            </section>
          )}

          {(selected.kind === 'gate' || selected.kind === 'manager') && (
            <section className="panel">
              <h2>👔 {selected.kind === 'gate' ? 'Cổng duyệt' : 'Quản lý — Trần Minh Quân'}</h2>
              <p className="hint">AI tự duyệt nếu đủ checklist và loại việc cho phép; không thì chờ quản lý. Mâu thuẫn leo thang thì quyết định của quản lý là cuối cùng.</p>
              {queueBlock}
            </section>
          )}

          {selected.kind === 'workspace' && (
            <section className="panel">
              <h2>🏛️ Workspace chung — “sự thật duy nhất”</h2>
              <p className="hint">Chỉ bản đã duyệt mới được ghi nhận vào đây.</p>
              <ul className="ws">
                {workspace.map((w) => (
                  <li key={w.id}><strong>{w.title}</strong><small>{w.kind} · {w.rev} · bởi {w.by} · duyệt: {w.approvedBy} · {w.time}</small></li>
                ))}
              </ul>
            </section>
          )}

          {selected.kind === 'team' && (
            <section className="panel">
              <h2>📣 Kênh nhóm — tin ngắn</h2>
              <p className="hint">Chỉ member yêu cầu mới báo. Tin chỉ trỏ tới workspace, không kèm file/kết quả.</p>
              <ul className="feed">
                {teamFeed.map((f) => (
                  <li key={f.id}><strong>{f.by}:</strong> {f.text} <small>{f.time}</small></li>
                ))}
              </ul>
            </section>
          )}

          {selected.kind === 'task' && selTask && (
            <section className="panel">
              <h2>🔶 Task {selTask.code}</h2>
              {taskCard(selTask)}
            </section>
          )}

          {selected.kind === 'task' && !selTask && (
            <section className="panel">
              <h2>🔶 Task</h2>
              <p className="hint">Task này đã xong vòng chạy của nó. Bấm vào 1 node task khác trên sơ đồ để xem.</p>
            </section>
          )}

          {/* Luôn hiện: workspace + nhóm + nhật ký */}
          {selected.kind !== 'workspace' && (
            <section className="panel">
              <h2>🏛️ Workspace chung ({workspace.length})</h2>
              <ul className="ws">
                {workspace.slice(0, 4).map((w) => (
                  <li key={w.id}><strong>{w.title}</strong><small>{w.kind} · duyệt: {w.approvedBy} · {w.time}</small></li>
                ))}
              </ul>
            </section>
          )}
          {selected.kind !== 'team' && (
            <section className="panel">
              <h2>📣 Kênh nhóm — tin ngắn</h2>
              <ul className="feed">
                {teamFeed.slice(0, 3).map((f) => (
                  <li key={f.id}><strong>{f.by}:</strong> {f.text} <small>{f.time}</small></li>
                ))}
              </ul>
            </section>
          )}
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
                <p className="hint">Tiêu chí “đủ” để AI tự duyệt và danh sách “không bao giờ tự duyệt” vẫn để ngỏ (27-10). Prototype tạm đặt như sau để mô phỏng được:</p>
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
        Prototype giả lập dạng node — không có AI thật, không gọi API, dữ liệu chỉ nằm trong trình duyệt và mất khi tải lại trang.
        Mô hình gốc: ~/workspace/team-assistant-idea/mo-hinh-tro-ly-team.html
      </footer>
    </div>
  )
}
