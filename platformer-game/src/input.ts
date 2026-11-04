// Trạng thái nút bấm: bàn phím (Phaser) + nút cảm ứng NES (DOM) cùng ghi vào đây.
// Player chỉ đọc object này, không cần biết phím đến từ đâu.
export interface InputState {
  left: boolean;
  right: boolean;
  run: boolean;
  jump: boolean;
  attack: boolean;
}

export const touchInput: InputState = {
  left: false,
  right: false,
  run: false,
  jump: false,
  attack: false,
};

export function bindTouchButton(el: HTMLElement, key: keyof InputState): void {
  const on = (e: Event): void => {
    e.preventDefault();
    touchInput[key] = true;
  };
  const off = (e: Event): void => {
    e.preventDefault();
    touchInput[key] = false;
  };
  el.addEventListener("pointerdown", on);
  el.addEventListener("pointerup", off);
  el.addEventListener("pointerleave", off);
  el.addEventListener("pointercancel", off);
}
