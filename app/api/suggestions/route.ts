// app/api/suggestions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getHouseholdIdHeader, missingHouseholdResponse } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  const householdId = getHouseholdIdHeader(req);
  if (!householdId) return missingHouseholdResponse();

  const suggestions = await prisma.suggestion.findMany({
    where: { householdId, nextSuggestAt: { lte: new Date() } },
    include: { suggestionStores: { select: { storeId: true } } },
    orderBy: { nextSuggestAt: "asc" },
  });
  return NextResponse.json(suggestions);
}
