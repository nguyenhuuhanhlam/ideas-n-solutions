import { afterEach, describe, expect, it, vi } from 'vitest';
import { callGeminiJson, GEMINI_MODEL, GeminiError } from './gemini';

function mockFetchOnce(status: number, body: unknown) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

const okBody = (text: string) => ({
  candidates: [{ content: { parts: [{ text }] }, finishReason: 'STOP' }],
});

const args = {
  apiKey: 'AIza-test-key',
  systemInstruction: 'sys',
  userText: 'user',
};

/** Gọi callGeminiJson và trả lỗi GeminiError (fail test nếu không ném). */
async function callAndCatchError(): Promise<GeminiError> {
  try {
    await callGeminiJson(args);
  } catch (e) {
    return e as GeminiError;
  }
  throw new Error('expected callGeminiJson to throw');
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('callGeminiJson', () => {
  it('thành công: trả text, URL đúng model, key ở header, body có JSON mode + schema', async () => {
    const fetchMock = mockFetchOnce(200, okBody('{"version":1}'));
    const text = await callGeminiJson(args);
    expect(text).toBe('{"version":1}');
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain(`models/${GEMINI_MODEL}:generateContent`);
    expect(url).not.toContain('AIza-test-key');
    expect((init.headers as Record<string, string>)['x-goog-api-key']).toBe('AIza-test-key');
    const body = JSON.parse(init.body as string) as {
      generationConfig: { responseMimeType: string; responseSchema: unknown };
    };
    expect(body.generationConfig.responseMimeType).toBe('application/json');
    expect(body.generationConfig.responseSchema).toBeDefined();
  });

  it('400/401/403 → lỗi key', async () => {
    mockFetchOnce(400, { error: { message: 'API key not valid' } });
    const err = await callAndCatchError();
    expect(err).toBeInstanceOf(GeminiError);
    expect(err.kind).toBe('key');
    expect(err.message).toContain('API key');
  });

  it('429 → lỗi quota', async () => {
    mockFetchOnce(429, { error: { message: 'quota' } });
    const err = await callAndCatchError();
    expect(err.kind).toBe('quota');
    expect(err.message).toContain('Hết lượt');
  });

  it('fetch ném lỗi mạng → lỗi network', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('Failed to fetch')),
    );
    const err = await callAndCatchError();
    expect(err.kind).toBe('network');
  });

  it('không có candidates → lỗi empty; bị chặn → lỗi blocked', async () => {
    mockFetchOnce(200, {});
    const empty = await callAndCatchError();
    expect(empty.kind).toBe('empty');

    mockFetchOnce(200, { promptFeedback: { blockReason: 'SAFETY' } });
    const blocked = await callAndCatchError();
    expect(blocked.kind).toBe('blocked');
  });

  it('MAX_TOKENS → lỗi truncated', async () => {
    mockFetchOnce(200, {
      candidates: [{ content: { parts: [{ text: '{"version":1' }] }, finishReason: 'MAX_TOKENS' }],
    });
    const err = await callAndCatchError();
    expect(err.kind).toBe('truncated');
  });
});
