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

function powershellTree() {
  seq = 0
  const R = 'powershell'
  const root = n(R, null, 'PowerShell', '', 'Windows PowerShell 5.1 / PowerShell 7 — nhiều lệnh cần mở bằng quyền Administrator')
  const help = n(R, root.id, 'Trợ giúp & khám phá')
  const files = n(R, root.id, 'File & thư mục')
  const proc = n(R, root.id, 'Tiến trình & dịch vụ')
  const sys = n(R, root.id, 'Hệ thống & nhật ký')
  const net = n(R, root.id, 'Mạng')
  const env = n(R, root.id, 'Môi trường & script')
  const marks = { 'Khởi động lại dịch vụ in': 'green', 'Cập nhật mọi ứng dụng': 'blue' }
  const nodes = [
    root, help, files, proc, sys, net, env,
    n(R, help.id, 'Trợ giúp của một lệnh', 'Get-Help <tên-lệnh> -Examples', 'Xem ví dụ thực tế của cmdlet'),
    n(R, help.id, 'Tìm lệnh theo từ khoá', 'Get-Command *<từ-khoá>*'),
    n(R, help.id, 'Xem thuộc tính của đối tượng', 'Get-Process | Get-Member', 'Liệt kê property/method của đối tượng trả về'),
    n(R, help.id, 'Phiên bản PowerShell', '$PSVersionTable.PSVersion'),
    n(R, help.id, 'Lịch sử lệnh đã gõ', 'Get-History'),
    n(R, files.id, 'Liệt kê file', 'Get-ChildItem', 'Alias: dir, ls'),
    n(R, files.id, 'Tìm file theo đuôi', 'Get-ChildItem <đường-dẫn> -Recurse -Filter *.<đuôi>', 'Tìm trong cả thư mục con'),
    n(R, files.id, 'Chuyển thư mục', 'Set-Location <đường-dẫn>', 'Alias: cd'),
    n(R, files.id, 'Tạo thư mục mới', 'New-Item -ItemType Directory -Path <đường-dẫn>'),
    n(R, files.id, 'Copy file / thư mục', 'Copy-Item <nguồn> <đích> -Recurse'),
    n(R, files.id, 'Xoá file / thư mục', 'Remove-Item <đường-dẫn> -Recurse', 'Cẩn thận: xoá hẳn, không qua thùng rác'),
    n(R, files.id, 'Xem cuối file log', 'Get-Content <file> -Tail 50 -Wait', '-Wait để theo dõi tiếp khi file ghi thêm'),
    n(R, files.id, 'Tìm chữ trong file', 'Select-String -Path <file> -Pattern "<chuỗi>"'),
    n(R, files.id, 'Nén thư mục thành ZIP', 'Compress-Archive -Path <thư-mục>\\* -DestinationPath <file>.zip'),
    n(R, proc.id, 'Top 10 tiến trình ngốn CPU', 'Get-Process | Sort-Object CPU -Descending | Select-Object -First 10'),
    n(R, proc.id, 'Top 10 tiến trình ngốn RAM', 'Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 10'),
    n(R, proc.id, 'Dừng tiến trình theo tên', 'Stop-Process -Name <tên> -Force', 'Cẩn thận: mất dữ liệu chưa lưu của tiến trình đó'),
    n(R, proc.id, 'Dịch vụ đang chạy', 'Get-Service | Where-Object Status -eq Running'),
    n(R, proc.id, 'Khởi động lại dịch vụ in', 'Restart-Service Spooler', 'Hay dùng khi kẹt lệnh in'),
    n(R, proc.id, 'Đặt dịch vụ tự khởi động', 'Set-Service -Name <tên-dịch-vụ> -StartupType Automatic'),
    n(R, sys.id, 'Thông tin máy tổng quát', 'Get-ComputerInfo'),
    n(R, sys.id, 'Dung lượng trống các ổ đĩa', 'Get-Volume | Where-Object DriveLetter'),
    n(R, sys.id, 'Máy đã chạy bao lâu', '(Get-Date) - (Get-CimInstance Win32_OperatingSystem).LastBootUpTime'),
    n(R, sys.id, '20 sự kiện hệ thống mới nhất', 'Get-WinEvent -LogName System -MaxEvents 20'),
    n(R, sys.id, 'Cập nhật mọi ứng dụng', 'winget upgrade --all --accept-package-agreements --accept-source-agreements'),
    n(R, net.id, 'Cấu hình IP / gateway / DNS', 'Get-NetIPConfiguration'),
    n(R, net.id, 'Kiểm tra 1 cổng TCP của máy khác', 'Test-NetConnection <máy> -Port <cổng>', 'Alias: tnc — thay cho ping + telnet'),
    n(R, net.id, 'Ping', 'Test-Connection <máy> -Count 4'),
    n(R, net.id, 'Các cổng đang nghe', 'Get-NetTCPConnection -State Listen'),
    n(R, net.id, 'Tiến trình đang giữ 1 cổng', 'Get-NetTCPConnection -LocalPort <cổng> | Select-Object OwningProcess'),
    n(R, net.id, 'Phân giải DNS', 'Resolve-DnsName <tên-miền>'),
    n(R, net.id, 'Xoá cache DNS', 'Clear-DnsClientCache'),
    n(R, net.id, 'Tải file từ web', 'Invoke-WebRequest <url> -OutFile <tên-file>'),
    n(R, env.id, 'Cho phép chạy file script .ps1', 'Set-ExecutionPolicy -Scope CurrentUser RemoteSigned', 'Mặc định Windows chặn chạy script'),
    n(R, env.id, 'Xem biến PATH', "$env:PATH -split ';'"),
    n(R, env.id, 'Xuất kết quả ra CSV', 'Get-Process | Export-Csv <file>.csv -NoTypeInformation'),
    n(R, env.id, 'Chạy lệnh trên máy khác', 'Invoke-Command -ComputerName <máy> -ScriptBlock { Get-Service }', 'Cần bật WinRM ở máy đích'),
  ].map((x) => (marks[x.title] ? { ...x, mark: marks[x.title] } : x))
  return {
    root: { id: R, title: 'PowerShell', description: 'Lệnh PowerShell hay dùng trên Windows' },
    nodes,
  }
}

// Các root mẫu để nạp THÊM vào kho đã có (nút "Bộ mẫu" ở sidebar desktop).
// Không nằm trong seedLibrary: kho mới tạo vẫn bắt đầu bằng npm/Git/Docker,
// người dùng tự nạp thêm khi cần — nạp không đụng tới dữ liệu hiện có.
export function templateTrees() {
  return [powershellTree()]
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
