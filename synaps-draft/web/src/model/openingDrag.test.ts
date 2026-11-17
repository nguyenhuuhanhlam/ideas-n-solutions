import { describe, expect, it } from 'vitest';
import {
  canPlaceOpening,
  hitboxesOverlap,
  maxWidthWithoutOverlap,
  openingHitbox,
  openingOverlapsOthers,
  resolveDragOffset,
  clampSill,
} from './openingDrag';
import type { Opening, Wall } from './schema';

const wall: Wall = { id: 'w', points: [{ x: 0, y: 0 }, { x: 6000, y: 0 }], thickness: 200 };
const mk = (
  id: string,
  offset: number,
  width: number,
  wallId = 'w',
  height = 2100,
  sillHeight = 0,
): Opening => ({
  id, wallId, type: 'door', offset, width, height, sillHeight,
});

describe('openingHitbox', () => {
  it('tường thẳng: 1 rect đúng 4 đỉnh', () => {
    expect(openingHitbox(mk('a', 1000, 900), wall)).toEqual([
      [
        { x: 1000, y: 100 },
        { x: 1900, y: 100 },
        { x: 1900, y: -100 },
        { x: 1000, y: -100 },
      ],
    ]);
  });

  it('bắc qua đỉnh polyline: 2 rect bám đường gãy', () => {
    const lWall: Wall = {
      id: 'l',
      points: [
        { x: 0, y: 0 },
        { x: 3000, y: 0 },
        { x: 3000, y: 3000 },
      ],
      thickness: 200,
    };
    expect(openingHitbox(mk('a', 2500, 900, 'l'), lWall)).toEqual([
      [
        { x: 2500, y: 100 },
        { x: 3000, y: 100 },
        { x: 3000, y: -100 },
        { x: 2500, y: -100 },
      ],
      [
        { x: 2900, y: 0 },
        { x: 2900, y: 400 },
        { x: 3100, y: 400 },
        { x: 3100, y: 0 },
      ],
    ]);
  });

  it('vượt cuối tường: rect cắt ngắn ở mép tường', () => {
    expect(openingHitbox(mk('a', 5500, 900), wall)).toEqual([
      [
        { x: 5500, y: 100 },
        { x: 6000, y: 100 },
        { x: 6000, y: -100 },
        { x: 5500, y: -100 },
      ],
    ]);
  });

  it('rộng 0 hoặc ngoài tường: hitbox rỗng', () => {
    expect(openingHitbox(mk('a', 1000, 0), wall)).toEqual([]);
    expect(openingHitbox(mk('a', 7000, 900), wall)).toEqual([]);
  });
});

describe('hitboxesOverlap', () => {
  it('chồng nhau → true; chạm mép → false; tách rời → false', () => {
    const a = openingHitbox(mk('a', 1000, 900), wall);
    expect(hitboxesOverlap(a, openingHitbox(mk('b', 1500, 900), wall))).toBe(true);
    expect(hitboxesOverlap(a, openingHitbox(mk('b', 1900, 900), wall))).toBe(false);
    expect(hitboxesOverlap(a, openingHitbox(mk('b', 3000, 900), wall))).toBe(false);
  });

  it('tường xiên: chồng theo offset → true; chạm mép → false', () => {
    const diag: Wall = {
      id: 'd',
      points: [
        { x: 0, y: 0 },
        { x: 3000, y: 4000 },
      ],
      thickness: 200,
    };
    const a = openingHitbox(mk('a', 1000, 900, 'd'), diag);
    expect(hitboxesOverlap(a, openingHitbox(mk('b', 1500, 900, 'd'), diag))).toBe(true);
    expect(hitboxesOverlap(a, openingHitbox(mk('b', 1900, 900, 'd'), diag))).toBe(false);
  });
});

