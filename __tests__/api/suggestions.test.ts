// __tests__/api/suggestions.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/suggestions/route";
import { POST } from "@/app/api/suggestions/[id]/add/route";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    suggestion: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    item: {
      create: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";

const HH = "hh-uuid-1";
function withHH(url: string, init?: RequestInit) {
  return new NextRequest(url, {
    ...init,
    headers: { "x-household-id": HH, "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
}

beforeEach(() => vi.clearAllMocks());

describe("GET /api/suggestions", () => {
  it("returns due suggestions", async () => {
    vi.mocked(prisma.suggestion.findMany).mockResolvedValue([
      {
        id: "sg1", householdId: HH, itemName: "Eggs", category: "Dairy",
        frequency: "weekly", nextSuggestAt: new Date("2026-05-01"),
        lastPurchasedAt: null, purchaseCount: 1, avgDaysBetweenPurchases: null,
        createdAt: new Date(),
        suggestionStores: [],
      },
    ]);
    const res = await GET(withHH("http://localhost/api/suggestions"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body[0].itemName).toBe("Eggs");
  });
});

describe("POST /api/suggestions/[id]/add", () => {
  it("returns 404 when suggestion not found", async () => {
    vi.mocked(prisma.suggestion.findFirst).mockResolvedValue(null);
    const req = withHH("http://localhost/api/suggestions/bad/add", {
      method: "POST",
      body: JSON.stringify({ addedByName: "Alex" }),
    });
    const res = await POST(req, { params: Promise.resolve({ id: "bad" }) });
    expect(res.status).toBe(404);
  });

  it("creates item from suggestion", async () => {
    vi.mocked(prisma.suggestion.findFirst).mockResolvedValue({
      id: "sg1", householdId: HH, itemName: "Eggs", category: "Dairy",
      frequency: "weekly", nextSuggestAt: new Date(), lastPurchasedAt: null,
      purchaseCount: 2, avgDaysBetweenPurchases: 7, createdAt: new Date(),
      suggestionStores: [{ storeId: "s1" }],
    });
    vi.mocked(prisma.item.create).mockResolvedValue({
      id: "i-new", householdId: HH, name: "Eggs", category: "Dairy",
      status: "active", addedByName: "Alex", pickedUpByName: null,
      pickedUpAt: null, createdAt: new Date(),
      itemStores: [{ storeId: "s1" }],
    });
    vi.mocked(prisma.suggestion.update).mockResolvedValue({} as never);
    const req = withHH("http://localhost/api/suggestions/sg1/add", {
      method: "POST",
      body: JSON.stringify({ addedByName: "Alex" }),
    });
    const res = await POST(req, { params: Promise.resolve({ id: "sg1" }) });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.name).toBe("Eggs");
  });
});
