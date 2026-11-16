import { describe, expect, it } from 'vitest';
import { elevationPointToOpening, projectOpeningToElevation, projectWallToElevation, sortWallsByDepth } from './elevation';
import { seedBuilding } from './seed';
import type { Wall } from './schema';

const level = seedBuilding().levels[0];
const wallById = (id: string) => level.walls.find((w) => w.id === id) as Wall;
const openingById = (id: string) => level.openings.find((o) => o.id === id) as (typeof level.openings)[number];

describe('projectWallToElevation — Left (nhìn từ tây, u = y)', () => {
  it('tường tây dọc Y chiếu rộng bằng độ dài', () => {
    expect(projectWallToElevation(wallById('w-west'), level, 'left')).toMatchObject({
      u0: 0, u1: 6000, vBottom: 0, vTop: 3000, depth: 0,
    });
  });

  it('tường bắc ngang X chiếu rộng bằng bề dày', () => {
    expect(projectWallToElevation(wallById('w-north'), level, 'left')).toMatchObject({
      u0: -100, u1: 100, vBottom: 0, vTop: 3000,
    });
  });

  it('tường nam chiếu ở cuối trục u', () => {
    expect(projectWallToElevation(wallById('w-south'), level, 'left')).toMatchObject({
      u0: 5900, u1: 6100,
    });
  });

  it('tường ngăn giữa chiếu rộng bằng độ dài, depth = tâm X', () => {
    expect(projectWallToElevation(wallById('w-divider'), level, 'left')).toMatchObject({
      u0: 0, u1: 6000, depth: 4000,
    });
  });
});

describe('projectWallToElevation — Right (nhìn từ đông, u = −y)', () => {
  it('tường tây chiếu đảo dấu u', () => {
    expect(projectWallToElevation(wallById('w-west'), level, 'right')).toMatchObject({
      u0: -6000, u1: 0, depth: 0,
    });
  });

  it('tường nam chiếu ở đầu âm trục u', () => {
    expect(projectWallToElevation(wallById('w-south'), level, 'right')).toMatchObject({
      u0: -6100, u1: -5900,
    });
  });

  it('tường có height riêng thì vTop theo height riêng', () => {
    const low: Wall = { id: 'low', points: [{ x: 0, y: 0 }, { x: 0, y: 1000 }], thickness: 200, height: 2500 };
    expect(projectWallToElevation(low, level, 'right')).toMatchObject({
      vBottom: 0, vTop: 2500,
    });
  });

  it('tường xiên chiếu thành hình chữ nhật bao', () => {
    const diag: Wall = { id: 'diag', points: [{ x: 0, y: 0 }, { x: 3000, y: 4000 }], thickness: 200 };
    const r = projectWallToElevation(diag, level, 'left');
    expect(r.u0).toBeLessThanOrEqual(0);
    expect(r.u1).toBeGreaterThanOrEqual(4000);
  });
});

describe('projectOpeningToElevation', () => {
  it('cửa thông phòng trên tường ngăn: đúng vị trí dọc tường + sill 0', () => {
    const r = projectOpeningToElevation(wallById('w-divider'), openingById('o-inner-door'), level, 'left');
    expect(r).toEqual({ u0: 2600, u1: 3400, vBottom: 0, vTop: 2100 });
  });

  it('cửa sổ mặt đông: đúng offset + sill 900', () => {
    const r = projectOpeningToElevation(wallById('w-east'), openingById('o-win-east'), level, 'left');
    expect(r).toEqual({ u0: 2400, u1: 3600, vBottom: 900, vTop: 2100 });
  });

  it('cửa sổ mặt bắc nhìn từ tây: tường ngang nên lỗ rộng bằng bề dày', () => {
    const r = projectOpeningToElevation(wallById('w-north'), openingById('o-win-north'), level, 'left');
    expect(r).toEqual({ u0: -100, u1: 100, vBottom: 900, vTop: 2100 });
  });
});

describe('elevationPointToOpening — chiếu ngược điểm (u, v) thành offset/sill', () => {
  it('left: u tăng → offset tăng, v tăng → sill tăng', () => {
    const r = elevationPointToOpening(
      wallById('w-divider'), openingById('o-inner-door'), level, 'left', 3000, 1000,
    );
    expect(r).toEqual({ offset: 3000, sillHeight: 900 });
  });

  it('right: u giảm → offset tăng (chiều đảo)', () => {
    const r = elevationPointToOpening(
      wallById('w-divider'), openingById('o-inner-door'), level, 'right', -3000, 0,
    );
    expect(r).toEqual({ offset: 3000, sillHeight: 0 });
  });

  it('kẹp offset vào trong tường (không vượt độ dài − width)', () => {
    const r = elevationPointToOpening(
      wallById('w-divider'), openingById('o-inner-door'), level, 'left', 5900, 0,
    );
    expect(r.offset).toBe(5200);
  });

  it('kẹp sill vào [0, chiều cao tường − chiều cao cửa]', () => {
    const high = elevationPointToOpening(
      wallById('w-divider'), openingById('o-inner-door'), level, 'left', 3000, 2500,
    );
    expect(high.sillHeight).toBe(900);
    const low = elevationPointToOpening(
      wallById('w-divider'), openingById('o-inner-door'), level, 'left', 3000, -500,
    );
    expect(low.sillHeight).toBe(0);
  });

  it('tường chiếu thành mép mỏng: offset giữ nguyên, sill vẫn đổi được', () => {
    const r = elevationPointToOpening(
      wallById('w-north'), openingById('o-win-north'), level, 'left', 0, 1200,
    );
    expect(r).toEqual({ offset: 1400, sillHeight: 1200 });
  });
});

describe('sortWallsByDepth', () => {
  it('left: tường đông xa nhất vẽ trước, tường tây gần nhất vẽ sau', () => {
    const ids = sortWallsByDepth(level.walls, level, 'left').map((w) => w.id);
    expect(ids[0]).toBe('w-east');
    expect(ids[ids.length - 1]).toBe('w-west');
  });

  it('right: tường tây xa nhất vẽ trước, tường đông gần nhất vẽ sau', () => {
    const ids = sortWallsByDepth(level.walls, level, 'right').map((w) => w.id);
    expect(ids[0]).toBe('w-west');
    expect(ids[ids.length - 1]).toBe('w-east');
  });
});
