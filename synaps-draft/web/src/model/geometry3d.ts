import { wallLength } from './geometry';
import type { Building, Opening, Wall } from './schema';

/**
 * Hình học 3D thuần, suy ra từ Building JSON. Không phụ thuộc three.js.
 *
 * Quy ước tọa độ 3D (ghi chú — dùng chung cho View3D):
 * - 1 unit = 1 m (mm chia 1000).
 * - X (3D) = x (2D); Z (3D) = y (2D): Y 2D hướng xuống nên Z dương
 *   đi về phía nam của mặt bằng. Y (3D) thẳng đứng, hướng lên.
 * - Tường đứng từ elevation của level tới elevation + chiều cao tường
 *   (height riêng của tường nếu có, không thì height của level).
 */

export interface Box3D {
  /** Tâm box, đơn vị m: [X, Y, Z]. */
  center: [number, number, number];
  /** Kích thước [dài dọc tường, cao, dày], đơn vị m. */
  size: [number, number, number];
  /** Góc xoay quanh trục Y (radian) để trục dài của box trùng hướng tường. */
  rotationY: number;
}

const MM = 1000;

/** Góc xoay quanh Y để trục +X của box trùng hướng tường (dx, dz). */
function wallRotationY(wall: Wall): number {
  return Math.atan2(-(wall.end.y - wall.start.y), wall.end.x - wall.start.x);
}

/**
 * Chia một tường thành các box chữ nhật quanh các lỗ cửa (KHÔNG dùng CSG):
 * - đoạn đầy chiều cao ở hai bên mỗi lỗ (và giữa các lỗ),
 * - đoạn lanh-tô phía trên lỗ (từ sill+height tới đỉnh tường),
 * - đoạn dưới bậu nếu sillHeight > 0 (cửa sổ).
 * Openings được clamp vào trong tường; các opening chồng nhau không được
 * hỗ trợ (giả định UI không tạo ra trường hợp đó).
 */
export function wallSegments(
  wall: Wall,
  openings: Opening[],
  levelHeight: number,
  elevation = 0,
): Box3D[] {
  const len = wallLength(wall);
  const height = wall.height ?? levelHeight;
  if (len <= 0 || height <= 0) return [];

  const ux = (wall.end.x - wall.start.x) / len;
  const uy = (wall.end.y - wall.start.y) / len;
  const rotationY = wallRotationY(wall);
  const thickness = wall.thickness;

  // Điểm 2D tại khoảng cách dọc tường t (mm) từ start.
  const at = (t: number) => ({ x: wall.start.x + ux * t, y: wall.start.y + uy * t });

  const box = (a: number, b: number, y0: number, y1: number): Box3D | null => {
    if (b - a <= 0 || y1 - y0 <= 0) return null;
    const mid = at((a + b) / 2);
    return {
      center: [mid.x / MM, (elevation + (y0 + y1) / 2) / MM, mid.y / MM],
      size: [(b - a) / MM, (y1 - y0) / MM, thickness / MM],
      rotationY,
    };
  };

  const holes = openings
    .filter((o) => o.wallId === wall.id)
    .map((o) => ({
      a: Math.max(0, o.offset),
      b: Math.min(len, o.offset + o.width),
      sill: Math.max(0, o.sillHeight),
      top: Math.max(0, o.sillHeight) + o.height,
    }))
    .filter((h) => h.b > h.a && h.top > 0)
    .sort((p, q) => p.a - q.a);

  const boxes: Box3D[] = [];
  const push = (b: Box3D | null) => {
    if (b) boxes.push(b);
  };

  let cursor = 0;
  for (const h of holes) {
    // Đoạn đầy chiều cao trước lỗ.
    push(box(cursor, h.a, 0, height));
    // Đoạn dưới bậu (cửa sổ): từ chân tường tới sill, clamp trong chiều cao tường.
    push(box(h.a, h.b, 0, Math.min(h.sill, height)));
    // Lanh-tô phía trên lỗ.
    push(box(h.a, h.b, Math.min(h.top, height), height));
    cursor = Math.max(cursor, h.b);
  }
  // Đoạn đầy chiều cao sau lỗ cuối.
  push(box(cursor, len, 0, height));

  return boxes;
}

/** Khung bao của toàn bộ building, đơn vị m (X/Z từ tọa độ 2D, Y tới đỉnh tường cao nhất). */
export interface BuildingBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  maxY: number;
}

export function buildingBounds(building: Building): BuildingBounds {
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  let maxY = 0;
  for (const level of building.levels) {
    for (const w of level.walls) {
      const half = w.thickness / 2 / MM;
      for (const p of [w.start, w.end]) {
        minX = Math.min(minX, p.x / MM - half);
        maxX = Math.max(maxX, p.x / MM + half);
        minZ = Math.min(minZ, p.y / MM - half);
        maxZ = Math.max(maxZ, p.y / MM + half);
      }
      maxY = Math.max(maxY, (level.elevation + (w.height ?? level.height)) / MM);
    }
    maxY = Math.max(maxY, (level.elevation + level.height) / MM);
  }
  if (!Number.isFinite(minX)) {
    return { minX: -5, maxX: 5, minZ: -5, maxZ: 5, maxY: 3 };
  }
  return { minX, maxX, minZ, maxZ, maxY };
}
