// components/suggestion-row.tsx
import type { Suggestion } from "@/hooks/use-suggestions";
import type { Store } from "@/hooks/use-stores";

type Props = {
  suggestion: Suggestion;
  stores: Store[];
  onAddBack: (id: string) => void;
};

export function SuggestionRow({ suggestion, stores, onAddBack }: Props) {
  const storeNames =
    suggestion.suggestionStores.length === 0
      ? "Anywhere"
      : suggestion.suggestionStores
          .map((ss) => stores.find((s) => s.id === ss.storeId)?.name ?? "")
          .filter(Boolean)
          .join(", ");

  return (
    <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{suggestion.itemName}</p>
        <p className="text-xs text-gray-400">{storeNames} · {suggestion.frequency}</p>
      </div>
      <button
        onClick={() => onAddBack(suggestion.id)}
        className="flex-shrink-0 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700 active:bg-green-200"
      >
        + Add back
      </button>
    </div>
  );
}
