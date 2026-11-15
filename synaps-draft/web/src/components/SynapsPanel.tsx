import { PanelLeftClose, Sparkles } from 'lucide-react';
import AssetsPanel from './AssetsPanel';
import LayersPanel from './LayersPanel';
import PropertiesPanel from './PropertiesPanel';

export type PanelTab = 'properties' | 'layers' | 'assets';

interface SynapsPanelProps {
  tab: PanelTab;
  onTabChange: (tab: PanelTab) => void;
  onCollapse: () => void;
}

const TABS: [PanelTab, string][] = [
  ['properties', 'Properties'],
  ['layers', 'Layers'],
  ['assets', 'Assets'],
];

/** Panel nổi bên trái theo phong cách Synaps: header workspace + tab + nội dung. */
export default function SynapsPanel({ tab, onTabChange, onCollapse }: SynapsPanelProps) {
  return (
    <div className="flex w-[300px] flex-col rounded-[18px] border border-syn-border bg-white shadow-lg">
      {/* Header */}
      <div className="flex items-start gap-2.5 px-4 pt-4">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-syn-ink text-white">
          <Sparkles size={18} strokeWidth={1.5} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold leading-tight text-syn-ink">
            Synaps Draft
          </p>
          <p className="truncate text-xs text-syn-grey">Residential Projects</p>
        </div>
        <button
          type="button"
          title="Thu gọn panel"
          onClick={onCollapse}
          className="rounded-lg p-1.5 text-syn-grey hover:bg-syn-field hover:text-syn-ink"
        >
          <PanelLeftClose size={18} strokeWidth={1.5} />
        </button>
      </div>

      {/* Tabs */}
      <div role="tablist" aria-label="Panel" className="flex gap-1 px-3 pt-3">
        {TABS.map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            onClick={() => onTabChange(value)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              tab === value
                ? 'bg-syn-field text-syn-ink'
                : 'text-syn-grey hover:text-syn-ink'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Nội dung tab */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
        {tab === 'properties' && <PropertiesPanel />}
        {tab === 'layers' && <LayersPanel />}
        {tab === 'assets' && <AssetsPanel />}
      </div>
    </div>
  );
}
