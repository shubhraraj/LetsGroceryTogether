// app/onboarding/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveHousehold, saveDisplayName } from "@/lib/household";

export default function OnboardingPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"create" | "join">("create");
  const [name, setName] = useState("");
  const [householdName, setHouseholdName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!name.trim() || !householdName.trim()) {
      setError("Please fill in both fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/households", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: householdName.trim() }),
      });
      if (!res.ok) throw new Error("Failed to create household");
      const data = await res.json();
      saveHousehold(data.id, data.inviteCode);
      saveDisplayName(name.trim());
      router.replace("/home");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin() {
    if (!name.trim() || code.trim().length !== 6) {
      setError("Enter your name and a 6-character code.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/households/${code.trim().toUpperCase()}`);
      if (res.status === 404) {
        setError("Code not found. Check and try again.");
        return;
      }
      if (!res.ok) throw new Error("Failed to join");
      const data = await res.json();
      saveHousehold(data.id, data.inviteCode);
      saveDisplayName(name.trim());
      router.replace("/home");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="mb-8 text-center">
        <div className="mb-2 text-5xl">🛒</div>
        <h1 className="text-2xl font-bold text-gray-900">Roomie Grocery</h1>
        <p className="mt-1 text-sm text-gray-500">Shared lists for your household</p>
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-4 flex rounded-xl bg-gray-100 p-1">
          {(["create", "join"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(""); }}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                tab === t ? "bg-white shadow text-gray-900" : "text-gray-500"
              }`}
            >
              {t === "create" ? "Create household" : "Join household"}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500"
          />
          {tab === "create" ? (
            <input
              type="text"
              placeholder="Household name (e.g. 2450 Oak St)"
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500"
            />
          ) : (
            <input
              type="text"
              placeholder="6-character invite code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-mono tracking-widest uppercase outline-none focus:ring-2 focus:ring-green-500"
            />
          )}
        </div>

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

        <button
          onClick={tab === "create" ? handleCreate : handleJoin}
          disabled={loading}
          className="mt-4 w-full rounded-xl bg-green-600 py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
        >
          {loading ? "Loading…" : tab === "create" ? "Create" : "Join"}
        </button>
      </div>
    </div>
  );
}
