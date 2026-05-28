// __tests__/api/households.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/households/route";
import { GET } from "@/app/api/households/[code]/route";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    household: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";

beforeEach(() => vi.clearAllMocks());

describe("POST /api/households", () => {
  it("returns 400 when name is missing", async () => {
    const req = new NextRequest("http://localhost/api/households", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("creates a household and returns id + inviteCode", async () => {
    vi.mocked(prisma.household.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.household.create).mockResolvedValue({
      id: "hh-1",
      name: "Our Place",
      inviteCode: "ABC123",
      createdAt: new Date(),
    });
    const req = new NextRequest("http://localhost/api/households", {
      method: "POST",
      body: JSON.stringify({ name: "Our Place" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe("hh-1");
    expect(body.inviteCode).toBe("ABC123");
  });
});

describe("GET /api/households/[code]", () => {
  it("returns 404 when code not found", async () => {
    vi.mocked(prisma.household.findUnique).mockResolvedValue(null);
    const req = new NextRequest("http://localhost/api/households/XXXXXX");
    const res = await GET(req, { params: Promise.resolve({ code: "XXXXXX" }) });
    expect(res.status).toBe(404);
  });

  it("returns household when found", async () => {
    vi.mocked(prisma.household.findUnique).mockResolvedValue({
      id: "hh-1",
      name: "Our Place",
      inviteCode: "ABC123",
      createdAt: new Date(),
    });
    const req = new NextRequest("http://localhost/api/households/ABC123");
    const res = await GET(req, { params: Promise.resolve({ code: "ABC123" }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.name).toBe("Our Place");
  });
});
