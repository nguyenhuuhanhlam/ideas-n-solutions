import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import ExportDialog from './components/ExportDialog';
import IconToolbar from './components/IconToolbar';
import SynapsPanel, { type PanelTab } from './components/SynapsPanel';
import TopActions from './components/TopActions';
import { exportDxf } from './export/dxfClient';
import { downloadBuilding, loadBuildingFromFile } from './export/jsonFile';
import { distance } from './model/geometry';
import { seedBuilding } from './model/seed';
import type { View2d } from './model/elevation';
import { selectActiveLevel, useBuildingStore, type ViewMode } from './store/useBuildingStore';
import { createWall, pointAtLength } from './tools/wallTool';
import View2D from './views/View2D';

// Lazy: bundle 2D ban đầu không mang three.js (~600kB).
const View3D = lazy(() => import('./views/View3D'));

const pillGroup =
  'flex rounded-full border border-syn-border bg-white p-1 shadow-sm';
const pillSegment = (active: boolean) =>
  `rounded-full px-3 py-1 text-xs font-medium ${
    active ? 'bg-syn-ink text-white' : 'text-syn-grey hover:text-syn-ink'
  }`;

export default function App() {
  const tool = useBuildingStore((s) => s.tool);
  const unit = useBuildingStore((s) => s.unit);
  const viewMode = useBuildingStore((s) => s.viewMode);
  const view2d = useBuildingStore((s) => s.view2d);
  const camera = useBuildingStore((s) => s.cameras[s.view2d]);
  const fitScale = useBuildingStore((s) => s.fitScale);
  const canUndo = useBuildingStore((s) => s.past.length > 0);
  const canRedo = useBuildingStore((s) => s.future.length > 0);
  const wallCount = useBuildingStore((s) => selectActiveLevel(s)?.walls.length ?? 0);
  const openingCount = useBuildingStore((s) => selectActiveLevel(s)?.openings.length ?? 0);

  const panelVisible = useBuildingStore((s) => s.panelVisible);
  const [activeTab, setActiveTab] = useState<PanelTab>('properties');
  const [exportOpen, setExportOpen] = useState(false);

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
      // Tool vẽ chỉ chạy ở mặt bằng Top (mặt đứng chỉ chọn/xem).
      if (s.view2d === 'top') {
        if (e.key.toLowerCase() === 'w') s.setTool('wall');
        if (e.key.toLowerCase() === 'd') s.setTool('door');
        if (e.key.toLowerCase() === 'n') s.setTool('window');
      }
      // Chuyển view 2D: 1 = mặt bằng Top, 2/3 = mặt đứng Left/Right.
      // (Đặt sau khối nhập số khi draft nên số vẫn vào chiều dài khi đang vẽ.)
      // Shift+1 = vừa khung hình (về zoom 100%).
      if (e.shiftKey && e.code === 'Digit1') {
        s.requestFit();
        return;
      }
      if (e.key === '1') s.setView2d('top');
      if (e.key === '2') s.setView2d('left');
      if (e.key === '3') s.setView2d('right');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const store = useBuildingStore.getState;

  // Thông báo ngắn dạng toast (lỗi mở file / xuất DXF, xác nhận đã lưu).
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
    <div className="relative h-screen w-screen overflow-hidden bg-syn-canvas font-sans text-syn-ink">
      {/* Canvas chiếm toàn màn hình: 2D, 3D, hoặc chia đôi dọc (2D trái, 3D phải). */}
      <main className="absolute inset-0 flex">
        {(viewMode === '2d' || viewMode === 'split') && (
          <div className={viewMode === 'split' ? 'h-full w-1/2 border-r border-syn-border' : 'h-full w-full'}>
            <View2D />
          </div>
        )}
        {(viewMode === '3d' || viewMode === 'split') && (
          <div className={viewMode === 'split' ? 'h-full w-1/2' : 'h-full w-full'}>
            <Suspense
              fallback={
                <div className="flex h-full w-full items-center justify-center text-sm text-syn-grey">
                  Đang tải 3D…
                </div>
              }
            >
              <View3D />
            </Suspense>
          </div>
        )}
      </main>

      {/* Panel trái + toolbar icon, nổi trên canvas */}
      <div className="absolute bottom-3 left-3 top-3 z-20 flex gap-2">
        {panelVisible && (
          <SynapsPanel
            tab={activeTab}
            onTabChange={setActiveTab}
            onCollapse={() => store().setPanelVisible(false)}
          />
        )}
        <IconToolbar
          tool={tool}
          view2d={view2d}
          onSelectTool={(t) => store().setTool(t)}
          onTogglePanel={() => store().setPanelVisible(!panelVisible)}
        />
      </div>

      {/* Chuyển view, nổi giữa trên */}
      <div className="absolute left-1/2 top-3 z-20 flex -translate-x-1/2 gap-2">
        {(viewMode === '2d' || viewMode === 'split') && (
          <div role="group" aria-label="View 2D" className={pillGroup}>
            {(
              [
                ['top', 'Top', 'Mặt bằng (1)'],
                ['left', 'Left', 'Mặt đứng nhìn từ tây (2)'],
                ['right', 'Right', 'Mặt đứng nhìn từ đông (3)'],
              ] as [View2d, string, string][]
            ).map(([view, label, title]) => (
              <button
                key={view}
                type="button"
                title={title}
                onClick={() => store().setView2d(view)}
                className={pillSegment(view2d === view)}
              >
                {label}
              </button>
            ))}
          </div>
        )}
        <div role="group" aria-label="Chế độ xem" className={pillGroup}>
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
              className={pillSegment(viewMode === mode)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Hành động nổi góc phải trên */}
      <div className="absolute right-3 top-3 z-20">
        <TopActions
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={() => store().undo()}
          onRedo={() => store().redo()}
          onOpen={() => fileInputRef.current?.click()}
          onExport={() => setExportOpen(true)}
          onSave={handleSave}
          onNew={handleNew}
        />
      </div>
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

      {/* Zoom + đơn vị, nổi góc phải dưới (độ dài đang vẽ đã hiện ở pill nổi cạnh con trỏ). */}
      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
        <button
          type="button"
          title="Đổi đơn vị hiển thị"
          onClick={() => store().setUnit(unit === 'mm' ? 'm' : 'mm')}
          className="rounded-full border border-syn-border bg-white px-3 py-1.5 text-xs font-medium text-syn-ink shadow-sm hover:bg-syn-field"
        >
          {unit}
        </button>
        {/* Zoom tính theo mốc vừa khung hình (100%): bấm để về 100%. */}
        <button
          type="button"
          title="Vừa khung hình (100%) — Shift+1"
          onClick={() => store().requestFit()}
          className="rounded-full border border-syn-border bg-white px-3 py-1.5 text-xs font-medium tabular-nums text-syn-ink shadow-sm hover:bg-syn-field"
        >
          Zoom {Math.round((camera.scale / fitScale) * 100)}%
        </button>
      </div>

      {/* Toast trạng thái, nổi giữa dưới */}
      {statusMsg && (
        <div className="absolute bottom-3 left-1/2 z-30 -translate-x-1/2 rounded-full bg-syn-ink px-4 py-2 text-sm text-white shadow-lg">
          {statusMsg}
        </div>
      )}

      {/* Dialog xuất */}
      {exportOpen && (
        <ExportDialog
          wallCount={wallCount}
          openingCount={openingCount}
          onClose={() => setExportOpen(false)}
          onExport={handleExportDxf}
        />
      )}
    </div>
  );
}
