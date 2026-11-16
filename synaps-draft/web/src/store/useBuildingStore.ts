import { applyPatches, enablePatches, produceWithPatches, type Patch } from 'immer';
import { create } from 'zustand';
import { initialBuilding } from '../export/jsonFile';
import type { View2d } from '../model/elevation';
import { mergeBuildingWalls, mergeCoincidentWalls, tryMergeWall, type SnapKind } from '../model/geometry';
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
  /** Vùng chọn nhiều vật thể (tường + cửa chọn chung được, không loại trừ nhau). */
  selectedWallIds: string[];
  selectedOpeningIds: string[];
  /** Camera riêng cho từng view 2D (mặt bằng dùng key 'top'). */
  cameras: Record<View2d, Camera>;
  unit: Unit;
  theme: Theme;
  /** Chế độ xem 2D/3D/split — trạng thái UI, không vào history undo. */
  viewMode: ViewMode;
  /** View 2D đang xem: mặt bằng (top) hay mặt đứng (left/right). UI, không undo. */
  view2d: View2d;
  /** Panel trái có đang mở không — View2D dùng để căn khung hình vào vùng nhìn thấy. UI, không undo. */
  panelVisible: boolean;
  /** Hiện lưới 2D hay không. UI, không undo. */
  showGrid: boolean;
  /** Chế độ xem mobile (viewport < 768px): chỉ xem toàn màn hình, không
   * panel/toolbar — App đăng ký matchMedia, View2D dùng để fit + cảm ứng.
   * UI, không undo. */
  isMobile: boolean;
  /** Tỉ lệ vừa khung hình của view 2D đang xem — mốc 100% của pill Zoom. UI, không undo. */
  fitScale: number;
  /** Bộ đếm yêu cầu vừa khung (Shift+1 / bấm pill Zoom): View2D fit khi số này tăng. UI, không undo. */
  fitRequest: number;
  draft: Draft | null;
  past: HistoryEntry[];
  future: HistoryEntry[];
  /** Vị trí con trỏ (world, mm) — chỉ để hiển thị ở status bar. */
  cursorWorld: Point | null;
  snapKind: SnapKind;
  /** Chuỗi số người dùng đang gõ để nhập chiều dài tường. */
  lengthInput: string;

  addWall: (wall: Wall) => void;
  /** Thêm tường mới; nếu đầu mút trùng đầu/cuối tường cũ thì gộp thành
   * polyline (1 history entry, kể cả khi opening phải dời offset). */
  addWallOrMerge: (wall: Wall) => void;
  updateWall: (id: string, patch: Partial<Wall>) => void;
  /** Đặt lại chuỗi điểm của tường rồi gộp mọi tường trùng đầu mút
   * (kéo đỉnh/di chuyển tường có thể nối 2 tường thành polyline) —
   * tất cả trong 1 history entry. */
  commitWallPoints: (wallId: string, points: Point[]) => void;
  /** Như commitWallPoints nhưng cho NHIỀU tường cùng lúc (kéo nhóm):
   * đặt điểm cho tất cả rồi gộp 1 lần, trong 1 history entry. */
  commitWallPointsMany: (updates: { wallId: string; points: Point[] }[]) => void;
  deleteWall: (id: string) => void;
  addOpening: (opening: Opening) => void;
  updateOpening: (id: string, patch: Partial<Opening>) => void;
  deleteOpening: (id: string) => void;
  /** Xóa toàn bộ vùng chọn (tường + cửa trên chúng + cửa chọn riêng)
   * trong ĐÚNG 1 history entry, rồi bỏ chọn. */
  deleteSelection: () => void;
  updateLevel: (patch: Partial<Pick<Level, 'name' | 'height'>>) => void;
  /** Thay toàn bộ building (mở file / tạo mới); undo được về bản trước. */
  loadBuilding: (building: Building) => void;
  setTool: (tool: Tool) => void;
  /** Bấm thường: chỉ chọn 1 vật thể, xóa hết chọn cũ (id null = bỏ chọn). */
  selectSingle: (kind: 'wall' | 'opening', id: string | null) => void;
  /** Shift+bấm: thêm/bớt 1 vật thể khỏi vùng chọn, giữ nguyên phần còn lại. */
  toggleInSelection: (kind: 'wall' | 'opening', id: string) => void;
  /** Đặt vùng chọn theo 2 danh sách (khung kéo / Ctrl+A). */
  setSelection: (wallIds: string[], openingIds: string[]) => void;
  clearSelection: () => void;
  /** Cập nhật camera của view 2D đang xem. */
  setCamera: (camera: Partial<Camera>) => void;
  setUnit: (unit: Unit) => void;
  setTheme: (theme: Theme) => void;
  setViewMode: (mode: ViewMode) => void;
  setView2d: (view: View2d) => void;
  setPanelVisible: (visible: boolean) => void;
  setShowGrid: (visible: boolean) => void;
  setIsMobile: (mobile: boolean) => void;
  setFitScale: (scale: number) => void;
  requestFit: () => void;
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
  selectedWallIds: [],
  selectedOpeningIds: [],
  cameras: {
    top: { x: 0, y: 0, scale: 0.1 },
    left: { x: 0, y: 0, scale: 0.1 },
    right: { x: 0, y: 0, scale: 0.1 },
  },
  unit: 'mm',
  theme: 'light',
  viewMode: '2d',
  view2d: 'top',
  panelVisible: true,
  showGrid: true,
  // Giá trị khởi động đúng ngay từ đầu (tránh chớp layout desktop trên
  // mobile): matchMedia có thể không tồn tại ở môi trường test → false.
  isMobile:
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(max-width: 767px)').matches
      : false,
  fitScale: 0.1,
  fitRequest: 0,
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

  addWallOrMerge: (wall) => {
    const level = get().building.levels[0];
    if (!level) return;
    const merged = tryMergeWall(level.walls, level.openings, wall);
    if (!merged) {
      get().addWall(wall);
      return;
    }
    // Gộp tường + dời opening trong CÙNG 1 history entry.
    applyBuildingChange(set, get, (b) => {
      const l = b.levels[0];
      if (!l) return;
      l.walls = merged.walls;
      l.openings = merged.openings;
    });
  },

  updateWall: (id, patch) =>
    applyBuildingChange(set, get, (b) => {
      const w = b.levels[0]?.walls.find((x) => x.id === id);
      if (w) Object.assign(w, patch);
    }),

  commitWallPoints: (wallId, points) => {
    get().commitWallPointsMany([{ wallId, points }]);
  },

  commitWallPointsMany: (updates) => {
    if (updates.length === 0) return;
    const level = get().building.levels[0];
    if (!level) return;
    const byId = new Map(updates.map((u) => [u.wallId, u.points]));
    const walls = level.walls.map((w) =>
      byId.has(w.id) ? { ...w, points: byId.get(w.id) as Point[] } : w,
    );
    // Điểm trước khi gộp của mọi tường (để tìm tường "sống sót" cho cả
    // tường bị gộp theo mà không nằm trong updates).
    const preMergePoints = new Map(walls.map((w) => [w.id, w.points]));
    const merged = mergeCoincidentWalls(walls, level.openings);
    // Đổi điểm + gộp tường + dời opening trong CÙNG 1 history entry.
    applyBuildingChange(set, get, (b) => {
      const l = b.levels[0];
      if (!l) return;
      l.walls = merged.walls;
      l.openings = merged.openings;
    });
    // Gộp có thể làm mất id tường đang kéo (giữ id tường đứng trước):
    // chuyển chọn sang tường đã gộp để panel không nhảy về Canvas.
    const selected = get().selectedWallIds;
    const lost = selected.filter((id) => !merged.walls.some((w) => w.id === id));
    if (lost.length > 0) {
      const survivors = new Set<string>();
      for (const wallId of lost) {
        const points = preMergePoints.get(wallId);
        const first = points?.[0];
        const last = points?.[points.length - 1];
        const survivor =
          first && last
            ? merged.walls.find(
                (w) =>
                  w.points.some((p) => p.x === first.x && p.y === first.y) &&
                  w.points.some((p) => p.x === last.x && p.y === last.y),
              )
            : undefined;
        if (survivor) survivors.add(survivor.id);
      }
      set({
        selectedWallIds: [
          ...selected.filter((id) => !lost.includes(id)),
          ...survivors,
        ],
      });
    }
  },

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

  deleteSelection: () => {
    const { selectedWallIds, selectedOpeningIds } = get();
    if (selectedWallIds.length === 0 && selectedOpeningIds.length === 0) return;
    const wallSet = new Set(selectedWallIds);
    const openingSet = new Set(selectedOpeningIds);
    applyBuildingChange(set, get, (b) => {
      const level = b.levels[0];
      if (!level) return;
      level.walls = level.walls.filter((w) => !wallSet.has(w.id));
      // Cửa trên tường bị xóa đi theo tường; cửa chọn riêng xóa trực tiếp.
      level.openings = level.openings.filter(
        (o) => !wallSet.has(o.wallId) && !openingSet.has(o.id),
      );
    });
    set({ selectedWallIds: [], selectedOpeningIds: [] });
  },

  updateLevel: (patch) =>
    applyBuildingChange(set, get, (b) => {
      const level = b.levels[0];
      if (level) Object.assign(level, patch);
    }),

  loadBuilding: (building) => {
    // Mở file / tạo mới: tường trùng đầu mút gộp thành polyline ngay.
    const merged = mergeBuildingWalls(building);
    applyBuildingChange(set, get, (b) => {
      b.version = merged.version;
      b.levels = merged.levels;
    });
    set({ selectedWallIds: [], selectedOpeningIds: [], draft: null, lengthInput: '' });
  },

  setTool: (tool) => set({ tool, draft: null, lengthInput: '' }),
  selectSingle: (kind, id) => {
    if (id === null) {
      set({ selectedWallIds: [], selectedOpeningIds: [] });
      return;
    }
    set(
      kind === 'wall'
        ? { selectedWallIds: [id], selectedOpeningIds: [] }
        : { selectedWallIds: [], selectedOpeningIds: [id] },
    );
  },
  toggleInSelection: (kind, id) =>
    set((s) => {
      if (kind === 'wall') {
        return s.selectedWallIds.includes(id)
          ? { selectedWallIds: s.selectedWallIds.filter((x) => x !== id) }
          : { selectedWallIds: [...s.selectedWallIds, id] };
      }
      return s.selectedOpeningIds.includes(id)
        ? { selectedOpeningIds: s.selectedOpeningIds.filter((x) => x !== id) }
        : { selectedOpeningIds: [...s.selectedOpeningIds, id] };
    }),
  setSelection: (selectedWallIds, selectedOpeningIds) =>
    set({ selectedWallIds, selectedOpeningIds }),
  clearSelection: () => set({ selectedWallIds: [], selectedOpeningIds: [] }),
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
  setPanelVisible: (panelVisible) => set({ panelVisible }),
  setShowGrid: (showGrid) => set({ showGrid }),
  setIsMobile: (isMobile) => set({ isMobile }),
  setFitScale: (fitScale) => set({ fitScale }),
  requestFit: () => set((s) => ({ fitRequest: s.fitRequest + 1 })),
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
      selectedWallIds: [],
      selectedOpeningIds: [],
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
      selectedWallIds: [],
      selectedOpeningIds: [],
      draft: null,
    }));
  },
}));

/** Level đang làm việc (giai đoạn 1 chỉ có 1 level). */
export function selectActiveLevel(state: BuildingState) {
  return state.building.levels[0];
}
