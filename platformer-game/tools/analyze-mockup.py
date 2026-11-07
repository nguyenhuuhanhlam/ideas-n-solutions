#!/usr/bin/env python3
"""Đo map từ mockup của user -> src/map.ts + ảnh map 2x.

Mockup 1536x256, lưới ô 16px. Phân loại từng ô theo họ màu, khoét hang/hố,
lấp lỗ, rồi sinh:
  - GROUND_Y_AT: mặt đất theo cột 32px (spawn người/địch)
  - SOLID_RECTS: mọi vùng đặc (đất, khối nổi, trần hang) đã gộp ngang
  - LADDER_ZONES / SPIKE_RECTS: đo tay từ vị trí trong mockup
Ảnh map: mockup x2 (3072x512) + nối đất xuống 540.
Chạy từ thư mục platformer-game:  python3 tools/analyze-mockup.py
"""
from PIL import Image
from collections import Counter
import json

SRC = '/home/hatch/workspace/user/media_library/image/mockup.png'
T = 16          # ô mockup (px)
S = 2           # scale ảnh -> game (16px -> 32px)
WORLD_H = 540

def fam(px):
    r, g, b, a = px
    if a == 0:
        return ' '
    if (r, g, b) == (90, 136, 162):
        return 'S'  # trời
    if (r, g, b) in ((40, 66, 50), (20, 35, 41)):
        return 'T'  # cây tối / đất trong bóng
    if (r, g, b) in ((81, 124, 69), (107, 142, 95), (147, 175, 95), (80, 107, 90)):
        return 'G'  # xanh lá sáng (cỏ/khối)
    if (r, g, b) in ((13, 19, 27), (35, 27, 29), (36, 30, 27)):
        return 'D'  # đất tối
    if (r, g, b) in ((130, 143, 162), (132, 126, 107), (115, 109, 100),
                     (100, 98, 93), (119, 117, 100)):
        return 'M'  # núi/đá xám
    if r > 140 and g > 110 and b < 115 and r - b > 45:
        return 'W'  # gỗ/thang
    return '.'

im = Image.open(SRC).convert('RGBA')
W, H = im.size
cols, rows = W // T, H // T

solid = [[False] * cols for _ in range(rows)]
for ry in range(rows):
    for rx in range(cols):
        cell = [im.getpixel((rx * T + dx, ry * T + dy)) for dx in range(T) for dy in range(T)]
        c = Counter(fam(p) for p in cell)
        n = T * T
        green, dirt, tree, grey = c['G'] / n, c['D'] / n, c['T'] / n, c['M'] / n
        # Đất trong bóng cây cũng là đất (tối, hàng >=10); cây chỉ ở trên cao.
        solid[ry][rx] = (green + dirt > 0.5 and tree < 0.5 and grey < 0.5) or (tree > 0.5 and ry >= 10)

