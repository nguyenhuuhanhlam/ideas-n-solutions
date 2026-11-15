import type { Building } from '../model/schema';

const API_URL = import.meta.env.VITE_API_URL as string | undefined;

/** URL gốc của API xuất DXF; mặc định http://localhost:8000. */
export function apiBaseUrl(): string {
  return (API_URL ?? 'http://localhost:8000').replace(/\/$/, '');
}

/**
 * Gửi Building lên API và tải file DXF về. Ném Error với thông điệp
 * ngắn gọn để hiển thị ở status bar (API chưa chạy, validate fail...).
 */
export async function exportDxf(building: Building): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${apiBaseUrl()}/export/dxf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(building),
    });
  } catch {
    throw new Error('Không kết nối được API DXF — kiểm tra api đã chạy ở cổng 8000 chưa.');
  }
  if (!res.ok) {
    if (res.status === 422) throw new Error('Dữ liệu building không hợp lệ (API từ chối, 422).');
    throw new Error(`Xuất DXF thất bại (HTTP ${res.status}).`);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'building.dxf';
  a.click();
  URL.revokeObjectURL(url);
}
