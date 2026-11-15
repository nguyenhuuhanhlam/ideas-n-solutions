import { useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface ExportDialogProps {
  wallCount: number;
  openingCount: number;
  onClose: () => void;
  onExport: () => Promise<void>;
}

interface FormatCardProps {
  name: string;
  description: string;
  selected: boolean;
  disabled: boolean;
}

function FormatCard({ name, description, selected, disabled }: FormatCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      title={disabled ? 'Sắp có' : undefined}
      className={`flex items-start gap-3 rounded-xl border p-3 text-left ${
        selected
          ? 'border-syn-ink bg-white'
          : 'border-syn-border bg-white disabled:cursor-not-allowed disabled:opacity-50'
      }`}
    >
      <span
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? 'border-syn-ink' : 'border-syn-border'
        }`}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-syn-ink" />}
      </span>
      <span>
        <span className="block text-sm font-semibold text-syn-ink">{name}</span>
        <span className="block text-xs text-syn-grey">{description}</span>
      </span>
    </button>
  );
}

/** Dialog xuất bản vẽ theo phong cách Synaps. C1 chỉ hỗ trợ DXF thật. */
export default function ExportDialog({ wallCount, openingCount, onClose, onExport }: ExportDialogProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Xuất bản vẽ"
        className="w-full max-w-lg rounded-3xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="flex items-center gap-1 text-base font-semibold text-syn-ink"
          >
            Export · Whole project
            <ChevronDown size={16} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            title="Đóng"
            onClick={onClose}
            className="rounded-lg p-1.5 text-syn-grey hover:bg-syn-field hover:text-syn-ink"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Preview */}
        <div className="mt-4 rounded-xl bg-syn-field p-4">
          <div className="flex h-28 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-syn-border bg-white">
            <p className="text-sm font-medium text-syn-ink">Building — 2D plan preview</p>
            <p className="text-xs text-syn-grey">
              {wallCount} tường · {openingCount} cửa
            </p>
          </div>
        </div>

        {/* Format */}
        <p className="mt-4 text-sm font-medium text-syn-ink">Format</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <FormatCard name="PDF" description="Drawing sets at scale" selected={false} disabled />
          <FormatCard name="DWG" description="CAD drawings" selected={false} disabled />
          <FormatCard name="DXF" description="Vector geometry" selected disabled={false} />
          <FormatCard name="IFC" description="Building model" selected={false} disabled />
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm text-syn-grey">A3 Landscape · 1:100</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-syn-border bg-white px-4 py-2 text-sm font-medium text-syn-ink hover:bg-syn-field"
            >
              Cancel
            </button>
            <button
              type="button"
              title="Xuất DXF (cần API chạy ở cổng 8000)"
              onClick={() => {
                void onExport().then(onClose);
              }}
              className="rounded-full bg-syn-ink px-4 py-2 text-sm font-medium text-white hover:bg-black"
            >
              Export DXF ↓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
