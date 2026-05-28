// components/add-item-sheet.tsx (STUB - will be replaced in Task 16)
"use client";
import type { Store } from "@/hooks/use-stores";

type Props = {
  stores: Store[];
  onClose: () => void;
  onAdded: () => void;
};

export function AddItemSheet({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={onClose}>
      <div className="w-full rounded-t-2xl bg-white p-6 text-center text-gray-400">
        Add Item Sheet (coming soon)
      </div>
    </div>
  );
}
