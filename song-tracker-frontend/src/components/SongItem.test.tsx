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

    expect(screen.getByText("Song Name - Song Album")).toBeTruthy();
    expect(screen.getByText("Artist")).toBeTruthy();
  });
});
