// hooks/use-suggestions.ts
import useSWR from "swr";
import { apiFetch } from "@/lib/api-client";

export type Suggestion = {
  id: string;
  householdId: string;
  itemName: string;
  category: string;
  frequency: string;
  nextSuggestAt: string;
  purchaseCount: number;
  avgDaysBetweenPurchases: number | null;
  createdAt: string;
  suggestionStores: { storeId: string }[];
};

export function useSuggestions() {
  const { data, error, mutate } = useSWR<Suggestion[]>("/api/suggestions", apiFetch, {
    refreshInterval: 5000,
  });
  return { suggestions: data ?? [], isLoading: !data && !error, error, mutate };
}
