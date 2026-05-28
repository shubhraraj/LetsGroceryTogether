// app/api/items/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getHouseholdIdHeader, missingHouseholdResponse } from "@/lib/api-helpers";
import { detectCategory } from "@/lib/category-detector";

export async function GET(req: NextRequest) {
  const householdId = getHouseholdIdHeader(req);
  if (!householdId) return missingHouseholdResponse();

  const items = await prisma.item.findMany({
    where: { householdId },
    include: { itemStores: { select: { storeId: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const householdId = getHouseholdIdHeader(req);
  if (!householdId) return missingHouseholdResponse();

  const body = await req.json();
  const name = body?.name?.trim();
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });

  const storeIds: string[] = body.storeIds ?? [];
  const category = detectCategory(name);

  const item = await prisma.item.create({
    data: {
      householdId,
      name,
      category,
      addedByName: body.addedByName ?? "Someone",
      itemStores: storeIds.length
        ? { create: storeIds.map((storeId: string) => ({ storeId })) }
        : undefined,
    },
    include: { itemStores: { select: { storeId: true } } },
  });
  return NextResponse.json(item, { status: 201 });
}
