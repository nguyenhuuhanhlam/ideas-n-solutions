# Hairline UI — Ghi chú hệ ngôn ngữ giao diện

> Ghi chú về phong cách giao diện đang dùng trong File Watcher. Người
> dùng đặc biệt thích phong cách này và có ý định phát triển nó thành
> một hệ sinh thái riêng để dùng cho các ứng dụng khác. File này là
> bản ghi đầy đủ nhất của hệ ngôn ngữ đó: nguyên tắc, token, bố cục,
> component, hành vi — để sau này tách ra thành thư viện dùng chung
> mà không phải đoán lại từ đầu.
>
> Ghi ngày: 2026-11-13. Bản tham chiếu: File Watcher 0.9.5.

## Nguồn gốc

- Xuất phát từ một file demo do người dùng gửi
  (`~/workspace/user/files/hairline-ui-demo.html`), kèm bản mô tả
  phong cách "Hairline grid" (ruled / divided layout).
- Áp dụng lần đầu vào giao diện web của File Watcher ở **0.6.0**
  (2026-11-13), thay toàn bộ giao diện cũ.
- Tiến hóa sau đó: sidebar co dãn + thu gọn (**0.7.0**), sidebar
  mặc định 320px + ẩn thanh cuộn, vệt mờ báo cuộn (**0.8.0**).
- Bản triển khai tham chiếu duy nhất hiện nay:
  `file-watcher/src/ui.html` — **1 file duy nhất** (~1100 dòng:
  HTML + CSS + JS vanilla), nhúng vào binary Rust, không framework,
  không dependency frontend nào.

## Nguyên tắc cốt lõi

1. **Phân tách chỉ bằng line 1px.** Không card nổi, không shadow,
   không bo góc (radius 0 ở mọi nơi). Mọi ranh giới là một đường kẻ
   mảnh, hoặc là một ô trong lưới `gap: 1px`.
2. **Không khoảng hở giữa các ô.** Padding nằm BÊN TRONG ô
   (12–14px), không nằm giữa các ô. Các vùng dính sát nhau, chỉ
   cách nhau bằng line.
3. **Mật độ cao, nhưng vẫn đọc được.** Càng nhiều thông tin vừa
   màn hình càng tốt: chữ 13px, hàng log 5px padding dọc, tiêu đề
   mục chỉ 11px. Không phung phí pixel vào khoảng trắng trang trí.
4. **Tĩnh lặng.** Phản hồi tương tác bằng đổi nền nhẹ, vệt mờ,
   chớp sáng — không animation lớn, không hiệu ứng bay nhảy.
5. **Chữ là giao diện.** Hierarchy thể hiện bằng cỡ chữ, độ đậm,
   màu (fg/muted/accent) và chữ hoa giãn cách — không bằng khối,
   không bằng màu nền loè loẹt.
6. **Nội dung vừa 1 trang khi có thể.** Sidebar đủ rộng để không
   phải cuộn (mặc định 320px); thanh cuộn là phương án cuối, và
   khi phải cuộn thì thanh trượt cũng ẩn đi, chỉ còn vệt mờ báo
   hiệu.

## Token

### Màu

| Token | Sáng | Tối (`prefers-color-scheme: dark`) |
| --- | --- | --- |
| `--bg` (nền) | `#ffffff` | `#0b0b0c` |
| `--fg` (chữ chính) | `#0a0a0a` | `#ededed` |
| `--muted` (chữ phụ) | `#737373` | `#8a8a8f` |
| `--line` (đường kẻ) | `#e5e5e5` | `#26262a` |
| `--hover` (nền khi rê chuột) | `#fafafa` | `#131315` |
| `--accent` | `#2563eb` | `#60a5fa` |
| `--green` | `#16a34a` | `#4ade80` |
| `--blue` | `#2563eb` | `#60a5fa` |
| `--red` | `#dc2626` | `#f87171` |
| `--purple` | `#9333ea` | `#c084fc` |
| `--fade-from` (đầu vệt mờ) | `rgba(255,255,255,0)` | `rgba(11,11,12,0)` |

