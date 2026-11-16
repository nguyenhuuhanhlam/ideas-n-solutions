"""Xuất Building JSON sang DXF (ezdxf, R2010).

Quy ước tọa độ: canvas 2D dùng Y hướng xuống (như màn hình), còn DXF dùng
Y hướng lên như toán học, nên mọi điểm đều lật Y: ``y_dxf = -y``.
Đơn vị mm (``$INSUNITS`` = 4). Tường vẽ ở Z = elevation của level.

Giới hạn đã biết: polygon tường chỉ xuất vòng ngoài (exterior) — lỗ trong
của sân kín bị bỏ qua (xem README).
"""

import io
import math

import ezdxf
from shapely.geometry import Polygon
from shapely.ops import unary_union

from models import Building, Level, Opening, Wall

DIM_OFFSET = 600  # mm, khoảng cách đường kích thước khỏi tường (như frontend)


def _flip(p: tuple[float, float]) -> tuple[float, float]:
    """Lật Y: (x, y_2d) -> (x, -y) cho hệ tọa độ DXF."""
    return (p[0], -p[1])


def _segment_polygon(
    p1: tuple[float, float], p2: tuple[float, float], thickness: int
) -> Polygon:
    """Thân 1 đoạn tường: hình chữ nhật dài theo đoạn, rộng = thickness."""
    x1, y1 = p1
    x2, y2 = p2
    length = math.hypot(x2 - x1, y2 - y1)
    if length == 0:
        return Polygon()
    nx, ny = -(y2 - y1) / length, (x2 - x1) / length
    h = thickness / 2
    return Polygon([
        (x1 + nx * h, y1 + ny * h),
        (x2 + nx * h, y2 + ny * h),
        (x2 - nx * h, y2 - ny * h),
        (x1 - nx * h, y1 - ny * h),
    ])


def _wall_polygons(wall: Wall) -> list[Polygon]:
    """1 polygon cho mỗi đoạn của tường polyline (chuỗi points)."""
    pts = [(float(p.x), float(p.y)) for p in wall.points]
    return [
        _segment_polygon(pts[i], pts[i + 1], wall.thickness)
        for i in range(len(pts) - 1)
    ]


def _corner_patches(
    points: list[tuple[float, float]], thickness: int
) -> list[Polygon]:
    """Miếng vá góc miter/bevel tại các đỉnh trong của tường polyline.

    Mỗi đoạn tường là 1 hình chữ nhật; union các hình chữ nhật để hở
    góc ngoài (ô vuông 100x100mm ở góc 90° với tường dày 200, nêm càng
    to khi góc càng nhọn). Tại mỗi đỉnh, miếng vá lấp đúng phần hở đó:
    tứ giác (A, M, B, P) với M là giao của 2 mép ngoài (miter), hoặc
    tam giác (A, B, P) khi |M - P| > 2*thickness (bevel, tránh nhọn
    hoắt ở góc rất nhọn).

    Chỉ vá đỉnh TRONG của 1 tường: góc giữa 2 tường rời nhau không được
    miter (web app gộp tường trùng đầu mút khi load nên bản vẽ xuất từ
    app luôn miter đủ).
    """
    h = thickness / 2
    limit = 2 * thickness
    n = len(points)
    if n < 3:
        return []
    closed = points[0] == points[-1]
    indices = list(range(1, n - 1))
    if closed:
        indices.append(0)  # đỉnh khép kín: đoạn vào là đoạn cuối
    patches: list[Polygon] = []
    for i in indices:
        prev = points[i - 1] if i > 0 else points[-2]
        cur = points[i]
        nxt = points[i + 1] if i + 1 < n else points[1]
        ux, uy = cur[0] - prev[0], cur[1] - prev[1]
        vx, vy = nxt[0] - cur[0], nxt[1] - cur[1]
        lu = math.hypot(ux, uy)
        lv = math.hypot(vx, vy)
        if lu == 0 or lv == 0:
            continue
        ux, uy = ux / lu, uy / lu
        vx, vy = vx / lv, vy / lv
        cross = ux * vy - uy * vx
        if abs(cross) < 1e-9:
            continue  # thẳng hàng hoặc gập ngược: không có góc hở
        # Pháp tuyến phía ngoài của mỗi hướng (phía góc lồi).
        if cross > 0:
            nux, nuy = uy, -ux
            nvx, nvy = vy, -vx
        else:
            nux, nuy = -uy, ux
            nvx, nvy = -vy, vx
        ax, ay = cur[0] + nux * h, cur[1] + nuy * h
        bx, by = cur[0] + nvx * h, cur[1] + nvy * h
        # M = giao của đường qua A hướng u và đường qua B hướng v.
        s = ((bx - ax) * vy - (by - ay) * vx) / cross
        mx, my = ax + s * ux, ay + s * uy
        if math.hypot(mx - cur[0], my - cur[1]) > limit:
            patches.append(Polygon([(ax, ay), (bx, by), cur]))
        else:
            patches.append(Polygon([(ax, ay), (mx, my), (bx, by), cur]))
    return [p for p in patches if not p.is_empty and p.area > 0]


