# Platformer Game — Prototype màn 1 kiểu NES

Bản dựng lại gameplay kiểu Super Mario Bros (NES) bằng Canvas 2D +
JavaScript thuần, ở độ phân giải logic 256x240, tile 16px.
Hình vẽ nền, địch và nhạc tự làm, nhân vật chính dùng sprite
template của Ozzbit Games (bản free, phi thương mại), không dùng
tài nguyên gốc của Nintendo.

## Chơi

- Mở `index.html` trực tiếp trong trình duyệt, hoặc qua GitHub Pages:
  https://nguyenhuuhanhlam.github.io/ideas-n-solutions/platformer-game/
- Phím: `←` `→` hoặc `A` `D` di chuyển, `Z` / `Space` / `↑` nhảy
  (giữ lâu = nhảy cao), `X` hoặc `Shift` chạy nhanh, `J` phóng kiếm,
  `P` tạm dừng, `R` chơi lại, `M` tắt/bật tiếng. Trên mobile có nút
  cảm ứng, gồm nút kiếm.

## Cơ chế trong prototype

- Vòng lặp cố định 60 fps (fixed timestep), va chạm AABB tách trục X rồi Y
- Nhảy biến thiên theo thời gian giữ phím, coyote time + jump buffer nhẹ
- Block `?` đập từ dưới ra xu, gạch, ống, hố, cầu thang, cờ cuối màn
- Địch đi tuần tra: đạp từ trên thì thắng, chạm ngang thì mất mạng
- Kiếm boomerang: nhân vật cầm kiếm, bấm `J` phóng kiếm bay ngang
  tối đa 80px rồi quay về tay; chạm tường thì quay lại ngay, chạm
  địch thì địch chết, lúc kiếm bay không phóng thêm được
- Địch phun lửa (đúng 1 con, đứng yên ở ô 135): khoảng 2 giây phun
  1 hạt lửa bay ngang về phía nhân vật, chạm tường thì tắt, chạm
  nhân vật thì mất mạng; đạp từ trên hoặc chém kiếm đều giết được
- Nhân vật chính: sprite Ozzbit Games nhúng trực tiếp vào file
  (idle / walk / run / jump / fall / fall_loop / combo chém khi bấm
  `J`), lật ngang khi quay trái, hitbox 12x15 và vật lý giữ nguyên
- Camera chỉ cuộn tới, HUD điểm / xu / mạng / thời gian, nhạc chiptune
  tổng hợp bằng WebAudio

## Credit sprite

- Nhân vật chính: template `male_hero_template` của Ozzbit Games,
  bản free — chỉ dùng cho dự án cá nhân, phi thương mại, được sửa,
  không bán lại asset. Credit bắt buộc "Ozzbit Games", cũng ghi
  trong chính trang game.

## Deploy

App này là 1 file HTML tĩnh duy nhất, không có `package.json` và
không cần build. Workflow Pages chỉ copy `platformer-game/index.html`
vào `_site/platformer-game/` (khác với các app Vite/React còn lại).