# Bỏ lá cây (chỉ là nền, không đặc): các khoảng x có cây, hàng 0-9.
for x0, x1 in [(0, 55), (700, 790), (845, 965), (1045, 1165), (1425, 1536)]:
    for ry in range(0, 10):
        for rx in range(x0 // T, x1 // T + 1):
            if rx < cols:
                solid[ry][rx] = False
# Đỉnh cột đá (đá xám, người đứng được).
for rx in range(75, 79):
    solid[8][rx] = True
# Khoét hang trái (trần hang) và hố giữa để người chơi đi được.
for ry in range(7, 9):
    for rx in range(5, 36):
        solid[ry][rx] = False
for ry in range(12, 15):
    for rx in range(35, 44):
        solid[ry][rx] = False
# Lấp lỗ 1 ô trong khối đất + đáy hố thang trái (để không kẹt).
for rx in range(cols):
    for ry in range(1, rows - 1):
        if not solid[ry][rx] and solid[ry - 1][rx] and solid[ry + 1][rx]:
            solid[ry][rx] = True
solid[14][6] = True
for rx in (82, 85, 94):
    for ry in (13, 14):
        solid[ry][rx] = True
# Rương gỗ trên gờ trái là vật cản đặc; bóng nhà ở cột 64 không phải đất.
for rx in range(11, 15):
    solid[9][rx] = True
solid[9][64] = False
# Gờ trên hố phải là tấm liền (lấp 2 lỗ lẻ ở cột 35, 39) để đi được trên đó.
for ry in range(9, 12):
    for rx in range(35, 44):
        solid[ry][rx] = True
# Bỏ hàng đáy của trần hang (hàng 6, y=192 game) để đầu nhân vật (74px)
# không chạm trần khi đi dưới hang (khoảng trống 64px -> 96px).
for rx in range(5, 36):
    solid[6][rx] = False

# Mặt đất theo cột: từ hàng đáy đi lên tới khi gặp ô không đặc.
ground = []
for rx in range(cols):
    y = rows - 1
    while y >= 0 and solid[y][rx]:
        y -= 1
    ground.append((y + 1) * T * S)
# Làm phẳng lõm 1 cột (giữ nguyên hố rộng).
for _ in range(3):
    for i in range(1, cols - 1):
        if ground[i] > ground[i - 1] and ground[i] > ground[i + 1]:
            ground[i] = min(ground[i - 1], ground[i + 1])
# Vá tay: bóng nhà ở cột 64 không phải bậc đất (nhảy 96px đúng tầm tối đa).
ground[64] = 384

# Mọi vùng đặc: theo từng cột liệt kê các đoạn đặc liên tục, rồi gộp ngang
# các cột kề có cùng danh sách đoạn (đất, gờ trên hố, trần hang, khối nổi).
def runs_of(rx):
    runs = []
    y = 0
    while y < rows:
        if solid[y][rx]:
            y0 = y
            while y < rows and solid[y][rx]:
                y += 1
            runs.append((y0, y - 1))
        else:
            y += 1
    return tuple(runs)

col_runs = [runs_of(rx) for rx in range(cols)]
rects = []
cx = 0
while cx < cols:
    nx = cx + 1
    while nx < cols and col_runs[nx] == col_runs[cx]:
        nx += 1
    for (y0, y1) in col_runs[cx]:
        rects.append({'x': cx * T * S, 'y': y0 * T * S,
                      'w': (nx - cx) * T * S, 'h': (y1 - y0 + 1) * T * S})
    cx = nx

# Thang + gai (tọa độ ảnh -> game x2), đo tay từ vị trí trong mockup.
# Đầu thang vươn 40px trên mặt đứng để đứng trên gờ bấm Down là bám được.
ladders = [
    {'x': 92 * S, 'top': 124 * S, 'bottom': 200 * S},   # thang trái: gờ giữa -> cỏ thấp
    {'x': 610 * S, 'top': 124 * S, 'bottom': 240 * S},  # thang giữa: cỏ trên -> đáy hố
    {'x': 1352 * S, 'top': 4 * S, 'bottom': 160 * S},   # tháp thang phải: platform cao
]
spikes = [
    {'x': 330 * S, 'y': 175 * S, 'w': 50 * S, 'h': 10 * S},
    {'x': 600 * S, 'y': 225 * S, 'w': 90 * S, 'h': 15 * S},
    {'x': 752 * S, 'y': 195 * S, 'w': 40 * S, 'h': 15 * S},
    {'x': 1264 * S, 'y': 195 * S, 'w': 40 * S, 'h': 15 * S},
    {'x': 1464 * S, 'y': 195 * S, 'w': 50 * S, 'h': 15 * S},
]

# Ảnh map: mockup x2 (3072x512) + nối đất xuống 540.
big = im.resize((W * S, H * S), Image.NEAREST)
level = Image.new('RGBA', (W * S, WORLD_H), (13, 19, 27, 255))
level.paste(big, (0, 0))
band = big.crop((0, H * S - 32, W * S, H * S))
for y in range(H * S, WORLD_H, 32):
    level.paste(band, (0, y))
level.save('assets/backgrounds/mockup-map.png')
print('map image:', level.size, '| solid rects:', len(rects))

def ts_list(name, items, fmt):
    body = ',\n  '.join(fmt(it) for it in items)
    return f'export const {name} = [\n  {body},\n];\n'

out = '''// Map đo trực tiếp từ mockup của user (1536x256, lưới ô 16px, vẽ x2 = 32px).
// Ảnh nền là chính mockup (assets/backgrounds/mockup-map.png, 3072x540);
// va chạm đo từ màu từng ô, xem tools/analyze-mockup.py.
// GROUND_Y_AT: mặt đất theo từng cột 32px (mặt đứng để spawn địch/người).
// SOLID_RECTS: mọi vùng đặc đã gộp (đất, gờ trên hố, trần hang, khối nổi).
// LADDERS: thang leo. SPIKES: gai (chạm mất 1 tim).
'''
out += ts_list('GROUND_Y_AT', ground, lambda g: str(g))
out += ts_list('SOLID_RECTS', rects,
               lambda r: "{ x: %d, y: %d, w: %d, h: %d }" % (r['x'], r['y'], r['w'], r['h']))
out += ts_list('LADDER_ZONES', ladders,
               lambda r: "{ x: %d, top: %d, bottom: %d }" % (r['x'], r['top'], r['bottom']))
out += ts_list('SPIKE_RECTS', spikes,
               lambda r: "{ x: %d, y: %d, w: %d, h: %d }" % (r['x'], r['y'], r['w'], r['h']))
out += '\nexport const MAP_W = 3072;\nexport const MAP_H = 540;\n'
open('src/map.ts', 'w').write(out)
print('saved src/map.ts')
