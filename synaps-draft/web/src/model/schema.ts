import { z } from 'zod';

/** Tất cả tọa độ/kích thước là số nguyên, đơn vị mm. */
const mm = z.number().int();

export const pointSchema = z.object({
  x: mm,
  y: mm,
});

export const wallSchema = z.object({
  id: z.string(),
  /** Chuỗi điểm của tường polyline: 2 điểm = 1 đoạn, 3+ điểm = nhiều đoạn. */
  points: z.array(pointSchema).min(2),
  thickness: mm,
  height: mm.optional(),
});

export const openingSchema = z.object({
  id: z.string(),
  wallId: z.string(),
  type: z.enum(['door', 'window']),
  offset: mm,
  width: mm,
  height: mm,
  sillHeight: mm,
  /** Cửa đi: đảo chiều mở sang phía đối diện của tường (mặc định false
   * = mở về phía pháp tuyến trái). Cửa sổ không dùng. File cũ không có
   * trường này vẫn load được, vẽ như hiện tại. */
  flip: z.boolean().optional(),
});

export const levelSchema = z.object({
  id: z.string(),
  name: z.string(),
  elevation: mm,
  height: mm,
  walls: z.array(wallSchema),
  openings: z.array(openingSchema),
});

export const buildingSchema = z.object({
  version: z.literal(1),
  levels: z.array(levelSchema),
});

export type Point = z.infer<typeof pointSchema>;
export type Wall = z.infer<typeof wallSchema>;
export type Opening = z.infer<typeof openingSchema>;
export type Level = z.infer<typeof levelSchema>;
export type Building = z.infer<typeof buildingSchema>;

/**
 * Migrate dữ liệu Building cũ (tường { start, end }) sang dạng mới
 * (tường { points: [start, end] }) rồi validate bằng Zod. Dữ liệu đã
 * ở dạng mới đi qua nguyên vẹn. Ném Error với thông điệp đọc được
 * khi dữ liệu không hợp lệ (đường dẫn field + lý do).
 */
export function migrateBuilding(data: unknown): Building {
  const raw = data as { levels?: unknown[] } | null | undefined;
  // Chỉ map khi levels/walls ĐÚNG là mảng; ngược lại giữ nguyên giá trị
  // để Zod từ chối (không tự "sửa" dữ liệu thiếu trường thành mảng rỗng).
  const levels = Array.isArray(raw?.levels)
    ? raw.levels.map((level) => {
        const lv = level as { walls?: unknown[] } | null | undefined;
        if (!Array.isArray(lv?.walls)) return level;
        return {
          ...lv,
          walls: lv.walls.map((wall) => {
            const w = wall as Record<string, unknown> | null | undefined;
            if (w && !Array.isArray(w.points) && w.start && w.end) {
              const { start, end, ...rest } = w as {
                start: unknown;
                end: unknown;
                [k: string]: unknown;
              };
              return { ...rest, points: [start, end] };
            }
            return wall;
          }),
        };
      })
    : raw?.levels;
  const migrated = {
    ...(typeof raw === 'object' && raw !== null ? raw : {}),
    levels,
  };
  const result = buildingSchema.safeParse(migrated);
  if (!result.success) {
    const details = result.error.issues
      .map((i) => `${i.path.join('.') || '(gốc)'}: ${i.message}`)
      .join('; ');
    throw new Error(`File không đúng định dạng Building: ${details}`);
  }
  return result.data;
}
