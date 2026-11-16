"""Test API POST /export/dxf: đọc lại DXF bằng ezdxf, kiểm tra layer/kích thước."""

import io
import json
import math
from pathlib import Path

import ezdxf
from fastapi.testclient import TestClient
from shapely.geometry import Point as ShapelyPoint
from shapely.ops import unary_union

from dxf import _wall_body_polygons
from main import app
from models import Point, Wall

client = TestClient(app)
SAMPLE = json.loads((Path(__file__).parent / "sample_building.json").read_text())


def _export(payload: dict) -> bytes:
    res = client.post("/export/dxf", json=payload)
    assert res.status_code == 200, res.text
    assert res.headers["content-type"].startswith("application/dxf")
    return res.content


def test_export_layers_and_units():
    doc = ezdxf.read(io.StringIO(_export(SAMPLE).decode()))
    assert doc.header["$INSUNITS"] == 4  # mm
    layers = {layer.dxf.name for layer in doc.layers}
    assert {"WALLS", "DOORS", "WINDOWS", "DIMS"} <= layers


def test_export_walls_closed_polyline():
    doc = ezdxf.read(io.StringIO(_export(SAMPLE).decode()))
    msp = doc.modelspace()
    walls = [e for e in msp.query("LWPOLYLINE[layer=='WALLS']")]
    assert walls, "không có LWPOLYLINE ở layer WALLS"
    assert all(e.closed for e in walls)


def test_export_openings_present():
    doc = ezdxf.read(io.StringIO(_export(SAMPLE).decode()))
    msp = doc.modelspace()
    assert len(list(msp.query("LWPOLYLINE[layer=='DOORS']"))) == 3
    assert len(list(msp.query("LWPOLYLINE[layer=='WINDOWS']"))) == 4


def test_export_dimensions():
    """Kích thước đúng: bbox tường ngoài 5600x7900 (nhà demo 1 tầng hình
    chữ L: mặt ngoài tường bắc-tây ở 0, đông ở 5600, nam ở 7900),
    và 1 DIMENSION cho mỗi đoạn tường."""
    doc = ezdxf.read(io.StringIO(_export(SAMPLE).decode()))
    msp = doc.modelspace()
    walls = list(msp.query("LWPOLYLINE[layer=='WALLS']"))
    xs, ys = [], []
    for e in walls:
        for x, y in e.get_points(format="xy"):
            xs.append(x)
            ys.append(y)
    assert max(xs) - min(xs) == 5600
    assert max(ys) - min(ys) == 7900
    dims = list(msp.query("DIMENSION[layer=='DIMS']"))
    assert len(dims) == 9  # 1 dimension mỗi đoạn tường (nhà mẫu: 9 tường, 9 đoạn)
    # Mọi dimension đều phải đo đúng độ dài đoạn của nó:
    # bắc 5400, đông 7700, nam 3600, tây 3400, hall-nam 1800,
    # đứng 7700, tắm-nam 3600, ngủ-tây 850, ngủ-đông 650.
    assert sorted(d.get_measurement() for d in dims) == [
        650, 850, 1800, 3400, 3600, 3600, 5400, 7700, 7700,
    ]


def test_export_invalid_body_422():
    bad = json.loads(json.dumps(SAMPLE))
    del bad["levels"][0]["walls"][0]["thickness"]  # thiếu field bắt buộc
    res = client.post("/export/dxf", json=bad)
    assert res.status_code == 422


def _l_building() -> dict:
    """1 tường polyline hình L: đoạn ngang 3000 + đoạn đứng 4000, dày 200,
    kèm 1 cửa sổ nằm trọn trên đoạn đứng (offset 3200 = 200 vào đoạn 2)."""
    return {
        "version": 1,
        "levels": [{
            "id": "level-1", "name": "Tầng 1", "elevation": 0, "height": 3000,
            "walls": [{
                "id": "w-l",
                "points": [{"x": 0, "y": 0}, {"x": 3000, "y": 0}, {"x": 3000, "y": 4000}],
                "thickness": 200,
            }],
            "openings": [{
                "id": "o-win", "wallId": "w-l", "type": "window",
                "offset": 3200, "width": 1000, "height": 1200, "sillHeight": 900,
            }],
        }],
    }


