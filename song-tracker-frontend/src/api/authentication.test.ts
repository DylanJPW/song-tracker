import { afterEach, describe, expect, it, vi } from "vitest";
import { currentUser } from "@/api/authentication";

function mockFetch(body: unknown, status = 200) {
  return vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(JSON.stringify(body), {
      headers: { "Content-Type": "application/json" },
      status,
    }),
  );
}

describe("currentUser", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("asks the API who the logged-in user is, using the stored token", async () => {
    localStorage.setItem("jwt", "token-123");
    const fetchSpy = mockFetch({ id: 7, username: "dylan" });

    await currentUser();

    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/users/currentUser",
      expect.objectContaining({
        headers: expect.objectContaining({
          // biome-ignore lint/style/useNamingConvention: Authorization is capitalised
          Authorization: "Bearer token-123",
        }),
      }),
    );
  });

  it("returns the user's id and username", async () => {
    mockFetch({ id: 7, username: "dylan" });

    expect(await currentUser()).toEqual({ id: 7, username: "dylan" });
  });

  it("throws when the user can't be found, so the page shows an error", async () => {
    mockFetch({}, 404);

    await expect(currentUser()).rejects.toThrow("Failed to fetch current user");
  });
});
