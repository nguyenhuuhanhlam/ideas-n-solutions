import Phaser from "phaser";
import {
  ATTACK_BOX_H,
  ATTACK_BOX_W,
  ATTACK_FRAME_TIME,
  ATTACK_FRAMES,
  FRAME,
  GRAVITY,
  GROUND_LINE,
  HITBOX_H,
  HITBOX_OFF_X,
  HITBOX_OFF_Y,
  HITBOX_W,
  JUMP_VELOCITY,
  RUN_SPEED,
  SPRITE_CX,
  SPRITE_SCALE,
  WALK_SPEED,
} from "../config";
import type { InputState } from "../input";

// Animation điều khiển thủ công (không dùng Phaser Anims) để giữ đúng
// nhịp frame của bản vanilla: idle 0.12s, walk 0.09s, run 0.07s, chém 0.06s,
// nhảy/rơi dùng frame theo thời gian bay như bản cũ. Đòn chém đã gộp sẵn
// thành 1 sheet hero-attack.png (7 frame) nên không còn vấn đề chém qua 2 sheet.
type AnimName = "idle" | "walk" | "run" | "jump" | "fall" | "fallLoop" | "attack";

const SHEET_FRAMES: Record<string, { key: string; frames: number; time: number }> = {
  idle: { key: "hero-idle", frames: 10, time: 0.12 },
  walk: { key: "hero-walk", frames: 10, time: 0.09 },
  run: { key: "hero-run", frames: 10, time: 0.07 },
  attack: { key: "hero-attack", frames: ATTACK_FRAMES, time: ATTACK_FRAME_TIME },
};

export class Player extends Phaser.Physics.Arcade.Sprite {
  face: 1 | -1 = 1;
  attacking = false;
  attackId = 0;
  private attackT = 0;
  private animT = 0;
  private airT = 0;
  private fallT = 0;
  private currentSheet = "";
  private currentFrame = -1;

  constructor(scene: Phaser.Scene, feetX: number, feetY: number) {
    super(scene, feetX, feetY, "hero-idle");
    // Gốc vẽ đặt đúng tâm ngang (x=57) và đường chân (y=80) của frame gốc,
    // nên position của sprite chính là (tâm hitbox, chân hitbox).
    this.setOrigin(SPRITE_CX / FRAME, GROUND_LINE / FRAME);
    this.setScale(SPRITE_SCALE);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    const body = this.body as Phaser.Physics.Arcade.Body;
    // setSize/setOffset của Phaser tính bằng pixel gốc (xem config.ts),
    // không phải pixel hiển thị — HITBOX_* đã là số gốc.
    body.setSize(HITBOX_W, HITBOX_H);
    body.setOffset(HITBOX_OFF_X, HITBOX_OFF_Y);
    body.setCollideWorldBounds(true);
    body.setGravityY(GRAVITY);
  }

  get grounded(): boolean {
    const body = this.body as Phaser.Physics.Arcade.Body;
    return body.onFloor();
  }

  attackBox(): { x: number; y: number; w: number; h: number } {
    const body = this.body as Phaser.Physics.Arcade.Body;
    return this.face > 0
      ? { x: body.right, y: body.y + 4, w: ATTACK_BOX_W, h: ATTACK_BOX_H }
      : { x: body.x - ATTACK_BOX_W, y: body.y + 4, w: ATTACK_BOX_W, h: ATTACK_BOX_H };
  }

  private startAttack(): void {
    if (this.attacking) return;
    this.attacking = true;
    this.attackId++;
    this.attackT = 0;
    if (this.grounded) this.setVelocityX(0); // chém trên không thì giữ đà bay
  }

  private setFrameBy(sheet: string, frame: number): void {
    if (this.currentSheet !== sheet || this.currentFrame !== frame) {
      this.currentSheet = sheet;
      this.currentFrame = frame;
      this.setTexture(sheet, frame);
    }
  }

  private updateAnim(dt: number): void {
    this.animT += dt;
    const body = this.body as Phaser.Physics.Arcade.Body;
    let name: AnimName;
    if (this.attacking) name = "attack";
    else if (!this.grounded) name = body.velocity.y < 0 ? "jump" : "fall";
    else if (body.velocity.x !== 0) name = Math.abs(body.velocity.x) >= RUN_SPEED ? "run" : "walk";
    else name = "idle";

    if (name === "attack") {
      const idx = Math.min(Math.floor(this.attackT / ATTACK_FRAME_TIME), ATTACK_FRAMES - 1);
      this.setFrameBy("hero-attack", idx);
      return;
    }
    if (name === "jump") {
      this.setFrameBy("hero-jump", this.airT < 0.08 ? 0 : 2);
      return;
    }
    if (name === "fall") {
      if (this.fallT < 0.24) {
        this.setFrameBy("hero-fall", Math.floor(this.fallT / 0.06));
      } else {
        this.setFrameBy("hero-fall-loop", Math.floor((this.fallT - 0.24) / 0.1) % 3);
      }
      return;
    }
    const sheet = SHEET_FRAMES[name];
    this.setFrameBy(sheet.key, Math.floor(this.animT / sheet.time) % sheet.frames);
  }

  update(input: InputState, dt: number): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (this.attacking) {
      this.attackT += dt;
      if (this.attackT >= ATTACK_FRAMES * ATTACK_FRAME_TIME) {
        this.attacking = false;
        this.attackT = 0;
      }
      if (this.grounded) {
        this.setVelocityX(0);
      } else {
        // Chém trên không: vẫn lái được theo hướng, giữ đà bay.
        if (input.left) {
          this.setVelocityX(-(input.run ? RUN_SPEED : WALK_SPEED));
          this.face = -1;
        } else if (input.right) {
          this.setVelocityX(input.run ? RUN_SPEED : WALK_SPEED);
          this.face = 1;
        }
      }
    } else {
      if (input.left) {
        this.setVelocityX(-(input.run ? RUN_SPEED : WALK_SPEED));
        this.face = -1;
      } else if (input.right) {
        this.setVelocityX(input.run ? RUN_SPEED : WALK_SPEED);
        this.face = 1;
      } else {
        this.setVelocityX(0);
      }
      if (input.jump && this.grounded) {
        this.setVelocityY(JUMP_VELOCITY);
        this.airT = 0;
        this.fallT = 0;
      }
      if (input.attack) this.startAttack();
    }
    if (!this.grounded) {
      this.airT += dt;
      if (body.velocity.y > 0) this.fallT += dt;
    } else {
      this.airT = 0;
      this.fallT = 0;
    }
    this.setFlipX(this.face === -1);
    this.updateAnim(dt);
  }
}
