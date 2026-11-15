import { describe, expect, it } from 'vitest';
import { wallLength } from './geometry';
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
});
