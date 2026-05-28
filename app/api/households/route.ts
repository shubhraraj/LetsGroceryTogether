// app/api/households/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateInviteCode } from "@/lib/api-helpers";

export async function POST(req: NextRequest) {
  let body: { name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  const name = body?.name?.trim();
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });

  let inviteCode = "";
  let found = false;
  for (let i = 0; i < 10; i++) {
    inviteCode = generateInviteCode();
    const existing = await prisma.household.findUnique({ where: { inviteCode } });
    if (!existing) { found = true; break; }
  }
  if (!found) {
    return NextResponse.json({ error: "could not generate unique code" }, { status: 500 });
  }

  const household = await prisma.household.create({
    data: { name, inviteCode },
  });

  return NextResponse.json({
    id: household.id,
    inviteCode: household.inviteCode,
    name: household.name,
  });
}
