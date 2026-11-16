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
        # Mỗi đoạn của tường polyline đóng góp 1 polygon hình chữ nhật.
        polys = [p for w in level.walls for p in _wall_polygons(w)]
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
