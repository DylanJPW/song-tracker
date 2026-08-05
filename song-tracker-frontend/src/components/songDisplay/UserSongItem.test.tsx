import {render, screen} from "@testing-library/react";
import {describe, expect, it} from "vitest";
import {UserSongItem} from "./UserSongItem";

describe("UserSongItem", () => {
  it("renders user song information", () => {
    render(
      <table>
        <tbody>
        <UserSongItem
          song={{
            title: "Song Name",
            artist: "Artist",
            album: "Song Album",
            imageUrl: "https://test.image",
          }}
          capo={2}
          difficultyRating={4}
          status="Learning"
        />
        </tbody>
      </table>,
    );

    expect(screen.getByText("Song Name - Song Album")).toBeTruthy();
    expect(screen.getByText("Artist")).toBeTruthy();
    expect(screen.getByText("2")).toBeTruthy();
    expect(screen.getByText("4")).toBeTruthy();
    expect(screen.getByText("Learning")).toBeTruthy();

    const image = screen.getByRole("img", {name: "Song Name"});
    expect(image).toHaveAttribute("src", "https://test.image");
    expect(image).toHaveAttribute("alt", "Song Name");
  });
});