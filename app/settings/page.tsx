// app/settings/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStores } from "@/hooks/use-stores";
import { getInviteCode, getDisplayName, clearHousehold, saveDisplayName } from "@/lib/household";
import { apiFetch } from "@/lib/api-client";

export default function SettingsPage() {
  const router = useRouter();
  const { stores, mutate: mutateStores } = useStores();
  const inviteCode = getInviteCode() ?? "------";
  const [displayName, setDisplayName] = useState(getDisplayName);
  const [newStoreName, setNewStoreName] = useState("");
  const [newStoreEmoji, setNewStoreEmoji] = useState("🛒");
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleAddStore() {
    if (!newStoreName.trim()) return;
    await apiFetch("/api/stores", {
      method: "POST",
      body: JSON.stringify({ name: newStoreName.trim(), emoji: newStoreEmoji }),
    });
    setNewStoreName("");
    setNewStoreEmoji("🛒");
    mutateStores();
  }

  async function handleDeleteStore(id: string) {
    if (!confirm("Delete this store? Items assigned only to this store will become 'anywhere'.")) return;
    await apiFetch(`/api/stores/${id}`, { method: "DELETE" });
    mutateStores();
  }

  function handleLeave() {
    if (!confirm("Leave this household? You'll need the invite code to rejoin.")) return;
    clearHousehold();
    router.replace("/onboarding");
  }

  return (
    <div className="px-4 pt-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      {/* Display name */}
      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Your name</h2>
        <div className="flex gap-2">
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={() => saveDisplayName(displayName)}
            className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white"
          >
            Save
          </button>
        </div>
      </section>

      {/* Invite code */}
      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Invite code</h2>
        <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
          <span className="flex-1 font-mono text-xl font-bold tracking-widest text-gray-800">
            {inviteCode}
          </span>
          <button
            onClick={handleCopy}
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-400">Share this code with roommates to join your list.</p>
      </section>

      {/* Stores */}
      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Stores</h2>
        <div className="space-y-2 mb-3">
          {stores.map((store) => (
            <div
              key={store.id}
              className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm"
            >
              <span className="text-xl">{store.emoji}</span>
              <span className="flex-1 text-sm font-medium text-gray-800">{store.name}</span>
              <button
                onClick={() => handleDeleteStore(store.id)}
                className="text-xs text-red-400 hover:text-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newStoreEmoji}
            onChange={(e) => setNewStoreEmoji(e.target.value)}
            placeholder="🛒"
            className="w-14 rounded-xl border border-gray-200 px-2 py-2.5 text-center text-xl outline-none"
          />
          <input
            value={newStoreName}
            onChange={(e) => setNewStoreName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddStore()}
            placeholder="Store name"
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleAddStore}
            className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white"
          >
            Add
          </button>
        </div>
      </section>

      {/* Leave household */}
      <section className="pb-8">
        <button
          onClick={handleLeave}
          className="w-full rounded-xl border border-red-200 py-3 text-sm font-medium text-red-500"
        >
          Leave household
        </button>
      </section>
    </div>
  );
}
