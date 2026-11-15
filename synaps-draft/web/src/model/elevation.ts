import type { Level, Opening, Point, Wall } from './schema';
import { wallLength } from './geometry';
import { clampOffset, clampSill } from './openingDrag';

/** Các view 2D: mặt bằng (Top) và 2 mặt đứng (Left/Right). */
export type View2d = 'top' | 'left' | 'right';

/** Mặt đứng chỉ có left/right (không gồm Top). */
export type ElevationView = 'left' | 'right';

/** Hình chữ nhật chiếu của thân tường trên mặt đứng (mm, số nguyên). */
export interface WallElevation {
  u0: number;
  u1: number;
  vBottom: number;
  vTop: number;
  /** Khoảng cách tới người xem: nhỏ = gần. Left: tâm X; Right: −tâm X. */
  depth: number;
}

/** Hình chữ nhật chiếu của lỗ cửa trên mặt đứng (mm, số nguyên). */
export interface OpeningElevation {
  u0: number;
  u1: number;
  vBottom: number;
  vTop: number;
}

export interface ElevationBounds {
  u0: number;
  u1: number;
  vBottom: number;
  vTop: number;
}

/**
 * Quy ước chiếu:
 * - Left = nhìn từ phía TÂY (theo hướng +X): u = y (bắc trái, nam phải).
 * - Right = nhìn từ phía ĐÔNG (theo hướng −X): u = −y (nam trái, bắc phải).
 * - v = cao độ z (hướng lên). Khi vẽ lên Konva (Y hướng xuống) thì y = −v.
 */
function projectU(p: Point, view: ElevationView): number {
  return view === 'left' ? p.y : -p.y;
}

/** 4 góc của thân tường (hình chữ nhật start/end ± thickness/2 theo pháp tuyến). */
function wallCorners(wall: Wall): Point[] {
  const len = wallLength(wall);
  const ux = len === 0 ? 1 : (wall.end.x - wall.start.x) / len;
  const uy = len === 0 ? 0 : (wall.end.y - wall.start.y) / len;
  const nx = -uy;
  const ny = ux;
  const h = wall.thickness / 2;
  return [
    { x: wall.start.x + nx * h, y: wall.start.y + ny * h },
    { x: wall.end.x + nx * h, y: wall.end.y + ny * h },
    { x: wall.end.x - nx * h, y: wall.end.y - ny * h },
    { x: wall.start.x - nx * h, y: wall.start.y - ny * h },
  ];
}

function wallHeight(wall: Wall, level: Level): number {
  return wall.height ?? level.height;
}

export function projectWallToElevation(
  wall: Wall,
  level: Level,
  view: ElevationView,
): WallElevation {
  // Giới hạn: tường xiên chiếu thành hình chữ nhật bao (min/max u của 4 góc),
  // không phải hình bình hành đúng — đủ cho mặt đứng trực giao giai đoạn 2A.
  const us = wallCorners(wall).map((p) => projectU(p, view));
  const cx = (wall.start.x + wall.end.x) / 2;
  return {
    // + 0 để chuẩn hóa −0 thành 0 (đảo dấu 0 ra −0).
    u0: Math.round(Math.min(...us)) + 0,
    u1: Math.round(Math.max(...us)) + 0,
    vBottom: level.elevation,
    vTop: level.elevation + wallHeight(wall, level),
    depth: (view === 'left' ? cx : -cx) + 0,
  };
}

export function projectOpeningToElevation(
  wall: Wall,
  opening: Opening,
  level: Level,
  view: ElevationView,
): OpeningElevation {
  const len = wallLength(wall);
  const ux = len === 0 ? 1 : (wall.end.x - wall.start.x) / len;
  const uy = len === 0 ? 0 : (wall.end.y - wall.start.y) / len;
  const nx = -uy;
  const ny = ux;
  const h = wall.thickness / 2;
  // 2 mép lỗ dọc tường × 2 mặt tường: lỗ xuyên suốt bề dày tường.
  const at = (t: number): Point => ({
    x: wall.start.x + ux * t,
    y: wall.start.y + uy * t,
  });
  const a = at(opening.offset);
  const b = at(opening.offset + opening.width);
  const corners: Point[] = [
    { x: a.x + nx * h, y: a.y + ny * h },
    { x: b.x + nx * h, y: b.y + ny * h },
    { x: b.x - nx * h, y: b.y - ny * h },
    { x: a.x - nx * h, y: a.y - ny * h },
  ];
  const us = corners.map((p) => projectU(p, view));
  return {
    u0: Math.round(Math.min(...us)) + 0,
    u1: Math.round(Math.max(...us)) + 0,
    vBottom: level.elevation + opening.sillHeight,
    vTop: level.elevation + opening.sillHeight + opening.height,
  };
}

/**
 * Chiếu ngược: tọa độ u trên mặt đứng → vị trí dọc tường (offset, chưa kẹp).
 * Dùng đường tâm tường: u(t) tuyến tính theo t nên đảo được. Tường chiếu
 * thành mép mỏng (u không đổi dọc tường) thì không đảo được → trả NaN.
 */
export function elevationUToOffset(wall: Wall, view: ElevationView, u: number): number {
  const len = wallLength(wall);
  if (len === 0) return Number.NaN;
  const du = (projectU(wall.end, view) - projectU(wall.start, view)) / len;
  if (Math.abs(du) < 1e-9) return Number.NaN;
  return (u - projectU(wall.start, view)) / du;
}

/**
 * Chiếu ngược: điểm (u, v) trên mặt đứng → {offset, sillHeight} của opening.
 * offset: vị trí dọc tường tại u (kẹp trong tường); sillHeight: cao độ v
 * trừ elevation của tầng (kẹp trong chiều cao tường). Không biết các opening
 * kề nên chỉ kẹp biên tường — chống chồng lấn do nơi gọi xử lý thêm.
 */
export function elevationPointToOpening(
  wall: Wall,
  opening: Opening,
  level: Level,
  view: ElevationView,
  u: number,
  v: number,
): { offset: number; sillHeight: number } {
  const raw = elevationUToOffset(wall, view, u);
  return {
    offset: Number.isNaN(raw)
      ? opening.offset
      : clampOffset(wall, [opening], opening.id, raw),
    sillHeight: clampSill(wallHeight(wall, level), opening, v - level.elevation),
  };
}

/** Sắp xếp tường xa → gần (vẽ xa trước để tường gần đè lên sau). */
export function sortWallsByDepth(
  walls: Wall[],
  level: Level,
  view: ElevationView,
): Wall[] {
  return [...walls].sort(
    (a, b) =>
      projectWallToElevation(b, level, view).depth -
      projectWallToElevation(a, level, view).depth,
  );
}

/** Bounding box của toàn bộ hình chiếu (để fit camera khi mở mặt đứng). */
export function elevationBounds(
  walls: Wall[],
  level: Level,
  view: ElevationView,
): ElevationBounds | null {
  if (walls.length === 0) return null;
  let u0 = Infinity;
  let u1 = -Infinity;
  let vBottom = Infinity;
  let vTop = -Infinity;
  for (const w of walls) {
    const r = projectWallToElevation(w, level, view);
    u0 = Math.min(u0, r.u0);
    u1 = Math.max(u1, r.u1);
    vBottom = Math.min(vBottom, r.vBottom);
    vTop = Math.max(vTop, r.vTop);
  }
  return { u0, u1, vBottom, vTop };
}
