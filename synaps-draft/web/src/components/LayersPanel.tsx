import { useState, type MouseEvent as ReactMouseEvent } from 'react';
import { Eye, Lock } from 'lucide-react';
import { wallLength } from '../model/geometry';
import { selectActiveLevel, useBuildingStore } from '../store/useBuildingStore';

interface RowProps {
  name: string;
  meta: string;
  selected: boolean;
  indent: number;
  /** Nhận event để phân biệt bấm thường (chọn 1) với Shift+bấm (thêm/bớt). */
  onSelect: (e: ReactMouseEvent<HTMLButtonElement>) => void;
}

function Row({ name, meta, selected, indent, onSelect }: RowProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group flex w-full items-center gap-2 rounded-lg py-1.5 pr-1.5 text-left text-sm hover:bg-syn-field ${
        selected ? 'bg-syn-field text-syn-ink' : 'text-syn-ink'
      }`}
      style={{ paddingLeft: `${8 + indent * 16}px` }}
    >
      <span className="min-w-0 flex-1 truncate">{name}</span>
      <span className="shrink-0 text-xs tabular-nums text-syn-grey">{meta}</span>
      <span className="flex shrink-0 gap-0.5 opacity-0 group-hover:opacity-100">
        <span title="Sắp có" className="rounded p-0.5 text-syn-grey">
          <Eye size={14} strokeWidth={1.5} />
        </span>
        <span title="Sắp có" className="rounded p-0.5 text-syn-grey">
          <Lock size={14} strokeWidth={1.5} />
        </span>
      </span>
    </button>
  );
}

/** Cây Layers: tầng → tường → cửa. Click chọn thật; eye/lock chỉ hiển thị. */
export default function LayersPanel() {
  const level = useBuildingStore(selectActiveLevel);
  const selectedWallIds = useBuildingStore((s) => s.selectedWallIds);
  const selectedOpeningIds = useBuildingStore((s) => s.selectedOpeningIds);
  const [query, setQuery] = useState('');

  const store = useBuildingStore.getState;
  const q = query.trim().toLowerCase();
  const matches = (name: string) => q === '' || name.toLowerCase().includes(q);

  if (!level) return <p className="text-sm text-syn-grey">Chưa có tầng nào.</p>;

  const walls = level.walls.map((w, i) => ({
    wall: w,
    name: `Tường ${i + 1}`,
    openings: level.openings
      .filter((o) => o.wallId === w.id)
      .map((o) => ({
        opening: o,
        name: o.type === 'door' ? 'Cửa đi' : 'Cửa sổ',
      })),
  }));
  // Tường hiện khi tên tường khớp, hoặc có cửa con khớp; cửa chỉ hiện khi khớp.
  const visibleWalls = walls.filter(
    (w) => matches(w.name) || w.openings.some((o) => matches(o.name)),
  );

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tìm…"
        className="w-full rounded-lg border border-transparent bg-syn-field px-2.5 py-1.5 text-sm outline-none focus:border-syn-accent focus:bg-white"
      />
      <div className="flex flex-col gap-0.5">
        <p className="px-2 py-1.5 text-sm font-medium text-syn-ink">{level.name}</p>
        {visibleWalls.length === 0 && (
          <p className="px-2 py-1 text-sm text-syn-grey">
            {level.walls.length === 0 ? 'Chưa có tường.' : 'Không tìm thấy.'}
          </p>
        )}
        {visibleWalls.map(({ wall, name, openings }) => (
          <div key={wall.id}>
            <Row
              name={name}
              meta={`${Math.round(wallLength(wall))} mm`}
              selected={selectedWallIds.includes(wall.id)}
              indent={1}
              onSelect={(e) =>
                e.shiftKey
                  ? store().toggleInSelection('wall', wall.id)
                  : store().selectSingle('wall', wall.id)
              }
            />
            {openings
              .filter((o) => matches(o.name))
              .map(({ opening, name: openingName }) => (
                <Row
                  key={opening.id}
                  name={openingName}
                  meta={`${opening.width} mm`}
                  selected={selectedOpeningIds.includes(opening.id)}
                  indent={2}
                  onSelect={(e) =>
                    e.shiftKey
                      ? store().toggleInSelection('opening', opening.id)
                      : store().selectSingle('opening', opening.id)
                  }
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
