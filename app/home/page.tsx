// app/home/page.tsx
"use client";
import { useState } from "react";
import { useStores } from "@/hooks/use-stores";
import { useItems, activeCountForStore } from "@/hooks/use-items";
import { StoreCard } from "@/components/store-card";
import { AddItemSheet } from "@/components/add-item-sheet";

export default function HomePage() {
  const { stores, isLoading: storesLoading } = useStores();
  const { items, mutate: mutateItems } = useItems();
  const [sheetOpen, setSheetOpen] = useState(false);

  if (storesLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Grocery List</h1>
        <button
          onClick={() => setSheetOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white text-xl shadow-md active:scale-95 transition-transform"
          aria-label="Add item"
        >
          +
        </button>
      </div>

      {stores.length === 0 ? (
        <div className="mt-12 text-center text-gray-400">
          <p className="text-4xl mb-3">🏪</p>
          <p className="text-sm">No stores yet. Add one in Settings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {stores.map((store) => (
            <StoreCard
              key={store.id}
              id={store.id}
              name={store.name}
              emoji={store.emoji}
              activeCount={activeCountForStore(items, store.id)}
            />
          ))}
        </div>
      )}

      {sheetOpen && (
        <AddItemSheet
          stores={stores}
          onClose={() => setSheetOpen(false)}
          onAdded={() => mutateItems()}
        />
      )}
    </div>
  );
}
