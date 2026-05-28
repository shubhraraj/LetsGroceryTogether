// __tests__/api/items.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/items/route";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    item: {
      findMany: vi.fn(),
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    suggestion: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
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

describe("GET /api/items", () => {
  it("returns items with itemStores", async () => {
    vi.mocked(prisma.item.findMany).mockResolvedValue([
      {
        id: "i1", householdId: HH, name: "Avocados", category: "Produce",
        status: "active", addedByName: "Alex", pickedUpByName: null,
        pickedUpAt: null, createdAt: new Date(),
        itemStores: [{ storeId: "s1" }],
      },
    ]);
    const res = await GET(withHH("http://localhost/api/items"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body[0].name).toBe("Avocados");
    expect(body[0].itemStores).toHaveLength(1);
  });
});

describe("POST /api/items", () => {
  it("returns 400 when name is missing", async () => {
    const req = withHH("http://localhost/api/items", {
      method: "POST",
      body: JSON.stringify({ storeIds: [] }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("creates item with store assignments", async () => {
    vi.mocked(prisma.item.create).mockResolvedValue({
      id: "i1", householdId: HH, name: "Eggs", category: "Dairy",
      status: "active", addedByName: "Alex", pickedUpByName: null,
      pickedUpAt: null, createdAt: new Date(),
      itemStores: [{ storeId: "s1" }],
    });
    const req = withHH("http://localhost/api/items", {
      method: "POST",
      body: JSON.stringify({ name: "Eggs", storeIds: ["s1"], addedByName: "Alex" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.name).toBe("Eggs");
  });

  it("creates anywhere item (no storeIds)", async () => {
    vi.mocked(prisma.item.create).mockResolvedValue({
      id: "i2", householdId: HH, name: "Wheat Bread", category: "Bread / Bakery",
      status: "active", addedByName: "Alex", pickedUpByName: null,
      pickedUpAt: null, createdAt: new Date(),
      itemStores: [],
    });
    const req = withHH("http://localhost/api/items", {
      method: "POST",
      body: JSON.stringify({ name: "Wheat Bread", storeIds: [], addedByName: "Alex" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });
});
