# printer-driver-tool

CLI lấy driver máy in trên Windows 11, viết bằng Rust. Liệt kê driver
đã cài, xem chi tiết từng driver (ngày, phiên bản, hãng, toàn bộ file),
xem máy in nào đang dùng driver nào, xuất JSON/CSV và sao lưu file
driver ra thư mục.

Dùng trực tiếp Print Spooler API (`EnumPrinterDriversW` level 6,
`EnumPrintersW` level 2) nên không cần PowerShell, WMI hay cài thêm gì.
Exe 1 file duy nhất, chạy ngay không cần cài Rust trên máy dùng.

## Lệnh

```bat
printer-driver-tool                                        liệt kê driver đã cài
printer-driver-tool show "Microsoft IPP Class Driver"       chi tiết 1 driver
printer-driver-tool printers                               máy in + driver đang dùng
printer-driver-tool export --out drivers.json              xuất JSON ra file
printer-driver-tool export --format csv --out drivers.csv  xuất CSV ra file
printer-driver-tool backup "HP LaserJet Pro" D:\driver-backup
                                                           sao lưu file driver
printer-driver-tool list --server \\MAY-CHU-IN --json      driver trên máy chủ khác
printer-driver-tool list --env "Windows NT x86"            driver 32-bit
printer-driver-tool --help
```

### `list` (mặc định)

Bảng: tên driver, môi trường, kiểu (v3/v4), ngày driver, phiên bản, hãng.
Thêm `--json` hoặc `--csv` để xuất theo định dạng đó.

### `show <tên driver>`

Chi tiết đầy đủ: ngày/phiên bản/hãng/URL hãng, monitor, kiểu dữ liệu
mặc định, tên cũ (nếu driver từng đổi tên) và toàn bộ file thuộc driver
kèm kích thước từng file (hoặc ghi rõ file nào không còn trên đĩa).
Tên khớp chính xác, không phân biệt hoa/thường. Nếu cùng tên tồn tại
ở nhiều môi trường thì hiện tất cả.

### `printers`

Máy in local + máy in đã kết nối, mỗi máy kèm driver đang dùng, cổng,
số việc chờ và trạng thái (Sẵn sàng / Đang in / Hết giấy / Kẹt giấy /
Ngoại tuyến...).

### `export`

Xuất danh sách driver, mặc định JSON. `--format csv` hoặc `--format table`
để đổi. `--out <file>` ghi ra file, không có thì in ra stdout.

### `backup <tên driver> <thư mục>`

Copy toàn bộ file của driver (file chính, data, config, help, file phụ
thuộc) vào thư mục đích + ghi thêm `driver-info.json` (manifest mô tả
driver). Hai file trùng tên thì file sau tự đổi thành `__2`, `__3`...
Báo rõ file nào copy được, file nào không còn trên đĩa, file nào lỗi.

## Tùy chọn chung

- `--server \\MAY`: máy chủ in từ xa (mặc định: máy này).
- `--env "Windows x64"`: môi trường driver (mặc định: môi trường hiện
  tại; thường gặp: `Windows x64`, `Windows NT x86`, `Windows ARM64`).
- `--json` / `--csv`: định dạng xuất cho `list`, `printers`, `export`.
- `--out <file>`: ghi kết quả ra file.
- `-h, --help`, `-V, --version`.

Mã thoát: 0 = xong, 1 = lỗi khi chạy (vd không tìm thấy driver, lỗi
Win32), 2 = sai cú pháp dùng.

## Ghi chú

- Liệt kê và xuất không cần quyền admin. Sao lưu có thể cần chạy
  terminal với quyền administrator nếu file driver nằm trong thư mục
  hệ thống bị khóa đọc.
- Driver v4 (chuẩn trên Windows 11, máy in IPP) thường dùng chung file
  hệ thống (vd Microsoft IPP Class Driver) nên bản sao lưu có thể gồm
  cả file dùng chung, không chỉ file riêng của hãng.
- Ngày driver lấy từ FILETIME trong DRIVER_INFO_6 (giờ UTC, chỉ lấy
  phần ngày). Driver không khai báo ngày thì hiện `-`.
- Console tự chuyển sang UTF-8 (code page 65001) để tiếng Việt hiển
  thị đúng trên cmd/PowerShell cũ.

## Build

```sh
cargo build --release
```

- Windows (MSVC): chạy `target\release\printer-driver-tool.exe`.
- Linux/macOS: build được (để chạy test), nhưng lệnh `list`/`show`/
  `printers`/`export`/`backup` sẽ báo "chỉ chạy trên Windows" — phần
  gọi spooler chỉ biên dịch trên Windows.

Build chéo exe Windows từ Linux (đã làm sẵn trong `.cargo/config.toml`,
cần `x86_64-w64-mingw32-gcc`):

```sh
cargo build --release --target x86_64-pc-windows-gnu
# -> target/x86_64-pc-windows-gnu/release/printer-driver-tool.exe
```

## Vì sao nhẹ

- Chỉ 1 dependency trực tiếp trên Windows: crate `windows` 0.58
  (gọi Win32 API). JSON/CSV/bảng và parse CLI đều viết tay, không
  thêm crate nào.
- Profile release tối ưu như file-watcher: `opt-level = 3`, LTO toàn
  bộ, 1 codegen unit, strip symbol, `panic = "abort"`.
- Exe release ~395 KiB, 1 file, chỉ liên kết DLL hệ thống
  (kernel32, winspool.drv, msvcrt...), không cần DLL kèm theo.

## Kiểm chứng

- 24 unit test (lib 19 + bin 5) đều đạt trên Linux: parse multi-sz,
  đổi FILETIME/version, escape JSON/CSV, bảng, sao lưu file + manifest,
  parse tham số dòng lệnh.
- `cargo check` sạch cho target `x86_64-pc-windows-gnu`, `cargo fmt`
  sạch.
- Exe Windows build thật bằng MinGW, kiểm tra bằng `objdump`: PE32+
  x86-64, import đúng `EnumPrinterDriversW` / `EnumPrintersW` từ
  winspool.drv, chỉ dùng DLL hệ thống.
- Chưa chạy thử trên máy Windows thật — cần test lại trên máy chính
  (máy chưa có máy in nào vẫn chạy được, sẽ báo "không tìm thấy driver").