Chế độ tối theo hệ thống qua `prefers-color-scheme`, không có nút
đổi tay (chưa cần). Màu ngữ nghĩa (green/blue/red/purple) dùng cho
loại event/trạng thái, luôn đi kèm chữ — không dùng màu nền.

### Chữ

- **Chính:** sans hệ thống, `13px/1.4`
  (`ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto`).
- **Số liệu / dữ liệu:** monospace hệ thống
  (`ui-monospace, SFMono-Regular, Menlo, Consolas`) +
  `font-variant-numeric: tabular-nums` để số thẳng cột.
- **Tiêu đề mục/nhóm:** uppercase, `11px`, `letter-spacing: .06em`,
  màu muted, weight 500. Dùng cho `h6` của sidebar, label của form
  field, tiêu đề cột.
- **Số lớn (stat):** 22px, weight 600.
- **Chữ phụ (hint, footer, delta):** 12–12.5px, màu muted,
  line-height 1.5.

### Khoảng cách & đường kẻ

- Padding trong ô: **12–14px** ngang, 9–14px dọc (tùy mật độ).
- Mọi đường kẻ: `1px solid var(--line)`.
- Khung ngoài app: `border: 1px solid var(--line)`.
- Hàng liền kề: `border-bottom` 1px, bỏ ở phần tử cuối
  (`:last-child`).
- Lưới: container `gap: 1px` + `background: var(--line)`, các ô
  con `background: var(--bg)` — khe 1px lộ màu nền thành đường kẻ.
- Bo góc: **0 ở mọi nơi** (`border-radius: 0` tường minh ở
  button/input/badge/toast).

## Bố cục

### App shell

```
┌──────────────┬─────────────────────────────────┐
│ brand 320px  │ topbar                  44px    │
├──────────────┼─────────────────────────────────┤
│              │ stat strip (4 ô)                │
│   sidebar    ├─────────────────────────────────┤
│   (cuộn      │ toolbar                         │
│    riêng)    ├─────────────────────────────────┤
│              │ tabs                            │
│              ├─────────────────────────────────┤
│              │ log feed (cuộn riêng)           │
└──────────────┴─────────────────────────────────┘
```

- Grid: `sidebar | 1fr`, hàng `44px | 1fr`, cao `100vh`.
- Topbar cao **44px**. Brand và sidebar chung 1 cột.
- Vị trí 4 vùng đặt rõ bằng `grid-column`/`grid-row` (không dựa
  vào auto-placement) để khi thu gọn sidebar, topbar/main không
  bị xếp lại.

### Sidebar

- Mặc định **320px** — đủ rộng để nội dung (danh sách thư mục,
  form cài đặt, thông tin) vừa 1 trang, không phải cuộn.
- **Co dãn:** tay nắm là dải 6px ôm đúng đường line giữa 2 cột,
  bình thường vô hình; rê chuột/kéo thì hiện vạch accent 1px +
  nền xanh nhạt. Kéo trong khoảng **160–480px**, tối đa nửa màn
  hình. Bấm đúp tay nắm để về mặc định. Tay nắm focus được bằng
  bàn phím: phím mũi tên trái/phải nới/thu 10px (giữ Shift: 50px),
  có `role="separator"` + `aria-orientation="vertical"`.
- **Thu gọn:** nút `‹` ở đầu topbar thu gọn hẳn cột trái (cả brand
  lẫn sidebar), nội dung chiếm toàn bộ chiều ngang; bấm `›` để
  mở lại.
- Chiều rộng + trạng thái thu gọn lưu `localStorage` để mở lại
  vẫn giữ. Khi đổi mặc định (220px → 320px ở 0.8.0) thì đổi khóa
  lưu trữ (`file-watcher-side-w2`) để máy đã lưu giá trị cũ cũng
  nhận mặc định mới.
- Cửa sổ thu nhỏ: kẹp lại chiều rộng sidebar cho vừa (listener
  `resize`).

### Responsive (< 800px)

- Về 1 cột: brand / topbar / sidebar / nội dung xếp chồng dọc.
- Sidebar KHÔNG thành thanh ngang cuộn được (như demo gốc) vì
  nó là form cấu hình, không phải nav — xếp chồng lên trên là
  đúng bản chất hơn.
