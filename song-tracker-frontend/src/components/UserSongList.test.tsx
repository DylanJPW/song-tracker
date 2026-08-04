import {render, screen} from "@testing-library/react";
import {vi} from "vitest";
import {UserSongList} from "./UserSongList";

vi.mock("./UserSongItem", () => ({
  UserSongItem: ({
                   song,
                   capo,
                   difficultyRating,
                   status,
                 }: {
    song: {
      title: string;
      artist: string;
      album: string;
    };
    capo: number | null;
    difficultyRating: number | null;
    status: string;
  }) => (
    <tr data-testid="user-song-row">
      <td>{`${song.title} - ${song.album}`}</td>
      <td>{song.artist}</td>
      <td>{capo}</td>
      <td>{difficultyRating}</td>
      <td>{status}</td>
    </tr>
  ),
}));

describe("UserSongList", () => {
  it("renders table headers", () => {
    render(<UserSongList songs={[]}/>);

    expect(screen.getByText("Album Cover")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Artist")).toBeInTheDocument();
    expect(screen.getByText("Capo")).toBeInTheDocument();
    expect(screen.getByText("Difficulty")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders user songs from API data", () => {
    render(
      <UserSongList
        songs={[
          {
            song: {
              title: "Song A",
              artist: "Artist A",
              album: "Album A",
              imageUrl: "https://test.image",
            },
            capo: 2,
            difficultyRating: 3,
            status: "Learning",
          },
          {
            song: {
              title: "Song B",
              artist: "Artist B",
              album: "Album B",
              imageUrl: "https://test.image",
            },
            capo: null,
            difficultyRating: null,
            status: "WantToLearn",
          },
        ]}
      />,
    );

    expect(screen.getByText("Song A - Album A")).toBeInTheDocument();
    expect(screen.getByText("Artist A")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Learning")).toBeInTheDocument();

    expect(screen.getByText("Song B - Album B")).toBeInTheDocument();
    expect(screen.getByText("Artist B")).toBeInTheDocument();
    expect(screen.getByText("WantToLearn")).toBeInTheDocument();

    expect(screen.getAllByTestId("user-song-row")).toHaveLength(2);
  });
});