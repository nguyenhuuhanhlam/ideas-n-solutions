import { useEffect, useState } from 'react';
import { clampOpeningOffset, wallLength } from '../model/geometry';
import { selectActiveLevel, useBuildingStore, type Unit } from '../store/useBuildingStore';

function fmt(valueMm: number, unit: Unit): string {
  return unit === 'mm' ? `${Math.round(valueMm)} mm` : `${(valueMm / 1000).toFixed(2)} m`;
}

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
      <span className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
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
          className="w-full rounded border border-zinc-300 bg-white px-2 py-1 text-sm tabular-nums outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
        {suffix && <span className="shrink-0 text-xs text-zinc-500">{suffix}</span>}
      </span>
    </label>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
      {children}
    </h2>
  );
}

export default function PropertiesPanel() {
  const level = useBuildingStore(selectActiveLevel);
  const selectedWallId = useBuildingStore((s) => s.selectedWallId);
  const selectedOpeningId = useBuildingStore((s) => s.selectedOpeningId);
  const unit = useBuildingStore((s) => s.unit);
  const [openingError, setOpeningError] = useState<string | null>(null);

  // Đổi lựa chọn thì xóa lỗi cũ.
  useEffect(() => {
    setOpeningError(null);
  }, [selectedOpeningId]);

  const store = useBuildingStore.getState;
  const wall = level?.walls.find((w) => w.id === selectedWallId) ?? null;
  const opening = level?.openings.find((o) => o.id === selectedOpeningId) ?? null;
  const openingWall = opening
    ? (level?.walls.find((w) => w.id === opening.wallId) ?? null)
    : null;

  const [levelName, setLevelName] = useState(level?.name ?? '');
  useEffect(() => {
    setLevelName(level?.name ?? '');
  }, [level?.name]);

  return (
    <aside className="flex w-64 shrink-0 flex-col gap-4 overflow-y-auto border-l border-zinc-200 p-3 dark:border-zinc-800">
      {wall && (
        <section className="flex flex-col gap-3">
          <SectionTitle>Tường</SectionTitle>
          <p className="text-sm">
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
        </section>
      )}

      {opening && openingWall && (
        <section className="flex flex-col gap-3">
          <SectionTitle>{opening.type === 'door' ? 'Cửa đi' : 'Cửa sổ'}</SectionTitle>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Trên tường dài {fmt(wallLength(openingWall), unit)}
          </p>
          <NumberField
            label="Khoảng cách từ đầu tường"
            value={opening.offset}
            min={0}
            suffix="mm"
            onCommit={(v) => {
              if (v === undefined) return;
              const clamped = clampOpeningOffset(v, opening.width, wallLength(openingWall));
              if (clamped !== v) {
                setOpeningError(
                  `Offset vượt quá tường, đã giới hạn về ${clamped} mm (tường dài ${Math.round(wallLength(openingWall))} mm).`,
                );
              } else setOpeningError(null);
              store().updateOpening(opening.id, { offset: clamped });
            }}
          />
          <NumberField
            label="Chiều rộng"
            value={opening.width}
            min={100}
            suffix="mm"
            onCommit={(v) => {
              if (v === undefined) return;
              const maxW = Math.round(wallLength(openingWall)) - opening.offset;
              if (v > maxW) {
                setOpeningError(
                  `Rộng vượt quá tường, đã giới hạn về ${maxW} mm (offset ${opening.offset} mm).`,
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
          {openingError && (
            <p role="alert" className="rounded bg-amber-50 px-2 py-1.5 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-200">
              {openingError}
            </p>
          )}
        </section>
      )}

      {!wall && !opening && level && (
        <section className="flex flex-col gap-3">
          <SectionTitle>Tầng</SectionTitle>
          <label className="block">
            <span className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Tên tầng</span>
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
              className="w-full rounded border border-zinc-300 bg-white px-2 py-1 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
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
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {level.walls.length} tường · {level.openings.length} cửa
          </p>
        </section>
      )}
    </aside>
  );
}
