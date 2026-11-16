import { beforeEach, describe, expect, it } from 'vitest';
import type { Building, Opening, Wall } from '../model/schema';
import { useBuildingStore } from './useBuildingStore';

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

/** Building tự tạo inline (không dùng seed): 2 tường + 2 cửa. */
const testBuilding = (): Building => ({
  version: 1,
  levels: [
    {
      id: 'l1',
      name: 'Tầng 1',
      elevation: 0,
      height: 3000,
      walls: [
        wall('w1', [
          [0, 0],
          [8000, 0],
        ]),
        wall('w2', [
          [0, 0],
          [0, 6000],
        ]),
      ],
      openings: [opening('o1', 'w1', 1000, 900), opening('o2', 'w2', 2000, 900)],
    },
  ],
});

const store = () => useBuildingStore.getState();

beforeEach(() => {
  useBuildingStore.setState({
    building: testBuilding(),
    past: [],
    future: [],
    selectedWallIds: [],
    selectedOpeningIds: [],
    draft: null,
  });
});

describe('multi-select — store', () => {
  it('toggleInSelection thêm rồi bớt, tường và cửa độc lập', () => {
    store().toggleInSelection('wall', 'w1');
    expect(store().selectedWallIds).toEqual(['w1']);
    store().toggleInSelection('opening', 'o2');
    expect(store().selectedWallIds).toEqual(['w1']);
    expect(store().selectedOpeningIds).toEqual(['o2']);
    store().toggleInSelection('wall', 'w1');
    expect(store().selectedWallIds).toEqual([]);
    expect(store().selectedOpeningIds).toEqual(['o2']);
  });

  it('selectSingle xóa hết chọn cũ, chỉ giữ 1 vật thể', () => {
    store().setSelection(['w1', 'w2'], ['o1']);
    store().selectSingle('opening', 'o2');
    expect(store().selectedWallIds).toEqual([]);
    expect(store().selectedOpeningIds).toEqual(['o2']);
    store().selectSingle('wall', null);
    expect(store().selectedWallIds).toEqual([]);
    expect(store().selectedOpeningIds).toEqual([]);
  });

  it('setSelection đặt cả 2 danh sách, clearSelection xóa hết', () => {
    store().setSelection(['w1'], ['o2']);
    expect(store().selectedWallIds).toEqual(['w1']);
    expect(store().selectedOpeningIds).toEqual(['o2']);
    store().clearSelection();
    expect(store().selectedWallIds).toEqual([]);
    expect(store().selectedOpeningIds).toEqual([]);
  });

  it('deleteSelection xóa tường + cửa của chúng + cửa chọn riêng trong 1 entry', () => {
    // Chọn w1 (kèm o1 trên nó) + o2 (tường w2 không bị chọn).
    store().setSelection(['w1'], ['o2']);
    store().deleteSelection();
    const level = store().building.levels[0];
    expect(level.walls.map((w) => w.id)).toEqual(['w2']);
    expect(level.openings).toEqual([]);
    expect(store().selectedWallIds).toEqual([]);
    expect(store().selectedOpeningIds).toEqual([]);
    // Đúng 1 history entry: 1 lần undo khôi phục hết.
    expect(store().past.length).toBe(1);
    store().undo();
    const restored = store().building.levels[0];
    expect(restored.walls.map((w) => w.id)).toEqual(['w1', 'w2']);
    expect(restored.openings.map((o) => o.id)).toEqual(['o1', 'o2']);
  });

  it('deleteSelection khi không chọn gì thì không tạo history', () => {
    store().deleteSelection();
    expect(store().past.length).toBe(0);
    expect(store().building.levels[0].walls).toHaveLength(2);
  });
});
