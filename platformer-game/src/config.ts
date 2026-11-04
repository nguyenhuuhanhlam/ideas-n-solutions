// Hằng số gameplay PixeLab — số liệu tách khỏi code để dễ chỉnh.
// Khung hình 960x540 (gấp đôi bản vanilla 480x270). Sprite gốc 128x128 vẽ
// với scale 2 nên nhân vật cao 74px trong logic 960x540, tức chiếm cùng
// tỷ lệ màn hình như bản vanilla 1/1 (37px trên 480x270). Mọi số vật lý
// dưới đây đều scale gấp đôi bản vanilla để giữ nguyên cảm giác.
export const VIEW_W = 960;
export const VIEW_H = 540;
export const WORLD_W = 4800;
export const GROUND_Y = 420;

// Nhân vật: frame 128x128, tâm ngang x=57, đường chân y=80 (đo từ file gốc,
// sau khử viền đen nhân vật đứng còn 30x36 nhưng tâm và đường chân không đổi).
export const FRAME = 128;
export const SPRITE_CX = 57;
export const GROUND_LINE = 80;
export const SPRITE_SCALE = 2;
// Hitbox: 30x64, vị trí tương đối so với góc trên-trái của khung vẽ (đã scale 2).
export const HITBOX_W = 30;
export const HITBOX_H = 64;
export const HITBOX_OFF_X = 99;
export const HITBOX_OFF_Y = 96;

export const WALK_SPEED = 180;
export const RUN_SPEED = 300;
export const JUMP_VELOCITY = -520;
export const GRAVITY = 1400;

// Đòn chém: hero-attack.png = combo_1 (3 frame) + combo_1_end (4 frame).
export const ATTACK_FRAME_TIME = 0.06;
export const ATTACK_FRAMES = 7;
export const ATTACK_BOX_W = 70;
export const ATTACK_BOX_H = 50;

// Platform nổi mẫu (bước đầu: platform đặc, đứng được trên mặt, chạm đáy
// sẽ chặn lại — chưa phải platform một chiều xuyên từ dưới lên).
export interface PlatformDef {
  x: number;
  y: number;
  w: number;
}
export const PLATFORMS: PlatformDef[] = [
  { x: 700, y: 340, w: 128 },
  { x: 1000, y: 260, w: 96 },
  { x: 1250, y: 340, w: 160 },
];
