"""Pydantic v2 models khớp EXACT với Zod schema ở web/src/model/schema.ts.

Mọi tọa độ/kích thước là số nguyên, đơn vị mm. Thay đổi schema phải sửa
đồng thời cả hai phía (Zod + Pydantic).
"""

from typing import Literal

from pydantic import BaseModel, ConfigDict


class Point(BaseModel):
    model_config = ConfigDict(extra="forbid")
    x: int
    y: int


class Wall(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id: str
    start: Point
    end: Point
    thickness: int
    height: int | None = None


class Opening(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id: str
    wallId: str
    type: Literal["door", "window"]
    offset: int
    width: int
    height: int
    sillHeight: int


class Level(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id: str
    name: str
    elevation: int
    height: int
    walls: list[Wall]
    openings: list[Opening]


class Building(BaseModel):
    model_config = ConfigDict(extra="forbid")
    version: Literal[1]
    levels: list[Level]
