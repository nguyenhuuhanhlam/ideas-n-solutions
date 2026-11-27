// Tính phần khác nhau giữa 2 trạng thái thư viện để ghi lên Firestore theo
// từng tài liệu (1 root / 1 node = 1 document) — chỉ ghi những gì thay đổi.
// Hàm thuần, không gọi mạng, test được độc lập.

const FIELDS_ROOT = ['id', 'title', 'description']
const FIELDS_NODE = ['id', 'rootId', 'parentId', 'title', 'command', 'note', 'x', 'y', 'collapsed', 'mark', 'updatedAt']

function pick(obj, fields) {
  const out = {}
  for (const f of fields) out[f] = obj[f] ?? null
  return out
}

export const packRoot = (r) => pick(r, FIELDS_ROOT)
export const packNode = (n) => ({ ...pick(n, FIELDS_NODE), parentId: n.parentId ?? null, collapsed: !!n.collapsed })

function diffCollection(prevItems, nextItems, pack) {
  const prevById = new Map((prevItems || []).map((x) => [x.id, pack(x)]))
  const nextById = new Map((nextItems || []).map((x) => [x.id, pack(x)]))
  const sets = []
  const deletes = []
  for (const [id, data] of nextById) {
    const before = prevById.get(id)
    if (!before || JSON.stringify(before) !== JSON.stringify(data)) sets.push({ id, data })
  }
  for (const id of prevById.keys()) {
    if (!nextById.has(id)) deletes.push(id)
  }
  return { sets, deletes }
}

// prev/next: { roots: [], nodes: [] } — prev là trạng thái mây gần nhất đã biết.
export function diffLibraries(prev, next) {
  return {
    roots: diffCollection(prev?.roots, next?.roots, packRoot),
    nodes: diffCollection(prev?.nodes, next?.nodes, packNode),
  }
}

export function diffIsEmpty(diff) {
  return !diff.roots.sets.length && !diff.roots.deletes.length
    && !diff.nodes.sets.length && !diff.nodes.deletes.length
}
