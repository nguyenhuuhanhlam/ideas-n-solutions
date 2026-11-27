// Tầng dữ liệu — BẢN DEMO dùng localStorage để UI chạy độc lập.
// Khi nối Firebase, chỉ thay phần thân của các hàm trong file này
// (loadLibrary/saveLibrary thành đọc/ghi Firestore theo từng node),
// giao diện và canvas không phải sửa.
//
// Hình dạng dữ liệu (khớp thiết kế Firestore đã thống nhất):
// library = {
//   roots: [{ id, title, description }],
//   nodes: [{ id, rootId, parentId, title, command, note, x, y, collapsed, updatedAt }],
// }

import { seedLibrary, collapseTopLevel } from './seed'
import { layoutTree } from '../lib/geometry'

const KEY = 'command-map-demo-v1'
const COLLAPSE_FLAG = 'command-map-default-collapse-v1'

export function loadLibrary() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const lib = JSON.parse(raw)
      if (lib && Array.isArray(lib.roots) && Array.isArray(lib.nodes)) {
        if (!localStorage.getItem(COLLAPSE_FLAG)) {
          lib.nodes = layoutAll({ ...lib, nodes: collapseTopLevel(lib.nodes) })
          saveLibrary(lib)
          localStorage.setItem(COLLAPSE_FLAG, '1')
        }
        return lib
      }
    }
  } catch { /* dữ liệu hỏng thì quay về seed */ }
  const lib = seedLibrary()
  lib.nodes = layoutAll(lib)
  saveLibrary(lib)
  try { localStorage.setItem(COLLAPSE_FLAG, '1') } catch { /* bỏ qua */ }
  return lib
}

function layoutAll(lib) {
  let nodes = [...lib.nodes]
  for (const root of lib.roots) {
    const mine = nodes.filter((x) => x.rootId === root.id)
    const laid = layoutTree(mine)
    const byId = new Map(laid.map((x) => [x.id, x]))
    nodes = nodes.map((x) => byId.get(x.id) || x)
  }
  return nodes
}

export function relayoutRoot(lib, rootId) {
  const mine = lib.nodes.filter((x) => x.rootId === rootId)
  const laid = layoutTree(mine)
  const byId = new Map(laid.map((x) => [x.id, x]))
  return { ...lib, nodes: lib.nodes.map((x) => byId.get(x.id) || x) }
}

export function saveLibrary(lib) {
  try { localStorage.setItem(KEY, JSON.stringify(lib)) } catch { /* quota — demo bỏ qua */ }
}

export function resetLibrary() {
  localStorage.removeItem(KEY)
  return loadLibrary()
}
