# Samurai in Mario World

Bản dựng lại gameplay kiểu Super Mario Bros (NES) bằng Canvas 2D +
JavaScript thuần, ở độ phân giải logic 256x240, tile 16px.
Hình vẽ nền, địch và nhạc tự làm, nhân vật chính dùng bộ sprite
mới do user cung cấp (IDLE / RUN / ATTACK_1 / HURT), không dùng
tài nguyên gốc của Nintendo.

## Chơi

- Mở `index.html` trực tiếp trong trình duyệt, hoặc qua GitHub Pages:
  https://nguyenhuuhanhlam.github.io/ideas-n-solutions/platformer-game/
- Phím: `←` `→` hoặc `A` `D` di chuyển, `Z` / `Space` / `↑` nhảy
  (giữ lâu = nhảy cao), `X` hoặc `Shift` chạy nhanh, `J` chém kiếm
  cận chiến (giữ 0.5s phóng vệt kiếm), `P` tạm dừng, `R` chơi lại, `M` tắt/bật tiếng. Trên mobile có nút
  cảm ứng, gồm nút kiếm.

## Cơ chế trong prototype

- Vòng lặp cố định 60 fps (fixed timestep), va chạm AABB tách trục X rồi Y
- Nhảy biến thiên theo thời gian giữ phím, coyote time + jump buffer nhẹ
- Block `?` đập từ dưới ra xu, chém kiếm vỡ gạch (+50), ống, hố, cầu thang, lâu đài cuối màn (bước vào cửa là qua cửa)
- Địch đi tuần tra: đạp từ trên hoặc chém kiếm thì thắng (+100), chạm ngang thì mất mạng
- Kiếm cận chiến: bấm `J` chém 1 nhát ngay trước mặt (0.49s, theo animation ATTACK_1);
  chém vỡ gạch, chém địch và địch phun lửa, chém tan hạt lửa. Giữ `J` 0.5s
  để gồng (chỉ còn hạt năng lượng quanh nhân vật) rồi tự phóng vệt kiếm
  hình đa giác trắng phẳng kiểu lưỡi liềm, mảnh dày 8px, không trail, mờ dần nửa sau quãng bay, bay xa 36px từ mép nhân vật (gấp 3 lần tầm chém 12px),
  xuyên địch, phá gạch,
  tan hạt lửa; thả sớm thì chém thường
- Địch phun lửa (đúng 1 con, đứng yên ở ô 135): khoảng 2 giây phun
  1 hạt lửa bay ngang về phía nhân vật, chạm tường thì tắt, chạm
  nhân vật thì mất mạng; đạp từ trên hoặc chém kiếm khi đứng gần đều giết được,
  chém tan được hạt lửa
- Nhân vật chính: bộ sprite mới nhúng trực tiếp vào file
  (IDLE khi đứng, RUN khi di chuyển và khi bay, ATTACK_1 khi bấm
  `J`, HURT khi chết), lật ngang khi quay trái, hitbox 12x15 và
  vật lý giữ nguyên; nhân vật đã cầm kiếm đỏ trong sprite nên
  không vẽ thêm kiếm cầm tay
- Camera chỉ cuộn tới, HUD điểm / xu / mạng / thời gian, nhạc chiptune
  tổng hợp bằng WebAudio

## Sprite nhân vật

- Bộ sprite mới do user cung cấp ngày 2026-11-04, gồm 4 sheet
  trong suốt 96x96: `IDLE.png` (10 frame), `RUN.png` (16 frame),
  `ATTACK_1.png` (7 frame), `HURT.png` (4 frame, frame đầu là
  chớp trắng khi trúng đòn). Không còn dùng sheet Ozzbit ở bản
  trước, và trang game cũng không còn ghi credit Ozzbit nữa.

## Deploy

App này là 1 file HTML tĩnh duy nhất, không có `package.json` và
không cần build. Workflow Pages chỉ copy `platformer-game/index.html`
vào `_site/platformer-game/` (khác với các app Vite/React còn lại).
