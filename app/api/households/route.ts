// app/api/households/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateInviteCode } from "@/lib/api-helpers";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = body?.name?.trim();
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });

  let inviteCode: string;
  let attempts = 0;
  do {
    inviteCode = generateInviteCode();
    attempts++;
    const existing = await prisma.household.findUnique({ where: { inviteCode } });
    if (!existing) break;
  } while (attempts < 10);

  const household = await prisma.household.create({
    data: { name, inviteCode: inviteCode! },
  });

  return NextResponse.json({
    id: household.id,
    inviteCode: household.inviteCode,
    name: household.name,
  });
}
