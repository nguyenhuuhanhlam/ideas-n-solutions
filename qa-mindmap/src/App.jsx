import { useCallback, useMemo, useRef, useState } from 'react'
import {
  Background, Controls, MiniMap, ReactFlow, useEdgesState, useNodesState,
} from '@xyflow/react'
import { DRAFT_PROPOSAL, MAPS, NODES } from './data.js'
import { nodeTypes } from './nodes.jsx'

const SUBTITLE = {
  root: 'Nút gốc · 28-10-2026',
  topic: 'Topic · tối đa 4 subtopic',
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

export default function App() {
  const [items, setItems] = useState(NODES)
  const [collapsed, setCollapsed] = useState(new Set())
  const [selectedId, setSelectedId] = useState('root')
  const [draft, setDraft] = useState(DRAFT_PROPOSAL)
  const [draftState, setDraftState] = useState('pending') // pending | approved | dismissed
  const [query, setQuery] = useState('')
  const rfRef = useRef(null)

  const byId = useMemo(() => Object.fromEntries(items.map((n) => [n.id, n])), [items])
  const childrenOf = useCallback((id) => items.filter((n) => n.parentId === id), [items])

  const toggle = useCallback((id) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const hidden = useMemo(() => {
    const s = new Set()
    collapsed.forEach((id) => descendantsOf(id, items).forEach((d) => s.add(d)))
    return s
  }, [collapsed, items])

  const visibleItems = useMemo(() => items.filter((n) => !hidden.has(n.id)), [items, hidden])

  const [baseNodes, , onNodesChange] = useNodesState([])
  const [baseEdges, , onEdgesChange] = useEdgesState([])

  const nodes = useMemo(() => visibleItems.map((n) => ({
    id: n.id,
    type: n.kind,
    position: n.position,
    data: {
      id: n.id,
      title: n.title,
      subtitle: SUBTITLE[n.kind],
      selected: selectedId === n.id,
      childCount: childrenOf(n.id).length,
      collapsed: collapsed.has(n.id),
      onToggle: toggle,
    },
  })), [visibleItems, selectedId, childrenOf, collapsed, toggle])

  const edges = useMemo(() => visibleItems
    .filter((n) => n.parentId && !hidden.has(n.parentId))
    .map((n) => ({
      id: `e-${n.parentId}-${n.id}`,
      source: n.parentId,
      target: n.id,
      style: { stroke: n.kind === 'subtopic' ? '#ffd166' : '#5b6b84', strokeWidth: n.kind === 'subtopic' ? 2 : 1.5 },
    })), [visibleItems, hidden])

  const selected = byId[selectedId] || byId.root
  const selPath = selected ? pathOf(selected.id, byId) : []
  const selChildren = selected ? childrenOf(selected.id) : []

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return items.filter((n) => `${n.title} ${n.detail}`.toLowerCase().includes(q))
  }, [query, items])

  const approveDraft = () => {
    if (draftState !== 'pending' || !draft) return
    // Gộp vào chi tiết của subtopic đã có, không tạo node mới — giữ tối đa 4 nhánh.
    setItems((prev) => prev.map((n) => (n.id === draft.targetId
      ? { ...n, detail: `${n.detail}${draft.appendText}` }
      : n)))
    setDraftState('approved')
    setSelectedId(draft.targetId)
  }

  const dismissDraft = () => setDraftState('dismissed')
  const resetDraft = () => {
    setItems(NODES)
    setDraftState('pending')
    setSelectedId('root')
    setCollapsed(new Set())
  }
  const expandAll = () => setCollapsed(new Set())
  const collapseAll = () => setCollapsed(new Set(items.filter((n) => childrenOf(n.id).length > 0).map((n) => n.id)))

  return (
    <div className="qm-app">
      <header className="qm-topbar">
        <div>
          <h1>🧠 QA Mindmap — Lưu hỏi đáp thành mindmap</h1>
          <p className="sub">Chỉ ghi khi bạn yêu cầu · Đưa bản tóm tắt duyệt trước · Trùng lắp thì gộp vào subtopic đã có, tối đa 4 nhánh</p>
        </div>
        <div className="qm-map-picker">
          <label>Mindmap:</label>
          <select value={MAPS[0].id} onChange={() => {}}>
            {MAPS.map((m) => <option key={m.id} value={m.id}>{m.title} — {m.date}</option>)}
          </select>
        </div>
      </header>

      <div className="qm-toolbar">
        <span className="qm-count">{items.length} node · 1 nút gốc · {items.filter((n) => n.kind === 'topic').length} topic · {items.filter((n) => n.kind === 'subtopic').length} subtopic (tối đa 4)</span>
        <div className="qm-search">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm trong cây, ví dụ: free, macOS…"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchResults[0]) {
                setSelectedId(searchResults[0].id)
                setCollapsed(new Set())
              }
            }}
          />
          {query.trim() && (
            <span className="qm-search-result">
              {searchResults.length === 0 ? 'Không thấy' : `${searchResults.length} kết quả — Enter để tới node đầu tiên`}
            </span>
          )}
        </div>
        <button type="button" onClick={expandAll}>Mở hết</button>
        <button type="button" onClick={collapseAll}>Thu hết</button>
        <button type="button" onClick={() => rfRef.current?.fitView({ padding: 0.15 })}>⤢ Vừa khung hình</button>
        <button type="button" className="ghost" onClick={resetDraft}>↺ Đặt lại bản mẫu</button>
      </div>

      <main className="qm-layout">
        <div className="qm-canvas-wrap">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={(_e, node) => setSelectedId(node.id)}
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
          <div className="qm-hint">Bấm 1 node để xem chi tiết ở panel phải · Nút +N / − trên node để thu / mở nhánh con · Kéo thả để di chuyển, lăn chuột để zoom</div>
        </div>

        <aside className="qm-panel-col">
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
                  <button type="button" className="primary" onClick={approveDraft}>✓ Duyệt và gộp vào subtopic</button>
                  <button type="button" onClick={dismissDraft}>Không ghi</button>
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
              <p className="qm-detail">{selected.detail}</p>
              <p className="qm-meta">Ghi ngày {selected.date} · Nguồn: {selected.source}</p>
              {selChildren.length > 0 && (
                <>
                  <h3>Nhánh dưới ({selChildren.length})</h3>
                  <ul className="qm-children">
                    {selChildren.map((c) => (
                      <li key={c.id}>
                        <button type="button" className="linklike" onClick={() => setSelectedId(c.id)}>{c.title}</button>
                        <small>{c.detail.slice(0, 80)}…</small>
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

          <section className="panel">
            <h2>📋 Quy tắc đã chốt — 28-10-2026</h2>
            <ul className="qm-rules">
              <li>Chỉ ghi khi bạn yêu cầu ghi nhận, không tự ghi mọi câu hỏi đáp.</li>
              <li>Node đơn giản: tiêu đề là chủ đề tóm tắt, chi tiết là câu trả lời tóm tắt.</li>
              <li>Đưa bản tóm tắt cho bạn duyệt trước khi ghi.</li>
              <li>Chủ đề trùng lắp thì gộp vào chi tiết của subtopic đã có, không tạo node mới, giữ tối đa 4 nhánh.</li>
            </ul>
          </section>
        </aside>
      </main>

      <footer className="qm-foot">
        Bản mẫu — gốc Muse Q&amp;A → topic Tailscale → 4 subtopic, dữ liệu ngày 28-10-2026, chưa có thêm / sửa / xóa thật, chưa lưu bền. Bản quản lý thật sẽ thêm form thêm node, sửa, xóa và lưu localStorage + xuất / nhập JSON.
      </footer>
    </div>
  )
}
