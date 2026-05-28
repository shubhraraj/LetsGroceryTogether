// app/api/items/[id]/pickup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getHouseholdIdHeader, missingHouseholdResponse } from "@/lib/api-helpers";
import { getFrequencyForCategory } from "@/lib/category-detector";
import {
  computeNextSuggestAt,
  computeNewAvgDays,
  bucketFrequency,
  shouldUpdateFrequency,
} from "@/lib/suggestion-engine";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const householdId = getHouseholdIdHeader(req);
  if (!householdId) return missingHouseholdResponse();

  const { id } = await params;
  const body = await req.json();
  const now = new Date();

  const item = await prisma.item.findFirst({
    where: { id, householdId },
    include: { itemStores: { select: { storeId: true } } },
  });
  if (!item) return NextResponse.json({ error: "not found" }, { status: 404 });

  await prisma.item.update({
    where: { id },
    data: {
      status: "picked_up",
      pickedUpByName: body.pickedUpByName ?? "Someone",
      pickedUpAt: now,
    },
  });

  const existing = await prisma.suggestion.findUnique({
    where: { householdId_itemName: { householdId, itemName: item.name } },
  });

  if (existing) {
    const newCount = existing.purchaseCount + 1;
    const lastDate = existing.lastPurchasedAt ?? existing.createdAt;
    const newAvg = computeNewAvgDays(existing.avgDaysBetweenPurchases, newCount, lastDate, now);
    const newFrequency = shouldUpdateFrequency(existing.frequency, newAvg, newCount)
      ? bucketFrequency(newAvg)
      : existing.frequency;
    const nextSuggestAt = computeNextSuggestAt(now, newAvg);

    await prisma.suggestion.update({
      where: { id: existing.id },
      data: {
        purchaseCount: newCount,
        avgDaysBetweenPurchases: newAvg,
        frequency: newFrequency,
        nextSuggestAt,
        lastPurchasedAt: now,
      },
    });
  } else {
    const { frequency, days } = getFrequencyForCategory(item.category);
    const nextSuggestAt = computeNextSuggestAt(now, days);
    const storeIds = item.itemStores.map((is) => is.storeId);

    await prisma.suggestion.create({
      data: {
        householdId,
        itemName: item.name,
        category: item.category,
        frequency,
        nextSuggestAt,
        lastPurchasedAt: now,
        purchaseCount: 1,
        suggestionStores: storeIds.length
          ? { create: storeIds.map((storeId) => ({ storeId })) }
          : undefined,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
