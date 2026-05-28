// app/api/households/[code]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const household = await prisma.household.findUnique({
    where: { inviteCode: code.toUpperCase() },
  });
  if (!household) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({
    id: household.id,
    inviteCode: household.inviteCode,
    name: household.name,
  });
}
