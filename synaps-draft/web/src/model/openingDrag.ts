import {
  distance,
  doorSwingPolygon,
  pointAtChainOffset,
  pointsLength,
  wallLength,
} from './geometry';
import type { Opening, Point, Wall } from './schema';

/**
 * Hitbox của opening (kiểu game): danh sách hình chữ nhật trong không gian
 * thế giới, mỗi rect phủ phần opening nằm trên 1 đoạn tường. Opening nằm
 * trong 1 đoạn → 1 rect; bắc qua đỉnh polyline → 2+ rect bám theo đường
 * gãy của tường. Hai hitbox CHẠM MÉP (không lấn vào nhau) không tính chồng.
 */
export type HitboxRect = [Point, Point, Point, Point];

/** Sai số cho phép khi so sánh hình chiếu (tránh lỗi số thực ở tường xiên). */
const EPS = 1e-6;

export function openingHitbox(opening: Opening, wall: Wall): HitboxRect[] {
  const total = pointsLength(wall.points);
  const s0 = Math.max(0, opening.offset);
  const s1 = Math.min(total, opening.offset + opening.width);
  if (s1 <= s0 || wall.points.length < 2) return [];
  const half = wall.thickness / 2;
  // Điểm ngắt trong [s0, s1]: các đỉnh chuỗi tường.
  const marks = [s0];
  let acc = 0;
  for (let i = 0; i + 1 < wall.points.length; i++) {
    acc += distance(wall.points[i], wall.points[i + 1]);
    if (acc > s0 && acc < s1) marks.push(acc);
  }
  marks.push(s1);
  const rects: HitboxRect[] = [];
  for (let i = 0; i + 1 < marks.length; i++) {
    const p0 = pointAtChainOffset(wall.points, marks[i]).point;
    const p1 = pointAtChainOffset(wall.points, marks[i + 1]).point;
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;
    const len = Math.hypot(dx, dy);
    if (len <= 0) continue;
    const nx = (-dy / len) * half;
    const ny = (dx / len) * half;
    rects.push([
      { x: p0.x + nx, y: p0.y + ny },
      { x: p1.x + nx, y: p1.y + ny },
      { x: p1.x - nx, y: p1.y - ny },
      { x: p0.x - nx, y: p0.y - ny },
    ]);
  }
  return rects;
}

function projectPolygon(poly: Point[], ax: number, ay: number): [number, number] {
  let min = Infinity;
  let max = -Infinity;
  for (const p of poly) {
    const d = p.x * ax + p.y * ay;
    if (d < min) min = d;
    if (d > max) max = d;
  }
  return [min, max];
}

/** Hai đa giác lồi có chồng nhau không (SAT trên pháp tuyến mọi cạnh).
 * Chạm mép = không chồng. Dùng cho cả rect hitbox (4 đỉnh) và quạt vùng quay. */
export function convexPolygonsOverlap(a: Point[], b: Point[]): boolean {
  if (a.length < 3 || b.length < 3) return false;
  for (const poly of [a, b]) {
    for (let i = 0; i < poly.length; i++) {
      const p = poly[i];
      const q = poly[(i + 1) % poly.length];
      const ex = q.x - p.x;
      const ey = q.y - p.y;
      const len = Math.hypot(ex, ey);
      if (len <= 0) continue;
      const ax = -ey / len;
      const ay = ex / len;
      const [minA, maxA] = projectPolygon(a, ax, ay);
      const [minB, maxB] = projectPolygon(b, ax, ay);
      if (Math.min(maxA, maxB) - Math.max(minA, minB) <= EPS) return false;
    }
  }
  return true;
}

/** Hai hitbox (mỗi cái 1+ rect) có chồng nhau không. */
export function hitboxesOverlap(a: HitboxRect[], b: HitboxRect[]): boolean {
  return a.some((ra) => b.some((rb) => convexPolygonsOverlap(ra, rb)));
}

/** Vòng bao của 1 đa giác (tâm = trung bình các đỉnh, r = xa nhất) — để loại nhanh. */
interface BoundingCircle {
  cx: number;
  cy: number;
  r: number;
}

function boundingCircle(poly: Point[]): BoundingCircle {
  let cx = 0;
  let cy = 0;
  for (const p of poly) {
    cx += p.x;
    cy += p.y;
  }
  cx /= poly.length;
  cy /= poly.length;
  let r = 0;
  for (const p of poly) {
    r = Math.max(r, Math.hypot(p.x - cx, p.y - cy));
  }
  return { cx, cy, r };
}

/** Hai vòng bao có thể giao nhau không (loại nhanh trước SAT; chạm nhau = không). */
function circlesMayOverlap(a: BoundingCircle, b: BoundingCircle): boolean {
  const dx = a.cx - b.cx;
  const dy = a.cy - b.cy;
  const rr = a.r + b.r;
  return dx * dx + dy * dy < rr * rr;
}

