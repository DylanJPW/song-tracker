import { fireEvent, render, screen } from "@testing-library/react";
import { Navbar } from "./Navbar";

describe("Navbar", () => {
  const renderNavbar = () => render(<Navbar />);

  beforeEach(() => {
    window.history.pushState({}, "", "/");
  });

  it("renders the app name and navigation links", () => {
    renderNavbar();

    expect(screen.getByText("SongTracker")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "HOME" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "SEARCH" })).toBeInTheDocument();
  });

  it("renders links with the correct href", () => {
    renderNavbar();

    expect(screen.getByRole("link", { name: "HOME" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "SEARCH" })).toHaveAttribute(
      "href",
      "/search",
    );
  });

  it("marks the current page as active", () => {
    window.history.pushState({}, "", "/search");

    renderNavbar();

    const searchLink = screen.getByRole("link", { name: "SEARCH" });

    expect(searchLink.parentElement).toHaveClass("text-amber-600");
  });

  it("opens and closes the mobile menu", () => {
    renderNavbar();

    const button = screen.getByRole("button", {
      name: /open navigation menu/i,
    });

    const menu = screen.getByRole("button").parentElement?.nextElementSibling;

    expect(menu).toHaveClass("hidden");

    fireEvent.click(button);
    expect(menu).toHaveClass("flex");

    fireEvent.click(button);
    expect(menu).toHaveClass("hidden");
  });
});
