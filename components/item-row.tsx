// components/item-row.tsx
import type { Item } from "@/hooks/use-items";

type Props = {
  item: Item;
  onPickup: (id: string) => void;
};

export function ItemRow({ item, onPickup }: Props) {
  const isPickedUp = item.status === "picked_up";

  return (
    <div
      className={`flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm transition-opacity ${
        isPickedUp ? "opacity-40" : ""
      }`}
    >
      <button
        onClick={() => !isPickedUp && onPickup(item.id)}
        aria-label={isPickedUp ? "Picked up" : "Mark as picked up"}
        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
          isPickedUp
            ? "border-green-500 bg-green-500 text-white"
            : "border-gray-300 hover:border-green-400"
        }`}
      >
        {isPickedUp && <span className="text-xs">✓</span>}
      </button>
      <span
        className={`flex-1 text-sm text-gray-800 ${isPickedUp ? "line-through text-gray-400" : ""}`}
      >
        {item.name}
      </span>
      <span className="text-xs text-gray-400">{item.category}</span>
    </div>
  );
}
