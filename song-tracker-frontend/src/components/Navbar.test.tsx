import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "./Navbar";

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

describe("Navbar", () => {
  const renderNavbar = (initialEntry = "/") =>
    render(
      <MemoryRouter initialEntries={[initialEntry]}>
        <Navbar />
      </MemoryRouter>,
    );

  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      authToken: null,
      isLoggedIn: false,
      login: vi.fn(),
      logout: vi.fn(),
    });
  });

  it("renders the app name and navigation links", () => {
    renderNavbar();

    expect(screen.getByText("SongTracker")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "HOME" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "SEARCH" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "LOG IN" })).toBeInTheDocument();
  });

  it("marks the current page as active", () => {
    renderNavbar("/search");

    const searchLink = screen.getByRole("link", { name: "SEARCH" });

    expect(searchLink).toHaveAttribute("href", "/search");
    expect(searchLink).toHaveClass("text-amber-600");
  });

  it("renders the log out button when the user is logged in", () => {
    vi.mocked(useAuth).mockReturnValue({
      authToken: "token",
      isLoggedIn: true,
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderNavbar();

    expect(screen.getByRole("button", { name: "LOG OUT" })).toBeInTheDocument();
  });

  it("calls logout when the log out button is clicked", () => {
    const logout = vi.fn();

    vi.mocked(useAuth).mockReturnValue({
      authToken: "token",
      isLoggedIn: true,
      login: vi.fn(),
      logout,
    });

    renderNavbar();

    fireEvent.click(screen.getByRole("button", { name: "LOG OUT" }));

    expect(logout).toHaveBeenCalledTimes(1);
  });

  it("opens and closes the mobile menu", () => {
    renderNavbar();

    const button = screen.getByRole("button", {
      name: /open navigation menu/iu,
    });

    const menu = screen.getByRole("button").parentElement?.nextElementSibling;

    expect(menu).toHaveClass("hidden");

    fireEvent.click(button);
    expect(menu).toHaveClass("flex");

    fireEvent.click(button);
    expect(menu).toHaveClass("hidden");
  });
});