- Tay nắm kéo ẩn; nút thu gọn vẫn dùng được.
- Dải stat 4 ô thành lưới 2×2.
- Vệt mờ báo cuộn ẩn (không còn cuộn nội bộ, trang cuộn chung).

## Component

### Brand

Ô trái topbar: ô vuông đặc 10px (`background: var(--fg)`) +
tên app bằng monospace, weight 600. Không logo cầu kỳ — hình
vuông đặc chính là dấu nhận diện.

### Topbar

- Nút thu gọn sidebar (`‹`/`›`) ở mép trái.
- Identity: `user@pc`, monospace, muted.
- Trạng thái kết nối: ô vuông 8px (không phải chấm tròn) —
  đỏ khi mất kết nối, xanh lá khi đang live — kèm chữ muted.
- Số đếm đẩy sát phải (`margin-left: auto`), mono muted.

### Sidebar

- **Tiêu đề mục (`h6`):** uppercase 11px muted, padding
  `10px 14px`, ngăn dưới bằng line. Kèm số đếm trong ngoặc
  (vd: `Watched folders (3)`).
- **Khối (`sideblock`):** padding `12px 14px`, ngăn dưới bằng
  line, khối cuối không line.
- **Danh sách thư mục:** mỗi dòng mono 12.5px, padding
  `9px 14px`, `word-break: break-all`, nút `×` màu đỏ ở cuối
  (nền trong suốt, không viền).
- **Form:** label uppercase 11px muted trên input; input nền
  trong suốt, viền 1px `--line`, padding `7px 9px`, mono 13px,
  focus thì `outline: 1px solid var(--accent)`; checkbox hàng
  ngang (`checkrow`, gap 8px).
- **Nút:** nền trong suốt, viền 1px `--line`, padding
  `6px 12px`, radius 0; hover đổi nền `--hover` + viền đậm lên
  `--muted`.
- **Hint:** muted 12.5px, line-height 1.5. **Error:** đỏ 13px.
  **OK:** xanh lá 13px. Cả hai giữ `min-height: 1.2em` để
  không nhảy layout khi xuất hiện.
- **Footer:** muted 12.5px, line-height 1.5; `code` trong
  footer dùng mono màu fg.

### Dải stat

4 ô đều nhau (grid `repeat(4, 1fr)`), ngăn bằng `border-right`
(ô cuối không viền). Mỗi ô: nhãn muted + số lớn 22px semibold
+ dòng phụ mono 12px muted (vd: "latest 20:42:00"). Tooltip giải
thích phạm vi số đếm (vd: "Counts within the latest 1000 log lines").

### Toolbar

Hàng ngang `flex-wrap`, gap 12px, padding `10px 14px`, ngăn
dưới bằng line. Checkbox lọc kèm label muted; ô tìm kiếm
`max-width: 260px`; `spacer` đẩy nhóm phải (tự cuộn, nút)
sang mép phải.

### Tabs

Nút tab nền trong suốt, không viền, ngăn nhau bằng
`border-right`; tab đang chọn: chữ fg + **gạch dưới accent
2px** (`box-shadow: inset 0 -2px 0 var(--accent)`). Số đếm
trong tab: mono 12px, opacity .75.

### Log feed (hàng dữ liệu)

- Hàng: flex, gap 10px, padding `5px 14px`, mono 13px,
  `white-space: pre-wrap`, `word-break: break-all`,
  `border-bottom` 1px (hàng cuối không viền), hover đổi nền
  `--hover`.
- **Thời gian:** muted, không co. **Loại event:** rộng cố định
  82px, dạng tag — chữ 11px semibold, **viền 1px cùng màu chữ,
  không nền** (`border: 1px solid currentColor`, padding
  `1px 6px`), màu theo loại (xanh lá/xanh dương/đỏ/tím).
- **user@pc** và **kích thước:** muted, không co. Kích thước
  kèm delta (`+2,8 KB`, dấu phẩy thập phân, đơn vị 1024).
