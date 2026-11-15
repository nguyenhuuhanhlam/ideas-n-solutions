# Nghiên cứu UI synaps.app — để clone giao diện (chưa mô phỏng hoạt động)

Ngày thu thập: 2026-11-15. Nguồn: synaps.app (trang chủ), docs.synaps.app, video YouTube/Instagram.
App thật chạy ở beta.synaps.app — cần tài khoản, không truy cập được; mọi tư liệu dưới đây là từ trang công khai + docs.

## 1. Synaps là gì

- Web app vẽ kiến trúc chạy hoàn toàn trên trình duyệt, không cài đặt. Slogan: "all building drawings in seconds".
- Một canvas duy nhất nối: floor plan, section, elevation, site plan, 3D model — sửa một chỗ đồng bộ mọi view.
- AI: tạo mặt bằng từ prompt ("Design a four-storey mixed use building..."), trace sketch/bản vẽ scan thành element chỉnh sửa được (model Vecy-2), render nội/ngoại thất từ camera đặt trên mặt bằng.
- Export: PDF, DWG, DXF, IFC, PNG/JPG. Giá niêm yết trên trang chủ: 89 EUR.
- Collaboration real-time nhiều người trên cùng một canvas (ảnh demo: Kevin và Annamaria).
- Tường đa lớp (brick, insulation, concrete + hatch), cửa đi/cửa sổ parametric (lá cửa, hướng mở, cơ chế), mái hip 1 click, cầu thang chữ nhật/xoắn, đồ nội thất, vật liệu/hatch native.

## 2. Ảnh chụp UI chính thức (trang chủ)

| Ảnh | URL | Nội dung |
|---|---|---|
| feature-tools | https://synaps.app/images/home/feature-tools.webp | **QUAN TRỌNG NHẤT** — editor vẽ tường chính xác, canvas properties, kích thước tường |
| feature-building-frame | https://synaps.app/images/home/feature-building-frame.webp | 3D + mặt bằng + section + elevation nối nhau từ một building frame |
| feature-tracing | https://synaps.app/images/home/feature-tracing.webp | AI trace mặt bằng: Segment, Trace floor plan, Replace |
| team-collaboration | https://synaps.app/images/home/team-collaboration.webp | 2 cộng tác viên cùng vẽ trên canvas |
| feature-export | https://synaps.app/images/home/feature-export.webp | Dialog export: preview bản vẽ, PDF/DWG/DXF/IFC, nút Export PDF |
| security-ownership | https://synaps.app/images/home/security-ownership.webp | Tờ bản vẽ "004 Courtyard House" với title block "Drawn by You" |
| materials-wheel | https://synaps.app/images/home/materials-wheel.webp | Vòng swatch vật liệu: stone, plywood, ash |
| testimonial | https://synaps.app/images/home/testimonial-martin-mueller.webp | Ảnh người dùng (không phải UI) |

Video trang chủ: https://synaps.app/images/fluid-loop-attractor.mp4

## 3. Bố cục editor (theo docs — docs.synaps.app)

- **Bottom toolbar**: thanh công cụ vẽ + ảnh nằm ở DƯỚI (không phải trái/trên). "Find drawing and image tools in the bottom toolbar."
- **Layers panel bên TRÁI**: cây front-to-back liệt kê mọi shape; container (paper, group, block) lồng con thụt vào; mỗi row có tên + (khi hover) nút eye ẩn/hiện và lock; double-click đổi tên; kéo-thả đổi thứ tự/lồng nhau; ô search ở đầu panel, chọn kết quả sẽ select + zoom tới shape.
- **Tool panel**: khi tool đang chạy, hiện dimension + option cho bước vẽ hiện tại (ví dụ vẽ line: nhập L = length, A = angle; rectangle: W/H; circle: Radius). Nhập xong Enter để đặt điểm.
- **Properties panel**: chọn wall mở properties — thickness, alignment (Left/Center/Right, mặc định Center), construction layers (Add left / Add right, tối đa 8 lớp, lớp core không xóa được; mỗi lớp có thickness, fill, stroke riêng; kéo handle đổi thứ tự). Chọn opening: Geometry (Width, Height, Sill cho window), Configuration (alignment của frame trong tường).
- **Appearance panel** chung: Fill / Stroke (wall dùng layer list riêng, không dùng panel này).
- **Command search**: Cmd/Ctrl+K, gõ tên tool/action (Wall, Mirror, Generate a floorplan...).
- Chọn 1 ảnh sẽ hiện image actions: Segment, Edit with prompt, Expand, Remove background, Boost resolution.
- Camera: đặt camera (Shift+C), chọn riêng camera để hiện rendering prompt.

## 4. Công cụ vẽ (toolbar + shortcut)

