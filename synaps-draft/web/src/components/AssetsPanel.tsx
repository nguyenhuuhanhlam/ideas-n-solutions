import {
  Armchair,
  Bath,
  BedDouble,
  CookingPot,
  Lamp,
  Leaf,
  Sofa,
  Table2,
  type LucideIcon,
} from 'lucide-react';

const ASSETS: { icon: LucideIcon; label: string }[] = [
  { icon: Sofa, label: 'Sofa' },
  { icon: BedDouble, label: 'Giường' },
  { icon: Table2, label: 'Bàn' },
  { icon: Armchair, label: 'Ghế bành' },
  { icon: Lamp, label: 'Đèn' },
  { icon: Leaf, label: 'Cây' },
  { icon: CookingPot, label: 'Bếp' },
  { icon: Bath, label: 'Bồn tắm' },
];

/** Thư viện asset — chỉ hiển thị, chưa đặt được vào bản vẽ. */
export default function AssetsPanel() {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        {ASSETS.map(({ icon: Icon, label }) => (
          <button
            key={label}
            type="button"
            disabled
            title="Sắp có"
            className="flex flex-col items-center gap-1.5 rounded-xl border border-syn-border bg-white p-3 text-syn-grey disabled:opacity-70"
          >
            <Icon size={20} strokeWidth={1.5} />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-syn-grey">Thư viện asset sắp có.</p>
    </div>
  );
}
