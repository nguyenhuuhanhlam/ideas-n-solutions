import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { Arc, Layer, Line, Circle, Stage, Text } from 'react-konva';
import { distance, mergeWallPolygons, midpoint, wallLength, wallPolygon } from '../model/geometry';
import type { Opening, Point, Wall } from '../model/schema';
import { selectActiveLevel, useBuildingStore, type Unit } from '../store/useBuildingStore';
import { computeSnap, createWall } from '../tools/wallTool';
import { createOpening, findNearestWall } from '../tools/openingTool';

/**
 * Quy ước tọa độ: 1px = 1mm ở scale 1. Gốc world (0,0) ban đầu ở giữa stage.
 * Y hướng XUỐNG như màn hình (khác hệ CAD). Khi xuất DXF giai đoạn sau
 * sẽ lật Y (y_dxf = -y).
 */

const MIN_SCALE = 0.1;
const MAX_SCALE = 10;
const GRID_STEPS = [100, 500, 1000, 5000];
const OPENING_PICK_RADIUS_PX = 15;
const DIM_OFFSET = 600; // mm, khoảng cách đường kích thước khỏi tường

function gridStepFor(scale: number): number {
  for (const s of GRID_STEPS) if (s * scale >= 24) return s;
  return 5000;
}

function fmt(valueMm: number, unit: Unit): string {
  return unit === 'mm' ? `${Math.round(valueMm)} mm` : `${(valueMm / 1000).toFixed(2)} m`;
}

const COLORS = {
  light: {
    bg: '#f8f8f7',
    grid: '#e4e4e0',
    axis: '#c9c9c4',
    wallFill: '#3f3f46',
    wallStroke: '#27272a',
    center: '#a1a1aa',
    selected: '#2563eb',
    draft: '#2563eb',
    snap: '#dc2626',
    text: '#18181b',
    dim: '#71717a',
  },
  dark: {
    bg: '#17171a',
    grid: '#26262b',
    axis: '#3a3a41',
    wallFill: '#d4d4d8',
    wallStroke: '#e4e4e7',
    center: '#71717a',
    selected: '#60a5fa',
    draft: '#60a5fa',
    snap: '#f87171',
    text: '#f4f4f5',
    dim: '#a1a1aa',
  },
} as const;

/** Trạng thái kéo thả (transient, chỉ preview — commit vào store khi thả chuột). */
type DragState =
  | { kind: 'endpoint'; wallId: string; end: 'start' | 'end'; fixed: Point }
  | { kind: 'move'; wallId: string; grab: Point; origStart: Point; origEnd: Point };

interface DragPreview {
  wallId: string;
  start: Point;
  end: Point;
}

