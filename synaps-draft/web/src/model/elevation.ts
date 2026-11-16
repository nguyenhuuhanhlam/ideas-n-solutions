import type { Level, Opening, Point, Wall } from './schema';
import { distance, pointAtChainOffset } from './geometry';
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

/** 4 góc của thân MỖI đoạn tường (hình chữ nhật 2 đầu ± thickness/2 theo pháp tuyến). */
function wallCorners(wall: Wall): Point[] {
  const corners: Point[] = [];
  for (let i = 0; i + 1 < wall.points.length; i++) {
    const a = wall.points[i];
    const b = wall.points[i + 1];
    const len = distance(a, b);
    const ux = len === 0 ? 1 : (b.x - a.x) / len;
    const uy = len === 0 ? 0 : (b.y - a.y) / len;
    const nx = -uy;
    const ny = ux;
    const h = wall.thickness / 2;
    corners.push(
      { x: a.x + nx * h, y: a.y + ny * h },
      { x: b.x + nx * h, y: b.y + ny * h },
      { x: b.x - nx * h, y: b.y - ny * h },
      { x: a.x - nx * h, y: a.y - ny * h },
    );
  }
  return corners;
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
  // Tâm X trung bình của các đỉnh (tường 1 đoạn = trung điểm như trước).
  const cx =
    wall.points.length === 0
      ? 0
      : wall.points.reduce((s, p) => s + p.x, 0) / wall.points.length;
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
  // Hướng đoạn chứa mép đầu lỗ; lỗ vẽ dọc đoạn này (giới hạn: lỗ bắc qua
  // đỉnh polyline chỉ vẽ theo đoạn chứa offset — chưa xảy ra ở D3a).
  const { point: a, segmentIndex } = pointAtChainOffset(wall.points, opening.offset);
  const p0 = wall.points[segmentIndex];
  const p1 = wall.points[segmentIndex + 1];
  const segLen = p0 && p1 ? distance(p0, p1) : 0;
  const ux = segLen === 0 ? 1 : (p1.x - p0.x) / segLen;
  const uy = segLen === 0 ? 0 : (p1.y - p0.y) / segLen;
  const nx = -uy;
  const ny = ux;
  const h = wall.thickness / 2;
  // 2 mép lỗ dọc tường × 2 mặt tường: lỗ xuyên suốt bề dày tường.
  const b = { x: a.x + ux * opening.width, y: a.y + uy * opening.width };
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
 * u(t) tuyến tính từng đoạn nên đảo trong đoạn chứa u. u ngoài phạm vi thì
 * ngoại suy từ đoạn gần nhất (nơi gọi kẹp lại bằng clampOffset — giữ hành vi
 * cũ của tường 1 đoạn). Mọi đoạn đều chiếu thành mép mỏng (u không đổi dọc
 * tường) thì không đảo được → trả NaN.
 */
export function elevationUToOffset(wall: Wall, view: ElevationView, u: number): number {
  const points = wall.points;
  let acc = 0;
  let nearest: { dist: number; offset: number } | null = null;
  for (let i = 0; i + 1 < points.length; i++) {
    const a = points[i];
    const b = points[i + 1];
    const segLen = distance(a, b);
    const ua = projectU(a, view);
    const ub = projectU(b, view);
    const du = segLen === 0 ? 0 : (ub - ua) / segLen;
    if (Math.abs(du) >= 1e-9) {
      const lo = Math.min(ua, ub);
      const hi = Math.max(ua, ub);
      if (u >= lo - 1e-9 && u <= hi + 1e-9) {
        return acc + (u - ua) / du;
      }
      // Ngoài đoạn: ghi nhận để ngoại suy nếu không đoạn nào chứa u.
      const dist = u < lo ? lo - u : u - hi;
      if (!nearest || dist < nearest.dist) {
        nearest = { dist, offset: acc + (u - ua) / du };
      }
    }
    acc += segLen;
  }
  return nearest ? nearest.offset : Number.NaN;
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
