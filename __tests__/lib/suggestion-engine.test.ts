// __tests__/lib/suggestion-engine.test.ts
import { describe, it, expect } from "vitest";
import {
  computeNextSuggestAt,
  computeNewAvgDays,
  bucketFrequency,
  shouldUpdateFrequency,
} from "@/lib/suggestion-engine";

describe("computeNextSuggestAt", () => {
  it("adds days to the pickup date", () => {
    const base = new Date("2026-01-01T00:00:00Z");
    const result = computeNextSuggestAt(base, 7);
    expect(result.toISOString()).toBe("2026-01-08T00:00:00.000Z");
  });
  it("rounds fractional days", () => {
    const base = new Date("2026-01-01T00:00:00Z");
    const result = computeNextSuggestAt(base, 6.6);
    expect(result.toISOString()).toBe("2026-01-08T00:00:00.000Z");
  });
});

describe("computeNewAvgDays", () => {
  it("returns interval when no prior avg", () => {
    const last = new Date("2026-01-01T00:00:00Z");
    const now  = new Date("2026-01-08T00:00:00Z");
    expect(computeNewAvgDays(null, 1, last, now)).toBeCloseTo(7);
  });
  it("rolling average with prior avg", () => {
    const last = new Date("2026-01-08T00:00:00Z");
    const now  = new Date("2026-01-22T00:00:00Z"); // 14 days later
    // prior avg 7, count=2, new interval=14 → new avg = (7*1 + 14) / 2 = 10.5
    const result = computeNewAvgDays(7, 2, last, now);
    expect(result).toBeCloseTo(10.5);
  });
});

describe("bucketFrequency", () => {
  it("weekly for ≤10.5 days", () => {
    expect(bucketFrequency(7)).toBe("weekly");
    expect(bucketFrequency(10.5)).toBe("weekly");
  });
  it("biweekly for 10.6–22 days", () => {
    expect(bucketFrequency(14)).toBe("biweekly");
    expect(bucketFrequency(22)).toBe("biweekly");
  });
  it("monthly for >22 days", () => {
    expect(bucketFrequency(30)).toBe("monthly");
  });
});

describe("shouldUpdateFrequency", () => {
  it("returns false when purchaseCount < 3", () => {
    expect(shouldUpdateFrequency("weekly", 14, 2)).toBe(false);
  });
  it("returns false when avg is within 3 days of default", () => {
    expect(shouldUpdateFrequency("weekly", 9, 3)).toBe(false); // |9-7| = 2
  });
  it("returns true when avg differs by more than 3 days", () => {
    expect(shouldUpdateFrequency("weekly", 14, 3)).toBe(true); // |14-7| = 7
  });
});
