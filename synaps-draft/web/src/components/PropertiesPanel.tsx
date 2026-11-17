import { useEffect, useState } from 'react';
import { wallLength } from '../model/geometry';
import { maxWidthWithoutOverlap, resolveDragOffset } from '../model/openingDrag';
import { selectActiveLevel, useBuildingStore, type Unit } from '../store/useBuildingStore';

function fmt(valueMm: number, unit: Unit): string {
  return unit === 'mm' ? `${Math.round(valueMm)} mm` : `${(valueMm / 1000).toFixed(2)} m`;
}

const FIELD_CLASS =
  'w-full rounded-lg border border-transparent bg-syn-field px-2.5 py-1.5 text-sm outline-none focus:border-syn-accent focus:bg-white';

interface NumberFieldProps {
  label: string;
  /** undefined = ô trống (chỉ dùng khi allowEmpty). */
  value: number | undefined;
  onCommit: (v: number | undefined) => void;
  min?: number;
  max?: number;
  placeholder?: string;
  allowEmpty?: boolean;
  suffix?: string;
}

/** Input số nguyên, commit khi Enter hoặc blur; sai định dạng thì hoàn lại giá trị cũ. */
function NumberField({
  label,
  value,
  onCommit,
  min,
  max,
  placeholder,
  allowEmpty = false,
  suffix,
}: NumberFieldProps) {
  const [text, setText] = useState(value === undefined ? '' : String(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setText(value === undefined ? '' : String(value));
  }, [value, focused]);

  const commit = () => {
    const trimmed = text.trim();
    if (trimmed === '') {
      if (allowEmpty) onCommit(undefined);
      else setText(value === undefined ? '' : String(value));
      return;
    }
    const n = Number.parseInt(trimmed, 10);
    if (!Number.isFinite(n)) {
      setText(value === undefined ? '' : String(value));
      return;
    }
    const clamped = Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n));
    onCommit(clamped);
    setText(String(clamped));
  };

  return (
    <label className="block">
      <span className="mb-1 block text-[11px] text-syn-grey">{label}</span>
      <span className="flex items-center gap-1">
        <input
          type="text"
          inputMode="numeric"
          value={text}
          placeholder={placeholder}
          onChange={(e) => setText(e.target.value.replace(/[^0-9-]/g, ''))}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            commit();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
          }}
          className={`${FIELD_CLASS} tabular-nums`}
        />
        {suffix && <span className="shrink-0 text-xs text-syn-grey">{suffix}</span>}
      </span>
    </label>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <h2 className="text-sm font-semibold text-syn-ink">{children}</h2>;
}

function GroupLabel({ children }: { children: string }) {
  return <p className="text-xs font-medium text-syn-grey">{children}</p>;
}

/** Toggle pill kiểu iOS: bật = nền đen, núm trắng bên phải. */
function GridToggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Hiện lưới"
      onClick={() => onChange(!on)}
      className={`flex h-5 w-9 shrink-0 items-center rounded-full px-0.5 ${
        on ? 'justify-end bg-syn-ink' : 'justify-start bg-zinc-300'
      }`}
    >
      <span className="block h-4 w-4 rounded-full bg-white shadow-sm" />
    </button>
  );
}

