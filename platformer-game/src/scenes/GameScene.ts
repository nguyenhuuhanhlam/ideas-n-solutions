import Phaser from "phaser";
import {
  CLIMB_SPEED,
  CLIMB_X_SPEED,
  ENEMY_COUNT,
  ENEMY_MIN_SPAWN_DIST,
  ENEMY_RESPAWN_MS,
  VIEW_H,
  VIEW_W,
} from "../config";
import {
  GROUND_Y_AT,
  LADDER_ZONES,
  MAP_H,
  MAP_W,
  SOLID_RECTS,
  SPIKE_RECTS,
} from "../map";
import { Enemy } from "../entities/Enemy";
import { touchInput, type InputState } from "../input";
import { Player } from "../entities/Player";

const SHEETS: Array<{ key: string; file: string }> = [
  { key: "hero-idle", file: "hero-idle.png" },
  { key: "hero-walk", file: "hero-walk.png" },
  { key: "hero-run", file: "hero-run.png" },
  { key: "hero-jump", file: "hero-jump.png" },
  { key: "hero-fall", file: "hero-fall.png" },
  { key: "hero-fall-loop", file: "hero-fall-loop.png" },
  { key: "hero-attack", file: "hero-attack.png" },
];

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private solids: Phaser.GameObjects.GameObject[] = [];
  private ladderZones: Phaser.Geom.Rectangle[] = [];
  private spikeRects: Phaser.Geom.Rectangle[] = [];
  private enemies: Enemy[] = [];
  private deathEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private paused = false;
  private prevJump = false;
  private prevUp = false;
  private prevAttack = false;
  private uiBound = false;
  private climbZone: Phaser.Geom.Rectangle | null = null;
  private climbCooldownUntil = 0;

  constructor() {
    super("game");
  }

  preload(): void {
    for (const sheet of SHEETS) {
      this.load.spritesheet(sheet.key, `assets/sprites/player/${sheet.file}`, {
        frameWidth: 128,
        frameHeight: 128,
      });
    }
    // Map là chính mockup của user (3072x540, xem src/map.ts).
    this.load.image("mockup-map", "assets/backgrounds/mockup-map.png");
  }

  create(): void {
    // Scene restart dùng lại cùng instance nên phải reset tay các trạng thái
    // và ẩn các overlay DOM (DOM không tự reset theo scene).
    this.paused = false;
    this.prevJump = false;
    this.prevUp = false;
    this.prevAttack = false;
    this.solids = [];
    this.ladderZones = [];
    this.spikeRects = [];
    this.enemies = [];
    this.climbZone = null;
    this.climbCooldownUntil = 0;
    document.getElementById("pauseOverlay")?.classList.add("hidden");
    document.getElementById("gameOverOverlay")?.classList.add("hidden");
    if (!this.uiBound) {
      this.uiBound = true;
      document.getElementById("retryBtn")?.addEventListener("click", () => this.scene.restart());
      document.getElementById("pauseBtn")?.addEventListener("click", () => this.togglePause());
    }

    // Toàn bộ hình ảnh map (trời, núi, cây, đất, nhà, thang, gai, rương)
    // nằm trong ảnh mockup — không vẽ thêm gì bằng code nữa.
    this.add.image(0, 0, "mockup-map").setOrigin(0, 0);

    // Mọi vùng đặc (đất, gờ trên hố, trần hang, khối nổi) đo từ mockup,
    // đã gộp ngang thành các rect. Bậc giữa 2 vùng kề là tường đứng —
    // đi xuống tự do, đi lên phải nhảy (bậc cao nhất 96px, đúng tầm nhảy
    // tối đa nên vẫn lên được).
    for (const rect of SOLID_RECTS) {
      const body = this.add.rectangle(rect.x + rect.w / 2, rect.y + rect.h / 2, rect.w, rect.h);
      body.setFillStyle(0xffffff, 0);
      this.physics.add.existing(body, true);
      this.solids.push(body);
    }

    // Thang leo (hình thang đã có trong mockup, đây chỉ là vùng leo):
    // đầu thang vươn lên 40px trên mặt đứng để đứng trên gờ bấm Down là
    // bám được thang; đáy thang trùng mặt đất/hố để bước ra được.
    for (const lad of LADDER_ZONES) {
      this.ladderZones.push(new Phaser.Geom.Rectangle(lad.x - 14, lad.top, 28, lad.bottom - lad.top));
    }

    // Gai (hình gai đã có trong mockup, đây chỉ là vùng gây sát thương).
    for (const sp of SPIKE_RECTS) {
      this.spikeRects.push(new Phaser.Geom.Rectangle(sp.x, sp.y, sp.w, sp.h));
    }

    // Slime tạm vẽ bằng code (chưa có sprite địch thật): thân tím, mắt trắng.
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(0x7c3aed, 1);
    g.fillEllipse(16, 18, 30, 20);
    g.fillStyle(0x5b21b6, 1);
    g.fillEllipse(16, 24, 28, 8);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(11, 14, 4);
    g.fillCircle(21, 14, 4);
    g.fillStyle(0x1f2937, 1);
    g.fillCircle(12, 14, 2);
    g.fillCircle(22, 14, 2);
    g.generateTexture("enemy-slime", 32, 28);
    g.destroy();
    const dot = this.make.graphics({ x: 0, y: 0 }, false);
    dot.fillStyle(0xffffff, 1);
    dot.fillCircle(4, 4, 4);
    dot.generateTexture("dot", 8, 8);
    dot.destroy();
    this.deathEmitter = this.add.particles(0, 0, "dot", {
      speed: 120,
      lifespan: 400,
      scale: 1.5,
      tint: 0xa78bfa,
      emitting: false,
    });

    this.player = new Player(this, 120, this.groundYAt(120));
    this.physics.add.collider(this.player, this.solids);
    this.renderHearts();

    // Vài kẻ thù, vị trí ngẫu nhiên, cách xa nhân vật lúc mới vào.
    for (let i = 0; i < ENEMY_COUNT; i++) {
      const x = this.randomFarX();
      const enemy = new Enemy(this, x, this.groundYAt(x));
      this.physics.add.collider(enemy, this.solids);
      this.enemies.push(enemy);
    }

    this.physics.world.setBounds(0, 0, MAP_W, MAP_H);
    this.cameras.main.setBounds(0, 0, MAP_W, MAP_H);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    const keyboard = this.input.keyboard;
    if (keyboard) {
      this.keys = {
        left: keyboard.addKey("LEFT"),
        leftA: keyboard.addKey("A"),
        right: keyboard.addKey("RIGHT"),
        rightD: keyboard.addKey("D"),
        run: keyboard.addKey("SHIFT"),
        runX: keyboard.addKey("X"),
        jump: keyboard.addKey("Z"),
        jumpSpace: keyboard.addKey("SPACE"),
        up: keyboard.addKey("UP"),
        down: keyboard.addKey("DOWN"),
        downS: keyboard.addKey("S"),
        attack: keyboard.addKey("J"),
        pause: keyboard.addKey("P"),
        restart: keyboard.addKey("R"),
      };
    }
  }

  // Mặt đất tại x: cột 32px nào chứa x thì lấy mặt đứng cột đó.
  private groundYAt(x: number): number {
    const col = Phaser.Math.Clamp(Math.floor(x / 32), 0, GROUND_Y_AT.length - 1);
    return GROUND_Y_AT[col];
  }

  // Thang chứa điểm (tâm hitbox) hay không.
  private ladderAt(x: number, y: number): Phaser.Geom.Rectangle | null {
    for (const zone of this.ladderZones) {
      if (Phaser.Geom.Rectangle.Contains(zone, x, y)) return zone;
    }
    return null;
  }

  private enterClimb(zone: Phaser.Geom.Rectangle): void {
    this.player.climbing = true;
    this.climbZone = zone;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.allowGravity = false;
    this.player.setVelocity(0, 0);
    this.player.x = zone.centerX; // bám sát giữa thang cho gọn
  }

  private exitClimb(): void {
    this.player.climbing = false;
    this.climbZone = null;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.allowGravity = true;
    // Chống bám lại thang ngay lập tức ở khung hình vừa buông.
    this.climbCooldownUntil = this.time.now + 300;
  }

  // Leo thang: Up lên, Down xuống, ←/→ trườn ngang (đi khỏi thang thì buông).
  // Tới đầu thang (chân chạm mặt platform) hoặc chân thang (chạm đất) thì
  // tự buông. Trả về false khi đã buông thang.
  private updateClimbing(upHeld: boolean, downHeld: boolean): boolean {
    const zone = this.climbZone;
    if (!zone) return false;
    if (this.player.x < zone.x - 6 || this.player.x > zone.right + 6) {
      this.exitClimb();
      return false;
    }
    if (this.player.y <= zone.top + 6 || this.player.y >= zone.bottom) {
      this.exitClimb();
      return false;
    }
    const left = this.keys.left.isDown || this.keys.leftA.isDown || touchInput.left;
    const right = this.keys.right.isDown || this.keys.rightD.isDown || touchInput.right;
    this.player.setVelocityX((left ? -CLIMB_X_SPEED : 0) + (right ? CLIMB_X_SPEED : 0));
    this.player.setVelocityY(upHeld ? -CLIMB_SPEED : downHeld ? CLIMB_SPEED : 0);
    return true;
  }

  // Vị trí ngẫu nhiên trên mặt đất, cách nhân vật ít nhất
  // ENEMY_MIN_SPAWN_DIST và cách các địch khác ít nhất 150px.
  private randomFarX(): number {
    const others = this.enemies.filter((e) => e.alive).map((e) => e.x);
    for (let i = 0; i < 20; i++) {
      const x = 80 + Math.random() * (MAP_W - 160);
      if (Math.abs(x - this.player.x) < ENEMY_MIN_SPAWN_DIST) continue;
      if (others.some((ox) => Math.abs(x - ox) < 150)) continue;
      return x;
    }
    return this.player.x < MAP_W / 2 ? MAP_W - 120 : 120;
  }

  private killEnemy(enemy: Enemy): void {
    enemy.die();
    this.deathEmitter.explode(10, enemy.x, enemy.y - 20);
    // Hồi sinh sau 10s ở vị trí ngẫu nhiên, cách xa vị trí nhân vật lúc đó.
    this.time.delayedCall(ENEMY_RESPAWN_MS, () => {
      const x = this.randomFarX();
      enemy.respawn(x, this.groundYAt(x));
    });
  }

  private renderHearts(): void {
    const el = document.getElementById("hearts");
    if (!el) return;
    let html = "";
    for (let i = 0; i < 5; i++) {
      html += `<span class="heart ${i < this.player.hp ? "full" : "empty"}">♥</span>`;
    }
    el.innerHTML = html;
  }

  private gameOver(): void {
    document.getElementById("gameOverOverlay")?.classList.remove("hidden");
  }

  private togglePause(): void {
    this.paused = !this.paused;
    document.getElementById("pauseOverlay")?.classList.toggle("hidden", !this.paused);
  }

  update(_time: number, delta: number): void {
    if (Phaser.Input.Keyboard.JustDown(this.keys.pause)) {
      this.togglePause();
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.restart)) {
      this.scene.restart();
      return;
    }
    if (this.paused) return;
    const dt = Math.min(delta / 1000, 0.05);
    // Nhảy/chém: chỉ tính cạnh bấm xuống (vừa bấm), giữ phím không tự nhảy
    // lại khi vừa chạm đất, không tự chém lặp trên không. Di chuyển/chạy
    // thì vẫn giữ phím như thường. Up tách riêng khỏi nhảy: Up vừa là nhảy
    // khi đứng ngoài thang, vừa là leo lên khi đứng cạnh thang.
    const upHeld = this.keys.up.isDown || touchInput.up;
    const downHeld = this.keys.down.isDown || this.keys.downS.isDown || touchInput.down;
    const jumpHeld = this.keys.jump.isDown || this.keys.jumpSpace.isDown || touchInput.jump;
    const attackHeld = this.keys.attack.isDown || touchInput.attack;
    const jumpEdge = jumpHeld && !this.prevJump;
    const upEdge = upHeld && !this.prevUp;
    const attackEdge = attackHeld && !this.prevAttack;
    this.prevJump = jumpHeld;
    this.prevUp = upHeld;
    this.prevAttack = attackHeld;

    // Leo thang: đứng cạnh thang bấm Up/Down thì bám thang; đang leo bấm
    // Z/Space/B thì nhảy khỏi thang. Đang leo thì Player.update không chạy.
    let climbingNow = false;
    if (this.player.climbing) {
      if (jumpEdge) {
        this.exitClimb();
      } else {
        climbingNow = this.updateClimbing(upHeld, downHeld);
      }
    }
    if (!this.player.climbing && !climbingNow) {
      const zone = this.ladderAt(this.player.x, this.player.y - 32);
      if (zone && (upHeld || downHeld) && this.time.now >= this.climbCooldownUntil) {
        this.enterClimb(zone);
        this.updateClimbing(upHeld, downHeld);
      } else {
        const input: InputState = {
          left: this.keys.left.isDown || this.keys.leftA.isDown || touchInput.left,
          right: this.keys.right.isDown || this.keys.rightD.isDown || touchInput.right,
          run: this.keys.run.isDown || this.keys.runX.isDown || touchInput.run,
          jump: jumpEdge || upEdge,
          attack: attackEdge,
          up: upHeld,
          down: downHeld,
        };
        this.player.update(input, dt);
      }
    }
    for (const enemy of this.enemies) enemy.update(dt, this.player.x);
    // Địch chạm người chơi: mất 1 tim (takeDamage tự chặn lúc bất tử tạm).
    // Kiểm tra chém ở dưới chạy trước nên đòn chém giết địch cùng khung hình
    // sẽ cứu được 1 tim.
    if (!this.player.dead) {
      const pb = this.player.body as Phaser.Physics.Arcade.Body;
      const playerRect = new Phaser.Geom.Rectangle(pb.x, pb.y, pb.width, pb.height);
      let hit = false;
      for (const enemy of this.enemies) {
        if (!enemy.alive) continue;
        const eb = enemy.body as Phaser.Physics.Arcade.Body;
        const enemyRect = new Phaser.Geom.Rectangle(eb.x, eb.y, eb.width, eb.height);
        if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)) {
          if (this.player.takeDamage(enemy.x)) {
            this.renderHearts();
            if (this.player.hp <= 0) this.gameOver();
          }
          hit = true;
          break;
        }
      }
      // Gai trên mặt đất: chạm mất 1 tim như địch chạm.
      if (!hit) {
        for (const sp of this.spikeRects) {
          if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, sp)) {
            if (this.player.takeDamage(sp.centerX)) {
              this.renderHearts();
              if (this.player.hp <= 0) this.gameOver();
            }
            break;
          }
        }
      }
    }
    if (this.player.attacking) {
      const box = this.player.attackBox();
      const boxRect = new Phaser.Geom.Rectangle(box.x, box.y, box.w, box.h);
      for (const enemy of this.enemies) {
        if (!enemy.alive || enemy.lastAttackId === this.player.attackId) continue;
        const b = enemy.body as Phaser.Physics.Arcade.Body;
        const enemyRect = new Phaser.Geom.Rectangle(b.x, b.y, b.width, b.height);
        if (Phaser.Geom.Intersects.RectangleToRectangle(boxRect, enemyRect)) {
          enemy.lastAttackId = this.player.attackId;
          this.killEnemy(enemy);
        }
      }
    }
  }
}
