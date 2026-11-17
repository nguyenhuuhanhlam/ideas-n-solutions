import { parseBuildingJson } from '../export/jsonFile';
import type { Building } from '../model/schema';
import { callGeminiJson, type GeminiCall } from './gemini';
import {
  FLOORPLAN_SYSTEM_PROMPT,
  buildRepairPrompt,
  buildUserPrompt,
  extractJson,
} from './floorplanPrompt';
import {
  summarizeBuilding,
  validateGeneratedBuilding,
  type PlanSummary,
} from './validateGenerated';

/** Số lần thử tối đa (1 lần tạo + 2 lần sửa lỗi). */
export const MAX_ATTEMPTS = 3;

export interface GenerateFloorplanArgs {
  apiKey: string;
  description: string;
  signal?: AbortSignal;
  /** Bắn khi bắt đầu mỗi lượt thử (để UI hiện "lần 2/3"). */
  onAttempt?: (attempt: number) => void;
  /** Chích bản giả cho test; mặc định gọi Gemini thật. */
  callGemini?: GeminiCall;
}

export interface GenerateFloorplanResult {
  building: Building;
  summary: PlanSummary;
  attempts: number;
}

/**
 * Tạo mặt bằng từ mô tả: gọi Gemini → tách JSON → parse Zod → kiểm tra
 * hình học. Nếu lỗi, gửi lại lỗi + JSON cũ cho model sửa (tối đa 3 lượt).
 * Lỗi API (key, quota, mạng, hủy) ném ngay, không sửa lại.
 */
export async function generateFloorplan({
  apiKey,
  description,
  signal,
  onAttempt,
  callGemini = callGeminiJson,
}: GenerateFloorplanArgs): Promise<GenerateFloorplanResult> {
  let previousJson = '';
  let lastErrors: string[] = [];
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    onAttempt?.(attempt);
    const userText =
      attempt === 1
        ? buildUserPrompt(description)
        : buildRepairPrompt(description, previousJson, lastErrors);
    const raw = await callGemini({
      apiKey,
      systemInstruction: FLOORPLAN_SYSTEM_PROMPT,
      userText,
      signal,
    });
    const json = extractJson(raw);
    previousJson = json;
    let building: Building;
    try {
      building = parseBuildingJson(json);
    } catch (err) {
      // JSON hỏng / sai khung: coi như 1 lỗi để vòng sửa xử lý.
      lastErrors = [
        err instanceof Error
          ? err.message.replace(/^File không/, 'Kết quả trả về không')
          : 'Kết quả trả về không phải JSON hợp lệ.',
      ];
      continue;
    }
    lastErrors = validateGeneratedBuilding(building);
    if (lastErrors.length === 0) {
      return { building, summary: summarizeBuilding(building), attempts: attempt };
    }
  }
  throw new Error(
    `Không tạo được mặt bằng hợp lệ sau ${MAX_ATTEMPTS} lần thử:\n${lastErrors.join('\n')}`,
  );
}
