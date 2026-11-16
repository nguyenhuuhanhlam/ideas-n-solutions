import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { Arc, Layer, Line, Circle, Rect, Stage, Text } from 'react-konva';
import Segments from '../components/Segments';
import WallFill from '../components/WallFill';
import { elevationBounds, elevationUToOffset, projectOpeningToElevation, projectWallToElevation, sortWallsByDepth, type ElevationView } from '../model/elevation';
import { distance, doorSwing, fitScaleFor, mergeWallPolygonsWithHoles, midpoint, openingFrame, openingsExceedLength, planBounds, pointsLength, projectPointOnWall, resizeSegment, wallCornerPatches, wallPolygon, wallSegmentPolygons, windowLines } from '../model/geometry';
import { computeGridSegments, gridStepFor } from '../model/grid';
import { clampOffset, clampSill } from '../model/openingDrag';
import type { Opening, Point, Wall } from '../model/schema';
import { marqueeSelect, type MarqueeRect } from '../model/selection';
import { selectActiveLevel, useBuildingStore, type Unit } from '../store/useBuildingStore';
import { computeSnap, createWall, snapPointsNear } from '../tools/wallTool';
import { createOpening, findNearestWall } from '../tools/openingTool';

/**
 * Quy ước tọa độ: 1px = 1mm ở scale 1. Gốc world (0,0) ban đầu ở giữa stage.
 * Y hướng XUỐNG như màn hình (khác hệ CAD). Khi xuất DXF giai đoạn sau
 * sẽ lật Y (y_dxf = -y).
 */

/** Zoom nhỏ nhất (tuyệt đối): đủ thấp để zoom ra bao quát hơn nhiều so với mốc 100% (≈0.09). */
const MIN_SCALE = 0.02;
const MAX_SCALE = 10;
const OPENING_PICK_RADIUS_PX = 15;
const DIM_OFFSET = 600; // mm, khoảng cách đường kích thước khỏi tường
/** Ngưỡng màn hình (px) để phân biệt click chọn với kéo thả. */
const DRAG_THRESHOLD_PX = 3;

function fmt(valueMm: number, unit: Unit): string {
  return unit === 'mm' ? `${Math.round(valueMm)} mm` : `${(valueMm / 1000).toFixed(2)} m`;
}

/** Bảng màu Synaps (luôn sáng — không còn theme tối). */
const COLORS = {
  bg: '#FCFCFC',
  grid: '#E9E9E7',
  axis: '#D6D6D2',
  wallFill: '#8A8A8A',
  wallStroke: '#6E6E6E',
  center: '#A8A8A8',
  selected: '#3B9BD6',
  draft: '#3B9BD6',
  snap: '#3B9BD6',
  text: '#111111',
  dim: '#71717A',
} as const;

/** Trạng thái kéo thả (transient, chỉ preview — commit vào store khi thả chuột). */
type DragState =
  | {
      kind: 'endpoint';
      wallId: string;
      index: number;
      /** Mọi chỉ số trùng vị trí với điểm đang kéo (vòng khép kín: điểm
       * đầu == điểm cuối → kéo 1 tay nắm dời cả 2 để vòng vẫn kín). */
      indices: number[];
      fixed: Point;
    }
  | {
      kind: 'move';
      wallId: string;
      /** Mọi tường cùng dịch chuyển (tường đang kéo + tường đã chọn khác). */
      wallIds: string[];
      grab: Point;
      /** Điểm gốc của từng tường trong nhóm (theo id). */
      origById: Record<string, Point[]>;
    }
  | {
      kind: 'opening-top';
      openingId: string;
      wallId: string;
      /** Offset dọc tường tại điểm bấm (để kéo giữ đúng vị trí tay nắm). */
      grabOffset: number;
      origOffset: number;
      origSill: number;
      startScreen: Point;
      active: boolean;
    }
  | {
      kind: 'opening-elev';
      openingId: string;
      wallId: string;
      view: ElevationView;
      grabU: number;
      grabV: number;
      origOffset: number;
      origSill: number;
      /** Tường chiếu thành hình rộng thì kéo ngang đổi offset; mép mỏng thì chỉ kéo dọc đổi sill. */
      canMoveU: boolean;
      startScreen: Point;
      active: boolean;
    };

interface DragPreview {
  wallId: string;
  points: Point[];
}

/** Preview kéo thả có thể gồm nhiều tường (kéo nhóm). */
type DragPreviews = DragPreview[];

interface OpeningPreview {
  openingId: string;
  offset: number;
  sillHeight: number;
}

/** Polygon hình chữ nhật bao opening (dọc tường × ngang tường). */
function openingPolygon(opening: Opening, wall: Wall, halfWidth: number): number[] {
  const { a, b, nx, ny } = openingFrame(opening, wall);
  return [
    a.x + nx * halfWidth, a.y + ny * halfWidth,
    b.x + nx * halfWidth, b.y + ny * halfWidth,
    b.x - nx * halfWidth, b.y - ny * halfWidth,
    a.x - nx * halfWidth, a.y - ny * halfWidth,
  ];
}

/** Một thước dim của 1 đoạn tường: đường + extension + mũi tên hở + nhãn. */
interface SegmentDim {
  line: number[];
  ext: number[];
  arrows: number[];
  label: string;
  lx: number;
  ly: number;
  rot: number;
}

/** Tính thước dim cho 1 đoạn p0→p1, offset 600mm về phía xa tâm building
 * (cx, cy — phía trống). Trả null khi đoạn dài 0. */
function segmentDim(p0: Point, p1: Point, cx: number, cy: number, unit: Unit): SegmentDim | null {
  const len = distance(p0, p1);
  if (len <= 0) return null;
  const ux = (p1.x - p0.x) / len;
  const uy = (p1.y - p0.y) / len;
  const nx = -uy;
  const ny = ux;
  const mid = midpoint(p0, p1);
  const dPlus = Math.hypot(mid.x + nx * DIM_OFFSET - cx, mid.y + ny * DIM_OFFSET - cy);
  const dMinus = Math.hypot(mid.x - nx * DIM_OFFSET - cx, mid.y - ny * DIM_OFFSET - cy);
  const s = dPlus >= dMinus ? 1 : -1;
  const ox = nx * DIM_OFFSET * s;
  const oy = ny * DIM_OFFSET * s;
  const ds = { x: p0.x + ox, y: p0.y + oy };
  const de = { x: p1.x + ox, y: p1.y + oy };
  const extLen = DIM_OFFSET + 150;
  let rot = (Math.atan2(uy, ux) * 180) / Math.PI;
  if (rot > 90) rot -= 180;
  if (rot < -90) rot += 180;
  // Mũi tên hở ở 2 đầu đường kích thước: đỉnh tại đầu đường, 2 cánh
  // mở ngược vào trong (~120mm dọc đường, ~50mm ngang).
  const arrowLen = 120;
  const arrowSpread = 50;
  return {
    line: [ds.x, ds.y, de.x, de.y],
    ext: [
      p0.x, p0.y,
      p0.x + nx * extLen * s, p0.y + ny * extLen * s,
      p1.x, p1.y,
      p1.x + nx * extLen * s, p1.y + ny * extLen * s,
    ],
    arrows: [
      ds.x, ds.y, ds.x + ux * arrowLen + nx * arrowSpread, ds.y + uy * arrowLen + ny * arrowSpread,
      ds.x, ds.y, ds.x + ux * arrowLen - nx * arrowSpread, ds.y + uy * arrowLen - ny * arrowSpread,
      de.x, de.y, de.x - ux * arrowLen + nx * arrowSpread, de.y - uy * arrowLen + ny * arrowSpread,
      de.x, de.y, de.x - ux * arrowLen - nx * arrowSpread, de.y - uy * arrowLen - ny * arrowSpread,
    ],
    label: fmt(len, unit),
    lx: (ds.x + de.x) / 2 + nx * 140 * s,
    ly: (ds.y + de.y) / 2 + ny * 140 * s,
    rot,
  };
}

