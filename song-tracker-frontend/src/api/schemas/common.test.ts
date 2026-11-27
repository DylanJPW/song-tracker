import * as v from "valibot";
import { describe, expect, it } from "vitest";
import { apiDate, MonthlyPractice } from "@/api/schemas/common";

describe("apiDate", () => {
  it("turns an ISO string from the API into a Date", () => {
    const result = v.parse(apiDate, "2026-11-27T12:00:00.000Z");

    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString()).toBe("2026-11-27T12:00:00.000Z");
  });

  it("passes an existing Date through unchanged", () => {
    const date = new Date("2026-11-27T12:00:00.000Z");

    expect(v.parse(apiDate, date)).toBe(date);
  });
});

describe("MonthlyPractice", () => {
  it("turns the backend's year-month into the month's name", () => {
    expect(v.parse(MonthlyPractice, { count: 3, yearMonth: "2026-11" })).toEqual(
      { count: 3, yearMonth: "November" },
    );
  });

  it("reads the month as 1-based, like the backend sends it", () => {
    expect(
      v.parse(MonthlyPractice, { count: 0, yearMonth: "2026-01" }).yearMonth,
    ).toBe("January");
    expect(
      v.parse(MonthlyPractice, { count: 0, yearMonth: "2026-12" }).yearMonth,
    ).toBe("December");
  });

  it.each([
    "2026-1",
    "November",
    "2026/11",
    "",
  ])("rejects %j, which isn't in YYYY-MM form", (yearMonth) => {
    expect(() => v.parse(MonthlyPractice, { count: 0, yearMonth })).toThrow();
  });
});