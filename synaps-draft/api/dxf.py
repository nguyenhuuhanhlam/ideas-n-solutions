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


def _wall_polygon(wall: Wall) -> Polygon:
    """Thân tường: hình chữ nhật dài theo tường, rộng = thickness."""
    x1, y1 = wall.start.x, wall.start.y
    x2, y2 = wall.end.x, wall.end.y
    length = math.hypot(x2 - x1, y2 - y1)
    if length == 0:
        return Polygon()
    nx, ny = -(y2 - y1) / length, (x2 - x1) / length
    h = wall.thickness / 2
    return Polygon([
        (x1 + nx * h, y1 + ny * h),
        (x2 + nx * h, y2 + ny * h),
        (x2 - nx * h, y2 - ny * h),
        (x1 - nx * h, y1 - ny * h),
    ])


def _opening_rect(wall: Wall, opening: Opening) -> list[tuple[float, float]]:
    """Hình chữ nhật của lỗ cửa trên mặt bằng, dọc tường, rộng = thickness."""
    x1, y1 = wall.start.x, wall.start.y
    x2, y2 = wall.end.x, wall.end.y
    length = math.hypot(x2 - x1, y2 - y1)
    if length == 0:
        return []
    ux, uy = (x2 - x1) / length, (y2 - y1) / length
    nx, ny = -uy, ux
    h = wall.thickness / 2
    a0, a1 = opening.offset, opening.offset + opening.width
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
            xs += [w.start.x, w.end.x]
            ys += [w.start.y, w.end.y]
    if not xs:
        return (0.0, 0.0)
    return ((min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2)


def _dim_base(wall: Wall, cx: float, cy: float) -> tuple[float, float]:
    """Điểm base của dimension: trung điểm tường, offset 600mm xa tâm building."""
    x1, y1 = wall.start.x, wall.start.y
    x2, y2 = wall.end.x, wall.end.y
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
        polys = [_wall_polygon(w) for w in level.walls]
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

        # Dimension tuyến tính cho mỗi tường (entity DIMENSION thật).
        for wall in level.walls:
            if wall.start == wall.end:
                continue
            base = _flip(_dim_base(wall, cx, cy))
            p1 = _flip((float(wall.start.x), float(wall.start.y)))
            p2 = _flip((float(wall.end.x), float(wall.end.y)))
            # Góc đo phải theo hướng tường: mặc định angle=0 chỉ đo theo
            # phương ngang nên tường đứng sẽ cho measurement = 0.
            angle = math.degrees(math.atan2(p2[1] - p1[1], p2[0] - p1[0]))
            msp.add_linear_dim(
                base=base, p1=p1, p2=p2, angle=angle,
                dxfattribs={"layer": "DIMS"},
            ).render()

    buf = io.StringIO()
    doc.write(buf)
    return buf.getvalue()
