import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { loadLibrary, saveLibrary, relayoutRootVisible, resetLibrary, loadSettings, saveSettings } from './data/store'
import { templateTrees, collapseTopLevel } from './data/seed'
import { diffLibraries, diffIsEmpty } from './lib/syncdiff'
import { DELETE_ROOT_CODE } from './lib/security'
import { MARK_OPTIONS, markHex } from './lib/marks'
import {
  nodeSize, childrenOf, visibleNodes, subtreeIds, hiddenCount,
  treeBounds, placeholders, fillPlaceholders, foldText, LEVEL_GAP_X, NODE_GAP_Y,
  flattenVisible,
} from './lib/geometry'

const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36)
const SPRITE = `${import.meta.env.BASE_URL}icons/lucide-sprite.svg`
export const Icon = ({ name }) => (
  <svg className="hl-icon"><use href={`${SPRITE}#hl-${name}`} /></svg>
)

function ancestorsOf(nodes, node) {
  const byId = new Map(nodes.map((x) => [x.id, x]))
  const chain = []
  let cur = node
  while (cur) { chain.unshift(cur); cur = cur.parentId ? byId.get(cur.parentId) : null }
  return chain
}

export default function App() {
  const [libUi, setLibUi] = useState(() => {
    const loaded = loadLibrary()
    // Khi mở trang: nếu tuỳ chọn tự sắp xếp đang bật, cây phải ở dạng đã
    // sắp gọn ngay từ đầu (không hiện vị trí kéo tay còn lưu từ phiên trước)
    if (loadSettings().autoLayoutOnToggle) {
      let arranged = loaded
      for (const r of loaded.roots) arranged = relayoutRootVisible(arranged, r.id)
      saveLibrary(arranged)
      return arranged
    }
    return loaded
  })
  const libRef = useRef(libUi)
  const [activeRootId, setActiveRootId] = useState(libUi.roots[0]?.id)
  const activeRootRef = useRef(activeRootId)
  const [selectedId, setSelectedId] = useState(null)
  const selectedRef = useRef(null)
  const highlightRef = useRef(null)
  const [highlightId, setHighlightId] = useState(null)
  const [zoomPct, setZoomPct] = useState(100)
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState('')
  const [fillReq, setFillReq] = useState(null) // { node, values }
  const [newRootTitle, setNewRootTitle] = useState('')
  const [settings, setSettings] = useState(() => loadSettings())
  const settingsRef = useRef(settings)
  const [user, setUser] = useState(null)
  const userRef = useRef(null)
  const [syncState, setSyncState] = useState('local') // local | syncing | synced | error
  const [syncMsg, setSyncMsg] = useState('')
  const fbRef = useRef(null)
  const cloudBaseRef = useRef(null) // trạng thái mây gần nhất đã biết
  const cloudReadyRef = useRef(false)
  const pushChainRef = useRef(Promise.resolve())
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 820px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 820px)')
    const on = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  const [rootDelReq, setRootDelReq] = useState(null)
  const [delCode, setDelCode] = useState('')
  const [delCodeErr, setDelCodeErr] = useState('')

  const updateSettings = (patch) => {
    const next = { ...settings, ...patch }
    settingsRef.current = next
    setSettings(next)
    saveSettings(next)
  }

  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const cameraRef = useRef({ x: 24, y: 24, k: 1 })
  const dragRef = useRef(null)
  const toastTimer = useRef(null)

  const activeNodes = useMemo(
    () => libUi.nodes.filter((x) => x.rootId === activeRootId),
    [libUi, activeRootId],
  )
  const selected = useMemo(
    () => libUi.nodes.find((x) => x.id === selectedId && x.rootId === activeRootId) || null,
    [libUi, selectedId, activeRootId],
  )

  const showToast = useCallback((msg) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 1800)
  }, [])

  const schedulePush = useCallback((next) => {
    const fb = fbRef.current
    const u = userRef.current
    if (!fb || !u || !cloudReadyRef.current) return
    setSyncState('syncing')
    pushChainRef.current = pushChainRef.current.then(async () => {
      try {
        await fb.pushDiff(u.uid, cloudBaseRef.current, next)
        cloudBaseRef.current = next
        setSyncState('synced')
      } catch (e) {
        setSyncState('error')
        setSyncMsg(fb.syncErrorText(e))
      }
    })
  }, [])

  const commit = useCallback((next) => {
    libRef.current = next
    setLibUi(next)
    saveLibrary(next)
    schedulePush(next)
  }, [schedulePush])

  // ---------- Vẽ canvas ----------
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const W = canvas.clientWidth, H = canvas.clientHeight
    if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
      canvas.width = W * dpr; canvas.height = H * dpr
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    // Palette Hairline: sáng/tối theo hệ thống, khớp token CSS của kit
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const P = dark
      ? { bg: '#0b0b0c', fg: '#ededed', muted: '#8a8a8f', line: '#26262a', hover: '#131315', accent: '#60a5fa', red: '#f87171', dot: '#1d1d20', edge: '#3f3f45' }
      : { bg: '#ffffff', fg: '#0a0a0a', muted: '#737373', line: '#e5e5e5', hover: '#fafafa', accent: '#2563eb', red: '#dc2626', dot: '#eeeeee', edge: '#cfcfcf' }
    ctx.fillStyle = P.bg
    ctx.fillRect(0, 0, W, H)
    const cam = cameraRef.current
    // lưới chấm theo tọa độ thế giới
    const step = 28
    const x0 = Math.floor(-cam.x / cam.k / step) * step
    const y0 = Math.floor(-cam.y / cam.k / step) * step
    ctx.fillStyle = P.dot
    for (let gx = x0; gx < x0 + W / cam.k + step; gx += step) {
      for (let gy = y0; gy < y0 + H / cam.k + step; gy += step) {
        ctx.fillRect(gx * cam.k + cam.x, gy * cam.k + cam.y, 2, 2)
      }
    }
    ctx.save()
    ctx.translate(cam.x, cam.y)
    ctx.scale(cam.k, cam.k)

    const nodes = libRef.current.nodes.filter((x) => x.rootId === activeRootRef.current)
    const vis = visibleNodes(nodes)
    const visIds = new Set(vis.map((x) => x.id))
    const byId = new Map(nodes.map((x) => [x.id, x]))

    // cạnh nối: cong bezier, 1px
    ctx.lineWidth = 1 / cam.k + 0.4
    for (const node of vis) {
      if (!node.parentId || !visIds.has(node.parentId)) continue
      const p = byId.get(node.parentId)
      const ps = nodeSize(p), ns = nodeSize(node)
      const sx = p.x + ps.w, sy = p.y + ps.h / 2
      const tx = node.x, ty = node.y + ns.h / 2
      const dx = Math.max(28, Math.abs(tx - sx) / 2)
      ctx.strokeStyle = node.id === selectedRef.current || p.id === selectedRef.current ? P.fg : P.edge
      ctx.beginPath()
      ctx.moveTo(sx, sy)
      ctx.bezierCurveTo(sx + dx, sy, tx - dx, ty, tx, ty)
      ctx.stroke()
    }

    // node
    const viewL = -cam.x / cam.k - 80, viewT = -cam.y / cam.k - 80
    const viewR = viewL + W / cam.k + 160, viewB = viewT + H / cam.k + 160
    for (const node of vis) {
      const { w, h } = nodeSize(node)
      if (node.x + w < viewL || node.x > viewR || node.y + h < viewT || node.y > viewB) continue // culling
      const isRoot = !node.parentId
      const isSel = node.id === selectedRef.current
      const isHi = node.id === highlightRef.current
      ctx.fillStyle = P.bg
      ctx.strokeStyle = isHi ? P.red : isSel ? P.accent : isRoot ? P.fg : P.muted
      ctx.lineWidth = isSel || isRoot || isHi ? 1.8 : 1
      ctx.beginPath()
      ctx.rect(node.x, node.y, w, h)
      ctx.fill(); ctx.stroke()
      if (isRoot) { ctx.fillStyle = P.fg; ctx.fillRect(node.x, node.y, w, 3) }
      // tiêu đề
      ctx.fillStyle = P.fg
      ctx.font = `${isRoot ? 700 : 600} 13px ui-sans-serif, system-ui, sans-serif`
      ctx.textBaseline = 'middle'
      let title = node.title
      while (title.length && ctx.measureText(title).width > w - 40) title = title.slice(0, -1)
      if (title !== node.title) title = title.slice(0, -1) + '…'
      ctx.fillText(title, node.x + 10, node.y + 16)
      // lệnh (mono) — bấm vào vùng này là copy
      if (node.command) {
        ctx.fillStyle = P.hover
        ctx.fillRect(node.x + 1, node.y + 29, w - 2, h - 30)
        ctx.fillStyle = P.fg
        ctx.font = '11.5px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
        let cmd = node.command
        while (cmd.length && ctx.measureText(cmd).width > w - 34) cmd = cmd.slice(0, -1)
        if (cmd !== node.command) cmd = cmd.slice(0, -1) + '…'
        ctx.fillText(cmd, node.x + 10, node.y + 44)
        ctx.fillStyle = P.muted
        ctx.font = '10px system-ui, sans-serif'
        ctx.fillText('⧉', node.x + w - 18, node.y + 44)
      }
      // chấm tròn solid đánh dấu màu (lệnh hay dùng)
      if (node.mark) {
        const hex = markHex(node.mark, dark)
        if (hex) {
          ctx.fillStyle = hex
          ctx.beginPath(); ctx.arc(node.x + w - 12, node.y + 12, 5, 0, Math.PI * 2); ctx.fill()
        }
      }
      // nút thu/mở nhánh
      const kids = childrenOf(nodes, node.id)
      if (kids.length) {
        const bx = node.x + w, by = node.y + h / 2
        ctx.fillStyle = P.bg
        ctx.strokeStyle = P.muted
        ctx.lineWidth = 1
        ctx.beginPath(); ctx.arc(bx, by, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
        ctx.fillStyle = P.fg
        ctx.font = '10px system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(node.collapsed ? `+${hiddenCount(nodes, node.id)}` : '–', bx, by + 0.5)
        ctx.textAlign = 'left'
      }
    }
    ctx.restore()
  }, [])

  // ---------- Camera ----------
  const fitView = useCallback((rootId) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const nodes = visibleNodes(libRef.current.nodes.filter((x) => x.rootId === (rootId || activeRootRef.current)))
    if (!nodes.length) return
    const b = treeBounds(nodes)
    const W = canvas.clientWidth, H = canvas.clientHeight
    const k = Math.min(1.15, Math.max(0.15, Math.min((W - 64) / (b.maxX - b.minX), (H - 64) / (b.maxY - b.minY))))
    cameraRef.current = {
      k,
      x: 32 - b.minX * k + Math.max(0, (W - 64 - (b.maxX - b.minX) * k) / 2),
      y: 32 - b.minY * k + Math.max(0, (H - 64 - (b.maxY - b.minY) * k) / 2),
    }
    setZoomPct(Math.round(k * 100))
    draw()
  }, [draw])

  const centerOn = useCallback((node) => {
    const canvas = canvasRef.current
    if (!canvas || !node) return
    const { w, h } = nodeSize(node)
    const cam = cameraRef.current
    cam.x = canvas.clientWidth / 2 - (node.x + w / 2) * cam.k
    cam.y = canvas.clientHeight / 2 - (node.y + h / 2) * cam.k
    draw()
  }, [draw])

  useEffect(() => { fitView() }, []) // eslint-disable-line

  // Áp dữ liệu từ mây xuống (không đẩy ngược lên): sắp lại nếu tuỳ chọn bật,
  // sửa root đang mở nếu root đó đã biến mất trên mây.
  const applyRemote = useCallback((cloudLib) => {
    let next = cloudLib
    if (settingsRef.current.autoLayoutOnToggle) {
      for (const r of cloudLib.roots) next = relayoutRootVisible(next, r.id)
    }
    libRef.current = next
    setLibUi(next)
    saveLibrary(next)
    if (!next.roots.find((r) => r.id === activeRootRef.current)) {
      if (next.roots[0]) {
        activeRootRef.current = next.roots[0].id
        setActiveRootId(next.roots[0].id)
      }
    }
    requestAnimationFrame(() => fitView())
  }, [fitView])

  useEffect(() => {
    let cancelled = false
    let unsubAuth = null
    let unsubLib = null
    import('./lib/firebase.js').then((fb) => {
      if (cancelled) return
      fbRef.current = fb
      unsubAuth = fb.listenAuth((u) => {
        userRef.current = u
        setUser(u)
        if (unsubLib) { unsubLib(); unsubLib = null }
        cloudReadyRef.current = false
        cloudBaseRef.current = null
        if (!u) { setSyncState('local'); setSyncMsg(''); return }
        setSyncState('syncing')
        unsubLib = fb.subscribeLibrary(u.uid, (cloudLib) => {
          if (!cloudReadyRef.current) {
            cloudReadyRef.current = true
            if (!cloudLib.roots.length && !cloudLib.nodes.length) {
              // Mây còn trống: đẩy dữ liệu local hiện tại lên làm bản chính đầu tiên
              cloudBaseRef.current = { roots: [], nodes: [] }
              schedulePush(libRef.current)
              setSyncState('synced')
              return
            }
            cloudBaseRef.current = cloudLib
            applyRemote(cloudLib)
            setSyncState('synced')
            return
          }
          // Bỏ qua echo của chính lần ghi của mình; chỉ áp thay đổi từ máy khác
          if (cloudBaseRef.current && diffIsEmpty(diffLibraries(cloudBaseRef.current, cloudLib))) {
            cloudBaseRef.current = cloudLib
            return
          }
          cloudBaseRef.current = cloudLib
          applyRemote(cloudLib)
          setSyncState('synced')
        }, (e) => { setSyncState('error'); setSyncMsg(fb.syncErrorText(e)) })
      })
    }).catch(() => { /* không tải được Firebase thì cứ chạy chế độ local */ })
    return () => { cancelled = true; if (unsubAuth) unsubAuth(); if (unsubLib) unsubLib() }
  }, [applyRemote, schedulePush])

  const onSignIn = async () => {
    try {
      if (!fbRef.current) fbRef.current = await import('./lib/firebase.js')
      await fbRef.current.signInWithGoogle()
    } catch (e) {
      showToast(fbRef.current?.syncErrorText(e) || 'Không đăng nhập được — thử lại sau.')
    }
  }

  const onSignOut = async () => {
    try { await fbRef.current?.signOutUser() } catch { /* bỏ qua */ }
  }
  useEffect(() => { window.__cmdmap = { cameraRef, libRef } }, [])
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => draw()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [draw])
  useEffect(() => {
    const ro = new ResizeObserver(() => draw())
    if (wrapRef.current) ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [draw])
  useEffect(() => { draw() }, [libUi, activeRootId, selectedId, highlightId, draw])

  // zoom bằng con lăn — listener non-passive để preventDefault
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const onWheel = (e) => {
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left, my = e.clientY - rect.top
      const cam = cameraRef.current
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12
      const k2 = Math.min(2.5, Math.max(0.15, cam.k * factor))
      cam.x = mx - (mx - cam.x) * (k2 / cam.k)
      cam.y = my - (my - cam.y) * (k2 / cam.k)
      cam.k = k2
      setZoomPct(Math.round(k2 * 100))
      draw()
    }
    canvas.addEventListener('wheel', onWheel, { passive: false })
    return () => canvas.removeEventListener('wheel', onWheel)
  }, [draw])

  // ---------- Hit test + kéo thả ----------
  const toWorld = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const cam = cameraRef.current
    return {
      sx: e.clientX - rect.left, sy: e.clientY - rect.top,
      x: (e.clientX - rect.left - cam.x) / cam.k,
      y: (e.clientY - rect.top - cam.y) / cam.k,
    }
  }

  const hitNode = (wx, wy) => {
    const nodes = libRef.current.nodes.filter((x) => x.rootId === activeRootRef.current)
    const vis = visibleNodes(nodes)
    for (let i = vis.length - 1; i >= 0; i--) {
      const node = vis[i]
      const { w, h } = nodeSize(node)
      const bx = node.x + w, by = node.y + h / 2
      if (childrenOf(nodes, node.id).length && Math.hypot(wx - bx, wy - by) <= 10) {
        return { node, zone: 'badge' }
      }
      if (wx >= node.x && wx <= node.x + w && wy >= node.y && wy <= node.y + h) {
        const zone = node.command && wy >= node.y + 28 ? 'command' : 'body'
        return { node, zone }
      }
    }
    return null
  }

  const copyCommand = useCallback(async (node) => {
    const ph = placeholders(node.command)
    if (ph.length) { setFillReq({ node, values: {} }); return }
    try {
      await navigator.clipboard.writeText(node.command)
      showToast(`Đã copy: ${node.command}`)
    } catch { showToast('Trình duyệt chặn clipboard — chọn node rồi bấm Copy ở panel phải') }
  }, [showToast])

  const toggleCollapse = (node) => {
    const nodes = libRef.current.nodes.map((x) =>
      x.id === node.id ? { ...x, collapsed: !x.collapsed } : x)
    let next = { ...libRef.current, nodes }
    if (settingsRef.current.autoLayoutOnToggle) {
      next = relayoutRootVisible(next, node.rootId)
      commit(next)
      if (!isMobile) requestAnimationFrame(() => fitView())
    } else {
      commit(next)
    }
  }

  const onPointerDown = (e) => {
    if (e.button !== 0) return
    canvasRef.current.setPointerCapture(e.pointerId)
    const p = toWorld(e)
    const hit = hitNode(p.x, p.y)
    if (hit?.zone === 'badge') {
      toggleCollapse(hit.node)
      return
    }
    if (hit) {
      selectedRef.current = hit.node.id
      setSelectedId(hit.node.id)
      const ids = e.altKey ? [hit.node.id] : subtreeIds(libRef.current.nodes, hit.node.id)
      dragRef.current = {
        kind: 'node', ids: new Set(ids), startX: p.x, startY: p.y,
        orig: new Map(libRef.current.nodes.filter((x) => ids.includes(x.id)).map((x) => [x.id, { x: x.x, y: x.y }])),
        moved: false, zone: hit.zone, node: hit.node,
      }
    } else {
      selectedRef.current = null
      setSelectedId(null)
      dragRef.current = { kind: 'pan', startSX: p.sx, startSY: p.sy, camX: cameraRef.current.x, camY: cameraRef.current.y, moved: false }
    }
  }

  const onPointerMove = (e) => {
    const d = dragRef.current
    if (!d) return
    const p = toWorld(e)
    if (d.kind === 'pan') {
      cameraRef.current.x = d.camX + (p.sx - d.startSX)
      cameraRef.current.y = d.camY + (p.sy - d.startSY)
      d.moved = true
      draw()
    } else if (d.kind === 'node') {
      const dx = p.x - d.startX, dy = p.y - d.startY
      if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true
      if (d.moved) {
        libRef.current = {
          ...libRef.current,
          nodes: libRef.current.nodes.map((x) => {
            const o = d.orig.get(x.id)
            return o ? { ...x, x: Math.round(o.x + dx), y: Math.round(o.y + dy) } : x
          }),
        }
        draw()
      }
    }
  }

  const onPointerUp = () => {
    const d = dragRef.current
    dragRef.current = null
    if (!d) return
    if (d.kind === 'node') {
      if (d.moved) {
        commit(libRef.current)
      } else if (d.zone === 'command') {
        copyCommand(d.node)
      }
    }
  }

  // ---------- Thao tác dữ liệu ----------
  const switchRoot = (rootId, focusNodeId = null) => {
    activeRootRef.current = rootId
    setActiveRootId(rootId)
    selectedRef.current = focusNodeId
    setSelectedId(focusNodeId)
    requestAnimationFrame(() => {
      if (focusNodeId) {
        const node = libRef.current.nodes.find((x) => x.id === focusNodeId)
        centerOn(node)
      } else fitView(rootId)
    })
  }

  const addChild = (parent) => {
    if (!parent) return
    const siblings = childrenOf(libRef.current.nodes, parent.id)
    const node = {
      id: uid(), rootId: activeRootId, parentId: parent.id,
      title: 'Node mới', command: '', note: '',
      x: parent.x + LEVEL_GAP_X, y: parent.y + siblings.length * NODE_GAP_Y,
      collapsed: false, updatedAt: Date.now(),
    }
    const nodes = libRef.current.nodes.map((x) => x.id === parent.id ? { ...x, collapsed: false } : x)
    commit({ ...libRef.current, nodes: [...nodes, node] })
    selectedRef.current = node.id
    setSelectedId(node.id)
  }

  const deleteNode = (node) => {
    if (!node.parentId) { showToast('Không xoá node gốc của cây — xoá cả root ở sidebar nếu cần'); return }
    if (!window.confirm(`Xoá node "${node.title}" và toàn bộ nhánh con?`)) return
    const ids = new Set(subtreeIds(libRef.current.nodes, node.id))
    commit({ ...libRef.current, nodes: libRef.current.nodes.filter((x) => !ids.has(x.id)) })
    selectedRef.current = null
    setSelectedId(null)
  }

  const updateNode = (node, patch) => {
    commit({
      ...libRef.current,
      nodes: libRef.current.nodes.map((x) => x.id === node.id ? { ...x, ...patch, updatedAt: Date.now() } : x),
    })
  }

  const addRoot = () => {
    const title = newRootTitle.trim()
    if (!title) return
    const rootId = uid()
    const rootNode = {
      id: uid(), rootId, parentId: null, title, command: '', note: '',
      x: 40, y: 40, collapsed: false, updatedAt: Date.now(),
    }
    commit({
      roots: [...libRef.current.roots, { id: rootId, title, description: '' }],
      nodes: [...libRef.current.nodes, rootNode],
    })
    setNewRootTitle('')
    switchRoot(rootId)
  }

  // Nạp thêm 1 root từ bộ mẫu vào kho hiện tại (không đụng dữ liệu cũ)
  const addFromTemplate = (tree) => {
    if (libRef.current.roots.some((r) => r.id === tree.root.id)) {
      showToast(`Đã có root "${tree.root.title}" trong kho`)
      return
    }
    const now = Date.now()
    const newNodes = collapseTopLevel(tree.nodes).map((x) => ({ ...x, updatedAt: now }))
    let next = {
      roots: [...libRef.current.roots, tree.root],
      nodes: [...libRef.current.nodes, ...newNodes],
    }
    next = relayoutRootVisible(next, tree.root.id)
    commit(next)
    switchRoot(tree.root.id)
    showToast(`Đã thêm root mẫu "${tree.root.title}"`)
  }

  // Xoá root phải nhập đúng mã bảo mật tạm thời (xem lib/security.js)
  const deleteRoot = (root) => {
    setDelCode('')
    setDelCodeErr('')
    setRootDelReq(root)
  }

  const confirmDeleteRoot = () => {
    const root = rootDelReq
    if (!root) return
    if (delCode.trim() !== DELETE_ROOT_CODE) {
      setDelCodeErr('Mã bảo mật chưa đúng — chưa xoá gì cả.')
      return
    }
    const next = {
      roots: libRef.current.roots.filter((x) => x.id !== root.id),
      nodes: libRef.current.nodes.filter((x) => x.rootId !== root.id),
    }
    setRootDelReq(null)
    commit(next)
    if (activeRootId === root.id && next.roots[0]) switchRoot(next.roots[0].id)
    showToast(`Đã xoá root "${root.title}"`)
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(libRef.current, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'command-map.json'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const importJson = (file) => {
    if (!file) return
    file.text().then((text) => {
      try {
        const lib = JSON.parse(text)
        if (!Array.isArray(lib.roots) || !Array.isArray(lib.nodes)) throw new Error('bad')
        commit(lib)
        if (lib.roots[0]) switchRoot(lib.roots[0].id)
        showToast('Đã nhập dữ liệu')
      } catch { showToast('File JSON không đúng định dạng Command Map') }
    })
  }

  // ---------- Tìm kiếm toàn kho ----------
  const results = useMemo(() => {
    const q = foldText(query.trim())
    if (!q) return []
    const words = q.split(/\s+/)
    return libUi.nodes
      .filter((node) => {
        const hay = foldText(`${node.title} ${node.command} ${node.note}`)
        return words.every((w) => hay.includes(w))
      })
      .slice(0, 30)
      .map((node) => ({
        node,
        root: libUi.roots.find((r) => r.id === node.rootId),
        path: ancestorsOf(libUi.nodes.filter((x) => x.rootId === node.rootId), node).map((x) => x.title).join(' › '),
      }))
  }, [query, libUi])

  const gotoResult = (r) => {
    // mở mọi node cha đang thu gọn trên đường tới node đích
    const chain = ancestorsOf(libRef.current.nodes, r.node)
    const chainIds = new Set(chain.slice(0, -1).map((x) => x.id))
    let next = {
      ...libRef.current,
      nodes: libRef.current.nodes.map((x) => chainIds.has(x.id) ? { ...x, collapsed: false } : x),
    }
    if (settingsRef.current.autoLayoutOnToggle) {
      next = relayoutRootVisible(next, r.node.rootId)
    }
    commit(next)
    highlightRef.current = r.node.id
    setHighlightId(r.node.id)
    switchRoot(r.node.rootId, r.node.id)
    setQuery('')
    if (isMobile) {
      setTimeout(() => {
        document.querySelector(`[data-mnode="${r.node.id}"]`)?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }, 380)
    }
  }

  const zoomBy = (f) => {
    const cam = cameraRef.current
    const canvas = canvasRef.current
    const k2 = Math.min(2.5, Math.max(0.15, cam.k * f))
    cam.x = canvas.clientWidth / 2 - (canvas.clientWidth / 2 - cam.x) * (k2 / cam.k)
    cam.y = canvas.clientHeight / 2 - (canvas.clientHeight / 2 - cam.y) * (k2 / cam.k)
    cam.k = k2
    setZoomPct(Math.round(k2 * 100))
    draw()
  }


  const topbarJsx = (
      <header className="topbar">
        <div className="brand"><i />Command Map</div>
        <span className="status">
          <span className={`dot ${user && syncState !== 'error' ? 'ok' : ''}`} />
          {user
            ? (syncState === 'error' ? syncMsg : `${user.email} · ${syncState === 'syncing' ? 'đang đồng bộ…' : 'đã đồng bộ Firebase'}`)
            : 'Chế độ local — đăng nhập Google để đồng bộ trên mọi máy'}
        </span>
        <div className="spacer" />
        {user
          ? <button className="btn" onClick={onSignOut}>Đăng xuất</button>
          : <button className="btn" onClick={onSignIn}>Đăng nhập Google</button>}
      </header>
  )

  const searchJsx = (
          <div className="search-wrap">
            <input
              className="search"
              placeholder="Tìm lệnh trong toàn bộ kho…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <div className="search-results">
                {results.length === 0 && <div className="search-empty">Không thấy kết quả</div>}
                {results.map((r) => (
                  <button key={r.node.id} className="search-item" onClick={() => gotoResult(r)}>
                    <span className="search-path">{r.root?.title} › {r.path}</span>
                    {r.node.command && <span className="search-cmd">{r.node.command}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
  )

  const fillPopJsx = fillReq && (

              <div className="fill-pop">
                <div className="fill-title">Điền giá trị trước khi copy</div>
                <div className="fill-cmd">{fillReq.node.command}</div>
                {placeholders(fillReq.node.command).map((ph) => (
                  <label key={ph.raw} className="fill-row">
                    <span>{ph.name}</span>
                    <input
                      autoFocus
                      value={fillReq.values[ph.name] || ''}
                      onChange={(e) => setFillReq({ ...fillReq, values: { ...fillReq.values, [ph.name]: e.target.value } })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') document.getElementById('fill-copy-btn')?.click()
                        if (e.key === 'Escape') setFillReq(null)
                      }}
                    />
                  </label>
                ))}
                <div className="fill-actions">
                  <button className="btn" onClick={() => setFillReq(null)}>Huỷ</button>
                  <button
                    id="fill-copy-btn"
                    className="btn primary"
                    onClick={async () => {
                      const cmd = fillPlaceholders(fillReq.node.command, fillReq.values)
                      try { await navigator.clipboard.writeText(cmd); showToast(`Đã copy: ${cmd}`) } catch { showToast('Không copy được') }
                      setFillReq(null)
                    }}
                  >Copy</button>
                </div>
              </div>
  )

  const deleteModalJsx = rootDelReq && (

        <div className="modal-backdrop" onClick={() => setRootDelReq(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Xoá root "{rootDelReq.title}"?</div>
            <p className="modal-text">
              Toàn bộ cây lệnh của root này sẽ bị xoá{user ? ' trên mọi máy đã đồng bộ' : ''}.
              Nhập mã bảo mật để xác nhận:
            </p>
            <input
              type="password"
              autoFocus
              value={delCode}
              placeholder="Mã bảo mật"
              onChange={(e) => { setDelCode(e.target.value); setDelCodeErr('') }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmDeleteRoot()
                if (e.key === 'Escape') setRootDelReq(null)
              }}
            />
            {delCodeErr && <div className="modal-err">{delCodeErr}</div>}
            <div className="fill-actions">
              <button className="btn" onClick={() => setRootDelReq(null)}>Huỷ</button>
              <button className="btn danger" onClick={confirmDeleteRoot}>Xoá root</button>
            </div>
          </div>
        </div>
  )

  const markRowJsx = (node) => (
    <div className="mark-row">
      <button
        className={`btn mark-none ${!node.mark ? 'on' : ''}`}
        onClick={() => updateNode(node, { mark: null })}
      >Không</button>
      {MARK_OPTIONS.map((m) => (
        <button
          key={m.key}
          className={`mark-dot ${node.mark === m.key ? 'on' : ''}`}
          title={m.label}
          style={{ background: `var(${m.varName})` }}
          onClick={() => updateNode(node, { mark: node.mark === m.key ? null : m.key })}
        />
      ))}
    </div>
  )

  const activeRoot = libUi.roots.find((r) => r.id === activeRootId)
  const countOf = (rootId) => libUi.nodes.filter((x) => x.rootId === rootId && x.command).length

  // ===== Giao diện mobile (≤820px): cây dạng danh sách thụt lề, không canvas =====
  if (isMobile) {
    const mRows = flattenVisible(activeNodes)
    return (
      <div className="app app-mobile">
        {topbarJsx}
        {searchJsx}
        <div className="m-chips">
          {libUi.roots.map((root) => (
            <button
              key={root.id}
              className={`m-chip ${root.id === activeRootId ? 'active' : ''}`}
              onClick={() => switchRoot(root.id)}
            >{root.title}</button>
          ))}
        </div>
        <div className="m-list">
          {mRows.map(({ node, depth }) => {
            const kids = childrenOf(activeNodes, node.id)
            return (
              <div
                key={node.id}
                data-mnode={node.id}
                className={`m-row ${node.id === highlightId ? 'flash' : ''}`}
                style={{ paddingLeft: 10 + depth * 18 }}
              >
                <div className="m-row-head">
                  {kids.length
                    ? <button className="m-toggle" onClick={() => toggleCollapse(node)}>{node.collapsed ? '›' : '⌄'}</button>
                    : <span className="m-toggle empty" />}
                  {node.mark && (
                    <span
                      className="m-mark"
                      style={{ background: `var(${MARK_OPTIONS.find((m) => m.key === node.mark)?.varName || '--muted'})` }}
                    />
                  )}
                  <button
                    className="m-title"
                    onClick={() => { if (kids.length) toggleCollapse(node) }}
                  >
                    {node.title}
                    {node.collapsed && kids.length > 0 && (
                      <span className="m-badge">+{hiddenCount(activeNodes, node.id)}</span>
                    )}
                  </button>
                </div>
                {node.command && (
                  <button className="m-cmd" onClick={() => copyCommand(node)}>
                    <span className="m-cmd-text">{node.command}</span>
                    <span className="m-cmd-copy">⧉</span>
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {fillPopJsx}
        {toast && <div className="toast">{toast}</div>}
      </div>
    )
  }

  return (
    <div className="app">
{topbarJsx}

      <div className="main">
        <aside className="sidebar">
{searchJsx}          <div className="side-head">
            <span>Root lệnh ({libUi.roots.length})</span>
          </div>
          <div className="root-list">
            {libUi.roots.map((root) => (
              <div key={root.id} className={`root-item ${root.id === activeRootId ? 'active' : ''}`}>
                <button className="root-main" onClick={() => switchRoot(root.id)}>
                  <span className="root-title">{root.title}</span>
                  <span className="root-count">{countOf(root.id)} lệnh</span>
                </button>
                <button className="root-del" title="Xoá root" onClick={() => deleteRoot(root)}><Icon name="x" /></button>
              </div>
            ))}
          </div>
          <div className="add-root">
            <input
              placeholder="Tên root mới…"
              value={newRootTitle}
              onChange={(e) => setNewRootTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addRoot()}
            />
            <button className="btn btn-icon" onClick={addRoot}><Icon name="plus" />Root</button>
          </div>
          {templateTrees().some((t) => !libUi.roots.some((r) => r.id === t.root.id)) && (
            <div className="template-row">
              <span className="template-label">Bộ mẫu:</span>
              {templateTrees()
                .filter((t) => !libUi.roots.some((r) => r.id === t.root.id))
                .map((t) => (
                  <button key={t.root.id} className="btn btn-icon" onClick={() => addFromTemplate(t)}>
                    <Icon name="plus" />{t.root.title}
                  </button>
                ))}
            </div>
          )}

          <div className="side-head"><span>Cài đặt</span></div>
          <label className="checkrow">
            <input
              type="checkbox"
              checked={settings.autoLayoutOnToggle}
              onChange={(e) => updateSettings({ autoLayoutOnToggle: e.target.checked })}
            />
            <span>Tự sắp xếp lại cây khi mở / đóng nhánh</span>
          </label>
          <div className="settings-hint">Bật: mỗi lần bung hoặc thu một nhánh, cây tự dàn lại cho gọn (vị trí kéo tay sẽ bị sắp lại). Tắt: giữ nguyên vị trí như bản trước.</div>

          <div className="side-foot">
            <button className="btn block" onClick={exportJson}>Xuất JSON</button>
            <label className="btn block file-btn">
              Nhập JSON
              <input type="file" accept="application/json" hidden onChange={(e) => { importJson(e.target.files[0]); e.target.value = '' }} />
            </label>
            <button className="btn block" onClick={() => { const lib = resetLibrary(); commit(lib); if (lib.roots[0]) switchRoot(lib.roots[0].id) }}>
              Khôi phục dữ liệu mẫu
            </button>
          </div>
        </aside>

        <section className="stage">
          <div className="toolbar">
            <span className="toolbar-title">{activeRoot?.title || ''}</span>
            <span className="toolbar-sub">{activeNodes.length} node · {countOf(activeRootId)} lệnh</span>
            <div className="spacer" />
            <button className="btn btn-icon" onClick={() => addChild(activeNodes.find((x) => !x.parentId))}><Icon name="plus" />Node con vào gốc</button>
            <button className="btn btn-icon" onClick={() => { commit(relayoutRootVisible(libRef.current, activeRootId)); requestAnimationFrame(() => fitView()) }}><Icon name="refresh-cw" />Sắp xếp lại cây</button>
            <button className="btn" onClick={() => fitView()}>Vừa khung</button>
            <div className="zoom-ctl">
              <button className="btn" onClick={() => zoomBy(1 / 1.2)}>−</button>
              <span className="zoom-pct">{zoomPct}%</span>
              <button className="btn" onClick={() => zoomBy(1.2)}>+</button>
            </div>
          </div>

          <div className="canvas-wrap" ref={wrapRef}>
            <canvas
              ref={canvasRef}
              className="canvas"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onDoubleClick={(e) => {
                const p = toWorld(e)
                const hit = hitNode(p.x, p.y)
                if (hit) { selectedRef.current = hit.node.id; setSelectedId(hit.node.id) }
              }}
            />
            <div className="canvas-hint">
              Kéo nền: di chuyển · Lăn chuột: zoom · Kéo node: dời cả nhánh (Alt+kéo: riêng node) · Bấm vào dòng lệnh: copy
            </div>
            {toast && <div className="toast">{toast}</div>}

{fillPopJsx}          </div>
        </section>

        <aside className="inspector">
          <div className="side-head"><span>Node đang chọn</span></div>
          {!selected && <div className="insp-empty">Bấm vào một node trên canvas để xem và sửa ở đây. Double-click cũng được.</div>}
          {selected && (
            <div className="insp-form">
              <label>Tiêu đề</label>
              <input value={selected.title} onChange={(e) => updateNode(selected, { title: e.target.value })} />
              <label>Lệnh (bấm vào dòng lệnh trên canvas là copy)</label>
              <textarea className="mono" rows={3} value={selected.command} onChange={(e) => updateNode(selected, { command: e.target.value })} placeholder="vd: npm list -g --depth=0" />
              <label>Ghi chú</label>
              <textarea rows={4} value={selected.note} onChange={(e) => updateNode(selected, { note: e.target.value })} />
              <label>Đánh dấu màu (lưu ý lệnh hay dùng)</label>
              {markRowJsx(selected)}
              <div className="insp-actions">
                <button className="btn btn-icon" onClick={() => addChild(selected)}><Icon name="plus" />Node con</button>
                {selected.command && <button className="btn btn-icon" onClick={() => copyCommand(selected)}><Icon name="copy" />Copy lệnh</button>}
                <button className="btn danger" onClick={() => deleteNode(selected)}>Xoá node</button>
              </div>
            </div>
          )}
        </aside>
      </div>

{deleteModalJsx}    </div>
  )
}
