import { toast } from "react-toastify";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "@/App";
import { queryClient, render, screen } from "@/test-utils";

vi.mock("react-toastify", () => ({
  toast: { info: vi.fn() },
  ToastContainer: () => null,
}));

describe("App with an expired session", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    queryClient.clear();
  });

  // Regression test: the dashboard suspends on first load. When the Suspense
  // boundary wrapped AuthProvider, its session-expired listener was never
  // attached, so the 401 ended in a full-screen "Failed to fetch current user".
  it("falls back to the landing page instead of an error screen", async () => {
    localStorage.setItem("jwt", "expired-token");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 401 }),
    );

    render(<App />, { route: "/" });

    expect(
      await screen.findByRole("heading", { level: 1, name: "SongTracker" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Failed to fetch current user"),
    ).not.toBeInTheDocument();
    expect(localStorage.getItem("jwt")).toBeNull();
    expect(toast.info).toHaveBeenCalledWith(
      "Your session has expired. Please log in again.",
      { toastId: "session-expired" },
    );
  });
});
