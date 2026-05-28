// app/api/stores/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getHouseholdIdHeader, missingHouseholdResponse } from "@/lib/api-helpers";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const householdId = getHouseholdIdHeader(req);
  if (!householdId) return missingHouseholdResponse();

  const { id } = await params;
  const body = await req.json();

  const result = await prisma.store.updateMany({
    where: { id, householdId },
    data: {
      ...(body.name ? { name: body.name.trim() } : {}),
      ...(body.emoji ? { emoji: body.emoji } : {}),
    },
  });
  if (result.count === 0) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const householdId = getHouseholdIdHeader(req);
  if (!householdId) return missingHouseholdResponse();

  const { id } = await params;
  await prisma.store.deleteMany({ where: { id, householdId } });
  return NextResponse.json({ ok: true });
}
