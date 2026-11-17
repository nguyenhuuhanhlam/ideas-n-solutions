import { describe, expect, it } from 'vitest';
import {
  FLOORPLAN_SYSTEM_PROMPT,
  buildRepairPrompt,
  buildUserPrompt,
  extractJson,
} from './floorplanPrompt';

describe('extractJson', () => {
  it('JSON thuần giữ nguyên', () => {
    expect(extractJson('{"a":1}')).toBe('{"a":1}');
  });

  it('bóc fence ```json', () => {
    expect(extractJson('```json\n{"a":1}\n```')).toBe('{"a":1}');
  });

  it('cắt text thừa trước/sau JSON', () => {
    expect(extractJson('Here is the plan: {"a":1} hope it helps.')).toBe('{"a":1}');
  });

  it('không có ngoặc → trả nguyên text', () => {
    expect(extractJson('no json here')).toBe('no json here');
  });
});

describe('prompts', () => {
  it('system prompt nhắc các quy tắc cốt lõi', () => {
    expect(FLOORPLAN_SYSTEM_PROMPT).toContain('INTEGER millimetres');
    expect(FLOORPLAN_SYSTEM_PROMPT).toContain('Y points DOWN');
    expect(FLOORPLAN_SYSTEM_PROMPT).toContain('offset + width');
    expect(FLOORPLAN_SYSTEM_PROMPT).toContain('flip');
  });

  it('user prompt chứa mô tả', () => {
    expect(buildUserPrompt('nhà 2 phòng ngủ')).toContain('nhà 2 phòng ngủ');
  });

  it('repair prompt chứa lỗi + JSON cũ', () => {
    const p = buildRepairPrompt('nhà nhỏ', '{"version":1}', ['Cửa o-1 chồng lên cửa khác.']);
    expect(p).toContain('Cửa o-1 chồng lên cửa khác.');
    expect(p).toContain('{"version":1}');
    expect(p).toContain('nhà nhỏ');
  });
});
