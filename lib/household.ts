// lib/household.ts
// Client-side only — all functions check for window before accessing localStorage.

const HOUSEHOLD_ID_KEY = "roomie_household_id";
const INVITE_CODE_KEY = "roomie_invite_code";
const DISPLAY_NAME_KEY = "roomie_display_name";

export function getHouseholdId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(HOUSEHOLD_ID_KEY);
}

export function getInviteCode(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(INVITE_CODE_KEY);
}

export function getDisplayName(): string {
  if (typeof window === "undefined") return "Someone";
  return localStorage.getItem(DISPLAY_NAME_KEY) ?? "Someone";
}

export function saveHousehold(householdId: string, inviteCode: string): void {
  localStorage.setItem(HOUSEHOLD_ID_KEY, householdId);
  localStorage.setItem(INVITE_CODE_KEY, inviteCode);
}

export function saveDisplayName(name: string): void {
  localStorage.setItem(DISPLAY_NAME_KEY, name);
}

export function clearHousehold(): void {
  localStorage.removeItem(HOUSEHOLD_ID_KEY);
  localStorage.removeItem(INVITE_CODE_KEY);
  localStorage.removeItem(DISPLAY_NAME_KEY);
}
