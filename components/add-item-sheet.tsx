// components/add-item-sheet.tsx
"use client";
import { useState, useEffect } from "react";
import type { Store } from "@/hooks/use-stores";
import { apiFetch } from "@/lib/api-client";
import { detectCategory } from "@/lib/category-detector";
import { getDisplayName } from "@/lib/household";

const CATEGORIES = [
  "Produce", "Dairy", "Meat / Seafood", "Bread / Bakery",
  "Snacks", "Alcohol", "Beverages", "Pantry / Canned",
  "Toiletries", "Cleaning Supplies",
];

type Props = {
  stores: Store[];
  onClose: () => void;
  onAdded: () => void;
};

export function AddItemSheet({ stores, onClose, onAdded }: Props) {
  const [name, setName] = useState("");
  const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>([]); // empty = anywhere
  const [category, setCategory] = useState("Pantry / Canned");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-detect category as user types
  useEffect(() => {
    if (name.trim()) setCategory(detectCategory(name));
  }, [name]);

  function toggleStore(storeId: string) {
    setSelectedStoreIds((prev) =>
      prev.includes(storeId) ? prev.filter((id) => id !== storeId) : [...prev, storeId]
    );
  }

  function selectAnywhere() {
    setSelectedStoreIds([]);
  }

  const isAnywhere = selectedStoreIds.length === 0;

  async function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) { setError("Item name is required."); return; }
    setLoading(true);
    setError("");
    try {
      await apiFetch("/api/items", {
        method: "POST",
        body: JSON.stringify({
          name: trimmed,
          storeIds: selectedStoreIds,
          addedByName: getDisplayName(),
        }),
      });
      onAdded();
      onClose();
    } catch {
      setError("Failed to add item. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-lg rounded-t-2xl bg-white px-4 pb-safe pt-4 shadow-2xl">
        {/* Drag handle */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-300" />

        <h3 className="mb-4 text-base font-semibold text-gray-900">Add to list</h3>

        <input
          type="text"
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          autoFocus
          className="mb-3 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Store chips */}
        <div className="mb-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">Store</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={selectAnywhere}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                isAnywhere
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Anywhere
            </button>
            {stores.map((store) => (
              <button
                key={store.id}
                onClick={() => toggleStore(store.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedStoreIds.includes(store.id)
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {store.emoji} {store.name}
              </button>
            ))}
          </div>
        </div>

        {/* Category picker */}
        <div className="mb-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
            Category <span className="text-gray-300">(auto-detected)</span>
          </p>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {error && <p className="mb-2 text-sm text-red-500">{error}</p>}

        <button
          onClick={handleAdd}
          disabled={loading}
          className="w-full rounded-xl bg-green-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Adding…" : "Add to list"}
        </button>
        <div className="h-4" />
      </div>
    </>
  );
}
