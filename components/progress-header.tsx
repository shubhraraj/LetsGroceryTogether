// components/progress-header.tsx
type Props = {
  storeName: string;
  storeEmoji: string;
  total: number;
  pickedUp: number;
  onBack: () => void;
};

export function ProgressHeader({ storeName, storeEmoji, total, pickedUp, onBack }: Props) {
  const pct = total === 0 ? 0 : Math.round((pickedUp / total) * 100);

  return (
    <div className="sticky top-0 z-10 bg-white px-4 pt-6 pb-3 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600"
        >
          ←
        </button>
        <span className="text-xl">{storeEmoji}</span>
        <h2 className="text-lg font-bold text-gray-900 flex-1">{storeName}</h2>
        <span className="text-xs text-gray-400">{pickedUp}/{total} picked up</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-100">
        <div
          className="h-1.5 rounded-full bg-green-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
