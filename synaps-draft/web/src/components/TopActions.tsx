import { FileDown, FilePlus2, Redo2, Undo2 } from 'lucide-react';

interface TopActionsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onOpen: () => void;
  onExport: () => void;
  onSave: () => void;
  onNew: () => void;
}

const pillButton =
  'rounded-full border border-syn-border bg-white px-3 py-1.5 text-sm font-medium text-syn-ink shadow-sm hover:bg-syn-field';
const iconButton =
  'flex h-9 w-9 items-center justify-center rounded-full border border-syn-border bg-white text-syn-ink shadow-sm hover:bg-syn-field disabled:cursor-not-allowed disabled:opacity-40';

/** Các hành động nổi góc phải trên, theo phong cách Synaps. */
export default function TopActions({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onOpen,
  onExport,
  onSave,
  onNew,
}: TopActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <button type="button" title="Mở bản vẽ (.json)" onClick={onOpen} className={pillButton}>
        Import
      </button>
      <button type="button" title="Xuất bản vẽ" onClick={onExport} className={pillButton}>
        Export
      </button>
      <button
        type="button"
        title="Sắp có"
        disabled
        className="rounded-full bg-syn-ink px-3 py-1.5 text-sm font-medium text-white shadow-sm disabled:opacity-50"
      >
        Share
      </button>
      <div className="mx-1 h-5 w-px bg-syn-border" aria-hidden="true" />
      <button
        type="button"
        title="Hoàn tác (Ctrl+Z)"
        onClick={onUndo}
        disabled={!canUndo}
        className={iconButton}
      >
        <Undo2 size={16} strokeWidth={1.5} />
      </button>
      <button
        type="button"
        title="Làm lại (Ctrl+Shift+Z)"
        onClick={onRedo}
        disabled={!canRedo}
        className={iconButton}
      >
        <Redo2 size={16} strokeWidth={1.5} />
      </button>
      <button type="button" title="Lưu bản vẽ (.json)" onClick={onSave} className={iconButton}>
        <FileDown size={16} strokeWidth={1.5} />
      </button>
      <button type="button" title="Tạo mới từ nhà mẫu" onClick={onNew} className={iconButton}>
        <FilePlus2 size={16} strokeWidth={1.5} />
      </button>
    </div>
  );
}
