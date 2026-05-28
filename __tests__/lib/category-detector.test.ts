import { describe, it, expect } from "vitest";
import { detectCategory, getFrequencyForCategory } from "@/lib/category-detector";

describe("detectCategory", () => {
  it("detects produce from avocado", () => {
    expect(detectCategory("avocados")).toBe("Produce");
  });
  it("detects produce from organic petite carrots", () => {
    expect(detectCategory("organic petite carrots for salad")).toBe("Produce");
  });
  it("detects dairy from milk", () => {
    expect(detectCategory("whole milk")).toBe("Dairy");
  });
  it("detects meat from chicken", () => {
    expect(detectCategory("chicken thighs")).toBe("Meat / Seafood");
  });
  it("detects meat from salmon", () => {
    expect(detectCategory("salmon for 2 people")).toBe("Meat / Seafood");
  });
  it("detects alcohol from wine", () => {
    expect(detectCategory("red wine")).toBe("Alcohol");
  });
  it("detects bread", () => {
    expect(detectCategory("wheat bread")).toBe("Bread / Bakery");
  });
  it("detects toiletries from toilet paper", () => {
    expect(detectCategory("toilet paper")).toBe("Toiletries");
  });
  it("falls back to Pantry / Canned for unknown items", () => {
    expect(detectCategory("xyzzy")).toBe("Pantry / Canned");
  });
});

describe("getFrequencyForCategory", () => {
  it("returns weekly for Produce", () => {
    expect(getFrequencyForCategory("Produce")).toEqual({ frequency: "weekly", days: 7 });
  });
  it("returns biweekly for Alcohol", () => {
    expect(getFrequencyForCategory("Alcohol")).toEqual({ frequency: "biweekly", days: 14 });
  });
  it("returns monthly for Toiletries", () => {
    expect(getFrequencyForCategory("Toiletries")).toEqual({ frequency: "monthly", days: 30 });
  });
  it("returns monthly for unknown category", () => {
    expect(getFrequencyForCategory("Unknown")).toEqual({ frequency: "monthly", days: 30 });
  });
});
