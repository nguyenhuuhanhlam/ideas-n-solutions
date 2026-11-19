import {
  CLOUD_NAME,
  JPEG_QUALITY,
  MAX_DIMENSION,
  TAG,
  UPLOAD_PRESET,
} from './config'

function versionSegment(p) {
  return p.version ? `/v${p.version}` : ''
}

/** Ảnh nhỏ 400x400 crop vuông cho lưới — tốn ít bandwidth nhất. */
export function thumbUrl(p) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_400,h_400,c_fill,f_auto,q_auto${versionSegment(p)}/${p.public_id}`
}

/** Ảnh xem full: rộng tối đa 1600px, tự chọn định dạng tối ưu. */
export function viewUrl(p) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_1600,f_auto,q_auto${versionSegment(p)}/${p.public_id}`
}

/** Ảnh gốc (dùng cho nút tải xuống). */
export function originalUrl(p) {
  if (p.secure_url) return p.secure_url
  const ext = p.format ? `.${p.format}` : ''
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload${versionSegment(p)}/${p.public_id}${ext}`
}

function normalize(r) {
  return {
    asset_id: r.asset_id,
    public_id: r.public_id,
    version: r.version,
    format: r.format,
    width: r.width,
    height: r.height,
    created_at: r.created_at,
    secure_url: r.secure_url || null,
  }
}

/**
 * Lấy danh sách ảnh theo tag. Endpoint list JSON là public (đã bật
 * Resource list trong Console). 404 nghĩa là chưa có ảnh nào gắn tag.
 */
export async function fetchPhotos() {
  const res = await fetch(
    `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${TAG}.json`,
    { cache: 'no-store' },
  )
  if (res.status === 404) return []
  if (!res.ok) throw new Error(`Không tải được danh sách ảnh (${res.status})`)
  const data = await res.json()
  const list = (data.resources || []).map(normalize)
  list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  return list
}

/**
 * Nén ảnh bằng canvas: xoay đúng hướng EXIF, thu cạnh dài về tối đa
 * MAX_DIMENSION, xuất JPEG. Nén lỗi (vd HEIC trình duyệt không đọc được)
 * thì trả file gốc để Cloudinary tự xử lý.
 */
export async function compressImage(file) {
  try {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: 'from-image',
    })
    const scale = Math.min(
      1,
      MAX_DIMENSION / Math.max(bitmap.width, bitmap.height),
    )
    const width = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()
    const blob = await new Promise((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Không nén được ảnh'))),
        'image/jpeg',
        JPEG_QUALITY,
      ),
    )
    const base = file.name.replace(/\.[^.]*$/, '') || 'anh'
    return { blob, name: `${base}.jpg` }
  } catch {
    return { blob: file, name: file.name || 'anh.jpg' }
  }
}

/**
 * Up ảnh bằng XMLHttpRequest để có tiến trình upload (fetch không hỗ trợ).
 * Dùng preset unsigned nên không cần chữ ký hay secret.
 */
export function uploadPhoto(blob, filename, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(
      'POST',
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    )
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }
    xhr.onload = () => {
      let data
      try {
        data = JSON.parse(xhr.responseText)
      } catch {
        reject(new Error(`Upload lỗi (${xhr.status})`))
        return
      }
      if (xhr.status >= 200 && xhr.status < 300) resolve(data)
      else reject(new Error(data?.error?.message || `Upload lỗi (${xhr.status})`))
    }
    xhr.onerror = () => reject(new Error('Mất kết nối khi up ảnh'))
    xhr.ontimeout = () => reject(new Error('Up ảnh quá lâu, thử lại sau'))
    xhr.timeout = 120000
    const form = new FormData()
    form.append('file', blob, filename)
    form.append('upload_preset', UPLOAD_PRESET)
    form.append('tags', TAG)
    xhr.send(form)
  })
}

export function photoFromUpload(data) {
  return normalize(data)
}
