import {
  AppWindow,
  BrickWall,
  Building2,
  Circle,
  DoorOpen,
  Image,
  MapPin,
  MoreHorizontal,
  MousePointer2,
  PanelLeft,
  Spline,
  Square,
  Type,
  Waves,
} from 'lucide-react';
import type { ComponentType } from 'react';
import type { View2d } from '../model/elevation';
import type { Tool } from '../store/useBuildingStore';

interface IconToolbarProps {
  tool: Tool;
  view2d: View2d;
  onSelectTool: (tool: Tool) => void;
  onTogglePanel: () => void;
}

interface ToolButtonProps {
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  Icon: ComponentType<{ size?: number | string; strokeWidth?: number | string }>;
}

function ToolButton({ title, active, disabled, onClick, Icon }: ToolButtonProps) {
  return (
    <button
      type="button"
      title={title}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
        active
          ? 'bg-syn-ink text-white'
          : disabled
            ? 'cursor-not-allowed text-zinc-300'
            : 'text-syn-ink hover:bg-syn-field'
      }`}
    >
      <Icon size={20} strokeWidth={1.5} />
    </button>
  );
}

function Divider() {
  return <div className="my-1 h-px w-8 bg-syn-border" aria-hidden="true" />;
}

/** Toolbar icon dọc dock sát panel trái, theo phong cách Synaps. */
export default function IconToolbar({ tool, view2d, onSelectTool, onTogglePanel }: IconToolbarProps) {
  const drawDisabled = view2d !== 'top';
  return (
    <nav
      aria-label="Công cụ vẽ"
      className="flex w-14 flex-col items-center gap-1 self-start rounded-2xl border border-syn-border bg-white p-1.5 shadow-lg"
    >
      {/* Ẩn/hiện panel */}
      <ToolButton title="Ẩn/hiện panel" onClick={onTogglePanel} Icon={PanelLeft} />
      <Divider />
      {/* Chọn */}
      <ToolButton
        title="Chọn (V)"
        active={tool === 'select'}
        onClick={() => onSelectTool('select')}
        Icon={MousePointer2}
      />
      <Divider />
      {/* Chưa có trong C1: chỉ hiển thị, disabled */}
      <ToolButton title="Sắp có" disabled Icon={MapPin} />
      <ToolButton title="Sắp có" disabled Icon={Building2} />
      <ToolButton title="Sắp có" disabled Icon={Spline} />
      <ToolButton title="Sắp có" disabled Icon={Square} />
      <ToolButton title="Sắp có" disabled Icon={Circle} />
      <ToolButton title="Sắp có" disabled Icon={MoreHorizontal} />
      <Divider />
      {/* Công cụ vẽ thật — chỉ ở mặt bằng Top */}
      <ToolButton
        title={
          drawDisabled
            ? 'Chỉ vẽ ở mặt bằng Top'
            : 'Vẽ tường (W) — click đặt điểm, Esc để dừng, gõ số + Enter để nhập chiều dài'
        }
        active={tool === 'wall'}
        disabled={drawDisabled}
        onClick={() => onSelectTool('wall')}
        Icon={BrickWall}
      />
      <ToolButton
        title={drawDisabled ? 'Chỉ vẽ ở mặt bằng Top' : 'Đặt cửa đi (D) — click lên tường gần nhất'}
        active={tool === 'door'}
        disabled={drawDisabled}
        onClick={() => onSelectTool('door')}
        Icon={DoorOpen}
      />
      <ToolButton
        title={drawDisabled ? 'Chỉ vẽ ở mặt bằng Top' : 'Đặt cửa sổ (N) — click lên tường gần nhất'}
        active={tool === 'window'}
        disabled={drawDisabled}
        onClick={() => onSelectTool('window')}
        Icon={AppWindow}
      />
      <Divider />
      {/* Chưa có trong C1: chỉ hiển thị, disabled */}
      <ToolButton title="Sắp có" disabled Icon={Image} />
      <ToolButton title="Sắp có" disabled Icon={Waves} />
      <ToolButton title="Sắp có" disabled Icon={Type} />
      <ToolButton title="Sắp có" disabled Icon={MoreHorizontal} />
    </nav>
  );
}
