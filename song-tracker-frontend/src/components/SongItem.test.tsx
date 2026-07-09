import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SongItem } from "./SongItem";

describe("SongItem", () => {
  it("renders song information", () => {
    render(
      <table>
        <tbody>
          <SongItem
            album="Song Album"
            artist="Artist"
            imageUrl="https//test.image"
            title="Song Name"
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
