/**
 * Gọi Gemini API trực tiếp từ trình duyệt (app là trang tĩnh, không có
 * backend). Key của user lưu ở localStorage, chỉ gửi tới Google.
 * Mô hình: gemini-3.8-flash — bản Flash ổn định hiện tại, có gói miễn
 * phí (gemini-2.5-flash đã ngừng với user mới; Google trả 404 khi gọi).
 * Endpoint REST: POST /v1beta/models/{model}:generateContent,
 * xác thực bằng header `x-goog-api-key` (không để key trong URL).
 * Trả JSON có cấu trúc: responseMimeType + responseSchema ép model
 * trả đúng khung Building (không cần bóc markdown fence, nhưng phía
 * trên vẫn bóc phòng hờ).
 */

/** Mô hình Gemini dùng cho tạo mặt bằng (đổi 1 chỗ này là đổi cả app). */
export const GEMINI_MODEL = 'gemini-3.8-flash';

/** Key localStorage lưu API key Gemini của user. */
export const GEMINI_KEY_STORAGE_KEY = 'synaps-draft-gemini-key';

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/** Lỗi gọi Gemini, đã dịch sang tiếng Việt để hiện thẳng cho user. */
export class GeminiError extends Error {
  readonly kind:
    | 'key'
    | 'quota'
    | 'network'
    | 'blocked'
    | 'truncated'
    | 'empty'
    | 'other';

  constructor(kind: GeminiError['kind'], message: string) {
    super(message);
    this.name = 'GeminiError';
    this.kind = kind;
  }
}

/** Khung JSON Building theo subset OpenAPI Schema mà Gemini chấp nhận
 * (không có additionalProperties; chỉ type/properties/required/items/enum). */
export const BUILDING_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    // Lưu ý: enum của Gemini chỉ nhận giá trị chuỗi — version: 1 được
    // ép bằng Zod ở phía kiểm tra (kèm vòng sửa lỗi), không ép bằng enum.
    version: { type: 'integer' },
    levels: {
      type: 'array',
      minItems: 1,
      maxItems: 1,
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          elevation: { type: 'integer' },
          height: { type: 'integer' },
          walls: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                points: {
                  type: 'array',
                  minItems: 2,
                  items: {
                    type: 'object',
                    properties: {
                      x: { type: 'integer' },
                      y: { type: 'integer' },
                    },
                    required: ['x', 'y'],
                  },
                },
                thickness: { type: 'integer' },
                height: { type: 'integer' },
              },
              required: ['id', 'points', 'thickness'],
            },
          },
          openings: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                wallId: { type: 'string' },
                type: { type: 'string', enum: ['door', 'window'] },
                offset: { type: 'integer' },
                width: { type: 'integer' },
                height: { type: 'integer' },
                sillHeight: { type: 'integer' },
                flip: { type: 'boolean' },
              },
              required: ['id', 'wallId', 'type', 'offset', 'width', 'height', 'sillHeight'],
            },
          },
        },
        required: ['id', 'name', 'elevation', 'height', 'walls', 'openings'],
      },
    },
  },
  required: ['version', 'levels'],
} as const;

/** Thông tin khi tự thử lại một lần gọi HTTP (để UI hiện cho user biết). */
export interface HttpRetryInfo {
  /** Lần thử lại thứ mấy (2, 3…). */
  attempt: number;
  maxAttempts: number;
  reason: 'timeout' | 'server';
}

export interface GeminiCallArgs {
  apiKey: string;
  systemInstruction: string;
  userText: string;
  signal?: AbortSignal;
  /** Bắn trước mỗi lần tự thử lại (lỗi 500/503 hoặc hết timeout). */
  onHttpRetry?: (info: HttpRetryInfo) => void;
}

/** Kiểu hàm gọi Gemini — bản thật là callGeminiJson; test chích bản giả. */
export type GeminiCall = (args: GeminiCallArgs) => Promise<string>;

interface GeminiResponse {
  candidates?: {
    content?: { parts?: { text?: string }[] };
    finishReason?: string;
  }[];
  promptFeedback?: { blockReason?: string };
  error?: { message?: string };
}

