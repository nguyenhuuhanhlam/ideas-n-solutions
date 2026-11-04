import Phaser from "phaser";
import { VIEW_H, VIEW_W } from "./config";
import { bindTouchButton, touchInput } from "./input";
import { GameScene } from "./scenes/GameScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: VIEW_W,
  height: VIEW_H,
  parent: "game",
  backgroundColor: "#79c4f2",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: false,
    },
  },
  render: {
    pixelArt: true,
    roundPixels: true,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [GameScene],
};

new Phaser.Game(config);

// Nút cảm ứng NES (DOM ngoài canvas) -> touchInput, GameScene đọc chung.
document.querySelectorAll<HTMLElement>(".touch button[data-k]").forEach((btn) => {
  const key = btn.getAttribute("data-k") as keyof typeof touchInput;
  if (key && key in touchInput) bindTouchButton(btn, key);
});
