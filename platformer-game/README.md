# Platformer Game — Prototype màn 1 kiểu NES

Bản dựng lại gameplay kiểu Super Mario Bros (NES) bằng Canvas 2D +
JavaScript thuần, ở độ phân giải logic 256x240, tile 16px.
Nhân vật, hình vẽ và nhạc đều tự làm, không dùng tài nguyên gốc
của Nintendo.

## Chơi

- Mở `index.html` trực tiếp trong trình duyệt, hoặc qua GitHub Pages:
  https://nguyenhuuhanhlam.github.io/ideas-n-solutions/platformer-game/
- Phím: `←` `→` hoặc `A` `D` di chuyển, `Z` / `Space` / `↑` nhảy
  (giữ lâu = nhảy cao), `X` hoặc `Shift` chạy nhanh, `P` tạm dừng,
  `R` chơi lại, `M` tắt/bật tiếng. Trên mobile có nút cảm ứng.

## Cơ chế trong prototype

- Vòng lặp cố định 60 fps (fixed timestep), va chạm AABB tách trục X rồi Y
- Nhảy biến thiên theo thời gian giữ phím, coyote time + jump buffer nhẹ
- Block `?` đập từ dưới ra xu, gạch, ống, hố, cầu thang, cờ cuối màn
- Địch đi tuần tra: đạp từ trên thì thắng, chạm ngang thì mất mạng
- Camera chỉ cuộn tới, HUD điểm / xu / mạng / thời gian, nhạc chiptune
  tổng hợp bằng WebAudio

## Deploy

App này là 1 file HTML tĩnh duy nhất, không có `package.json` và
không cần build. Workflow Pages chỉ copy `platformer-game/index.html`
vào `_site/platformer-game/` (khác với các app Vite/React còn lại).
