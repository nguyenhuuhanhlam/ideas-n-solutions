import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { AppWindow, DoorOpen, FileDown, FilePlus2, FolderOpen, MousePointer2, Redo2, Slash, Sun, Moon, Undo2 } from 'lucide-react';
import PropertiesPanel from './components/PropertiesPanel';
import { exportDxf } from './export/dxfClient';
import { downloadBuilding, loadBuildingFromFile } from './export/jsonFile';
import { distance } from './model/geometry';
import { seedBuilding } from './model/seed';
import { selectActiveLevel, useBuildingStore, type Unit, type ViewMode } from './store/useBuildingStore';
import { createWall, pointAtLength } from './tools/wallTool';
import View2D from './views/View2D';

// Lazy: bundle 2D ban đầu không mang three.js (~600kB).
const View3D = lazy(() => import('./views/View3D'));

function fmt(valueMm: number, unit: Unit): string {
  return unit === 'mm' ? `${Math.round(valueMm)} mm` : `${(valueMm / 1000).toFixed(2)} m`;
}

export default function App() {
  const tool = useBuildingStore((s) => s.tool);
  const unit = useBuildingStore((s) => s.unit);
  const theme = useBuildingStore((s) => s.theme);
  const viewMode = useBuildingStore((s) => s.viewMode);
  const cursor = useBuildingStore((s) => s.cursorWorld);
  const snapKind = useBuildingStore((s) => s.snapKind);
  const camera = useBuildingStore((s) => s.camera);
  const draft = useBuildingStore((s) => s.draft);
  const lengthInput = useBuildingStore((s) => s.lengthInput);
  const canUndo = useBuildingStore((s) => s.past.length > 0);
  const canRedo = useBuildingStore((s) => s.future.length > 0);
  const wallCount = useBuildingStore((s) => selectActiveLevel(s)?.walls.length ?? 0);
  const openingCount = useBuildingStore((s) => selectActiveLevel(s)?.openings.length ?? 0);

  // Áp class dark cho Tailwind.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Phím tắt toàn cục.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Đang gõ trong input (panel thuộc tính) thì không nhận phím tắt app.
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      const s = useBuildingStore.getState();
      const mod = e.ctrlKey || e.metaKey;

      if (mod && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) s.redo();
        else s.undo();
        return;
      }
      if (mod && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        s.redo();
        return;
      }
      if (mod) return;

      if (e.key === 'Escape') {
        if (s.lengthInput) s.setLengthInput('');
        else if (s.draft) s.setDraft(null);
        else if (s.selectedWallId) s.setSelection(null);
        else if (s.selectedOpeningId) s.setOpeningSelection(null);
        return;
      }
      if (e.key === 'Backspace' && s.lengthInput) {
        s.setLengthInput(s.lengthInput.slice(0, -1));
        return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (s.selectedOpeningId) {
          s.deleteOpening(s.selectedOpeningId);
          s.setOpeningSelection(null);
        } else if (s.selectedWallId) {
          s.deleteWall(s.selectedWallId);
          s.setSelection(null);
        }
        return;
      }
      // Nhập số chiều dài khi đang vẽ tường.
      if (s.draft && /^[0-9]$/.test(e.key)) {
        s.setLengthInput(s.lengthInput + e.key);
        return;
      }
      if (s.draft && e.key === 'Enter' && s.lengthInput) {
        const len = parseInt(s.lengthInput, 10);
        if (Number.isFinite(len) && len > 0) {
          const end = pointAtLength(s.draft.start, s.draft.current, len);
          if (distance(s.draft.start, end) > 0) {
            s.addWall(createWall(s.draft.start, end));
            s.setDraft({ start: end, current: end });
          }
        }
        s.setLengthInput('');
        return;
      }
      if (e.key.toLowerCase() === 'v') s.setTool('select');
      if (e.key.toLowerCase() === 'w') s.setTool('wall');
      if (e.key.toLowerCase() === 'd') s.setTool('door');
      if (e.key.toLowerCase() === 'n') s.setTool('window');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const draftLen = draft ? Math.round(distance(draft.start, draft.current)) : null;
  const store = useBuildingStore.getState;

  // Thông báo ngắn ở status bar (lỗi mở file / xuất DXF, xác nhận đã lưu).
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashStatus = (msg: string) => {
    setStatusMsg(msg);
    if (statusTimer.current) clearTimeout(statusTimer.current);
    statusTimer.current = setTimeout(() => setStatusMsg(null), 6000);
  };
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    downloadBuilding(store().building);
    flashStatus('Đã lưu building.json.');
  };

  const handleOpenFile = async (file: File) => {
    try {
      store().loadBuilding(await loadBuildingFromFile(file));
      flashStatus(`Đã mở ${file.name}.`);
    } catch (err) {
      flashStatus(err instanceof Error ? err.message : 'Không mở được file.');
    }
  };

  const handleNew = () => {
    if (window.confirm('Tạo bản vẽ mới? Bản hiện tại sẽ bị thay bằng nhà mẫu (vẫn undo được bằng Ctrl+Z).')) {
      store().loadBuilding(seedBuilding());
      flashStatus('Đã tạo mới từ nhà mẫu.');
    }
  };

  const handleExportDxf = async () => {
    try {
      await exportDxf(store().building);
      flashStatus('Đã xuất building.dxf.');
    } catch (err) {
      flashStatus(err instanceof Error ? err.message : 'Xuất DXF thất bại.');
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Header */}
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-zinc-200 px-4 dark:border-zinc-800">
        <h1 className="text-sm font-semibold tracking-tight">Synaps Draft</h1>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {wallCount} tường · {openingCount} cửa
        </span>
        <div className="ml-auto flex items-center gap-1">
          {/* Lưu / mở / mới / xuất DXF */}
          <button
            type="button"
            title="Lưu bản vẽ (.json)"
            onClick={handleSave}
            className="rounded p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            <FileDown size={16} />
          </button>
          <button
            type="button"
            title="Mở bản vẽ (.json)"
            onClick={() => fileInputRef.current?.click()}
            className="rounded p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            <FolderOpen size={16} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = '';
              if (file) void handleOpenFile(file);
            }}
          />
          <button
            type="button"
            title="Tạo mới từ nhà mẫu"
            onClick={handleNew}
            className="rounded p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            <FilePlus2 size={16} />
          </button>
          <button
            type="button"
            title="Xuất DXF (cần API chạy ở cổng 8000)"
            onClick={() => void handleExportDxf()}
            className="mr-2 rounded border border-zinc-300 px-2 py-1 text-xs font-medium hover:bg-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Xuất DXF
          </button>
          {/* Chuyển chế độ xem 2D / 3D / chia đôi */}
          <div
            role="group"
            aria-label="Chế độ xem"
            className="mr-2 flex rounded border border-zinc-300 dark:border-zinc-700"
          >
            {(
              [
                ['2d', '2D', 'Mặt bằng 2D'],
                ['3d', '3D', 'Xem 3D'],
                ['split', '2D | 3D', 'Chia đôi: 2D trái, 3D phải'],
              ] as [ViewMode, string, string][]
            ).map(([mode, label, title]) => (
              <button
                key={mode}
                type="button"
                title={title}
                onClick={() => store().setViewMode(mode)}
                className={`px-2 py-1 text-xs font-medium first:rounded-l last:rounded-r ${
                  viewMode === mode
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            title="Hoàn tác (Ctrl+Z)"
            onClick={() => store().undo()}
            disabled={!canUndo}
            className="rounded p-1.5 hover:bg-zinc-200 disabled:opacity-40 dark:hover:bg-zinc-800"
          >
            <Undo2 size={16} />
          </button>
          <button
            type="button"
            title="Làm lại (Ctrl+Shift+Z)"
            onClick={() => store().redo()}
            disabled={!canRedo}
            className="rounded p-1.5 hover:bg-zinc-200 disabled:opacity-40 dark:hover:bg-zinc-800"
          >
            <Redo2 size={16} />
          </button>
          <button
            type="button"
            title="Đổi đơn vị hiển thị"
            onClick={() => store().setUnit(unit === 'mm' ? 'm' : 'mm')}
            className="ml-2 rounded border border-zinc-300 px-2 py-1 text-xs font-medium hover:bg-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            {unit}
          </button>
          <button
            type="button"
            title="Đổi giao diện sáng/tối"
            onClick={() => store().setTheme(theme === 'light' ? 'dark' : 'light')}
            className="rounded p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Toolbar trái */}
        <nav className="flex w-12 shrink-0 flex-col items-center gap-1 border-r border-zinc-200 py-2 dark:border-zinc-800">
          <button
            type="button"
            title="Chọn (V)"
            onClick={() => store().setTool('select')}
            className={`rounded p-2 ${tool === 'select' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'hover:bg-zinc-200 dark:hover:bg-zinc-800'}`}
          >
            <MousePointer2 size={18} />
          </button>
          <button
            type="button"
            title="Vẽ tường (W) — click đặt điểm, Esc để dừng, gõ số + Enter để nhập chiều dài"
            onClick={() => store().setTool('wall')}
            className={`rounded p-2 ${tool === 'wall' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'hover:bg-zinc-200 dark:hover:bg-zinc-800'}`}
          >
            <Slash size={18} />
          </button>
          <button
            type="button"
            title="Đặt cửa đi (D) — click lên tường gần nhất"
            onClick={() => store().setTool('door')}
            className={`rounded p-2 ${tool === 'door' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'hover:bg-zinc-200 dark:hover:bg-zinc-800'}`}
          >
            <DoorOpen size={18} />
          </button>
          <button
            type="button"
            title="Đặt cửa sổ (N) — click lên tường gần nhất"
            onClick={() => store().setTool('window')}
            className={`rounded p-2 ${tool === 'window' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'hover:bg-zinc-200 dark:hover:bg-zinc-800'}`}
          >
            <AppWindow size={18} />
          </button>
        </nav>

        {/* Canvas: 2D, 3D, hoặc chia đôi dọc (2D trái, 3D phải, mỗi bên 50%). */}
        <main className="flex min-w-0 flex-1">
          {(viewMode === '2d' || viewMode === 'split') && (
            <div className={viewMode === 'split' ? 'h-full w-1/2 border-r border-zinc-200 dark:border-zinc-800' : 'h-full w-full'}>
              <View2D />
            </div>
          )}
          {(viewMode === '3d' || viewMode === 'split') && (
            <div className={viewMode === 'split' ? 'h-full w-1/2' : 'h-full w-full'}>
              <Suspense
                fallback={
                  <div className="flex h-full w-full items-center justify-center text-sm text-zinc-500">
                    Đang tải 3D…
                  </div>
                }
              >
                <View3D />
              </Suspense>
            </div>
          )}
        </main>

        {/* Panel thuộc tính phải */}
        <PropertiesPanel />
      </div>

      {/* Status bar */}
      <footer className="flex h-8 shrink-0 items-center gap-4 border-t border-zinc-200 px-3 text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
        <span className="tabular-nums">
          {cursor ? `X ${fmt(cursor.x, unit)} · Y ${fmt(cursor.y, unit)}` : '—'}
        </span>
        <span className="tabular-nums">Zoom {Math.round(camera.scale * 100)}%</span>
        <span>Snap: {snapKind ?? '—'}</span>
        {draftLen !== null && (
          <span className="tabular-nums font-medium text-zinc-900 dark:text-zinc-100">
            Đoạn đang vẽ: {fmt(draftLen, unit)}
          </span>
        )}
        {lengthInput && (
          <span className="rounded bg-blue-100 px-2 py-0.5 font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            Chiều dài: {lengthInput} mm — Enter để chốt, Esc để hủy
          </span>
        )}
        {statusMsg && <span className="truncate font-medium text-zinc-900 dark:text-zinc-100">{statusMsg}</span>}
        <span className="ml-auto hidden sm:inline">
          Chuột giữa / Space+kéo: pan · Lăn chuột: zoom · Esc: dừng vẽ
        </span>
      </footer>
    </div>
  );
}
