// Hằng số gameplay PixeLab — số liệu tách khỏi code để dễ chỉnh.
// Khung hình 960x540 (gấp đôi bản vanilla 480x270). Sprite gốc 128x128 vẽ
// với scale 2 nên nhân vật cao 74px trong logic 960x540, tức chiếm cùng
// tỷ lệ màn hình như bản vanilla 1/1 (37px trên 480x270). Mọi số vật lý
// dưới đây đều scale gấp đôi bản vanilla để giữ nguyên cảm giác.
export const VIEW_W = 960;
export const VIEW_H = 540;
// Thế giới = đúng kích thước mockup x2 (3072x540), xem src/map.ts.
// Map cũ (4 đoạn đất + 15 platform + nhà vẽ code) đã thay bằng map đo
// trực tiếp từ mockup của user (2026-11-07): ảnh nền là chính mockup,
// va chạm (đất/platform/thang/gai) đo từ màu từng ô 16px.

// Nhân vật: frame 128x128, tâm ngang x=57, đường chân y=80 (đo từ file gốc,
// sau khử viền đen nhân vật đứng còn 30x36 nhưng tâm và đường chân không đổi).
export const FRAME = 128;
export const SPRITE_CX = 57;
export const GROUND_LINE = 80;
export const SPRITE_SCALE = 2;
// Hitbox: hiển thị 30x64, nhưng API body của Phaser (setSize/setOffset)
// tính bằng pixel GỐC của frame (chưa scale), nên phải chia cho SPRITE_SCALE:
// size 15x32, offset (49.5, 48) so với góc trên-trái của khung gốc.
// Đưa nhầm số hiển thị (30x64, 99/96) vào đây từng làm body lệch khỏi sprite
// và nhân vật nổi lơ lửng trên mặt đất dù không bấm gì — đừng đổi lại.
export const HITBOX_W = 15;
export const HITBOX_H = 32;
export const HITBOX_OFF_X = 49.5;
export const HITBOX_OFF_Y = 48;

export const WALK_SPEED = 180;
export const RUN_SPEED = 300;
export const JUMP_VELOCITY = -520;
export const GRAVITY = 1400;

// Đòn chém: hero-attack.png = combo_1 (3 frame) + combo_1_end (4 frame).
export const ATTACK_FRAME_TIME = 0.06;
export const ATTACK_FRAMES = 7;
export const ATTACK_BOX_W = 70;
export const ATTACK_BOX_H = 50;

export const CLIMB_SPEED = 130;
export const CLIMB_X_SPEED = 120;

// Kẻ thù (bước đầu): slime tạm vẽ bằng code, chưa có sprite thật.
// Chết khi trúng 1 đòn chém, hồi sinh sau 10s ở vị trí ngẫu nhiên cách xa
// nhân vật tối thiểu ENEMY_MIN_SPAWN_DIST.
export const ENEMY_COUNT = 6;
export const ENEMY_MIN_SPAWN_DIST = 400;
export const ENEMY_RESPAWN_MS = 10000;
export const ENEMY_PATROL_SPEED = 60;
export const ENEMY_CHASE_SPEED = 110;
export const ENEMY_CHASE_RANGE = 250;
export const ENEMY_HOP_VELOCITY = -260;

// Máu nhân vật: 5 trái tim, địch chạm mất 1 tim. Sau khi mất máu được
// bất tử tạm 1.5s (không mất tiếp) và bị hất văng khỏi địch.
export const PLAYER_MAX_HP = 5;
export const PLAYER_INVULN_MS = 1500;
export const KNOCKBACK_X = 300;
export const KNOCKBACK_Y = -180;
