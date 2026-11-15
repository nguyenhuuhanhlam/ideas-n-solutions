"""Test API POST /export/dxf: đọc lại DXF bằng ezdxf, kiểm tra layer/kích thước."""

import io
import json
from pathlib import Path

import ezdxf
from fastapi.testclient import TestClient

from main import app

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
    assert len(list(msp.query("LWPOLYLINE[layer=='DOORS']"))) == 1
    assert len(list(msp.query("LWPOLYLINE[layer=='WINDOWS']"))) == 1


def test_export_dimensions():
    """Kích thước đúng: bbox tường ngoài 8200x6200 (8000x6000 + dày 200 mỗi bên),
    và có DIMENSION đo đúng 8000 cho tường bắc."""
    doc = ezdxf.read(io.StringIO(_export(SAMPLE).decode()))
    msp = doc.modelspace()
    walls = list(msp.query("LWPOLYLINE[layer=='WALLS']"))
    xs, ys = [], []
    for e in walls:
        for x, y in e.get_points(format="xy"):
            xs.append(x)
            ys.append(y)
    assert max(xs) - min(xs) == 8200
    assert max(ys) - min(ys) == 6200
    dims = list(msp.query("DIMENSION[layer=='DIMS']"))
    assert len(dims) == 5  # 1 dimension mỗi tường
    # Mọi dimension đều phải đo đúng độ dài tường của nó:
    # 2 tường ngang 8000 + 3 tường đứng 6000 (2 ngoài + 1 ngăn).
    assert sorted(d.get_measurement() for d in dims) == [
        6000, 6000, 6000, 8000, 8000,
    ]


def test_export_invalid_body_422():
    bad = json.loads(json.dumps(SAMPLE))
    del bad["levels"][0]["walls"][0]["thickness"]  # thiếu field bắt buộc
    res = client.post("/export/dxf", json=bad)
    assert res.status_code == 422
