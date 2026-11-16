import type { Building } from './schema';

/** Nhà mẫu 2 phòng: hình chữ nhật ngoài 8000x6000mm, 1 tường ngăn giữa. */
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
          { id: 'w-north', points: [{ x: 0, y: 0 }, { x: 8000, y: 0 }], thickness: t },
          { id: 'w-east', points: [{ x: 8000, y: 0 }, { x: 8000, y: 6000 }], thickness: t },
          { id: 'w-south', points: [{ x: 8000, y: 6000 }, { x: 0, y: 6000 }], thickness: t },
          { id: 'w-west', points: [{ x: 0, y: 6000 }, { x: 0, y: 0 }], thickness: t },
          { id: 'w-divider', points: [{ x: 4000, y: 0 }, { x: 4000, y: 6000 }], thickness: t },
        ],
        openings: [
          // Cửa chính 900 giữa tường nam (dài 8000): 3550–4450.
          { id: 'o-main-door', wallId: 'w-south', type: 'door', offset: 3550, width: 900, height: 2100, sillHeight: 0 },
          // Cửa thông phòng 800 trên tường ngăn (dài 6000): 2600–3400.
          { id: 'o-inner-door', wallId: 'w-divider', type: 'door', offset: 2600, width: 800, height: 2100, sillHeight: 0 },
          // Cửa sổ 1200 mặt bắc (tường dài 8000): 1400–2600.
          { id: 'o-win-north', wallId: 'w-north', type: 'window', offset: 1400, width: 1200, height: 1200, sillHeight: 900 },
          // Cửa sổ 1200 mặt đông (tường dài 6000): 2400–3600.
          { id: 'o-win-east', wallId: 'w-east', type: 'window', offset: 2400, width: 1200, height: 1200, sillHeight: 900 },
        ],
      },
    ],
  };
}
