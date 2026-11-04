#!/usr/bin/env python3
"""Xử lý asset PixeLab: raw (không sửa) -> processed (game dùng).

Quy tắc đã chốt từ bản vanilla:
- Khử viền đen hero: xóa pixel đen thuần (0,0,0) ở mép ngoài của nhân vật
  (pixel đen có kề với pixel trong suốt), giữ pixel đen bên trong (mắt)
  và các màu tối khác. Sheet gốc chỉ có alpha 0/255 nên không còn quầng mờ.
- Gộp đòn chém: combo_1 (3 frame) + combo_1_end (4 frame) -> hero-attack.png (7 frame).
- Tileset: copy nguyên file, chỉ đổi tên cho rõ.

Chạy từ thư mục platformer-game/:
    python3 tools/process-assets.py
Yêu cầu: Pillow (pip install Pillow). Output vào assets/sprites/player/
và assets/tilesets/. File raw trong assets/raw/ không bao giờ bị ghi đè.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
RAW_HERO = ROOT / "assets" / "raw" / "hero"
RAW_TILESET = ROOT / "assets" / "raw" / "tileset" / "Tileset.png"
OUT_PLAYER = ROOT / "assets" / "sprites" / "player"
OUT_TILESET = ROOT / "assets" / "tilesets"

HERO_MAP = {
    "male_hero-idle.png": "hero-idle.png",
    "male_hero-walk.png": "hero-walk.png",
    "male_hero-run.png": "hero-run.png",
    "male_hero-jump.png": "hero-jump.png",
    "male_hero-fall.png": "hero-fall.png",
    "male_hero-fall_loop.png": "hero-fall-loop.png",
    "male_hero-combo_1.png": "hero-combo-1.png",
    "male_hero-combo_1_end.png": "hero-combo-1-end.png",
}


def deoutline(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()
    remove = set()
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if (r, g, b) == (0, 0, 0) and a >= 128:
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = x + dx, y + dy
                    na = px[nx, ny][3] if 0 <= nx < w and 0 <= ny < h else 0
                    if na < 128:
                        remove.add((x, y))
                        break
    for x, y in remove:
        px[x, y] = (0, 0, 0, 0)
    return im


def main() -> None:
    OUT_PLAYER.mkdir(parents=True, exist_ok=True)
    OUT_TILESET.mkdir(parents=True, exist_ok=True)
    processed = {}
    for src_name, out_name in HERO_MAP.items():
        src = RAW_HERO / src_name
        assert src.exists(), f"thiếu file raw: {src}"
        out = deoutline(Image.open(src))
        out.save(OUT_PLAYER / out_name)
        processed[out_name] = out
        print(f"{src_name} -> {out_name} ({out.size[0]}x{out.size[1]})")
    # Gộp đòn chém: 3 frame combo-1 + 4 frame combo-1-end = 7 frame, mỗi frame 128x128.
    combo = processed["hero-combo-1.png"]
    combo_end = processed["hero-combo-1-end.png"]
    attack = Image.new("RGBA", (128 * 7, 128), (0, 0, 0, 0))
    attack.paste(combo, (0, 0))
    attack.paste(combo_end, (128 * 3, 0))
    attack.save(OUT_PLAYER / "hero-attack.png")
    print("hero-combo-1.png + hero-combo-1-end.png -> hero-attack.png (896x128, 7 frame)")
    # Tileset: copy nguyên, chỉ đổi tên.
    assert RAW_TILESET.exists(), f"thiếu file raw: {RAW_TILESET}"
    (OUT_TILESET / "terrain-tileset.png").write_bytes(RAW_TILESET.read_bytes())
    print("Tileset.png -> terrain-tileset.png (copy nguyên)")
    # Đồng bộ sang public/ để Vite copy vào dist khi build.
    public_player = ROOT / "public" / "assets" / "sprites" / "player"
    public_tileset = ROOT / "public" / "assets" / "tilesets"
    public_player.mkdir(parents=True, exist_ok=True)
    public_tileset.mkdir(parents=True, exist_ok=True)
    for f in OUT_PLAYER.glob("*.png"):
        (public_player / f.name).write_bytes(f.read_bytes())
    (public_tileset / "terrain-tileset.png").write_bytes(
        (OUT_TILESET / "terrain-tileset.png").read_bytes()
    )
    print("đã đồng bộ processed -> public/assets/ (Vite sẽ copy vào dist)")


if __name__ == "__main__":
    main()
