import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Background, Controls, MiniMap, ReactFlow, useEdgesState, useNodesState,
} from '@xyflow/react'
import { DRAFT_PROPOSAL, MAPS, MAX_SUBTOPICS_PER_TOPIC, NODES } from './data.js'
import { nodeTypes } from './nodes.jsx'

const SUBTITLE = {
  root: 'Nút gốc · 28-10-2026',
  topic: `Topic · tối đa ${MAX_SUBTOPICS_PER_TOPIC} subtopic`,
  subtopic: 'Subtopic · tóm tắt tối ưu',
}

function descendantsOf(id, list) {
  const out = []
  const queue = [id]
  while (queue.length) {
    const cur = queue.shift()
    list.filter((n) => n.parentId === cur).forEach((c) => {
      out.push(c.id)
      queue.push(c.id)
    })
  }
  return out
}

function pathOf(id, byId) {
  const out = []
  let cur = byId[id]
  while (cur) {
    out.unshift(cur)
    cur = cur.parentId ? byId[cur.parentId] : null
  }
  return out
}

function nodeText(n) {
  const sectionsText = n.sections ? n.sections.map((s) => `${s.title} ${s.text}`).join(' ') : ''
  return `${n.title} ${n.detail} ${sectionsText}`
}

// Vị trí node tách riêng khỏi dữ liệu, đúng mẫu team-assistant-sim:
// useNodesState chỉ giữ id/type/position (nhẹ), onNodesChange là setter của hook
// (applyNodeChanges — chỉ cập nhật node đang kéo, giữ nguyên object các node còn lại).
// items chỉ giữ dữ liệu (tiêu đề/chi tiết/sections), nên kéo không làm mới lại
// byId, tìm kiếm, panel phải hay edge — đó là lý do team-assistant kéo mượt.
function edgeStyleFor(kind) {
  return { stroke: kind === 'subtopic' ? '#ffd166' : '#5b6b84', strokeWidth: kind === 'subtopic' ? 2 : 1.5 }
}
function initialFlowEdges() {
  return NODES.filter((n) => n.parentId).map((n) => ({
    id: `e-${n.parentId}-${n.id}`, source: n.parentId, target: n.id, style: edgeStyleFor(n.kind),
  }))
}

// Mặc định: nút gốc mở, các topic đóng — tức các subtopic (nhánh dưới topic)
// luôn ẩn khi mới mở app, chỉ hiện khi bấm +N trên topic (hoặc qua tìm kiếm /
// bấm tên nhánh trong panel phải, lúc đó chỉ mở đúng nhánh cần tới).
// Nút gốc không nằm trong tập này, nên mở app vẫn thấy gốc + 2 topic.
function defaultCollapsed() {
  return new Set(NODES
    .filter((n) => n.parentId && NODES.some((c) => c.parentId === n.id))
    .map((n) => n.id))
}

// Sắp xếp VỊ TRÍ cho đều và đẹp — và chỉ tính CÂY ĐANG THẤY.
// Đây là chỗ sửa lỗi "lúc khởi đầu các nút cận root bị xếp cách xa quá":
// bản cũ tính layout từ toàn bộ cây, kể cả subtopic đang ẩn, nên 2 topic
// phải đứng cách nhau 640px để chừa chỗ cho 8 subtopic ẩn phía sau.
// Bản này: node đang đóng được tính như 1 lá (không giữ chỗ cho con ẩn),
// nên lúc khởi đầu chỉ thấy gốc + 2 topic xích lại gần nhau (cách nhau
// 150px, gốc nằm giữa); mở 1 topic thì cây tự giãn ra vừa đủ chỗ cho
// subtopic của nó, thu lại thì cây tự co lại. Node cha luôn nằm chính
// giữa các con đang thấy của nó (tính theo tâm node, cao gốc 72 /
// topic 64 / subtopic 56), cột x giữ nguyên: gốc 10, topic 380, subtopic 750.
// Chỉ trả về vị trí của node đang thấy; node ẩn giữ nguyên vị trí cũ
// (không nhìn thấy, lần mở sau layout sẽ tính lại cho nó).
function layoutPositions(list, collapsedSet) {
  const HEIGHT = { root: 72, topic: 64, subtopic: 56 }
  const LEAF_PITCH = 150
  const GROUP_GAP = 40
  const kidsOf = (id) => list.filter((n) => n.parentId === id)
  const pos = {}
  let cursor = 0
  const walk = (node, depth) => {
    const kids = collapsedSet.has(node.id) ? [] : kidsOf(node.id)
    const x = 10 + depth * 370
    if (!kids.length) {
      pos[node.id] = { x, y: cursor }
      cursor += LEAF_PITCH
      const center = pos[node.id].y + (HEIGHT[node.kind] || 56) / 2
      return { first: center, last: center, leafCount: 1 }
    }
    let first = null
    let last = null
    let leafCount = 0
    kids.forEach((kid, i) => {
      const range = walk(kid, depth + 1)
      if (first === null) first = range.first
      last = range.last
      leafCount += range.leafCount
      if (node.kind === 'root' && range.leafCount > 1 && i < kids.length - 1) cursor += GROUP_GAP
    })
    const center = (first + last) / 2
    pos[node.id] = { x, y: center - (HEIGHT[node.kind] || 56) / 2 }
    return { first, last, leafCount }
  }
  list.filter((n) => !n.parentId).forEach((root) => walk(root, 0))
  return pos
}

