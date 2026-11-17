import { describe, expect, it } from 'vitest';
import { union, type Polygon } from 'polygon-clipping';
import {
  centerlineSegments,
  clampOpeningOffset,
  distance,
  doorSwing,
  doorSwingPolygon,
  fitScaleFor,
  mergeCoincidentWalls,
  mergeWallPolygons,
  mergeWallPolygonsWithHoles,
  midpoint,
  nearestPointOnChain,
  offsetFromRefDim,
  openingRefDims,
  openingsExceedLength,
  pinchZoom,
  planBounds,
  pointAtChainOffset,
  projectPointOnWall,
  resizeSegment,
  snapAngle,
  snapPointToGrid,
  snapToGrid,
  tryMergeWall,
  wallCornerPatches,
  wallLength,
  wallPolygon,
  wallSegmentPolygons,
  windowLines,
  type MergedWallPolygon,
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

/** Diện tích ring phẳng [x0,y0,...] bằng công thức shoelace. */
const ringArea = (flat: number[]): number => {
  let sum = 0;
  for (let i = 0; i + 1 < flat.length; i += 2) {
    const x1 = flat[i];
    const y1 = flat[i + 1];
    const x2 = flat[(i + 2) % flat.length];
    const y2 = flat[(i + 3) % flat.length];
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum) / 2;
};

/** Diện tích đã gộp: vòng ngoài trừ các lỗ. */
const mergedArea = (merged: MergedWallPolygon[]): number =>
  merged.reduce(
    (sum, p) =>
      sum + ringArea(p.outer) - p.holes.reduce((h, hole) => h + ringArea(hole), 0),
    0,
  );

/** Điểm có nằm trong ring phẳng không (ray casting, even-odd). */
const pointInRing = (x: number, y: number, flat: number[]): boolean => {
  let inside = false;
  for (let i = 0, j = flat.length - 2; i < flat.length; i += 2) {
    const xi = flat[i];
    const yi = flat[i + 1];
    const xj = flat[j];
    const yj = flat[j + 1];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
    j = i;
  }
  return inside;
};

/** Điểm có nằm trong kết quả đã gộp (trong vòng ngoài, ngoài mọi lỗ). */
const pointInMerged = (x: number, y: number, merged: MergedWallPolygon[]): boolean =>
  merged.some(
    (p) => pointInRing(x, y, p.outer) && !p.holes.some((h) => pointInRing(x, y, h)),
  );

/** Trọng tâm (trung bình các đỉnh) của polygon phẳng. */
const centroid = (flat: number[]): { x: number; y: number } => {
  let x = 0;
  let y = 0;
  for (let i = 0; i + 1 < flat.length; i += 2) {
    x += flat[i];
    y += flat[i + 1];
  }
  const n = flat.length / 2;
  return { x: x / n, y: y / n };
};

const toRing = (flat: number[]): [number, number][] => {
  const ring: [number, number][] = [];
  for (let i = 0; i + 1 < flat.length; i += 2) ring.push([flat[i], flat[i + 1]]);
  return ring;
};

describe('wallCornerPatches (miter góc)', () => {
  it('tường L 90°: vá lấp ô khuyết 100×100, diện tích 1.400.000', () => {
    const patches = wallCornerPatches(lWall);
    expect(patches).toHaveLength(1);
    expect(patches[0]).toHaveLength(8); // tứ giác miter
    const merged = mergeWallPolygonsWithHoles([lWall]);
    expect(merged).toHaveLength(1);
    expect(merged[0].holes).toHaveLength(0);
    // Rect 3000×200 + rect 4000×200 − chồng 100×100 + vá miter 100×100.
    expect(Math.abs(mergedArea(merged) - 1400000)).toBeLessThan(1);
    expect(pointInMerged(3050, -50, merged)).toBe(true);
    // mergeWallPolygons (không lỗ) cũng nhận vá miter.
    const flat = mergeWallPolygons([lWall]);
    expect(flat).toHaveLength(1);
    expect(Math.abs(ringArea(flat[0]) - 1400000)).toBeLessThan(1);
  });

  it('góc nhọn 30°: vá miter nằm trong polygon đã gộp, diện tích tăng so với chỉ-rect', () => {
    const sharp: Wall = {
      id: 'sharp30',
      points: [
        { x: 0, y: 0 },
        { x: 3000, y: 0 },
        { x: 402, y: 1500 },
      ],
      thickness: 200,
    };
    const patches = wallCornerPatches(sharp);
    expect(patches).toHaveLength(1);
    expect(patches[0]).toHaveLength(8); // miter (|M−P| ≈ 386 < 2×200)
    const merged = mergeWallPolygonsWithHoles([sharp]);
    const c = centroid(patches[0]);
    expect(pointInMerged(c.x, c.y, merged)).toBe(true);
    // Union chỉ-rect (không vá) nhỏ hơn vì thiếu miếng góc.
    const rectPolys = wallSegmentPolygons(sharp).map(
      (poly) => [toRing(poly)] as Polygon,
    );
    const rectOnly = union(rectPolys[0], ...rectPolys.slice(1));
    const rectArea = rectOnly.reduce((sum, poly) => sum + ringArea(poly[0].flat()), 0);
    expect(mergedArea(merged)).toBeGreaterThan(rectArea);
  });

  it('góc rất nhọn 10°: bevel — điểm miter nằm ngoài, tam giác bevel nằm trong', () => {
    const acute: Wall = {
      id: 'acute10',
      points: [
        { x: 0, y: 0 },
        { x: 3000, y: 0 },
        { x: 47, y: 521 },
      ],
      thickness: 200,
    };
    const patches = wallCornerPatches(acute);
    expect(patches).toHaveLength(1);
    expect(patches[0]).toHaveLength(6); // tam giác bevel
    const merged = mergeWallPolygonsWithHoles([acute]);
    const c = centroid(patches[0]);
    expect(pointInMerged(c.x, c.y, merged)).toBe(true);
    // Tính lại điểm miter M theo công thức (độc lập với implementation).
    const p = { x: 3000, y: 0 };
    const u = { x: 1, y: 0 };
    const lv = Math.hypot(47 - 3000, 521 - 0);
    const v = { x: (47 - 3000) / lv, y: 521 / lv };
    const cross = u.x * v.y - u.y * v.x;
    expect(cross).toBeGreaterThan(0);
    const A = { x: p.x, y: p.y - 100 }; // nout(u) = (0, −1)
    const B = { x: p.x + v.y * 100, y: p.y - v.x * 100 }; // nout(v) = (vy, −vx)
    const s = ((B.x - A.x) * v.y - (B.y - A.y) * v.x) / cross;
    const M = { x: A.x + s * u.x, y: A.y + s * u.y };
    expect(Math.hypot(M.x - p.x, M.y - p.y)).toBeGreaterThan(400);
    expect(pointInMerged(M.x, M.y, merged)).toBe(false);
  });

  it('vòng kín + vách: 4 góc đều vá, diện tích 6.760.000, đúng 2 lỗ', () => {
    const ring: Wall = {
      id: 'ring',
      points: [
        { x: 0, y: 0 },
        { x: 8000, y: 0 },
        { x: 8000, y: 6000 },
        { x: 0, y: 6000 },
        { x: 0, y: 0 },
      ],
      thickness: 200,
    };
    const divider: Wall = {
      id: 'div',
      points: [
        { x: 4000, y: 0 },
        { x: 4000, y: 6000 },
      ],
      thickness: 200,
    };
    expect(wallCornerPatches(ring)).toHaveLength(4);
    const merged = mergeWallPolygonsWithHoles([ring, divider]);
    expect(merged).toHaveLength(1);
    expect(merged[0].holes).toHaveLength(2);
    // Vòng miter 8200×6200 − lỗ 7800×5800 + vách 6000×200 − chồng 2×(200×100).
    expect(Math.abs(mergedArea(merged) - 6760000)).toBeLessThan(1);
  });

  it('tường thẳng 3 điểm: không vá, diện tích 1.600.000', () => {
    const straight: Wall = {
      id: 'straight',
      points: [
        { x: 0, y: 0 },
        { x: 3000, y: 0 },
        { x: 8000, y: 0 },
      ],
      thickness: 200,
    };
    expect(wallCornerPatches(straight)).toEqual([]);
    const merged = mergeWallPolygonsWithHoles([straight]);
    expect(Math.abs(mergedArea(merged) - 1600000)).toBeLessThan(1);
  });
});

describe('planBounds', () => {
  it('nhà cũ 8000×6000: khung 9000×7000 tâm (4000, 3000) như trước đây', () => {
    const walls: Wall[] = [
      { id: 'n', points: [{ x: 0, y: 0 }, { x: 8000, y: 0 }], thickness: 200 },
      { id: 'e', points: [{ x: 8000, y: 0 }, { x: 8000, y: 6000 }], thickness: 200 },
      { id: 's', points: [{ x: 8000, y: 6000 }, { x: 0, y: 6000 }], thickness: 200 },
      { id: 'w', points: [{ x: 0, y: 6000 }, { x: 0, y: 0 }], thickness: 200 },
    ];
    expect(planBounds(walls)).toEqual({ x0: -500, y0: -500, x1: 8500, y1: 6500 });
  });

  it('nhà demo 5600×7900: khung 6400×8700 tâm (2800, 3950)', () => {
    const walls: Wall[] = [
      { id: 'n', points: [{ x: 100, y: 100 }, { x: 5500, y: 100 }], thickness: 200 },
      { id: 'e', points: [{ x: 5500, y: 100 }, { x: 5500, y: 7800 }], thickness: 200 },
      { id: 's', points: [{ x: 5500, y: 7800 }, { x: 1900, y: 7800 }], thickness: 200 },
      { id: 'v', points: [{ x: 1900, y: 7800 }, { x: 1900, y: 100 }], thickness: 200 },
    ];
    expect(planBounds(walls)).toEqual({ x0: -400, y0: -400, x1: 6000, y1: 8300 });
  });

  it('không có tường: null', () => {
    expect(planBounds([])).toBeNull();
  });
});

describe('doorSwing', () => {
  const eastWall = wall({ x: 0, y: 0 }, { x: 4000, y: 0 });
  const northWall = wall({ x: 0, y: 4000 }, { x: 0, y: 0 });

  it('tường hướng đông, không flip: bản lề ở mặt tường phía nam (+n), cánh về phía nam, cung +90°', () => {
    const swing = doorSwing(opening('w1', 1000, 900), eastWall);
    expect(swing.hinge).toEqual({ x: 1000, y: 100 });
    expect(swing.leafEnd).toEqual({ x: 1000, y: 1000 });
    expect(swing.arcRotation).toBe(0);
    expect(swing.arcAngle).toBe(90);
  });

  it('tường hướng đông, flip: bản lề ở mặt tường phía bắc (−n), cánh về phía bắc, cung +90° từ −90° (hướng cánh)', () => {
    const swing = doorSwing({ ...opening('w1', 1000, 900), flip: true }, eastWall);
    expect(swing.hinge).toEqual({ x: 1000, y: -100 });
    expect(swing.leafEnd).toEqual({ x: 1000, y: -1000 });
    expect(swing.arcRotation).toBe(-90);
    expect(swing.arcAngle).toBe(90);
  });

  it('tường hướng bắc, không flip: bản lề ở mặt tường phía đông (+n), cánh về phía đông, cung +90° từ −90°', () => {
    const swing = doorSwing(opening('w1', 1000, 800), northWall);
    expect(swing.hinge).toEqual({ x: 100, y: 3000 });
    expect(swing.leafEnd).toEqual({ x: 900, y: 3000 });
    expect(swing.arcRotation).toBe(-90);
    expect(swing.arcAngle).toBe(90);
  });

  it('tường hướng bắc, flip: bản lề ở mặt tường phía tây (−n), cánh về phía tây, cung +90° từ −180° (hướng cánh)', () => {
    const swing = doorSwing({ ...opening('w1', 1000, 800), flip: true }, northWall);
    expect(swing.hinge).toEqual({ x: -100, y: 3000 });
    expect(swing.leafEnd).toEqual({ x: -900, y: 3000 });
    expect(swing.arcRotation).toBe(-180);
    expect(swing.arcAngle).toBe(90);
  });

  it('không có flip (file cũ): vẽ như flip=false', () => {
    const o = opening('w1', 1000, 900);
    expect(o.flip).toBeUndefined();
    const swing = doorSwing(o, eastWall);
    expect(swing.hinge).toEqual({ x: 1000, y: 100 });
    expect(swing.leafEnd).toEqual({ x: 1000, y: 1000 });
    expect(swing.arcAngle).toBe(90);
  });
});

describe('doorSwingPolygon', () => {
  const eastWall = wall({ x: 0, y: 0 }, { x: 4000, y: 0 });

  it('không flip: quạt 90° từ mép đóng (đông) tới cánh mở (nam), đỉnh đầu là bản lề', () => {
    const poly = doorSwingPolygon(opening('w1', 1000, 900), eastWall);
    expect(poly.length).toBe(18); // bản lề + 17 điểm cung (segments=16)
    expect(poly[0]).toEqual({ x: 1000, y: 100 });
    expect(poly[1]).toEqual({ x: 1900, y: 100 }); // đầu cánh khi đóng
    const last = poly[poly.length - 1];
    expect(last.x).toBeCloseTo(1000, 6);
    expect(last.y).toBeCloseTo(1000, 6); // đầu cánh khi mở = leafEnd
  });

  it('flip: quạt về phía bắc, đỉnh cuối là mép đóng', () => {
    const poly = doorSwingPolygon({ ...opening('w1', 1000, 900), flip: true }, eastWall);
    expect(poly[0]).toEqual({ x: 1000, y: -100 });
    expect(poly[1].x).toBeCloseTo(1000, 6);
    expect(poly[1].y).toBeCloseTo(-1000, 6); // đầu cánh khi mở
    const last = poly[poly.length - 1];
    expect(last).toEqual({ x: 1900, y: -100 }); // đầu cánh khi đóng
  });

  it('cửa sổ không có vùng quay', () => {
    const win: Opening = { ...opening('w1', 1000, 900), type: 'window' };
    expect(doorSwingPolygon(win, eastWall)).toEqual([]);
  });
});

describe('windowLines', () => {
  const eastWall = wall({ x: 0, y: 0 }, { x: 4000, y: 0 });
  const northWall = wall({ x: 0, y: 4000 }, { x: 0, y: 0 });
  const win = (wallId: string, offset: number, width: number): Opening => ({
    ...opening(wallId, offset, width),
    type: 'window',
    height: 1200,
    sillHeight: 900,
  });

  it('tường hướng đông dày 200: 2 nét thấy ở ±100, 2 khung ở ±50, chạy từ a tới b', () => {
    const lines = windowLines(win('w1', 1000, 900), eastWall);
    expect(lines.facePlus).toEqual([
      { x: 1000, y: 100 },
      { x: 1900, y: 100 },
    ]);
    expect(lines.faceMinus).toEqual([
      { x: 1000, y: -100 },
      { x: 1900, y: -100 },
    ]);
    expect(lines.framePlus).toEqual([
      { x: 1000, y: 50 },
      { x: 1900, y: 50 },
    ]);
    expect(lines.frameMinus).toEqual([
      { x: 1000, y: -50 },
      { x: 1900, y: -50 },
    ]);
  });

  it('tường hướng bắc: nét thấy theo pháp tuyến đông/tây', () => {
    const lines = windowLines(win('w1', 1000, 800), northWall);
    expect(lines.facePlus).toEqual([
      { x: 100, y: 3000 },
      { x: 100, y: 2200 },
    ]);
    expect(lines.faceMinus).toEqual([
      { x: -100, y: 3000 },
      { x: -100, y: 2200 },
    ]);
    expect(lines.framePlus).toEqual([
      { x: 50, y: 3000 },
      { x: 50, y: 2200 },
    ]);
    expect(lines.frameMinus).toEqual([
      { x: -50, y: 3000 },
      { x: -50, y: 2200 },
    ]);
  });

  it('tường dày 100: nét thấy ở ±50, khung ở ±25', () => {
    const thinWall: Wall = { id: 'w1', points: [{ x: 0, y: 0 }, { x: 2000, y: 0 }], thickness: 100 };
    const lines = windowLines(win('w1', 500, 600), thinWall);
    expect(lines.facePlus).toEqual([
      { x: 500, y: 50 },
      { x: 1100, y: 50 },
    ]);
    expect(lines.faceMinus).toEqual([
      { x: 500, y: -50 },
      { x: 1100, y: -50 },
    ]);
    expect(lines.framePlus).toEqual([
      { x: 500, y: 25 },
      { x: 1100, y: 25 },
    ]);
    expect(lines.frameMinus).toEqual([
      { x: 500, y: -25 },
      { x: 1100, y: -25 },
    ]);
  });
});

describe('openingRefDims', () => {
  const eastWall = wall({ x: 0, y: 0 }, { x: 4000, y: 0 });
  const northWall = wall({ x: 0, y: 4000 }, { x: 0, y: 0 });

  it('tường đông 2 điểm: dim a tới đầu tường, dim b tới cuối tường', () => {
    const [a, b] = openingRefDims(opening('w1', 1000, 900), eastWall);
    expect(a).toEqual({
      value: 1000,
      p0: { x: 0, y: 0 },
      p1: { x: 1000, y: 0 },
      side: 'a',
    });
    expect(b).toEqual({
      value: 2100,
      p0: { x: 1900, y: 0 },
      p1: { x: 4000, y: 0 },
      side: 'b',
    });
  });

  it('tường bắc: mốc theo hướng chuỗi (từ dưới lên trên)', () => {
    const [a, b] = openingRefDims(opening('w1', 1000, 800), northWall);
    expect(a).toEqual({
      value: 1000,
      p0: { x: 0, y: 4000 },
      p1: { x: 0, y: 3000 },
      side: 'a',
    });
    expect(b).toEqual({
      value: 2200,
      p0: { x: 0, y: 2200 },
      p1: { x: 0, y: 0 },
      side: 'b',
    });
  });

  it('tường chữ L, cửa ở đoạn 2: mốc là 2 đỉnh của đoạn 2, không phải đầu chuỗi', () => {
    const [a, b] = openingRefDims(opening('poly', 4000, 800), lWall);
    expect(a).toEqual({
      value: 1000,
      p0: { x: 3000, y: 0 },
      p1: { x: 3000, y: 1000 },
      side: 'a',
    });
    expect(b).toEqual({
      value: 2200,
      p0: { x: 3000, y: 1800 },
      p1: { x: 3000, y: 4000 },
      side: 'b',
    });
  });

  it('cửa ở ngay đầu đoạn: dim a = 0, 2 điểm đo trùng nhau', () => {
    const [a, b] = openingRefDims(opening('w1', 0, 900), eastWall);
    expect(a).toEqual({ value: 0, p0: { x: 0, y: 0 }, p1: { x: 0, y: 0 }, side: 'a' });
    expect(b.value).toBe(3100);
  });
});

describe('offsetFromRefDim', () => {
  const eastWall = wall({ x: 0, y: 0 }, { x: 4000, y: 0 });

  it("side 'a': offset mới = đầu đoạn + giá trị", () => {
    expect(offsetFromRefDim(opening('w1', 1000, 900), eastWall, 'a', 500)).toBe(500);
    expect(offsetFromRefDim(opening('w1', 1000, 900), eastWall, 'a', 0)).toBe(0);
  });

  it("side 'b': offset mới = cuối đoạn − giá trị − width", () => {
    expect(offsetFromRefDim(opening('w1', 1000, 900), eastWall, 'b', 1000)).toBe(2100);
    expect(offsetFromRefDim(opening('w1', 1000, 900), eastWall, 'b', 0)).toBe(3100);
  });

  it('tường chữ L, cửa ở đoạn 2: tính theo đầu/cuối đoạn 2', () => {
    const o = opening('poly', 4000, 800);
    expect(offsetFromRefDim(o, lWall, 'a', 200)).toBe(3200);
    expect(offsetFromRefDim(o, lWall, 'b', 500)).toBe(5700);
  });
});

describe('pinchZoom', () => {
  const cam = { x: 100, y: 50, scale: 0.1 };
  const mid = { x: 200, y: 150 };

  it('chụm ra (khoảng cách tăng gấp đôi): scale tăng gấp đôi', () => {
    const next = pinchZoom(100, 200, mid, cam, 0.02, 10);
    expect(next.scale).toBeCloseTo(0.2, 9);
  });

  it('chụm vào (khoảng cách giảm một nửa): scale giảm một nửa', () => {
    const next = pinchZoom(200, 100, mid, cam, 0.02, 10);
    expect(next.scale).toBeCloseTo(0.05, 9);
  });

  it('điểm giữa 2 ngón đứng yên trên màn hình (điểm world dưới nó không đổi)', () => {
    const next = pinchZoom(100, 200, mid, cam, 0.02, 10);
    // Điểm world dưới điểm giữa trước và sau pinch phải trùng nhau.
    const before = { x: (mid.x - cam.x) / cam.scale, y: (mid.y - cam.y) / cam.scale };
    const after = { x: (mid.x - next.x) / next.scale, y: (mid.y - next.y) / next.scale };
    expect(after.x).toBeCloseTo(before.x, 6);
    expect(after.y).toBeCloseTo(before.y, 6);
  });

  it('kẹp scale trong [min, max]', () => {
    expect(pinchZoom(100, 10000, mid, cam, 0.02, 10).scale).toBe(10);
    expect(pinchZoom(10000, 100, mid, cam, 0.02, 10).scale).toBe(0.02);
  });

  it('khoảng cách ≤ 0 thì giữ nguyên camera', () => {
    expect(pinchZoom(0, 100, mid, cam, 0.02, 10)).toEqual(cam);
    expect(pinchZoom(100, 0, mid, cam, 0.02, 10)).toEqual(cam);
  });
});

describe('centerlineSegments', () => {
  it('không có lỗ cửa thì giữ nguyên cả chuỗi', () => {
    expect(centerlineSegments(lWall, [])).toEqual([lPoints]);
  });

  it('1 cửa giữa tường thẳng thì cắt thành 2 đoạn', () => {
    const w = wall({ x: 0, y: 0 }, { x: 5000, y: 0 });
    const segs = centerlineSegments(w, [opening('w1', 2000, 900)]);
    expect(segs).toEqual([
      [
        { x: 0, y: 0 },
        { x: 2000, y: 0 },
      ],
      [
        { x: 2900, y: 0 },
        { x: 5000, y: 0 },
      ],
    ]);
  });

  it('cửa ở đầu chuỗi thì chỉ còn đoạn sau cửa', () => {
    const w = wall({ x: 0, y: 0 }, { x: 5000, y: 0 });
    expect(centerlineSegments(w, [opening('w1', 0, 900)])).toEqual([
      [
        { x: 900, y: 0 },
        { x: 5000, y: 0 },
      ],
    ]);
  });

  it('cửa ở cuối chuỗi thì chỉ còn đoạn trước cửa', () => {
    const w = wall({ x: 0, y: 0 }, { x: 5000, y: 0 });
    expect(centerlineSegments(w, [opening('w1', 4100, 900)])).toEqual([
      [
        { x: 0, y: 0 },
        { x: 4100, y: 0 },
      ],
    ]);
  });

  it('2 cửa thì cắt thành 3 đoạn', () => {
    const w = wall({ x: 0, y: 0 }, { x: 6000, y: 0 });
    const segs = centerlineSegments(w, [opening('w1', 1000, 900), opening('w1', 3000, 900)]);
    expect(segs).toHaveLength(3);
    expect(segs[0]).toEqual([
      { x: 0, y: 0 },
      { x: 1000, y: 0 },
    ]);
    expect(segs[1]).toEqual([
      { x: 1900, y: 0 },
      { x: 3000, y: 0 },
    ]);
    expect(segs[2]).toEqual([
      { x: 3900, y: 0 },
      { x: 6000, y: 0 },
    ]);
  });

  it('cửa bắc qua đỉnh polyline thì cắt đúng qua đỉnh', () => {
    // Tường L dài 7000, đỉnh ở 3000; cửa [2500, 3500] bắc qua đỉnh.
    const segs = centerlineSegments(lWall, [opening('poly', 2500, 1000)]);
    expect(segs).toEqual([
      [
        { x: 0, y: 0 },
        { x: 2500, y: 0 },
      ],
      [
        { x: 3000, y: 500 },
        { x: 3000, y: 4000 },
      ],
    ]);
  });
});
