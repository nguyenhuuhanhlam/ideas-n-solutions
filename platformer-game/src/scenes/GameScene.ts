import Phaser from "phaser";
import {
  CLIMB_SPEED,
  CLIMB_X_SPEED,
  ENEMY_COUNT,
  ENEMY_MIN_SPAWN_DIST,
  ENEMY_RESPAWN_MS,
  GROUND_SEGMENTS,
  GROUND_Y,
  HOUSE_X,
  HOUSE_Y,
  LADDERS,
  PLATFORMS,
  SPIKES,
  VIEW_H,
  VIEW_W,
  WORLD_W,
} from "../config";
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
  private oneWayBodies: Phaser.GameObjects.GameObject[] = [];
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
    this.load.image("terrain", "assets/tilesets/terrain-tileset.png");
    this.load.image("far-mountains", "assets/backgrounds/far-mountains.png");
  }

  private makeTileTexture(key: string, sx: number, sy: number, w: number, h: number): void {
    const source = this.textures.get("terrain").getSourceImage() as HTMLImageElement;
    const tex = this.textures.createCanvas(key, w, h);
    if (!tex) return;
    const ctx = tex.getContext();
    ctx.drawImage(source, sx, sy, w, h, 0, 0, w, h);
    tex.refresh();
  }

  // Thân đất: khối đất lớn 64x48 (112,32) + cùng khối lật gương sang phải,
  // thành texture 128x48 nên chu kỳ lặp là 128px thay vì 16px như ô đất cũ.
  // Xen giữa là 2 mảng đất tối ("khoảng đen") để mặt đất không phẳng lì.
  private makeDirtBodyTexture(): void {
    const source = this.textures.get("terrain").getSourceImage() as HTMLImageElement;
    const tex = this.textures.createCanvas("dirt-body", 128, 48);
    if (!tex) return;
    const ctx = tex.getContext();
    ctx.drawImage(source, 112, 32, 64, 48, 0, 0, 64, 48);
    ctx.save();
    ctx.translate(128, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(source, 112, 32, 64, 48, 0, 0, 64, 48);
    ctx.restore();
    ctx.fillStyle = "#0d131b";
    ctx.fillRect(88, 14, 16, 20);
    ctx.fillStyle = "#14232a";
    ctx.fillRect(92, 18, 8, 12);
    ctx.fillRect(24, 30, 10, 10);
    ctx.fillStyle = "#284232";
    ctx.fillRect(90, 16, 4, 4);
    ctx.fillRect(26, 32, 4, 4);
    tex.refresh();
  }

  create(): void {
    // Scene restart dùng lại cùng instance nên phải reset tay các trạng thái
    // và ẩn các overlay DOM (DOM không tự reset theo scene).
    this.paused = false;
    this.prevJump = false;
    this.prevUp = false;
    this.prevAttack = false;
    this.solids = [];
    this.oneWayBodies = [];
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

    // Texture cắt từ tileset (đo từ file gốc, xem README mục Tileset).
    this.makeTileTexture("ground-top", 192, 13, 64, 19);
    this.makeDirtBodyTexture();
    this.makeTileTexture("plat-top", 16, 13, 16, 19);
    this.makeTileTexture("skull-block", 80, 96, 32, 32);
    this.makeTileTexture("spike", 16, 82, 16, 14);

    // Nền xa nhất: ảnh núi 384x216 đúng tỷ lệ 16:9 với khung 960x540 nên
    // vẽ full màn hình, cố định theo màn hình (scrollFactor 0). Ảnh đã có
    // đủ trời, mây, núi, nền đất phẳng nên không vẽ thêm trời gradient,
    // núi tam giác hay mặt trời bằng code nữa.
    const far = this.add.image(0, 0, "far-mountains");
    far.setOrigin(0, 0);
    far.setDisplaySize(VIEW_W, VIEW_H);
    far.setScrollFactor(0);

    // Cây gần (parallax 0.6), chân cây theo mặt đất đoạn đó.
    for (const x of [160, 960, 1760, 2560, 3360, 4600]) {
      const base = this.groundYAt(x);
      const t = this.add.graphics();
      t.setScrollFactor(0.6);
      t.fillStyle(0x6b4a2f, 1);
      t.fillRect(x + 16, base - 84, 12, 84);
      t.fillStyle(0x2f7d4f, 1);
      t.fillCircle(x + 22, base - 104, 40);
      t.fillCircle(x - 4, base - 80, 26);
      t.fillCircle(x + 48, base - 80, 26);
    }

    // Mặt đất theo mockup: 4 đoạn cao thấp, mỗi đoạn cỏ + thân đất + thân
    // va chạm riêng. Đoạn cao 428, đoạn thấp 468, bậc 40px nhảy lên được.
    for (const seg of GROUND_SEGMENTS) {
      this.add.tileSprite(seg.x, seg.y - 5, seg.w, 19, "ground-top").setOrigin(0, 0);
      this.add.tileSprite(seg.x, seg.y + 14, seg.w, VIEW_H - (seg.y + 14), "dirt-body").setOrigin(0, 0);
      const groundBody = this.add.rectangle(seg.x + seg.w / 2, seg.y + 60, seg.w, 120);
      groundBody.setFillStyle(0xffffff, 0);
      this.physics.add.existing(groundBody, true);
      this.solids.push(groundBody);
    }

    // Cửa hang tối trên mặt cắt đất của đoạn đầu (như mockup): chỉ trang trí.
    const cave = this.add.graphics();
    cave.fillStyle(0x0d131b, 1);
    cave.fillRect(250, 448, 90, 30);
    cave.fillEllipse(295, 448, 90, 26);

    // Nhà đá ở đoạn cuối (vẽ bằng code, chỉ trang trí, không va chạm):
    // tường đá có đốm, mái ngói hình thang + ống khói, cửa vòm gỗ, cửa sổ sáng.
    const h = this.add.graphics();
    h.fillStyle(0x8a7f74, 1);
    h.fillRect(HOUSE_X, HOUSE_Y - 110, 150, 110);
    h.fillStyle(0x6e6459, 1);
    h.fillRect(HOUSE_X + 12, HOUSE_Y - 96, 18, 10);
    h.fillRect(HOUSE_X + 60, HOUSE_Y - 70, 22, 12);
    h.fillRect(HOUSE_X + 110, HOUSE_Y - 92, 16, 10);
    h.fillRect(HOUSE_X + 30, HOUSE_Y - 40, 20, 10);
    h.fillStyle(0x9d938a, 1);
    h.fillRect(HOUSE_X + 40, HOUSE_Y - 100, 14, 8);
    h.fillRect(HOUSE_X + 90, HOUSE_Y - 50, 18, 8);
    h.fillStyle(0x7a6f63, 1);
    h.fillRect(HOUSE_X + 118, HOUSE_Y - 196, 18, 30);
    h.fillStyle(0x5d4030, 1);
    h.fillPoints([
      new Phaser.Geom.Point(HOUSE_X - 15, HOUSE_Y - 110),
      new Phaser.Geom.Point(HOUSE_X + 165, HOUSE_Y - 110),
      new Phaser.Geom.Point(HOUSE_X + 135, HOUSE_Y - 168),
      new Phaser.Geom.Point(HOUSE_X + 15, HOUSE_Y - 168),
    ]);
    h.fillStyle(0x3e2a1e, 1);
    h.fillRect(HOUSE_X - 15, HOUSE_Y - 112, 180, 4);
    h.fillStyle(0x6b4a2f, 1);
    h.fillRect(HOUSE_X + 60, HOUSE_Y - 68, 30, 68);
    h.fillCircle(HOUSE_X + 75, HOUSE_Y - 68, 15);
    h.fillStyle(0xffd97a, 1);
    h.fillCircle(HOUSE_X + 82, HOUSE_Y - 34, 2);
    h.fillRect(HOUSE_X + 18, HOUSE_Y - 88, 16, 16);
    h.lineStyle(1, 0x4a3220, 1);
    h.lineBetween(HOUSE_X + 26, HOUSE_Y - 88, HOUSE_X + 26, HOUSE_Y - 72);
    h.lineBetween(HOUSE_X + 18, HOUSE_Y - 80, HOUSE_X + 34, HOUSE_Y - 80);

    // Platform nổi nhiều tầng như mockup + thân va chạm của chúng. Platform
    // dày đúng tỷ lệ khối đất gốc trong tileset: cỏ 19px + thân đất 48px =
    // 67px, đáy là hàng đáy gồ ghề của khối gốc; thân va chạm kéo từ mặt
    // đứng y xuống y+62. Platform một chiều (dưới đầu thang) tách riêng để
    // leo xuyên từ dưới lên được, còn lại đặc như trước.
    for (const plat of PLATFORMS) {
      this.add.tileSprite(plat.x, plat.y - 5, plat.w, 19, "plat-top").setOrigin(0, 0);
      this.add.tileSprite(plat.x, plat.y + 14, plat.w, 48, "dirt-body").setOrigin(0, 0);
      const body = this.add.rectangle(plat.x + plat.w / 2, plat.y + 31, plat.w, 62);
      body.setFillStyle(0xffffff, 0);
      this.physics.add.existing(body, true);
      if (plat.oneWay) this.oneWayBodies.push(body);
      else this.solids.push(body);
    }

    // Dây leo rủ xuống từ vài platform (trang trí).
    const vine = this.add.graphics();
    vine.lineStyle(2, 0x3f8f4f, 1);
    for (const [vx, vy] of [[1470, 370], [2520, 370], [4320, 370]] as const) {
      vine.lineBetween(vx, vy, vx + 3, vy + 14);
      vine.lineBetween(vx + 3, vy + 14, vx - 2, vy + 26);
      vine.lineBetween(vx + 14, vy, vx + 11, vy + 12);
      vine.lineBetween(vx + 11, vy + 12, vx + 16, vy + 22);
    }

    // Thang leo: 2 thanh dọc + bậc ngang, vùng leo rộng 28px quanh tâm thang.
    for (const lad of LADDERS) {
      const g = this.add.graphics();
      g.fillStyle(0x6b4a2f, 1);
      g.fillRect(lad.x - 10, lad.top, 4, lad.bottom - lad.top);
      g.fillRect(lad.x + 6, lad.top, 4, lad.bottom - lad.top);
      for (let y = lad.top + 8; y < lad.bottom - 4; y += 16) {
        g.fillRect(lad.x - 10, y, 20, 3);
      }
      this.ladderZones.push(new Phaser.Geom.Rectangle(lad.x - 14, lad.top, 28, lad.bottom - lad.top));
    }

    // Khối đầu lâu trang trí (cắt từ tileset) trên platform và mặt đất.
    this.add.image(840, 348, "skull-block").setOrigin(0, 1);
    this.add.image(1900, 468, "skull-block").setOrigin(0, 1);
    this.add.image(3900, 468, "skull-block").setOrigin(0, 1);

    // Gai trên mặt đất (cắt từ tileset): chạm mất 1 tim như địch chạm.
    for (const sp of SPIKES) {
      for (let x = sp.x; x < sp.x + sp.w; x += 16) {
        this.add.image(x, sp.y, "spike").setOrigin(0, 1);
      }
      this.spikeRects.push(new Phaser.Geom.Rectangle(sp.x, sp.y - 14, sp.w, 14));
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
    // Platform một chiều: chỉ va chạm khi nhân vật đang rơi xuống và chân
    // đã ở trên mặt platform (dung sai 16px), nên nhảy/leo xuyên từ dưới
    // lên được mà đứng từ trên vẫn đứng được.
    this.physics.add.collider(
      this.player,
      this.oneWayBodies,
      undefined,
      (a, b) => {
        const pb = (a as unknown as { body: Phaser.Physics.Arcade.Body }).body;
        const sb = (b as unknown as { body: Phaser.Physics.Arcade.Body }).body;
        return pb.velocity.y >= 0 && pb.bottom <= sb.top + 16;
      },
      this,
    );
    this.renderHearts();

    // Vài kẻ thù, vị trí ngẫu nhiên, cách xa nhân vật lúc mới vào.
    for (let i = 0; i < ENEMY_COUNT; i++) {
      const x = this.randomFarX();
      const enemy = new Enemy(this, x, this.groundYAt(x));
      this.physics.add.collider(enemy, this.solids);
      this.enemies.push(enemy);
    }

    this.physics.world.setBounds(0, 0, WORLD_W, VIEW_H);
    this.cameras.main.setBounds(0, 0, WORLD_W, VIEW_H);
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

  // Mặt đất tại x (đoạn nào chứa x thì lấy mặt đoạn đó, không thì 468).
  private groundYAt(x: number): number {
    for (const seg of GROUND_SEGMENTS) {
      if (x >= seg.x && x < seg.x + seg.w) return seg.y;
    }
    return GROUND_Y;
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
      const x = 80 + Math.random() * (WORLD_W - 160);
      if (Math.abs(x - this.player.x) < ENEMY_MIN_SPAWN_DIST) continue;
      if (others.some((ox) => Math.abs(x - ox) < 150)) continue;
      return x;
    }
    return this.player.x < WORLD_W / 2 ? WORLD_W - 120 : 120;
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
