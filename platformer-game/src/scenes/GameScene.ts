import Phaser from "phaser";
import { GROUND_Y, PLATFORMS, VIEW_H, VIEW_W, WORLD_W } from "../config";
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
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private paused = false;
  private prevJump = false;
  private prevAttack = false;

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
    // Texture cắt từ tileset (đo từ file gốc, xem README mục Tileset).
    this.makeTileTexture("ground-top", 192, 13, 64, 19);
    this.makeDirtBodyTexture();
    this.makeTileTexture("plat-top", 16, 13, 16, 19);

    // Bầu trời gradient (đứng yên theo màn hình).
    const sky = this.add.graphics();
    sky.setScrollFactor(0);
    sky.fillGradientStyle(0x79c4f2, 0x79c4f2, 0xd9f2ff, 0xd9f2ff, 1);
    sky.fillRect(0, 0, VIEW_W, VIEW_H);

    // Mặt trời (parallax rất nhẹ).
    const sun = this.add.graphics();
    sun.setScrollFactor(0.05);
    sun.fillStyle(0xffd94d, 1);
    sun.fillCircle(800, 80, 36);

    // Núi xa (parallax 0.3).
    for (let i = 0; i < 6; i++) {
      const x = i * 640;
      const m = this.add.graphics();
      m.setScrollFactor(0.3);
      m.fillStyle(0x7fa8c9, 1);
      m.beginPath();
      m.moveTo(x, GROUND_Y);
      m.lineTo(x + 440, GROUND_Y - 180);
      m.lineTo(x + 880, GROUND_Y);
      m.closePath();
      m.fillPath();
    }

    // Cây gần (parallax 0.6).
    for (let i = 0; i < 7; i++) {
      const x = i * 800 + 160;
      const t = this.add.graphics();
      t.setScrollFactor(0.6);
      t.fillStyle(0x6b4a2f, 1);
      t.fillRect(x + 16, GROUND_Y - 84, 12, 84);
      t.fillStyle(0x2f7d4f, 1);
      t.fillCircle(x + 22, GROUND_Y - 104, 40);
      t.fillCircle(x - 4, GROUND_Y - 80, 26);
      t.fillCircle(x + 48, GROUND_Y - 80, 26);
    }

    // Mặt đất bằng tileset: dải cỏ lặp ngang + ô đất lặp lấp thân đất.
    this.add.tileSprite(0, GROUND_Y - 5, WORLD_W, 19, "ground-top").setOrigin(0, 0);
    this.add.tileSprite(0, GROUND_Y + 14, WORLD_W, VIEW_H - (GROUND_Y + 14), "dirt-body").setOrigin(0, 0);

    // Thân va chạm mặt đất (vô hình, chỉ để physics đứng lên).
    const groundBody = this.add.rectangle(WORLD_W / 2, GROUND_Y + 60, WORLD_W, 120);
    groundBody.setFillStyle(0xffffff, 0);
    this.physics.add.existing(groundBody, true);
    this.solids.push(groundBody);

    // Platform nổi mẫu + thân va chạm của chúng.
    for (const plat of PLATFORMS) {
      this.add.tileSprite(plat.x, plat.y - 5, plat.w, 19, "plat-top").setOrigin(0, 0);
      this.add.tileSprite(plat.x, plat.y + 14, plat.w, 16, "dirt-body").setOrigin(0, 0);
      const body = this.add.rectangle(plat.x + plat.w / 2, plat.y + 15, plat.w, 30);
      body.setFillStyle(0xffffff, 0);
      this.physics.add.existing(body, true);
      this.solids.push(body);
    }

    this.player = new Player(this, 120, GROUND_Y);
    this.physics.add.collider(this.player, this.solids);

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
        jumpUp: keyboard.addKey("UP"),
        attack: keyboard.addKey("J"),
        pause: keyboard.addKey("P"),
        restart: keyboard.addKey("R"),
      };
    }
    document.getElementById("pauseBtn")?.addEventListener("click", () => this.togglePause());
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
    // thì vẫn giữ phím như thường.
    const jumpHeld =
      this.keys.jump.isDown || this.keys.jumpSpace.isDown || this.keys.jumpUp.isDown || touchInput.jump;
    const attackHeld = this.keys.attack.isDown || touchInput.attack;
    const input: InputState = {
      left: this.keys.left.isDown || this.keys.leftA.isDown || touchInput.left,
      right: this.keys.right.isDown || this.keys.rightD.isDown || touchInput.right,
      run: this.keys.run.isDown || this.keys.runX.isDown || touchInput.run,
      jump: jumpHeld && !this.prevJump,
      attack: attackHeld && !this.prevAttack,
    };
    this.prevJump = jumpHeld;
    this.prevAttack = attackHeld;
    this.player.update(input, dt);
  }
}
