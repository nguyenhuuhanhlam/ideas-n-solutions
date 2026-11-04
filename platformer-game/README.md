# PixeLab

Game 2D side-scroller chặt chém có yếu tố RPG, dựng bằng
Phaser 3 + TypeScript + Vite. Bản vanilla 1 file cũ đã được thay
thế hoàn toàn ngày 2026-11-04 theo quyết định cấu trúc lại của user
(ở lại repo ideas-n-solutions, không giữ dữ liệu cũ).

## Chạy và build

- Chạy dev: `cd platformer-game && npm install && npm run dev`
- Build: `npm run build` (ra `dist/`, đã cấu hình `base: "./"` để
  chạy dưới subpath Pages `/ideas-n-solutions/platformer-game/`).
- Deploy: workflow `.github/workflows/deploy-pages.yml` build app này
  bằng `npm ci` + `npm run build -- --base=...` rồi copy `dist/` vào
  `_site/platformer-game/`; link live giữ nguyên
  https://nguyenhuuhanhlam.github.io/ideas-n-solutions/platformer-game/

## Phạm vi hiện tại: di chuyển + cảnh trí (chưa có RPG thật)

Theo quyết định ngày 2026-11-04, bước này chỉ tập trung vào di chuyển
vật lý của nhân vật và cảnh trí xung quanh, chưa làm hệ thống RPG
(địch, HP/EXP thật, đồ, skill, lưu game — làm sau):

- Khung hình 960x540 (gấp đôi bản vanilla 480x270). Sprite gốc
  128x128 vẽ với scale 2 nên nhân vật cao 74px trong logic 960x540,
  tức chiếm cùng tỷ lệ màn hình như bản vanilla 1/1 (37px trên
  480x270). Nếu muốn giữ sprite 37px tuyệt đối trên khung 960x540
  thì nhân vật sẽ nhỏ đi một nửa — báo lại để đổi.
- Vật lý Arcade: đi bộ 180px/s, chạy 300px/s, nhảy -520 với trọng
  lực 1400 (cao khoảng 96px, thời gian bay 0.74s) — tất cả đều gấp
  đôi bản vanilla để giữ nguyên cảm giác theo tỷ lệ nhân vật/khung.
- Chém combo 7 frame (0.06s/frame, tổng 0.42s), chém được cả khi nhảy;
  chém dưới đất khóa di chuyển, chém trên không giữ đà bay và vẫn
  lái được hướng. Vùng chém đã tính sẵn trong `Player.attackBox()`
  để bước địch dùng ngay, hiện chưa có mục tiêu.
- Camera bám theo nhân vật (lerp 0.1), kẹp trong thế giới 4800x540,
  mặt đất tại y=468 (hạ 1 block 48px so với y=420 ban đầu theo phản hồi
  ngày 2026-11-04, platform hạ theo để vẫn nhảy lên được).
- Cảnh trí: trời gradient, mặt trời parallax 0.05, núi xa parallax
  0.3, cây gần parallax 0.6, mặt đất + platform nổi bằng Tileset.
- Platform nổi mẫu (đặc, đứng được trên mặt): (700, 388, 128),
  (1000, 308, 96), (1250, 388, 160) — xem `src/config.ts`.
- Phím: A/D hoặc ←/→ di chuyển, giữ Shift/X chạy, Z/Space/↑ nhảy,
  J chém, P tạm dừng, R chơi lại. Mobile: tay NES (D-pad ◀ ▶ ▲,
  nút dẹt Chạy/Dừng, nút tròn đỏ B = Nhảy, A = Chém).

## Cấu trúc code

- `src/main.ts` — cấu hình Phaser (960x540, FIT, pixelArt, roundPixels)
  và gắn nút cảm ứng NES vào input.
- `src/config.ts` — mọi hằng số gameplay (khung hình, thế giới, tốc
  độ, nhảy, hitbox, platform) để chỉnh số không cần đụng logic.
