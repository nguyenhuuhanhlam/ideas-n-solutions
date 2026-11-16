import { distance, midpoint, snapAngle, snapPointToGrid, type SnapKind } from '../model/geometry';
import type { Point, Wall } from '../model/schema';

export type { SnapKind } from '../model/geometry';

export interface SnapResult {
  point: Point;
  kind: SnapKind;
}

const GRID_STEP = 100; // mm
const SNAP_RADIUS_PX = 10; // px trên màn hình
const ANGLE_TOLERANCE = (4 * Math.PI) / 180; // 4°
const EPS = 1e-6; // sai số cho giao điểm 2 đoạn thẳng

/**
 * Chân đường vuông góc từ `p` xuống đường tâm tường (xét mọi đoạn của
 * chuỗi, lấy chân gần `p` nhất). null khi mọi chân đều nằm ngoài đoạn,
 * hoặc trùng một đỉnh của tường trong ~1mm (đỉnh đã thuộc tầng snap
 * cao hơn — đầu mút).
 */
function perpendicularFoot(p: Point, wall: Wall): Point | null {
  let best: { foot: Point; d: number } | null = null;
  for (let i = 0; i + 1 < wall.points.length; i++) {
    const start = wall.points[i];
    const end = wall.points[i + 1];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) continue;
    const t = ((p.x - start.x) * dx + (p.y - start.y) * dy) / lenSq;
    if (t < -1e-9 || t > 1 + 1e-9) continue;
    const tc = Math.min(1, Math.max(0, t));
    const foot = {
      x: Math.round(start.x + tc * dx),
      y: Math.round(start.y + tc * dy),
    };
    if (wall.points.some((v) => distance(foot, v) <= 1)) continue;
    const d = distance(p, foot);
    if (!best || d < best.d) best = { foot, d };
  }
  return best?.foot ?? null;
}

/**
 * Giao điểm 2 đường tâm tường (xét mọi cặp đoạn của 2 chuỗi).
 * Bỏ qua cặp song song/trùng nhau, hoặc giao điểm nằm ngoài đoạn.
 */
function segmentIntersections(a: Wall, b: Wall): Point[] {
  const out: Point[] = [];
  for (let i = 0; i + 1 < a.points.length; i++) {
    for (let j = 0; j + 1 < b.points.length; j++) {
      const a0 = a.points[i];
      const a1 = a.points[i + 1];
      const b0 = b.points[j];
      const b1 = b.points[j + 1];
      const d1x = a1.x - a0.x;
      const d1y = a1.y - a0.y;
      const d2x = b1.x - b0.x;
      const d2y = b1.y - b0.y;
      const denom = d1x * d2y - d1y * d2x;
      if (Math.abs(denom) < EPS) continue;
      const cx = b0.x - a0.x;
      const cy = b0.y - a0.y;
      const t = (cx * d2y - cy * d2x) / denom;
      const s = (cx * d1y - cy * d1x) / denom;
      if (t < -EPS || t > 1 + EPS || s < -EPS || s > 1 + EPS) continue;
      out.push({
        x: Math.round(a0.x + t * d1x),
        y: Math.round(a0.y + t * d1y),
      });
    }
  }
  return out;
}

/**
 * Snap điểm chuột thô (theo thứ tự ưu tiên):
 * 1. Đầu mút / trung điểm tường có sẵn trong bán kính 10px.
 * 2. Giao điểm 2 tường trong bán kính 10px.
 * 3. Chân đường vuông góc xuống tường trong bán kính 10px.
 *    Giao điểm phải xét TRƯỚC chân vuông góc: chân vuông góc luôn gần
 *    con trỏ hơn mọi điểm khác trên tường (kể cả giao điểm), nên nếu
 *    xét sau thì giao điểm không bao giờ thắng.
 * 4. Nếu đang vẽ (có draftStart): khóa góc 0/45/90° khi góc gần bội 45°.
 * 5. Còn lại: snap lưới 100mm.
 */
