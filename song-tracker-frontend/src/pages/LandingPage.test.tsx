import {render, screen} from "@testing-library/react";
import {describe, expect, it, vi} from "vitest";
import {LandingPage} from "./LandingPage";

vi.mock("@/components/forms/AuthPanel", () => ({
  AuthPanel: () => <p>Auth panel</p>,
}));

describe("LandingPage", () => {
  it("explains what the app does", () => {
    render(<LandingPage/>);

    expect(
      screen.getByRole("heading", {name: "SongTracker"}),
    ).toBeInTheDocument();
    expect(screen.getByText("Track your progress")).toBeInTheDocument();
    expect(screen.getByText("Capture the details")).toBeInTheDocument();
    expect(screen.getByText("Set goals")).toBeInTheDocument();
  });

  it("renders the auth panel", () => {
    render(<LandingPage/>);

    expect(screen.getByText("Auth panel")).toBeInTheDocument();
  });

  it("sets the page title", () => {
    render(<LandingPage/>);

    expect(document.title).toBe(
      "SongTracker — Track the songs you're learning on guitar",
    );
  });
});
