import { openingOverlapsOthers } from '../model/openingDrag';
import { wallLength } from '../model/geometry';
import type { Building } from '../model/schema';

/**
 * Kiểm tra mặt bằng do AI tạo sau khi đã qua Zod: các lỗi hình học mà
 * schema không bắt được (cửa tràn tường, cửa chồng nhau, id trùng...).
 * Trả danh sách lỗi tiếng Việt (rỗng = hợp lệ) để hiện cho user và để
 * vòng sửa lỗi gửi lại cho model.
 */
export function validateGeneratedBuilding(building: Building): string[] {
  const errors: string[] = [];
  if (building.levels.length !== 1) {
    errors.push(`Chỉ hỗ trợ 1 tầng (mặt bằng trả về có ${building.levels.length} tầng).`);
    return errors;
  }
  const level = building.levels[0];
  if (level.walls.length === 0) errors.push('Mặt bằng không có tường nào.');
  if (level.openings.length === 0) errors.push('Mặt bằng không có cửa nào.');
  if (!level.openings.some((o) => o.type === 'door')) {
    errors.push('Mặt bằng không có cửa đi nào.');
  }

  const wallIds = new Set<string>();
  for (const wall of level.walls) {
    if (wallIds.has(wall.id)) errors.push(`Trùng id tường: ${wall.id}.`);
    wallIds.add(wall.id);
    if (wallLength(wall) <= 0) errors.push(`Tường ${wall.id} có độ dài bằng 0.`);
    if (wall.thickness < 50 || wall.thickness > 500) {
      errors.push(`Tường ${wall.id} dày ${wall.thickness}mm (bất thường, thường 100–200mm).`);
    }
  }

  const openingIds = new Set<string>();
  for (const opening of level.openings) {
    if (openingIds.has(opening.id)) errors.push(`Trùng id cửa: ${opening.id}.`);
    openingIds.add(opening.id);
    const wall = level.walls.find((w) => w.id === opening.wallId);
    if (!wall) {
      errors.push(`Cửa ${opening.id} trỏ tới tường không tồn tại: ${opening.wallId}.`);
      continue;
    }
    if (opening.width <= 0 || opening.height <= 0) {
      errors.push(`Cửa ${opening.id} có kích thước không hợp lệ (${opening.width}×${opening.height}).`);
    }
    if (opening.sillHeight < 0) {
      errors.push(`Cửa ${opening.id} có chiều cao bậu âm (${opening.sillHeight}).`);
    }
    if (opening.offset < 0 || opening.offset + opening.width > wallLength(wall)) {
      errors.push(
        `Cửa ${opening.id} tràn khỏi tường ${wall.id} (offset ${opening.offset} + rộng ${opening.width} > dài tường ${wallLength(wall)}).`,
      );
    }
  }

  // Cửa chồng nhau (lỗ-lỗ, quay-quay, quay-lỗ) — dùng chung bộ kiểm tra của app.
  for (const opening of level.openings) {
    if (openingOverlapsOthers(level.walls, level.openings, opening)) {
      errors.push(`Cửa ${opening.id} chồng lên cửa khác.`);
    }
  }
  return errors;
}

export interface PlanSummary {
  wallCount: number;
  doorCount: number;
  windowCount: number;
  /** Kích thước bao của mặt bằng (mm), tính theo điểm tường. */
  widthMm: number;
  heightMm: number;
}

/** Tóm tắt mặt bằng để hiện ở màn hình kết quả trước khi áp dụng. */
export function summarizeBuilding(building: Building): PlanSummary {
  const level = building.levels[0];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const wall of level.walls) {
    for (const p of wall.points) {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    }
  }
  return {
    wallCount: level.walls.length,
    doorCount: level.openings.filter((o) => o.type === 'door').length,
    windowCount: level.openings.filter((o) => o.type === 'window').length,
    widthMm: Number.isFinite(maxX) ? maxX - minX : 0,
    heightMm: Number.isFinite(maxY) ? maxY - minY : 0,
  };
}