/** Các điểm của opening dọc tường: a = mép đầu, b = mép cuối, n = pháp tuyến. */
function openingFrame(opening: Opening, wall: Wall) {
  const len = wallLength(wall);
  const ux = len === 0 ? 1 : (wall.end.x - wall.start.x) / len;
  const uy = len === 0 ? 0 : (wall.end.y - wall.start.y) / len;
  const nx = -uy;
  const ny = ux;
  const at = (t: number): Point => ({
    x: wall.start.x + ux * t,
    y: wall.start.y + uy * t,
  });
  return { a: at(opening.offset), b: at(opening.offset + opening.width), nx, ny, ux, uy };
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

export default function View2D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const spaceRef = useRef(false);
  const panRef = useRef<{ sx: number; sy: number; cx: number; cy: number } | null>(null);
  const fittedRef = useRef(false);
  const dragRef = useRef<DragState | null>(null);
  const [dragPreview, setDragPreview] = useState<DragPreview | null>(null);

  const walls = useBuildingStore((s) => selectActiveLevel(s)?.walls ?? []);
  const openings = useBuildingStore((s) => selectActiveLevel(s)?.openings ?? []);
  const tool = useBuildingStore((s) => s.tool);
  const camera = useBuildingStore((s) => s.camera);
  const theme = useBuildingStore((s) => s.theme);
  const unit = useBuildingStore((s) => s.unit);
  const draft = useBuildingStore((s) => s.draft);
  const selectedWallId = useBuildingStore((s) => s.selectedWallId);
  const selectedOpeningId = useBuildingStore((s) => s.selectedOpeningId);

  const c = COLORS[theme];

  // Tường hiệu dụng: áp preview kéo thả lên trên dữ liệu store.
  const effectiveWalls = useMemo(() => {
    if (!dragPreview) return walls;
    return walls.map((w) =>
      w.id === dragPreview.wallId
        ? { ...w, start: dragPreview.start, end: dragPreview.end }
        : w,
    );
  }, [walls, dragPreview]);

  // Thân tường nối góc sạch: union các polygon trước khi tô.
  const mergedPolygons = useMemo(
    () => mergeWallPolygons(effectiveWalls),
    [effectiveWalls],
  );

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

  // Lần đầu: căn giữa building trong khung.
  useEffect(() => {
    if (fittedRef.current || size.w < 10 || size.h < 10) return;
    fittedRef.current = true;
    const scale = Math.min(
      MAX_SCALE,
      Math.max(MIN_SCALE, Math.min((size.w - 80) / 9000, (size.h - 80) / 7000)),
    );
    useBuildingStore.getState().setCamera({
      scale,
      x: size.w / 2 - 4000 * scale,
      y: size.h / 2 - 3000 * scale,
    });
  }, [size]);

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

  const toWorld = (sx: number, sy: number): Point => ({
    x: Math.round((sx - camera.x) / camera.scale),
    y: Math.round((sy - camera.y) / camera.scale),
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

    // Kéo đầu mút / thân tường: cập nhật preview (chưa commit).
    const drag = dragRef.current;
    if (drag) {
      const raw = toWorld(pointer.x, pointer.y);
      const others = walls.filter((w) => w.id !== drag.wallId);
      if (drag.kind === 'endpoint') {
        const snap = computeSnap(raw, others, camera.scale, drag.fixed);
        if (distance(drag.fixed, snap.point) < 1) return; // không cho tường co về 0
        setDragPreview((prev) => {
          if (!prev) return prev;
          const next =
            drag.end === 'start'
              ? { ...prev, start: snap.point }
              : { ...prev, end: snap.point };
          return next;
        });
        state.setCursor(snap.point, snap.kind);
      } else {
        const snap = computeSnap(raw, others, camera.scale, null);
        const dx = snap.point.x - drag.grab.x;
        const dy = snap.point.y - drag.grab.y;
        setDragPreview({
          wallId: drag.wallId,
          start: { x: drag.origStart.x + dx, y: drag.origStart.y + dy },
          end: { x: drag.origEnd.x + dx, y: drag.origEnd.y + dy },
        });
        state.setCursor(snap.point, snap.kind);
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
    const state = useBuildingStore.getState();
    const raw = toWorld(pointer.x, pointer.y);

    // Đặt cửa / cửa sổ lên tường gần nhất.
    if (tool === 'door' || tool === 'window') {
      const hit = findNearestWall(raw, walls, OPENING_PICK_RADIUS_PX / camera.scale);
      if (hit) {
        const opening = createOpening(hit.wall, tool, Math.round(hit.offset));
        state.addOpening(opening);
        state.setOpeningSelection(opening.id);
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
    state.addWall(createWall(state.draft.start, snap.point));
    state.setDraft({ start: snap.point, current: snap.point });
    state.setLengthInput('');
  };

  const handleMouseUp = () => {
    panRef.current = null;
    // Commit lần kéo thả thành 1 history entry (undo được).
    const drag = dragRef.current;
    dragRef.current = null;
    if (drag && dragPreview) {
      const original = walls.find((w) => w.id === drag.wallId);
      if (
        original &&
        (original.start.x !== dragPreview.start.x ||
          original.start.y !== dragPreview.start.y ||
          original.end.x !== dragPreview.end.x ||
          original.end.y !== dragPreview.end.y)
      ) {
        useBuildingStore
          .getState()
          .updateWall(drag.wallId, { start: dragPreview.start, end: dragPreview.end });
      }
    }
    setDragPreview(null);
  };

  const handleWallClick = (wall: Wall) => (e: KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    if (tool === 'select') useBuildingStore.getState().setSelection(wall.id);
  };

  const handleWallMouseDown = (wall: Wall) => (e: KonvaEventObject<MouseEvent>) => {
    if (tool !== 'select' || e.evt.button !== 0 || spaceRef.current) return;
    e.cancelBubble = true;
    const stage = stageRef.current;
    const pointer = stage?.getPointerPosition();
    if (!pointer) return;
    useBuildingStore.getState().setSelection(wall.id);
    dragRef.current = {
      kind: 'move',
      wallId: wall.id,
      grab: toWorld(pointer.x, pointer.y),
      origStart: { ...wall.start },
      origEnd: { ...wall.end },
    };
    setDragPreview({ wallId: wall.id, start: { ...wall.start }, end: { ...wall.end } });
  };

  const handleHandleMouseDown =
    (wall: Wall, end: 'start' | 'end') => (e: KonvaEventObject<MouseEvent>) => {
      if (tool !== 'select' || e.evt.button !== 0 || spaceRef.current) return;
      e.cancelBubble = true;
      dragRef.current = {
        kind: 'endpoint',
        wallId: wall.id,
        end,
        fixed: end === 'start' ? { ...wall.end } : { ...wall.start },
      };
      setDragPreview({ wallId: wall.id, start: { ...wall.start }, end: { ...wall.end } });
    };

  const handleOpeningClick = (opening: Opening) => (e: KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    if (tool === 'select') useBuildingStore.getState().setOpeningSelection(opening.id);
  };

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target === e.currentTarget && tool === 'select') {
      useBuildingStore.getState().setSelection(null);
    }
  };

  // Lưới thích ứng theo zoom.
  const step = gridStepFor(camera.scale);
  const left = -camera.x / camera.scale;
  const top = -camera.y / camera.scale;
  const right = (size.w - camera.x) / camera.scale;
  const bottom = (size.h - camera.y) / camera.scale;
  const gridLines: number[] = [];
  for (let x = Math.floor(left / step) * step; x <= right; x += step) {
    gridLines.push(x, top, x, bottom);
  }
  for (let y = Math.floor(top / step) * step; y <= bottom; y += step) {
    gridLines.push(left, y, right, y);
  }

  const draftLen = draft ? Math.round(distance(draft.start, draft.current)) : 0;
  const draftMid = draft ? midpoint(draft.start, draft.current) : null;
  const selected = effectiveWalls.find((w) => w.id === selectedWallId) ?? null;

  // Dimension cho tường đang chọn: đường song song, offset 600mm về phía
  // xa tâm building (phía trống), kèm tick 2 đầu + nhãn độ dài.
  let dim: { line: number[]; ext: number[]; ticks: number[]; label: string; lx: number; ly: number; rot: number } | null = null;
  if (selected) {
    const len = wallLength(selected);
    if (len > 0) {
      const ux = (selected.end.x - selected.start.x) / len;
      const uy = (selected.end.y - selected.start.y) / len;
      const nx = -uy;
      const ny = ux;
      const mid = midpoint(selected.start, selected.end);
      // Tâm bounding box của toàn bộ tường — dimension đặt về phía xa tâm.
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (const w of effectiveWalls) {
        minX = Math.min(minX, w.start.x, w.end.x);
        minY = Math.min(minY, w.start.y, w.end.y);
        maxX = Math.max(maxX, w.start.x, w.end.x);
        maxY = Math.max(maxY, w.start.y, w.end.y);
      }
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      const dPlus = Math.hypot(mid.x + nx * DIM_OFFSET - cx, mid.y + ny * DIM_OFFSET - cy);
      const dMinus = Math.hypot(mid.x - nx * DIM_OFFSET - cx, mid.y - ny * DIM_OFFSET - cy);
      const s = dPlus >= dMinus ? 1 : -1;
      const ox = nx * DIM_OFFSET * s;
      const oy = ny * DIM_OFFSET * s;
      const ds = { x: selected.start.x + ox, y: selected.start.y + oy };
      const de = { x: selected.end.x + ox, y: selected.end.y + oy };
      const extLen = DIM_OFFSET + 150;
      let rot = (Math.atan2(uy, ux) * 180) / Math.PI;
      if (rot > 90) rot -= 180;
      if (rot < -90) rot += 180;
      const tickHalf = 80;
      dim = {
        line: [ds.x, ds.y, de.x, de.y],
        ext: [
          selected.start.x, selected.start.y,
          selected.start.x + nx * extLen * s, selected.start.y + ny * extLen * s,
          selected.end.x, selected.end.y,
          selected.end.x + nx * extLen * s, selected.end.y + ny * extLen * s,
        ],
        ticks: [
          ds.x - nx * tickHalf, ds.y - ny * tickHalf, ds.x + nx * tickHalf, ds.y + ny * tickHalf,
          de.x - nx * tickHalf, de.y - ny * tickHalf, de.x + nx * tickHalf, de.y + ny * tickHalf,
        ],
        label: fmt(len, unit),
        lx: (ds.x + de.x) / 2 + nx * 140 * s,
        ly: (ds.y + de.y) / 2 + ny * 140 * s,
        rot,
      };
    }
  }

  return (
    <div ref={containerRef} className="h-full w-full overflow-hidden" style={{ background: c.bg }}>
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
            spaceRef.current ? 'grab' : tool === 'wall' || tool === 'door' || tool === 'window'
              ? 'crosshair'
              : 'default',
        }}
      >
        <Layer x={camera.x} y={camera.y} scaleX={camera.scale} scaleY={camera.scale}>
          <Line points={gridLines} stroke={c.grid} strokeWidth={1 / camera.scale} listening={false} />
          <Line
            points={[0, top, 0, bottom, left, 0, right, 0]}
            stroke={c.axis}
            strokeWidth={1 / camera.scale}
            listening={false}
          />

          {/* Thân tường: tô từ union (nối góc sạch), không nhận click. */}
          {mergedPolygons.map((poly, i) => (
            <Line
              key={`m-${i}`}
              points={poly}
              closed
              fill={c.wallFill}
              stroke={c.wallStroke}
              strokeWidth={1 / camera.scale}
              listening={false}
            />
          ))}

          {/* Đường tâm từng tường: hiển thị mảnh + vùng click rộng bằng thân tường. */}
          {effectiveWalls.map((w) => {
            const isSel = w.id === selectedWallId;
            return (
              <Line
                key={`${w.id}-c`}
                points={[w.start.x, w.start.y, w.end.x, w.end.y]}
                stroke={isSel ? c.selected : c.center}
                strokeWidth={1 / camera.scale}
                dash={[6 / camera.scale, 6 / camera.scale]}
                hitStrokeWidth={Math.max(w.thickness, 12 / camera.scale)}
                onClick={handleWallClick(w)}
                onMouseDown={handleWallMouseDown(w)}
              />
            );
          })}

          {/* Tường đang chọn: tô đè bằng màu chọn. */}
          {selected && (
            <Line
              points={wallPolygon(selected)}
              closed
              fill={c.selected}
              opacity={0.85}
              listening={false}
            />
          )}

          {/* Openings: cửa đi (khoảng trống + cánh + cung mở), cửa sổ (2 đường song song). */}
          {openings.map((o) => {
            const wall = effectiveWalls.find((w) => w.id === o.wallId);
            if (!wall) return null;
            const isSel = o.id === selectedOpeningId;
            const { a, b, nx, ny, ux, uy } = openingFrame(o, wall);
            const half = wall.thickness / 2;
            const stroke = isSel ? c.selected : c.wallStroke;
            if (o.type === 'door') {
              const leafEnd = { x: a.x + nx * o.width, y: a.y + ny * o.width };
              const angleDeg = (Math.atan2(uy, ux) * 180) / Math.PI;
              return (
                <Fragment key={o.id}>
                  {/* Khoảng trống trên thân tường. */}
                  <Line
                    points={openingPolygon(o, wall, half + 3 / camera.scale)}
                    closed
                    fill={c.bg}
                    listening={false}
                  />
                  {/* Cánh cửa + cung 90° thể hiện hướng mở. */}
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
                    angle={90}
                    rotation={angleDeg}
                    stroke={stroke}
                    strokeWidth={1.5 / camera.scale}
                    listening={false}
                  />
                  {/* Vùng click chọn opening. */}
                  <Line
                    points={openingPolygon(o, wall, half)}
                    closed
                    fill="rgba(0,0,0,0)"
                    stroke={isSel ? c.selected : 'rgba(0,0,0,0)'}
                    strokeWidth={2 / camera.scale}
                    onClick={handleOpeningClick(o)}
                  />
                </Fragment>
              );
            }
            // Window: 2 đường song song trong thân tường.
            const q = wall.thickness / 4;
            return (
              <Fragment key={o.id}>
                <Line
                  points={[a.x + nx * q, a.y + ny * q, b.x + nx * q, b.y + ny * q]}
                  stroke={c.bg}
                  strokeWidth={2 / camera.scale}
                  listening={false}
                />
                <Line
                  points={[a.x - nx * q, a.y - ny * q, b.x - nx * q, b.y - ny * q]}
                  stroke={c.bg}
                  strokeWidth={2 / camera.scale}
                  listening={false}
                />
                <Line
                  points={openingPolygon(o, wall, half)}
                  closed
                  fill="rgba(0,0,0,0)"
                  stroke={isSel ? c.selected : 'rgba(0,0,0,0)'}
                  strokeWidth={2 / camera.scale}
                  onClick={handleOpeningClick(o)}
                />
              </Fragment>
            );
          })}

          {/* Dimension cho tường đang chọn. */}
          {dim && (
            <>
              <Line points={dim.ext} stroke={c.dim} strokeWidth={1 / camera.scale} listening={false} />
              <Line points={dim.line} stroke={c.dim} strokeWidth={1.5 / camera.scale} listening={false} />
              <Line points={dim.ticks} stroke={c.dim} strokeWidth={1.5 / camera.scale} listening={false} />
              <Text
                x={dim.lx}
                y={dim.ly}
                text={dim.label}
                fontSize={13 / camera.scale}
                fill={c.dim}
                rotation={dim.rot}
                offsetX={(dim.label.length * 8) / camera.scale / 2}
                offsetY={7 / camera.scale}
                listening={false}
              />
            </>
          )}

          {/* Handle đầu mút của tường đang chọn (kéo để đổi start/end). */}
          {selected && (
            <>
              <Circle
                x={selected.start.x}
                y={selected.start.y}
                radius={6 / camera.scale}
                fill={c.bg}
                stroke={c.selected}
                strokeWidth={2 / camera.scale}
                onMouseDown={handleHandleMouseDown(selected, 'start')}
                onMouseEnter={(e) => {
                  e.target.getStage()?.container().style.setProperty('cursor', 'pointer');
                }}
                onMouseLeave={(e) => {
                  e.target.getStage()?.container().style.removeProperty('cursor');
                }}
              />
              <Circle
                x={selected.end.x}
                y={selected.end.y}
                radius={6 / camera.scale}
                fill={c.bg}
                stroke={c.selected}
                strokeWidth={2 / camera.scale}
                onMouseDown={handleHandleMouseDown(selected, 'end')}
                onMouseEnter={(e) => {
                  e.target.getStage()?.container().style.setProperty('cursor', 'pointer');
                }}
                onMouseLeave={(e) => {
                  e.target.getStage()?.container().style.removeProperty('cursor');
                }}
              />
            </>
          )}

          {/* Draft preview */}
          {draft && draftLen > 0 && (
            <>
              <Line
                points={wallPolygon({ id: 'draft', start: draft.start, end: draft.current, thickness: 200 })}
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
              {draftMid && (
                <Text
                  x={draftMid.x}
                  y={draftMid.y - 24 / camera.scale}
                  text={`${draftLen} mm`}
                  fontSize={13 / camera.scale}
                  fill={c.draft}
                  align="center"
                  listening={false}
                />
              )}
            </>
          )}

          {/* Marker snap */}
          {draft && (
            <Circle
              x={draft.current.x}
              y={draft.current.y}
              radius={5 / camera.scale}
              stroke={c.snap}
              strokeWidth={1.5 / camera.scale}
              listening={false}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
