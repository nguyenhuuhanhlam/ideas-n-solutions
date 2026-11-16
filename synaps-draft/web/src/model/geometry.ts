import { union, type Pair, type Polygon } from 'polygon-clipping';
import type { Building, Opening, Point, Wall } from './schema';

/** Hình học thuần, không phụ thuộc React/Konva. Đơn vị mm, tọa độ nguyên. */

export type SnapKind =
  | 'grid'
  | 'endpoint'
  | 'midpoint'
  | 'angle'
  | 'perpendicular'
  | 'intersection'
  | null;

export function distance(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

/** Các đoạn của tường polyline: từng cặp điểm liên tiếp. */
export function wallSegments(wall: Wall): [Point, Point][] {
  const segs: [Point, Point][] = [];
  for (let i = 0; i + 1 < wall.points.length; i++) {
    segs.push([wall.points[i], wall.points[i + 1]]);
  }
  return segs;
}

/** Độ dài một chuỗi điểm = tổng độ dài các đoạn (mm). */
export function pointsLength(points: Point[]): number {
  let sum = 0;
  for (let i = 0; i + 1 < points.length; i++) sum += distance(points[i], points[i + 1]);
  return sum;
}

/** Độ dài tường = tổng độ dài các đoạn (mm). */
export function wallLength(wall: Wall): number {
  return pointsLength(wall.points);
}

export function midpoint(a: Point, b: Point): Point {
  return { x: Math.round((a.x + b.x) / 2), y: Math.round((a.y + b.y) / 2) };
}

function samePoint(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

/** 2 tường có gộp thành 1 polyline được không: cùng thickness và cùng
 * height (cả 2 đều không có height cũng tính là bằng). */
export function canMergeWalls(a: Wall, b: Wall): boolean {
  return a.thickness === b.thickness && a.height === b.height;
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
  /** Khoảng cách dọc tường từ điểm đầu chuỗi tới điểm chiếu (mm). */
  offset: number;
  /** Khoảng cách vuông góc từ điểm tới đường tâm tường (mm). */
  distance: number;
  /** Điểm gần nhất trên chuỗi tường. */
  point: Point;
}

/**
 * Điểm trên chuỗi tại khoảng cách `offset` dọc chuỗi (từ points[0]).
 * Offset kẹp vào 2 đầu chuỗi. Trả kèm chỉ số đoạn chứa điểm đó
 * (để lấy hướng đoạn khi vẽ cửa).
 */
export function pointAtChainOffset(
  points: Point[],
  offset: number,
): { point: Point; segmentIndex: number } {
  if (points.length === 0) return { point: { x: 0, y: 0 }, segmentIndex: 0 };
  if (points.length === 1) return { point: { ...points[0] }, segmentIndex: 0 };
  const clamped = Math.max(0, offset);
  let acc = 0;
  for (let i = 0; i + 1 < points.length; i++) {
    const segLen = distance(points[i], points[i + 1]);
    if (clamped <= acc + segLen || i === points.length - 2) {
      const t = segLen === 0 ? 0 : Math.min(1, Math.max(0, (clamped - acc) / segLen));
      return {
        point: {
          x: Math.round(points[i].x + (points[i + 1].x - points[i].x) * t),
          y: Math.round(points[i].y + (points[i + 1].y - points[i].y) * t),
        },
        segmentIndex: i,
      };
    }
    acc += segLen;
  }
  return { point: { ...points[points.length - 1] }, segmentIndex: points.length - 2 };
}

/** Điểm gần nhất trên toàn chuỗi tường (xét mọi đoạn, lấy điểm gần nhất). */
export function nearestPointOnChain(
  points: Point[],
  p: Point,
): { point: Point; offset: number; distance: number; segmentIndex: number } {
  if (points.length === 0) {
    return { point: { x: 0, y: 0 }, offset: 0, distance: distance(p, { x: 0, y: 0 }), segmentIndex: 0 };
  }
  if (points.length === 1) {
    return { point: { ...points[0] }, offset: 0, distance: distance(p, points[0]), segmentIndex: 0 };
  }
  let best = {
    point: { ...points[0] },
    offset: 0,
    distance: Infinity,
    segmentIndex: 0,
  };
  let acc = 0;
  for (let i = 0; i + 1 < points.length; i++) {
    const a = points[i];
    const b = points[i + 1];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const lenSq = dx * dx + dy * dy;
    const t =
      lenSq === 0
        ? 0
        : Math.min(1, Math.max(0, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq));
    const point = {
      x: Math.round(a.x + t * dx),
      y: Math.round(a.y + t * dy),
    };
    const d = distance(p, point);
    if (d < best.distance) {
      best = { point, offset: acc + t * Math.sqrt(lenSq), distance: d, segmentIndex: i };
    }
    acc += Math.sqrt(lenSq);
  }
  return best;
}

/** Chiếu điểm p lên chuỗi tường (clamp trong [đầu, cuối] chuỗi). */
export function projectPointOnWall(p: Point, wall: Wall): Projection {
  const { point, offset, distance: d } = nearestPointOnChain(wall.points, p);
  return { offset, distance: d, point };
}

/**
 * Polygon thân một ĐOẠN tường: hình chữ nhật có chiều dài = đoạn start->end,
 * chiều rộng = thickness, tâm là đường tâm đoạn.
 * Trả về 4 đỉnh theo thứ tự (phẳng, dạng [x0,y0,x1,y1,...] cho Konva Line).
 */
export function wallPolygon(start: Point, end: Point, thickness: number): number[] {
  const len = distance(start, end);
  if (len === 0) {
    const h = thickness / 2;
    return [
      start.x - h,
      start.y - h,
      start.x + h,
      start.y - h,
      start.x + h,
      start.y + h,
      start.x - h,
      start.y + h,
    ];
  }
  const nx = (-(end.y - start.y) / len) * (thickness / 2);
  const ny = ((end.x - start.x) / len) * (thickness / 2);
  return [
    start.x + nx,
    start.y + ny,
    end.x + nx,
    end.y + ny,
    end.x - nx,
    end.y - ny,
    start.x - nx,
    start.y - ny,
  ];
}

/** Polygon thân từng đoạn của tường polyline (1 polygon phẳng mỗi đoạn). */
export function wallSegmentPolygons(wall: Wall): number[][] {
  return wallSegments(wall).map(([a, b]) => wallPolygon(a, b, wall.thickness));
}

/**
 * Miếng vá góc ngoài cho tường polyline (nối miter): mỗi đoạn là hình chữ
 * nhật nên ở góc ngoài 2 hình chữ nhật không chạm nhau, thiếu 1 ô vuông
 * (góc 90°, dày 200) hoặc 1 hình nêm (góc nhọn). Miếng vá lấp đúng phần
 * thiếu đó: giao của 2 mép ngoài là điểm miter M, vá = tứ giác (A, M, B, P).
 * Góc quá nhọn (|M − P| > 2×thickness) thì cắt phẳng (bevel): tam giác
 * (A, B, P). Đỉnh thẳng hàng/gập ngược và đoạn dài 0 thì bỏ qua. Vòng kín
 * (điểm đầu trùng điểm cuối) vá thêm ở điểm đầu. Trả về polygon phẳng.
 */
export function wallCornerPatches(wall: Wall): number[][] {
  const patches: number[][] = [];
  const pts = wall.points;
  const t = wall.thickness;
  const h = t / 2;
  const patchAt = (prev: Point, p: Point, next: Point): void => {
    const lu = distance(prev, p);
    const lv = distance(p, next);
    if (lu === 0 || lv === 0) return;
    const u = { x: (p.x - prev.x) / lu, y: (p.y - prev.y) / lu };
    const v = { x: (next.x - p.x) / lv, y: (next.y - p.y) / lv };
    const cross = u.x * v.y - u.y * v.x;
    if (Math.abs(cross) < 1e-9) return;
    // Pháp tuyến phía ngoài của hướng d: cross > 0 → (dy, −dx), ngược lại (−dy, dx).
    const nout = (d: Point): Point =>
      cross > 0 ? { x: d.y, y: -d.x } : { x: -d.y, y: d.x };
    const nu = nout(u);
    const nv = nout(v);
    const A = { x: p.x + nu.x * h, y: p.y + nu.y * h };
    const B = { x: p.x + nv.x * h, y: p.y + nv.y * h };
    // M = giao đường qua A hướng u và đường qua B hướng v.
    const s = ((B.x - A.x) * v.y - (B.y - A.y) * v.x) / cross;
    const M = { x: A.x + s * u.x, y: A.y + s * u.y };
    if (distance(p, M) > 2 * t) {
      patches.push([A.x, A.y, B.x, B.y, p.x, p.y]);
    } else {
      patches.push([A.x, A.y, M.x, M.y, B.x, B.y, p.x, p.y]);
    }
  };
  for (let i = 1; i + 1 < pts.length; i++) patchAt(pts[i - 1], pts[i], pts[i + 1]);
  if (pts.length > 2 && samePoint(pts[0], pts[pts.length - 1])) {
    patchAt(pts[pts.length - 2], pts[0], pts[1]);
  }
  return patches;
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

/** Mọi polygon thân tường đưa vào union: hình chữ nhật từng đoạn + vá góc miter. */
function wallPolygons(walls: Wall[]): Polygon[] {
  return walls.flatMap((w) =>
    [...wallSegmentPolygons(w), ...wallCornerPatches(w)].map(
      (flat) => [toRing(flat)] as Polygon,
    ),
  );
}

/**
 * Union các polygon thân tường thành các khối liền nhau (nối góc sạch:
 * 2 tường giao nhau không còn đường biên chồng nhau ở góc).
 * Trả về mảng polygon phẳng; mỗi polygon chỉ lấy vòng ngoài (bỏ lỗ trong,
 * hiếm gặp ở giai đoạn này — ví dụ sân trong khép kín sẽ bị tô đầy).
 */
export function mergeWallPolygons(walls: Wall[]): number[][] {
  const polys = wallPolygons(walls);
  if (polys.length === 0) return [];
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
  const polys = wallPolygons(walls);
  if (polys.length === 0) return [];
  const merged = union(polys[0], ...polys.slice(1));
  return merged
    .map((poly) => ({
      outer: fromRing(poly[0]),
      holes: poly.slice(1).map(fromRing).filter((h) => h.length >= 6),
    }))
    .filter((p) => p.outer.length >= 6);
}

export interface PlanBounds {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/**
 * Bounding box mặt bằng của toàn bộ tường (để fit camera khi mở Top):
 * bao các điểm tâm tường, nới mỗi phía 500mm (đủ chỗ cho nửa dày tường
 * + lề nhìn bao quát). Nhà mẫu cũ 8000×6000 cho đúng khung 9000×7000
 * tâm (4000, 3000) như trước đây; nhà khác tự fit theo kích thước thật.
 * Không có tường thì null (caller dùng khung mặc định).
 */
export function planBounds(walls: Wall[]): PlanBounds | null {
  if (walls.length === 0) return null;
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const w of walls) {
    for (const p of w.points) {
      x0 = Math.min(x0, p.x);
      y0 = Math.min(y0, p.y);
      x1 = Math.max(x1, p.x);
      y1 = Math.max(y1, p.y);
    }
  }
  const m = 500;
  return { x0: x0 - m, y0: y0 - m, x1: x1 + m, y1: y1 + m };
}

/**
 * Tỉ lệ vừa khung hình (mốc zoom 100%): vật thể bao `envW × envH` (mm) nằm
 * gọn trong khung nhìn `visibleW × visibleH` (px), chiếm `fill` phần khung
 * (mặc định 0.8 — còn 20% lề xung quanh để nhìn bao quát).
 */
export function fitScaleFor(
  envW: number,
  envH: number,
  visibleW: number,
  visibleH: number,
  fill = 0.8,
): number {
  return Math.min((visibleW * fill) / envW, (visibleH * fill) / envH);
}

/**
 * Có cửa nào trên tường `wallId` vượt khỏi độ dài mới không
 * (offset + width > length)? Dùng để chặn rút ngắn tường ở thước dim.
 */
export function openingsExceedLength(openings: Opening[], wallId: string, length: number): boolean {
  return openings.some((o) => o.wallId === wallId && o.offset + o.width > length);
}

/**
 * Clamp offset của opening để nó nằm gọn trong tường:
 * offset ∈ [0, max(0, wallLength - width)].
 */
export function clampOpeningOffset(offset: number, width: number, wallLen: number): number {
  const max = Math.max(0, wallLen - width);
  return Math.min(max, Math.max(0, Math.round(offset)));
}

/** Khung tọa độ của opening dọc tường: a = mép đầu, b = mép cuối,
 * (ux, uy) = hướng đoạn tường chứa offset, (nx, ny) = pháp tuyến trái
 * (-uy, ux). Hướng lấy theo đoạn chứa offset (giới hạn: lỗ bắc qua
 * đỉnh polyline chỉ vẽ theo đoạn chứa offset). */
export interface OpeningFrame {
  a: Point;
  b: Point;
  nx: number;
  ny: number;
  ux: number;
  uy: number;
}

export function openingFrame(opening: Opening, wall: Wall): OpeningFrame {
  const { point: a, segmentIndex } = pointAtChainOffset(wall.points, opening.offset);
  const p0 = wall.points[segmentIndex];
  const p1 = wall.points[segmentIndex + 1];
  const segLen = p0 && p1 ? distance(p0, p1) : 0;
  const ux = segLen === 0 ? 1 : (p1.x - p0.x) / segLen;
  const uy = segLen === 0 ? 0 : (p1.y - p0.y) / segLen;
  const nx = -uy;
  const ny = ux;
  const b = { x: a.x + ux * opening.width, y: a.y + uy * opening.width };
  return { a, b, nx, ny, ux, uy };
}

/** Hình học cánh + cung mở của cửa đi (mặt bằng, Y hướng xuống). */
export interface DoorSwing {
  /** Bản lề: luôn ở mép đầu `a` của lỗ cửa. */
  hinge: Point;
  /** Đầu cánh cửa khi mở 90° (cách bản lề một đoạn = chiều rộng cửa,
   * theo pháp tuyến). */
  leafEnd: Point;
  /** Góc xoay bắt đầu của cung (độ): = góc hướng tường khi không flip,
   * = góc hướng tường − 90° (hướng cánh −n) khi flip. */
  arcRotation: number;
  /** Góc quét của cung (độ): LUÔN +90. Konva Arc với angle âm vẽ 270°
   * (canvas arc clockwise từ 0 tới góc âm đi đường dài) nên khi đảo
   * chiều phải đổi điểm bắt đầu thay vì đổi dấu góc quét. */
  arcAngle: number;
}

/**
 * Cánh + cung mở của cửa đi. flip=false (mặc định): cánh + cung về phía
 * pháp tuyến trái +n, cung từ hướng tường quét +90° tới +n (hành vi cũ,
 * không đổi). flip=true: cánh + cung về phía −n, cung bắt đầu ở hướng
 * cánh (−n, = góc hướng tường − 90°) quét +90° về hướng tường — cùng
 * tập điểm với cung 90° từ hướng tường tới −n, nhưng tương thích Konva.
 * Bản lề luôn ở mép đầu offset.
 */
export function doorSwing(opening: Opening, wall: Wall): DoorSwing {
  const { a, nx, ny, ux, uy } = openingFrame(opening, wall);
  const s = opening.flip ? -1 : 1;
  const angleDeg = (Math.atan2(uy, ux) * 180) / Math.PI;
  return {
    hinge: a,
    leafEnd: { x: a.x + s * nx * opening.width, y: a.y + s * ny * opening.width },
    arcRotation: opening.flip ? angleDeg - 90 : angleDeg,
    arcAngle: 90,
  };
}

/**
 * Đổi độ dài một đoạn của chuỗi điểm: giữ points[index] cố định, dời
 * points[index + 1] dọc hướng đoạn tới độ dài mới; các điểm khác giữ nguyên.
 * Ngoại lệ vòng khép kín: MỌI điểm trùng với điểm cũ của points[index + 1]
 * cũng dời theo (điểm đầu == điểm cuối chuỗi) để vòng vẫn khép kín.
 * Trả lại đúng mảng gốc (không đổi) khi độ dài không hợp lệ (<= 0), bằng độ
 * dài hiện tại, hoặc chỉ số đoạn ngoài khoảng.
 */
export function resizeSegment(points: Point[], index: number, length: number): Point[] {
  if (index < 0 || index + 1 >= points.length) return points;
  const a = points[index];
  const b = points[index + 1];
  const cur = distance(a, b);
  if (length <= 0 || cur === 0 || Math.round(cur) === length) return points;
  const ux = (b.x - a.x) / cur;
  const uy = (b.y - a.y) / cur;
  const moved: Point = {
    x: Math.round(a.x + ux * length),
    y: Math.round(a.y + uy * length),
  };
  return points.map((p) => (samePoint(p, b) ? moved : p));
}

/**
 * Gộp tường mới vào một tường có sẵn khi đầu mút của nó trùng KHỚP (mm nguyên)
 * với điểm ĐẦU hoặc CUỐI của tường đó — 2 point snap thành 1 góc polyline.
 * Chỉ gộp ở 2 đầu chuỗi; trùng đỉnh giữa (nối chữ T / phân nhánh) thì không
 * gộp. Chỉ gộp khi cùng thickness và cùng height (xem canMergeWalls).
 * Tường gộp giữ id/thickness/height của tường cũ. Khi gộp vào ĐẦU
 * (prepend), mọi opening trên tường cũ dời +chiều dài chuỗi mới (offset đo
 * từ points[0]); gộp vào CUỐI thì offset giữ nguyên.
 * Trả null khi không gộp được (không trùng đầu nào, hoặc tường mới dài 0).
 * Giới hạn: nếu cả 2 đầu tường mới đều trùng (nối 2 tường) thì chỉ gộp với
 * tường trùng đầu start — nối cầu 2 tường chưa hỗ trợ.
 */
export function tryMergeWall(
  walls: Wall[],
  openings: Opening[],
  newWall: Wall,
): { walls: Wall[]; openings: Opening[] } | null {
  if (newWall.points.length < 2 || wallLength(newWall) === 0) return null;
  const newStart = newWall.points[0];
  const newEnd = newWall.points[newWall.points.length - 1];
  const reversedNew = [...newWall.points].reverse();

  // Tìm tường gộp: ưu tiên đầu start của tường mới, sau đó mới tới đầu end.
  let target: Wall | null = null;
  let mergedPoints: Point[] | null = null;
  let prepend = false;
  for (const w of walls) {
    if (!canMergeWalls(w, newWall)) continue;
    const first = w.points[0];
    const last = w.points[w.points.length - 1];
    if (samePoint(newStart, first)) {
      target = w;
      mergedPoints = [...reversedNew, ...w.points.slice(1)];
      prepend = true;
      break;
    }
    if (samePoint(newStart, last)) {
      target = w;
      mergedPoints = [...w.points, ...newWall.points.slice(1)];
      prepend = false;
      break;
    }
  }
  if (!target) {
    for (const w of walls) {
      if (!canMergeWalls(w, newWall)) continue;
      const first = w.points[0];
      const last = w.points[w.points.length - 1];
      if (samePoint(newEnd, first)) {
        target = w;
        mergedPoints = [...newWall.points, ...w.points.slice(1)];
        prepend = true;
        break;
      }
      if (samePoint(newEnd, last)) {
        target = w;
        mergedPoints = [...w.points, ...reversedNew.slice(1)];
        prepend = false;
        break;
      }
    }
  }
  if (!target || !mergedPoints) return null;
  // Giữ vào const để closure map bên dưới không mất narrowing.
  const targetWall = target;
  const mergedWall: Wall = { ...targetWall, points: mergedPoints };
  const shift = prepend ? wallLength(newWall) : 0;
  return {
    walls: walls.map((w) => (w.id === targetWall.id ? mergedWall : w)),
    openings: prepend
      ? openings.map((o) =>
          o.wallId === targetWall.id ? { ...o, offset: o.offset + shift } : o,
        )
      : openings,
  };
}

/** Cách 2 tường nối nhau tại đầu mút trùng khít (a = tường đứng trước
 * trong mảng, giữ id; b = tường còn lại). */
type MergeMode = 'aLast-bFirst' | 'aLast-bLast' | 'aFirst-bFirst' | 'aFirst-bLast';

/** Tìm cặp tường đầu tiên (i < j) gộp được: trùng đầu/cuối + cùng
 * thickness/height. Chỉ xét điểm ĐẦU/CUỐI chuỗi — trùng đỉnh giữa hay
 * đầu mút nằm trên đoạn giữa của tường kia (nối chữ T) thì không gộp. */
function findMergeablePair(walls: Wall[]): { i: number; j: number; mode: MergeMode } | null {
  for (let i = 0; i < walls.length; i++) {
    const a = walls[i];
    const aFirst = a.points[0];
    const aLast = a.points[a.points.length - 1];
    for (let j = i + 1; j < walls.length; j++) {
      const b = walls[j];
      if (!canMergeWalls(a, b)) continue;
      const bFirst = b.points[0];
      const bLast = b.points[b.points.length - 1];
      if (samePoint(aLast, bFirst)) return { i, j, mode: 'aLast-bFirst' };
      if (samePoint(aLast, bLast)) return { i, j, mode: 'aLast-bLast' };
      if (samePoint(aFirst, bFirst)) return { i, j, mode: 'aFirst-bFirst' };
      if (samePoint(aFirst, bLast)) return { i, j, mode: 'aFirst-bLast' };
    }
  }
  return null;
}

/**
 * Gộp TẤT CẢ tường có đầu mút trùng khít (mm nguyên) thành polyline —
 * lặp cho tới khi không còn cặp nào gộp được. Tường gộp giữ id của
 * tường đứng TRƯỚC trong mảng đầu vào; opening dời offset theo vị trí
 * mới trong chuỗi (tường đứng sau dời +chiều dài tường đứng trước;
 * tường bị đảo chiều thì offset đổi thành len - offset - width, làm
 * tròn về mm nguyên). Không thay đổi mảng/đối tượng đầu vào.
 * Vòng khép kín (điểm đầu == điểm cuối) là kết quả HỢP LỆ — không bỏ
 * điểm trùng. Không gộp ở đỉnh giữa hay nối chữ T.
 */
export function mergeCoincidentWalls(
  walls: Wall[],
  openings: Opening[],
): { walls: Wall[]; openings: Opening[] } {
  let currentWalls = walls.slice();
  let currentOpenings = openings.slice();
  for (;;) {
    const pair = findMergeablePair(currentWalls);
    if (!pair) break;
    const a = currentWalls[pair.i];
    const b = currentWalls[pair.j];
    // Xác định thứ tự chuỗi gộp + bên nào phải đảo chiều để nối liền.
    let first: Wall;
    let second: Wall;
    let firstReversed: boolean;
    let secondReversed: boolean;
    switch (pair.mode) {
      case 'aLast-bFirst':
        first = a; firstReversed = false; second = b; secondReversed = false;
        break;
      case 'aLast-bLast':
        first = a; firstReversed = false; second = b; secondReversed = true;
        break;
      case 'aFirst-bFirst':
        first = b; firstReversed = true; second = a; secondReversed = false;
        break;
      case 'aFirst-bLast':
        first = b; firstReversed = false; second = a; secondReversed = false;
        break;
    }
    const firstPts = firstReversed ? [...first.points].reverse() : first.points;
    const secondPts = secondReversed ? [...second.points].reverse() : second.points;
    // Điểm chung (cuối first == đầu second) chỉ giữ 1 lần.
    const mergedWall: Wall = { ...a, points: [...firstPts, ...secondPts.slice(1)] };
    const lenFirst = wallLength(first);
    const lenSecond = wallLength(second);
    const remapOffset = (o: Opening, wallLen: number, reversed: boolean, base: number) =>
      Math.round(base + (reversed ? wallLen - o.offset - o.width : o.offset));
    currentOpenings = currentOpenings.map((o) => {
      if (o.wallId === first.id) {
        return { ...o, wallId: a.id, offset: remapOffset(o, lenFirst, firstReversed, 0) };
      }
      if (o.wallId === second.id) {
        return {
          ...o,
          wallId: a.id,
          offset: remapOffset(o, lenSecond, secondReversed, lenFirst),
        };
      }
      return o;
    });
    currentWalls = currentWalls.map((w, idx) => (idx === pair.i ? mergedWall : w));
    currentWalls.splice(pair.j, 1); // mảng này là bản sao mới từ map — splice an toàn
  }
  return { walls: currentWalls, openings: currentOpenings };
}

/** Gộp tường trùng đầu mút trong MỌI level của Building — dùng khi nạp
 * Building vào store (seed, mở file, autosave). */
export function mergeBuildingWalls(building: Building): Building {
  return {
    ...building,
    levels: building.levels.map((level) => {
      const merged = mergeCoincidentWalls(level.walls, level.openings);
      return { ...level, walls: merged.walls, openings: merged.openings };
    }),
  };
}
