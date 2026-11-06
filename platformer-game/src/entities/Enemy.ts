import Phaser from "phaser";
import {
  ENEMY_CHASE_RANGE,
  ENEMY_CHASE_SPEED,
  ENEMY_HOP_VELOCITY,
  ENEMY_PATROL_SPEED,
  GRAVITY,
} from "../config";

// Kẻ thù bước đầu: slime vẽ bằng code (texture 'enemy-slime' do GameScene
// sinh từ Graphics), chưa có sprite thật — khi user gửi sprite địch thì
// thay texture ở đây, logic đi lại/truy đuổi/chết/hồi sinh giữ nguyên.
// Hành vi: đi tuần chậm, thấy nhân vật trong ENEMY_CHASE_RANGE thì đuổi
// theo; di chuyển bằng cách nhảy cóc. Chết khi trúng 1 đòn chém.
export class Enemy extends Phaser.Physics.Arcade.Sprite {
  alive = true;
  lastAttackId = -1;
  private patrolDir: 1 | -1 = 1;
  private patrolT = 0;
  private hopT = 0;

  constructor(scene: Phaser.Scene, feetX: number, feetY: number) {
    super(scene, feetX, feetY, "enemy-slime");
    // Gốc vẽ ở đáy giữa, position của sprite là (tâm, chân) như Player.
    this.setOrigin(0.5, 1);
    this.setScale(2);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    const body = this.body as Phaser.Physics.Arcade.Body;
    // Body tính bằng pixel gốc của texture 32x28 (xem config hitbox Player
    // để biết vì sao không dùng số hiển thị): hiển thị 48x36.
    body.setSize(24, 18);
    body.setOffset(4, 10);
    body.setCollideWorldBounds(true);
    body.setGravityY(GRAVITY);
    this.patrolDir = Math.random() < 0.5 ? -1 : 1;
    this.patrolT = 1 + Math.random() * 2;
    this.hopT = 0.5 + Math.random();
  }

  get grounded(): boolean {
    const body = this.body as Phaser.Physics.Arcade.Body;
    return body.onFloor();
  }

  die(): void {
    this.alive = false;
    this.setVelocity(0, 0);
    this.disableBody(true, true);
  }

  respawn(feetX: number, feetY: number): void {
    this.enableBody(true, feetX, feetY, true, true);
    this.alive = true;
    this.lastAttackId = -1;
    this.setVelocity(0, 0);
    this.patrolDir = Math.random() < 0.5 ? -1 : 1;
    this.patrolT = 1 + Math.random() * 2;
    this.hopT = 0.5 + Math.random();
  }

  update(dt: number, playerX: number): void {
    if (!this.alive) return;
    const body = this.body as Phaser.Physics.Arcade.Body;
    const dx = playerX - this.x;
    const chasing = Math.abs(dx) < ENEMY_CHASE_RANGE;
    let dir: 1 | -1;
    if (chasing) {
      dir = dx >= 0 ? 1 : -1;
    } else {
      this.patrolT -= dt;
      if (this.patrolT <= 0) {
        this.patrolDir = this.patrolDir === 1 ? -1 : 1;
        this.patrolT = 1 + Math.random() * 2;
      }
      dir = this.patrolDir;
    }
    this.setVelocityX(dir * (chasing ? ENEMY_CHASE_SPEED : ENEMY_PATROL_SPEED));
    this.setFlipX(dir < 0);
    if (body.blocked.left) this.patrolDir = 1;
    if (body.blocked.right) this.patrolDir = -1;
    this.hopT -= dt;
    if (this.hopT <= 0 && this.grounded) {
      this.setVelocityY(ENEMY_HOP_VELOCITY);
      this.hopT = 0.8 + Math.random() * 0.6;
    }
  }
}
