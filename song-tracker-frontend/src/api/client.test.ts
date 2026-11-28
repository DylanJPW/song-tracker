import { afterEach, describe, expect, it, vi } from "vitest";
import { apiClient, SESSION_EXPIRED_EVENT } from "@/api/client";

function mockFetch(status = 200) {
  return vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValue(new Response("{}", { status }));
}

describe("apiClient", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("sends the stored token as a Bearer header", async () => {
    localStorage.setItem("jwt", "token-123");
    const fetchSpy = mockFetch();

    await apiClient("/user-songs");

    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/user-songs",
      expect.objectContaining({
        headers: expect.objectContaining({
          // biome-ignore lint/style/useNamingConvention: Authorization is capitalised
          Authorization: "Bearer token-123",
        }),
      }),
    );
  });

  it("sends no Authorization header when logged out, instead of 'Bearer null'", async () => {
    const fetchSpy = mockFetch();

    await apiClient("/spotify/search?query=maine");

    const [, options] = fetchSpy.mock.calls[0];
    expect(options?.headers).not.toHaveProperty("Authorization");
  });

  it("announces an expired session when a request with a token gets a 401", async () => {
    localStorage.setItem("jwt", "expired-token");
    mockFetch(401);
    const listener = vi.fn();
    window.addEventListener(SESSION_EXPIRED_EVENT, listener);

    await apiClient("/user-songs/dashboard");

    window.removeEventListener(SESSION_EXPIRED_EVENT, listener);
    expect(listener).toHaveBeenCalledOnce();
  });

  it("does not announce an expired session for a 401 without a token, like a wrong password", async () => {
    mockFetch(401);
    const listener = vi.fn();
    window.addEventListener(SESSION_EXPIRED_EVENT, listener);

    await apiClient("/users/login", { method: "POST" });

    window.removeEventListener(SESSION_EXPIRED_EVENT, listener);
    expect(listener).not.toHaveBeenCalled();
  });

  it("still returns the 401 response so the caller can handle it", async () => {
    localStorage.setItem("jwt", "expired-token");
    mockFetch(401);

    const response = await apiClient("/user-songs");

    expect(response.status).toBe(401);
  });
});
