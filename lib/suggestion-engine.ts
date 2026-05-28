// lib/suggestion-engine.ts
const FREQUENCY_DAYS: Record<string, number> = {
  weekly: 7,
  biweekly: 14,
  monthly: 30,
};

export function computeNextSuggestAt(lastPickedUpAt: Date, avgDays: number): Date {
  const next = new Date(lastPickedUpAt);
  next.setDate(next.getDate() + Math.round(avgDays));
  return next;
}

export function computeNewAvgDays(
  currentAvg: number | null,
  newPurchaseCount: number,
  lastPurchasedAt: Date,
  newPickupAt: Date
): number {
  const interval =
    (newPickupAt.getTime() - lastPurchasedAt.getTime()) / (1000 * 60 * 60 * 24);
  if (currentAvg === null) return interval;
  return (currentAvg * (newPurchaseCount - 1) + interval) / newPurchaseCount;
}

export function bucketFrequency(avgDays: number): string {
  if (avgDays <= 10.5) return "weekly";
  if (avgDays <= 22) return "biweekly";
  return "monthly";
}

export function shouldUpdateFrequency(
  currentFrequency: string,
  avgDays: number,
  purchaseCount: number
): boolean {
  if (purchaseCount < 3) return false;
  const defaultDays = FREQUENCY_DAYS[currentFrequency] ?? 30;
  return Math.abs(avgDays - defaultDays) > 3;
}