// Vị trí lúc khởi đầu: chỉ tính cây đang thấy với topic đóng mặc định
// => gốc (10, 71), topic Tailscale (380, 0), topic Render (380, 150).
const START_POS = layoutPositions(NODES, defaultCollapsed())
function initialFlowNodes() {
  return NODES.map((n) => ({ id: n.id, type: n.kind, position: START_POS[n.id] || n.position, data: {} }))
}

export default function App() {
  const [items, setItems] = useState(() => NODES.map((n) => (START_POS[n.id] ? { ...n, position: START_POS[n.id] } : n)))
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const [selectedId, setSelectedId] = useState('root')
  const [multiSelected, setMultiSelected] = useState(new Set())
  const [draft, setDraft] = useState(DRAFT_PROPOSAL)
  const [draftState, setDraftState] = useState('pending') // pending | approved | dismissed
  const [showSettings, setShowSettings] = useState(false)
  const [query, setQuery] = useState('')
  const rfRef = useRef(null)
  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState(initialFlowNodes())
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState(initialFlowEdges())

  const byId = useMemo(() => Object.fromEntries(items.map((n) => [n.id, n])), [items])
  const childrenOf = useCallback((id) => items.filter((n) => n.parentId === id), [items])

  // Đóng hộp thoại Cài đặt bằng phím Esc.
  useEffect(() => {
    if (!showSettings) return undefined
    const onKey = (e) => { if (e.key === 'Escape') setShowSettings(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showSettings])

  // Áp vị trí layout vào cả items lẫn flowNodes (effect items->flowNodes
  // giữ nguyên vị trí flow cũ nên phải cập nhật cả 2, như kéo thả).
  // fit=true thì vừa khung hình sau 50ms, như mẫu team-assistant-sim.
  const applyPositions = useCallback((pos, fit = false) => {
    setItems((prev) => prev.map((n) => (pos[n.id] ? { ...n, position: pos[n.id] } : n)))
    setFlowNodes((prev) => prev.map((n) => (pos[n.id] ? { ...n, position: pos[n.id] } : n)))
    if (fit) setTimeout(() => rfRef.current?.fitView({ padding: 0.15 }), 50)
  }, [])

  // Mở/thu 1 nhánh: đổi tập đóng rồi sắp lại cây đang thấy ngay trong
  // cùng lần bấm, để nhánh vừa mở có đủ chỗ và nhánh vừa thu không để
  // lại khoảng trống. Vị trí kéo tay (nếu có) sẽ được sắp lại cho đều
  // trong lần mở/thu này — đó là đánh đổi của layout tự động.
  const toggle = useCallback((id) => {
    const next = new Set(collapsed)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setCollapsed(next)
    applyPositions(layoutPositions(items, next))
  }, [collapsed, items, applyPositions])

  const hidden = useMemo(() => {
    const s = new Set()
    collapsed.forEach((id) => descendantsOf(id, items).forEach((d) => s.add(d)))
    return s
  }, [collapsed, items])

  const visibleItems = useMemo(() => items.filter((n) => !hidden.has(n.id)), [items, hidden])

  // Đồng bộ items -> flowNodes/flowEdges khi dữ liệu đổi (gộp node, duyệt draft,
  // đặt lại bản mẫu): bỏ node/edge đã xóa, thêm node mới, giữ nguyên vị trí
  // đang kéo của các node còn lại. Không chạy khi kéo (items không đổi lúc kéo).
  useEffect(() => {
    setFlowNodes((prev) => {
      const prevById = Object.fromEntries(prev.map((n) => [n.id, n]))
      return items.map((item) => {
        const old = prevById[item.id]
        return old
          ? { ...old, type: item.kind }
          : { id: item.id, type: item.kind, position: item.position, data: {} }
      })
    })
    setFlowEdges(items
      .filter((n) => n.parentId)
      .map((n) => ({
        id: `e-${n.parentId}-${n.id}`, source: n.parentId, target: n.id, style: edgeStyleFor(n.kind),
      })))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  // Kéo thả node: chỉ lưu vị trí cuối về items khi thả chuột (để gộp xếp theo
  // vị trí và để vị trí không mất khi dữ liệu đổi). Trong lúc kéo, vị trí sống
  // trong flowNodes, items không đổi nên không re-render toàn app.
  const handleNodeDragStop = useCallback((_e, node) => {
    if (!node?.position) return
    setItems((prev) => prev.map((n) => (n.id === node.id ? { ...n, position: node.position } : n)))
  }, [])

  // Nodes hiển thị: vị trí từ flowNodes, dữ liệu tươi từ items (như team-assistant-sim).
  const nodes = useMemo(() => flowNodes
    .filter((fn) => !hidden.has(fn.id))
    .map((fn) => {
      const n = byId[fn.id]
      if (!n) return fn
      return {
        ...fn,
        type: n.kind,
        data: {
          id: n.id,
          title: n.title,
          subtitle: SUBTITLE[n.kind],
          selected: selectedId === n.id,
          multiSelected: multiSelected.has(n.id),
          merged: !!n.sections,
          sectionCount: n.sections ? n.sections.length : 0,
          childCount: childrenOf(n.id).length,
          collapsed: collapsed.has(n.id),
          onToggle: toggle,
        },
      }
    }), [flowNodes, byId, hidden, selectedId, multiSelected, childrenOf, collapsed, toggle])

  const edges = useMemo(() => flowEdges
    .filter((e) => !hidden.has(e.target) && !hidden.has(e.source)), [flowEdges, hidden])

  const selected = byId[selectedId] || byId.root
  const selPath = selected ? pathOf(selected.id, byId) : []
  // Nhánh dưới xếp theo vị trí trên canvas (trên xuống dưới), khớp thứ tự nhìn thấy.
  const selChildren = selected
    ? [...childrenOf(selected.id)].sort((a, b) => a.position.y - b.position.y || a.position.x - b.position.x)
    : []

  // Chọn node từ panel phải / tìm kiếm: mở luôn các nhánh cha trên đường tới node,
  // các nhánh khác vẫn giữ trạng thái đóng mặc định. Chỉ sắp lại khi tập đóng
  // thật sự đổi (tức có nhánh vừa mở ra) — bấm tên 1 node đang thấy thì cây
  // giữ nguyên vị trí, không sắp lại vô cớ.
  const selectAndReveal = useCallback((id) => {
    setSelectedId(id)
    const p = pathOf(id, byId)
    if (!p.length) return
    const next = new Set(collapsed)
    p.forEach((n) => next.delete(n.id))
    if (next.size === collapsed.size && [...next].every((x) => collapsed.has(x))) return
    setCollapsed(next)
    applyPositions(layoutPositions(items, next))
  }, [byId, collapsed, items, applyPositions])

  // Nút ▦: sắp lại cây ĐANG THẤY (topic đóng thì không tính con ẩn),
  // xong tự vừa khung hình. Tính lại từ cây đang có nên vẫn đúng sau
  // khi kéo lệch, sau khi gộp (lá ít đi thì các lá còn lại tự dồn đều lại).
  const applyLayout = useCallback(() => {
    applyPositions(layoutPositions(items, collapsed), true)
  }, [items, collapsed, applyPositions])

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return items.filter((n) => nodeText(n).toLowerCase().includes(q))
  }, [query, items])

  // Chọn nhiều subtopic: Ctrl / Cmd / Shift + Click để thêm / bỏ 1 node khỏi nhóm chọn.
  // Không còn kéo khung chọn trên nền — nền dùng để pan, đúng mẫu team-assistant-sim.
  const handleNodeClick = useCallback((_e, node) => {
    const item = byId[node.id]
    if (!item) return
    if ((_e.ctrlKey || _e.metaKey || _e.shiftKey) && item.kind === 'subtopic') {
      setMultiSelected((prev) => {
        const next = new Set(prev)
        if (next.has(node.id)) next.delete(node.id)
        else next.add(node.id)
        return next
      })
      setSelectedId(node.id)
      return
    }
    setSelectedId(node.id)
    setMultiSelected(new Set())
  }, [byId])

  // Gộp: xếp theo vị trí trên canvas (trên xuống dưới), node đầu tiên giữ tiêu đề + vị trí.
  const selectedSubtopics = useMemo(() => {
    const list = items.filter((n) => multiSelected.has(n.id))
    return [...list].sort((a, b) => a.position.y - b.position.y || a.position.x - b.position.x)
  }, [items, multiSelected])
  const canMerge = selectedSubtopics.length >= 2
    && selectedSubtopics.every((n) => n.parentId === selectedSubtopics[0].parentId)

  const mergeSelected = () => {
    if (!canMerge) return
    const [first, ...rest] = selectedSubtopics
    const sections = selectedSubtopics.map((n) => ({
      title: n.title,
      text: n.sections ? n.sections.map((s) => s.text).join(' ') : n.detail,
    }))
    const merged = {
      ...first,
      title: first.title,
      detail: sections.map((s) => `${s.title}: ${s.text}`).join(' '),
      sections,
      source: `${first.source} · gộp từ ${selectedSubtopics.length} subtopic`,
    }
    const restIds = new Set(rest.map((n) => n.id))
    const newItems = items.map((n) => (n.id === first.id ? merged : n)).filter((n) => !restIds.has(n.id))
    const pos = layoutPositions(newItems, collapsed)
    setItems(newItems.map((n) => (pos[n.id] ? { ...n, position: pos[n.id] } : n)))
    setFlowNodes((prev) => prev.filter((n) => !restIds.has(n.id)).map((n) => (pos[n.id] ? { ...n, position: pos[n.id] } : n)))
    setMultiSelected(new Set())
    setSelectedId(first.id)
  }

  const approveDraft = () => {
    if (draftState !== 'pending' || !draft) return
    setItems((prev) => {
      const target = prev.find((n) => n.id === draft.targetId)
        || prev.find((n) => n.sections?.some((s) => s.title === draft.targetTitle))
      if (!target) return prev
      if (target.sections) {
        return prev.map((n) => (n.id === target.id ? {
          ...n,
          sections: n.sections.map((s) => (s.title === draft.targetTitle ? { ...s, text: `${s.text}${draft.appendText}` } : s)),
          detail: `${n.detail}${draft.appendText}`,
        } : n))
      }
      return prev.map((n) => (n.id === target.id ? { ...n, detail: `${n.detail}${draft.appendText}` } : n))
    })
    setDraftState('approved')
    const targetNode = items.find((n) => n.id === draft.targetId)
      || items.find((n) => n.sections?.some((s) => s.title === draft.targetTitle))
    if (targetNode) setSelectedId(targetNode.id)
  }

  const dismissDraft = () => setDraftState('dismissed')
  const resetDraft = () => {
    setItems(NODES.map((n) => (START_POS[n.id] ? { ...n, position: START_POS[n.id] } : n)))
    setFlowNodes(initialFlowNodes())
    setFlowEdges(initialFlowEdges())
    setDraftState('pending')
    setSelectedId('root')
    setMultiSelected(new Set())
    setCollapsed(defaultCollapsed())
  }
  const expandAll = () => {
    const next = new Set()
    setCollapsed(next)
    applyPositions(layoutPositions(items, next), true)
  }
  const collapseAll = () => {
    const next = new Set(items.filter((n) => childrenOf(n.id).length > 0).map((n) => n.id))
    setCollapsed(next)
    applyPositions(layoutPositions(items, next), true)
  }

  return (
    <div className="qm-app">
      <header className="qm-topbar">
        <div>
          <h1>🧠 QA Mindmap — Lưu hỏi đáp thành mindmap</h1>
          <p className="sub">Chỉ ghi khi bạn yêu cầu · Đưa bản tóm tắt duyệt trước · Trùng lắp thì gộp vào subtopic đã có, tối đa {MAX_SUBTOPICS_PER_TOPIC} nhánh</p>
        </div>
        <div className="qm-map-picker">
          <label>Mindmap:</label>
          <select value={MAPS[0].id} onChange={() => {}}>
            {MAPS.map((m) => <option key={m.id} value={m.id}>{m.title} — {m.date}</option>)}
          </select>
        </div>
      </header>

      <div className="qm-toolbar">
        <span className="qm-count">{items.length} node · 1 nút gốc · {items.filter((n) => n.kind === 'topic').length} topic · {items.filter((n) => n.kind === 'subtopic').length} subtopic (tối đa {MAX_SUBTOPICS_PER_TOPIC}/topic)</span>
        <div className="qm-search">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm trong cây, ví dụ: free, macOS…"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchResults[0]) {
                selectAndReveal(searchResults[0].id)
              }
            }}
          />
          {query.trim() && (
            <span className="qm-search-result">
              {searchResults.length === 0 ? 'Không thấy' : `${searchResults.length} kết quả — Enter để tới node đầu tiên`}
            </span>
          )}
        </div>
        <button type="button" className="icon-btn" title="Mở hết" aria-label="Mở hết" onClick={expandAll}>＋</button>
        <button type="button" className="icon-btn" title="Thu hết" aria-label="Thu hết" onClick={collapseAll}>－</button>
        <button type="button" className="icon-btn" title="Sắp xếp lại vị trí cho đều và đẹp" aria-label="Sắp xếp lại vị trí cho đều và đẹp" onClick={applyLayout}>▦</button>
        <button type="button" className="icon-btn" title="Vừa khung hình" aria-label="Vừa khung hình" onClick={() => rfRef.current?.fitView({ padding: 0.15 })}>⤢</button>
        <button type="button" className="icon-btn ghost" title="Đặt lại bản mẫu" aria-label="Đặt lại bản mẫu" onClick={resetDraft}>↺</button>
        <button type="button" className="icon-btn" title="Cài đặt hệ thống — Quy tắc đã chốt" aria-label="Cài đặt hệ thống — Quy tắc đã chốt" onClick={() => setShowSettings((v) => !v)}>⚙️</button>
      </div>

      <main className="qm-layout">
        <div className="qm-canvas-wrap">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            onNodeDragStop={handleNodeDragStop}
            // Đúng mẫu team-assistant-sim (mặc định của React Flow):
            // kéo nền là pan, bấm node là chọn, không khoanh chọn.
            panOnDrag
            selectionOnDrag={false}
            nodesDraggable
            onInit={(inst) => { rfRef.current = inst }}
            fitView
            fitViewOptions={{ padding: 0.15 }}
            minZoom={0.3}
            maxZoom={1.6}
            colorMode="dark"
            proOptions={{ hideAttribution: true }}
          >
            <Background gap={22} size={1.5} />
            <Controls />
            <MiniMap pannable zoomable nodeColor={(n) => (n.type === 'root' ? '#ffd166' : n.type === 'subtopic' ? '#ffb27d' : '#8ab8ff')} />
          </ReactFlow>
          <div className="qm-hint">Kéo nền để di chuyển cả hình · lăn chuột để zoom · bấm node để xem chi tiết · kéo thân node để di chuyển vị trí · bấm ▦ trên thanh công cụ để sắp xếp lại vị trí cho đều và đẹp · Ctrl / Shift+Click để chọn nhiều subtopic rồi gộp</div>
        </div>

        <aside className="qm-panel-col">
          {multiSelected.size > 0 && (
            <section className="panel merge-panel">
              <h2>⧉ Gộp subtopic — đã chọn {multiSelected.size}</h2>
              <p className="qm-detail">{selectedSubtopics.map((n) => n.title).join(' + ')}</p>
              <div className="actions">
                <button type="button" className="icon-btn primary" title="Gộp thành 1 node" aria-label="Gộp thành 1 node" disabled={!canMerge} onClick={mergeSelected}>⧉</button>
                <button type="button" className="icon-btn" title="Bỏ chọn" aria-label="Bỏ chọn" onClick={() => setMultiSelected(new Set())}>✕</button>
              </div>
              {selectedSubtopics.length === 1 && <p className="hint">Chọn thêm 1 subtopic nữa bằng Ctrl+Click để gộp.</p>}
              {selectedSubtopics.length >= 2 && !canMerge && <p className="hint">Chỉ gộp được các subtopic cùng 1 topic.</p>}
              {canMerge && <p className="hint">Tiêu đề node gộp lấy node đầu tiên ({selectedSubtopics[0].title}), chi tiết chia thành {selectedSubtopics.length} section theo từng node gốc.</p>}
            </section>
          )}
          <section className="panel draft-panel">
            <h2>✍️ Bản tóm tắt chờ duyệt — demo luồng ghi nhận</h2>
            {draftState === 'pending' && draft && (
              <>
                <p className="hint">Muse đề xuất trước khi ghi. Bạn duyệt thì mới ghi vào cây.</p>
                <div className="draft-box">
                  <p><strong>Mindmap:</strong> {draft.map}</p>
                  <p><strong>Gộp vào:</strong> {draft.targetTitle} <span className="tag">gộp vào chi tiết</span></p>
                  <p><strong>Tiêu đề:</strong> {draft.title}</p>
                  <p><strong>Chi tiết thêm:</strong> {draft.detail}</p>
                  <p className="hint">Lý do: {draft.reason}</p>
                </div>
                <div className="actions">
                  <button type="button" className="icon-btn primary" title="Duyệt và gộp vào subtopic" aria-label="Duyệt và gộp vào subtopic" onClick={approveDraft}>✓</button>
                  <button type="button" className="icon-btn" title="Không ghi" aria-label="Không ghi" onClick={dismissDraft}>✕</button>
                </div>
              </>
            )}
            {draftState === 'approved' && (
              <p>✓ Đã gộp <strong>“Starter $6/user/tháng”</strong> vào chi tiết subtopic <strong>“Giá”</strong>. Số node không đổi, vẫn 4 subtopic. Bấm “Đặt lại bản mẫu” ở thanh trên để chạy lại demo.</p>
            )}
            {draftState === 'dismissed' && (
              <p>Đã bỏ bản tóm tắt này, cây không đổi. Bấm “Đặt lại bản mẫu” để chạy lại demo.</p>
            )}
          </section>

          {selected && (
            <section className="panel">
              <h2>📌 {selected.title}</h2>
              <p className="qm-path">{selPath.map((n) => n.title).join(' › ')}</p>
              {selected.sections ? (
                <>
                  <p className="hint">Node gộp từ {selected.sections.length} subtopic · Tiêu đề lấy node đầu tiên.</p>
                  {selected.sections.map((s, i) => (
                    <div key={i} className="qm-section">
                      <h3>Section {i + 1}: {s.title}</h3>
                      <p className="qm-detail">{s.text}</p>
                    </div>
                  ))}
                </>
              ) : (
                <p className="qm-detail">{selected.detail}</p>
              )}
              <p className="qm-meta">Ghi ngày {selected.date} · Nguồn: {selected.source}</p>
              {selChildren.length > 0 && (
                <>
                  <h3>Nhánh dưới ({selChildren.length})</h3>
                  <ul className="qm-children">
                    {selChildren.map((c) => (
                      <li key={c.id}>
                        <button type="button" className="linklike" onClick={() => selectAndReveal(c.id)}>{c.title}</button>
                        <small>{(c.sections ? c.sections.map((s) => s.text).join(' ') : c.detail).slice(0, 80)}…</small>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {selected.parentId && (
                <p className="hint">Node cha: <button type="button" className="linklike" onClick={() => setSelectedId(selected.parentId)}>{byId[selected.parentId]?.title}</button></p>
              )}
            </section>
          )}

        </aside>
      </main>

      {showSettings && (
        <div className="qm-modal-backdrop" onClick={() => setShowSettings(false)}>
          <div className="qm-modal" role="dialog" aria-modal="true" aria-label="Cài đặt hệ thống" onClick={(e) => e.stopPropagation()}>
            <div className="qm-modal-head">
              <h2>⚙️ Cài đặt hệ thống</h2>
              <button type="button" className="icon-btn" title="Đóng Cài đặt" aria-label="Đóng Cài đặt" onClick={() => setShowSettings(false)}>✕</button>
            </div>
            <p className="hint">Các quy tắc này là quy ước của app, không phải dữ liệu node — đưa vào đây để panel phải chỉ còn chi tiết node đang chọn, gọn hơn. Bấm ra ngoài hoặc phím Esc để đóng.</p>
            <h3>📋 Quy tắc đã chốt — 28-10-2026</h3>
            <ul className="qm-rules">
              <li>Chỉ ghi khi bạn yêu cầu ghi nhận, không tự ghi mọi câu hỏi đáp.</li>
              <li>Node đơn giản: tiêu đề là chủ đề tóm tắt, chi tiết là câu trả lời tóm tắt.</li>
              <li>Đưa bản tóm tắt cho bạn duyệt trước khi ghi.</li>
              <li>Chủ đề trùng lắp thì gộp vào chi tiết của subtopic đã có, không tạo node mới, giữ tối đa {MAX_SUBTOPICS_PER_TOPIC} nhánh.</li>
              <li>Chọn nhiều subtopic bằng Ctrl / Shift+Click (Cmd+Click trên Mac), rồi bấm ⧉ trong panel “Gộp subtopic” ở đầu cột phải để gộp thành 1 node: tiêu đề lấy node đầu tiên, chi tiết chia thành từng section theo node gốc. Panel gộp nằm ở cột phải nên khi nó hiện ra, khung hình bên trái không bị đẩy xuống.</li>
              <li>Kéo nền để di chuyển cả hình, bấm node để xem chi tiết — đúng kiểu team-assistant-sim, không còn chế độ khoanh chọn trên nền.</li>
              <li>Kéo thân node để di chuyển vị trí, vị trí mới được giữ trong phiên này.</li>
              <li>Mặc định các topic đóng, subtopic ẩn: mở app chỉ thấy nút gốc + các topic, bấm +N trên topic để mở nhánh. Nút ＋ / － trên thanh công cụ vẫn mở / thu toàn bộ, tìm kiếm hoặc bấm tên nhánh trong panel phải chỉ mở đúng nhánh cần tới.</li>
              <li>Sắp xếp vị trí (không phải đổi thứ tự câu hỏi): layout chỉ tính cây đang thấy — topic đóng thì không giữ chỗ cho con ẩn, nên lúc mở app gốc + 2 topic xích lại gần nhau, gốc nằm giữa; mở 1 topic thì cây tự giãn ra vừa đủ chỗ cho subtopic của nó, thu lại thì tự co lại. Kéo lệch rồi thì bấm ▦ trên thanh công cụ để tính lại cây đang thấy cho đều và đẹp, xong tự vừa khung hình. Mở/thu nhánh sẽ sắp lại cây, vị trí kéo tay lúc đó được sắp lại cho đều.</li>
              <li>Các nút thao tác đều dạng icon, nhãn đầy đủ nằm trong title + aria-label (rê chuột vào nút để xem).</li>
            </ul>
          </div>
        </div>
      )}

      <footer className="qm-foot">
        Bản mẫu — gốc Muse Q&amp;A → 2 topic (Tailscale, Render ngoại thất SketchUp), mỗi topic tối đa {MAX_SUBTOPICS_PER_TOPIC} subtopic, dữ liệu 28 và 29-10-2026, chưa có thêm / sửa / xóa thật, chưa lưu bền. Bản quản lý thật sẽ thêm form thêm node, sửa, xóa và lưu localStorage + xuất / nhập JSON.
      </footer>
    </div>
  )
}
