import { describe, expect, it } from 'vitest';
import type { Wall } from '../model/schema';
import { computeSnap, snapPointsNear } from './wallTool';

const wall = (id: string, sx: number, sy: number, ex: number, ey: number): Wall => ({
  id,
  points: [
    { x: sx, y: sy },
    { x: ex, y: ey },
  ],
  thickness: 200,
});

// scale = 1 → bán kính snap 10mm.
describe('computeSnap — perpendicular / intersection', () => {
  const h = wall('h', 0, 0, 8000, 0);

  it('snap vào chân đường vuông góc khi con trỏ gần tường', () => {
    const r = computeSnap({ x: 3000, y: 8 }, [h], 1, null);
    expect(r.kind).toBe('perpendicular');
    expect(r.point).toEqual({ x: 3000, y: 0 });
  });

  it('không snap chân vuông góc khi chân nằm ngoài đoạn tường', () => {
    // Chân chiếu (8100, 0) nằm ngoài đoạn; đầu mút (8000, 0) cũng ngoài bán kính.
    const r = computeSnap({ x: 8100, y: 5 }, [h], 1, null);
    expect(r.kind).toBe('grid');
    expect(r.point).toEqual({ x: 8100, y: 0 });
  });

  it('snap vào giao điểm 2 tường cắt nhau', () => {
    const v = wall('v', 3000, -2000, 3000, 4000);
    const r = computeSnap({ x: 3006, y: 4 }, [h, v], 1, null);
    expect(r.kind).toBe('intersection');
    expect(r.point).toEqual({ x: 3000, y: 0 });
  });

  it('đầu mút thắng chân vuông góc khi cả hai trong bán kính', () => {
    const r = computeSnap({ x: 5, y: 8 }, [h], 1, null);
    expect(r.kind).toBe('endpoint');
    expect(r.point).toEqual({ x: 0, y: 0 });
  });

  it('chân vuông góc thắng khóa góc 45°', () => {
    // Hướng draftStart -> raw đúng 90° (khóa góc sẽ áp dụng nếu tới lượt nó).
    const r = computeSnap({ x: 3000, y: 8 }, [h], 1, { x: 3000, y: -1000 });
    expect(r.kind).toBe('perpendicular');
    expect(r.point).toEqual({ x: 3000, y: 0 });
  });
});

describe('snapPointsNear', () => {
  const h = wall('h', 0, 0, 8000, 0);

  it('lọc theo bán kính: chân vuông góc trong 100mm, ngoài 40mm thì không', () => {
    expect(snapPointsNear({ x: 3000, y: 50 }, [h], 100)).toEqual([
      { point: { x: 3000, y: 0 }, kind: 'perpendicular' },
    ]);
    expect(snapPointsNear({ x: 3000, y: 50 }, [h], 40)).toEqual([]);
  });

  it('đầu mút chung của 2 tường chỉ trả 1 marker', () => {
    const v = wall('v', 8000, 0, 8000, 6000);
    const pts = snapPointsNear({ x: 8000, y: 0 }, [h, v], 10);
    expect(pts).toEqual([{ point: { x: 8000, y: 0 }, kind: 'endpoint' }]);
  });

  it('trả giao điểm 2 tường cắt nhau', () => {
    const v = wall('v', 3000, -2000, 3000, 4000);
    const pts = snapPointsNear({ x: 3000, y: 0 }, [h, v], 10);
    expect(pts).toContainEqual({ point: { x: 3000, y: 0 }, kind: 'intersection' });
  });
});
