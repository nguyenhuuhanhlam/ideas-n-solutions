import { describe, expect, it } from 'vitest';
import { doorSwing, mergeBuildingWalls, openingFrame, wallLength } from './geometry';
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

  it('chỉ cửa phòng tắm đảo chiều mở (vào trong phòng tắm)', () => {
    const level = seedBuilding().levels[0];
    const bath = level.openings.find((o) => o.id === 'o-door-bath')!;
    expect(bath.flip).toBe(true);
    for (const o of level.openings) {
      if (o.id !== 'o-door-bath') expect(o.flip ?? false).toBe(false);
    }
  });

  it('vùng cung mở của 3 cửa đi đôi một không giao nhau', () => {
    const level = mergeBuildingWalls(seedBuilding()).levels[0];
    // Bbox vùng cung mở = bao của {bản lề, đầu cánh, đầu cung trên tường}
    // (tường nhà demo đều thẳng trục nên cung phần tư nằm gọn trong hình
    // vuông đó).
    const boxes: Record<string, { x0: number; y0: number; x1: number; y1: number }> = {};
    for (const o of level.openings.filter((x) => x.type === 'door')) {
      const wall = level.walls.find((w) => w.id === o.wallId)!;
      const { hinge, leafEnd } = doorSwing(o, wall);
      const { ux, uy } = openingFrame(o, wall);
      const arcEnd = { x: hinge.x + ux * o.width, y: hinge.y + uy * o.width };
      const xs = [hinge.x, leafEnd.x, arcEnd.x];
      const ys = [hinge.y, leafEnd.y, arcEnd.y];
      boxes[o.id] = { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
    }
    // Cửa sảnh: bản lề (1100,3500), cánh lên bắc tới y=2900.
    expect(boxes['o-door-hall']).toEqual({ x0: 500, y0: 2900, x1: 1100, y1: 3500 });
    // Cửa chính: bản lề (1900,2800), cánh sang đông, cung từ y=2150.
    expect(boxes['o-door-main']).toEqual({ x0: 1900, y0: 2150, x1: 2550, y1: 2800 });
    // Cửa tắm (đã flip): nằm trọn trong phòng tắm, phía bắc tường y=1800.
    expect(boxes['o-door-bath']).toEqual({ x0: 2100, y0: 1250, x1: 2650, y1: 1800 });
    expect(boxes['o-door-bath'].y1).toBeLessThanOrEqual(1800);
    expect(boxes['o-door-main'].y0).toBeGreaterThanOrEqual(2150);
    // Đôi một không giao nhau (chạm mép cũng không tính là giao).
    const ids = Object.keys(boxes);
    const overlap = (a: { x0: number; y0: number; x1: number; y1: number }, b: { x0: number; y0: number; x1: number; y1: number }) =>
      a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        expect(overlap(boxes[ids[i]], boxes[ids[j]]), `${ids[i]} giao ${ids[j]}`).toBe(false);
      }
    }
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
