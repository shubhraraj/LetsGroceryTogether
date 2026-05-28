// lib/api-helpers.ts
import { NextRequest, NextResponse } from "next/server";

export function getHouseholdIdHeader(req: NextRequest): string | null {
  return req.headers.get("x-household-id");
}

export function missingHouseholdResponse() {
  return NextResponse.json({ error: "missing x-household-id header" }, { status: 401 });
}

export function generateInviteCode(): string {
  // Excludes ambiguous characters (0/O, 1/I/L)
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}
