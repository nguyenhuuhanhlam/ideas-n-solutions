import { describe, expect, it } from 'vitest';
import { computeGridSegments, gridStepFor } from './grid';

/** Mọi đoạn lưới phải song song trục (đứng hoặc ngang), không có đoạn chéo. */
function expectAxisAligned(segments: number[]) {
  expect(segments.length % 4).toBe(0);
  for (let i = 0; i + 3 < segments.length; i += 4) {
    const [x1, y1, x2, y2] = segments.slice(i, i + 4);
    expect(x1 === x2 || y1 === y2).toBe(true);
  }
}

describe('gridStepFor', () => {
  it('zoom 1 → bước 100mm', () => {
    expect(gridStepFor(1)).toBe(100);
  });
  it('zoom 0.1 → bước 500mm', () => {
    expect(gridStepFor(0.1)).toBe(500);
  });
  it('zoom rất nhỏ → bước 5000mm', () => {
    expect(gridStepFor(0.01)).toBe(5000);
  });
});

describe('computeGridSegments (top)', () => {
  it('đủ số đoạn đứng + ngang, song song trục', () => {
    const segs = computeGridSegments({ left: 0, top: 0, right: 1000, bottom: 500 }, 500, 'top');
    expect(segs.length / 4).toBe(5); // đứng x=0/500/1000 + ngang y=0/500
    expect(segs.slice(0, 4)).toEqual([0, 0, 0, 500]);
    expectAxisAligned(segs);
  });
  it('khung nhìn lệch vẫn bắt đầu từ bội số của bước', () => {
    const segs = computeGridSegments({ left: -250, top: 0, right: 250, bottom: 500 }, 500, 'top');
    expect(segs.slice(0, 4)).toEqual([-500, 0, -500, 500]);
    expectAxisAligned(segs);
  });
});

describe('computeGridSegments (elevation)', () => {
  it('đoạn ngang vẽ ở y = −v (cao độ hướng lên)', () => {
    const segs = computeGridSegments({ left: 0, top: -3000, right: 6000, bottom: 0 }, 1000, 'elevation');
    expect(segs.length / 4).toBe(11); // đứng u=0..6000 (7) + ngang v=0..3000 (4)
    // Đoạn ngang đầu tiên: v=0 → y=0; đoạn ngang cuối: v=3000 → y=−3000.
    expect(segs.slice(28, 32)).toEqual([0, 0, 6000, 0]);
    expect(segs.slice(40, 44)).toEqual([0, -3000, 6000, -3000]);
    expectAxisAligned(segs);
  });
});
