// Gộp dữ liệu học tập giữa máy local (localStorage) và đám mây (Firestore).
// Mọi hàm ở đây đều thuần — không gọi mạng — nên test được độc lập.
// Quy tắc gộp (an toàn, không mất dữ liệu):
// - Lịch sử + kho câu sai: hợp nhất theo khóa, trùng thì giữ 1, mới nhất lên đầu.
// - Tiến độ từng bài: lấy mức tốt nhất (best cao nhất, attempts nhiều nhất).

export const SYNC_COLLECTION = 'tuti_sync'
export const SYNC_VERSION = 1
export const HISTORY_MAX = 500
export const WRONG_BANK_MAX = 100

function historyEntryKey(e) {
  return `${e.at}|${e.title}`
}

export function mergeHistory(local, cloud) {
  const map = new Map()
  for (const e of [...(cloud || []), ...(local || [])]) {
    if (!e || typeof e.at !== 'number' || !e.title) continue
    const k = historyEntryKey(e)
    if (!map.has(k)) map.set(k, e)
  }
  return [...map.values()].sort((a, b) => b.at - a.at).slice(0, HISTORY_MAX)
}

export function mergeWrongBank(local, cloud) {
  const map = new Map()
  for (const e of [...(cloud || []), ...(local || [])]) {
    if (!e || !e.key) continue
    const prev = map.get(e.key)
    if (!prev || (e.at || 0) > (prev.at || 0)) map.set(e.key, e)
  }
  return [...map.values()].sort((a, b) => (b.at || 0) - (a.at || 0)).slice(0, WRONG_BANK_MAX)
}

export function mergeProgress(local, cloud) {
  const out = {}
  for (const [id, v] of Object.entries(cloud || {})) {
    if (v && typeof v === 'object') out[id] = { ...v }
  }
  for (const [id, v] of Object.entries(local || {})) {
    if (!v || typeof v !== 'object') continue
    const c = out[id]
    out[id] = c
      ? { best: Math.max(c.best || 0, v.best || 0), attempts: Math.max(c.attempts || 0, v.attempts || 0) }
      : { ...v }
  }
  return out
}

// Đóng gói 1 tài liệu đồng bộ: 1 tài khoản = 1 doc, id = uid.
export function packSync({ history, progress, wrongBank }) {
  return {
    version: SYNC_VERSION,
    updatedAt: Date.now(),
    history: Array.isArray(history) ? history : [],
    progress: progress && typeof progress === 'object' ? progress : {},
    wrongBank: Array.isArray(wrongBank) ? wrongBank : [],
  }
}

export function unpackSync(data) {
  if (!data || typeof data !== 'object') return null
  return {
    history: Array.isArray(data.history) ? data.history : [],
    progress: data.progress && typeof data.progress === 'object' ? data.progress : {},
    wrongBank: Array.isArray(data.wrongBank) ? data.wrongBank : [],
    updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : 0,
  }
}
