import { describe, expect, it } from 'vitest';
import { migrateBuilding } from './schema';

const level = (walls: unknown[]) => ({
  id: 'level-1',
  name: 'Tầng 1',
  elevation: 0,
  height: 3000,
  walls,
  openings: [],
});

describe('migrateBuilding', () => {
  it('tường cũ {start, end} → {points: [start, end]}', () => {
    const b = migrateBuilding({
      version: 1,
      levels: [
        level([
          { id: 'w1', start: { x: 0, y: 0 }, end: { x: 4000, y: 0 }, thickness: 200 },
        ]),
      ],
    });
    expect(b.levels[0].walls[0].points).toEqual([
      { x: 0, y: 0 },
      { x: 4000, y: 0 },
    ]);
  });

  it('dữ liệu mới {points} đi qua nguyên vẹn', () => {
    const b = migrateBuilding({
      version: 1,
      levels: [
        level([
          {
            id: 'w1',
            points: [
              { x: 0, y: 0 },
              { x: 3000, y: 0 },
              { x: 3000, y: 4000 },
            ],
            thickness: 200,
          },
        ]),
      ],
    });
    expect(b.levels[0].walls[0].points).toHaveLength(3);
  });

  it('dữ liệu sai vẫn bị từ chối', () => {
    // version khác 1.
    expect(() => migrateBuilding({ version: 2, levels: [] })).toThrow();
    // points ít hơn 2 điểm.
    expect(() =>
      migrateBuilding({
        version: 1,
        levels: [level([{ id: 'w1', points: [{ x: 0, y: 0 }], thickness: 200 }])],
      }),
    ).toThrow();
    // Không phải object.
    expect(() => migrateBuilding(null)).toThrow();
    expect(() => migrateBuilding('chuỗi')).toThrow();
  });

  it('file không có levels vẫn bị từ chối', () => {
    expect(() => migrateBuilding({ version: 1 })).toThrow();
  });
});