describe('resolveDragOffset', () => {
  it('kẹp đầu tường: desired âm → 0', () => {
    expect(resolveDragOffset([wall], [mk('a', 1000, 900)], 'a', 1000, -500)).toBe(0);
  });

  it('kẹp cuối tường: desired vượt → độ dài − width', () => {
    expect(resolveDragOffset([wall], [mk('a', 1000, 900)], 'a', 1000, 5800)).toBe(5100);
  });

  it('bị chặn bởi opening kề bên phải: dừng sát mép trái của nó', () => {
    const ops = [mk('a', 1000, 900), mk('b', 3000, 900)];
    expect(resolveDragOffset([wall], ops, 'a', 1000, 2500)).toBe(2100);
  });

  it('bị chặn bởi opening kề bên trái: dừng sát mép phải của nó', () => {
    const ops = [mk('a', 3000, 900), mk('b', 1000, 900)];
    expect(resolveDragOffset([wall], ops, 'a', 3000, 1500)).toBe(1900);
  });

  it('KHÔNG teleport qua vật cản bên phải: kéo xa vẫn dừng ở mép trái', () => {
    const ops = [mk('a', 1000, 900), mk('b', 3000, 900)];
    // Cách cũ (ứng viên gần nhất) trả 3900 ở desired 3100 — xuyên qua 'b'.
    expect(resolveDragOffset([wall], ops, 'a', 1000, 3100)).toBe(2100);
    expect(resolveDragOffset([wall], ops, 'a', 1000, 5000)).toBe(2100);
  });

  it('KHÔNG teleport qua vật cản bên trái: kéo xa vẫn dừng ở mép phải', () => {
    const ops = [mk('a', 3000, 900), mk('b', 1000, 900)];
    expect(resolveDragOffset([wall], ops, 'a', 3000, 500)).toBe(1900);
    expect(resolveDragOffset([wall], ops, 'a', 3000, 0)).toBe(1900);
  });

  it('trong khe giữa 2 opening: đi tự do trong khe, dừng ở 2 mép', () => {
    const ops = [mk('a', 2500, 900), mk('b', 1000, 900), mk('c', 4000, 900)];
    expect(resolveDragOffset([wall], ops, 'a', 2500, 2900)).toBe(2900);
    expect(resolveDragOffset([wall], ops, 'a', 2500, 3500)).toBe(3100);
    expect(resolveDragOffset([wall], ops, 'a', 2500, 1500)).toBe(1900);
  });

  it('không còn chỗ trống thì giữ offset cũ', () => {
    const ops = [mk('a', 0, 3000), mk('b', 3000, 3000)];
    expect(resolveDragOffset([wall], ops, 'a', 0, 2000)).toBe(0);
  });

  it('cửa rộng hơn tường thì giữ offset cũ', () => {
    const ops = [mk('a', 0, 7000), mk('b', 1000, 900)];
    expect(resolveDragOffset([wall], ops, 'a', 0, 500)).toBe(0);
  });

  it('tường khác: dừng trước hitbox cửa ở góc vuông', () => {
    const wallA: Wall = { id: 'wa', points: [{ x: 0, y: 0 }, { x: 4000, y: 0 }], thickness: 200 };
    const wallB: Wall = { id: 'wb', points: [{ x: 0, y: 0 }, { x: 0, y: 4000 }], thickness: 200 };
    const ops = [mk('a', 2000, 900, 'wa'), mk('b', 0, 900, 'wb')];
    // Cửa 'b' chiếm x ∈ [−100, 100]; cửa 'a' kéo trái dừng khi chạm x = 100.
    expect(resolveDragOffset([wallA, wallB], ops, 'a', 2000, 0)).toBe(100);
    expect(resolveDragOffset([wallA, wallB], ops, 'a', 2000, 500)).toBe(500);
  });

  it('bắc qua đỉnh polyline: dừng đúng mép cửa trên đoạn sau', () => {
    const lWall: Wall = {
      id: 'l',
      points: [
        { x: 0, y: 0 },
        { x: 3000, y: 0 },
        { x: 3000, y: 3000 },
      ],
      thickness: 200,
    };
    const ops = [mk('a', 2500, 900, 'l'), mk('b', 4000, 900, 'l')];
    expect(resolveDragOffset([lWall], ops, 'a', 2500, 3500)).toBe(3100);
  });

  it('vị trí hiện tại đã chồng (file sai): thoát ra chỗ hợp lệ gần desired nhất', () => {
    const ops = [mk('a', 1500, 900), mk('b', 2000, 900)];
    expect(resolveDragOffset([wall], ops, 'a', 1500, 4000)).toBe(4000);
    expect(resolveDragOffset([wall], ops, 'a', 1500, 2500)).toBe(2900);
  });
});

describe('openingOverlapsOthers / canPlaceOpening', () => {
  it('chồng cùng tường → không đặt được; chạm mép → đặt được', () => {
    const ops = [mk('a', 1000, 900)];
    expect(canPlaceOpening([wall], ops, mk('b', 1500, 900))).toBe(false);
    expect(canPlaceOpening([wall], ops, mk('b', 1900, 900))).toBe(true);
    expect(openingOverlapsOthers([wall], ops, mk('b', 1500, 900))).toBe(true);
    expect(openingOverlapsOthers([wall], ops, mk('b', 1900, 900))).toBe(false);
  });

  it('vượt biên tường → không đặt được', () => {
    expect(canPlaceOpening([wall], [], mk('b', 5200, 900))).toBe(false);
    expect(canPlaceOpening([wall], [], mk('b', 5100, 900))).toBe(true);
  });

  it('chồng với cửa tường khác → không đặt được', () => {
    const wallA: Wall = { id: 'wa', points: [{ x: 0, y: 0 }, { x: 4000, y: 0 }], thickness: 200 };
    const wallB: Wall = { id: 'wb', points: [{ x: 0, y: 0 }, { x: 0, y: 4000 }], thickness: 200 };
    const ops = [mk('b', 0, 900, 'wb')];
    expect(canPlaceOpening([wallA, wallB], ops, mk('a', 0, 900, 'wa'))).toBe(false);
    expect(canPlaceOpening([wallA, wallB], ops, mk('a', 100, 900, 'wa'))).toBe(true);
  });
});

describe('maxWidthWithoutOverlap', () => {
  it('bị giới hạn bởi cửa kề bên phải', () => {
    const ops = [mk('a', 1000, 900), mk('b', 3000, 900)];
    expect(maxWidthWithoutOverlap([wall], ops, ops[0], 2500)).toBe(2000);
  });

  it('không có vật cản → giữ nguyên desired', () => {
    const ops = [mk('a', 1000, 900)];
    expect(maxWidthWithoutOverlap([wall], ops, ops[0], 2500)).toBe(2500);
  });
});

describe('clampSill', () => {
  it('kẹp dưới: sill âm → 0', () => {
    expect(clampSill(3000, mk('a', 0, 900), -200)).toBe(0);
  });

  it('kẹp trên: sill vượt → chiều cao tường − chiều cao cửa', () => {
    expect(clampSill(3000, mk('a', 0, 900, 'w', 2100), 1500)).toBe(900);
  });

  it('cửa cao bằng tường thì sill luôn 0', () => {
    expect(clampSill(2100, mk('a', 0, 900, 'w', 2100), 500)).toBe(0);
  });
});
