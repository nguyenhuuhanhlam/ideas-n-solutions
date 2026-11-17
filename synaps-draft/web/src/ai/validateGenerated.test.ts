import { describe, expect, it } from 'vitest';
import { parseBuildingJson } from '../export/jsonFile';
import type { Building } from '../model/schema';
import { extractJson, FLOORPLAN_SYSTEM_PROMPT } from './floorplanPrompt';
import { summarizeBuilding, validateGeneratedBuilding } from './validateGenerated';

/** Mặt bằng ví dụ trong system prompt — test này bắt lỗi nếu ví dụ bị sửa hỏng. */
function exampleBuilding(): Building {
  return parseBuildingJson(extractJson(FLOORPLAN_SYSTEM_PROMPT));
}

describe('validateGeneratedBuilding', () => {
  it('ví dụ trong system prompt hợp lệ', () => {
    expect(validateGeneratedBuilding(exampleBuilding())).toEqual([]);
  });

  it('2 cửa chồng nhau trên cùng tường → lỗi', () => {
    const b = exampleBuilding();
    b.levels[0].openings.push({
      id: 'o-clash',
      wallId: 'w-outer',
      type: 'door',
      offset: 12000,
      width: 800,
      height: 2100,
      sillHeight: 0,
    });
    const errors = validateGeneratedBuilding(b);
    expect(errors.some((e) => e.includes('o-clash') && e.includes('chồng'))).toBe(true);
  });

  it('cửa tràn khỏi tường → lỗi', () => {
    const b = exampleBuilding();
    b.levels[0].openings.push({
      id: 'o-past-end',
      wallId: 'w-part',
      type: 'window',
      offset: 3500,
      width: 1000,
      height: 1200,
      sillHeight: 900,
    });
    const errors = validateGeneratedBuilding(b);
    expect(errors.some((e) => e.includes('o-past-end') && e.includes('tràn'))).toBe(true);
  });

  it('cửa trỏ tới tường không tồn tại → lỗi', () => {
    const b = exampleBuilding();
    b.levels[0].openings.push({
      id: 'o-ghost',
      wallId: 'w-missing',
      type: 'door',
      offset: 0,
      width: 900,
      height: 2100,
      sillHeight: 0,
    });
    const errors = validateGeneratedBuilding(b);
    expect(errors.some((e) => e.includes('o-ghost'))).toBe(true);
  });

  it('trùng id tường → lỗi', () => {
    const b = exampleBuilding();
    b.levels[0].walls.push({ ...b.levels[0].walls[0] });
    expect(validateGeneratedBuilding(b).some((e) => e.includes('Trùng id tường'))).toBe(true);
  });

  it('2 tầng → lỗi', () => {
    const b = exampleBuilding();
    b.levels.push({ ...b.levels[0], id: 'l2' });
    expect(validateGeneratedBuilding(b).some((e) => e.includes('1 tầng'))).toBe(true);
  });

  it('không có cửa đi → lỗi', () => {
    const b = exampleBuilding();
    b.levels[0].openings = b.levels[0].openings.filter((o) => o.type === 'window');
    expect(validateGeneratedBuilding(b).some((e) => e.includes('cửa đi'))).toBe(true);
  });
});

describe('summarizeBuilding', () => {
  it('ví dụ: 6000×4000, 2 tường, 2 cửa đi, 2 cửa sổ', () => {
    const s = summarizeBuilding(exampleBuilding());
    expect(s).toEqual({
      wallCount: 2,
      doorCount: 2,
      windowCount: 2,
      widthMm: 6000,
      heightMm: 4000,
    });
  });
});