| Tool | Phím | Ghi chú |
|---|---|---|
| Select | V | Click chọn, Shift-click cộng/trừ, marquee kéo vùng trống, double-click vào group |
| Paper | F | Tạo tờ bản vẽ (paper), set khổ giấy + tỉ lệ, header |
| Line | L | 2 click, live length + angle |
| Arrow | Shift+L | |
| Polyline | P | Click từng điểm, Enter kết thúc mở / click về điểm đầu để khép kín |
| Arc | A | 3 click: start, end, độ cong |
| Rectangle | R | Góc đối góc, hoặc nhập W/H chính xác |
| Circle | O | Tâm + bán kính |
| Pencil | Shift+P | |
| Pen | N | |
| Markup | Shift+N | |
| Text | T | |
| Dimension | D | |
| Leader | Shift+D | |
| Wall | W | Chuỗi nhiều đoạn nối nhau, tự snap + join góc sạch; Enter kết thúc, click về điểm đầu khép vòng |
| Camera | Shift+C | Đặt camera để render |
| Door / Window | (không có phím riêng — qua toolbar hoặc Cmd+K) | Click tường đặt vị trí → di chuột chọn hướng mở → click đặt |

Modify: Move M, Rotate Q, Scale S, Offset Shift+O, Trim Shift+T, Extend Shift+E, Mirror Shift+M.
Khác: F3 toggle snapping; Shift+1 fit content; Shift+2 fit selection; Shift+0 zoom 100%; Space+drag pan; Cmd/Ctrl+D duplicate; Cmd/Ctrl+G group; Cmd/Ctrl+B block.

## 5. Hành vi vẽ tường / phòng / cửa (theo docs)

- Tường snap tới đầu mút, trung điểm, giao điểm, điểm vuông góc; latch vào tường có sẵn (đầu mút hoặc dọc cạnh tạo T-junction); góc chung join tự động.
- Room: click trong vòng tường kín → tạo room fill + label căn giữa, auto-numbered, diện tích live.
- Door/Window: 2 click (vị trí trên tường → hướng mở), preview trước khi đặt; sửa sau bằng Geometry/Configuration.
- Stairs: chữ nhật hoặc xoắn, chỉnh bounds, tread/riser, handrails.
- Measure: thước tạm thời đo khoảng cách/diện tích, không thêm gì vĩnh viễn vào bản vẽ.
- Annotations không tự bám theo geometry khi geometry di chuyển.

## 6. Video demo (nguồn tham khảo UI động)

- YouTube "I Finally Found an AI CAD Tool Architects Can Actually Use | Synaps Tutorial": https://www.youtube.com/watch?v=9kU6FT7ldZs
- YouTube "Is Revit dead? Testing the new alternative": https://www.youtube.com/watch?v=mL3wgPJ56jo (walkthrough đầy đủ: prompt → plans/sections/3D, render, trace sketch, sidebar tools)
- Instagram @linestyle_architectural_studio (2026-11-10): screen-recording tutorial — prompt → plan, section lines, furniture, 3D sun-path, realistic render, export PNG/DWG mở trong AutoCAD: https://www.instagram.com/reel/Dfj_ax0O9_O/
- Instagram @melos.azemi: demo text → plan + render, split 2D plan / live camera view: https://www.instagram.com/reel/DSfOUocjYDC/

## 7. Đặc tả trực quan chi tiết (từ ảnh chụp thật trên trang chủ, xem trực tiếp 15-11)

