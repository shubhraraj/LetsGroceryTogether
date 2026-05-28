// hooks/use-stores.ts
import useSWR from "swr";
import { apiFetch } from "@/lib/api-client";

export type Store = {
  id: string;
  householdId: string;
  name: string;
  emoji: string;
  createdAt: string;
};

export function useStores() {
  const { data, error, mutate } = useSWR<Store[]>("/api/stores", apiFetch, {
    refreshInterval: 5000,
  });
  return { stores: data ?? [], isLoading: !data && !error, error, mutate };
}
