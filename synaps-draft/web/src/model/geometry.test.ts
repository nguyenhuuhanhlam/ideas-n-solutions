import { describe, expect, it } from 'vitest';
import {
  clampOpeningOffset,
  distance,
  mergeWallPolygons,
  mergeWallPolygonsWithHoles,
  midpoint,
  projectPointOnWall,
  snapAngle,
  snapPointToGrid,
  snapToGrid,
  wallLength,
  wallPolygon,
} from './geometry';
import type { Wall } from './schema';

const wall = (start: { x: number; y: number }, end: { x: number; y: number }): Wall => ({
  id: 'w1',
  start,
  end,
  thickness: 200,
});

describe('snapToGrid', () => {
  it('snap về bội 100 gần nhất', () => {
    expect(snapToGrid(149, 100)).toBe(100);
    expect(snapToGrid(150, 100)).toBe(200);
    expect(snapToGrid(-149, 100)).toBe(-100);
  });
  it('snap điểm 2 chiều', () => {
    expect(snapPointToGrid({ x: 123, y: 987 }, 100)).toEqual({ x: 100, y: 1000 });
  });
});

describe('snapAngle', () => {
  it('khóa về 0° khi gần ngang', () => {
    const p = snapAngle({ x: 0, y: 0 }, { x: 1000, y: 100 });
    expect(p.y).toBe(0);
    expect(p.x).toBeCloseTo(1005, 0);
  });
  it('khóa về 90° khi gần dọc', () => {
    const p = snapAngle({ x: 0, y: 0 }, { x: 80, y: 1000 });
    expect(p.x).toBe(0);
    expect(p.y).toBeCloseTo(1003, 0);
  });
  it('khóa về 45° khi chéo', () => {
    const p = snapAngle({ x: 0, y: 0 }, { x: 1000, y: 900 });
    expect(p.x).toBe(p.y);
  });
  it('giữ nguyên điểm trùng gốc', () => {
    expect(snapAngle({ x: 5, y: 5 }, { x: 5, y: 5 })).toEqual({ x: 5, y: 5 });
  });
});

describe('endpoint / midpoint', () => {
  it('midpoint của tường ngang', () => {
    expect(midpoint({ x: 0, y: 0 }, { x: 8000, y: 0 })).toEqual({ x: 4000, y: 0 });
  });
  it('midpoint làm tròn về mm nguyên', () => {
    expect(midpoint({ x: 0, y: 0 }, { x: 101, y: 0 })).toEqual({ x: 51, y: 0 });
  });
});

describe('projectPointOnWall', () => {
  it('chiếu vuông góc lên tường ngang', () => {
    const r = projectPointOnWall({ x: 3000, y: 500 }, wall({ x: 0, y: 0 }, { x: 8000, y: 0 }));
    expect(r.point).toEqual({ x: 3000, y: 0 });
    expect(r.offset).toBe(3000);
    expect(r.distance).toBe(500);
  });
  it('clamp về đầu mút khi điểm ngoài đoạn', () => {
    const r = projectPointOnWall({ x: -500, y: 0 }, wall({ x: 0, y: 0 }, { x: 8000, y: 0 }));
    expect(r.point).toEqual({ x: 0, y: 0 });
    expect(r.offset).toBe(0);
  });
  it('chiếu lên tường chéo 45°', () => {
    const r = projectPointOnWall(
      { x: 0, y: 2000 },
      wall({ x: 0, y: 0 }, { x: 2000, y: 2000 }),
    );
    expect(r.point).toEqual({ x: 1000, y: 1000 });
    expect(r.distance).toBeCloseTo(Math.SQRT2 * 1000, 0);
  });
});

describe('wallLength & wallPolygon', () => {
  it('độ dài 3-4-5', () => {
    expect(wallLength(wall({ x: 0, y: 0 }, { x: 3000, y: 4000 }))).toBe(5000);
  });
  it('polygon tường ngang rộng đúng thickness', () => {
    const poly = wallPolygon(wall({ x: 0, y: 0 }, { x: 4000, y: 0 }));
    expect(poly).toEqual([0, 100, 4000, 100, 4000, -100, 0, -100]);
  });
  it('polygon tường dọc', () => {
    const poly = wallPolygon(wall({ x: 0, y: 0 }, { x: 0, y: 4000 }));
    expect(poly).toEqual([-100, 0, -100, 4000, 100, 4000, 100, 0]);
  });
  it('distance pitago', () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });
});

