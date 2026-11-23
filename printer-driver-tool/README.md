# printer-driver-tool

CLI lấy driver máy in trên Windows 11, viết bằng Rust. Liệt kê driver
đã cài, xem chi tiết từng driver (ngày, phiên bản, hãng, toàn bộ file),
xem máy in nào đang dùng driver nào, xuất JSON/CSV, sao lưu file
driver ra thư mục và cài lại driver từ bản backup lên máy khác
(lệnh `restore`).

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
printer-driver-tool restore D:\driver-backup               cài driver từ backup
                                                           (cần quyền administrator)
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

Manifest v2 (từ bản 0.2.0) ghi thêm mảng `files` ánh xạ từng đường dẫn
gốc sang tên file thật trong thư mục backup, để lệnh `restore` tìm đúng
file kể cả khi tên đã bị đổi thành `__2`.

### `restore <thư mục backup>`

Cài driver từ bản backup lên máy này (hoặc máy chủ khác với `--server`),
dùng API `AddPrinterDriverEx` với cờ `APD_COPY_ALL_FILES |
APD_COPY_FROM_DIRECTORY` — spooler tự copy toàn bộ file vào thư mục
driver của hệ thống. BẮT BUỘC chạy terminal với quyền administrator
(Windows yêu cầu quyền SeLoadDriverPrivilege để cài driver).

- Đọc manifest `driver-info.json`, kiểm tra đủ file rồi mới cài —
  thiếu file nào thì dừng và liệt kê rõ, không cài dở dang.
- Manifest v1 (bản 0.1.0, không có mảng `files`) vẫn restore được:
  tool tìm file theo tên, kể cả tên đã đổi `__2`.
- Driver đã tồn tại thì từ chối, trừ khi thêm `--force` để cài đè.
- Sau khi cài, tool liệt kê lại để kiểm chứng driver đã xuất hiện.
- Chỉ cài driver, chưa tạo máy in — muốn in được còn phải thêm máy in
  và cổng (bằng tay hoặc lệnh Add-Printer của PowerShell).
- Backup từ máy x64 thì restore lên máy x64. Driver v4/inbox như
  Microsoft IPP Class Driver thì khỏi restore, máy Win 11 nào cũng có.

## Tùy chọn chung

- `--server \\MAY`: máy chủ in từ xa (mặc định: máy này).
- `--env "Windows x64"`: môi trường driver (mặc định: môi trường hiện
  tại; thường gặp: `Windows x64`, `Windows NT x86`, `Windows ARM64`).
- `--json` / `--csv`: định dạng xuất cho `list`, `printers`, `export`.
- `--out <file>`: ghi kết quả ra file.
- `--force`: `restore` cài đè khi driver đã tồn tại.
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

Trên VM của Muse, MinGW cài bằng apt nằm ở `/usr` nên mất khi VM bị
thay thế — bộ công cụ bền vững là llvm-mingw ở `~/workspace/llvm-mingw`
(tải 23-11-2026, bản 20261117, LLVM 23.1.6). Build bằng llvm-mingw:

```sh
CARGO_TARGET_X86_64_PC_WINDOWS_GNU_LINKER=$HOME/workspace/llvm-mingw/bin/x86_64-w64-mingw32-gcc \
RUSTFLAGS="-C link-arg=-L$HOME/workspace/llvm-mingw/rust-shims" \
cargo build --release --target x86_64-pc-windows-gnu
```

(`rust-shims/` chứa `libgcc.a` / `libgcc_eh.a` trỏ sang compiler-rt và
libunwind của llvm-mingw, vì Rust mặc định link `-lgcc -lgcc_eh` mà
llvm-mingw dùng clang nên không có hai lib đó. Xem `~/AGENTS.md`.)

## Vì sao nhẹ

- Chỉ 1 dependency trực tiếp trên Windows: crate `windows` 0.58
  (gọi Win32 API). JSON/CSV/bảng và parse CLI đều viết tay, không
  thêm crate nào.
- Profile release tối ưu như file-watcher: `opt-level = 3`, LTO toàn
  bộ, 1 codegen unit, strip symbol, `panic = "abort"`.
- Exe release ~480 KiB (bản 0.2.0), 1 file, chỉ liên kết DLL hệ thống
  (kernel32, winspool.drv, msvcrt...), không cần DLL kèm theo.

## Kiểm chứng

- 40 unit test (lib 33 + bin 7) đều đạt trên Linux: parse multi-sz,
  đổi FILETIME/version (cả hai chiều), escape JSON/CSV, bảng, sao lưu
  file + manifest, JSON parser, đọc manifest v1/v2, tìm file backup,
  parse tham số dòng lệnh (kể cả `restore --force`).
- `cargo check` sạch cho target `x86_64-pc-windows-gnu`, `cargo fmt`
  sạch.
- Exe Windows build thật bằng llvm-mingw, kiểm tra bằng `llvm-objdump`:
  PE32+ x86-64, import đúng `EnumPrinterDriversW` / `EnumPrintersW` /
  `AddPrinterDriverExW` từ winspool.drv, chỉ dùng DLL hệ thống.
- Đã chạy thử trên máy Windows thật (23-11): `printers` liệt kê đúng
  7 máy in; user báo các lệnh `list` / `show` / `export` / `backup`
  đều chạy ok. Lệnh `restore` (mới, bản 0.2.0) chưa chạy thử trên máy
  thật — cần test với quyền administrator trên máy đích.