function errorFromStatus(status: number, detail: string): GeminiError {
  // Google trả kèm lý do thật trong detail — đừng gộp mọi 400/401/403
  // thành "key sai": lỗi 400 có thể do nội dung yêu cầu, không phải key.
  const lower = detail.toLowerCase();
  const shortDetail = detail.length > 300 ? `${detail.slice(0, 300)}…` : detail;
  if (status === 400 || status === 401 || status === 403) {
    if (
      lower.includes('api key not valid') ||
      lower.includes('api_key_invalid') ||
      lower.includes('api key not found')
    ) {
      return new GeminiError(
        'key',
        'API key không hợp lệ. Kiểm tra lại key đã copy đúng chưa ở Google AI Studio (key Gemini bắt đầu bằng "AIza", không thừa khoảng trắng).',
      );
    }
    if (lower.includes('has not been used in project') || lower.includes('is disabled')) {
      return new GeminiError(
        'key',
        `Chưa bật Gemini API cho project của key này. Bật ở Google Cloud Console rồi thử lại.${shortDetail ? ` (Google trả về: ${shortDetail})` : ''}`,
      );
    }
    if (lower.includes('blocked') || lower.includes('referer')) {
      return new GeminiError(
        'key',
        `Key này bị giới hạn (theo trang web hoặc IP) nên trình duyệt không gọi được. Vào Google Cloud Console → Credentials, gỡ giới hạn của key rồi thử lại.${shortDetail ? ` (Google trả về: ${shortDetail})` : ''}`,
      );
    }
    if (status === 400 && shortDetail) {
      // 400 không liên quan key: thường là nội dung yêu cầu bị từ chối.
      return new GeminiError('other', `Gemini từ chối yêu cầu: ${shortDetail}`);
    }
    return new GeminiError(
      'key',
      `API key không hợp lệ hoặc chưa bật Gemini API. Kiểm tra lại key ở Google AI Studio.${shortDetail ? ` (Google trả về: ${shortDetail})` : ''}`,
    );
  }
  if (status === 429) {
    return new GeminiError(
      'quota',
      'Hết lượt miễn phí của Gemini (giới hạn theo phút/ngày). Đợi một lúc rồi thử lại.',
    );
  }
  if (status === 503) {
    return new GeminiError(
      'other',
      'Gemini đang quá tải (quá nhiều người dùng cùng lúc, thường chỉ tạm thời). Đợi một lúc rồi bấm Thử lại.',
    );
  }
  return new GeminiError(
    'other',
    `Gemini trả lỗi HTTP ${status}${detail ? `: ${detail}` : ''}.`,
  );
}

/** Thông báo khi hết timeout cả 3 lần gọi (dùng chung 2 chỗ). */
const TIMEOUT_ERROR_MESSAGE =
  'Gemini phản hồi quá lâu (quá 90 giây mỗi lần gọi). Thử lại sau một lúc.';

/** Đợi ms, hủy ngay nếu signal abort (để nút Hủy dừng cả lúc chờ thử lại). */
function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }
    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

/** Gọi Gemini, trả về text JSON thô (chưa parse). Ném GeminiError đã dịch.
 * Lỗi 500/503 (server Google quá tải/lỗi tạm thời) tự thử lại tối đa 3 lần,
 * chờ 2s rồi 5s — người dùng không phải bấm Thử lại tay. Mỗi lần gọi có
 * timeout riêng 90s để không treo vô hạn: hết timeout cũng được thử lại
 * như lỗi 503. thinkingLevel 'low' để model suy nghĩ ít nhất (mặc định
 * của 3.8 Flash là 'medium') — mặt bằng vẫn được kiểm tra + sửa lỗi sau đó. */
