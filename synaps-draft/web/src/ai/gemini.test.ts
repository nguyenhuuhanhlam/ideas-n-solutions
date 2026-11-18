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

/** Mock fetch trả lần lượt từng response (cho test tự thử lại). */
function mockFetchSequence(...responses: [number, unknown][]) {
  const fetchMock = vi.fn();
  for (const [status, body] of responses) {
    fetchMock.mockResolvedValueOnce({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(body),
    });
  }
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

/** Mock fetch treo mãi cho tới khi signal abort (mô phỏng Gemini không trả về). */
const hangingFetch = (_url: unknown, init?: { signal?: AbortSignal }): Promise<never> =>
  new Promise<never>((_resolve, reject) => {
    init?.signal?.addEventListener('abort', () => {
      reject(new DOMException('Aborted', 'AbortError'));
    });
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
      generationConfig: {
        responseMimeType: string;
        responseSchema: unknown;
        thinkingConfig: { thinkingLevel: string };
      };
    };
    expect(body.generationConfig.responseMimeType).toBe('application/json');
    expect(body.generationConfig.responseSchema).toBeDefined();
    expect(body.generationConfig.thinkingConfig.thinkingLevel).toBe('low');
  });

  it('400/401/403 → lỗi key', async () => {
    mockFetchOnce(400, { error: { message: 'API key not valid' } });
    const err = await callAndCatchError();
    expect(err).toBeInstanceOf(GeminiError);
    expect(err.kind).toBe('key');
    expect(err.message).toContain('API key');
  });

  it('400 không liên quan key → lỗi other, hiện lý do thật của Google', async () => {
    mockFetchOnce(400, {
      error: { message: "Invalid value at 'generation_config.response_schema' (TYPE_STRING), 1" },
    });
    const err = await callAndCatchError();
    expect(err.kind).toBe('other');
    expect(err.message).toContain('response_schema');
    expect(err.message).not.toContain('API key không hợp lệ');
  });

  it('403 chưa bật API → lỗi key, hướng dẫn bật', async () => {
    mockFetchOnce(403, {
      error: {
        message:
          'Generative Language API has not been used in project 123 before or it is disabled.',
      },
    });
    const err = await callAndCatchError();
    expect(err.kind).toBe('key');
    expect(err.message).toContain('Chưa bật Gemini API');
  });

  it('403 key bị giới hạn referer → lỗi key, hướng dẫn gỡ giới hạn', async () => {
    mockFetchOnce(403, {
      error: { message: 'Requests from referer https://example.com/ are blocked.' },
    });
    const err = await callAndCatchError();
    expect(err.kind).toBe('key');
    expect(err.message).toContain('bị giới hạn');
  });

  it('429 → lỗi quota', async () => {
    mockFetchOnce(429, { error: { message: 'quota' } });
    const err = await callAndCatchError();
    expect(err.kind).toBe('quota');
    expect(err.message).toContain('Hết lượt');
  });

  it('503 rồi thành công → tự thử lại và trả text', async () => {
    vi.useFakeTimers();
    try {
      const fetchMock = mockFetchSequence(
        [503, { error: { message: 'high demand' } }],
        [200, okBody('{"version":1}')],
      );
      const onHttpRetry = vi.fn();
      const promise = callGeminiJson({ ...args, onHttpRetry });
      await vi.advanceTimersByTimeAsync(3000);
      const text = await promise;
      expect(text).toBe('{"version":1}');
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(onHttpRetry).toHaveBeenCalledTimes(1);
      expect(onHttpRetry).toHaveBeenCalledWith({ attempt: 2, maxAttempts: 3, reason: 'server' });
    } finally {
      vi.useRealTimers();
    }
  });

  it('500 rồi thành công → tự thử lại và trả text', async () => {
    vi.useFakeTimers();
    try {
      const fetchMock = mockFetchSequence(
        [500, { error: { message: 'internal' } }],
        [200, okBody('{"version":1}')],
      );
      const promise = callGeminiJson(args);
      await vi.advanceTimersByTimeAsync(3000);
      await expect(promise).resolves.toBe('{"version":1}');
      expect(fetchMock).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it('503 cả 3 lần → lỗi quá tải, đã gọi đủ 3 lần', async () => {
    vi.useFakeTimers();
    try {
      const fetchMock = mockFetchSequence(
        [503, { error: { message: 'high demand' } }],
        [503, { error: { message: 'high demand' } }],
        [503, { error: { message: 'high demand' } }],
      );
      const promise = callGeminiJson(args);
      promise.catch(() => {}); // tránh unhandled rejection trong lúc chờ fake timers
      await vi.advanceTimersByTimeAsync(8000);
      await expect(promise).rejects.toThrow('quá tải');
      expect(fetchMock).toHaveBeenCalledTimes(3);
    } finally {
      vi.useRealTimers();
    }
  });

  it('timeout rồi thành công → tự thử lại và trả text', async () => {
    vi.useFakeTimers();
    try {
      const fetchMock = vi.fn();
      fetchMock.mockImplementationOnce(hangingFetch);
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(okBody('{"version":1}')),
      });
      vi.stubGlobal('fetch', fetchMock);
      const onHttpRetry = vi.fn();
      const promise = callGeminiJson({ ...args, onHttpRetry });
      await vi.advanceTimersByTimeAsync(100_000);
      const text = await promise;
      expect(text).toBe('{"version":1}');
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(onHttpRetry).toHaveBeenCalledTimes(1);
      expect(onHttpRetry).toHaveBeenCalledWith({ attempt: 2, maxAttempts: 3, reason: 'timeout' });
    } finally {
      vi.useRealTimers();
    }
  });

  it('timeout cả 3 lần → lỗi quá lâu, đã gọi đủ 3 lần', async () => {
    vi.useFakeTimers();
    try {
      const fetchMock = vi.fn().mockImplementation(hangingFetch);
      vi.stubGlobal('fetch', fetchMock);
      const promise = callGeminiJson(args);
      promise.catch(() => {}); // tránh unhandled rejection trong lúc chờ fake timers
      await vi.advanceTimersByTimeAsync(300_000);
      await expect(promise).rejects.toThrow('quá lâu');
      expect(fetchMock).toHaveBeenCalledTimes(3);
    } finally {
      vi.useRealTimers();
    }
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
