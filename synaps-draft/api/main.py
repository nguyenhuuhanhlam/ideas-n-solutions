"""API xuất DXF cho Synaps Draft — chỉ 1 endpoint: POST /export/dxf."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

from dxf import building_to_dxf
from models import Building

app = FastAPI(title="Synaps Draft DXF Export")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)


@app.post("/export/dxf")
def export_dxf(building: Building) -> Response:
    """Nhận Building JSON, trả file DXF. Body sai schema -> 422 (FastAPI)."""
    return Response(
        content=building_to_dxf(building),
        media_type="application/dxf",
        headers={"Content-Disposition": 'attachment; filename="building.dxf"'},
    )
