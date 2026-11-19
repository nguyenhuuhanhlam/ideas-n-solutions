import { useCallback, useEffect, useRef, useState } from 'react'
import { originalUrl, viewUrl } from './cloudinary.js'

const SWIPE_THRESHOLD = 90
const CLOSE_THRESHOLD = 120
const MAX_SCALE = 4
const DOUBLE_TAP_MS = 300

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${dd}-${mm}-${yyyy} ${hh}:${min}`
}

/**
 * Trình xem ảnh full màn hình, thao tác bằng vuốt/chạm:
 * - Vuốt trái/phải: chuyển ảnh
 * - Vuốt xuống: đóng
 * - Pinch 2 ngón: phóng to, kéo để xem chi tiết; double-tap: phóng to / thu nhỏ
 * - Chạm 1 lần: ẩn/hiện thanh công cụ
 * Desktop: kéo chuột, phím mũi tên, Esc.
 */
export default function Viewer({ photos, index, onClose, onNavigate }) {
  const photo = photos[index]
  const containerRef = useRef(null)
  const wrapRef = useRef(null)
  const pointers = useRef(new Map())
  const gesture = useRef(null)
  const transform = useRef({ x: 0, y: 0, scale: 1, ox: 0, oy: 0 })
  const lastTap = useRef(0)
  const [chromeVisible, setChromeVisible] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const indexRef = useRef(index)
  indexRef.current = index
  const photosRef = useRef(photos)
  photosRef.current = photos

  const apply = useCallback((animate) => {
    const el = wrapRef.current
    if (!el) return
    const t = transform.current
    el.style.transition = animate ? 'transform 0.25s ease' : 'none'
    el.style.transform = `translate(${t.x}px, ${t.y}px) scale(${t.scale})`
    el.style.transformOrigin = `${t.ox}px ${t.oy}px`
  }, [])

  const setBackdrop = useCallback((opacity) => {
    const el = containerRef.current
    if (el) el.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`
  }, [])

  const resetTransform = useCallback(
    (animate) => {
      const el = wrapRef.current
      if (el) {
        const rect = el.getBoundingClientRect()
        transform.current = {
          x: 0,
          y: 0,
          scale: 1,
          ox: rect.width / 2,
          oy: rect.height / 2,
        }
      } else {
        transform.current = { x: 0, y: 0, scale: 1, ox: 0, oy: 0 }
      }
      apply(animate)
      setBackdrop(1)
    },
    [apply, setBackdrop],
  )

  const goTo = useCallback(
    (next) => {
      const list = photosRef.current
      if (next < 0 || next >= list.length) {
        resetTransform(true)
        return
      }
      onNavigate(next)
    },
    [onNavigate, resetTransform],
  )

  // Đổi ảnh: reset transform + trạng thái tải.
  useEffect(() => {
    setLoaded(false)
    resetTransform(false)
  }, [index, resetTransform])

  // Khóa cuộn trang nền khi xem ảnh.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [])

  // Tải trước 2 ảnh kề để vuốt qua là thấy ngay.
  useEffect(() => {
    for (const i of [index - 1, index + 1]) {
      if (photos[i]) {
        const img = new Image()
        img.src = viewUrl(photos[i])
      }
    }
  }, [index, photos])

  // Phím tắt desktop.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goTo(indexRef.current - 1)
      if (e.key === 'ArrowRight') goTo(indexRef.current + 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goTo, onClose])

  // Cử chỉ vuốt / pinch bằng Pointer Events.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const clampPan = () => {
      const el = wrapRef.current
      const t = transform.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const maxX = Math.max(0, (rect.width * (t.scale - 1)) / 2)
      const maxY = Math.max(0, (rect.height * (t.scale - 1)) / 2)
      t.x = Math.max(-maxX, Math.min(maxX, t.x))
      t.y = Math.max(-maxY, Math.min(maxY, t.y))
    }

    const onDown = (e) => {
      if (e.target.closest('button, a')) return
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (pointers.current.size === 2) {
        const [a, b] = [...pointers.current.values()]
        gesture.current = {
          mode: 'pinch',
          startDist: Math.hypot(a.x - b.x, a.y - b.y),
          startScale: transform.current.scale,
          startMidX: (a.x + b.x) / 2,
          startMidY: (a.y + b.y) / 2,
          startX: transform.current.x,
          startY: transform.current.y,
        }
      } else if (pointers.current.size === 1) {
        gesture.current = {
          mode: 'pan',
          startX: e.clientX,
          startY: e.clientY,
          panX: transform.current.x,
          panY: transform.current.y,
          startTime: Date.now(),
          moved: false,
          vertical: false,
        }
      }
    }

    const onMove = (e) => {
      if (!pointers.current.has(e.pointerId)) return
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
      const g = gesture.current
      if (!g) return
      const t = transform.current

      if (g.mode === 'pinch' && pointers.current.size >= 2) {
        const [a, b] = [...pointers.current.values()]
        const dist = Math.hypot(a.x - b.x, a.y - b.y)
        const midX = (a.x + b.x) / 2
        const midY = (a.y + b.y) / 2
        t.scale = Math.max(
          1,
          Math.min(MAX_SCALE, g.startScale * (dist / g.startDist)),
        )
        t.x = g.startX + (midX - g.startMidX)
        t.y = g.startY + (midY - g.startMidY)
        clampPan()
        apply(false)
        return
      }

      if (g.mode === 'pan') {
        const dx = e.clientX - g.startX
        const dy = e.clientY - g.startY
        if (Math.abs(dx) > 8 || Math.abs(dy) > 8) g.moved = true
        if (!g.moved) return
        if (t.scale > 1) {
          // Đang phóng to: kéo để xem chi tiết.
          t.x = g.panX + dx
          t.y = g.panY + dy
          clampPan()
          apply(false)
          return
        }
        if (!g.vertical && Math.abs(dy) > Math.abs(dx) && dy > 0) {
          g.vertical = true
        }
        if (g.vertical) {
          // Kéo xuống: ảnh đi theo, nền mờ dần.
          t.y = dy
          t.x = 0
          apply(false)
          setBackdrop(Math.max(0, 1 - dy / 500))
        } else {
          // Vuốt ngang: ở ảnh đầu/cuối thì kéo nặng hơn (kháng).
          const atEdge =
            (indexRef.current === 0 && dx > 0) ||
            (indexRef.current === photosRef.current.length - 1 && dx < 0)
          t.x = atEdge ? dx * 0.35 : dx
          t.y = 0
          apply(false)
        }
      }
    }

    const onUp = (e) => {
      const had = pointers.current.has(e.pointerId)
      pointers.current.delete(e.pointerId)
      const g = gesture.current
      if (!g || !had) return
      const t = transform.current

      if (g.mode === 'pinch') {
        if (pointers.current.size < 2) {
          gesture.current = null
          if (t.scale < 1.08) {
            resetTransform(true)
          } else {
            clampPan()
            apply(true)
          }
        }
        return
      }

      // mode pan, 1 ngón.
      gesture.current = null
      const dx = e.clientX - g.startX
      const dy = e.clientY - g.startY
      const duration = Date.now() - g.startTime

      if (!g.moved && duration < 300) {
        // Chạm: double-tap phóng to, chạm đơn ẩn/hiện thanh công cụ.
        const now = Date.now()
        if (now - lastTap.current < DOUBLE_TAP_MS) {
          lastTap.current = 0
          const el = wrapRef.current
          const rect = el.getBoundingClientRect()
          if (t.scale > 1) {
            resetTransform(true)
          } else {
            t.scale = 2.5
            t.ox = e.clientX - rect.left
            t.oy = e.clientY - rect.top
            t.x = 0
            t.y = 0
            apply(true)
          }
        } else {
          lastTap.current = now
          setChromeVisible((v) => !v)
        }
        return
      }

      if (t.scale > 1) {
        clampPan()
        apply(true)
        return
      }
      if (g.vertical && dy >= CLOSE_THRESHOLD) {
        onClose()
        return
      }
      if (!g.vertical && dx <= -SWIPE_THRESHOLD) {
        goTo(indexRef.current + 1)
        return
      }
      if (!g.vertical && dx >= SWIPE_THRESHOLD) {
        goTo(indexRef.current - 1)
        return
      }
      resetTransform(true)
    }

    container.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      container.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [apply, goTo, onClose, resetTransform, setBackdrop])

  if (!photo) return null

  return (
    <div
      ref={containerRef}
      className="viewer"
      role="dialog"
      aria-label="Xem ảnh"
      aria-modal="true"
    >
      <div className={`viewer-top ${chromeVisible ? '' : 'viewer-top--hidden'}`}>
        <span className="viewer-counter">
          {index + 1} / {photos.length}
        </span>
        <span className="viewer-date">{formatDate(photo.created_at)}</span>
        <div className="viewer-top-actions">
          <a
            className="icon-btn"
            href={originalUrl(photo)}
            target="_blank"
            rel="noreferrer"
            aria-label="Mở ảnh gốc"
            title="Mở ảnh gốc"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </a>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Đóng"
            title="Đóng"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <div className="viewer-stage">
        <div ref={wrapRef} className="viewer-imgwrap">
          {!loaded && <div className="viewer-loading" />}
          <img
            key={photo.public_id}
            src={viewUrl(photo)}
            alt=""
            draggable={false}
            onLoad={() => setLoaded(true)}
            onContextMenu={(e) => e.preventDefault()}
            className={loaded ? 'viewer-img viewer-img--loaded' : 'viewer-img'}
          />
        </div>
      </div>

      <div className={`viewer-bottom ${chromeVisible ? '' : 'viewer-bottom--hidden'}`}>
        <button
          type="button"
          className="icon-btn viewer-nav"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          aria-label="Ảnh trước"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="viewer-hint">Vuốt để chuyển ảnh, kéo xuống để đóng</span>
        <button
          type="button"
          className="icon-btn viewer-nav"
          onClick={() => goTo(index + 1)}
          disabled={index === photos.length - 1}
          aria-label="Ảnh sau"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
