import { describe, expect, it } from 'vitest';
import {
  clampOpeningOffset,
  distance,
  fitScaleFor,
  mergeCoincidentWalls,
  mergeWallPolygons,
  mergeWallPolygonsWithHoles,
  midpoint,
  nearestPointOnChain,
  openingsExceedLength,
  pointAtChainOffset,
  projectPointOnWall,
  resizeSegment,
  snapAngle,
  snapPointToGrid,
  snapToGrid,
  tryMergeWall,
  wallLength,
  wallPolygon,
} from './geometry';
import type { Opening, Point, Wall } from './schema';

const wall = (start: { x: number; y: number }, end: { x: number; y: number }): Wall => ({
  id: 'w1',
  points: [start, end],
  thickness: 200,
});

/** Tường polyline chữ L: (0,0) → (3000,0) → (3000,4000), tổng dài 7000. */
const lPoints: Point[] = [
  { x: 0, y: 0 },
  { x: 3000, y: 0 },
  { x: 3000, y: 4000 },
];
const lWall: Wall = { id: 'poly', points: lPoints, thickness: 200 };

const opening = (wallId: string, offset: number, width: number): Opening => ({
  id: `o-${wallId}-${offset}`,
  wallId,
  type: 'door',
  offset,
  width,
  height: 2100,
  sillHeight: 0,
});

describe('openingsExceedLength', () => {
  const openings = [
    opening('w1', 1000, 900),
    opening('w1', 3000, 1200),
    opening('w2', 7000, 900),
  ];
  it('cửa nằm gọn trong độ dài mới → false', () => {
    expect(openingsExceedLength(openings, 'w1', 5000)).toBe(false);
  });
  it('cửa chạm đúng mép độ dài mới → false', () => {
    expect(openingsExceedLength(openings, 'w1', 4200)).toBe(false);
  });
  it('cửa vượt khỏi độ dài mới → true', () => {
    expect(openingsExceedLength(openings, 'w1', 4199)).toBe(true);
  });
  it('cửa của tường khác bị bỏ qua', () => {
    expect(openingsExceedLength(openings, 'w1', 5000)).toBe(false);
    expect(openingsExceedLength(openings, 'w2', 5000)).toBe(true);
  });
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
  it('độ dài chuỗi = tổng các đoạn', () => {
    expect(wallLength(lWall)).toBe(7000);
  });
  it('polygon tường ngang rộng đúng thickness', () => {
    const poly = wallPolygon({ x: 0, y: 0 }, { x: 4000, y: 0 }, 200);
    expect(poly).toEqual([0, 100, 4000, 100, 4000, -100, 0, -100]);
  });
  it('polygon tường dọc', () => {
    const poly = wallPolygon({ x: 0, y: 0 }, { x: 0, y: 4000 }, 200);
    expect(poly).toEqual([-100, 0, -100, 4000, 100, 4000, 100, 0]);
  });
  it('distance pitago', () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });
});

describe('pointAtChainOffset', () => {
  it('offset trong đoạn đầu', () => {
    expect(pointAtChainOffset(lPoints, 1000)).toEqual({
      point: { x: 1000, y: 0 },
      segmentIndex: 0,
    });
  });
  it('offset qua đỉnh sang đoạn 2', () => {
    expect(pointAtChainOffset(lPoints, 5000)).toEqual({
      point: { x: 3000, y: 2000 },
      segmentIndex: 1,
    });
  });
  it('offset đúng đỉnh thuộc đoạn trước', () => {
    expect(pointAtChainOffset(lPoints, 3000)).toEqual({
      point: { x: 3000, y: 0 },
      segmentIndex: 0,
    });
  });
  it('offset vượt cuối chuỗi kẹp về điểm cuối', () => {
    expect(pointAtChainOffset(lPoints, 99999)).toEqual({
      point: { x: 3000, y: 4000 },
      segmentIndex: 1,
    });
  });
  it('offset âm kẹp về điểm đầu', () => {
    expect(pointAtChainOffset(lPoints, -100)).toEqual({
      point: { x: 0, y: 0 },
      segmentIndex: 0,
    });
  });
});

