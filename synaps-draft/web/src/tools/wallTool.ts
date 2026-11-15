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

/**
 * Snap điểm chuột thô:
 * 1. Đầu mút / trung điểm tường có sẵn trong bán kính 10px.
 * 2. Nếu đang vẽ (có draftStart): khóa góc 0/45/90° khi góc gần bội 45°.
 * 3. Còn lại: snap lưới 100mm.
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
    for (const [point, kind] of [
      [w.start, 'endpoint'],
      [w.end, 'endpoint'],
      [midpoint(w.start, w.end), 'midpoint'],
    ] as const) {
      const d = distance(raw, point);
      if (d <= radius) candidates.push({ point, kind, d });
    }
  }
  candidates.sort((a, b) => a.d - b.d);
  const best = candidates[0];
  if (best) return { point: best.point, kind: best.kind };

  if (draftStart) {
    const angle = Math.atan2(raw.y - draftStart.y, raw.x - draftStart.x);
    const nearest = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
    if (Math.abs(angle - nearest) <= ANGLE_TOLERANCE) {
      return { point: snapAngle(draftStart, raw), kind: 'angle' };
    }
  }

  return { point: snapPointToGrid(raw, GRID_STEP), kind: 'grid' };
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
    start,
    end,
    thickness,
  };
}
