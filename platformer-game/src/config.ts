// Hằng số gameplay PixeLab — số liệu tách khỏi code để dễ chỉnh.
// Khung hình 960x540 (gấp đôi bản vanilla 480x270). Sprite gốc 128x128 vẽ
// với scale 2 nên nhân vật cao 74px trong logic 960x540, tức chiếm cùng
// tỷ lệ màn hình như bản vanilla 1/1 (37px trên 480x270). Mọi số vật lý
// dưới đây đều scale gấp đôi bản vanilla để giữ nguyên cảm giác.
export const VIEW_W = 960;
export const VIEW_H = 540;
export const WORLD_W = 4800;
export const GROUND_Y = 468;

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

// Map làm lại theo mockup của user (2026-11-07): mặt đất không còn phẳng
// 1 đường mà chia 4 đoạn cao thấp (bậc 40px, nhảy lên được), platform nổi
// rải nhiều tầng như các cụm khối xanh trong mockup, 3 thang leo nối đất
// với platform cao, nhà đá ở đoạn cuối, gai trên mặt đất gây mất máu.
// Độ cao nhảy tối đa 96px nên mọi bậc/tầng kề nhau chênh tối đa 80px.
export interface GroundSegment {
  x: number;
  w: number;
  y: number; // mặt đứng của đoạn
}
export const GROUND_SEGMENTS: GroundSegment[] = [
  { x: 0, w: 1000, y: 428 },
  { x: 1000, w: 1000, y: 468 },
  { x: 2000, w: 1000, y: 428 },
  { x: 3000, w: 1800, y: 468 },
];

export interface PlatformDef {
  x: number;
  y: number;
  w: number;
  // oneWay: platform một chiều — nhảy xuyên từ dưới lên, đứng được từ trên.
  // Chỉ 3 platform dưới đầu thang là một chiều để leo xuyên qua nó lên mặt;
  // các platform còn lại vẫn đặc như trước (chạm đáy sẽ chặn lại).
  oneWay?: boolean;
}
export const PLATFORMS: PlatformDef[] = [
  { x: 320, y: 348, w: 96 },
  { x: 560, y: 308, w: 96, oneWay: true },
  { x: 800, y: 348, w: 96 },
  { x: 1150, y: 388, w: 128 },
  { x: 1330, y: 348, w: 64 },
  { x: 1450, y: 308, w: 96, oneWay: true },
  { x: 1750, y: 388, w: 64 },
  { x: 2150, y: 348, w: 160 },
  { x: 2500, y: 308, w: 96 },
  { x: 2800, y: 348, w: 96 },
  { x: 3150, y: 388, w: 128 },
  { x: 3350, y: 348, w: 64 },
  { x: 3500, y: 308, w: 64 },
  { x: 3750, y: 388, w: 96 },
  { x: 4300, y: 308, w: 128, oneWay: true },
];

// Thang leo: x là tâm thang, top/bottom là 2 đầu (y = mặt chân).
// Đầu thang trùng mặt platform một chiều ngay trên nó để leo lên tới nơi
// là đứng được lên platform đó.
export interface LadderDef {
  x: number;
  top: number;
  bottom: number;
}
export const LADDERS: LadderDef[] = [
  { x: 600, top: 308, bottom: 428 },
  { x: 1500, top: 308, bottom: 468 },
  { x: 4380, top: 308, bottom: 468 },
];
export const CLIMB_SPEED = 130;
export const CLIMB_X_SPEED = 120;

// Gai trên mặt đất: chạm mất 1 tim như địch chạm (dùng chung takeDamage).
export interface SpikeDef {
  x: number;
  y: number; // mặt đất đặt gai
  w: number;
}
export const SPIKES: SpikeDef[] = [
  { x: 1300, y: 468, w: 32 },
  { x: 3350, y: 468, w: 32 },
];

// Nhà đá (vẽ bằng code, chỉ trang trí, không va chạm): mép trái x, mặt đất y.
export const HOUSE_X = 3980;
export const HOUSE_Y = 468;

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
