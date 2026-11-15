import { applyPatches, enablePatches, produceWithPatches, type Patch } from 'immer';
import { create } from 'zustand';
import { initialBuilding } from '../export/jsonFile';
import type { View2d } from '../model/elevation';
import type { SnapKind } from '../model/geometry';
import type { Building, Level, Opening, Point, Wall } from '../model/schema';

enablePatches();

export type Tool = 'select' | 'wall' | 'door' | 'window';
export type Unit = 'mm' | 'm';
export type Theme = 'light' | 'dark';
export type ViewMode = '2d' | '3d' | 'split';

export interface Camera {
  x: number;
  y: number;
  scale: number;
}

export interface Draft {
  /** Điểm đầu đoạn tường đang vẽ. */
  start: Point;
  /** Vị trí chuột hiện tại (đã snap). */
  current: Point;
}

const MAX_HISTORY = 100;

interface HistoryEntry {
  patches: Patch[];
  inversePatches: Patch[];
}

interface BuildingState {
  building: Building;
  tool: Tool;
  selectedWallId: string | null;
  /** Chọn tường và opening là loại trừ nhau: chỉ một trong hai khác null. */
  selectedOpeningId: string | null;
  /** Camera riêng cho từng view 2D (mặt bằng dùng key 'top'). */
  cameras: Record<View2d, Camera>;
  unit: Unit;
  theme: Theme;
  /** Chế độ xem 2D/3D/split — trạng thái UI, không vào history undo. */
  viewMode: ViewMode;
  /** View 2D đang xem: mặt bằng (top) hay mặt đứng (left/right). UI, không undo. */
  view2d: View2d;
  draft: Draft | null;
  past: HistoryEntry[];
  future: HistoryEntry[];
  /** Vị trí con trỏ (world, mm) — chỉ để hiển thị ở status bar. */
  cursorWorld: Point | null;
  snapKind: SnapKind;
  /** Chuỗi số người dùng đang gõ để nhập chiều dài tường. */
  lengthInput: string;

  addWall: (wall: Wall) => void;
  updateWall: (id: string, patch: Partial<Wall>) => void;
  deleteWall: (id: string) => void;
  addOpening: (opening: Opening) => void;
  updateOpening: (id: string, patch: Partial<Opening>) => void;
  deleteOpening: (id: string) => void;
  updateLevel: (patch: Partial<Pick<Level, 'name' | 'height'>>) => void;
  /** Thay toàn bộ building (mở file / tạo mới); undo được về bản trước. */
  loadBuilding: (building: Building) => void;
  setTool: (tool: Tool) => void;
  setSelection: (id: string | null) => void;
  setOpeningSelection: (id: string | null) => void;
  /** Cập nhật camera của view 2D đang xem. */
  setCamera: (camera: Partial<Camera>) => void;
  setUnit: (unit: Unit) => void;
  setTheme: (theme: Theme) => void;
  setViewMode: (mode: ViewMode) => void;
  setView2d: (view: View2d) => void;
  setDraft: (draft: Draft | null) => void;
  setCursor: (p: Point | null, snap: SnapKind) => void;
  setLengthInput: (s: string) => void;
  undo: () => void;
  redo: () => void;
}

function applyBuildingChange(
  set: (fn: (s: BuildingState) => Partial<BuildingState>) => void,
  get: () => BuildingState,
  recipe: (draft: Building) => void,
) {
  const [next, patches, inversePatches] = produceWithPatches(get().building, recipe);
  if (patches.length === 0) return;
  set((s) => ({
    building: next,
    past: [...s.past.slice(-(MAX_HISTORY - 1)), { patches, inversePatches }],
    future: [],
  }));
}

