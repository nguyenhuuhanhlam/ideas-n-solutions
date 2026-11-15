/** Lưới thích ứng theo zoom: bước lưới + các đoạn lưới trong khung nhìn. */

const GRID_STEPS = [100, 500, 1000, 5000];

export function gridStepFor(scale: number): number {
  for (const s of GRID_STEPS) if (s * scale >= 24) return s;
  return 5000;
}

export interface ViewBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/**
 * Các đoạn thẳng của lưới trong khung nhìn, dạng mảng phẳng: mỗi 4 số
 * là 1 đoạn (x1, y1, x2, y2). Vẽ bằng component `Segments`, KHÔNG dùng
 * Konva `Line` (Line nối các điểm thành đường liên tục → sinh chéo).
 *
 * Mặt đứng (`elevation`): trục ngang u, trục đứng v (cao độ, hướng lên)
 * nhưng Konva y hướng xuống nên đoạn ngang vẽ ở y = −v.
 */
export function computeGridSegments(
  bounds: ViewBounds,
  step: number,
  mode: 'top' | 'elevation',
): number[] {
  const { left, top, right, bottom } = bounds;
  const segments: number[] = [];
  if (mode === 'top') {
    for (let x = Math.floor(left / step) * step; x <= right; x += step) {
      segments.push(x, top, x, bottom);
    }
    for (let y = Math.floor(top / step) * step; y <= bottom; y += step) {
      segments.push(left, y, right, y);
    }
  } else {
    const vMin = -bottom;
    const vMax = -top;
    for (let u = Math.floor(left / step) * step; u <= right; u += step) {
      segments.push(u, -vMax, u, -vMin);
    }
    for (let v = Math.floor(vMin / step) * step; v <= vMax; v += step) {
      segments.push(left, -v, right, -v);
    }
  }
  return segments;
}
