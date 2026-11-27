// Dữ liệu mẫu cho bản UI demo. Khi nối Firebase, seed này chỉ dùng để tạo
// kho lần đầu cho tài khoản chưa có dữ liệu.
// Cấu trúc node khớp với document Firestore đã thống nhất:
// { id, rootId, parentId, title, command, note, x, y, collapsed, updatedAt }
// x/y để trống ở đây — layout lần đầu do store.js tự dàn cây.

let seq = 0
const n = (rootId, parentId, title, command = '', note = '') => ({
  id: `${rootId}-${++seq}`,
  rootId,
  parentId,
  title,
  command,
  note,
  collapsed: false,
})

function npmTree() {
  seq = 0
  const R = 'npm'
  const root = n(R, null, 'npm', '', 'Node Package Manager — Windows, CMD/PowerShell dùng như nhau')
  const list = n(R, root.id, 'Liệt kê gói đã cài')
  const inst = n(R, root.id, 'Cài đặt / gỡ bỏ')
  const upd = n(R, root.id, 'Cập nhật')
  const info = n(R, root.id, 'Thông tin môi trường')
  return {
    root: { id: R, title: 'npm', description: 'Lệnh npm trên Windows' },
    nodes: [
      root, list, inst, upd, info,
      n(R, list.id, 'Gói global đã cài', 'npm list -g --depth=0', 'Chỉ liệt kê gói chính, không liệt kê cây phụ thuộc'),
      n(R, list.id, 'Gói của project hiện tại', 'npm list --depth=0', 'Chạy trong thư mục có package.json'),
      n(R, list.id, 'Thư mục gói global (Windows)', '%AppData%\\npm\\node_modules', 'Mở bằng File Explorer để xem trực tiếp'),
      n(R, inst.id, 'Cài một gói global', 'npm install -g <tên-gói>', 'Ví dụ: npm install -g typescript'),
      n(R, inst.id, 'Cài gói cho project', 'npm install <tên-gói>', 'Ghi vào dependencies của package.json'),
      n(R, inst.id, 'Gỡ gói global', 'npm uninstall -g <tên-gói>'),
      n(R, upd.id, 'Xem gói global đã cũ', 'npm outdated -g'),
      n(R, upd.id, 'Cập nhật gói global', 'npm update -g <tên-gói>'),
      n(R, info.id, 'Phiên bản Node / npm', 'node -v && npm -v', 'Kiểm tra trước khi đối chiếu kho gói — mỗi bản Node có kho global riêng'),
      n(R, info.id, 'Xuất danh sách dạng JSON', 'npm list -g --depth=0 --json', 'Để xử lý tiếp bằng script'),
    ],
  }
}

function gitTree() {
  seq = 0
  const R = 'git'
  const root = n(R, null, 'Git', '', 'Các lệnh dùng hằng ngày')
  const daily = n(R, root.id, 'Hằng ngày')
  const branch = n(R, root.id, 'Nhánh')
  const undo = n(R, root.id, 'Hoàn tác')
  return {
    root: { id: R, title: 'Git', description: 'Lệnh Git cơ bản' },
    nodes: [
      root, daily, branch, undo,
      n(R, daily.id, 'Trạng thái', 'git status'),
      n(R, daily.id, 'Commit', 'git add -A && git commit -m "<thông-điệp>"'),
      n(R, daily.id, 'Đẩy lên remote', 'git push'),
      n(R, daily.id, 'Kéo về', 'git pull'),
      n(R, daily.id, 'Lịch sử gọn', 'git log --oneline -10'),
      n(R, branch.id, 'Liệt kê nhánh', 'git branch -a'),
      n(R, branch.id, 'Tạo và chuyển nhánh', 'git switch -c <tên-nhánh>'),
      n(R, branch.id, 'Chuyển nhánh', 'git switch <tên-nhánh>'),
      n(R, undo.id, 'Bỏ thay đổi 1 file', 'git checkout -- <file>'),
      n(R, undo.id, 'Xem khác biệt', 'git diff'),
    ],
  }
}

function dockerTree() {
  seq = 0
  const R = 'docker'
  const root = n(R, null, 'Docker', '', 'Container và image')
  const cont = n(R, root.id, 'Container')
  const img = n(R, root.id, 'Image')
  return {
    root: { id: R, title: 'Docker', description: 'Lệnh Docker cơ bản' },
    nodes: [
      root, cont, img,
      n(R, cont.id, 'Container đang chạy', 'docker ps'),
      n(R, cont.id, 'Tất cả container', 'docker ps -a'),
      n(R, cont.id, 'Log của container', 'docker logs -f <tên-container>'),
      n(R, cont.id, 'Vào shell container', 'docker exec -it <tên-container> sh'),
      n(R, img.id, 'Liệt kê image', 'docker images'),
      n(R, img.id, 'Xoá image', 'docker rmi <tên-image>'),
      n(R, img.id, 'Dọn dẹp hệ thống', 'docker system prune', 'Cẩn thận: xoá mọi thứ không dùng tới'),
    ],
  }
}

// Mặc định khi mở app: chỉ hiện node gốc + các node cận gốc,
// các nhánh ở trạng thái đóng (collapsed) — bấm nút +N mới bung ra.
export function collapseTopLevel(nodes) {
  const rootIds = new Set(nodes.filter((x) => !x.parentId).map((x) => x.id))
  const hasKids = new Set(nodes.map((x) => x.parentId).filter(Boolean))
  return nodes.map((x) =>
    rootIds.has(x.parentId) && hasKids.has(x.id) ? { ...x, collapsed: true } : x)
}

// Vài lệnh hay dùng được đánh dấu màu sẵn làm ví dụ cho tính năng mark
const SEED_MARKS = {
  'Gói global đã cài': 'green',
  'Trạng thái': 'red',
  'Đẩy lên remote': 'blue',
  'Tất cả container': 'purple',
}

export function seedLibrary() {
  const trees = [npmTree(), gitTree(), dockerTree()]
  const nodes = collapseTopLevel(trees.flatMap((t) => t.nodes))
    .map((x) => (SEED_MARKS[x.title] ? { ...x, mark: SEED_MARKS[x.title] } : x))
  return {
    roots: trees.map((t) => t.root),
    nodes,
  }
}
