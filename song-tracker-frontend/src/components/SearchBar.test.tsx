/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: <explanation> */

import { useQuery } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { SearchBar } from "./SearchBar";

vi.mock("@tanstack/react-query");

const mockUseQuery = vi.mocked(useQuery);

describe("SearchBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseQuery.mockReturnValue({
      data: undefined,
      error: null,
      isLoading: false,
    } as ReturnType<typeof useQuery>);
  });

  it("renders the search input", () => {
    render(<SearchBar setSearchResults={() => {}} />);

    expect(
      screen.getByPlaceholderText("Search for songs..."),
    ).toBeInTheDocument();
  });

  it("updates the input value", () => {
    render(<SearchBar setSearchResults={() => {}} />);

    const input = screen.getByPlaceholderText(
      "Search for songs...",
    ) as HTMLInputElement;

    fireEvent.change(input, {
      target: { value: "Noah Kahan" },
    });

    expect(input.value).toBe("Noah Kahan");
  });

  it("shows a loading message", () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      error: null,
      isLoading: true,
    } as ReturnType<typeof useQuery>);

    render(<SearchBar setSearchResults={() => {}} />);

    expect(screen.getByText("Searching...")).toBeInTheDocument();
  });

  it("shows an error message", () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      error: new Error("Something went wrong"),
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    render(<SearchBar setSearchResults={() => {}} />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("calls setSearchResults when query data changes", () => {
    const setSearchResults = vi.fn();

    const songs = [
      {
        id: "1",
        title: "Song",
        artist: "Artist",
      },
    ];

    mockUseQuery.mockReturnValue({
      data: songs,
      error: null,
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    render(<SearchBar setSearchResults={setSearchResults} />);

    expect(setSearchResults).toHaveBeenCalledWith(songs);
  });
});