export async function callGeminiJson({
  apiKey,
  systemInstruction,
  userText,
  signal,
  onHttpRetry,
}: GeminiCallArgs): Promise<string> {
  const RETRY_DELAYS_MS = [2000, 5000];
  const TIMEOUT_MS = 90_000;
  const MAX_HTTP_ATTEMPTS = RETRY_DELAYS_MS.length + 1;
  for (let attempt = 0; ; attempt++) {
    // Controller riêng cho lần gọi này: hủy khi user bấm Hủy hoặc hết timeout.
    const controller = new AbortController();
    const onUserAbort = () => controller.abort();
    signal?.addEventListener('abort', onUserAbort, { once: true });
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    let res: Response;
    try {
      res = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [{ role: 'user', parts: [{ text: userText }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 8192,
            responseMimeType: 'application/json',
            responseSchema: BUILDING_RESPONSE_SCHEMA,
            thinkingConfig: { thinkingLevel: 'low' },
          },
        }),
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timer);
      signal?.removeEventListener('abort', onUserAbort);
      // User bấm Hủy: ném AbortError gốc để dialog quay về form.
      if (signal?.aborted) throw err;
      if (err instanceof DOMException && err.name === 'AbortError') {
        // Hết timeout (không phải user hủy): lỗi tạm thời, thử lại như 503.
        if (attempt < RETRY_DELAYS_MS.length) {
          onHttpRetry?.({ attempt: attempt + 2, maxAttempts: MAX_HTTP_ATTEMPTS, reason: 'timeout' });
          await sleep(RETRY_DELAYS_MS[attempt], signal);
          continue;
        }
        throw new GeminiError('other', TIMEOUT_ERROR_MESSAGE);
      }
      throw new GeminiError(
        'network',
        'Không kết nối được tới Gemini. Kiểm tra mạng rồi thử lại.',
      );
    }
    // Timeout vẫn chạy trong lúc đọc body (body kẹt thì cũng phải hủy).
    let data: GeminiResponse;
    try {
      data = (await res.json()) as GeminiResponse;
    } catch {
      data = {};
    }
    clearTimeout(timer);
    signal?.removeEventListener('abort', onUserAbort);
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    if (controller.signal.aborted) {
      // Hết timeout trong lúc đọc body: thử lại như lỗi tạm thời.
      if (attempt < RETRY_DELAYS_MS.length) {
        onHttpRetry?.({ attempt: attempt + 2, maxAttempts: MAX_HTTP_ATTEMPTS, reason: 'timeout' });
        await sleep(RETRY_DELAYS_MS[attempt], signal);
        continue;
      }
      throw new GeminiError('other', TIMEOUT_ERROR_MESSAGE);
    }
    if (!res.ok) {
      const retryable = res.status === 500 || res.status === 503;
      if (retryable && attempt < RETRY_DELAYS_MS.length) {
        onHttpRetry?.({ attempt: attempt + 2, maxAttempts: MAX_HTTP_ATTEMPTS, reason: 'server' });
        await sleep(RETRY_DELAYS_MS[attempt], signal);
        continue;
      }
      throw errorFromStatus(res.status, data.error?.message ?? '');
    }
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.map((p) => p.text ?? '').join('');
    if (candidate?.finishReason === 'MAX_TOKENS') {
      throw new GeminiError(
        'truncated',
        'Kết quả quá dài nên bị cắt giữa chừng. Thử mô tả nhà nhỏ hơn hoặc ít phòng hơn.',
      );
    }
    if (!text) {
      if (data.promptFeedback?.blockReason) {
        throw new GeminiError(
          'blocked',
          'Gemini từ chối yêu cầu này. Thử diễn đạt lại mô tả.',
        );
      }
      throw new GeminiError('empty', 'Gemini không trả về kết quả. Thử lại.');
    }
    return text;
  }
}

/** Đọc API key đã lưu (null nếu chưa có hoặc localStorage bị chặn). */
export function getSavedApiKey(): string | null {
  try {
    return localStorage.getItem(GEMINI_KEY_STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Lưu API key vào localStorage (chỉ trong trình duyệt này). */
export function saveApiKey(key: string): void {
  try {
    localStorage.setItem(GEMINI_KEY_STORAGE_KEY, key);
  } catch {
    // localStorage bị chặn: key chỉ sống trong phiên này, không báo lỗi.
  }
}
