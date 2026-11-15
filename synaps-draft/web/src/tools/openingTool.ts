import { clampOpeningOffset, projectPointOnWall, wallLength } from '../model/geometry';
import type { Opening, Point, Wall } from '../model/schema';

export const OPENING_DEFAULTS = {
  door: { width: 900, height: 2100, sillHeight: 0 },
  window: { width: 1200, height: 1200, sillHeight: 900 },
} as const;

export type OpeningType = 'door' | 'window';

/** Tạo Opening mới trên tường, offset đã clamp để nằm gọn trong tường. */
export function createOpening(
  wall: Wall,
  type: OpeningType,
  offsetAlongWall: number,
): Opening {
  const def = OPENING_DEFAULTS[type];
  return {
    id: `opening-${crypto.randomUUID()}`,
    wallId: wall.id,
    type,
    offset: clampOpeningOffset(offsetAlongWall, def.width, wallLength(wall)),
    width: def.width,
    height: def.height,
    sillHeight: def.sillHeight,
  };
}

/**
 * Tìm tường gần nhất với điểm p trong bán kính `radiusMm`
 * (đo vuông góc tới đường tâm tường). Trả về null nếu không có tường nào đủ gần.
 */
export function findNearestWall(
  p: Point,
  walls: Wall[],
  radiusMm: number,
): { wall: Wall; offset: number } | null {
  let best: { wall: Wall; offset: number; distance: number } | null = null;
  for (const wall of walls) {
    const proj = projectPointOnWall(p, wall);
    if (proj.distance <= radiusMm && (!best || proj.distance < best.distance)) {
      best = { wall, offset: proj.offset, distance: proj.distance };
    }
  }
  return best ? { wall: best.wall, offset: best.offset } : null;
}