export function computeSnap(
  raw: Point,
  walls: Wall[],
  scale: number,
  draftStart: Point | null,
): SnapResult {
  const radius = SNAP_RADIUS_PX / scale;

  const candidates: { point: Point; kind: Exclude<SnapKind, null>; d: number }[] = [];
  for (const w of walls) {
    for (const point of w.points) {
      const d = distance(raw, point);
      if (d <= radius) candidates.push({ point, kind: 'endpoint', d });
    }
    for (let i = 0; i + 1 < w.points.length; i++) {
      const point = midpoint(w.points[i], w.points[i + 1]);
      const d = distance(raw, point);
      if (d <= radius) candidates.push({ point, kind: 'midpoint', d });
    }
  }
  candidates.sort((a, b) => a.d - b.d);
  const best = candidates[0];
  if (best) return { point: best.point, kind: best.kind };

  const crossings: { point: Point; d: number }[] = [];
  for (let i = 0; i < walls.length; i++) {
    for (let j = i + 1; j < walls.length; j++) {
      for (const p of segmentIntersections(walls[i], walls[j])) {
        const d = distance(raw, p);
        if (d <= radius) crossings.push({ point: p, d });
      }
    }
  }
  crossings.sort((a, b) => a.d - b.d);
  if (crossings[0]) return { point: crossings[0].point, kind: 'intersection' };

  const feet: { point: Point; d: number }[] = [];
  for (const w of walls) {
    const foot = perpendicularFoot(raw, w);
    if (!foot) continue;
    const d = distance(raw, foot);
    if (d <= radius) feet.push({ point: foot, d });
  }
  feet.sort((a, b) => a.d - b.d);
  if (feet[0]) return { point: feet[0].point, kind: 'perpendicular' };

  if (draftStart) {
    const angle = Math.atan2(raw.y - draftStart.y, raw.x - draftStart.x);
    const nearest = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
    if (Math.abs(angle - nearest) <= ANGLE_TOLERANCE) {
      return { point: snapAngle(draftStart, raw), kind: 'angle' };
    }
  }

  return { point: snapPointToGrid(raw, GRID_STEP), kind: 'grid' };
}

export type SnapPointKind = 'endpoint' | 'midpoint' | 'perpendicular' | 'intersection';

export interface SnapPoint {
  point: Point;
  kind: SnapPointKind;
}

/**
 * Mọi điểm snap trong bán kính `radiusMm` quanh `point` (để hiện marker):
 * đầu mút, trung điểm, giao điểm 2 tường, chân vuông góc từ `point`
 * xuống tường. Khử trùng theo (x, y) làm tròn — đầu mút chung của 2 tường
 * chỉ trả 1 marker (kind ưu tiên: endpoint > midpoint > intersection
 * > perpendicular, theo thứ tự thu thập).
 */
export function snapPointsNear(point: Point, walls: Wall[], radiusMm: number): SnapPoint[] {
  const out: SnapPoint[] = [];
  const seen = new Set<string>();
  const push = (p: Point, kind: SnapPointKind) => {
    if (distance(point, p) > radiusMm) return;
    const key = `${Math.round(p.x)},${Math.round(p.y)}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ point: p, kind });
  };
  for (const w of walls) {
    for (const p of w.points) push(p, 'endpoint');
    for (let i = 0; i + 1 < w.points.length; i++) {
      push(midpoint(w.points[i], w.points[i + 1]), 'midpoint');
    }
  }
  for (let i = 0; i < walls.length; i++) {
    for (let j = i + 1; j < walls.length; j++) {
      for (const p of segmentIntersections(walls[i], walls[j])) push(p, 'intersection');
    }
  }
  for (const w of walls) {
    const foot = perpendicularFoot(point, w);
    if (foot) push(foot, 'perpendicular');
  }
  return out;
}

/**
 * Điểm cách `start` đúng `lengthMm` theo hướng start -> `directionPoint`.
 * Dùng khi người dùng gõ số chiều dài rồi Enter.
 */
export function pointAtLength(start: Point, directionPoint: Point, lengthMm: number): Point {
  const len = distance(start, directionPoint);
  if (len === 0 || lengthMm <= 0) return { ...start };
  const ux = (directionPoint.x - start.x) / len;
  const uy = (directionPoint.y - start.y) / len;
  return {
    x: Math.round(start.x + ux * lengthMm),
    y: Math.round(start.y + uy * lengthMm),
  };
}

export function createWall(start: Point, end: Point, thickness = 200): Wall {
  return {
    id: `wall-${crypto.randomUUID()}`,
    points: [start, end],
    thickness,
  };
}
