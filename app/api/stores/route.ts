// app/api/stores/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getHouseholdIdHeader, missingHouseholdResponse } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  const householdId = getHouseholdIdHeader(req);
  if (!householdId) return missingHouseholdResponse();

  const stores = await prisma.store.findMany({
    where: { householdId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(stores);
}

export async function POST(req: NextRequest) {
  const householdId = getHouseholdIdHeader(req);
  if (!householdId) return missingHouseholdResponse();

  const body = await req.json();
  const name = body?.name?.trim();
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });

  const store = await prisma.store.create({
    data: { householdId, name, emoji: body.emoji ?? "🛒" },
  });
  return NextResponse.json(store, { status: 201 });
}