- `src/input.ts` — trạng thái nút chung cho bàn phím + cảm ứng.
- `src/entities/Player.ts` — nhân vật: physics Arcade, hitbox hiển
  thị 30x64 nhưng khai báo cho Phaser bằng pixel gốc 15x32 (offset
  49.5, 48) vì setSize/setOffset của Phaser tính theo pixel gốc rồi
  tự nhân scale — đưa số hiển thị vào sẽ làm body lệch khỏi sprite,
  nhân vật nổi trên mặt đất (lỗi đã gặp ngày 2026-11-04). Animation điều khiển
  thủ công theo đúng nhịp frame bản vanilla (idle 0.12s, walk 0.09s,
  run 0.07s, chém 0.06s, nhảy/rơi theo thời gian bay).
- `src/scenes/GameScene.ts` — 1 scene duy nhất hiện tại: load asset,
  cắt texture từ tileset, vẽ cảnh trí, mặt đất, platform, camera,
  phím tắt. Scene HUD, menu, địch sẽ tách sau.

## Asset: tách riêng, đặt tên rõ

Asset do user gửi lẻ, assistant phải tách riêng và đặt tên để thay
đổi sau này dễ dàng. Quy tắc:

- `assets/raw/` — file gốc, **không bao giờ sửa**:
  `assets/raw/hero/male_hero-*.png` (9 sheet, kể cả design),
  `assets/raw/tileset/Tileset.png` (256x128).
- `assets/sprites/player/` — bản đã xử lý, tên rõ:
  `hero-idle/walk/run/jump/fall/fall-loop/combo-1/combo-1-end.png`
  và `hero-attack.png` (gộp combo-1 3 frame + combo-1-end 4 frame
  thành 7 frame, 896x128).
- `assets/tilesets/terrain-tileset.png` — copy nguyên Tileset.png,
  chỉ đổi tên.
- `public/assets/` — bản sao của processed để Vite copy vào `dist/`.
- `tools/process-assets.py` — script sinh processed từ raw (khử viền
  đen hero: xóa pixel đen thuần ở mép ngoài, giữ pixel đen trong;
  gộp đòn chém; copy tileset; đồng bộ sang `public/`). Chạy lại
  script mỗi khi raw thay đổi, đừng sửa tay file processed.
- Sprite nhân vật (đo từ file gốc): frame 128x128, nhân vật đứng
  32x37 (bbox x41-73, y43-80, tâm x=57, đường chân y=80); sau khử
  viền còn 30x36, tâm và đường chân không đổi. Mọi frame đều neo
  theo tâm và đường chân này, không neo theo đáy bbox từng frame
  (frame nhảy/rơi có chân co lên tới y=75).

## Tileset nền đất / platform (file Tileset.png 256x128)

- Alpha của file chỉ có 0/255; các vùng xanh lá/đen ở mép file có
  alpha=0 nên trong game sẽ trong suốt, không phải tile thật.
- Mặt đất: dải cỏ x192-255, y13-31 (64x19, cỏ thưa y13-17, đặc từ
  y18) lặp ngang, đỉnh cỏ nhô 5px trên đường chân; thân đất là
  texture `dirt-body` 128x48 (khối đất lớn x112-175, y32-79 + cùng
  khối lật gương, xen 2 mảng đất tối) lặp từ GROUND_Y+14 xuống hết
  màn. Ô đất 16x16 cũ (x48-63, y48-63 và 2 ô dưới nó) gần như giống
  hệt nhau nên lặp mỗi 16px nhìn đều như giấy dán tường — đã bỏ,
  không dùng nữa.
- Platform: mặt bằng mảnh cỏ hẹp x16-31, y13-31 (16x19) lặp ngang +
  1 hàng thân đất `dirt-body` dưới mặt cỏ; xem `PLATFORMS` trong
  `src/config.ts`.
- Nhảy/chém là bấm 1 lần (edge-trigger): giữ phím nhảy không tự nhảy
  lại khi vừa chạm đất, giữ phím chém không tự chém lặp trên không
  (sửa từ bản ceb5d7d, nơi giữ phím là lặp — nguyên nhân khiến nhân
  vật trông như bay mãi).
- Mẫu khác đã đo, để dành: khối đất lớn x112-175, y13-79 (64x67),
  cột đất x80-95, y13-79, khối đầu lâu x80-111, y96-127 và khối ô
  cửa x128-159, y96-127 (32x32), cửa x16-31, y48-63, gai x16-31,
  y82-95 (16x14).
