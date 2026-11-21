import { Camera, EyeOff, ImagePlus, Images, LogOut, RefreshCw, X } from 'lucide-react'
import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { Banner } from '@astryxdesign/core/Banner'
import { Button } from '@astryxdesign/core/Button'
import { Card } from '@astryxdesign/core/Card'
import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog'
import { EmptyState } from '@astryxdesign/core/EmptyState'
import { Heading } from '@astryxdesign/core/Heading'
import { HStack } from '@astryxdesign/core/HStack'
import { IconButton } from '@astryxdesign/core/IconButton'
import { ProgressBar } from '@astryxdesign/core/ProgressBar'
import { Spinner } from '@astryxdesign/core/Spinner'
import { StackItem } from '@astryxdesign/core/Stack'
import { Text } from '@astryxdesign/core/Text'
import { VStack } from '@astryxdesign/core/VStack'
import { isAuthed, setAuthed } from './auth.js'
import {
  compressImage,
  fetchHiddenIds,
  fetchPhotos,
  markerPublicId,
  originalUrl,
  photoFromUpload,
  thumbUrl,
  uploadHideMarker,
  uploadPhoto,
  viewUrl,
} from './cloudinary.js'
import Login from './Login.jsx'

const MAX_PARALLEL_UPLOADS = 3
const RECENT_KEEP_MS = 10 * 60 * 1000

// Lightbox (kèm hệ thống gesture) khá nặng nên tách chunk riêng, chỉ tải
// khi mở trình xem — giữ bundle ban đầu nhẹ cho mobile.
const Lightbox = lazy(() =>
  import('@astryxdesign/core/Lightbox').then((m) => ({ default: m.Lightbox })),
)
const preloadLightbox = () => import('@astryxdesign/core/Lightbox')