Lưu ý: chỉ 2 mã hex xuất hiện dạng chữ trong UI (#FCFCFC, #E8ECEF); các hex còn lại là ước lượng bằng mắt từ screenshot, cần đối chiếu lại với app thật trước khi chốt.

### 7.1 Bố cục editor (ảnh feature-tools.webp, 2048×1408)

Workspace sáng, gần trắng, panel nổi. KHÔNG có thanh menu trên cùng full-width, KHÔNG có status bar trong bất kỳ ảnh nào.
- **Panel trái** (Properties): header có logo sparkle 4 cánh + "Acme Atelier" (bold ~15px) / "Residential Projects 3" (xám ~12px); icon thu gọn panel ở góc phải header. Tabs ngay dưới header: "Properties" (active — chữ đen trên pill xám nhạt, bo ~8px), "Layers", "Assets" (xám). Section "Canvas" (bold ~14px) rồi các dòng form:
  - "Background": ô màu + swatch trắng, giá trị literal "FCFCFC".
  - "Length units" (dropdown "Meters") cạnh "Precision" (dropdown "2").
  - "Area units" (dropdown "Square meters").
  - "Grid": label trái, toggle pill xám (OFF) phải.
  Panel trắng, viền xám rất nhạt, bo góc ngoài ~16–20px, bóng mờ nhẹ, nổi trên nền.
- **Toolbar icon dọc** (~56px, trắng, icon outline mỏng ~20px, nét 1.5px, đen trên trắng), dock sát mép phải panel trái, từ trên xuống: (1) toggle panel, (2) Select (mũi tên) — trạng thái ACTIVE: mũi tên trắng trên ô vuông đen bo tròn, (3) pin vị trí/site, (4) building/home + "+" (thêm building/level), (5) polyline/nút nối, (6) hình chữ nhật bo, (7) hình tròn, (8) "···", (9) tường gạch/hatch, (10) cửa (vòm), (11) cửa sổ (4 ô), (12) "···", (13) ảnh/frame, (14) hatch/đường lượn, (15) Text "T", (16) "···". Nhóm cách nhau bằng đường kẻ hairline.
- **Canvas**: nền trắng; tường là thanh xám vừa (~#8A8A8A, viền xám đậm) dạng chữ L; dimension line xám nhạt, mũi tên mở nhỏ, giá trị "3.98" (ngang) và "2.88" (dọc, xoay 90°); đường guide dọc xanh nhạt mờ; vòng snap xanh dương + dấu "+" ở đầu tường đang vẽ; ô nhập nổi (pill trắng, bo tròn, bóng mờ, viền xám mỏng) chứa ô length "1.76 m" và ô angle "⌐ 90" + 1 chấm nhỏ. Không thấy lưới (grid toggle off).
- **Thẻ đen callout** (khung marketing, KHÔNG phải chrome của editor): hình chữ nhật gần đen bo ~24px, có notch nhọn bên trái, chứa canvas inset + tiêu đề "Draw walls precisely" + nút pill trắng "Draw wall" (chữ đen, phải).

### 7.2 Bố cục thứ hai — poster video docs (draft-and-polish-modes)

Panel trái + canvas giữa + **panel phải** (Canvas properties), nút "Share" xanh dương góc phải trên:
- Panel trái: header "Demo floor plan / Demo workspace", tabs "Layers" (active) / "Assets", icon search, section "Models" ("Demo workspace", "Demo floor plan") + "+", section "Layers" liệt kê các row "Wall".
- Panel phải: section "Canvas" — Background "E8ECEF", Units "Meters", Precision "2", Grid toggle off.
- Góc phải trên: avatar tròn magenta, vài icon nhỏ, nút "Share" xanh.
→ Coi 2 bố cục (toolbar dọc trái ở trang chủ; panel trái+phải ở docs) là 2 trạng thái quan sát được của cùng một UI. Docs nói drawing tools nằm ở BOTTOM toolbar.

### 7.3 Bảng màu

| Vai trò | Màu |
|---|---|
| Nền canvas (editor, feature-tools) | #FCFCFC (literal) |
| Nền canvas (poster docs) | #E8ECEF (literal) |
| Nền panel/trang | trắng #FFFFFF; field/tab inactive ≈ #F2F2F3–#F5F5F5 |
| Đen chính (tool active, nút primary, thẻ callout) | ≈ #0A0A0A–#111111 |
| Chữ | gần đen ≈ #111111; label phụ xám ≈ #6B7280; viền field ≈ #E5E7EB |
| Tường | fill xám vừa ≈ #8A8A8A, viền xám đậm |
| Accent xanh dương (selection, guide, nút Share ở docs) | ≈ #3B9BD6–#5BA8E0; nền blueprint hero ≈ #7FB8E8 |
| Collaboration | cam ≈ #E85D04–#F97316 ("Annamaria"), đen ("Kevin"), vàng mù tạt ≈ #D9A441 ("Benjamin") |
| Nền marketing (không phải UI editor) | xanh lime nhạt ≈ #E3EBC0; texture bê tông/giấy xám ấm |

### 7.4 Typography

Sans-serif hình học sạch (cảm giác Inter/system sans). Không serif, không mono (trừ số dimension). Phân cấp: heading panel bold ~14–15px; label field xám nhỏ ~11–12px; giá trị field ~13–14px; label dimension trên canvas ~11–12px xám; headline marketing bold lớn, tracking chặt, mệnh đề sau màu xám. Nút: medium ~14–15px.

### 7.5 Nút và control

Bo tròn hoàn toàn, phẳng, mềm, không bóng cứng/bevel. Nút chính: pill/hình chữ nhật đen đặc (bo ~10–14px), chữ trắng ("Share", "Export PDF ↓"). Nút phụ: trắng, viền xám nhạt mỏng, chữ đậm ("Import", "Export", "Cancel", "Segment", "Replace"). Dropdown: field xám nhạt bo ~8–10px + chevron nhỏ. Toggle: pill iOS xám (off). Radio: vòng tròn, chọn thì chấm đen đặc.

**Dialog Export** (feature-export.webp): modal trắng lớn (bo ~24px, bóng mờ), header "Export · Whole project ▾" + "×", vùng preview xám nhạt với thumbnail sheet viền đứt, section "Format" 4 thẻ radio lưới 2×2 (PDF — Drawing sets at scale [đang chọn, viền đen + radio đặc]; DWG — CAD drawings; DXF — Vector geometry; IFC — Building model), footer "A3 Landscape · 1:100" trái + Cancel / Export PDF phải. Con trỏ vàng "Benjamin" chỉ vào "Export PDF ↓".

### 7.6 Các ảnh feature còn lại

- **feature-building-frame.webp** (2048×1406): bảng nền lưới blueprint xanh, các thẻ trắng (3D Models, Floorplans, Details, Elevations, Sections) quanh thẻ ĐEN trung tâm "Building Frame — One building frame, connecting all your floors, sections, elevations, and 3D." kèm mặt bằng đảo ngược (tường trắng/xám trên đen). Thẻ trắng bo ~16px, tiêu đề bold nhỏ + mô tả xám 2 dòng; thẻ 3D có model isometric nhạt; Elevations có mặt đứng mái dốc mờ; Sections có thanh slab xám + dimension (3.20, 6.27, 4.50).
- **feature-tracing.webp** (2048×1408): mặt bằng mờ phía sau (tường xám, nội thất viền xanh, sàn herringbone) + thẻ trắng giữa: icon tường isometric, "Tracing floor plan", "We're tracing your floor plans and assigning them to the correct floors."; dưới là pill toolbar nổi 3 nút: "Segment" (xám), "Trace floorplan" (đen, chính), "Replace" (xám). Vùng đã trace nhuộm xanh nhạt + viền xanh.
- **team-collaboration.webp** (2048×1408): cửa sổ editor trắng (bo góc trên) trên nền blueprint xanh; top bar có avatar chồng nhau ("A" cam, "K" đen) + chevron, nút "Import"/"Export" (pill trắng viền) và "Share" (pill đen). Mặt bằng có label phòng ("Planters", "THRESHOLD ZONE", "Office Outdoor Space", "RECEPTION AND WARDROBE", "Table Football", "KITCHEN", "Lift"), cầu thang xoắn, texture chấm; 2 con trỏ live: mũi tên đen + pill đen "Kevin", mũi tên cam + pill cam "Annamaria". Viền chọn xanh mỏng + handle vuông quanh mép sheet.
- **security-ownership.webp** (1280×960): tờ giấy khổ A hơi xoay trên texture bê tông, viền đen mỏng, mặt bằng có nội thất (tường xám đậm, lưới trục A–E, chuỗi dimension), title block góc phải dưới: "004 Courtyard House" (bold), "DRAWN BY — YOU", "SHEET — A–101", bảng 3 hàng có kẻ.

### 7.7 Cấu trúc trang chủ (để tham khảo nếu clone cả landing)

Sticky header (logo sparkle, "Platform +", "Discover +", "Pricing", pill đen "Sign up"; cookie banner Reject/Accept). Hero "All building drawings in seconds." + "Try for free" (pill đen) / "How it works"; preview sản phẩm nhiều pane (rail icon trái; "Building Elevation 03 (partial view)", "Section C–C (partial view)", pane 3D "Building" nhạt + nút expand); carousel "Export your work" (Revit, AutoCAD, Archicad, SketchUp; IFC, DWG, DXF, PDF). Tabs "How it works": Context, Site, Generate, Edit, Export — tab Edit hiện dialog Window configuration (elevation cửa sổ 3 panel, lưới icon "Mechanism", toggle "Open", checkbox "Construction", Width 1845 mm, Height 2380 mm, nút đen "Apply", nút "+" thêm panel). Quote Martin Müller. 5 feature article (nav trái: "Draft in your browser", "Derive connected views", "Trace & generate with AI", "Draw with your team", "Export your drawings"). Section "Introducing Vecy-2" + video "Floor plan generation with Vecy-2" (tabs "01 Vecy-2" / "02 Made for the studio"). "Your designs. Your data." / "Hatches, materials, blocks. Native." (vòng swatch stone, plywood, ash). Ô prompt "Describe your building" (ví dụ "Vertical House", "Courtyard House", "Corner House", "Start in Synaps"). Footer (Platform / Solutions / Resources / Company, © 2026 Synaps). Pill "Ask Synaps" nổi góc phải dưới.

### 7.8 Những gì KHÔNG thấy trong bất kỳ ảnh editor nào

Không status bar, không menu chuột phải, không control zoom — docs xác nhận zoom bằng phím (Shift+0/1/2).
