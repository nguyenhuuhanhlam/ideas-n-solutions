import { union, type Pair, type Polygon } from 'polygon-clipping';
import type { Point, Wall } from './schema';

/** Hình học thuần, không phụ thuộc React/Konva. Đơn vị mm, tọa độ nguyên. */

export type SnapKind = 'grid' | 'endpoint' | 'midpoint' | 'angle' | null;

export function distance(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function wallLength(wall: Wall): number {
  return distance(wall.start, wall.end);
}

export function midpoint(a: Point, b: Point): Point {
  return { x: Math.round((a.x + b.x) / 2), y: Math.round((a.y + b.y) / 2) };
}

/** Snap một tọa độ về bội gần nhất của `step` (mm). */
export function snapToGrid(value: number, step: number): number {
  return Math.round(value / step) * step;
}

export function snapPointToGrid(p: Point, step: number): Point {
  return { x: snapToGrid(p.x, step), y: snapToGrid(p.y, step) };
}

/**
 * Khóa góc của đoạn origin->p về bội gần nhất của 45° (0/45/90/...),
 * giữ nguyên độ dài. Trả về điểm đã khóa (làm tròn về mm nguyên).
 */
export function snapAngle(origin: Point, p: Point): Point {
  const len = distance(origin, p);
  if (len === 0) return { ...origin };
  const angle = Math.atan2(p.y - origin.y, p.x - origin.x);
  const snapped = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
  return {
    x: Math.round(origin.x + len * Math.cos(snapped)),
    y: Math.round(origin.y + len * Math.sin(snapped)),
  };
}

export interface Projection {
  /** Khoảng cách dọc tường từ start tới điểm chiếu (mm). */
  offset: number;
  /** Khoảng cách vuông góc từ điểm tới đường tâm tường (mm). */
  distance: number;
  /** Điểm gần nhất trên đoạn tường. */
  point: Point;
}

/** Chiếu điểm p lên đoạn tường (clamp trong [start, end]). */
export function projectPointOnWall(p: Point, wall: Wall): Projection {
  const dx = wall.end.x - wall.start.x;
  const dy = wall.end.y - wall.start.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) {
    return { offset: 0, distance: distance(p, wall.start), point: { ...wall.start } };
  }
  const t = Math.min(
    1,
    Math.max(0, ((p.x - wall.start.x) * dx + (p.y - wall.start.y) * dy) / lenSq),
  );
  const point = {
    x: Math.round(wall.start.x + t * dx),
    y: Math.round(wall.start.y + t * dy),
  };
  const len = Math.sqrt(lenSq);
  return { offset: t * len, distance: distance(p, point), point };
}

/**
 * Polygon thân tường: hình chữ nhật có chiều dài = đoạn start->end,
 * chiều rộng = thickness, tâm là đường tâm tường.
 * Trả về 4 đỉnh theo thứ tự (phẳng, dạng [x0,y0,x1,y1,...] cho Konva Line).
 */
export function wallPolygon(wall: Wall): number[] {
  const len = wallLength(wall);
  if (len === 0) {
    const h = wall.thickness / 2;
    return [
      wall.start.x - h,
      wall.start.y - h,
      wall.start.x + h,
      wall.start.y - h,
      wall.start.x + h,
      wall.start.y + h,
      wall.start.x - h,
      wall.start.y + h,
    ];
  }
  const nx = (-(wall.end.y - wall.start.y) / len) * (wall.thickness / 2);
  const ny = ((wall.end.x - wall.start.x) / len) * (wall.thickness / 2);
  return [
    wall.start.x + nx,
    wall.start.y + ny,
    wall.end.x + nx,
    wall.end.y + ny,
    wall.end.x - nx,
    wall.end.y - ny,
    wall.start.x - nx,
    wall.start.y - ny,
  ];
}

/** Chuyển polygon phẳng [x0,y0,x1,y1,...] thành ring [[x0,y0],[x1,y1],...]. */
function toRing(flat: number[]): Pair[] {
  const ring: Pair[] = [];
  for (let i = 0; i + 1 < flat.length; i += 2) ring.push([flat[i], flat[i + 1]]);
  return ring;
}

function fromRing(ring: Pair[]): number[] {
  return ring.flat();
}

/**
 * Union các polygon thân tường thành các khối liền nhau (nối góc sạch:
 * 2 tường giao nhau không còn đường biên chồng nhau ở góc).
 * Trả về mảng polygon phẳng; mỗi polygon chỉ lấy vòng ngoài (bỏ lỗ trong,
 * hiếm gặp ở giai đoạn này — ví dụ sân trong khép kín sẽ bị tô đầy).
 */
export function mergeWallPolygons(walls: Wall[]): number[][] {
  if (walls.length === 0) return [];
  const polys: Polygon[] = walls.map((w) => [toRing(wallPolygon(w))]);
  const merged = union(polys[0], ...polys.slice(1));
  return merged.map((poly) => fromRing(poly[0])).filter((flat) => flat.length >= 6);
}

export interface MergedWallPolygon {
  /** Vòng ngoài (phẳng [x0,y0,...]). */
  outer: number[];
  /** Các lỗ trong (phòng/sân kín) — render phải chừa ra, không tô. */
  holes: number[][];
}

/**
 * Như mergeWallPolygons nhưng GIỮ lỗ trong: vòng tường khép kín (nhà mẫu)
 * có 2 lỗ phòng; bỏ lỗ sẽ tô đầy cả phòng thành một khối đặc.
 * Render bằng Konva Shape với fillRule="evenodd".
 */
export function mergeWallPolygonsWithHoles(walls: Wall[]): MergedWallPolygon[] {
  if (walls.length === 0) return [];
  const polys: Polygon[] = walls.map((w) => [toRing(wallPolygon(w))]);
  const merged = union(polys[0], ...polys.slice(1));
  return merged
    .map((poly) => ({
      outer: fromRing(poly[0]),
      holes: poly.slice(1).map(fromRing).filter((h) => h.length >= 6),
    }))
    .filter((p) => p.outer.length >= 6);
}

/**
 * Clamp offset của opening để nó nằm gọn trong tường:
 * offset ∈ [0, max(0, wallLength - width)].
 */
export function clampOpeningOffset(offset: number, width: number, wallLen: number): number {
  const max = Math.max(0, wallLen - width);
  return Math.min(max, Math.max(0, Math.round(offset)));
}
