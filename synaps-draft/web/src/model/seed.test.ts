import { describe, expect, it } from 'vitest';
import { mergeBuildingWalls, wallLength } from './geometry';
import { seedBuilding } from './seed';

describe('seedBuilding', () => {
  it('mọi opening nằm gọn trong tường của nó', () => {
    const level = seedBuilding().levels[0];
    expect(level.openings.length).toBeGreaterThan(0);
    for (const o of level.openings) {
      const wall = level.walls.find((w) => w.id === o.wallId);
      expect(wall, `opening ${o.id} trỏ tới tường không tồn tại`).toBeDefined();
      if (!wall) continue;
      expect(o.offset).toBeGreaterThanOrEqual(0);
      expect(o.offset + o.width).toBeLessThanOrEqual(wallLength(wall));
    }
  });

  it('có 1 cửa chính, 1 cửa thông phòng, 2 cửa sổ', () => {
    const level = seedBuilding().levels[0];
    const doors = level.openings.filter((o) => o.type === 'door');
    const windows = level.openings.filter((o) => o.type === 'window');
    expect(doors).toHaveLength(2);
    expect(windows).toHaveLength(2);
    expect(doors.map((d) => d.width).sort()).toEqual([800, 900]);
    expect(windows.every((w) => w.width === 1200)).toBe(true);
  });

  it('sau khi gộp trùng đầu mút: 2 tường (vòng ngoài khép kín + vách ngăn)', () => {
    const level = mergeBuildingWalls(seedBuilding()).levels[0];
    expect(level.walls).toHaveLength(2);
    const ring = level.walls.find((w) => w.id === 'w-north')!;
    expect(ring.points).toEqual([
      { x: 0, y: 0 },
      { x: 8000, y: 0 },
      { x: 8000, y: 6000 },
      { x: 0, y: 6000 },
      { x: 0, y: 0 },
    ]);
    expect(ring.points[0]).toEqual(ring.points[4]);
    const divider = level.walls.find((w) => w.id === 'w-divider')!;
    expect(divider.points).toEqual([
      { x: 4000, y: 0 },
      { x: 4000, y: 6000 },
    ]);
    // Opening dời offset theo chuỗi gộp, vẫn nằm gọn trong tường.
    const winEast = level.openings.find((o) => o.id === 'o-win-east')!;
    expect(winEast.wallId).toBe('w-north');
    expect(winEast.offset).toBe(10400);
    const mainDoor = level.openings.find((o) => o.id === 'o-main-door')!;
    expect(mainDoor.wallId).toBe('w-north');
    expect(mainDoor.offset).toBe(17550);
    for (const o of level.openings) {
      const wall = level.walls.find((w) => w.id === o.wallId);
      expect(wall, `opening ${o.id} trỏ tới tường không tồn tại`).toBeDefined();
      if (!wall) continue;
      expect(o.offset + o.width).toBeLessThanOrEqual(wallLength(wall));
    }
  });
});
