import { describe, expect, it } from 'vitest';
import { clampOffset, clampSill } from './openingDrag';
import type { Opening, Wall } from './schema';

const wall: Wall = { id: 'w', points: [{ x: 0, y: 0 }, { x: 6000, y: 0 }], thickness: 200 };
const mk = (id: string, offset: number, width: number, height = 2100, sillHeight = 0): Opening => ({
  id, wallId: 'w', type: 'door', offset, width, height, sillHeight,
});

describe('clampOffset', () => {
  it('kẹp đầu tường: desired âm → 0', () => {
    expect(clampOffset(wall, [mk('a', 1000, 900)], 'a', -500)).toBe(0);
  });

  it('kẹp cuối tường: desired vượt → độ dài − width', () => {
    expect(clampOffset(wall, [mk('a', 1000, 900)], 'a', 5800)).toBe(5100);
  });

  it('bị chặn bởi opening kề bên phải: dừng sát mép trái của nó', () => {
    const ops = [mk('a', 1000, 900), mk('b', 3000, 900)];
    expect(clampOffset(wall, ops, 'a', 2500)).toBe(2100);
  });

  it('bị chặn bởi opening kề bên trái: dừng sát mép phải của nó', () => {
    const ops = [mk('a', 3000, 900), mk('b', 1000, 900)];
    expect(clampOffset(wall, ops, 'a', 1500)).toBe(1900);
  });

  it('kẹp vào phía gần desired nhất khi bị chặn cả 2 bên', () => {
    const ops = [mk('a', 2500, 900), mk('b', 1000, 900), mk('c', 4000, 900)];
    // Khoảng trống 1900–3100; desired 2900 gần mép phải (3100) hơn mép trái (1900).
    expect(clampOffset(wall, ops, 'a', 2900)).toBe(2900);
    expect(clampOffset(wall, ops, 'a', 2000)).toBe(2000);
  });

  it('không còn chỗ trống thì giữ offset cũ', () => {
    const ops = [mk('a', 0, 3000), mk('b', 3000, 3000)];
    expect(clampOffset(wall, ops, 'a', 2000)).toBe(0);
  });

  it('cửa rộng hơn tường thì giữ offset cũ (không có ứng viên hợp lệ)', () => {
    const ops = [mk('a', 0, 7000), mk('b', 1000, 900)];
    expect(clampOffset(wall, ops, 'a', 500)).toBe(0);
  });
});

describe('clampSill', () => {
  it('kẹp dưới: sill âm → 0', () => {
    expect(clampSill(3000, mk('a', 0, 900), -200)).toBe(0);
  });

  it('kẹp trên: sill vượt → chiều cao tường − chiều cao cửa', () => {
    expect(clampSill(3000, mk('a', 0, 900, 2100), 1500)).toBe(900);
  });

  it('cửa cao bằng tường thì sill luôn 0', () => {
    expect(clampSill(2100, mk('a', 0, 900, 2100), 500)).toBe(0);
  });
});
