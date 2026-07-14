/** biome-ignore-all lint/style/useNamingConvention: <explanation> */

import { useSuspenseQuery } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { SongList } from "./SongList";

vi.mock("@/api/songs", () => ({
  getSongs: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useSuspenseQuery: vi.fn(),
}));

vi.mock("@/components/Head", () => ({
  Head: ({ title }: { title: string }) => <div data-testid="head">{title}</div>,
}));

vi.mock("@/components/Song", () => ({
  Song: ({ name }: { name: string }) => (
    <tr data-testid="song-row">
      <td>{name}</td>
    </tr>
  ),
}));

vi.mock("@/components/SearchBar", () => ({
  SearchBar: () => <input placeholder="Search for songs..." />,
}));

describe("SongList", () => {
  it("renders page title via Head", () => {
    (useSuspenseQuery as any).mockReturnValue({
      data: [],
    });

    render(<SongList songs={[]} />);

    expect(screen.getByTestId("head")).toHaveTextContent("SongTracker");
  });

  it("renders table headers", () => {
    (useSuspenseQuery as any).mockReturnValue({
      data: [],
    });

    render(<SongList songs={[]} />);

    expect(screen.getByText("Album Cover")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Artist")).toBeInTheDocument();
  });

  it("renders songs from API data", () => {
    (useSuspenseQuery as any).mockReturnValue({
      data: [
        {
          id: 0,
          title: "Song A",
          artist: "Artist A",
          album: "Album A",
          imageUrl: "https://test.image",
        },
        {
          id: 1,
          title: "Song B",
          artist: "Artist B",
          album: "Album B",
          imageUrl: "https://test.image",
        },
      ],
    });

    render(<SongList songs={[]} />);

    expect(screen.getByText("Song A - Album A")).toBeInTheDocument();
    expect(screen.getByText("Artist A")).toBeInTheDocument();
    expect(screen.getByText("Song B - Album B")).toBeInTheDocument();
    expect(screen.getByText("Artist B")).toBeInTheDocument();
  });

  it("calls useSuspenseQuery with correct config", () => {
    (useSuspenseQuery as any).mockReturnValue({
      data: [],
    });

    render(<SongList songs={[]} />);

    expect(useSuspenseQuery).toHaveBeenCalledWith({
      queryFn: expect.any(Function),
      queryKey: ["songs"],
      staleTime: Number.POSITIVE_INFINITY,
    });
  });
});
