// Hàm thuần về hình học cây — dùng chung cho canvas render, hit-test và test.
// Node: { id, parentId, title, command, note, x, y, collapsed }

export const NODE_GAP_Y = 86
export const LEVEL_GAP_X = 292

export function nodeSize(node) {
  const titleW = 28 + (node.title || '').length * 8.2
  const cmdW = node.command ? 34 + node.command.length * 7.4 : 0
  const w = Math.round(Math.min(340, Math.max(160, titleW, cmdW)))
  const h = node.command ? 58 : 40
  return { w, h }
}

export function childrenOf(nodes, parentId) {
  return nodes.filter((x) => x.parentId === parentId)
}

export function rootNodeOf(nodes) {
  return nodes.find((x) => !x.parentId) || null
}

export function subtreeIds(nodes, id) {
  const out = []
  const walk = (cur) => {
    out.push(cur)
    for (const c of childrenOf(nodes, cur)) walk(c.id)
  }
  walk(id)
  return out
}

// Node nhìn thấy được: ẩn toàn bộ con cháu của node đang thu gọn (collapsed).
export function visibleNodes(nodes) {
  const byId = new Map(nodes.map((x) => [x.id, x]))
  const hidden = new Set()
  for (const node of nodes) {
    let p = node.parentId ? byId.get(node.parentId) : null
    while (p) {
      if (p.collapsed) { hidden.add(node.id); break }
      p = p.parentId ? byId.get(p.parentId) : null
    }
  }
  return nodes.filter((x) => !hidden.has(x.id))
}

export function hiddenCount(nodes, id) {
  return subtreeIds(nodes, id).length - 1
}

// Dàn cây lần đầu (hoặc khi bấm "Sắp xếp lại"): gốc ở trái, nhánh tỏa sang
// phải, lá xếp đều theo chiều dọc. Vị trí sau đó do người dùng kéo tự do.
export function layoutTree(input) {
  const nodes = input.map((x) => ({ ...x }))
  const root = rootNodeOf(nodes)
  if (!root) return nodes
  let cursorY = 40
  const place = (node, depth) => {
    node.x = 40 + depth * LEVEL_GAP_X
    // Bố trí cho MỌI node kể cả node đang ẩn trong nhánh đóng — nếu bỏ qua,
    // node ẩn sẽ không có tọa độ và khi bung nhánh ra sẽ hỏng vị trí.
    const kids = childrenOf(nodes, node.id)
    if (!kids.length) {
      node.y = cursorY
      cursorY += NODE_GAP_Y
    } else {
      for (const k of kids) place(k, depth + 1)
      node.y = Math.round((kids[0].y + kids[kids.length - 1].y) / 2)
    }
  }
  place(root, 0)
  return nodes
}

export function treeBounds(nodes) {
  if (!nodes.length) return { minX: 0, minY: 0, maxX: 800, maxY: 600 }
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const node of nodes) {
    const { w, h } = nodeSize(node)
    minX = Math.min(minX, node.x); minY = Math.min(minY, node.y)
    maxX = Math.max(maxX, node.x + w); maxY = Math.max(maxY, node.y + h)
  }
  return { minX, minY, maxX, maxY }
}

// Biến chờ trong lệnh: <tên-gói>, {{tên}} …
export function placeholders(command) {
  if (!command) return []
  const out = []
  const re = /<([^<>{}]+)>|\{\{([^}]+)\}\}/g
  let m
  while ((m = re.exec(command))) out.push({ raw: m[0], name: (m[1] || m[2]).trim() })
  return out
}

export function fillPlaceholders(command, values) {
  let out = command
  for (const { raw, name } of placeholders(command)) {
    if (values[name]) out = out.split(raw).join(values[name])
  }
  return out
}

export function foldText(s) {
  return (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase()
}
