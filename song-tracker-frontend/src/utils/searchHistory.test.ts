import { beforeEach, describe, expect, it } from "vitest";
import { add, clear, list } from "./searchHistory";

const STORAGE_KEY = "songtracker.searchHistory.v1";
const MAX_ENTRIES = 8;

type StorageMethod = "getItem" | "setItem" | "removeItem";

function withBrokenStorage<T>(method: StorageMethod, body: () => T): T {
  const original = localStorage[method];

  Object.defineProperty(localStorage, method, {
    configurable: true,
    value: () => {
      throw new Error("SecurityError");
    },
    writable: true,
  });

  try {
    return body();
  } finally {
    Object.defineProperty(localStorage, method, {
      configurable: true,
      value: original,
      writable: true,
    });
  }
}

describe("searchHistory", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("list", () => {
    it("returns nothing when the store is empty", () => {
      expect(list()).toEqual([]);
    });

    it("returns the stored entries", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(["noah kahan"]));

      expect(list()).toEqual(["noah kahan"]);
    });

    it("recovers from a value that is not valid JSON", () => {
      localStorage.setItem(STORAGE_KEY, "{not json");

      expect(list()).toEqual([]);
    });

    it("recovers from a value of the wrong shape", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([1, 2, 3]));

      expect(list()).toEqual([]);
    });

    it("recovers when storage cannot be read at all", () => {
      expect(withBrokenStorage("getItem", list)).toEqual([]);
    });

    it("reads from storage again once it recovers", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(["noah kahan"]));

      withBrokenStorage("getItem", list);

      expect(list()).toEqual(["noah kahan"]);
    });
  });

  describe("add", () => {
    it("puts the newest query first", () => {
      add("noah kahan");
      add("nirvana");

      expect(list()).toEqual(["nirvana", "noah kahan"]);
    });

    it("trims surrounding whitespace", () => {
      expect(add("  nirvana  ")).toEqual(["nirvana"]);
    });

    it("ignores a blank query", () => {
      add("noah kahan");

      expect(add("   ")).toEqual(["noah kahan"]);
      expect(list()).toEqual(["noah kahan"]);
    });

    it("moves a repeated query to the front rather than duplicating it", () => {
      add("noah kahan");
      add("nirvana");
      add("noah kahan");

      expect(list()).toEqual(["noah kahan", "nirvana"]);
    });

    it("matches existing entries case-insensitively, keeping the newest casing", () => {
      add("noah kahan");

      expect(add("Noah Kahan")).toEqual(["Noah Kahan"]);
    });

    it("keeps at most eight entries, dropping the oldest", () => {
      const queries = Array.from(
        { length: MAX_ENTRIES + 1 },
        (_, index) => `query ${index + 1}`,
      );

      for (const query of queries) {
        add(query);
      }

      const entries = list();

      expect(entries).toHaveLength(MAX_ENTRIES);
      expect(entries[0]).toBe("query 9");
      expect(entries).not.toContain("query 1");
    });

    it("does not throw when storage cannot be written", () => {
      withBrokenStorage("setItem", () => {
        expect(() => add("nirvana")).not.toThrow();
      });

      expect(list()).toEqual([]);
    });
  });

  describe("clear", () => {
    it("empties the history", () => {
      add("noah kahan");

      expect(clear()).toEqual([]);
      expect(list()).toEqual([]);
    });

    it("does not throw when storage cannot be cleared", () => {
      add("noah kahan");

      withBrokenStorage("removeItem", () => {
        expect(clear()).toEqual([]);
      });
    });
  });
});