- **Badge đường dẫn:** nút viền 1px `--line`, chữ muted 12px,
  mono, padding `1px 7px`; hover chữ đậm lên fg + viền đậm.
  Hiện 2 đoạn cuối của thư mục cha (vd: `…/project/src`),
  tooltip là full path, bấm để copy full path + tên file.
- **Tên file:** màu fg. **Nút ghim (📌):** nền trong suốt,
  không viền, opacity .35, hover/full khi đã ghim → 1.
- **Nhóm thu gọn (group head):** caret (`▸`/`▾`), số đếm
  `×N` màu accent, đậm; tên file ellipsis 1 dòng; event mới
  nhất + kích thước và delta ròng màu muted. Bấm để bung/thu.
  Event mới vào nhóm đang thu gọn chỉ tăng số đếm + **chớp
  sáng nhẹ** (`@keyframes flash`: nền `rgba(accent, .12)` →
  trong suốt, 1.2s), không tự bung.
- **Trạng thái rỗng:** chữ muted, font sans (không mono),
  padding `20px 14px`, câu đầy đủ hướng dẫn người dùng.

### Quản lý ghim (pin manage)

Khối trên cùng của tab Pinned: `h6` + số lượng; danh sách
ghim mỗi dòng có badge + tên file + **trạng thái đẩy sát phải**
(muted, không xuống dòng: `outside watched folders` / `no events
yet` / `deleted` / `KIND time · N events`) + nút `×` đỏ bỏ ghim.
(Từ 0.9.4 bỏ ô nhập đường dẫn + nút Ghim bên dưới vì gây rối
UX — ghim chỉ bằng nút 📌 ở dòng log.)

### Toast

Cố định giữa dưới màn hình (`bottom: 18px`, `translateX(-50%)`),
nền `--bg`, viền 1px `--line`, radius 0, padding `9px 16px`,
`z-index: 10`, `pointer-events: none`. Hiện/ẩn bằng opacity +
`translateY` (transition .2s). Chỉ dùng cho xác nhận ngắn
(vd: "File pinned.").

### Background color (tint) — từ File Watcher 0.9.0

Các vùng xung quanh (brand, topbar, sidebar, dải stat, toolbar,
tabs) có thể nhuộm 1 trong 6 màu cơ bản (xám, xanh dương, xanh
lá, vàng, đỏ, tím) với độ đậm 0–50% (mặc định 8%). Khu vực log
luôn giữ nền gốc để dễ đọc.

- Cơ chế: JS đặt biến `--tint` (rgba) lên `.app`; các vùng trong
  danh sách dùng `background: var(--tint, transparent)`. Màu +
  độ đậm đã chọn lưu `localStorage`.
- Chọn màu bằng ô vuông 22px (màu nằm trong biến `--sw` của từng
  ô; ô mặc định là đường chéo = không màu); ô đang chọn có viền
  accent 2px. Thanh trượt độ đậm dùng `accent-color`, tắt khi
  chưa chọn màu.
- Vệt mờ của sidebar dùng màu đã pha (tint trên nền, tính theo
  theme sáng/tối hiện tại) để không lộ vệt trắng trên nền đã
  nhuộm; vệt của log giữ nguyên.
- Line trong vùng nhuộm (từ 0.9.3): JS tính màu nền hiệu dụng
  (tint pha trên nền theme), đổi sang HSL, lệch độ sáng cố định
  14 điểm (giữ sắc/bão hòa) — đậm hơn ở theme sáng, sáng hơn ở
  theme tối — rồi ghi đè `--line` riêng trên 6 vùng đã nhuộm.
  Log và viền ngoài app giữ `--line` gốc; không chọn màu thì gỡ
  ghi đè.

### Vệt mờ báo cuộn (thay thanh trượt)

- Thanh cuộn **ẩn hẳn** ở sidebar và log:
  `scrollbar-width: none` + `::-webkit-scrollbar { display: none; }`.
- Thay vào đó, mỗi mép (trên/dưới) có một vệt mờ cao **28px**:
  gradient từ `--bg` (đậm ở mép) tới `--fade-from` (trong suốt
  vào trong). `pointer-events: none`, `opacity` chuyển .25s.