describe('nearestPointOnChain', () => {
  it('điểm gần đoạn 2: offset tính từ đầu chuỗi', () => {
    const r = nearestPointOnChain(lPoints, { x: 3500, y: 2000 });
    expect(r.point).toEqual({ x: 3000, y: 2000 });
    expect(r.offset).toBe(5000);
    expect(r.segmentIndex).toBe(1);
    expect(r.distance).toBe(500);
  });
  it('điểm gần đoạn đầu', () => {
    const r = nearestPointOnChain(lPoints, { x: 1000, y: 300 });
    expect(r.point).toEqual({ x: 1000, y: 0 });
    expect(r.offset).toBe(1000);
    expect(r.segmentIndex).toBe(0);
  });
});

describe('projectPointOnWall chuỗi polyline', () => {
  it('chiếu lên đoạn 2 của polyline', () => {
    const r = projectPointOnWall({ x: 3500, y: 2000 }, lWall);
    expect(r.point).toEqual({ x: 3000, y: 2000 });
    expect(r.offset).toBe(5000);
    expect(r.distance).toBe(500);
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

describe('fitScaleFor', () => {
  it('vật thể chiếm 80% khung theo chiều hẹp hơn', () => {
    // Nhà mẫu 9000×7000 vào khung 1052×900: chiều ngang hẹp hơn.
    expect(fitScaleFor(9000, 7000, 1052, 900)).toBeCloseTo((1052 * 0.8) / 9000, 6);
    // Khung cao hẹp: chiều dọc quyết định.
    expect(fitScaleFor(9000, 7000, 2000, 500)).toBeCloseTo((500 * 0.8) / 7000, 6);
  });
  it('fill = 1 cho vật thể chạm mép khung', () => {
    expect(fitScaleFor(1000, 1000, 500, 500, 1)).toBe(0.5);
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

describe('tryMergeWall', () => {
  const base: Wall = { id: 'base', points: [{ x: 0, y: 0 }, { x: 3000, y: 0 }], thickness: 200 };
  const other: Wall = { id: 'other', points: [{ x: 0, y: 6000 }, { x: 3000, y: 6000 }], thickness: 200 };

  it('gộp vào cuối khi start tường mới trùng điểm cuối tường cũ', () => {
    const merged = tryMergeWall(
      [base, other],
      [],
      { id: 'new', points: [{ x: 3000, y: 0 }, { x: 3000, y: 4000 }], thickness: 200 },
    );
    expect(merged).not.toBeNull();
    expect(merged!.walls).toHaveLength(2);
    const w = merged!.walls.find((x) => x.id === 'base')!;
    expect(w.points).toEqual([
      { x: 0, y: 0 },
      { x: 3000, y: 0 },
      { x: 3000, y: 4000 },
    ]);
    expect(w.thickness).toBe(200);
    expect(merged!.walls.find((x) => x.id === 'other')).toBe(other);
  });

  it('gộp vào cuối (đảo chiều) khi end tường mới trùng điểm cuối tường cũ', () => {
    const merged = tryMergeWall(
      [base],
      [],
      { id: 'new', points: [{ x: 6000, y: 0 }, { x: 3000, y: 0 }], thickness: 200 },
    );
    expect(merged!.walls[0].points).toEqual([
      { x: 0, y: 0 },
      { x: 3000, y: 0 },
      { x: 6000, y: 0 },
    ]);
  });

  it('gộp vào đầu khi end tường mới trùng điểm đầu: opening dời +chiều dài đoạn mới', () => {
    const door = opening('base', 1000, 900);
    const merged = tryMergeWall(
      [base],
      [door],
      { id: 'new', points: [{ x: -2000, y: 0 }, { x: 0, y: 0 }], thickness: 200 },
    );
    expect(merged!.walls[0].points).toEqual([
      { x: -2000, y: 0 },
      { x: 0, y: 0 },
      { x: 3000, y: 0 },
    ]);
    expect(merged!.openings).toEqual([{ ...door, offset: 3000 }]);
  });

  it('gộp vào đầu (đảo chiều) khi start tường mới trùng điểm đầu: opening dời theo', () => {
    const door = opening('base', 1000, 900);
    const merged = tryMergeWall(
      [base],
      [door],
      { id: 'new', points: [{ x: 0, y: 0 }, { x: -2000, y: 0 }], thickness: 200 },
    );
    expect(merged!.walls[0].points).toEqual([
      { x: -2000, y: 0 },
      { x: 0, y: 0 },
      { x: 3000, y: 0 },
    ]);
    expect(merged!.openings[0].offset).toBe(3000);
  });

  it('gộp vào cuối thì opening giữ nguyên offset', () => {
    const door = opening('base', 1000, 900);
    const merged = tryMergeWall(
      [base],
      [door],
      { id: 'new', points: [{ x: 3000, y: 0 }, { x: 3000, y: 4000 }], thickness: 200 },
    );
    expect(merged!.openings[0].offset).toBe(1000);
  });

  it('không trùng đầu nào → null', () => {
    expect(
      tryMergeWall(
        [base],
        [],
        { id: 'new', points: [{ x: 5000, y: 0 }, { x: 6000, y: 0 }], thickness: 200 },
      ),
    ).toBeNull();
  });

  it('trùng đỉnh GIỮA của polyline (nối chữ T) → không gộp', () => {
    expect(
      tryMergeWall(
        [lWall],
        [],
        { id: 'new', points: [{ x: 3000, y: 0 }, { x: 5000, y: 0 }], thickness: 200 },
      ),
    ).toBeNull();
  });

  it('tường mới dài 0 → null dù trùng điểm', () => {
    expect(
      tryMergeWall(
        [base],
        [],
        { id: 'new', points: [{ x: 3000, y: 0 }, { x: 3000, y: 0 }], thickness: 200 },
      ),
    ).toBeNull();
  });

  it('cả 2 đầu đều trùng thì chỉ gộp với tường trùng đầu start', () => {
    const left: Wall = { id: 'left', points: [{ x: -3000, y: 0 }, { x: 0, y: 0 }], thickness: 200 };
    const right: Wall = { id: 'right', points: [{ x: 3000, y: 0 }, { x: 6000, y: 0 }], thickness: 200 };
    const merged = tryMergeWall(
      [left, right],
      [],
      { id: 'new', points: [{ x: 0, y: 0 }, { x: 3000, y: 0 }], thickness: 200 },
    );
    expect(merged!.walls).toHaveLength(2);
    expect(merged!.walls.find((x) => x.id === 'left')!.points).toEqual([
      { x: -3000, y: 0 },
      { x: 0, y: 0 },
      { x: 3000, y: 0 },
    ]);
    expect(merged!.walls.find((x) => x.id === 'right')).toBe(right);
  });

  it('khác thickness → null dù trùng đầu mút', () => {
    expect(
      tryMergeWall(
        [base],
        [],
        { id: 'new', points: [{ x: 3000, y: 0 }, { x: 3000, y: 4000 }], thickness: 300 },
      ),
    ).toBeNull();
  });

  it('khác height → null dù trùng đầu mút', () => {
    const tall: Wall = { ...base, height: 3000 };
    expect(
      tryMergeWall(
        [tall],
        [],
        { id: 'new', points: [{ x: 3000, y: 0 }, { x: 3000, y: 4000 }], thickness: 200 },
      ),
    ).toBeNull();
  });
});

describe('mergeCoincidentWalls', () => {
  const w = (id: string, pts: Point[], extra: Partial<Wall> = {}): Wall => ({
    id,
    points: pts,
    thickness: 200,
    ...extra,
  });

  it('2 tường nối đầu-cuối thành 1 chuỗi, giữ id tường đứng trước', () => {
    const a = w('a', [{ x: 0, y: 0 }, { x: 3000, y: 0 }]);
    const b = w('b', [{ x: 3000, y: 0 }, { x: 3000, y: 4000 }]);
    const { walls, openings } = mergeCoincidentWalls([a, b], []);
    expect(walls).toHaveLength(1);
    expect(walls[0].id).toBe('a');
    expect(walls[0].points).toEqual([
      { x: 0, y: 0 },
      { x: 3000, y: 0 },
      { x: 3000, y: 4000 },
    ]);
    expect(openings).toEqual([]);
  });

  it('3 tường nối tiếp thành 1 chuỗi 4 điểm', () => {
    const a = w('a', [{ x: 0, y: 0 }, { x: 1000, y: 0 }]);
    const b = w('b', [{ x: 1000, y: 0 }, { x: 2000, y: 0 }]);
    const c = w('c', [{ x: 2000, y: 0 }, { x: 3000, y: 0 }]);
    const { walls } = mergeCoincidentWalls([a, b, c], []);
    expect(walls).toHaveLength(1);
    expect(walls[0].points).toEqual([
      { x: 0, y: 0 },
      { x: 1000, y: 0 },
      { x: 2000, y: 0 },
      { x: 3000, y: 0 },
    ]);
  });

  it('4 tường khép kín thành vòng: 5 điểm, điểm đầu == điểm cuối', () => {
    const walls = [
      w('n', [{ x: 0, y: 0 }, { x: 1000, y: 0 }]),
      w('e', [{ x: 1000, y: 0 }, { x: 1000, y: 1000 }]),
      w('s', [{ x: 1000, y: 1000 }, { x: 0, y: 1000 }]),
      w('w', [{ x: 0, y: 1000 }, { x: 0, y: 0 }]),
    ];
    const { walls: merged } = mergeCoincidentWalls(walls, []);
    expect(merged).toHaveLength(1);
    expect(merged[0].points).toEqual([
      { x: 0, y: 0 },
      { x: 1000, y: 0 },
      { x: 1000, y: 1000 },
      { x: 0, y: 1000 },
      { x: 0, y: 0 },
    ]);
    expect(merged[0].points[0]).toEqual(merged[0].points[4]);
  });

  it('khác thickness → không gộp', () => {
    const a = w('a', [{ x: 0, y: 0 }, { x: 3000, y: 0 }]);
    const b = w('b', [{ x: 3000, y: 0 }, { x: 3000, y: 4000 }], { thickness: 300 });
    expect(mergeCoincidentWalls([a, b], []).walls).toHaveLength(2);
  });

  it('khác height → không gộp (một bên có height, một bên không; hoặc 2 height khác nhau)', () => {
    const a = w('a', [{ x: 0, y: 0 }, { x: 3000, y: 0 }], { height: 3000 });
    const b = w('b', [{ x: 3000, y: 0 }, { x: 3000, y: 4000 }]);
    expect(mergeCoincidentWalls([a, b], []).walls).toHaveLength(2);
    const c = w('c', [{ x: 3000, y: 0 }, { x: 3000, y: 4000 }], { height: 2500 });
    expect(mergeCoincidentWalls([a, c], []).walls).toHaveLength(2);
  });

  it('opening dời offset theo vị trí mới trong chuỗi (tường sau dời +chiều dài tường trước)', () => {
    const a = w('a', [{ x: 0, y: 0 }, { x: 3000, y: 0 }]);
    const b = w('b', [{ x: 3000, y: 0 }, { x: 3000, y: 4000 }]);
    const doorA = opening('a', 1000, 900);
    const doorB = opening('b', 500, 800);
    const { walls, openings } = mergeCoincidentWalls([a, b], [doorA, doorB]);
    expect(walls).toHaveLength(1);
    expect(openings).toHaveLength(2);
    expect(openings.find((o) => o.id === doorA.id)).toEqual({ ...doorA, offset: 1000 });
    expect(openings.find((o) => o.id === doorB.id)).toEqual({
      ...doorB,
      wallId: 'a',
      offset: 3500,
    });
  });

  it('trường hợp prepend: tường đứng trước trong mảng nằm sau trong chuỗi thì opening của nó dời', () => {
    const b = w('b', [{ x: 3000, y: 0 }, { x: 6000, y: 0 }]);
    const a = w('a', [{ x: 0, y: 0 }, { x: 3000, y: 0 }]);
    const doorA = opening('a', 1000, 900);
    const doorB = opening('b', 500, 800);
    const { walls, openings } = mergeCoincidentWalls([b, a], [doorA, doorB]);
    expect(walls).toHaveLength(1);
    expect(walls[0].id).toBe('b'); // giữ id tường đứng trước trong mảng
    expect(walls[0].points).toEqual([
      { x: 0, y: 0 },
      { x: 3000, y: 0 },
      { x: 6000, y: 0 },
    ]);
    // A đứng trước trong chuỗi → offset giữ nguyên; B đứng sau → +3000.
    expect(openings.find((o) => o.id === doorA.id)).toEqual({
      ...doorA,
      wallId: 'b',
      offset: 1000,
    });
    expect(openings.find((o) => o.id === doorB.id)).toEqual({ ...doorB, offset: 3500 });
  });

  it('tường bị đảo chiều: opening đổi offset thành len - offset - width', () => {
    const a = w('a', [{ x: 0, y: 0 }, { x: 3000, y: 0 }]);
    const b = w('b', [{ x: 6000, y: 0 }, { x: 3000, y: 0 }]); // hướng ngược
    const doorB = opening('b', 500, 900);
    const { walls, openings } = mergeCoincidentWalls([a, b], [doorB]);
    expect(walls[0].points).toEqual([
      { x: 0, y: 0 },
      { x: 3000, y: 0 },
      { x: 6000, y: 0 },
    ]);
    // Cửa trên B (x 5500..4600) → trong chuỗi gộp: offset 4600.
    expect(openings[0]).toEqual({ ...doorB, wallId: 'a', offset: 4600 });
  });

  it('nối chữ T (đầu mút nằm trên đoạn giữa) → không gộp', () => {
    const a = w('a', [{ x: 0, y: 0 }, { x: 6000, y: 0 }]);
    const b = w('b', [{ x: 3000, y: 0 }, { x: 3000, y: 4000 }]);
    expect(mergeCoincidentWalls([a, b], []).walls).toHaveLength(2);
  });

  it('trùng đỉnh GIỮA của polyline → không gộp', () => {
    const b = w('b', [{ x: 3000, y: 0 }, { x: 5000, y: 0 }]);
    expect(mergeCoincidentWalls([lWall, b], []).walls).toHaveLength(2);
  });

  it('không thay đổi mảng/đối tượng đầu vào', () => {
    const a = w('a', [{ x: 0, y: 0 }, { x: 3000, y: 0 }]);
    const b = w('b', [{ x: 3000, y: 0 }, { x: 3000, y: 4000 }]);
    const door = opening('b', 500, 800);
    const walls = [a, b];
    const openings = [door];
    mergeCoincidentWalls(walls, openings);
    expect(walls).toHaveLength(2);
    expect(a.points).toEqual([
      { x: 0, y: 0 },
      { x: 3000, y: 0 },
    ]);
    expect(door.offset).toBe(500);
    expect(door.wallId).toBe('b');
  });
});

describe('resizeSegment', () => {
  it('đổi dài đoạn đầu: giữ điểm đầu, dời điểm chung, điểm cuối giữ nguyên', () => {
    const next = resizeSegment(lPoints, 0, 2000);
    expect(next).toEqual([
      { x: 0, y: 0 },
      { x: 2000, y: 0 },
      { x: 3000, y: 4000 },
    ]);
    expect(next).not.toBe(lPoints);
  });

  it('đổi dài đoạn giữa: chỉ dời đỉnh chung của đoạn đó', () => {
    const next = resizeSegment(lPoints, 1, 2000);
    expect(next).toEqual([
      { x: 0, y: 0 },
      { x: 3000, y: 0 },
      { x: 3000, y: 2000 },
    ]);
  });

  it('độ dài không hợp lệ (0 / âm) → trả lại mảng gốc', () => {
    expect(resizeSegment(lPoints, 0, 0)).toBe(lPoints);
    expect(resizeSegment(lPoints, 0, -500)).toBe(lPoints);
  });

  it('độ dài bằng đoạn hiện tại → trả lại mảng gốc', () => {
    expect(resizeSegment(lPoints, 0, 3000)).toBe(lPoints);
    expect(resizeSegment(lPoints, 1, 4000)).toBe(lPoints);
  });

  it('chỉ số đoạn ngoài khoảng → trả lại mảng gốc', () => {
    expect(resizeSegment(lPoints, -1, 2000)).toBe(lPoints);
    expect(resizeSegment(lPoints, 2, 2000)).toBe(lPoints);
  });

  it('vòng khép kín: đổi dài đoạn cuối cũng dời điểm đầu (trùng điểm cuối)', () => {
    const ring: Point[] = [
      { x: 0, y: 0 },
      { x: 3000, y: 0 },
      { x: 3000, y: 3000 },
      { x: 0, y: 3000 },
      { x: 0, y: 0 },
    ];
    const next = resizeSegment(ring, 3, 2000);
    expect(next).toEqual([
      { x: 0, y: 1000 },
      { x: 3000, y: 0 },
      { x: 3000, y: 3000 },
      { x: 0, y: 3000 },
      { x: 0, y: 1000 },
    ]);
    expect(next[0]).toEqual(next[4]);
  });
});
