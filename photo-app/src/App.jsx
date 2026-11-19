import { useCallback, useEffect, useRef, useState } from 'react'
import { isAuthed, setAuthed } from './auth.js'
import {
  compressImage,
  fetchPhotos,
  photoFromUpload,
  thumbUrl,
  uploadPhoto,
} from './cloudinary.js'
import Login from './Login.jsx'
import Viewer from './Viewer.jsx'

const MAX_PARALLEL_UPLOADS = 3
const RECENT_KEEP_MS = 10 * 60 * 1000

function keyOf(p) {
  return p.asset_id || p.public_id
}

/**
 * Gộp danh sách mới với danh sách cũ: giữ lại ảnh vừa up trong phiên mà
 * list JSON chưa kịp cập nhật (Cloudinary cache list ~60s), còn lại lấy
 * theo danh sách mới.
 */
function mergePhotos(prev, next) {
  const seen = new Set(next.map(keyOf))
  const cutoff = Date.now() - RECENT_KEEP_MS
  const kept = prev.filter(
    (p) => !seen.has(keyOf(p)) && new Date(p.created_at).getTime() > cutoff,
  )
  return [...kept, ...next]
}

function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export default function App() {
  const [authed, setAuthedState] = useState(() => isAuthed())
  const [photos, setPhotos] = useState([])
  const [status, setStatus] = useState('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const [notice, setNotice] = useState('')
  const [uploads, setUploads] = useState([])
  const [viewerIndex, setViewerIndex] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [pull, setPull] = useState(0)

  const cameraRef = useRef(null)
  const pickerRef = useRef(null)
  const queueRef = useRef([])
  const activeRef = useRef(0)
  const pullValueRef = useRef(0)
  const viewerRef = useRef(null)
  viewerRef.current = viewerIndex
  const photosRef = useRef(photos)
  photosRef.current = photos

  const loadPhotos = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    try {
      const list = await fetchPhotos()
      setPhotos((prev) => mergePhotos(prev, list))
      setStatus('ready')
      setErrorMsg('')
    } catch (err) {
      if (photosRef.current.length === 0) {
        setStatus('error')
        setErrorMsg(err.message)
      } else {
        setNotice('Không làm mới được, đang hiện ảnh cũ')
        setTimeout(() => setNotice(''), 4000)
      }
    } finally {
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    if (authed) loadPhotos(false)
  }, [authed, loadPhotos])

  // Quay lại app thì tải lại để thấy ảnh người khác vừa up.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') loadPhotos(true)
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [loadPhotos])

  const setPullValue = (v) => {
    pullValueRef.current = v
    setPull(v)
  }

  // Kéo xuống để làm mới (chỉ khi đang ở đầu trang và không mở trình xem).
  useEffect(() => {
    let startY = 0
    let pulling = false
    const onStart = (e) => {
      if (viewerRef.current !== null) return
      if (window.scrollY <= 0) {
        startY = e.touches[0].clientY
        pulling = true
      }
    }
    const onMove = (e) => {
      if (!pulling) return
      const dy = e.touches[0].clientY - startY
      if (dy > 0) {
        if (dy > 10) e.preventDefault()
        setPullValue(Math.min(dy * 0.5, 90))
      } else {
        pulling = false
        setPullValue(0)
      }
    }
    const onEnd = () => {
      if (!pulling) return
      pulling = false
      if (pullValueRef.current >= 70) loadPhotos(true)
      setPullValue(0)
    }
    document.addEventListener('touchstart', onStart, { passive: true })
    document.addEventListener('touchmove', onMove, { passive: false })
    document.addEventListener('touchend', onEnd)
    return () => {
      document.removeEventListener('touchstart', onStart)
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onEnd)
    }
  }, [loadPhotos])

  const runUpload = useCallback(async (item) => {
    const update = (patch) =>
      setUploads((u) => u.map((x) => (x.id === item.id ? { ...x, ...patch } : x)))
    update({ status: 'compressing', progress: 0, error: '' })
    try {
      const { blob, name } = await compressImage(item.file)
      update({ status: 'uploading' })
      const data = await uploadPhoto(blob, name, (pct) =>
        update({ progress: pct }),
      )
      update({ status: 'done', progress: 100 })
      setPhotos((prev) => mergePhotos([photoFromUpload(data)], prev))
      setTimeout(() => {
        setUploads((u) => u.filter((x) => x.id !== item.id))
        URL.revokeObjectURL(item.preview)
      }, 3000)
    } catch (err) {
      update({ status: 'error', error: err.message || 'Up lỗi, thử lại sau' })
    }
  }, [])

  const pump = useCallback(() => {
    while (
      activeRef.current < MAX_PARALLEL_UPLOADS &&
      queueRef.current.length > 0
    ) {
      const item = queueRef.current.shift()
      activeRef.current += 1
      runUpload(item).finally(() => {
        activeRef.current -= 1
        pump()
      })
    }
  }, [runUpload])

  const handleFiles = useCallback(
    (fileList) => {
      const files = [...fileList].filter((f) => f.type.startsWith('image/'))
      if (files.length === 0) return
      const items = files.map((file) => ({
        id: newId(),
        file,
        name: file.name || 'ảnh',
        preview: URL.createObjectURL(file),
        progress: 0,
        status: 'queued',
        error: '',
      }))
      setUploads((u) => [...u, ...items])
      queueRef.current.push(...items)
      pump()
    },
    [pump],
  )

  const retryUpload = useCallback(
    (item) => {
      setUploads((u) =>
        u.map((x) =>
          x.id === item.id
            ? { ...x, status: 'queued', progress: 0, error: '' }
            : x,
        ),
      )
      queueRef.current.push(item)
      pump()
    },
    [pump],
  )

  const dismissUpload = useCallback((item) => {
    setUploads((u) => u.filter((x) => x.id !== item.id))
    URL.revokeObjectURL(item.preview)
  }, [])

  const openViewer = (i) => setViewerIndex(i)

  const logout = () => {
    setAuthed(false)
    setAuthedState(false)
    setViewerIndex(null)
  }

  if (!authed) {
    return (
      <Login
        onSuccess={() => {
          setAuthed(true)
          setAuthedState(true)
        }}
      />
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Ảnh nhóm</h1>
        <span className="app-count">
          {status === 'ready' ? `${photos.length} ảnh` : ''}
        </span>
        <button
          type="button"
          className="icon-btn"
          onClick={logout}
          aria-label="Đăng xuất"
          title="Đăng xuất"
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={() => loadPhotos(true)}
          disabled={refreshing}
          aria-label="Làm mới"
          title="Làm mới"
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={refreshing ? 'spin' : ''}
          >
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        </button>
      </header>

      <div
        className="pull-indicator"
        style={{ height: pull > 0 || refreshing ? `${Math.max(pull, refreshing ? 44 : 0)}px` : 0 }}
      >
        <span>{pull >= 70 ? 'Thả để làm mới' : 'Kéo xuống để làm mới'}</span>
      </div>

      {notice && <div className="notice">{notice}</div>}

      <main className="gallery-wrap">
        {status === 'loading' && (
          <div className="state state--loading">
            <div className="spinner" />
            <p>Đang tải ảnh…</p>
          </div>
        )}

        {status === 'error' && (
          <div className="state">
            <p>Không tải được ảnh.</p>
            <p className="state-sub">{errorMsg}</p>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setStatus('loading')
                loadPhotos(false)
              }}
            >
              Thử lại
            </button>
          </div>
        )}

        {status === 'ready' && photos.length === 0 && (
          <div className="state">
            <p>Chưa có ảnh nào.</p>
            <p className="state-sub">Chụp ảnh đầu tiên cho nhóm nhé.</p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => cameraRef.current?.click()}
            >
              Chụp ảnh
            </button>
          </div>
        )}

        {status === 'ready' && photos.length > 0 && (
          <div className="grid">
            {photos.map((p, i) => (
              <button
                key={keyOf(p)}
                type="button"
                className="grid-item"
                onClick={() => openViewer(i)}
                aria-label={`Xem ảnh ${i + 1}`}
              >
                <img src={thumbUrl(p)} alt="" loading="lazy" draggable={false} />
              </button>
            ))}
          </div>
        )}

        <p className="footnote">Ảnh lưu trên Cloudinary · Chạm ảnh để xem, vuốt để chuyển</p>
      </main>

      {uploads.length > 0 && (
        <div className="upload-tray">
          {uploads.map((u) => (
            <div key={u.id} className="upload-item">
              <img src={u.preview} alt="" className="upload-thumb" />
              <div className="upload-info">
                <span className="upload-name">{u.name}</span>
                {u.status === 'error' ? (
                  <span className="upload-error">{u.error}</span>
                ) : u.status === 'done' ? (
                  <span className="upload-done">Đã up xong</span>
                ) : (
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${u.status === 'uploading' ? u.progress : 0}%`,
                      }}
                    />
                  </div>
                )}
                {u.status !== 'done' && u.status !== 'error' && (
                  <span className="upload-status">
                    {u.status === 'compressing'
                      ? 'Đang nén…'
                      : u.status === 'uploading'
                        ? `Đang up… ${u.progress}%`
                        : 'Đang chờ…'}
                  </span>
                )}
              </div>
              {u.status === 'error' && (
                <button
                  type="button"
                  className="mini-btn"
                  onClick={() => retryUpload(u)}
                >
                  Thử lại
                </button>
              )}
              {(u.status === 'error' || u.status === 'done') && (
                <button
                  type="button"
                  className="mini-btn mini-btn--ghost"
                  onClick={() => dismissUpload(u)}
                  aria-label="Ẩn"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <nav className="action-bar">
        <button
          type="button"
          className="action-btn action-btn--primary"
          onClick={() => cameraRef.current?.click()}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          Chụp ảnh
        </button>
        <button
          type="button"
          className="action-btn"
          onClick={() => pickerRef.current?.click()}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          Chọn ảnh
        </button>
      </nav>

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden-input"
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ''
        }}
      />
      <input
        ref={pickerRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden-input"
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ''
        }}
      />

      {viewerIndex !== null && photos[viewerIndex] && (
        <Viewer
          photos={photos}
          index={viewerIndex}
          onClose={() => setViewerIndex(null)}
          onNavigate={setViewerIndex}
        />
      )}
    </div>
  )
}
