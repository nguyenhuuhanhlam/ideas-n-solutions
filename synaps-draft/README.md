# Synaps Draft — Giai đoạn 1

Web app vẽ kiến trúc 2D chính xác (kiểu Synaps): drafting 2D, xem 3D
đồng bộ, xuất DXF. Giai đoạn 1 hoàn chỉnh: schema + store + canvas 2D
(1A), cửa đi/cửa sổ (1B), xem 3D (1C), lưu/mở + autosave + API DXF (1D).

## Chạy web

```bash
cd web
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:8000 (mặc định)
npm run dev            # http://localhost:5173
npm run lint           # ESLint (0 error)
npm run test -- --run  # Vitest
npm run build          # tsc + vite build
```

## Chạy API (xuất DXF)

```bash
cd api
python3.12 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn main:app --reload --port 8000
.venv/bin/python -m pytest   # 5 test xuất DXF
```

## Cấu trúc

```
web/src/
  model/       schema Zod, hình học thuần, seed nhà mẫu
  store/       Zustand + Immer (undo/redo 100 bước)
  tools/       từng công cụ: wall, opening
  views/       View2D (Konva), View3D (react-three-fiber)
  export/      jsonFile (lưu/mở/autosave), dxfClient (gọi API)
  components/  panel thuộc tính
api/
  main.py      FastAPI: POST /export/dxf
  models.py    Pydantic v2 — khớp EXACT với Zod schema
  dxf.py       ezdxf: union tường bằng Shapely, layer, dimension
  test_export.py / sample_building.json
```

## Quy ước tọa độ

- Đơn vị **mm, số nguyên** cho mọi tọa độ/kích thước trong Building JSON.
- 2D: Y hướng xuống như màn hình (1px = 1mm ở scale 1).
- DXF: lật Y (`y_dxf = -y`), `$INSUNITS` = 4 (mm), tường ở Z = elevation.
- 3D: 1 unit = 1m (mm / 1000).
- Một Building JSON là nguồn sự thật duy nhất; 2D, 3D, DXF đều suy ra
  từ nó. Mọi thay đổi đi qua action của store.

## Phím tắt

V: chọn · W: vẽ tường · D: cửa đi · N: cửa sổ · Ctrl+Z / Ctrl+Shift+Z:
hoàn tác / làm lại · Esc: dừng vẽ · Delete: xóa đang chọn · Gõ số +
Enter khi đang vẽ: chốt đoạn tường đúng chiều dài đó · Chuột giữa /
Space+kéo: pan · Lăn chuột: zoom theo con trỏ.

## Giới hạn đã biết

- Union tường bỏ lỗ trong của sân kín (chỉ xuất vòng ngoài của polygon).
- Hướng mở cửa cố định 1 phía (chưa có tùy chọn đảo chiều).
- Opening chồng nhau trên cùng tường chưa được hỗ trợ/kiểm tra.
- Camera 3D không tự re-frame khi building thay đổi.
- Chưa click chọn tường/cửa trong 3D (chọn ở 2D, 3D chỉ hiển thị).
- Dimension DXF luôn ở Z = 0 (chưa theo elevation của level).
- Chỉ 1 level đang làm việc (levels[0]); multi-level chưa có UI.
