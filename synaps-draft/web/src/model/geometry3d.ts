import { distance, wallLength, wallSegments as polylineSegments } from './geometry';
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

/** Góc xoay quanh Y để trục +X của box trùng hướng đoạn (dx, dz). */
function segmentRotationY(dx: number, dz: number): number {
  return Math.atan2(-dz, dx);
}

/**
 * Chia một tường thành các box chữ nhật quanh các lỗ cửa (KHÔNG dùng CSG):
 * - đoạn đầy chiều cao ở hai bên mỗi lỗ (và giữa các lỗ),
 * - đoạn lanh-tô phía trên lỗ (từ sill+height tới đỉnh tường),
 * - đoạn dưới bậu nếu sillHeight > 0 (cửa sổ).
 * Tường polyline: xử lý từng đoạn riêng, lỗ cửa kẹp vào đoạn chứa nó
 * (lỗ bắc qua đỉnh thì tách thành 2 phần theo 2 đoạn).
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

  const thickness = wall.thickness;

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

  // Từng đoạn của chuỗi: lỗ kẹp vào đoạn (offset dọc chuỗi → offset cục bộ).
  let chainStart = 0;
  for (const [s0, s1] of polylineSegments(wall)) {
    const segLen = distance(s0, s1);
    if (segLen <= 0) continue;
    const ux = (s1.x - s0.x) / segLen;
    const uy = (s1.y - s0.y) / segLen;
    const rotationY = segmentRotationY(s1.x - s0.x, s1.y - s0.y);

    // Điểm 2D tại khoảng cách dọc ĐOẠN t (mm) từ đầu đoạn.
    const at = (t: number) => ({ x: s0.x + ux * t, y: s0.y + uy * t });

    const box = (a: number, b: number, y0: number, y1: number): Box3D | null => {
      if (b - a <= 0 || y1 - y0 <= 0) return null;
      const mid = at((a + b) / 2);
      return {
        center: [mid.x / MM, (elevation + (y0 + y1) / 2) / MM, mid.y / MM],
        size: [(b - a) / MM, (y1 - y0) / MM, thickness / MM],
        rotationY,
      };
    };

    const localHoles = holes
      .map((h) => ({
        a: Math.max(0, h.a - chainStart),
        b: Math.min(segLen, h.b - chainStart),
        sill: h.sill,
        top: h.top,
      }))
      .filter((h) => h.b > h.a);

    let cursor = 0;
    for (const h of localHoles) {
      // Đoạn đầy chiều cao trước lỗ.
      push(box(cursor, h.a, 0, height));
      // Đoạn dưới bậu (cửa sổ): từ chân tường tới sill, clamp trong chiều cao tường.
      push(box(h.a, h.b, 0, Math.min(h.sill, height)));
      // Lanh-tô phía trên lỗ.
      push(box(h.a, h.b, Math.min(h.top, height), height));
      cursor = Math.max(cursor, h.b);
    }
    // Đoạn đầy chiều cao sau lỗ cuối.
    push(box(cursor, segLen, 0, height));
    chainStart += segLen;
  }

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
      for (const p of w.points) {
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