describe('mergeWallPolygons', () => {
  it('2 tường chữ L giao nhau union thành 1 polygon', () => {
    const merged = mergeWallPolygons([
      wall({ x: 0, y: 0 }, { x: 4000, y: 0 }),
      wall({ x: 0, y: 0 }, { x: 0, y: 4000 }),
    ]);
    expect(merged).toHaveLength(1);
    // Chữ L: 6 đỉnh (8 đỉnh nếu tính trùng do float — kiểm tra ít nhất 6).
    expect(merged[0].length).toBeGreaterThanOrEqual(12);
  });
  it('2 tường rời nhau giữ 2 polygon', () => {
    const merged = mergeWallPolygons([
      wall({ x: 0, y: 0 }, { x: 4000, y: 0 }),
      wall({ x: 0, y: 2000 }, { x: 4000, y: 2000 }),
    ]);
    expect(merged).toHaveLength(2);
  });
  it('mảng rỗng trả về mảng rỗng', () => {
    expect(mergeWallPolygons([])).toEqual([]);
  });
});

describe('mergeWallPolygonsWithHoles', () => {
  it('vòng tường khép kín giữ lỗ phòng bên trong', () => {
    const merged = mergeWallPolygonsWithHoles([
      wall({ x: 0, y: 0 }, { x: 8000, y: 0 }),
      wall({ x: 8000, y: 0 }, { x: 8000, y: 6000 }),
      wall({ x: 8000, y: 6000 }, { x: 0, y: 6000 }),
      wall({ x: 0, y: 6000 }, { x: 0, y: 0 }),
    ]);
    expect(merged).toHaveLength(1);
    expect(merged[0].holes).toHaveLength(1);
    // Lỗ phòng: 7800×5800 (8000/6000 trừ 2×100 mỗi phía, dày 200).
    const hole = merged[0].holes[0];
    const xs = hole.filter((_, i) => i % 2 === 0);
    const ys = hole.filter((_, i) => i % 2 === 1);
    expect(Math.max(...xs) - Math.min(...xs)).toBe(7800);
    expect(Math.max(...ys) - Math.min(...ys)).toBe(5800);
  });
  it('vách ngăn giữa chia lỗ thành 2 phòng', () => {
    const merged = mergeWallPolygonsWithHoles([
      wall({ x: 0, y: 0 }, { x: 8000, y: 0 }),
      wall({ x: 8000, y: 0 }, { x: 8000, y: 6000 }),
      wall({ x: 8000, y: 6000 }, { x: 0, y: 6000 }),
      wall({ x: 0, y: 6000 }, { x: 0, y: 0 }),
      wall({ x: 4000, y: 0 }, { x: 4000, y: 6000 }),
    ]);
    expect(merged).toHaveLength(1);
    expect(merged[0].holes).toHaveLength(2);
  });
  it('chữ L không có lỗ', () => {
    const merged = mergeWallPolygonsWithHoles([
      wall({ x: 0, y: 0 }, { x: 4000, y: 0 }),
      wall({ x: 0, y: 0 }, { x: 0, y: 4000 }),
    ]);
    expect(merged).toHaveLength(1);
    expect(merged[0].holes).toHaveLength(0);
  });
  it('mảng rỗng trả về mảng rỗng', () => {
    expect(mergeWallPolygonsWithHoles([])).toEqual([]);
  });
});

describe('clampOpeningOffset', () => {
  it('giữ nguyên offset hợp lệ', () => {
    expect(clampOpeningOffset(1400, 1200, 8000)).toBe(1400);
  });
  it('clamp offset âm về 0', () => {
    expect(clampOpeningOffset(-50, 900, 8000)).toBe(0);
  });
  it('clamp offset vượt quá về wallLength - width', () => {
    expect(clampOpeningOffset(7500, 900, 8000)).toBe(7100);
  });
  it('tường ngắn hơn opening thì offset về 0', () => {
    expect(clampOpeningOffset(100, 1200, 800)).toBe(0);
  });
  it('làm tròn offset về mm nguyên', () => {
    expect(clampOpeningOffset(1400.6, 1200, 8000)).toBe(1401);
  });
});
