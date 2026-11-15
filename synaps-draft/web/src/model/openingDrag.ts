import { wallLength } from './geometry';
import type { Opening, Wall } from './schema';

/** Kẹp vị trí cửa khi kéo thả (hàm thuần, mm nguyên). */

/**
 * Kẹp offset của opening vào [0, độ dài tường − width], đồng thời không cho
 * chồng lên opening khác cùng tường. Trả về giá trị gần `desired` nhất mà
 * không chồng lấn; nếu không còn chỗ nào thì giữ offset cũ của opening.
 */
export function clampOffset(
  wall: Wall,
  openingsOnWall: Opening[],
  openingId: string,
  desired: number,
): number {
  const me = openingsOnWall.find((o) => o.id === openingId);
  const width = me?.width ?? 0;
  const max = Math.max(0, wallLength(wall) - width);
  const want = Math.min(max, Math.max(0, Math.round(desired)));
  const blockers = openingsOnWall.filter((o) => o.id !== openingId);
  const overlaps = (offset: number) =>
    blockers.some((o) => offset < o.offset + o.width && offset + width > o.offset);

  // Ứng viên: vị trí muốn tới + sát 2 mép của mỗi opening kề.
  const candidates = [want];
  for (const o of blockers) {
    candidates.push(o.offset - width, o.offset + o.width);
  }
  let best: number | null = null;
  for (const c of candidates) {
    if (c < 0 || c > max || overlaps(c)) continue;
    if (best === null || Math.abs(c - want) < Math.abs(best - want)) best = c;
  }
  return best ?? (me?.offset ?? want);
}

/** Kẹp sillHeight vào [0, chiều cao tường − chiều cao cửa]. */
export function clampSill(
  wallHeight: number,
  opening: Opening,
  desiredSill: number,
): number {
  const max = Math.max(0, wallHeight - opening.height);
  return Math.min(max, Math.max(0, Math.round(desiredSill)));
}
