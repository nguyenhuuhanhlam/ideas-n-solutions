import { pointAtChainOffset } from './geometry';
import type { Opening, Point, Wall } from './schema';

/** Hình chữ nhật khung kéo (marquee) theo tọa độ world, mm. */
export interface MarqueeRect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/** Chuẩn hóa hình chữ nhật: x0 <= x1, y0 <= y1 (kéo từ góc nào cũng được). */
function normalizeRect(r: MarqueeRect): MarqueeRect {
  return {
    x0: Math.min(r.x0, r.x1),
    y0: Math.min(r.y0, r.y1),
    x1: Math.max(r.x0, r.x1),
    y1: Math.max(r.y0, r.y1),
  };
}

function pointInRect(p: Point, r: MarqueeRect): boolean {
  return p.x >= r.x0 && p.x <= r.x1 && p.y >= r.y0 && p.y <= r.y1;
}

/** Dấu của tích chéo (b−a)×(c−a): >0 trái, <0 phải, 0 thẳng hàng. */
function cross(a: Point, b: Point, c: Point): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

function onSegment(a: Point, b: Point, c: Point): boolean {
  return (
    Math.min(a.x, b.x) <= c.x &&
    c.x <= Math.max(a.x, b.x) &&
    Math.min(a.y, b.y) <= c.y &&
    c.y <= Math.max(a.y, b.y)
  );
}

/** Hai đoạn thẳng có cắt nhau (kể cả chạm đầu mút / chồng nhau) không. */
function segmentsIntersect(a: Point, b: Point, c: Point, d: Point): boolean {
  const d1 = cross(c, d, a);
  const d2 = cross(c, d, b);
  const d3 = cross(a, b, c);
  const d4 = cross(a, b, d);
  if ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) {
    if ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0)) return true;
  }
  if (d1 === 0 && onSegment(c, d, a)) return true;
  if (d2 === 0 && onSegment(c, d, b)) return true;
  if (d3 === 0 && onSegment(a, b, c)) return true;
  if (d4 === 0 && onSegment(a, b, d)) return true;
  return false;
}

/** Đoạn thẳng có chạm hình chữ nhật không (đầu mút trong khung hoặc cắt mép khung). */
function segmentIntersectsRect(a: Point, b: Point, r: MarqueeRect): boolean {
  if (pointInRect(a, r) || pointInRect(b, r)) return true;
  const corners: Point[] = [
    { x: r.x0, y: r.y0 },
    { x: r.x1, y: r.y0 },
    { x: r.x1, y: r.y1 },
    { x: r.x0, y: r.y1 },
  ];
  for (let i = 0; i < 4; i++) {
    if (segmentsIntersect(a, b, corners[i], corners[(i + 1) % 4])) return true;
  }
  return false;
}

/**
 * Chọn vật thể bằng khung kéo: tường được chọn khi có đoạn tâm cắt khung
 * hoặc đỉnh nằm trong khung; cửa được chọn khi ĐIỂM GIỮA của nó
 * (offset + width/2 dọc tường) nằm trong khung. Cửa không có tường thì bỏ qua.
 */
export function marqueeSelect(
  walls: Wall[],
  openings: Opening[],
  rect: MarqueeRect,
): { wallIds: string[]; openingIds: string[] } {
  const r = normalizeRect(rect);
  const wallIds = walls
    .filter((w) => {
      const pts = w.points;
      if (pts.some((p) => pointInRect(p, r))) return true;
      for (let i = 0; i + 1 < pts.length; i++) {
        if (segmentIntersectsRect(pts[i], pts[i + 1], r)) return true;
      }
      return false;
    })
    .map((w) => w.id);
  const wallById = new Map(walls.map((w) => [w.id, w]));
  const openingIds = openings
    .filter((o) => {
      const w = wallById.get(o.wallId);
      if (!w) return false;
      const { point } = pointAtChainOffset(w.points, o.offset + o.width / 2);
      return pointInRect(point, r);
    })
    .map((o) => o.id);
  return { wallIds, openingIds };
}