/** Vùng quay của 1 cửa đi: quạt 90° + vòng bao (tâm = bản lề, r = rộng cửa). */
interface SwingZone {
  poly: Point[];
  circle: BoundingCircle;
}

function swingZone(opening: Opening, wall: Wall): SwingZone | null {
  if (opening.type !== 'door') return null;
  const poly = doorSwingPolygon(opening, wall);
  if (poly.length < 3) return null;
  const hinge = poly[0];
  return { poly, circle: { cx: hinge.x, cy: hinge.y, r: opening.width } };
}

/**
 * Dấu chân đầy đủ của 1 opening: các rect lỗ cửa + vùng quay (chỉ cửa đi).
 * 2 cửa "chồng nhau" khi bất kỳ cặp vùng nào giao nhau: lỗ-lỗ, quay-quay,
 * quay-lỗ (cánh cửa này quét qua lỗ cửa kia — cánh sẽ chạm cánh kia khi đóng).
 */
interface Footprint {
  gaps: HitboxRect[];
  gapCircles: BoundingCircle[];
  swing: SwingZone | null;
}

function footprint(opening: Opening, wall: Wall): Footprint {
  const gaps = openingHitbox(opening, wall);
  return {
    gaps,
    gapCircles: gaps.map(boundingCircle),
    swing: swingZone(opening, wall),
  };
}

function swingHitsGaps(
  zone: SwingZone,
  gaps: HitboxRect[],
  gapCircles: BoundingCircle[],
): boolean {
  return gaps.some(
    (g, i) =>
      circlesMayOverlap(zone.circle, gapCircles[i]) &&
      convexPolygonsOverlap(zone.poly, g),
  );
}

function footprintsOverlap(a: Footprint, b: Footprint): boolean {
  if (a.gaps.some((ra) => b.gaps.some((rb) => convexPolygonsOverlap(ra, rb)))) return true;
  if (
    a.swing &&
    b.swing &&
    circlesMayOverlap(a.swing.circle, b.swing.circle) &&
    convexPolygonsOverlap(a.swing.poly, b.swing.poly)
  ) {
    return true;
  }
  if (a.swing && swingHitsGaps(a.swing, b.gaps, b.gapCircles)) return true;
  if (b.swing && swingHitsGaps(b.swing, a.gaps, a.gapCircles)) return true;
  return false;
}

function blockerFootprints(
  walls: Wall[],
  openings: Opening[],
  excludeId: string,
): Footprint[] {
  const out: Footprint[] = [];
  for (const o of openings) {
    if (o.id === excludeId) continue;
    const w = walls.find((x) => x.id === o.wallId);
    if (w) out.push(footprint(o, w));
  }
  return out;
}

/** Opening (với offset/width đã cho) có chồng lên opening khác nào không
 * (lỗ-lỗ, quay-quay, quay-lỗ). */
export function openingOverlapsOthers(
  walls: Wall[],
  openings: Opening[],
  candidate: Opening,
): boolean {
  const wall = walls.find((w) => w.id === candidate.wallId);
  if (!wall) return false;
  const mine = footprint(candidate, wall);
  return blockerFootprints(walls, openings, candidate.id).some((b) =>
    footprintsOverlap(mine, b),
  );
}

/** Vùng quay của candidate (cửa đi) có chồng lên opening khác nào không
 * (vùng quay hoặc lỗ của chúng). Dùng khi đảo chiều mở: lỗ không đổi nên
 * chỉ cần xét vùng quay mới. Cửa sổ luôn trả false. */
export function doorSwingOverlapsOthers(
  walls: Wall[],
  openings: Opening[],
  candidate: Opening,
): boolean {
  const wall = walls.find((w) => w.id === candidate.wallId);
  if (!wall) return false;
  const zone = swingZone(candidate, wall);
  if (!zone) return false;
  for (const o of openings) {
    if (o.id === candidate.id) continue;
    const ow = walls.find((w) => w.id === o.wallId);
    if (!ow) continue;
    const b = footprint(o, ow);
    if (
      b.swing &&
      circlesMayOverlap(zone.circle, b.swing.circle) &&
      convexPolygonsOverlap(zone.poly, b.swing.poly)
    ) {
      return true;
    }
    if (swingHitsGaps(zone, b.gaps, b.gapCircles)) return true;
  }
  return false;
}

/** Kẹp offset vào [0, max], làm tròn mm nguyên. */
function clampToBounds(offset: number, max: number): number {
  return Math.min(max, Math.max(0, Math.round(offset)));
}

/** Kẹp offset chỉ theo biên tường (không xét opening kề) — cho nơi không
 * biết opening kề (vd chiếu ngược từ mặt đứng); chống chồng lấn do nơi
 * gọi xử lý thêm. */
export function clampOffsetToWall(wall: Wall, width: number, offset: number): number {
  return clampToBounds(offset, Math.max(0, Math.round(wallLength(wall)) - width));
}