- Logic (JS): vệt trên hiện khi đã cuộn xuống (còn nội dung
  phía trên), vệt dưới hiện khi còn nội dung phía dưới; không
  cuộn được thì cả hai đều ẩn. Cập nhật khi cuộn, khi nội dung
  đổi, khi đổi cỡ cửa sổ.
- Vệt mờ nằm trong khung bọc (`.sidewrap` / `.logwrap`,
  `position: relative`) — KHÔNG nằm trong phần tử cuộn — để
  không bị cuốn theo nội dung khi cuộn.

## Hành vi & chuyển động

- **Hover:** chỉ đổi nền (`--hover`) hoặc đậm viền/chữ. Không
  nâng khối, không shadow, không scale.
- **Focus:** outline 1px accent (input, tay nắm kéo). Mọi điều
  khiển tương tác đều là `<button>`/input thật, bấm được bằng
  bàn phím.
- **Chớp sáng (flash):** chỉ dùng cho "có thứ mới vào nhóm đang
  thu gọn" — 1.2s, nền accent 12% mờ dần về trong suốt.
- **Vệt mờ:** opacity transition .25s — đủ để nhận ra, không
  đủ để gây chú ý.
- **Toast:** opacity + translateY .2s.
- **Không có** animation vào trang, không skeleton loading,
  không spinner trang trí. Trạng thái kết nối thể hiện bằng ô
  vuông màu + chữ, không bằng animation.

## Những gì cố ý KHÔNG làm

- Không áp dụng 2 khối của demo gốc: **lưới 2 cột** (bảng dữ
  liệu + feed hoạt động) vì log đã là feed; **dải tiến độ**
  (progress bar 4px) vì không có dữ liệu tiến độ để hiện.
- Không biến sidebar thành thanh ngang ở mobile (nó là form,
  không phải nav).
- Không card, không shadow (trừ `inset box-shadow` 1–2px dùng
  làm vạch accent), không bo góc, không gradient trang trí
  (trừ vệt mờ báo cuộn — gradient đó là tín hiệu, không phải
  trang trí).
- Không icon font, không ảnh trang trí. Icon duy nhất là ký tự
  unicode (`‹` `›` `×` `📌` `▸` `▾`) và ô vuông đặc.
- Không framework CSS/JS. Toàn bộ hệ thống sống trong 1 file
  HTML + CSS variables + JS vanilla tối thiểu.

## Kỹ thuật triển khai (bản tham chiếu)

- **1 file duy nhất:** `file-watcher/src/ui.html` — HTML, CSS
  (trong `<style>`), JS (trong `<script>`). Nhúng vào binary
  Rust bằng `include_str!`, serve qua HTTP server viết tay.
- **CSS variables** làm token duy nhất (`:root` + media query
  `prefers-color-scheme: dark`). Mọi màu sắc trong file đều
  qua biến — không mã màu rời rạc.
- **JS tối thiểu:** chỉ xử lý trạng thái (tab, nhóm, ghim, tìm
  kiếm), kéo sidebar, vệt mờ, SSE realtime. Không build step,
  không bundler.
- **Kiểm tra:** harness jsdom (`/tmp/fw-ui-test/test.js`, cần
  viết lại nếu `/tmp` bị xóa) tải ui.html thật, giả lập
  fetch/EventSource/clipboard, bấm các nút và kiểm tra DOM —
  46 kiểm tra ở 0.8.0 (stat, badge, nhóm, tab, ghim, tìm kiếm,
  sidebar, vệt mờ).

## Hướng phát triển thành hệ sinh thái riêng

Ý định của người dùng: tách phong cách này ra khỏi File Watcher
để dùng cho các ứng dụng khác. Các bước gợi ý (chưa quyết,
chưa làm):

1. **Tách token + base thành `hairline.css`:** `:root` variables
   (sáng/tối), reset, typography, button, input, hint/error,
   `.fade`, `.toast` — phần không phụ thuộc ứng dụng nào.
2. **Tách component thành các class dùng chung:** `.app` shell,
   `.brand`, `.topbar`, `.sidewrap`/`.side`, `.stats`, `.toolbar`,
   `.tabs`, `.row` (+ `.kind i`, `.pathbadge`, `.pinbtn`,
   `.grouphead`), `.pinmanage`, `.empty`.