function keyOf(p) {
  return p.asset_id || p.public_id
}

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
  const [hiddenIds, setHiddenIds] = useState(new Set())
  const [status, setStatus] = useState('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const [notice, setNotice] = useState(null)
  const [uploads, setUploads] = useState([])
  const [viewerIndex, setViewerIndex] = useState(null)
  const [hideTarget, setHideTarget] = useState(null)
  const [hiding, setHiding] = useState(false)
  const [hideError, setHideError] = useState('')
  const [showHidden, setShowHidden] = useState(false)
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
      // Danh sách ẩn tải kèm; lỗi thì mở hết (hiện tất cả) để không kẹt app.
      const [list, hidden] = await Promise.all([
        fetchPhotos(),
        fetchHiddenIds().catch(() => new Set()),
      ])
      setPhotos((prev) => mergePhotos(prev, list))
      setHiddenIds(hidden)
      setStatus('ready')
      setErrorMsg('')
    } catch (err) {
      if (photosRef.current.length === 0) {
        setStatus('error')
        setErrorMsg(err.message)
      } else {
        setNotice({ text: 'Không làm mới được, đang hiện ảnh cũ', status: 'error' })
        setTimeout(() => setNotice(null), 4000)
      }
    } finally {
      setRefreshing(false)
    }
  }, [])

  // Ảnh ẩn vẫn nằm trong `photos` (còn trên Cloudinary) — chỉ lọc khi hiện.
  const visiblePhotos = photos.filter((p) => !hiddenIds.has(p.public_id))
  const hiddenPhotos = photos.filter((p) => hiddenIds.has(p.public_id))

  const confirmHide = async () => {
    if (!hideTarget || hiding) return
    setHiding(true)
    setHideError('')
    try {
      await uploadHideMarker(hideTarget.public_id)
      setHiddenIds((prev) => new Set(prev).add(hideTarget.public_id))
      setViewerIndex(null)
      setHideTarget(null)
      setNotice({ text: 'Đã ẩn ảnh khỏi album trên mọi máy.', status: 'success' })
      setTimeout(() => setNotice(null), 5000)
    } catch (err) {
      setHideError(err.message || 'Ẩn ảnh lỗi, thử lại sau')
    } finally {
      setHiding(false)
    }
  }

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

  // Tải trước chunk Lightbox khi trình duyệt rảnh, để chạm ảnh là mở ngay.
  useEffect(() => {
    if (status !== 'ready') return
    const idle =
      window.requestIdleCallback ||
      ((cb) => setTimeout(cb, 1500))
    const handle = idle(() => {
      preloadLightbox().catch(() => {})
    })
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(handle)
      else clearTimeout(handle)
    }
  }, [status])

  const logout = () => {
    setAuthed(false)
    setAuthedState(false)
    setViewerIndex(null)
    setHideTarget(null)
    setShowHidden(false)
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
        <div className="app-header-inner">
          <HStack gap={2} vAlign="center">
            <StackItem size="fill">
              <VStack gap={0}>
                <Heading level={2}>Ảnh nhóm</Heading>
                <Text type="supporting">
                  {status === 'ready' ? `${visiblePhotos.length} ảnh` : ' '}
                </Text>
              </VStack>
            </StackItem>
            <IconButton
              label="Làm mới"
              icon={<RefreshCw size={20} />}
              variant="ghost"
              tooltip="Làm mới"
              isLoading={refreshing}
              onClick={() => loadPhotos(true)}
            />
            <IconButton
              label="Đăng xuất"
              icon={<LogOut size={20} />}
              variant="ghost"
              tooltip="Đăng xuất"
              onClick={logout}
            />
          </HStack>
        </div>
      </header>

      <div
        className="pull-indicator"
        style={{
          height:
            pull > 0 || refreshing
              ? `${Math.max(pull, refreshing ? 44 : 0)}px`
              : 0,
        }}
      >
        <span className="pull-label">
          {refreshing && <Spinner size="sm" />}
          <Text type="supporting">
            {refreshing
              ? 'Đang làm mới…'
              : pull >= 70
                ? 'Thả để làm mới'
                : 'Kéo xuống để làm mới'}
          </Text>
        </span>
      </div>

      {notice && (
        <div className="notice-wrap">
          <Banner
            status={notice.status}
            title={notice.text}
            isDismissable
            onDismiss={() => setNotice(null)}
          />
        </div>
      )}

      <main className="gallery-wrap">
        {status === 'loading' && (
          <div className="page-state">
            <Spinner size="lg" label="Đang tải ảnh…" />
          </div>
        )}

        {status === 'error' && (
          <div className="page-state">
            <Heading level={2}>Không tải được ảnh.</Heading>
            <Text type="supporting">{errorMsg}</Text>
            <Button
              label="Thử lại"
              variant="secondary"
              onClick={() => {
                setStatus('loading')
                loadPhotos(false)
              }}
            />
          </div>
        )}

        {status === 'ready' &&
          visiblePhotos.length === 0 &&
          hiddenPhotos.length === 0 && (
            <EmptyState
              title="Chưa có ảnh nào"
              description="Chụp hoặc chọn ảnh để bắt đầu album nhóm."
              icon={<Images size={48} />}
              actions={
                <>
                  <Button
                    label="Chụp ảnh"
                    variant="primary"
                    icon={<Camera size={20} />}
                    onClick={() => cameraRef.current?.click()}
                  />
                  <Button
                    label="Chọn ảnh"
                    variant="secondary"
                    icon={<ImagePlus size={20} />}
                    onClick={() => pickerRef.current?.click()}
                  />
                </>
              }
            />
          )}

        {status === 'ready' &&
          visiblePhotos.length === 0 &&
          hiddenPhotos.length > 0 && (
            <div className="page-state">
              <Heading level={2}>Tất cả ảnh đang ẩn.</Heading>
              <Text type="supporting">
                Ảnh vẫn còn trên Cloudinary — mở danh sách ảnh đã ẩn để xem
                lại.
              </Text>
              <Button
                label={`Xem ảnh đã ẩn (${hiddenPhotos.length})`}
                variant="secondary"
                icon={<EyeOff size={20} />}
                onClick={() => setShowHidden(true)}
              />
            </div>
          )}

        {status === 'ready' && visiblePhotos.length > 0 && (
          <div className="grid">
            {visiblePhotos.map((p, i) => (
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

        <div className="footnote">
          <Text type="supporting">
            Ảnh lưu trên Cloudinary · Chạm ảnh để xem, vuốt để chuyển
          </Text>
          {hiddenPhotos.length > 0 && (
            <Button
              label={`Ảnh đã ẩn (${hiddenPhotos.length})`}
              variant="ghost"
              size="sm"
              icon={<EyeOff size={16} />}
              onClick={() => setShowHidden(true)}
            />
          )}
        </div>
      </main>

      {uploads.length > 0 && (
        <div className="upload-tray">
          <Card elevation="low">
            <VStack gap={3}>
              {uploads.map((u) => (
                <HStack key={u.id} gap={2} vAlign="center">
                  <img src={u.preview} alt="" className="upload-thumb" />
                  <StackItem size="fill">
                    <VStack gap={1}>
                      <Text maxLines={1}>{u.name}</Text>
                      <ProgressBar
                        label={`Up ${u.name}`}
                        value={u.status === 'done' ? 100 : u.progress}
                        variant={
                          u.status === 'error'
                            ? 'error'
                            : u.status === 'done'
                              ? 'success'
                              : 'accent'
                        }
                        isIndeterminate={
                          u.status === 'queued' || u.status === 'compressing'
                        }
                        isLabelHidden
                        hasValueLabel={u.status !== 'queued' && u.status !== 'compressing'}
                      />
                      {u.status === 'error' ? (
                        <span className="upload-error-text">{u.error}</span>
                      ) : u.status === 'done' ? (
                        <Text type="supporting">Đã up xong</Text>
                      ) : u.status === 'compressing' ? (
                        <Text type="supporting">Đang nén…</Text>
                      ) : u.status === 'queued' ? (
                        <Text type="supporting">Đang chờ…</Text>
                      ) : null}
                    </VStack>
                  </StackItem>
                  {u.status === 'error' && (
                    <Button
                      label="Thử lại"
                      variant="ghost"
                      size="sm"
                      onClick={() => retryUpload(u)}
                    />
                  )}
                  {(u.status === 'error' || u.status === 'done') && (
                    <IconButton
                      label="Ẩn"
                      icon={<X size={16} />}
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissUpload(u)}
                    />
                  )}
                </HStack>
              ))}
            </VStack>
          </Card>
        </div>
      )}

      <nav className="action-bar">
        <div className="action-bar-inner">
          <HStack gap={2}>
            <StackItem size="fill">
              <Button
                label="Chụp ảnh"
                variant="primary"
                size="lg"
                width="100%"
                icon={<Camera size={20} />}
                onClick={() => cameraRef.current?.click()}
              />
            </StackItem>
            <StackItem size="fill">
              <Button
                label="Chọn ảnh"
                variant="secondary"
                size="lg"
                width="100%"
                icon={<ImagePlus size={20} />}
                onClick={() => pickerRef.current?.click()}
              />
            </StackItem>
          </HStack>
        </div>
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

      {viewerIndex !== null && (
        <Suspense fallback={null}>
          <Lightbox
            isOpen
            onOpenChange={(open) => {
              if (!open) setViewerIndex(null)
            }}
            media={visiblePhotos.map((p, i) => ({
              src: viewUrl(p),
              alt: `Ảnh ${i + 1} trong album nhóm`,
              caption: (
                <span className="lightbox-caption">
                  {formatDate(p.created_at)}
                  {' · '}
                  <a href={originalUrl(p)} target="_blank" rel="noreferrer">
                    Mở ảnh gốc
                  </a>
                  {' · '}
                  <button
                    type="button"
                    className="caption-button"
                    onClick={() => {
                      setHideError('')
                      setHideTarget(p)
                    }}
                  >
                    Ẩn ảnh
                  </button>
                </span>
              ),
            }))}
            index={viewerIndex}
            onIndexChange={setViewerIndex}
            hasZoom
          />
        </Suspense>
      )}

      {hideTarget && (
        <Dialog
          isOpen
          onOpenChange={(open) => {
            if (!open && !hiding) setHideTarget(null)
          }}
          padding={4}
        >
          <DialogHeader
            title="Ẩn ảnh này?"
            subtitle="Ảnh biến khỏi album trên mọi máy."
            onOpenChange={() => {
              if (!hiding) setHideTarget(null)
            }}
          />
          <VStack gap={3}>
            <Text type="supporting">
              Ảnh vẫn còn trên Cloudinary — để xóa hẳn, xóa ảnh trong
              Cloudinary Console. Muốn hiện lại ảnh, xóa ảnh mốc{' '}
              {markerPublicId(hideTarget.public_id)} trong Console.
            </Text>
            {hideError && <Banner status="error" title={hideError} />}
            <HStack gap={2}>
              <StackItem size="fill">
                <Button
                  label="Hủy"
                  variant="secondary"
                  width="100%"
                  isDisabled={hiding}
                  onClick={() => setHideTarget(null)}
                />
              </StackItem>
              <StackItem size="fill">
                <Button
                  label="Ẩn ảnh"
                  variant="primary"
                  width="100%"
                  isLoading={hiding}
                  onClick={confirmHide}
                />
              </StackItem>
            </HStack>
          </VStack>
        </Dialog>
      )}

      {showHidden && (
        <Dialog
          isOpen
          onOpenChange={setShowHidden}
          width={480}
          padding={4}
        >
          <DialogHeader
            title={`Ảnh đã ẩn (${hiddenPhotos.length})`}
            subtitle="Ảnh vẫn còn trên Cloudinary."
            onOpenChange={setShowHidden}
          />
          <VStack gap={3}>
            <Text type="supporting">
              Để hiện lại một ảnh, xóa ảnh mốc của nó trong Cloudinary
              Console (Media Library, tìm theo tên mốc). Để xóa hẳn ảnh,
              xóa chính ảnh đó trong Console.
            </Text>
            <div className="hidden-list">
              {hiddenPhotos.map((p) => (
                <HStack key={keyOf(p)} gap={2} vAlign="center">
                  <img
                    src={thumbUrl(p)}
                    alt=""
                    className="hidden-thumb"
                    loading="lazy"
                  />
                  <StackItem size="fill">
                    <VStack gap={0}>
                      <Text>{formatDate(p.created_at)}</Text>
                      <Text type="supporting">
                        Mốc: {markerPublicId(p.public_id)}
                      </Text>
                    </VStack>
                  </StackItem>
                </HStack>
              ))}
            </div>
          </VStack>
        </Dialog>
      )}
    </div>
  )
}
