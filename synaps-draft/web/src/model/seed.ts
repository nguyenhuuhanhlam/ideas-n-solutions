import type { Building } from './schema';

/**
 * Nhà demo 1 tầng theo bản vẽ schematic (5600x7900mm, hình chữ L):
 * khối bắc đủ 5,6m (Hall + Bathroom), khối nam chỉ phía đông
 * (Main room + Bedroom), góc tây-nam là Porch mở (không tường bao).
 * Đo từ ảnh đính kèm, làm tròn về 50mm; diện tích phòng khớp nhãn
 * trên bản vẽ (Hall 5,1 / Bathroom 5,1 / Main 10,7 / Bedroom 8,3 m²).
 * Lối đi rộng 2100mm giữa w-bed-west và w-bed-east để trống (không
 * cửa) — đúng bản vẽ. Gốc tọa độ: mặt ngoài tường bắc-tây.
 */
export function seedBuilding(): Building {
  const t = 200;
  return {
    version: 1,
    levels: [
      {
        id: 'level-1',
        name: 'Tầng 1',
        elevation: 0,
        height: 3000,
        walls: [
          { id: 'w-north', points: [{ x: 100, y: 100 }, { x: 5500, y: 100 }], thickness: t },
          { id: 'w-east', points: [{ x: 5500, y: 100 }, { x: 5500, y: 7800 }], thickness: t },
          { id: 'w-south', points: [{ x: 5500, y: 7800 }, { x: 1900, y: 7800 }], thickness: t },
          { id: 'w-west', points: [{ x: 100, y: 100 }, { x: 100, y: 3500 }], thickness: t },
          { id: 'w-hall-south', points: [{ x: 100, y: 3500 }, { x: 1900, y: 3500 }], thickness: t },
          { id: 'w-vertical', points: [{ x: 1900, y: 7800 }, { x: 1900, y: 100 }], thickness: t },
          { id: 'w-bath-south', points: [{ x: 1900, y: 1800 }, { x: 5500, y: 1800 }], thickness: t },
          { id: 'w-bed-west', points: [{ x: 1900, y: 5150 }, { x: 2750, y: 5150 }], thickness: t },
          { id: 'w-bed-east', points: [{ x: 4850, y: 5150 }, { x: 5500, y: 5150 }], thickness: t },
        ],
        openings: [
          // Cửa sổ 650 mặt bắc (phòng tắm, tường dài 5400): 3600–4250.
          { id: 'o-win-north', wallId: 'w-north', type: 'window', offset: 3600, width: 650, height: 1200, sillHeight: 900 },
          // Cửa sổ 1150 mặt tây (hall, tường dài 3400): 1250–2400.
          { id: 'o-win-west', wallId: 'w-west', type: 'window', offset: 1250, width: 1150, height: 1200, sillHeight: 900 },
          // Cửa sổ 1050 mặt đông (phòng chính, tường dài 7700): 3900–4950.
          { id: 'o-win-east', wallId: 'w-east', type: 'window', offset: 3900, width: 1050, height: 1200, sillHeight: 900 },
          // Cửa sổ 550 mặt nam (phòng ngủ, tường dài 3600, đo từ đông sang tây): 800–1350.
          { id: 'o-win-south', wallId: 'w-south', type: 'window', offset: 800, width: 550, height: 1200, sillHeight: 900 },
          // Cửa hall ra porch 600 (tường dài 1800): 400–1000.
          { id: 'o-door-hall', wallId: 'w-hall-south', type: 'door', offset: 400, width: 600, height: 2100, sillHeight: 0 },
          // Cửa hall sang phòng chính 650 (tường dài 7700, đo từ nam lên bắc): 5000–5650.
          { id: 'o-door-main', wallId: 'w-vertical', type: 'door', offset: 5000, width: 650, height: 2100, sillHeight: 0 },
          // Cửa phòng tắm 550 (tường dài 3600): 200–750.
          { id: 'o-door-bath', wallId: 'w-bath-south', type: 'door', offset: 200, width: 550, height: 2100, sillHeight: 0 },
        ],
      },
    ],
  };
}