3. **Tách JS helper nhỏ, không phụ thuộc DOM cụ thể:**
   `initFades(scroller, topEl, bottomEl)`,
   `initResizableSidebar(...)`, `initTabs(...)` — mỗi hàm nhận
   element và tự gắn listener.
4. **Quy ước đặt tên:** giữ tiền tố rõ ràng khi dùng chung
   (vd: class `.hl-*` hoặc giữ nguyên tên hiện tại nếu chỉ dùng
   nội bộ). Quyết sau khi có ứng dụng thứ hai.
5. **Trang demo/gallery:** một trang HTML tĩnh demo toàn bộ
   component với dữ liệu giả (như file demo gốc) — vừa là tài
   liệu sống, vừa là nơi thử token mới.
6. **Repo/package riêng** khi có từ 2 ứng dụng dùng trở lên
   (vd: repo `hairline-ui` với `hairline.css` +
   `hairline.js` + demo). Trước đó cứ để note này + bản tham
   chiếu trong File Watcher làm nguồn sự thật duy nhất.
7. **Nguyên tắc khi mở rộng:** component mới phải qua được bài
   kiểm tra "có cần card/shadow/radius không?" — nếu có thì
   thiết kế lại bằng line + chữ. Mọi token màu mới phải có cả
   bản sáng và tối.

## Lịch sử

| Phiên bản | Ngày | Thay đổi về UI |
| --- | --- | --- |
| 0.6.0 | 2026-11-13 | Viết lại giao diện theo Hairline grid từ file demo; thêm dải stat 4 ô. |
| 0.7.0 | 2026-11-13 | Sidebar co dãn (kéo tay nắm 160–480px, bấm đúp reset, phím mũi tên) + thu gọn (nút ‹/›), lưu localStorage. |
| 0.8.0 | 2026-11-13 | Sidebar mặc định 320px (từ 220px); ẩn thanh cuộn, vệt mờ 28px báo cuộn ở sidebar + log. |
| 0.9.0 | 2026-11-13 | Chọn màu nền cho các vùng xung quanh (trừ log): 6 màu cơ bản + chỉnh độ đậm 0–50%, lưu localStorage; vệt mờ sidebar pha theo màu nền. |
| 0.9.1 | 2026-11-13 | Sửa lỗi hiển thị đường dẫn Windows: bỏ tiền tố verbatim `\\?\` ở mọi nơi (sidebar, log, file cấu hình) — danh sách thư mục theo dõi hiện dạng thường `C:\...`. |
| 0.9.2 | 2026-11-13 | Tab Đã xóa không hiện nút ghim (dòng thường lẫn tiêu đề nhóm): file đã xóa thì ghim không có tác dụng; bỏ ghim file đã xóa vẫn làm được ở tab Đã ghim. |
| 0.9.3 | 2026-11-13 | Line trong vùng nhuộm tự đổi màu theo tint: giữ sắc, lệch độ sáng cố định 14 điểm (đậm hơn ở theme sáng, sáng hơn ở theme tối); log và viền ngoài app giữ line gốc. |
| 0.9.4 | 2026-11-13 | Tab Đã ghim bỏ ô nhập đường dẫn ghim tay (gây rối UX): chỉ còn danh sách file đã ghim + nút × bỏ ghim; ghim chỉ bằng nút 📌 ở dòng log. |
| 0.9.5 | 2026-11-13 | Toàn bộ app chuyển sang tiếng Anh (UI web + CLI): nhãn, tab, hint, toast, help text, thông báo lỗi, banner; kích thước đổi sang dấu chấm thập phân (`1.5 KB`, `net +1.0 KB`). Comment trong code và tài liệu vẫn tiếng Việt. |

## Tham chiếu

- Bản triển khai: `file-watcher/src/ui.html`
- File demo gốc: `~/workspace/user/files/hairline-ui-demo.html`
- Tài liệu File Watcher: `file-watcher/README.md` (mục Giao diện web)
- Harness kiểm tra UI: `/tmp/fw-ui-test/test.js` (tạm, viết lại khi mất)
