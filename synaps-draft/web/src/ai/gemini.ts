/**
 * Gọi Gemini API trực tiếp từ trình duyệt (app là trang tĩnh, không có
 * backend). Key của user lưu ở localStorage, chỉ gửi tới Google.
 * Mô hình: gemini-2.5-flash — bản ổn định có gói miễn phí.
 * Endpoint REST: POST /v1beta/models/{model}:generateContent,
 * xác thực bằng header `x-goog-api-key` (không để key trong URL).
 * Trả JSON có cấu trúc: responseMimeType + responseSchema ép model
 * trả đúng khung Building (không cần bóc markdown fence, nhưng phía
 * trên vẫn bóc phòng hờ).
 */

/** Mô hình Gemini dùng cho tạo mặt bằng (đổi 1 chỗ này là đổi cả app). */
export const GEMINI_MODEL = 'gemini-2.5-flash';

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
    version: { type: 'integer', enum: [1] },
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

export interface GeminiCallArgs {
  apiKey: string;
  systemInstruction: string;
  userText: string;
  signal?: AbortSignal;
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
  if (status === 400 || status === 401 || status === 403) {
    return new GeminiError(
      'key',
      'API key không hợp lệ hoặc chưa bật Gemini API. Kiểm tra lại key ở Google AI Studio.',
    );
  }
  if (status === 429) {
    return new GeminiError(
      'quota',
      'Hết lượt miễn phí của Gemini (giới hạn theo phút/ngày). Đợi một lúc rồi thử lại.',
    );
  }
  return new GeminiError(
    'other',
    `Gemini trả lỗi HTTP ${status}${detail ? `: ${detail}` : ''}.`,
  );
}

/** Gọi Gemini, trả về text JSON thô (chưa parse). Ném GeminiError đã dịch. */
export async function callGeminiJson({
  apiKey,
  systemInstruction,
  userText,
  signal,
}: GeminiCallArgs): Promise<string> {
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
        },
      }),
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err;
    throw new GeminiError(
      'network',
      'Không kết nối được tới Gemini. Kiểm tra mạng rồi thử lại.',
    );
  }
  const data = (await res.json().catch(() => ({}))) as GeminiResponse;
  if (!res.ok) {
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