/** Chọn alignment trái/giữa/phải — chỉ hiển thị, chưa đổi geometry (giai đoạn sau). */
function AlignmentControl() {
  return (
    <div title="Sắp có">
      <span className="mb-1 block text-[11px] text-syn-grey">Alignment</span>
      <div className="flex rounded-lg bg-syn-field p-0.5">
        {(['Left', 'Center', 'Right'] as const).map((a) => (
          <button
            key={a}
            type="button"
            disabled
            title="Sắp có"
            className={`flex-1 rounded-md px-2 py-1 text-xs ${
              a === 'Center'
                ? 'bg-white font-medium text-syn-ink shadow-sm'
                : 'text-syn-grey'
            }`}
          >
            {a}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PropertiesPanel() {
  const level = useBuildingStore(selectActiveLevel);
  const selectedWallIds = useBuildingStore((s) => s.selectedWallIds);
  const selectedOpeningIds = useBuildingStore((s) => s.selectedOpeningIds);
  const unit = useBuildingStore((s) => s.unit);
  const showGrid = useBuildingStore((s) => s.showGrid);
  const [openingError, setOpeningError] = useState<string | null>(null);

  // Đổi lựa chọn thì xóa lỗi cũ.
  useEffect(() => {
    setOpeningError(null);
  }, [selectedOpeningIds]);

  const store = useBuildingStore.getState;
  const selectedWalls = level?.walls.filter((w) => selectedWallIds.includes(w.id)) ?? [];
  const selectedOpenings =
    level?.openings.filter((o) => selectedOpeningIds.includes(o.id)) ?? [];
  const totalSelected = selectedWalls.length + selectedOpenings.length;
  /** Thuộc tính chi tiết chỉ hiện khi đúng 1 vật thể được chọn. */
  const wall = totalSelected === 1 ? (selectedWalls[0] ?? null) : null;
  const opening = totalSelected === 1 ? (selectedOpenings[0] ?? null) : null;
  const isMulti = totalSelected > 1;
  const openingWall = opening
    ? (level?.walls.find((w) => w.id === opening.wallId) ?? null)
    : null;

  const [levelName, setLevelName] = useState(level?.name ?? '');
  useEffect(() => {
    setLevelName(level?.name ?? '');
  }, [level?.name]);

  return (
    <div className="flex flex-col gap-4 overflow-y-auto">
      {wall && (
        <section className="flex flex-col gap-3">
          <SectionTitle>Tường</SectionTitle>
          <p className="text-sm text-syn-ink">
            Dài <span className="font-medium tabular-nums">{fmt(wallLength(wall), unit)}</span>
          </p>
          <NumberField
            label="Độ dày (50–1000 mm)"
            value={wall.thickness}
            min={50}
            max={1000}
            suffix="mm"
            onCommit={(v) => {
              if (v !== undefined) store().updateWall(wall.id, { thickness: v });
            }}
          />
          <NumberField
            label="Chiều cao tường (trống = theo tầng)"
            value={wall.height}
            min={100}
            max={10000}
            suffix="mm"
            allowEmpty
            placeholder={`Theo tầng (${level?.height ?? ''} mm)`}
            onCommit={(v) => store().updateWall(wall.id, { height: v })}
          />
          <AlignmentControl />
          <div className="flex flex-col gap-2">
            <GroupLabel>Construction</GroupLabel>
            <div className="flex items-center gap-2 rounded-lg bg-syn-field px-2.5 py-1.5">
              <span className="h-4 w-4 shrink-0 rounded-sm border border-syn-border bg-[#8a8a8a]" />
              <span className="flex-1 text-sm text-syn-ink">Core</span>
              <span className="text-sm tabular-nums text-syn-grey">{wall.thickness} mm</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                disabled
                title="Sắp có"
                className="flex-1 rounded-lg border border-syn-border bg-white px-2 py-1.5 text-xs text-syn-grey disabled:opacity-50"
              >
                Add left
              </button>
              <button
                type="button"
                disabled
                title="Sắp có"
                className="flex-1 rounded-lg border border-syn-border bg-white px-2 py-1.5 text-xs text-syn-grey disabled:opacity-50"
              >
                Add right
              </button>
            </div>
          </div>
        </section>
      )}

      {opening && openingWall && (
        <section className="flex flex-col gap-3">
          <SectionTitle>{opening.type === 'door' ? 'Cửa đi' : 'Cửa sổ'}</SectionTitle>
          <p className="text-sm text-syn-grey">
            Trên tường dài {fmt(wallLength(openingWall), unit)}
          </p>
          <div className="flex flex-col gap-3">
            <GroupLabel>Geometry</GroupLabel>
            <NumberField
              label="Chiều rộng"
              value={opening.width}
              min={100}
              suffix="mm"
              onCommit={(v) => {
                if (v === undefined) return;
                const wallMax = Math.round(wallLength(openingWall)) - opening.offset;
                const freeMax = maxWidthWithoutOverlap(
                  level.walls,
                  level.openings,
                  opening,
                  v,
                );
                const maxW = Math.min(wallMax, freeMax);
                if (v > maxW) {
                  setOpeningError(
                    `Rộng vượt quá khoảng trống, đã giới hạn về ${maxW} mm (offset ${opening.offset} mm).`,
                  );
                  store().updateOpening(opening.id, { width: Math.max(100, maxW) });
                } else {
                  setOpeningError(null);
                  store().updateOpening(opening.id, { width: v });
                }
              }}
            />
            <NumberField
              label="Chiều cao"
              value={opening.height}
              min={100}
              max={5000}
              suffix="mm"
              onCommit={(v) => {
                if (v !== undefined) store().updateOpening(opening.id, { height: v });
              }}
            />
            <NumberField
              label="Chiều cao bậu (sill)"
              value={opening.sillHeight}
              min={0}
              max={3000}
              suffix="mm"
              onCommit={(v) => {
                if (v !== undefined) store().updateOpening(opening.id, { sillHeight: v });
              }}
            />
            <NumberField
              label="Khoảng cách từ đầu tường"
              value={opening.offset}
              min={0}
              suffix="mm"
              onCommit={(v) => {
                if (v === undefined) return;
                const clamped = resolveDragOffset(
                  level.walls,
                  level.openings,
                  opening.id,
                  opening.offset,
                  v,
                );
                if (clamped !== v) {
                  setOpeningError(
                    `Đã giới hạn về ${clamped} mm (chạm cửa kề hoặc mép tường).`,
                  );
                } else setOpeningError(null);
                store().updateOpening(opening.id, { offset: clamped });
              }}
            />
          </div>
          <div className="flex flex-col gap-3">
            <GroupLabel>Configuration</GroupLabel>
            <AlignmentControl />
            {opening.type === 'door' && (
              <button
                type="button"
                onClick={() => store().updateOpening(opening.id, { flip: !opening.flip })}
                className="rounded-lg border border-syn-border bg-white px-2 py-1.5 text-xs text-syn-ink hover:bg-syn-field"
              >
                Đảo chiều mở
              </button>
            )}
          </div>
          {openingError && (
            <p role="alert" className="rounded bg-amber-50 px-2 py-1.5 text-xs text-amber-800">
              {openingError}
            </p>
          )}
        </section>
      )}

      {isMulti && level && (
        <section className="flex flex-col gap-3">
          <SectionTitle>Đã chọn</SectionTitle>
          <p className="text-sm text-syn-ink">
            {selectedWalls.length} tường · {selectedOpenings.length} cửa đã chọn
          </p>
          {selectedWalls.length > 0 && (
            <p className="text-sm text-syn-ink">
              Tổng dài tường{' '}
              <span className="font-medium tabular-nums">
                {fmt(
                  selectedWalls.reduce((sum, w) => sum + wallLength(w), 0),
                  unit,
                )}
              </span>
            </p>
          )}
          <p className="text-sm text-syn-grey">Kéo 1 tường để di chuyển cả nhóm.</p>
          <button
            type="button"
            onClick={() => store().deleteSelection()}
            className="rounded-lg bg-syn-ink px-3 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Xóa vùng chọn
          </button>
        </section>
      )}

      {totalSelected === 0 && level && (
        <>
          <section className="flex flex-col gap-3">
            <SectionTitle>Canvas</SectionTitle>
            <div>
              <span className="mb-1 block text-[11px] text-syn-grey">Background</span>
              <div className="flex items-center gap-2 rounded-lg bg-syn-field px-2.5 py-1.5">
                <span className="h-4 w-4 shrink-0 rounded-sm border border-syn-border bg-white" />
                <span className="text-sm tabular-nums text-syn-ink">FCFCFC</span>
              </div>
            </div>
            <div className="flex gap-2">
              <label className="block flex-1">
                <span className="mb-1 block text-[11px] text-syn-grey">Length units</span>
                <select
                  value={unit}
                  onChange={(e) => store().setUnit(e.target.value as Unit)}
                  className={FIELD_CLASS}
                >
                  <option value="mm">Millimeters</option>
                  <option value="m">Meters</option>
                </select>
              </label>
              <label className="block w-20">
                <span className="mb-1 block text-[11px] text-syn-grey">Precision</span>
                <select defaultValue="2" className={FIELD_CLASS}>
                  <option value="2">2</option>
                </select>
              </label>
            </div>
            <label className="block">
              <span className="mb-1 block text-[11px] text-syn-grey">Area units</span>
              <select defaultValue="Square meters" className={FIELD_CLASS}>
                <option value="Square meters">Square meters</option>
              </select>
            </label>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-syn-grey">Grid</span>
              <GridToggle on={showGrid} onChange={(v) => store().setShowGrid(v)} />
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <SectionTitle>Tầng</SectionTitle>
            <label className="block">
              <span className="mb-1 block text-[11px] text-syn-grey">Tên tầng</span>
              <input
                type="text"
                value={levelName}
                onChange={(e) => setLevelName(e.target.value)}
                onBlur={() => {
                  const name = levelName.trim();
                  if (name) store().updateLevel({ name });
                  else setLevelName(level.name);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                }}
                className={FIELD_CLASS}
              />
            </label>
            <NumberField
              label="Chiều cao tầng"
              value={level.height}
              min={1000}
              max={10000}
              suffix="mm"
              onCommit={(v) => {
                if (v !== undefined) store().updateLevel({ height: v });
              }}
            />
            <p className="text-sm text-syn-grey">
              {level.walls.length} tường · {level.openings.length} cửa
            </p>
          </section>
        </>
      )}
    </div>
  );
}
