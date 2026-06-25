import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Song } from "./Song";

describe("Song", () => {
  it("renders song information", () => {
    render(
      <table>
        <tbody>
          <Song
            dateAdded={new Date("2026-06-22")}
            links={["spotify.com", "youtube.com"]}
            name="Song Name"
            notes="Difficult"
            singer="Artist"
          />
        </tbody>
      </table>,
    );

    expect(screen.getByText("Song Name")).toBeTruthy();
    expect(screen.getByText("Artist")).toBeTruthy();
    expect(screen.getByText("spotify.com")).toBeTruthy();
    expect(screen.getByText("youtube.com")).toBeTruthy();
    expect(screen.getByText("22 Jun 2026")).toBeTruthy();
    expect(screen.getByText("Difficult")).toBeTruthy();
  });
});
