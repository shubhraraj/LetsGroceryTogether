// app/api/suggestions/[id]/add/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getHouseholdIdHeader, missingHouseholdResponse } from "@/lib/api-helpers";
import { getFrequencyForCategory } from "@/lib/category-detector";
import { computeNextSuggestAt } from "@/lib/suggestion-engine";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const householdId = getHouseholdIdHeader(req);
  if (!householdId) return missingHouseholdResponse();

  const { id } = await params;
  const body = await req.json();

  const suggestion = await prisma.suggestion.findFirst({
    where: { id, householdId },
    include: { suggestionStores: { select: { storeId: true } } },
  });
  if (!suggestion) return NextResponse.json({ error: "not found" }, { status: 404 });

  const storeIds = suggestion.suggestionStores.map((ss) => ss.storeId);

  const item = await prisma.item.create({
    data: {
      householdId,
      name: suggestion.itemName,
      category: suggestion.category,
      addedByName: body.addedByName ?? "Someone",
      itemStores: storeIds.length
        ? { create: storeIds.map((storeId) => ({ storeId })) }
        : undefined,
    },
    include: { itemStores: { select: { storeId: true } } },
  });

  // Advance nextSuggestAt so the suggestion doesn't immediately reappear
  const days = suggestion.avgDaysBetweenPurchases
    ?? getFrequencyForCategory(suggestion.category).days;
  await prisma.suggestion.update({
    where: { id: suggestion.id },
    data: { nextSuggestAt: computeNextSuggestAt(new Date(), days) },
  });

  return NextResponse.json(item, { status: 201 });
}
