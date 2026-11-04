# PixeLab

Game 2D side-scroller chặt chém có yếu tố RPG, viết bằng Canvas 2D +
JavaScript thuần, 1 file HTML tĩnh duy nhất, không cần build.

## Bước 1 (hiện tại): mặt đất + nhân vật

Bản cũ kiểu Mario (địch, xu, gạch, ống, hố, lâu đài, vệt kiếm gồng)
đã được gỡ bỏ hoàn toàn ngày 2026-11-04. Bản mới bắt đầu lại từ:
mặt đất phẳng dài 2400px, camera bám theo nhân vật, và nhân vật
chính dùng bộ sprite mới do user cung cấp. Chưa có địch, chưa có
màn thắng/thua — các bước sau sẽ bổ sung từng phần (địch, HP/EXP
thật, skill, trang bị...).

- Mở `index.html` trực tiếp trong trình duyệt, hoặc qua GitHub Pages:
  https://nguyenhuuhanhlam.github.io/ideas-n-solutions/platformer-game/
- Phím: `←` `→` hoặc `A` `D` đi bộ, giữ `Shift`/`X` để chạy,
  `Z` / `Space` / `↑` nhảy, `J` chém combo, `P` tạm dừng,
  `R` chơi lại, `M` tắt/bật tiếng. Trên mobile là tay kiểu NES:
  D-pad chữ thập bên trái (◀ ▶ di chuyển, ▲ nhảy), giữa có nút dẹt
  Chạy (giữ) và Dừng, bên phải 2 nút tròn đỏ B = Nhảy, A = Chém.

## Cơ chế bước 1

- Màn hình logic 480x270 (16:9), mặt đất tại y=210, thế giới rộng
  2400px, camera kẹp trong biên thế giới.
  - Vật lý: đi bộ 90px/s, chạy 150px/s, nhảy vận tốc -260px/s với
  trọng lực 700px/s² (cao khoảng 48px, thời gian bay 0.74s), chạm
  đất có bụi nhẹ.
- Chém combo: `J` đánh 1 chuỗi 7 frame (combo_1 3 frame + combo_1_end
  4 frame, 0.06s/frame, tổng 0.42s), chém được cả khi đang nhảy
  (chém dưới đất thì khóa di chuyển, chém trên không thì giữ đà bay
  và vẫn lái được theo hướng),
  vùng chém trước mặt đã để sẵn trong code (`attackBox()`) để bước
  thêm địch dùng ngay, hiện chưa có mục tiêu.
- HUD RPG khung sẵn (chưa có nguồn tăng/giảm thật): Lv 1, HP 100/100,
  MP 50/50, EXP 0/100.
 - Môi trường: bầu trời gradient, mặt trời, núi xa parallax 0.3,
  cây gần parallax 0.6 (vẽ bằng code); mặt đất vẽ bằng Tileset.png
  (xem mục Tileset dưới đây), không còn nền đất vẽ bằng hình chữ
  nhật màu nữa.
- Âm thanh tối giản bằng WebAudio: tiếng nhảy, tiếng chém, không
  nhạc nền.

## Sprite nhân vật (đo trực tiếp từ file PNG)

- Mỗi sheet là dãy frame 128x128, nền trong suốt. File
  `male_hero-design.png` (1 frame) làm mốc: bbox x41-73, y43-80.
 - Nhân vật đứng (sau khi khử viền đen): rộng 30px, cao 36px, tâm
  ngang vẫn x=57, đường chân vẫn y=80 trong frame. Viền đen được khử
  bằng cách xóa các pixel đen thuần (0,0,0) ở mép ngoài của nhân vật
  (pixel đen có kề trong suốt), giữ nguyên các pixel đen bên trong
  (mắt...) và các màu tối khác; alpha của sheet chỉ có 0/255 nên
  không còn quầng mờ. Tất cả frame khác đều neo theo đúng 2 mốc này
  (không neo theo đáy bbox từng frame, vì frame nhảy/rơi có chân
  co lên tới y=75).
  - Vẽ đúng tỷ lệ 1/1 (SCALE=1): khung vẽ 128x128 nguyên gốc, nhân
  vật cao 36px (sau khử viền), rộng thân 30px, chân trùng chân hitbox,
  tâm trùng tâm hitbox.
- Hitbox: rộng 15, cao 32 (thu đúng nửa từ 30x64), chân tại mặt đất.
- Animation đã dùng (8 sheet nhúng base64 vào file):
  `idle` 10 frame (0.12s/frame), `walk` 10 (0.09s), `run` 10 (0.07s),
  `jump` 6 (lấy frame 0 lúc cất bước, frame 2 lúc đang lên),
  `fall` 4 (0.06s/frame, lúc bắt đầu rơi), `fall_loop` 3 (0.1s/frame,
  rơi ổn định), `combo_1` 3 + `combo_1_end` 4 (chém). Vùng chém
  trước mặt cũng thu theo tỷ lệ: rộng 35, cao 25.
 - Lật ngang khi quay trái bằng cách scale(-1, 1) quanh tâm nhân vật.

## Tileset nền đất / platform (file Tileset.png 256x128)

- File gốc do user cung cấp ngày 2026-11-04, nhúng base64 vào game,
  vẽ đúng tỷ lệ 1/1. Alpha của file chỉ có 0/255; các vùng xanh lá
  / đen ở mép file có alpha=0 nên trong game sẽ trong suốt, không
  phải tile thật — chỉ dùng các vùng alpha>0 đã đo dưới đây.
- Mặt đất hiện tại: dải cỏ x192-255, y13-31 (64x19, cỏ thưa y13-17,
  đặc từ y18) lặp ngang, đỉnh cỏ nhô 5px trên đường chân GROUND_Y;
  thân đất là ô đất vuông x48-63, y48-63 (16x16, đặc 255/256) lặp
  từ GROUND_Y+14 (= đáy dải cỏ) xuống hết màn hình.
- Platform nổi cho tương lai (đã chuẩn bị, chưa đặt vào màn chơi):
  mảng `platforms` đang rỗng; mỗi platform { x, y, w } với y là đường
  mặt đứng, w là chiều rộng (bội số 16). Hàm `drawPlatform()` vẽ mặt
  bằng mảnh cỏ hẹp x16-31, y13-31 (16x19) lặp ngang + 1 hàng ô đất
  dưới mặt cỏ. Bước sau chỉ cần thêm platform vào mảng + va chạm
  dùng đúng x/y/w này là chạy.
- Mẫu khác đã đo, để dành: khối đất lớn x112-175, y13-79 (64x67),
  cột đất x80-95, y13-79 (16x67), khối trang trí đầu lâu x80-111,
  y96-127 và khối ô cửa x128-159, y96-127 (32x32), ô đất vuông
  x48-63, y80-95 và y112-127, cửa x16-31, y48-63, gai x16-31,
  y82-95 (16x14).

## Deploy

App này là 1 file HTML tĩnh duy nhất, không có `package.json` và
không cần build. Workflow Pages chỉ copy `platformer-game/index.html`
vào `_site/platformer-game/` (khác với các app Vite/React còn lại).
