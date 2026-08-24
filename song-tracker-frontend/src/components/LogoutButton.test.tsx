import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LogoutButton } from "./LogoutButton";

describe("LogoutButton", () => {
  it("renders a logout button", () => {
    const logout = vi.fn();

    render(<LogoutButton logout={logout} />);

    expect(
      screen.getByRole("button", { name: /log out/iu }),
    ).toBeInTheDocument();
  });

  it("calls logout when clicked", () => {
    const logout = vi.fn();

    render(<LogoutButton logout={logout} />);

    fireEvent.click(screen.getByRole("button", { name: /log out/iu }));

    expect(logout).toHaveBeenCalledTimes(1);
  });
});