/** Tìm kiếm nhị phân điểm tiếp xúc: lo hợp lệ, hi không hợp lệ → trả lo gần hi nhất. */
function binarySearchContact(
  lo: number,
  hi: number,
  collides: (offset: number) => boolean,
): number {
  while (Math.abs(hi - lo) > 1) {
    const mid = Math.round((lo + hi) / 2);
    if (mid === lo || mid === hi) break;
    if (collides(mid)) hi = mid;
    else lo = mid;
  }
  return lo;
}

/**
 * Giải quyết kéo cửa bằng hitbox (kiểu game): đi từ offset hiện tại
 * `fromOffset` (đã hợp lệ) về phía `desiredOffset`, dừng sát vật cản đầu
 * tiên trên đường đi (quét dọc đường đi + nhị phân tới điểm tiếp xúc).
 * Không bao giờ xuyên qua opening khác — lỗi "teleport" của cách cũ
 * (chọn ứng viên gần desired nhất, không xét hướng di chuyển).
 * Kiểm tra dấu chân đầy đủ (lỗ cửa + vùng quay cánh, cả tường khác)
 * nên cửa đi cũng không quét chồng lên cửa khác.
 * Nếu vị trí hiện tại đã chồng (file nạp vào sai), thoát ra chỗ hợp lệ
 * gần desired nhất; nếu không còn chỗ nào thì giữ nguyên.
 */
export function resolveDragOffset(
  walls: Wall[],
  openings: Opening[],
  openingId: string,
  fromOffset: number,
  desiredOffset: number,
): number {
  const me = openings.find((o) => o.id === openingId);
  const wall = me && walls.find((w) => w.id === me.wallId);
  if (!me || !wall) return Math.round(desiredOffset);
  const max = Math.max(0, Math.round(wallLength(wall)) - me.width);
  const from = Number.isFinite(fromOffset) ? clampToBounds(fromOffset, max) : me.offset;
  const to = Number.isFinite(desiredOffset) ? clampToBounds(desiredOffset, max) : from;
  if (to === from) return from;
  const blockers = blockerFootprints(walls, openings, openingId);
  const collides = (offset: number) =>
    blockers.some((b) => footprintsOverlap(footprint({ ...me, offset }, wall), b));
  if (collides(from)) {
    // Vị trí hiện tại đã chồng: tìm chỗ hợp lệ gần `to` nhất trong các
    // ứng viên (mép các opening cùng tường + biên tường).
    const candidates = [to, 0, max];
    for (const o of openings) {
      if (o.id === openingId || o.wallId !== wall.id) continue;
      candidates.push(o.offset - me.width, o.offset + o.width);
    }
    let best: number | null = null;
    for (const c of candidates) {
      if (c < 0 || c > max || collides(c)) continue;
      if (best === null || Math.abs(c - to) < Math.abs(best - to)) best = c;
    }
    return best ?? from;
  }
  // Quét dọc đường đi: bước ≤ 10mm (tối đa 1000 mẫu), tìm mẫu va chạm
  // đầu tiên rồi nhị phân tới điểm tiếp xúc (chính xác 1mm).
  const dist = to - from;
  const n = Math.min(1000, Math.max(1, Math.ceil(Math.abs(dist) / 10)));
  let prev = from;
  for (let i = 1; i <= n; i++) {
    const sample = Math.round(from + (dist * i) / n);
    if (sample === prev) continue;
    if (collides(sample)) return binarySearchContact(prev, sample, collides);
    prev = sample;
  }
  return to;
}

/** Opening mới có đặt được ở vị trí này không (gọn trong tường + không chồng). */
export function canPlaceOpening(
  walls: Wall[],
  openings: Opening[],
  candidate: Opening,
): boolean {
  const wall = walls.find((w) => w.id === candidate.wallId);
  if (!wall) return false;
  if (candidate.offset < 0 || candidate.offset + candidate.width > wallLength(wall) + EPS) {
    return false;
  }
  return !openingOverlapsOthers(walls, openings, candidate);
}

/** Chiều rộng lớn nhất (≤ desiredWidth, ≥ 100) mà opening không chồng lên opening khác. */
export function maxWidthWithoutOverlap(
  walls: Wall[],
  openings: Opening[],
  opening: Opening,
  desiredWidth: number,
): number {
  const wall = walls.find((w) => w.id === opening.wallId);
  if (!wall) return desiredWidth;
  const lo = 100;
  if (desiredWidth <= lo) return desiredWidth;
  const blockers = blockerFootprints(walls, openings, opening.id);
  const collides = (width: number) =>
    blockers.some((b) => footprintsOverlap(footprint({ ...opening, width }, wall), b));
  if (!collides(desiredWidth)) return desiredWidth;
  // lo=100 hợp lệ (hitbox con của hitbox hiện tại, vốn không chồng);
  // nhị phân tìm rộng nhất còn hợp lệ.
  let valid = lo;
  let invalid = desiredWidth;
  while (invalid - valid > 1) {
    const mid = Math.round((valid + invalid) / 2);
    if (collides(mid)) invalid = mid;
    else valid = mid;
  }
  return valid;
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
