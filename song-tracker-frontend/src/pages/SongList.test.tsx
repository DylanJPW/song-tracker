import { render, screen } from "@testing-library/react";
import { SongList } from "./SongList";
import { vi } from "vitest";

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

import { useSuspenseQuery } from "@tanstack/react-query";

describe("SongList", () => {
  it("renders page title via Head", () => {
    (useSuspenseQuery as any).mockReturnValue({
      data: [],
    });

    render(<SongList />);

    expect(screen.getByTestId("head")).toHaveTextContent("SongTracker");
  });

  it("renders table headers", () => {
    (useSuspenseQuery as any).mockReturnValue({
      data: [],
    });

    render(<SongList />);

    expect(screen.getByText("Song")).toBeInTheDocument();
    expect(screen.getByText("Artist")).toBeInTheDocument();
    expect(screen.getByText("Date Added")).toBeInTheDocument();
    expect(screen.getByText("Links")).toBeInTheDocument();
    expect(screen.getByText("Notes")).toBeInTheDocument();
  });

  it("renders songs from API data", () => {
    (useSuspenseQuery as any).mockReturnValue({
      data: [
        {
          name: "Song A",
          artist: "Artist A",
          dateAdded: "2024-01-01",
          links: [],
          notes: "Note A",
        },
        {
          name: "Song B",
          artist: "Artist B",
          dateAdded: "2024-01-02",
          links: [],
          notes: "Note B",
        },
      ],
    });

    render(<SongList />);

    const rows = screen.getAllByTestId("song-row");
    expect(rows).toHaveLength(2);
  });

  it("calls useSuspenseQuery with correct config", () => {
    (useSuspenseQuery as any).mockReturnValue({
      data: [],
    });

    render(<SongList />);

    expect(useSuspenseQuery).toHaveBeenCalledWith({
      queryFn: expect.any(Function),
      queryKey: ["songs"],
    });
  });
});
