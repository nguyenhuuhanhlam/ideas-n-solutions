import { describe, expect, it } from 'vitest';
import { marqueeSelect, type MarqueeRect } from './selection';
import type { Opening, Wall } from './schema';

const wall = (id: string, points: [number, number][]): Wall => ({
  id,
  points: points.map(([x, y]) => ({ x, y })),
  thickness: 200,
});

const opening = (id: string, wallId: string, offset: number, width: number): Opening => ({
  id,
  wallId,
  type: 'door',
  offset,
  width,
  height: 2100,
  sillHeight: 0,
});

const rect = (x0: number, y0: number, x1: number, y1: number): MarqueeRect => ({
  x0,
  y0,
  x1,
  y1,
});

describe('marqueeSelect', () => {
  const h = wall('h', [
    [0, 0],
    [8000, 0],
  ]);
  const v = wall('v', [
    [2000, -2000],
    [2000, 4000],
  ]);
  const far = wall('far', [
    [10000, 10000],
    [12000, 10000],
  ]);

  it('chọn tường có đỉnh nằm trong khung', () => {
    const r = marqueeSelect([h, far], [], rect(7000, -1000, 9000, 1000));
    expect(r.wallIds).toEqual(['h']);
  });

  it('chọn tường cắt mép khung dù không có đỉnh trong khung', () => {
    // Khung cắt ngang tường h (y=0) mà không chứa đầu mút nào của nó.
    const r = marqueeSelect([h, v], [], rect(3000, -500, 5000, 500));
    expect(r.wallIds).toContain('h');
    // Tường v (x=2000) đứng ngoài khung.
    expect(r.wallIds).not.toContain('v');
  });

  it('không chọn tường hoàn toàn ngoài khung', () => {
    const r = marqueeSelect([h, v, far], [], rect(0, 1000, 1000, 2000));
    expect(r.wallIds).toEqual([]);
  });

  it('chọn cửa khi điểm giữa nằm trong khung, bỏ qua khi ngoài', () => {
    const inside = opening('o1', 'h', 3000, 900); // tâm 3450
    const outside = opening('o2', 'h', 6000, 900); // tâm 6450
    const r = marqueeSelect([h], [inside, outside], rect(3000, -500, 4000, 500));
    expect(r.openingIds).toEqual(['o1']);
  });

  it('khung kéo ngược (x0>x1, y0>y1) vẫn chọn đúng', () => {
    const r = marqueeSelect([h], [], rect(9000, 1000, 7000, -1000));
    expect(r.wallIds).toEqual(['h']);
  });

  it('bỏ qua cửa có wallId không tồn tại', () => {
    const orphan = opening('o9', 'missing', 0, 900);
    const r = marqueeSelect([h], [orphan], rect(-1000, -1000, 10000, 10000));
    expect(r.openingIds).toEqual([]);
  });
});