def _wall_body_polygons(wall: Wall) -> list[Polygon]:
    """Thân tường đầy đủ: hình chữ nhật từng đoạn + miếng vá góc."""
    pts = [(float(p.x), float(p.y)) for p in wall.points]
    return _wall_polygons(wall) + _corner_patches(pts, wall.thickness)


def _segment_at_offset(
    wall: Wall, offset: int
) -> tuple[tuple[float, float], tuple[float, float], float]:
    """Đoạn chứa `offset` dọc chuỗi tường (tính từ points[0]).

    Trả về (điểm đầu đoạn, điểm cuối đoạn, offset cục bộ trong đoạn).
    Offset đúng tại đỉnh thì thuộc về đoạn SAU đỉnh; offset vượt quá
    tổng dài chuỗi thì kẹp vào đoạn cuối.
    """
    pts = [(float(p.x), float(p.y)) for p in wall.points]
    remaining = float(max(offset, 0))
    for i in range(len(pts) - 1):
        seg_len = math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1])
        if remaining < seg_len or i == len(pts) - 2:
            return pts[i], pts[i + 1], remaining
        remaining -= seg_len
    return pts[-2], pts[-1], 0.0  # không tới được: chuỗi luôn >= 2 điểm


def _opening_rect(wall: Wall, opening: Opening) -> list[tuple[float, float]]:
    """Hình chữ nhật của lỗ cửa trên mặt bằng, dọc đoạn tường chứa offset.

    Offset đo dọc toàn bộ chuỗi từ points[0]; lỗ vẽ theo hướng của đoạn
    chứa offset (giới hạn: lỗ vắt qua đỉnh polyline chỉ vẽ theo đoạn đầu).
    """
    (x1, y1), (x2, y2), local = _segment_at_offset(wall, opening.offset)
    length = math.hypot(x2 - x1, y2 - y1)
    if length == 0:
        return []
    ux, uy = (x2 - x1) / length, (y2 - y1) / length
    nx, ny = -uy, ux
    h = wall.thickness / 2
    a0, a1 = local, local + opening.width
    p0 = (x1 + ux * a0, y1 + uy * a0)
    p1 = (x1 + ux * a1, y1 + uy * a1)
    return [
        (p0[0] + nx * h, p0[1] + ny * h),
        (p1[0] + nx * h, p1[1] + ny * h),
        (p1[0] - nx * h, p1[1] - ny * h),
        (p0[0] - nx * h, p0[1] - ny * h),
    ]


