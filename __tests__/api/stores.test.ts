// __tests__/api/stores.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/stores/route";
import { PATCH, DELETE } from "@/app/api/stores/[id]/route";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    store: {
      findMany: vi.fn(),
      create: vi.fn(),
      updateMany: vi.fn(),
      deleteMany: vi.fn(),
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

describe("GET /api/stores", () => {
  it("returns 401 without household header", async () => {
    const req = new NextRequest("http://localhost/api/stores");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("returns stores for household", async () => {
    vi.mocked(prisma.store.findMany).mockResolvedValue([
      { id: "s1", householdId: HH, name: "Safeway", emoji: "🛒", createdAt: new Date() },
    ]);
    const res = await GET(withHH("http://localhost/api/stores"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body[0].name).toBe("Safeway");
  });
});

describe("POST /api/stores", () => {
  it("creates a store", async () => {
    vi.mocked(prisma.store.create).mockResolvedValue({
      id: "s1", householdId: HH, name: "Costco", emoji: "🏪", createdAt: new Date(),
    });
    const req = withHH("http://localhost/api/stores", {
      method: "POST",
      body: JSON.stringify({ name: "Costco", emoji: "🏪" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  it("returns 400 when name is missing", async () => {
    const req = withHH("http://localhost/api/stores", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe("PATCH /api/stores/[id]", () => {
  it("renames a store", async () => {
    vi.mocked(prisma.store.updateMany).mockResolvedValue({ count: 1 });
    const req = withHH("http://localhost/api/stores/s1", {
      method: "PATCH",
      body: JSON.stringify({ name: "Whole Foods" }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: "s1" }) });
    expect(res.status).toBe(200);
  });

  it("returns 404 when store not found in household", async () => {
    vi.mocked(prisma.store.updateMany).mockResolvedValue({ count: 0 });
    const req = withHH("http://localhost/api/stores/bad", {
      method: "PATCH",
      body: JSON.stringify({ name: "X" }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: "bad" }) });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/stores/[id]", () => {
  it("deletes a store", async () => {
    vi.mocked(prisma.store.deleteMany).mockResolvedValue({ count: 1 });
    const req = withHH("http://localhost/api/stores/s1", { method: "DELETE" });
    const res = await DELETE(req, { params: Promise.resolve({ id: "s1" }) });
    expect(res.status).toBe(200);
  });
});
