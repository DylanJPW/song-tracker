import {render, screen} from "@testing-library/react";
import {vi} from "vitest";
import {SongList} from "./SongList";
import type {Song} from "@/api/schemas/SongSchema";

vi.mock("@/components/SongItem", () => ({
  SongItem: (song: Song) => (
    <tr data-testid="song-row">
      <td><p>{song.title} - {song.album}</p></td>
      <td>{song.artist}</td>
    </tr>
  ),
}));

describe("SongList", () => {
  it("renders table headers", () => {
    render(<SongList songs={[]}/>);

    expect(screen.getByText("Album Cover")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Artist")).toBeInTheDocument();
  });

  it("renders songs from API data", () => {
    render(
      <SongList
        songs={[
          {
            id: 0,
            title: "Song A",
            artist: "Artist A",
            album: "Album A",
            imageUrl: "https://test.image",
            spotifyId: null
          },
          {
            id: 1,
            title: "Song B",
            artist: "Artist B",
            album: "Album B",
            imageUrl: "https://test.image",
            spotifyId: null
          },
        ]}
      />,
    );

    expect(screen.getByText("Song A - Album A")).toBeInTheDocument();
    expect(screen.getByText("Artist A")).toBeInTheDocument();
    expect(screen.getByText("Song B - Album B")).toBeInTheDocument();
    expect(screen.getByText("Artist B")).toBeInTheDocument();
  });
});