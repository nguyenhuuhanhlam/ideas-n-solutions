import { describe, expect, it } from 'vitest';
import { wallSegments, type Box3D } from './geometry3d';
import type { Opening, Wall } from './schema';

const wall = (over: Partial<Wall> = {}): Wall => ({
  id: 'w1',
  start: { x: 0, y: 0 },
  end: { x: 4000, y: 0 },
  thickness: 200,
  ...over,
});

const opening = (over: Partial<Opening> = {}): Opening => ({
  id: 'o1',
  wallId: 'w1',
  type: 'door',
  offset: 1500,
  width: 900,
  height: 2100,
  sillHeight: 0,
  ...over,
});

function volume(boxes: Box3D[]): number {
  return boxes.reduce((sum, b) => sum + b.size[0] * b.size[1] * b.size[2], 0);
}

describe('wallSegments', () => {
  it('tường không lỗ → 1 box đúng kích thước', () => {
    const boxes = wallSegments(wall(), [], 3000);
    expect(boxes).toHaveLength(1);
    expect(boxes[0].size).toEqual([4, 3, 0.2]);
    expect(boxes[0].center).toEqual([2, 1.5, 0]);
    expect(boxes[0].rotationY).toBeCloseTo(0, 10);
  });

  it('tường có 1 cửa đi (sill 0) → 3 box: trái/phải/lanh-tô', () => {
    const boxes = wallSegments(wall(), [opening()], 3000);
    expect(boxes).toHaveLength(3);
    // Đoạn trái: 0–1500, đầy chiều cao; đoạn phải: 2400–4000.
    expect(boxes[0].size).toEqual([1.5, 3, 0.2]);
    expect(boxes[1].size).toEqual([0.9, 0.9, 0.2]); // lanh-tô 2100–3000
    expect(boxes[2].size).toEqual([1.6, 3, 0.2]);
  });

  it('tường có cửa sổ sill 900 → 4 box (thêm đoạn dưới bậu)', () => {
    const win = opening({ type: 'window', width: 1200, height: 1200, sillHeight: 900 });
    const boxes = wallSegments(wall(), [win], 3000);
    expect(boxes).toHaveLength(4);
    const sizes = boxes.map((b) => b.size);
    expect(sizes).toContainEqual([1.5, 3, 0.2]); // trái
    expect(sizes).toContainEqual([1.2, 0.9, 0.2]); // dưới bậu
    expect(sizes).toContainEqual([1.2, 0.9, 0.2]); // lanh-tô 2100–3000
    expect(sizes).toContainEqual([1.3, 3, 0.2]); // phải
  });

  it('tổng thể tích = thể tích tường trừ thể tích lỗ (sai số < 1%)', () => {
    const w = wall();
    const door = opening();
    const win = opening({
      id: 'o2',
      type: 'window',
      offset: 2800,
      width: 1000,
      height: 1200,
      sillHeight: 900,
    });
    const boxes = wallSegments(w, [door, win], 3000);
    const wallVol = 4 * 3 * 0.2;
    const holeVol = 0.9 * 2.1 * 0.2 + 1 * 1.2 * 0.2;
    const expected = wallVol - holeVol;
    expect(Math.abs(volume(boxes) - expected) / expected).toBeLessThan(0.01);
  });

  it('tường dọc có rotationY -90°', () => {
    const w = wall({ start: { x: 0, y: 0 }, end: { x: 0, y: 4000 } });
    const boxes = wallSegments(w, [], 3000);
    expect(boxes).toHaveLength(1);
    expect(boxes[0].rotationY).toBeCloseTo(-Math.PI / 2, 10);
    expect(boxes[0].center).toEqual([0, 1.5, 2]);
  });

  it('height riêng của tường thắng level height; elevation nâng chân tường', () => {
    const boxes = wallSegments(wall({ height: 2500 }), [], 3000, 3000);
    expect(boxes[0].size[1]).toBe(2.5);
    expect(boxes[0].center[1]).toBeCloseTo(3 + 1.25, 10);
  });

  it('tường độ dài 0 → không có box', () => {
    const w = wall({ end: { x: 0, y: 0 } });
    expect(wallSegments(w, [], 3000)).toEqual([]);
  });
});
