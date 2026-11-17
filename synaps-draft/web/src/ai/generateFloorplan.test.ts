import { describe, expect, it, vi } from 'vitest';
import { parseBuildingJson } from '../export/jsonFile';
import { generateFloorplan, MAX_ATTEMPTS } from './generateFloorplan';
import { GeminiError, type GeminiCall } from './gemini';
import { extractJson, FLOORPLAN_SYSTEM_PROMPT } from './floorplanPrompt';

/** JSON ví dụ hợp lệ trong system prompt. */
const EXAMPLE_JSON = extractJson(FLOORPLAN_SYSTEM_PROMPT);

/** JSON có 2 cửa chồng nhau (đạo từ ví dụ). */
function overlappingJson(): string {
  const b = parseBuildingJson(EXAMPLE_JSON);
  b.levels[0].openings.push({
    id: 'o-clash',
    wallId: 'w-outer',
    type: 'door',
    offset: 12000,
    width: 800,
    height: 2100,
    sillHeight: 0,
  });
  return JSON.stringify(b);
}

describe('generateFloorplan', () => {
  it('thành công ngay lần 1', async () => {
    const call: GeminiCall = vi.fn().mockResolvedValue(EXAMPLE_JSON);
    const result = await generateFloorplan({
      apiKey: 'k',
      description: 'nhà nhỏ',
      callGemini: call,
    });
    expect(result.attempts).toBe(1);
    expect(result.summary).toEqual({
      wallCount: 2,
      doorCount: 2,
      windowCount: 2,
      widthMm: 6000,
      heightMm: 4000,
    });
  });

  it('JSON hỏng lần 1 → sửa lại lần 2, prompt sửa chứa lỗi', async () => {
    const call = vi
      .fn()
      .mockResolvedValueOnce('not json at all')
      .mockResolvedValueOnce(EXAMPLE_JSON);
    const onAttempt = vi.fn();
    const result = await generateFloorplan({
      apiKey: 'k',
      description: 'nhà nhỏ',
      onAttempt,
      callGemini: call,
    });
    expect(result.attempts).toBe(2);
    expect(onAttempt).toHaveBeenCalledWith(1);
    expect(onAttempt).toHaveBeenCalledWith(2);
    const secondUserText = (call.mock.calls[1][0] as { userText: string }).userText;
    expect(secondUserText).toContain('JSON hợp lệ');
  });

  it('lỗi hình học cả 3 lần → ném lỗi sau 3 lượt', async () => {
    const call: GeminiCall = vi.fn().mockResolvedValue(overlappingJson());
    let err: Error | null = null;
    try {
      await generateFloorplan({ apiKey: 'k', description: 'nhà nhỏ', callGemini: call });
    } catch (e) {
      err = e as Error;
    }
    expect(call).toHaveBeenCalledTimes(MAX_ATTEMPTS);
    expect(err).not.toBeNull();
    expect(err?.message).toContain('3 lần thử');
    expect(err?.message).toContain('chồng');
  });

  it('lỗi API (key) → ném ngay, không sửa lại', async () => {
    const call: GeminiCall = vi
      .fn()
      .mockRejectedValue(new GeminiError('key', 'API key không hợp lệ.'));
    let err: Error | null = null;
    try {
      await generateFloorplan({ apiKey: 'k', description: 'nhà nhỏ', callGemini: call });
    } catch (e) {
      err = e as Error;
    }
    expect(call).toHaveBeenCalledTimes(1);
    expect(err).not.toBeNull();
    expect(err?.message).toContain('API key');
  });
});
