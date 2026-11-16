import { mergeBuildingWalls } from '../model/geometry';
import { migrateBuilding, type Building } from '../model/schema';
import { seedBuilding } from '../model/seed';

/** Key autosave trong localStorage (v2: bỏ hẳn autosave v1 cũ theo yêu cầu user 2026-11-16). */
export const STORAGE_KEY = 'synaps-draft-building-v2';
/** Key autosave cũ — xóa khi khởi động để bỏ các bản vẽ cũ. */
const LEGACY_STORAGE_KEY = 'synaps-draft-building-v1';

/**
 * Parse + validate chuỗi JSON thành Building (tự migrate tường cũ
 * { start, end } sang { points }). Ném Error với thông điệp đọc được
 * (đường dẫn field + lý do) thay vì trả ZodError thô.
 */
export function parseBuildingJson(text: string): Building {
  let raw: unknown;
  try {
    raw = JSON.parse(text) as unknown;
  } catch {
    throw new Error('File không phải JSON hợp lệ.');
  }
  return migrateBuilding(raw);
}

/** Đọc Building từ File do người dùng chọn (input file / kéo-thả). */
export async function loadBuildingFromFile(file: File): Promise<Building> {
  return parseBuildingJson(await file.text());
}

/** Tải Building xuống dưới dạng `building.json` qua Blob URL. */
export function downloadBuilding(building: Building, filename = 'building.json'): void {
  const blob = new Blob([JSON.stringify(building, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Nạp bản autosave (nếu có). Lỗi validate/JSON thì trả null để caller
 * dùng seed — không bao giờ ném lỗi ra ngoài.
 */
export function loadSavedBuilding(): Building | null {
  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // localStorage bị chặn: không có gì để xóa, cứ tiếp tục.
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return parseBuildingJson(raw);
  } catch {
    return null;
  }
}

/** Building khởi động: autosave nếu có, ngược lại seed nhà mẫu 2 phòng.
 * Tường trùng đầu mút được gộp thành polyline (nhà mẫu → 2 tường: vòng
 * ngoài khép kín + vách ngăn). */
export function initialBuilding(): Building {
  return mergeBuildingWalls(loadSavedBuilding() ?? seedBuilding());
}
