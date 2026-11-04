# Samurai in Mario World

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
  `R` chơi lại, `M` tắt/bật tiếng. Trên mobile có nút ◀ ▶, Chạy,
  Nhảy, Chém.

## Cơ chế bước 1

- Màn hình logic 480x270 (16:9), mặt đất tại y=210, thế giới rộng
  2400px, camera kẹp trong biên thế giới.
 - Vật lý (thu cùng tỷ lệ 1/1 để cảm giác không lệch): đi bộ 50px/s,
  chạy 90px/s, nhảy vận tốc -260px/s với trọng lực 700px/s² (cao
  khoảng 48px, thời gian bay như cũ 0.74s), chạm đất có bụi nhẹ.
- Chém combo: `J` đánh 1 chuỗi 7 frame (combo_1 3 frame + combo_1_end
  4 frame, 0.06s/frame, tổng 0.42s), khóa di chuyển trong lúc chém,
  vùng chém trước mặt đã để sẵn trong code (`attackBox()`) để bước
  thêm địch dùng ngay, hiện chưa có mục tiêu.
- HUD RPG khung sẵn (chưa có nguồn tăng/giảm thật): Lv 1, HP 100/100,
  MP 50/50, EXP 0/100.
- Môi trường vẽ bằng code (không asset ngoài): bầu trời gradient,
  mặt trời, núi xa parallax 0.3, cây gần parallax 0.6, cỏ + đất +
  đá + cỏ dại theo vị trí thế giới.
- Âm thanh tối giản bằng WebAudio: tiếng nhảy, tiếng chém, không
  nhạc nền.

## Sprite nhân vật (đo trực tiếp từ file PNG)

- Mỗi sheet là dãy frame 128x128, nền trong suốt. File
  `male_hero-design.png` (1 frame) làm mốc: bbox x41-73, y43-80.
- Nhân vật đứng: rộng 32px, cao 37px, tâm ngang x=57, đường chân
  y=80 trong frame. Tất cả frame khác đều neo theo đúng 2 mốc này
  (không neo theo đáy bbox từng frame, vì frame nhảy/rơi có chân
  co lên tới y=75).
 - Vẽ đúng tỷ lệ 1/1 (SCALE=1): khung vẽ 128x128 nguyên gốc, nhân
  vật cao 37px, rộng thân 32px, chân trùng chân hitbox, tâm trùng
  tâm hitbox. Bản trước vẽ SCALE=2 (cao 74px) nên nhìn quá lớn.
- Hitbox: rộng 15, cao 32 (thu đúng nửa từ 30x64), chân tại mặt đất.
- Animation đã dùng (8 sheet nhúng base64 vào file):
  `idle` 10 frame (0.12s/frame), `walk` 10 (0.09s), `run` 10 (0.07s),
  `jump` 6 (lấy frame 0 lúc cất bước, frame 2 lúc đang lên),
  `fall` 4 (0.06s/frame, lúc bắt đầu rơi), `fall_loop` 3 (0.1s/frame,
  rơi ổn định), `combo_1` 3 + `combo_1_end` 4 (chém). Vùng chém
  trước mặt cũng thu theo tỷ lệ: rộng 35, cao 25.
- Lật ngang khi quay trái bằng cách scale(-1, 1) quanh tâm nhân vật.

## Deploy

App này là 1 file HTML tĩnh duy nhất, không có `package.json` và
không cần build. Workflow Pages chỉ copy `platformer-game/index.html`
vào `_site/platformer-game/` (khác với các app Vite/React còn lại).