def test_export_polyline_wall_segments():
    """Tường L 3 điểm: 1 DIMENSION cho mỗi đoạn (3000 + 4000), và thân
    tường bao phủ cả 2 đoạn: bbox 3100 x 4100 (đoạn ngang x 0..3000 cộng
    nửa dày ở góc trong x 3100; đoạn đứng y 0..4000 cộng nửa dày y -100)."""
    doc = ezdxf.read(io.StringIO(_export(_l_building()).decode()))
    msp = doc.modelspace()
    dims = list(msp.query("DIMENSION[layer=='DIMS']"))
    assert len(dims) == 2  # 1 dimension mỗi đoạn, không phải mỗi tường
    assert sorted(d.get_measurement() for d in dims) == [3000, 4000]
    walls = list(msp.query("LWPOLYLINE[layer=='WALLS']"))
    assert walls
    xs, ys = [], []
    for e in walls:
        for x, y in e.get_points(format="xy"):
            xs.append(x)
            ys.append(y)
    assert max(xs) - min(xs) == 3100
    assert max(ys) - min(ys) == 4100


def test_export_opening_on_second_segment():
    """Cửa sổ offset 3200 trên tường L nằm trên đoạn đứng (offset 200 vào
    đoạn 2), rộng 1000: rect phải chạy dọc Y, từ y=200 tới y=1200 (2D)."""
    doc = ezdxf.read(io.StringIO(_export(_l_building()).decode()))
    msp = doc.modelspace()
    wins = list(msp.query("LWPOLYLINE[layer=='WINDOWS']"))
    assert len(wins) == 1
    xs, ys = [], []
    for x, y in wins[0].get_points(format="xy"):
        xs.append(x)
        ys.append(y)
    # Dọc đoạn đứng x=3000, dày 200: x từ 2900 tới 3100; y lật dấu:
    # y_2d 200..1200 -> y_dxf -1200..-200.
    assert min(xs) == 2900 and max(xs) == 3100
    assert min(ys) == -1200 and max(ys) == -200


def test_export_old_format_rejected():
    """Tường dạng cũ {start, end} không còn hợp lệ: thiếu points -> 422."""
    bad = json.loads(json.dumps(SAMPLE))
    wall = bad["levels"][0]["walls"][0]
    pts = wall.pop("points")
    wall["start"], wall["end"] = pts[0], pts[1]
    res = client.post("/export/dxf", json=bad)
    assert res.status_code == 422


def test_miter_corner_area():
    """Tường L, góc ngoài được miter: diện tích union = 3000x200 + 4000x200
    - 100x100 (chồng nhau ở góc trong) + 100x100 (miếng vá miter ở góc
    ngoài) = 1.400.000."""
    wall = Wall(
        id="w-l",
        points=[Point(x=0, y=0), Point(x=3000, y=0), Point(x=3000, y=4000)],
        thickness=200,
    )
    merged = unary_union(_wall_body_polygons(wall))
    assert merged.area == 1_400_000


def test_export_miter_vertex_in_dxf():
    """End-to-end tường L: đỉnh miter của góc ngoài (3100, -100) trên mặt
    bằng phải xuất hiện làm 1 đỉnh LWPOLYLINE lớp WALLS — sau khi lật Y
    thành (3100, 100) trong DXF."""
    doc = ezdxf.read(io.StringIO(_export(_l_building()).decode()))
    msp = doc.modelspace()
    walls = list(msp.query("LWPOLYLINE[layer=='WALLS']"))
    assert walls
    found = False
    for e in walls:
        for x, y in e.get_points(format="xy"):
            if abs(x - 3100) < 1e-6 and abs(y - 100) < 1e-6:
                found = True
    assert found, "không thấy đỉnh miter (3100, 100) trong layer WALLS"


def test_sharp_corner_beveled():
    """Góc rất nhọn 10°: điểm miter nằm xa đỉnh hơn 2*thickness nên góc
    bị cắt phẳng (bevel) — điểm miter tính theo công thức KHÔNG nằm trong
    union thân tường."""
    wall = Wall(
        id="w-a",
        points=[Point(x=0, y=0), Point(x=3000, y=0), Point(x=47, y=521)],
        thickness=200,
    )
    merged = unary_union(_wall_body_polygons(wall))
    # Điểm miter theo công thức: giao của 2 mép ngoài tại đỉnh (3000, 0).
    p = (3000.0, 0.0)
    u = (1.0, 0.0)
    lv = math.hypot(47 - 3000, 521 - 0)
    v = ((47 - 3000) / lv, 521 / lv)
    cross = u[0] * v[1] - u[1] * v[0]
    assert cross > 0
    nout_u = (u[1], -u[0])
    nout_v = (v[1], -v[0])
    a = (p[0] + nout_u[0] * 100, p[1] + nout_u[1] * 100)
    b = (p[0] + nout_v[0] * 100, p[1] + nout_v[1] * 100)
    s = ((b[0] - a[0]) * v[1] - (b[1] - a[1]) * v[0]) / cross
    miter = (a[0] + s * u[0], a[1] + s * u[1])
    assert math.hypot(miter[0] - p[0], miter[1] - p[1]) > 2 * 200
    assert not merged.contains(ShapelyPoint(miter))
