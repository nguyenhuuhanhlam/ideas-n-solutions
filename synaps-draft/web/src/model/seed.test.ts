import { describe, expect, it } from 'vitest';
import { mergeBuildingWalls, wallLength } from './geometry';
import { seedBuilding } from './seed';

describe('seedBuilding', () => {
  it('9 tường + 7 openings, mọi opening nằm gọn trong tường của nó', () => {
    const level = seedBuilding().levels[0];
    expect(level.walls).toHaveLength(9);
    expect(level.openings).toHaveLength(7);
    for (const o of level.openings) {
      const wall = level.walls.find((w) => w.id === o.wallId);
      expect(wall, `opening ${o.id} trỏ tới tường không tồn tại`).toBeDefined();
      if (!wall) continue;
      expect(o.offset).toBeGreaterThanOrEqual(0);
      expect(o.offset + o.width).toBeLessThanOrEqual(wallLength(wall));
    }
  });

  it('có 3 cửa đi, 4 cửa sổ', () => {
    const level = seedBuilding().levels[0];
    const doors = level.openings.filter((o) => o.type === 'door');
    const windows = level.openings.filter((o) => o.type === 'window');
    expect(doors).toHaveLength(3);
    expect(windows).toHaveLength(4);
    expect(doors.map((d) => d.width).sort((a, b) => a - b)).toEqual([550, 600, 650]);
    expect(windows.map((w) => w.width).sort((a, b) => a - b)).toEqual([550, 650, 1050, 1150]);
  });

  it('lối đi giữa 2 đoạn tường phòng ngủ rộng 2100mm, để trống', () => {
    const level = seedBuilding().levels[0];
    const west = level.walls.find((w) => w.id === 'w-bed-west')!;
    const east = level.walls.find((w) => w.id === 'w-bed-east')!;
    expect(west.points[1]).toEqual({ x: 2750, y: 5150 });
    expect(east.points[0]).toEqual({ x: 4850, y: 5150 });
    expect(east.points[0].x - west.points[1].x).toBe(2100);
    expect(level.openings.some((o) => o.wallId === 'w-bed-west' || o.wallId === 'w-bed-east')).toBe(false);
  });

  it('sau khi gộp trùng đầu mút: 4 tường (1 chuỗi 7 điểm + 3 vách)', () => {
    const level = mergeBuildingWalls(seedBuilding()).levels[0];
    expect(level.walls).toHaveLength(4);
    // Thứ tự gộp (tường trước trong mảng giữ id; gộp ở đầu thì prepend):
    // north+east+south, rồi west đảo chiều prepend, hall-south đảo chiều
    // prepend, cuối cùng vertical nối vào cuối. Bath/bed chỉ gặp ở đỉnh
    // giữa (nối chữ T) nên không gộp.
    const chain = level.walls.find((w) => w.id === 'w-north')!;
    expect(chain.points).toEqual([
      { x: 1900, y: 3500 },
      { x: 100, y: 3500 },
      { x: 100, y: 100 },
      { x: 5500, y: 100 },
      { x: 5500, y: 7800 },
      { x: 1900, y: 7800 },
      { x: 1900, y: 100 },
    ]);
    expect(wallLength(chain)).toBe(29600);
    const bath = level.walls.find((w) => w.id === 'w-bath-south')!;
    expect(bath.points).toEqual([
      { x: 1900, y: 1800 },
      { x: 5500, y: 1800 },
    ]);
    expect(level.walls.find((w) => w.id === 'w-bed-west')!.points).toEqual([
      { x: 1900, y: 5150 },
      { x: 2750, y: 5150 },
    ]);
    expect(level.walls.find((w) => w.id === 'w-bed-east')!.points).toEqual([
      { x: 4850, y: 5150 },
      { x: 5500, y: 5150 },
    ]);
    // Offset sau remap (trace theo luật merge — tường đảo chiều thì
    // offset = len − offset − width, tường prepend dịch +chiều dài):
    // door-hall: 1800−400−600 = 800.
    // win-west: (3400−1250−1150) + 1800 = 2800.
    // win-north: 3600 + 3400 + 1800 = 8800.
    // win-east: 5400+3900 = 9300, +3400, +1800 = 14500.
    // win-south: 13100+800 = 13900, +3400, +1800 = 19100.
    // door-main: 21900 + 5000 = 26900 (nối cuối chuỗi, không đảo).
    const expected: Record<string, { wallId: string; offset: number }> = {
      'o-door-hall': { wallId: 'w-north', offset: 800 },
      'o-win-west': { wallId: 'w-north', offset: 2800 },
      'o-win-north': { wallId: 'w-north', offset: 8800 },
      'o-win-east': { wallId: 'w-north', offset: 14500 },
      'o-win-south': { wallId: 'w-north', offset: 19100 },
      'o-door-main': { wallId: 'w-north', offset: 26900 },
      'o-door-bath': { wallId: 'w-bath-south', offset: 200 },
    };
    for (const [id, e] of Object.entries(expected)) {
      const o = level.openings.find((x) => x.id === id)!;
      expect(o.wallId).toBe(e.wallId);
      expect(o.offset).toBe(e.offset);
    }
    for (const o of level.openings) {
      const wall = level.walls.find((w) => w.id === o.wallId);
      expect(wall, `opening ${o.id} trỏ tới tường không tồn tại`).toBeDefined();
      if (!wall) continue;
      expect(o.offset + o.width).toBeLessThanOrEqual(wallLength(wall));
    }
  });
});
