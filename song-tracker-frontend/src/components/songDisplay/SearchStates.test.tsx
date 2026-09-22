import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState, SongListSkeleton } from "./SearchStates";

describe("SongListSkeleton", () => {
  it("renders a row per placeholder", () => {
    const { container } = render(<SongListSkeleton />);

    expect(container.querySelectorAll("li")).toHaveLength(5);
  });

  it("is hidden from assistive technology", () => {
    const { container } = render(<SongListSkeleton />);

    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});

describe("EmptyState", () => {
  it("renders the title and the body", () => {
    render(<EmptyState body="Body text" icon={null} title="Title text" />);

    expect(screen.getByText("Title text")).toBeInTheDocument();
    expect(screen.getByText("Body text")).toBeInTheDocument();
  });

  it("renders an action when given one", () => {
    render(
      <EmptyState
        action={<button type="button">Try again</button>}
        body="Body text"
        icon={null}
        title="Title text"
      />,
    );

    expect(
      screen.getByRole("button", { name: "Try again" }),
    ).toBeInTheDocument();
  });

  it("renders no action by default", () => {
    render(<EmptyState body="Body text" icon={null} title="Title text" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("hides the decorative icon from assistive technology", () => {
    const { container } = render(
      <EmptyState
        body="Body text"
        icon={<svg aria-label="decorative" />}
        title="Title text"
      />,
    );

    expect(container.querySelector("span")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
