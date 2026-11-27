import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TileSection } from "./TileSection";

interface RenderOptions {
  count?: number;
  practisedInLast30Days?: number;
  songCount?: number;
}

function renderTiles({
  count = 2,
  practisedInLast30Days = 4,
  songCount = 12,
}: RenderOptions = {}) {
  return render(
    <TileSection
      practisedInLast30Days={practisedInLast30Days}
      practisedThisMonth={{ count, yearMonth: "November" }}
      songCount={songCount}
    />,
  );
}

function getTile(label: string) {
  const tile = screen.getByText(label).parentElement;
  if (tile === null) {
    throw new Error(`No tile found for "${label}"`);
  }
  return tile;
}

describe("TileSection", () => {
  it("shows each stat in its own tile", () => {
    renderTiles();

    expect(within(getTile("In last 30 days")).getByText("4")).toBeInTheDocument();
    expect(within(getTile("In November")).getByText("2")).toBeInTheDocument();
    expect(within(getTile("In library")).getByText("12")).toBeInTheDocument();
  });

  it("names the month the backend counted", () => {
    renderTiles();

    expect(screen.getByText("In November")).toBeInTheDocument();
  });

  it('says "Song" for exactly one and "Songs" otherwise', () => {
    renderTiles({ count: 1, practisedInLast30Days: 0, songCount: 2 });

    expect(within(getTile("In November")).getByText("Song")).toBeInTheDocument();
    expect(
      within(getTile("In last 30 days")).getByText("Songs"),
    ).toBeInTheDocument();
    expect(within(getTile("In library")).getByText("Songs")).toBeInTheDocument();
  });
});