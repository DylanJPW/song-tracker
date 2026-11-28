import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { toast } from "react-toastify";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SESSION_EXPIRED_EVENT } from "@/api/client";
import { AuthProvider, useAuth } from "@/context/AuthContext";

vi.mock("react-toastify", () => ({
  toast: { info: vi.fn() },
}));

function wrapper({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}

describe("AuthProvider session expiry", () => {
  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("logs the user out and tells them why when the session expires", () => {
    localStorage.setItem("jwt", "expired-token");
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isLoggedIn).toBe(true);

    act(() => {
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    });

    expect(result.current.isLoggedIn).toBe(false);
    expect(localStorage.getItem("jwt")).toBeNull();
    expect(toast.info).toHaveBeenCalledWith(
      "Your session has expired. Please log in again.",
      { toastId: "session-expired" },
    );
  });

  it("stops listening once the provider unmounts", () => {
    localStorage.setItem("jwt", "token-123");
    const { unmount } = renderHook(() => useAuth(), { wrapper });

    unmount();
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));

    expect(toast.info).not.toHaveBeenCalled();
    expect(localStorage.getItem("jwt")).toBe("token-123");
  });
});