export default function View2D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const spaceRef = useRef(false);
  const panRef = useRef<{ sx: number; sy: number; cx: number; cy: number } | null>(null);
  const fittedRef = useRef<Record<string, boolean>>({ top: false, left: false, right: false });
  const dragRef = useRef<DragState | null>(null);
  /** Chặn click "dư" sau khi kéo thả: mouseup trên canvas trống sinh click
   * lên stage, làm mất chọn ngay sau khi kéo xong (lỗi cũ từ giai đoạn 1). */
  const suppressClickRef = useRef(false);
  const [dragPreview, setDragPreview] = useState<DragPreviews | null>(null);
  const [openingPreview, setOpeningPreview] = useState<OpeningPreview | null>(null);
  /** Khung kéo chọn (marquee): điểm bắt đầu (world + màn hình) + có cộng thêm
   * (Shift) hay thay thế vùng chọn. Hình chữ nhật hiện tại vẽ từ state. */
  const marqueeRef = useRef<{
    startWorld: Point;
    startScreen: Point;
    additive: boolean;
  } | null>(null);
  const [marqueeRect, setMarqueeRect] = useState<MarqueeRect | null>(null);
  /** Nhập độ dài trực tiếp ở nhãn thước dim (đoạn nào + chuỗi đang gõ). */
  const [dimEditing, setDimEditing] = useState<{ segmentIndex: number; value: string } | null>(null);
  const dimInputRef = useRef<HTMLInputElement>(null);

  const walls = useBuildingStore((s) => selectActiveLevel(s)?.walls ?? []);
  const openings = useBuildingStore((s) => selectActiveLevel(s)?.openings ?? []);
  const level = useBuildingStore(selectActiveLevel);
  const tool = useBuildingStore((s) => s.tool);
  const view2d = useBuildingStore((s) => s.view2d);
  const camera = useBuildingStore((s) => s.cameras[s.view2d]);
  /** View mặt đứng đang xem (null khi ở mặt bằng Top). */
  const elevView: ElevationView | null = view2d === 'top' ? null : view2d;
  const isTop = elevView === null;
  const unit = useBuildingStore((s) => s.unit);
  const draft = useBuildingStore((s) => s.draft);
  const lengthInput = useBuildingStore((s) => s.lengthInput);
  const cursorWorld = useBuildingStore((s) => s.cursorWorld);
  const selectedWallIds = useBuildingStore((s) => s.selectedWallIds);
  const selectedOpeningIds = useBuildingStore((s) => s.selectedOpeningIds);
  /** Set tra cứu nhanh cho render (centerline/lớp phủ/handle/mặt đứng). */
  const selectedWallSet = useMemo(() => new Set(selectedWallIds), [selectedWallIds]);
  const selectedOpeningSet = useMemo(
    () => new Set(selectedOpeningIds),
    [selectedOpeningIds],
  );

  const c = COLORS;

  // Tường hiệu dụng: áp preview kéo thả lên trên dữ liệu store.
  const effectiveWalls = useMemo(() => {
    if (!dragPreview) return walls;
    const byId = new Map(dragPreview.map((d) => [d.wallId, d.points]));
    return walls.map((w) => (byId.has(w.id) ? { ...w, points: byId.get(w.id) as Point[] } : w));
  }, [walls, dragPreview]);

  // Thân tường nối góc sạch: union các polygon trước khi tô, GIỮ lỗ phòng
  // (dùng WallFill evenodd — Line closed chỉ tô vòng ngoài nên phòng bị tô đầy).
  const mergedPolygons = useMemo(
    () => mergeWallPolygonsWithHoles(effectiveWalls),
    [effectiveWalls],
  );

  // Opening hiệu dụng: áp preview kéo thả lên trên dữ liệu store.
  const effectiveOpenings = useMemo(() => {
    if (!openingPreview) return openings;
    return openings.map((o) =>
      o.id === openingPreview.openingId
        ? { ...o, offset: openingPreview.offset, sillHeight: openingPreview.sillHeight }
        : o,
    );
  }, [openings, openingPreview]);

  // Đo kích thước khung canvas.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  // Căn khung hình vào toàn bộ building, căn giữa theo vùng canvas nhìn thấy
  // (trừ phần bị panel trái + toolbar che). Đây là mốc zoom 100%: vật thể
  // chiếm 80% khung nhìn, còn lề xung quanh để bao quát.
  // Đọc kích thước thật từ container: state `size` khởi tạo 800×600 nên nếu
  // fit theo nó thì camera sẽ kẹt ở góc trên-trái màn hình lớn.
  const panelVisible = useBuildingStore((s) => s.panelVisible);
  const showGrid = useBuildingStore((s) => s.showGrid);
  const computeFit = useCallback((): { scale: number; x: number; y: number } | null => {
    const el = containerRef.current;
    if (!el || el.clientWidth < 100 || el.clientHeight < 100) return null;
    const w = el.clientWidth;
    const h = el.clientHeight;
    // Chiều rộng phần canvas bị che bên trái: panel 300 + toolbar 56 + các
    // khoảng cách; khi panel thu gọn chỉ còn toolbar.
    const overlay = panelVisible ? 388 : 80;
    const centerX = (overlay + w) / 2;
    const visibleW = w - overlay;
    const state = useBuildingStore.getState();
    const clamp = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));
    if (view2d === 'top') {
      // Fit theo khung thật của bản vẽ (không còn hardcode khung nhà cũ):
      // chưa có tường thì giữ khung mặc định 9000×7000 tâm (4000, 3000).
      const lvl = selectActiveLevel(state);
      const b = lvl ? planBounds(lvl.walls) : null;
      const bw = b ? b.x1 - b.x0 : 9000;
      const bh = b ? b.y1 - b.y0 : 7000;
      const cx = b ? (b.x0 + b.x1) / 2 : 4000;
      const cy = b ? (b.y0 + b.y1) / 2 : 3000;
      const scale = clamp(fitScaleFor(bw, bh, visibleW, h));
      return { scale, x: centerX - cx * scale, y: h / 2 - cy * scale };
    }
    // Mặt đứng: fit theo bounding box hình chiếu (Konva y = −v nên cộng v vào y).
    const lvl = selectActiveLevel(state);
    const bounds = lvl ? elevationBounds(lvl.walls, lvl, view2d) : null;
    if (!bounds) return null;
    const bw = Math.max(bounds.u1 - bounds.u0, 1000);
    const bh = Math.max(bounds.vTop - bounds.vBottom, 1000);
    const scale = clamp(fitScaleFor(bw, bh, visibleW, h));
    const uc = (bounds.u0 + bounds.u1) / 2;
    const vc = (bounds.vBottom + bounds.vTop) / 2;
    return { scale, x: centerX - uc * scale, y: h / 2 + vc * scale };
  }, [view2d, panelVisible]);

  // Lần đầu mở mỗi view: fit vào 100%.
  useEffect(() => {
    if (fittedRef.current[view2d]) return;
    const fit = computeFit();
    if (!fit) return;
    fittedRef.current[view2d] = true;
    const state = useBuildingStore.getState();
    state.setCamera(fit);
    state.setFitScale(fit.scale);
  }, [size, view2d, computeFit]);

  // Mốc 100% thay đổi theo khung nhìn (đổi cửa sổ, đóng/mở panel, đổi view):
  // cập nhật fitScale để pill Zoom hiển thị đúng — KHÔNG di chuyển camera.
  useEffect(() => {
    const fit = computeFit();
    if (!fit) return;
    const state = useBuildingStore.getState();
    if (Math.abs(state.fitScale - fit.scale) > 1e-9) state.setFitScale(fit.scale);
  }, [size, computeFit]);

  // Về 100% theo yêu cầu (Shift+1 / bấm pill Zoom): mỗi yêu cầu chỉ fit 1 lần.
  const fitRequest = useBuildingStore((s) => s.fitRequest);
  const handledFitRef = useRef(useBuildingStore.getState().fitRequest);
  useEffect(() => {
    if (fitRequest === handledFitRef.current) return;
    handledFitRef.current = fitRequest;
    const fit = computeFit();
    if (!fit) return;
    const state = useBuildingStore.getState();
    state.setCamera(fit);
    state.setFitScale(fit.scale);
  }, [fitRequest, computeFit]);

  // Theo dõi phím Space để pan.
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        spaceRef.current = true;
        e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === 'Space') spaceRef.current = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  // Esc hủy lần kéo thả / khung kéo đang dở (không commit).
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (marqueeRef.current) {
        marqueeRef.current = null;
        setMarqueeRect(null);
      }
      if (!dragRef.current) return;
      dragRef.current = null;
      setDragPreview(null);
      setOpeningPreview(null);
      stageRef.current?.container().style.removeProperty('cursor');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const toWorld = (sx: number, sy: number): Point => ({
    x: Math.round((sx - camera.x) / camera.scale),
    y: Math.round((sy - camera.y) / camera.scale),
  });

  /** Mặt đứng: (u = vị trí dọc mặt đứng, z = cao độ); Konva y = −v. */
  const toElevation = (sx: number, sy: number): { u: number; z: number } => ({
    u: Math.round((sx - camera.x) / camera.scale),
    z: Math.round(-(sy - camera.y) / camera.scale),
  });

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const oldScale = camera.scale;
    const newScale = Math.min(
      MAX_SCALE,
      Math.max(MIN_SCALE, oldScale * Math.exp(-e.evt.deltaY * 0.0015)),
    );
    const k = newScale / oldScale;
    useBuildingStore.getState().setCamera({
      scale: newScale,
      x: pointer.x - (pointer.x - camera.x) * k,
      y: pointer.y - (pointer.y - camera.y) * k,
    });
  };

  const handleMouseMove = (_e: KonvaEventObject<MouseEvent>) => {
    const stage = stageRef.current;
    if (!stage) return;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const state = useBuildingStore.getState();

    // Mặt đứng: kéo cửa (ngang đổi offset, dọc đổi sill) + pan + tọa độ (U/Z).
    if (!isTop) {
      const elevDrag = dragRef.current;
      if (elevDrag && elevDrag.kind === 'opening-elev') {
        const { u, z } = toElevation(pointer.x, pointer.y);
        if (!elevDrag.active) {
          if (
            Math.hypot(pointer.x - elevDrag.startScreen.x, pointer.y - elevDrag.startScreen.y) <
            DRAG_THRESHOLD_PX
          ) {
            return;
          }
          elevDrag.active = true;
        }
        const wall = walls.find((w) => w.id === elevDrag.wallId);
        const opening = openings.find((o) => o.id === elevDrag.openingId);
        if (!wall || !opening || !level) return;
        const siblings = openings.filter((o) => o.wallId === wall.id);
        const newOffset = elevDrag.canMoveU
          ? clampOffset(
              wall,
              siblings,
              opening.id,
              elevDrag.origOffset +
                (elevationUToOffset(wall, elevDrag.view, u) -
                  elevationUToOffset(wall, elevDrag.view, elevDrag.grabU)),
            )
          : elevDrag.origOffset;
        const newSill = clampSill(
          wall.height ?? level.height,
          opening,
          elevDrag.origSill + (z - elevDrag.grabV),
        );
        setOpeningPreview({ openingId: opening.id, offset: newOffset, sillHeight: newSill });
        state.setCursor({ x: u, y: z }, null);
        return;
      }
      if (panRef.current) {
        const { sx, sy, cx, cy } = panRef.current;
        state.setCamera({
          x: cx + (pointer.x - sx),
          y: cy + (pointer.y - sy),
        });
        return;
      }
      const { u, z } = toElevation(pointer.x, pointer.y);
      state.setCursor({ x: u, y: z }, null);
      return;
    }

    // Kéo đầu mút / thân tường / cửa: cập nhật preview (chưa commit).
    const drag = dragRef.current;
    if (drag) {
      const raw = toWorld(pointer.x, pointer.y);
      if (drag.kind === 'opening-top') {
        if (!drag.active) {
          if (
            Math.hypot(pointer.x - drag.startScreen.x, pointer.y - drag.startScreen.y) <
            DRAG_THRESHOLD_PX
          ) {
            return;
          }
          drag.active = true;
        }
        const wall = walls.find((w) => w.id === drag.wallId);
        const opening = openings.find((o) => o.id === drag.openingId);
        if (!wall || !opening) return;
        const cursorOffset = projectPointOnWall(raw, wall).offset;
        const siblings = openings.filter((o) => o.wallId === wall.id);
        const newOffset = clampOffset(
          wall,
          siblings,
          opening.id,
          drag.origOffset + (cursorOffset - drag.grabOffset),
        );
        setOpeningPreview({ openingId: opening.id, offset: newOffset, sillHeight: drag.origSill });
        state.setCursor(raw, null);
        return;
      }
      const movingIds = drag.kind === 'move' ? drag.wallIds : [drag.wallId];
      const others = walls.filter((w) => !movingIds.includes(w.id));
      if (drag.kind === 'endpoint') {
        const snap = computeSnap(raw, others, camera.scale, drag.fixed);
        // Không cho đoạn kề co về 0: điểm mới phải cách mọi đỉnh kề (của
        // mọi vị trí đang kéo — vòng khép kín kéo 2 chỉ số cùng lúc) ≥ 1mm.
        const wall = walls.find((w) => w.id === drag.wallId);
        const blocked = drag.indices.some((idx) => {
          const prev = wall?.points[idx - 1];
          const next = wall?.points[idx + 1];
          return (
            (prev && distance(prev, snap.point) < 1) ||
            (next && distance(next, snap.point) < 1)
          );
        });
        if (blocked) return;
        setDragPreview((prevState) => {
          if (!prevState) return prevState;
          return prevState.map((entry) =>
            entry.wallId === drag.wallId
              ? {
                  ...entry,
                  points: entry.points.map((p, i) =>
                    drag.indices.includes(i) ? snap.point : p,
                  ),
                }
              : entry,
          );
        });
        state.setCursor(snap.point, snap.kind);
      } else if (drag.kind === 'move') {
        const snap = computeSnap(raw, others, camera.scale, null);
        const dx = snap.point.x - drag.grab.x;
        const dy = snap.point.y - drag.grab.y;
        // Cả nhóm cùng dịch theo đúng delta của tường đang kéo.
        setDragPreview(
          drag.wallIds.map((id) => ({
            wallId: id,
            points: (drag.origById[id] ?? []).map((p) => ({ x: p.x + dx, y: p.y + dy })),
          })),
        );
        state.setCursor(snap.point, snap.kind);
      }
      return;
    }

    // Khung kéo chọn (marquee): dưới ngưỡng 3px thì chưa hiện, tính là click.
    if (marqueeRef.current) {
      const m = marqueeRef.current;
      if (Math.hypot(pointer.x - m.startScreen.x, pointer.y - m.startScreen.y) >= 3) {
        const raw = toWorld(pointer.x, pointer.y);
        setMarqueeRect({
          x0: Math.min(m.startWorld.x, raw.x),
          y0: Math.min(m.startWorld.y, raw.y),
          x1: Math.max(m.startWorld.x, raw.x),
          y1: Math.max(m.startWorld.y, raw.y),
        });
      }
      return;
    }

    if (panRef.current) {
      const { sx, sy, cx, cy } = panRef.current;
      useBuildingStore.getState().setCamera({
        x: cx + (pointer.x - sx),
        y: cy + (pointer.y - sy),
      });
      return;
    }

    const raw = toWorld(pointer.x, pointer.y);
    if (tool === 'wall') {
      const snap = computeSnap(raw, walls, camera.scale, state.draft?.start ?? null);
      state.setCursor(snap.point, snap.kind);
      if (state.draft) state.setDraft({ ...state.draft, current: snap.point });
    } else {
      state.setCursor(raw, null);
    }
  };

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    // Mousedown mới = cử chỉ mới: cờ chặn click từ lần kéo trước đã hết hạn.
    suppressClickRef.current = false;
    const stage = stageRef.current;
    if (!stage) return;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const isMiddle = e.evt.button === 1;
    if (isMiddle || (spaceRef.current && e.evt.button === 0)) {
      panRef.current = { sx: pointer.x, sy: pointer.y, cx: camera.x, cy: camera.y };
      return;
    }
    if (e.evt.button !== 0) return;
    // Mặt đứng: không đặt tường/cửa (tool vẽ chỉ chạy ở Top).
    if (!isTop) return;
    const state = useBuildingStore.getState();
    const raw = toWorld(pointer.x, pointer.y);

    // Đặt cửa / cửa sổ lên tường gần nhất.
    if (tool === 'door' || tool === 'window') {
      const hit = findNearestWall(raw, walls, OPENING_PICK_RADIUS_PX / camera.scale);
      if (hit) {
        const opening = createOpening(hit.wall, tool, Math.round(hit.offset));
        state.addOpening(opening);
        state.selectSingle('opening', opening.id);
      }
      return;
    }

    // Khung kéo chọn: tool Select, bấm trái trên VÙNG TRỐNG (target là Stage;
    // bấm lên tường/cửa/handle đã bị cancelBubble ở handler của chúng).
    if (tool === 'select') {
      if (e.target === e.currentTarget) {
        marqueeRef.current = {
          startWorld: raw,
          startScreen: { x: pointer.x, y: pointer.y },
          additive: e.evt.shiftKey,
        };
      }
      return;
    }

    if (tool !== 'wall') return;
    const snap = computeSnap(raw, walls, camera.scale, state.draft?.start ?? null);
    if (!state.draft) {
      state.setDraft({ start: snap.point, current: snap.point });
      return;
    }
    if (distance(state.draft.start, snap.point) < 1) return; // bỏ qua click trùng điểm
    state.addWallOrMerge(createWall(state.draft.start, snap.point));
    state.setDraft({ start: snap.point, current: snap.point });
    state.setLengthInput('');
  };

  const handleMouseUp = () => {
    const wasPanning = panRef.current !== null;
    panRef.current = null;
    // Chốt khung kéo chọn (nếu đã kéo quá ngưỡng 3px thì marqueeRect khác null).
    const marquee = marqueeRef.current;
    marqueeRef.current = null;
    if (marquee && marqueeRect) {
      const hit = marqueeSelect(walls, openings, marqueeRect);
      const state = useBuildingStore.getState();
      if (marquee.additive) {
        state.setSelection(
          [...new Set([...state.selectedWallIds, ...hit.wallIds])],
          [...new Set([...state.selectedOpeningIds, ...hit.openingIds])],
        );
      } else {
        state.setSelection(hit.wallIds, hit.openingIds);
      }
      // Click sinh ngay sau mouseup phải bị chặn (không xóa vùng chọn vừa kéo).
      suppressClickRef.current = true;
    }
    setMarqueeRect(null);
    // Commit lần kéo thả thành 1 history entry (undo được).
    const drag = dragRef.current;
    dragRef.current = null;
    let moved = false;
    if (drag && dragPreview && (drag.kind === 'endpoint' || drag.kind === 'move')) {
      const updates = dragPreview.filter((entry) => {
        const original = walls.find((w) => w.id === entry.wallId);
        return (
          original &&
          (original.points.length !== entry.points.length ||
            original.points.some(
              (p, i) => p.x !== entry.points[i].x || p.y !== entry.points[i].y,
            ))
        );
      });
      if (updates.length > 0) {
        moved = true;
        // Commit + gộp tường trùng đầu mút (kéo đầu tường vào góc tường
        // khác sẽ nối thành polyline) — 1 history entry cho cả nhóm.
        useBuildingStore.getState().commitWallPointsMany(updates);
      }
    }
    if (
      drag &&
      (drag.kind === 'opening-top' || drag.kind === 'opening-elev') &&
      drag.active &&
      openingPreview
    ) {
      moved = true;
      const original = openings.find((o) => o.id === drag.openingId);
      if (
        original &&
        (original.offset !== openingPreview.offset ||
          original.sillHeight !== openingPreview.sillHeight)
      ) {
        useBuildingStore.getState().updateOpening(drag.openingId, {
          offset: openingPreview.offset,
          sillHeight: openingPreview.sillHeight,
        });
      }
    }
    // Chỉ chặn click "dư" khi thật sự đã kéo (di chuyển) hoặc pan: bấm
    // thường (không kéo) vẫn phải chạy handler click để chọn/bỏ chọn.
    if (moved || wasPanning) suppressClickRef.current = true;
    setDragPreview(null);
    setOpeningPreview(null);
    stageRef.current?.container().style.removeProperty('cursor');
  };

  const handleWallClick = (wall: Wall) => (e: KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    // Click sinh sau khi kéo thả/pan: bỏ qua, giữ nguyên vùng chọn.
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    if (tool !== 'select') return;
    const state = useBuildingStore.getState();
    if (e.evt.shiftKey) state.toggleInSelection('wall', wall.id);
    else state.selectSingle('wall', wall.id);
  };

  const handleWallMouseDown = (wall: Wall) => (e: KonvaEventObject<MouseEvent>) => {
    if (tool !== 'select' || e.evt.button !== 0 || spaceRef.current) return;
    // Shift+bấm chỉ toggle ở click, không bắt đầu kéo.
    if (e.evt.shiftKey) return;
    e.cancelBubble = true;
    const stage = stageRef.current;
    const pointer = stage?.getPointerPosition();
    if (!pointer) return;
    const state = useBuildingStore.getState();
    // Tường chưa chọn thì chọn riêng nó; tường đã nằm trong vùng chọn thì
    // giữ nguyên nhóm để kéo cả nhóm cùng dịch chuyển.
    let ids = state.selectedWallIds;
    if (!ids.includes(wall.id)) {
      state.selectSingle('wall', wall.id);
      ids = [wall.id];
    }
    const group = walls.filter((w) => ids.includes(w.id));
    dragRef.current = {
      kind: 'move',
      wallId: wall.id,
      wallIds: group.map((w) => w.id),
      grab: toWorld(pointer.x, pointer.y),
      origById: Object.fromEntries(
        group.map((w) => [w.id, w.points.map((p) => ({ ...p }))]),
      ),
    };
    setDragPreview(
      group.map((w) => ({ wallId: w.id, points: w.points.map((p) => ({ ...p })) })),
    );
  };

  const handleHandleMouseDown =
    (wall: Wall, index: number) => (e: KonvaEventObject<MouseEvent>) => {
      if (tool !== 'select' || e.evt.button !== 0 || spaceRef.current) return;
      e.cancelBubble = true;
      // Điểm neo cho khóa góc 45° khi kéo đỉnh: đỉnh kề (đầu chuỗi → điểm
      // sau nó, cuối chuỗi → điểm trước nó, đỉnh giữa → điểm trước nó).
      const fixed =
        index === 0
          ? wall.points[1]
          : wall.points[index - 1];
      // Vòng khép kín: điểm đầu == điểm cuối — kéo tay nắm ở vị trí đó
      // phải dời CẢ 2 chỉ số để vòng vẫn khép kín.
      const grabbed = wall.points[index];
      const indices = wall.points
        .map((p, i) => (p.x === grabbed.x && p.y === grabbed.y ? i : -1))
        .filter((i) => i >= 0);
      dragRef.current = {
        kind: 'endpoint',
        wallId: wall.id,
        index,
        indices,
        fixed: { ...fixed },
      };
      setDragPreview([{ wallId: wall.id, points: wall.points.map((p) => ({ ...p })) }]);
    };

  const handleOpeningClick = (opening: Opening) => (e: KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    // Click sinh sau khi kéo thả/pan: bỏ qua, giữ nguyên vùng chọn.
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    if (tool !== 'select') return;
    const state = useBuildingStore.getState();
    if (e.evt.shiftKey) state.toggleInSelection('opening', opening.id);
    else state.selectSingle('opening', opening.id);
  };

  const setStageCursor = (cursor: string | null) => {
    const container = stageRef.current?.container();
    if (!container) return;
    if (cursor) container.style.setProperty('cursor', cursor);
    else container.style.removeProperty('cursor');
  };

  /** Bắt đầu kéo cửa ở mặt bằng: kéo dọc tường đổi offset (không sang tường khác). */
  const handleOpeningMouseDownTop =
    (opening: Opening, wall: Wall) => (e: KonvaEventObject<MouseEvent>) => {
      if (tool !== 'select' || e.evt.button !== 0 || spaceRef.current) return;
      // Shift+bấm chỉ toggle ở click, không bắt đầu kéo.
      if (e.evt.shiftKey) return;
      e.cancelBubble = true;
      const stage = stageRef.current;
      const pointer = stage?.getPointerPosition();
      if (!pointer) return;
      const state = useBuildingStore.getState();
      // Cửa chưa chọn thì chọn riêng nó; đã nằm trong vùng chọn thì giữ
      // nguyên nhóm (kéo chỉ dời cửa này, vùng chọn không đổi).
      if (!state.selectedOpeningIds.includes(opening.id)) {
        state.selectSingle('opening', opening.id);
      }
      const grabOffset = projectPointOnWall(toWorld(pointer.x, pointer.y), wall).offset;
      dragRef.current = {
        kind: 'opening-top',
        openingId: opening.id,
        wallId: wall.id,
        grabOffset,
        origOffset: opening.offset,
        origSill: opening.sillHeight,
        startScreen: { x: pointer.x, y: pointer.y },
        active: false,
      };
      setStageCursor('grabbing');
    };

  /** Bắt đầu kéo cửa ở mặt đứng: ngang đổi offset (nếu tường chiếu rộng), dọc đổi sill. */
  const handleOpeningMouseDownElev =
    (opening: Opening, wall: Wall) => (e: KonvaEventObject<MouseEvent>) => {
      if (tool !== 'select' || e.evt.button !== 0 || spaceRef.current || !elevView || !level) return;
      // Shift+bấm chỉ toggle ở click, không bắt đầu kéo.
      if (e.evt.shiftKey) return;
      e.cancelBubble = true;
      const stage = stageRef.current;
      const pointer = stage?.getPointerPosition();
      if (!pointer) return;
      const state = useBuildingStore.getState();
      if (!state.selectedOpeningIds.includes(opening.id)) {
        state.selectSingle('opening', opening.id);
      }
      const { u, z } = toElevation(pointer.x, pointer.y);
      const rect = projectWallToElevation(wall, level, elevView);
      dragRef.current = {
        kind: 'opening-elev',
        openingId: opening.id,
        wallId: wall.id,
        view: elevView,
        grabU: u,
        grabV: z,
        origOffset: opening.offset,
        origSill: opening.sillHeight,
        canMoveU: rect.u1 - rect.u0 > wall.thickness,
        startScreen: { x: pointer.x, y: pointer.y },
        active: false,
      };
      setStageCursor('grabbing');
    };

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    // Click sinh ra ngay sau khi thả chuột kéo thả: bỏ qua, không bỏ chọn.
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    if (e.target === e.currentTarget && tool === 'select') {
      // Shift+bấm vùng trống: giữ nguyên vùng chọn.
      if (!e.evt.shiftKey) useBuildingStore.getState().clearSelection();
    }
  };

  // Lưới thích ứng theo zoom. Mặt đứng: trục ngang u, trục đứng v (Konva y = −v).
  // Các đoạn lưới vẽ bằng `Segments` (rời nhau), không dùng Konva `Line`
  // vì Line nối các điểm thành đường liên tục → sinh đoạn chéo.
  const step = gridStepFor(camera.scale);
  const left = -camera.x / camera.scale;
  const top = -camera.y / camera.scale;
  const right = (size.w - camera.x) / camera.scale;
  const bottom = (size.h - camera.y) / camera.scale;
  const gridLines = computeGridSegments(
    { left, top, right, bottom },
    step,
    isTop ? 'top' : 'elevation',
  );

  // Dữ liệu mặt đứng: tường sắp xa → gần, mỗi tường kèm các lỗ cửa của nó.
  const elevData = useMemo(() => {
    if (elevView === null || !level) return null;
    return sortWallsByDepth(effectiveWalls, level, elevView).map((w) => ({
      wall: w,
      rect: projectWallToElevation(w, level, elevView),
      openings: effectiveOpenings
        .filter((o) => o.wallId === w.id)
        .map((o) => ({ opening: o, rect: projectOpeningToElevation(w, o, level, elevView) })),
    }));
  }, [elevView, level, effectiveWalls, effectiveOpenings]);

  const draftLen = draft ? Math.round(distance(draft.start, draft.current)) : 0;
  /** Tường dùng cho thước dim + sửa dim: chỉ khi đúng 1 tường và 0 cửa được chọn. */
  const selected =
    selectedWallIds.length === 1 && selectedOpeningIds.length === 0
      ? (effectiveWalls.find((w) => w.id === selectedWallIds[0]) ?? null)
      : null;
  /** Mọi tường đã chọn: lớp phủ xanh + tay nắm đỉnh. */
  const selectedWalls = useMemo(
    () => effectiveWalls.filter((w) => selectedWallSet.has(w.id)),
    [effectiveWalls, selectedWallSet],
  );

  // Marker các điểm snap gần con trỏ khi đang dùng tool Tường (bán kính 30px).
  const snapMarkers = useMemo(() => {
    if (tool !== 'wall' || !cursorWorld) return [];
    return snapPointsNear(cursorWorld, walls, 30 / camera.scale);
  }, [tool, cursorWorld, walls, camera.scale]);

  // Đổi vùng chọn trong lúc nhập số ở dim → hủy nhập.
  useEffect(() => {
    setDimEditing(null);
  }, [selectedWallIds, selectedOpeningIds]);

  // Mở ô nhập dim: focus + chọn hết số để gõ đè ngay.
  // Chỉ chạy khi TRẠNG THÁI mở/đóng đổi — không phụ thuộc dimEditing.value,
  // nếu không mỗi phím gõ sẽ select() lại toàn bộ và chỉ giữ được ký tự cuối.
  const dimEditingOpen = dimEditing !== null;
  useEffect(() => {
    if (!dimEditingOpen) return;
    dimInputRef.current?.focus();
    dimInputRef.current?.select();
  }, [dimEditingOpen]);

  /** Chốt độ dài mới từ ô nhập ở thước dim: giữ points[i] của đoạn đang
   * sửa, dời points[i+1] dọc hướng đoạn đó; đoạn kề giữ đầu còn lại cố định
   * nên nó xoay/dài theo. Chặn khi tổng chuỗi mới làm cửa vượt khỏi tường. */
  const commitDimEdit = () => {
    if (!dimEditing || !selected) return;
    const { segmentIndex, value } = dimEditing;
    setDimEditing(null);
    const p0 = selected.points[segmentIndex];
    const p1 = selected.points[segmentIndex + 1];
    if (!p0 || !p1) return;
    const len = Number.parseInt(value, 10);
    if (!Number.isInteger(len) || len <= 0) return;
    if (len === Math.round(distance(p0, p1))) return;
    const newPoints = resizeSegment(selected.points, segmentIndex, len);
    if (newPoints === selected.points) return;
    if (openingsExceedLength(effectiveOpenings, selected.id, pointsLength(newPoints))) {
      const minLen = Math.max(
        ...effectiveOpenings
          .filter((o) => o.wallId === selected.id)
          .map((o) => o.offset + o.width),
      );
      window.alert(
        `Không thể rút ngắn tường: cửa sẽ vượt khỏi tường (cần ít nhất ${minLen} mm).`,
      );
      return;
    }
    useBuildingStore.getState().updateWall(selected.id, { points: newPoints });
  };

  // Pill nổi length/angle bám theo con trỏ khi đang vẽ tường (kiểu Synaps):
  // vị trí theo tọa độ màn hình của draft.current, kẹp trong khung canvas.
  let pill: { x: number; y: number; lengthText: string; angleText: string } | null = null;
  if (draft) {
    const dx = draft.current.x - draft.start.x;
    const dy = draft.current.y - draft.start.y;
    const deg = Math.round(((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360);
    const px = camera.x + draft.current.x * camera.scale + 16;
    const py = camera.y + draft.current.y * camera.scale - 44;
    pill = {
      x: Math.min(Math.max(px, 8), Math.max(8, size.w - 240)),
      y: Math.min(Math.max(py, 8), Math.max(8, size.h - 48)),
      lengthText: lengthInput ? `${lengthInput} mm — Enter để chốt` : fmt(draftLen, unit),
      angleText: `⌐ ${deg}°`,
    };
  }

  // Dimension cho từng đoạn của tường đang chọn (chỉ mặt bằng Top): mỗi đoạn
  // 1 thước song song, offset 600mm về phía xa tâm building (phía trống),
  // mũi tên hở 2 đầu + nhãn. Mảng căn theo chỉ số đoạn (đoạn dài 0 → null).
  const dims: (SegmentDim | null)[] = [];
  if (isTop && selected) {
    // Tâm bounding box của toàn bộ tường — dimension đặt về phía xa tâm.
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const w of effectiveWalls) {
      for (const p of w.points) {
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
      }
    }
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    for (let i = 0; i + 1 < selected.points.length; i++) {
      const p0 = selected.points[i];
      const p1 = selected.points[i + 1];
      dims.push(p0 && p1 ? segmentDim(p0, p1, cx, cy, unit) : null);
    }
  }
  /** Thước dim của đoạn đang nhập số (ô input HTML đặt tại nhãn của nó). */
  const editingDim = dimEditing ? dims[dimEditing.segmentIndex] : undefined;

  // Nhãn trực tiếp khi kéo cửa: offset (mặt bằng) / offset + sill (mặt đứng).
  let dragLabel: { x: number; y: number; text: string } | null = null;
  if (openingPreview) {
    const o = effectiveOpenings.find((x) => x.id === openingPreview.openingId);
    const w = o && effectiveWalls.find((x) => x.id === o.wallId);
    if (o && w) {
      if (isTop) {
        const { a, b } = openingFrame(o, w);
        dragLabel = {
          x: (a.x + b.x) / 2,
          y: (a.y + b.y) / 2 - 24 / camera.scale,
          text: `offset ${fmt(o.offset, unit)}`,
        };
      } else if (elevView && level) {
        const r = projectOpeningToElevation(w, o, level, elevView);
        dragLabel = {
          x: (r.u0 + r.u1) / 2,
          y: -r.vTop - 24 / camera.scale,
          text: `offset ${fmt(o.offset, unit)} · sill ${fmt(o.sillHeight, unit)}`,
        };
      }
    }
  }

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden" style={{ background: c.bg }}>
      <Stage
        ref={stageRef}
        width={size.w}
        height={size.h}
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleStageClick}
        style={{
          cursor:
            spaceRef.current
              ? 'grab'
              : isTop && (tool === 'wall' || tool === 'door' || tool === 'window')
                ? 'crosshair'
                : 'default',
        }}
      >
        <Layer x={camera.x} y={camera.y} scaleX={camera.scale} scaleY={camera.scale}>
          {showGrid && (
            <Segments points={gridLines} stroke={c.grid} strokeWidth={1 / camera.scale} />
          )}
          {isTop ? (
            <Segments
              points={[0, top, 0, bottom, left, 0, right, 0]}
              stroke={c.axis}
              strokeWidth={1 / camera.scale}
            />
          ) : (
            <>
              {/* Mặt đất z=0 (đậm) + cao độ đỉnh tầng (nét đứt). */}
              <Line
                points={[left, 0, right, 0]}
                stroke={c.axis}
                strokeWidth={2 / camera.scale}
                listening={false}
              />
              {level && (
                <Line
                  points={[
                    left, -(level.elevation + level.height),
                    right, -(level.elevation + level.height),
                  ]}
                  stroke={c.axis}
                  strokeWidth={1 / camera.scale}
                  dash={[8 / camera.scale, 6 / camera.scale]}
                  listening={false}
                />
              )}
            </>
          )}

          {isTop ? (
            <>
          {/* Thân tường: tô từ union (nối góc sạch, giữ lỗ phòng), không nhận click. */}
          <WallFill
            polygons={mergedPolygons}
            fill={c.wallFill}
            stroke={c.wallStroke}
            strokeWidth={1 / camera.scale}
          />

          {/* Đường tâm từng tường: 1 Line polyline qua mọi đỉnh + vùng click
              rộng bằng thân tường. */}
          {effectiveWalls.map((w) => {
            const isSel = selectedWallSet.has(w.id);
            return (
              <Line
                key={`${w.id}-c`}
                points={w.points.flatMap((p) => [p.x, p.y])}
                stroke={isSel ? c.selected : c.center}
                strokeWidth={1 / camera.scale}
                dash={[6 / camera.scale, 6 / camera.scale]}
                hitStrokeWidth={Math.max(w.thickness, 12 / camera.scale)}
                onClick={handleWallClick(w)}
                onMouseDown={handleWallMouseDown(w)}
              />
            );
          })}

          {/* Mọi tường đang chọn: tô đè từng đoạn + vá góc miter bằng màu chọn. */}
          {selectedWalls.map((w) =>
            [...wallSegmentPolygons(w), ...wallCornerPatches(w)].map((poly, i) => (
              <Line
                key={`${w.id}-sel-${i}`}
                points={poly}
                closed
                fill={c.selected}
                opacity={0.85}
                listening={false}
              />
            )),
          )}

          {/* Openings: cửa đi (khoảng trống + cánh + cung mở), cửa sổ (2 nét thấy tường + 2 đường khung). */}
          {effectiveOpenings.map((o) => {
            const wall = effectiveWalls.find((w) => w.id === o.wallId);
            if (!wall) return null;
            const isSel = selectedOpeningSet.has(o.id);
            const { a } = openingFrame(o, wall);
            const half = wall.thickness / 2;
            const stroke = isSel ? c.selected : c.wallStroke;
            if (o.type === 'door') {
              const swing = doorSwing(o, wall);
              const leafEnd = swing.leafEnd;
              return (
                <Fragment key={o.id}>
                  {/* Khoảng trống trên thân tường. */}
                  <Line
                    points={openingPolygon(o, wall, half + 3 / camera.scale)}
                    closed
                    fill={c.bg}
                    listening={false}
                  />
                  {/* Cánh cửa + cung 90° thể hiện hướng mở (flip đảo phía). */}
                  <Line
                    points={[a.x, a.y, leafEnd.x, leafEnd.y]}
                    stroke={stroke}
                    strokeWidth={1.5 / camera.scale}
                    listening={false}
                  />
                  <Arc
                    x={a.x}
                    y={a.y}
                    innerRadius={0}
                    outerRadius={o.width}
                    angle={swing.arcAngle}
                    rotation={swing.arcRotation}
                    stroke={stroke}
                    strokeWidth={1.5 / camera.scale}
                    listening={false}
                  />
                  {/* Vùng click chọn + kéo thả opening (phủ đúng lỗ cửa). */}
                  <Line
                    points={openingPolygon(o, wall, half)}
                    closed
                    fill="rgba(0,0,0,0)"
                    stroke={isSel ? c.selected : 'rgba(0,0,0,0)'}
                    strokeWidth={2 / camera.scale}
                    onClick={handleOpeningClick(o)}
                    onMouseDown={handleOpeningMouseDownTop(o, wall)}
                    onMouseEnter={() => {
                      if (tool === 'select') setStageCursor('grab');
                    }}
                    onMouseLeave={() => setStageCursor(null)}
                  />
                </Fragment>
              );
            }
            // Window: khoét tường tại lỗ cửa (như cửa đi), rồi vẽ lại
            // 2 nét thấy của tường (2 mép tường chạy suốt qua lỗ —
            // tường dưới bậu vẫn còn) + 2 đường khung trong lỗ.
            const lines = windowLines(o, wall);
            const seg = (s: [Point, Point]) => [s[0].x, s[0].y, s[1].x, s[1].y];
            return (
              <Fragment key={o.id}>
                {/* Khoảng trống trên thân tường (che cả viền tường + đường tâm). */}
                <Line
                  points={openingPolygon(o, wall, half + 3 / camera.scale)}
                  closed
                  fill={c.bg}
                  listening={false}
                />
                {/* Nét thấy 2 mặt tường: cùng nét với viền tường (1/scale). */}
                <Line
                  points={seg(lines.facePlus)}
                  stroke={stroke}
                  strokeWidth={1 / camera.scale}
                  listening={false}
                />
                <Line
                  points={seg(lines.faceMinus)}
                  stroke={stroke}
                  strokeWidth={1 / camera.scale}
                  listening={false}
                />
                {/* 2 đường khung. */}
                <Line
                  points={seg(lines.framePlus)}
                  stroke={stroke}
                  strokeWidth={1.5 / camera.scale}
                  listening={false}
                />
                <Line
                  points={seg(lines.frameMinus)}
                  stroke={stroke}
                  strokeWidth={1.5 / camera.scale}
                  listening={false}
                />
                <Line
                  points={openingPolygon(o, wall, half)}
                  closed
                  fill="rgba(0,0,0,0)"
                  stroke={isSel ? c.selected : 'rgba(0,0,0,0)'}
                  strokeWidth={2 / camera.scale}
                  onClick={handleOpeningClick(o)}
                  onMouseDown={handleOpeningMouseDownTop(o, wall)}
                  onMouseEnter={() => {
                    if (tool === 'select') setStageCursor('grab');
                  }}
                  onMouseLeave={() => setStageCursor(null)}
                />
              </Fragment>
            );
          })}

          {/* Dimension cho từng đoạn của tường đang chọn. */}
          {dims.map((d, i) =>
            d ? (
              <Fragment key={`dim-${i}`}>
                <Segments points={d.ext} stroke={c.dim} strokeWidth={1 / camera.scale} />
                <Line points={d.line} stroke={c.dim} strokeWidth={1.5 / camera.scale} listening={false} />
                <Segments points={d.arrows} stroke={c.dim} strokeWidth={1.5 / camera.scale} />
                {/* Bấm nhãn để nhập độ dài trực tiếp đoạn đó (ẩn khi đang nhập đoạn này,
                    ô input HTML hiện thay; nhãn các đoạn khác vẫn hiện). */}
                {!(dimEditing && dimEditing.segmentIndex === i) && (
                  <Text
                    x={d.lx}
                    y={d.ly}
                    text={d.label}
                    fontSize={13 / camera.scale}
                    fill={c.dim}
                    rotation={d.rot}
                    offsetX={(d.label.length * 8) / camera.scale / 2}
                    offsetY={7 / camera.scale}
                    onClick={(e) => {
                      e.cancelBubble = true;
                      if (selected) {
                        const p0 = selected.points[i];
                        const p1 = selected.points[i + 1];
                        if (p0 && p1) {
                          setDimEditing({
                            segmentIndex: i,
                            value: String(Math.round(distance(p0, p1))),
                          });
                        }
                      }
                    }}
                    onMouseEnter={() => setStageCursor('pointer')}
                    onMouseLeave={() => setStageCursor(null)}
                  />
                )}
              </Fragment>
            ) : null,
          )}

          {/* Handle ở MỌI đỉnh của MỌI tường đang chọn (kéo đỉnh chỉ sửa
              tường đó, giữ nguyên vùng chọn). Vòng khép kín: điểm đầu ==
              điểm cuối → chỉ 1 tay nắm cho vị trí trùng đó (kéo nó dời
              cả 2 chỉ số). */}
          {selectedWalls.map((w) =>
            w.points
              .map((p, i) => ({ p, i }))
              .filter(
                ({ p, i }) =>
                  w.points.findIndex((q) => q.x === p.x && q.y === p.y) === i,
              )
              .map(({ p, i }) => (
              <Circle
                key={`${w.id}-h-${i}`}
                x={p.x}
                y={p.y}
                radius={6 / camera.scale}
                fill={c.bg}
                stroke={c.selected}
                strokeWidth={2 / camera.scale}
                onMouseDown={handleHandleMouseDown(w, i)}
                onMouseEnter={(e) => {
                  e.target.getStage()?.container().style.setProperty('cursor', 'pointer');
                }}
                onMouseLeave={(e) => {
                  e.target.getStage()?.container().style.removeProperty('cursor');
                }}
              />
            )),
          )}

          {/* Draft preview */}
          {draft && draftLen > 0 && (
            <>
              <Line
                points={wallPolygon(draft.start, draft.current, 200)}
                closed
                fill={c.draft}
                opacity={0.45}
                listening={false}
              />
              <Line
                points={[draft.start.x, draft.start.y, draft.current.x, draft.current.y]}
                stroke={c.draft}
                strokeWidth={1.5 / camera.scale}
                dash={[8 / camera.scale, 6 / camera.scale]}
                listening={false}
              />
            </>
          )}

          {/* Marker snap: vòng tròn xanh + dấu "+" ở tâm. */}
          {draft && (
            <>
              <Circle
                x={draft.current.x}
                y={draft.current.y}
                radius={6 / camera.scale}
                stroke={c.snap}
                strokeWidth={1.5 / camera.scale}
                listening={false}
              />
              <Segments
                points={[
                  draft.current.x - 5 / camera.scale, draft.current.y,
                  draft.current.x + 5 / camera.scale, draft.current.y,
                  draft.current.x, draft.current.y - 5 / camera.scale,
                  draft.current.x, draft.current.y + 5 / camera.scale,
                ]}
                stroke={c.snap}
                strokeWidth={1.5 / camera.scale}
              />
            </>
          )}

          {/* Marker điểm snap gần con trỏ (tool Tường): vuông = đầu mút,
              tròn = trung điểm, thoi = chân vuông góc, X = giao điểm. */}
          {snapMarkers.map((m) => {
            const s = camera.scale;
            const key = `${m.kind}-${m.point.x}-${m.point.y}`;
            if (m.kind === 'endpoint') {
              const h = 7 / s;
              return (
                <Rect
                  key={key}
                  x={m.point.x - h / 2}
                  y={m.point.y - h / 2}
                  width={h}
                  height={h}
                  stroke={c.snap}
                  strokeWidth={1.5 / s}
                  listening={false}
                />
              );
            }
            if (m.kind === 'midpoint') {
              return (
                <Circle
                  key={key}
                  x={m.point.x}
                  y={m.point.y}
                  radius={4 / s}
                  stroke={c.snap}
                  strokeWidth={1.5 / s}
                  listening={false}
                />
              );
            }
            if (m.kind === 'perpendicular') {
              const h = 7 / s;
              return (
                <Rect
                  key={key}
                  x={m.point.x}
                  y={m.point.y}
                  offsetX={h / 2}
                  offsetY={h / 2}
                  width={h}
                  height={h}
                  rotation={45}
                  stroke={c.snap}
                  strokeWidth={1.5 / s}
                  listening={false}
                />
              );
            }
            const h = 3.5 / s;
            return (
              <Segments
                key={key}
                points={[
                  m.point.x - h, m.point.y - h, m.point.x + h, m.point.y + h,
                  m.point.x - h, m.point.y + h, m.point.x + h, m.point.y - h,
                ]}
                stroke={c.snap}
                strokeWidth={1.5 / s}
              />
            );
          })}
            </>
          ) : (
            <>
              {/* Mặt đứng: tường vẽ xa → gần (tường gần đè lên), mỗi tường
                  kèm lỗ cửa của nó để tường gần che đúng lỗ của tường xa. */}
              {elevData?.map(({ wall, rect, openings: ops }) => {
                const isSel = selectedWallSet.has(wall.id);
                return (
                  <Fragment key={wall.id}>
                    <Rect
                      x={rect.u0}
                      y={-rect.vTop}
                      width={Math.max(rect.u1 - rect.u0, 1)}
                      height={Math.max(rect.vTop - rect.vBottom, 1)}
                      fill={isSel ? c.selected : c.wallFill}
                      stroke={isSel ? c.selected : c.wallStroke}
                      strokeWidth={1 / camera.scale}
                      opacity={isSel ? 0.85 : 1}
                      onClick={handleWallClick(wall)}
                    />
                    {ops.map(({ opening, rect: o }) => {
                      const oSel = selectedOpeningSet.has(opening.id);
                      const stroke = oSel ? c.selected : c.wallStroke;
                      // Tường chiếu rộng: kéo 2 chiều (grab); mép mỏng: chỉ kéo dọc đổi sill (ns-resize).
                      const canMoveU = rect.u1 - rect.u0 > wall.thickness;
                      return (
                        <Fragment key={opening.id}>
                          <Rect
                            x={o.u0}
                            y={-o.vTop}
                            width={Math.max(o.u1 - o.u0, 1)}
                            height={Math.max(o.vTop - o.vBottom, 1)}
                            fill={c.bg}
                            stroke={stroke}
                            strokeWidth={1.5 / camera.scale}
                            onClick={handleOpeningClick(opening)}
                            onMouseDown={handleOpeningMouseDownElev(opening, wall)}
                            onMouseEnter={() => {
                              if (tool === 'select') setStageCursor(canMoveU ? 'grab' : 'ns-resize');
                            }}
                            onMouseLeave={() => setStageCursor(null)}
                          />
                          {opening.type === 'door' ? (
                            <Line
                              points={[o.u0, -o.vBottom, o.u0, -o.vTop]}
                              stroke={stroke}
                              strokeWidth={1.5 / camera.scale}
                              listening={false}
                            />
                          ) : (
                            <Line
                              points={[o.u0, -(o.vBottom + o.vTop) / 2, o.u1, -(o.vBottom + o.vTop) / 2]}
                              stroke={stroke}
                              strokeWidth={1.5 / camera.scale}
                              listening={false}
                            />
                          )}
                        </Fragment>
                      );
                    })}
                  </Fragment>
                );
              })}
            </>
          )}

          {/* Hình chữ nhật khung kéo chọn (marquee, chỉ mặt bằng Top). */}
          {isTop && marqueeRect && (
            <Rect
              x={marqueeRect.x0}
              y={marqueeRect.y0}
              width={Math.max(marqueeRect.x1 - marqueeRect.x0, 1)}
              height={Math.max(marqueeRect.y1 - marqueeRect.y0, 1)}
              stroke={c.selected}
              strokeWidth={1 / camera.scale}
              dash={[6 / camera.scale, 4 / camera.scale]}
              fill="rgba(59,155,214,0.08)"
              listening={false}
            />
          )}

          {/* Nhãn offset/sill khi đang kéo cửa. */}
          {dragLabel && (
            <Text
              x={dragLabel.x}
              y={dragLabel.y}
              text={dragLabel.text}
              fontSize={13 / camera.scale}
              fill={c.selected}
              offsetX={(dragLabel.text.length * 8) / camera.scale / 2}
              listening={false}
            />
          )}
        </Layer>
      </Stage>
      {/* Pill nổi length/angle khi đang vẽ tường (thay Text độ dài cũ trên canvas). */}
      {pill && (
        <div
          className="pointer-events-none absolute z-10 flex items-center gap-2 rounded-full border border-syn-border bg-white px-3 py-1.5 text-[13px] text-syn-ink shadow-md"
          style={{ left: pill.x, top: pill.y }}
        >
          <span>{pill.lengthText}</span>
          <span className="text-syn-grey">{pill.angleText}</span>
        </div>
      )}
      {/* Ô nhập độ dài trực tiếp tại nhãn thước dim của đoạn đang sửa:
          Enter chốt, Esc / blur hủy. */}
      {editingDim && dimEditing && (
        <input
          ref={dimInputRef}
          value={dimEditing.value}
          inputMode="numeric"
          onChange={(e) =>
            setDimEditing((prev) => (prev ? { ...prev, value: e.target.value } : prev))
          }
          onKeyDown={(e) => {
            e.nativeEvent.stopPropagation();
            if (e.key === 'Enter') commitDimEdit();
            else if (e.key === 'Escape') setDimEditing(null);
          }}
          onBlur={() => setDimEditing(null)}
          className="absolute z-10 w-[120px] rounded-full border border-syn-border bg-white px-3 py-1 text-center text-[13px] tabular-nums text-syn-ink shadow-md outline-none"
          style={{
            left: camera.x + editingDim.lx * camera.scale,
            top: camera.y + editingDim.ly * camera.scale,
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
    </div>
  );
}