export const useBuildingStore = create<BuildingState>((set, get) => ({
  // Khởi động: autosave trong localStorage nếu có, ngược lại seed.
  building: initialBuilding(),
  tool: 'select',
  selectedWallId: null,
  selectedOpeningId: null,
  cameras: {
    top: { x: 0, y: 0, scale: 0.1 },
    left: { x: 0, y: 0, scale: 0.1 },
    right: { x: 0, y: 0, scale: 0.1 },
  },
  unit: 'mm',
  theme: 'light',
  viewMode: '2d',
  view2d: 'top',
  draft: null,
  past: [],
  future: [],
  cursorWorld: null,
  snapKind: null,
  lengthInput: '',

  addWall: (wall) =>
    applyBuildingChange(set, get, (b) => {
      b.levels[0]?.walls.push(wall);
    }),

  updateWall: (id, patch) =>
    applyBuildingChange(set, get, (b) => {
      const w = b.levels[0]?.walls.find((x) => x.id === id);
      if (w) Object.assign(w, patch);
    }),

  deleteWall: (id) =>
    applyBuildingChange(set, get, (b) => {
      const level = b.levels[0];
      if (!level) return;
      level.walls = level.walls.filter((w) => w.id !== id);
      level.openings = level.openings.filter((o) => o.wallId !== id);
    }),

  addOpening: (opening) =>
    applyBuildingChange(set, get, (b) => {
      b.levels[0]?.openings.push(opening);
    }),

  updateOpening: (id, patch) =>
    applyBuildingChange(set, get, (b) => {
      const o = b.levels[0]?.openings.find((x) => x.id === id);
      if (o) Object.assign(o, patch);
    }),

  deleteOpening: (id) =>
    applyBuildingChange(set, get, (b) => {
      const level = b.levels[0];
      if (!level) return;
      level.openings = level.openings.filter((o) => o.id !== id);
    }),

  updateLevel: (patch) =>
    applyBuildingChange(set, get, (b) => {
      const level = b.levels[0];
      if (level) Object.assign(level, patch);
    }),

  loadBuilding: (building) => {
    applyBuildingChange(set, get, (b) => {
      b.version = building.version;
      b.levels = building.levels;
    });
    set({ selectedWallId: null, selectedOpeningId: null, draft: null, lengthInput: '' });
  },

  setTool: (tool) => set({ tool, draft: null, lengthInput: '' }),
  setSelection: (id) => set({ selectedWallId: id, selectedOpeningId: null }),
  setOpeningSelection: (id) => set({ selectedOpeningId: id, selectedWallId: null }),
  setCamera: (camera) =>
    set((s) => ({
      cameras: {
        ...s.cameras,
        [s.view2d]: { ...s.cameras[s.view2d], ...camera },
      },
    })),
  setUnit: (unit) => set({ unit }),
  setTheme: (theme) => set({ theme }),
  setViewMode: (viewMode) => set({ viewMode }),
  setView2d: (view2d) =>
    set({
      view2d,
      // Chỉ vẽ ở mặt bằng Top: rời Top thì về tool select, hủy draft dở dang.
      ...(view2d === 'top'
        ? {}
        : { tool: 'select' as const, draft: null, lengthInput: '', cursorWorld: null }),
    }),
  setDraft: (draft) => set({ draft }),
  setCursor: (cursorWorld, snapKind) => set({ cursorWorld, snapKind }),
  setLengthInput: (lengthInput) => set({ lengthInput }),

  undo: () => {
    const { past, building } = get();
    const entry = past[past.length - 1];
    if (!entry) return;
    set((s) => ({
      building: applyPatches(building, entry.inversePatches),
      past: s.past.slice(0, -1),
      future: [entry, ...s.future].slice(0, MAX_HISTORY),
      selectedWallId: null,
      selectedOpeningId: null,
      draft: null,
    }));
  },

  redo: () => {
    const { future, building } = get();
    const entry = future[0];
    if (!entry) return;
    set((s) => ({
      building: applyPatches(building, entry.patches),
      past: [...s.past, entry].slice(-MAX_HISTORY),
      future: s.future.slice(1),
      selectedWallId: null,
      selectedOpeningId: null,
      draft: null,
    }));
  },
}));

/** Level đang làm việc (giai đoạn 1 chỉ có 1 level). */
export function selectActiveLevel(state: BuildingState) {
  return state.building.levels[0];
}
