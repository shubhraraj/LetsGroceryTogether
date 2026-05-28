// app/store/[storeId]/page.tsx
"use client";
import { useRouter, useParams } from "next/navigation";
import { useStores } from "@/hooks/use-stores";
import { useItems, itemsForStore } from "@/hooks/use-items";
import { ProgressHeader } from "@/components/progress-header";
import { ItemRow } from "@/components/item-row";
import { InlineAddRow } from "@/components/inline-add-row";
import { getDisplayName } from "@/lib/household";
import { apiFetch } from "@/lib/api-client";

export default function StoreListPage() {
  const router = useRouter();
  const { storeId } = useParams<{ storeId: string }>();
  const { stores } = useStores();
  const { items, mutate } = useItems();

  const store = stores.find((s) => s.id === storeId);
  const storeItems = itemsForStore(items, storeId);
  const active = storeItems.filter((i) => i.status === "active");
  const pickedUp = storeItems.filter((i) => i.status === "picked_up");

  async function handlePickup(itemId: string) {
    // Optimistic update
    mutate(
      (prev) =>
        prev?.map((item) =>
          item.id === itemId ? { ...item, status: "picked_up" as const } : item
        ),
      false
    );
    await apiFetch(`/api/items/${itemId}/pickup`, {
      method: "PATCH",
      body: JSON.stringify({ pickedUpByName: getDisplayName() }),
    });
    mutate();
  }

  if (!store) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-400">
        Store not found
      </div>
    );
  }

  return (
    <div>
      <ProgressHeader
        storeName={store.name}
        storeEmoji={store.emoji}
        total={storeItems.length}
        pickedUp={pickedUp.length}
        onBack={() => router.push("/home")}
      />

      <div className="space-y-2 px-4 pt-4">
        <InlineAddRow storeId={storeId} onAdded={() => mutate()} />

        {active.map((item) => (
          <ItemRow key={item.id} item={item} onPickup={handlePickup} />
        ))}

        {pickedUp.length > 0 && (
          <>
            <div className="pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Picked up this trip
            </div>
            {pickedUp.map((item) => (
              <ItemRow key={item.id} item={item} onPickup={handlePickup} />
            ))}
          </>
        )}

        {storeItems.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            <p className="text-3xl mb-2">✓</p>
            <p className="text-sm">Nothing needed from here</p>
          </div>
        )}
      </div>
    </div>
  );
}
