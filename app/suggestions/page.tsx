// app/suggestions/page.tsx
"use client";
import { useSuggestions } from "@/hooks/use-suggestions";
import { useStores } from "@/hooks/use-stores";
import { useItems } from "@/hooks/use-items";
import { SuggestionRow } from "@/components/suggestion-row";
import { apiFetch } from "@/lib/api-client";
import { getDisplayName } from "@/lib/household";

export default function SuggestionsPage() {
  const { suggestions, isLoading, mutate: mutateSuggestions } = useSuggestions();
  const { stores } = useStores();
  const { mutate: mutateItems } = useItems();

  async function handleAddBack(suggestionId: string) {
    await apiFetch(`/api/suggestions/${suggestionId}/add`, {
      method: "POST",
      body: JSON.stringify({ addedByName: getDisplayName() }),
    });
    mutateItems();
    mutateSuggestions();
  }

  return (
    <div className="px-4 pt-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Suggestions</h1>

      {isLoading ? (
        <div className="flex justify-center pt-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
        </div>
      ) : suggestions.length === 0 ? (
        <div className="pt-16 text-center text-gray-400">
          <p className="text-4xl mb-3">✅</p>
          <p className="text-sm">Nothing to re-stock yet.</p>
          <p className="text-xs mt-1">Items appear here when it&apos;s time to reorder.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {suggestions.map((s) => (
            <SuggestionRow
              key={s.id}
              suggestion={s}
              stores={stores}
              onAddBack={handleAddBack}
            />
          ))}
        </div>
      )}
    </div>
  );
}
