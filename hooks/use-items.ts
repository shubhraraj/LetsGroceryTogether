// hooks/use-items.ts
import useSWR from "swr";
import { apiFetch } from "@/lib/api-client";

export type Item = {
  id: string;
  householdId: string;
  name: string;
  category: string;
  status: "active" | "picked_up";
  addedByName: string;
  pickedUpByName: string | null;
  pickedUpAt: string | null;
  createdAt: string;
  itemStores: { storeId: string }[];
};

export function useItems() {
  const { data, error, mutate } = useSWR<Item[]>("/api/items", apiFetch, {
    refreshInterval: 5000,
  });
  return { items: data ?? [], isLoading: !data && !error, error, mutate };
}

/** Items visible in a specific store's list — store-specific + anywhere items. */
export function itemsForStore(items: Item[], storeId: string): Item[] {
  return items.filter(
    (item) =>
      item.itemStores.length === 0 ||
      item.itemStores.some((is) => is.storeId === storeId)
  );
}

/** Count of active items for a store card badge. */
export function activeCountForStore(items: Item[], storeId: string): number {
  return itemsForStore(items, storeId).filter((i) => i.status === "active").length;
}
