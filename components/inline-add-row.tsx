// components/inline-add-row.tsx
"use client";
import { useState } from "react";
import { getDisplayName } from "@/lib/household";
import { apiFetch } from "@/lib/api-client";

type Props = {
  storeId: string;
  onAdded: () => void;
};

export function InlineAddRow({ storeId, onAdded }: Props) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    const name = value.trim();
    if (!name) return;
    setLoading(true);
    try {
      await apiFetch("/api/items", {
        method: "POST",
        body: JSON.stringify({
          name,
          storeIds: [storeId],
          addedByName: getDisplayName(),
        }),
      });
      setValue("");
      onAdded();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border-2 border-dashed border-green-300 bg-green-50 px-4 py-2.5">
      <span className="text-green-500 text-lg leading-none">+</span>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Add item to this store…"
        disabled={loading}
        className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-green-400"
      />
      {value.trim() && (
        <button
          onClick={submit}
          disabled={loading}
          className="text-xs font-semibold text-green-600 disabled:opacity-50"
        >
          Add
        </button>
      )}
    </div>
  );
}
