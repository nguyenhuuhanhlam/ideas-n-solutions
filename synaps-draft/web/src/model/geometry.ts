import { union, type Pair, type Polygon } from 'polygon-clipping';
import type { Opening, Point, Wall } from './schema';

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
  const polys: Polygon[] = walls.flatMap((w) =>
    wallSegmentPolygons(w).map((flat) => [toRing(flat)] as Polygon),
  );
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
  const polys: Polygon[] = walls.flatMap((w) =>
    wallSegmentPolygons(w).map((flat) => [toRing(flat)] as Polygon),
  );
  if (polys.length === 0) return [];
  const merged = union(polys[0], ...polys.slice(1));
  return merged
    .map((poly) => ({
      outer: fromRing(poly[0]),
      holes: poly.slice(1).map(fromRing).filter((h) => h.length >= 6),
    }))
    .filter((p) => p.outer.length >= 6);
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

/**
 * Đổi độ dài một đoạn của chuỗi điểm: giữ points[index] cố định, dời
 * points[index + 1] dọc hướng đoạn tới độ dài mới; các điểm khác giữ nguyên.
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
  const next = points.slice();
  next[index + 1] = {
    x: Math.round(a.x + ux * length),
    y: Math.round(a.y + uy * length),
  };
  return next;
}

function samePoint(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

/**
 * Gộp tường mới vào một tường có sẵn khi đầu mút của nó trùng KHỚP (mm nguyên)
 * với điểm ĐẦU hoặc CUỐI của tường đó — 2 point snap thành 1 góc polyline.
 * Chỉ gộp ở 2 đầu chuỗi; trùng đỉnh giữa (nối chữ T / phân nhánh) thì không
 * gộp. Tường gộp giữ id/thickness/height của tường cũ. Khi gộp vào ĐẦU
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