def _building_center(levels: list[Level]) -> tuple[float, float]:
    """Tâm bounding box toàn bộ tường — dimension đặt về phía xa tâm."""
    xs, ys = [], []
    for level in levels:
        for w in level.walls:
            for p in w.points:
                xs.append(p.x)
                ys.append(p.y)
    if not xs:
        return (0.0, 0.0)
    return ((min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2)


def _dim_base(
    p1: tuple[float, float], p2: tuple[float, float], cx: float, cy: float
) -> tuple[float, float]:
    """Điểm base của dimension: trung điểm đoạn, offset 600mm xa tâm building."""
    x1, y1 = p1
    x2, y2 = p2
    length = math.hypot(x2 - x1, y2 - y1)
    if length == 0:
        return ((x1 + x2) / 2, (y1 + y2) / 2)
    nx, ny = -(y2 - y1) / length, (x2 - x1) / length
    mx, my = (x1 + x2) / 2, (y1 + y2) / 2
    d_plus = math.hypot(mx + nx * DIM_OFFSET - cx, my + ny * DIM_OFFSET - cy)
    d_minus = math.hypot(mx - nx * DIM_OFFSET - cx, my - ny * DIM_OFFSET - cy)
    s = 1 if d_plus >= d_minus else -1
    return (mx + nx * DIM_OFFSET * s, my + ny * DIM_OFFSET * s)


def building_to_dxf(building: Building) -> str:
    """Trả về nội dung file DXF (chuỗi text) của building."""
    doc = ezdxf.new("R2010")
    doc.header["$INSUNITS"] = 4  # mm
    doc.layers.add("WALLS")
    doc.layers.add("DOORS")
    doc.layers.add("WINDOWS")
    doc.layers.add("DIMS")
    msp = doc.modelspace()

    cx, cy = _building_center(building.levels)

    for level in building.levels:
        z = float(level.elevation)

        # Tường: union các thân tường theo level, mỗi polygon -> LWPOLYLINE kín.
        # Mỗi đoạn của tường polyline đóng góp 1 polygon hình chữ nhật,
        # cộng miếng vá miter/bevel ở các đỉnh trong để góc ngoài không khuyết.
        polys = [p for w in level.walls for p in _wall_body_polygons(w)]
        polys = [p for p in polys if not p.is_empty]
        if polys:
            merged = unary_union(polys)
            geoms = list(merged.geoms) if merged.geom_type == "MultiPolygon" else [merged]
            for geom in geoms:
                # Chỉ vòng ngoài; lỗ trong (sân kín) bị bỏ qua — giới hạn đã biết.
                pts = [_flip((x, y)) for x, y in geom.exterior.coords]
                msp.add_lwpolyline(
                    pts, close=True, dxfattribs={"layer": "WALLS", "elevation": z}
                )

        # Cửa / cửa sổ: hình chữ nhật tại vị trí lỗ trên mặt bằng.
        walls_by_id = {w.id: w for w in level.walls}
        for opening in level.openings:
            wall = walls_by_id.get(opening.wallId)
            if wall is None:
                continue
            rect = _opening_rect(wall, opening)
            if not rect:
                continue
            layer = "DOORS" if opening.type == "door" else "WINDOWS"
            pts = [_flip(p) for p in rect]
            msp.add_lwpolyline(
                pts, close=True, dxfattribs={"layer": layer, "elevation": z}
            )

        # Dimension tuyến tính cho mỗi ĐOẠN tường (entity DIMENSION thật).
        for wall in level.walls:
            pts = [(float(p.x), float(p.y)) for p in wall.points]
            for i in range(len(pts) - 1):
                if pts[i] == pts[i + 1]:
                    continue
                base = _flip(_dim_base(pts[i], pts[i + 1], cx, cy))
                p1 = _flip(pts[i])
                p2 = _flip(pts[i + 1])
                # Góc đo phải theo hướng đoạn tường: mặc định angle=0 chỉ đo
                # theo phương ngang nên đoạn đứng sẽ cho measurement = 0.
                angle = math.degrees(math.atan2(p2[1] - p1[1], p2[0] - p1[0]))
                msp.add_linear_dim(
                    base=base, p1=p1, p2=p2, angle=angle,
                    dxfattribs={"layer": "DIMS"},
                ).render()

    buf = io.StringIO()
    doc.write(buf)
    return buf.getvalue()
