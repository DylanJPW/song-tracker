import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SpotifySong } from "@/api/schemas/SongSchema";
import { getSearchResults } from "@/api/songs";
import { buildSpotifySong } from "@/test-fixtures";
import { SearchResultsPage } from "./SearchResultsPage";

vi.mock("@/api/songs", () => ({ getSearchResults: vi.fn() }));

vi.mock("@/components/SearchBar", () => ({
  SearchBar: ({ defaultValue }: { defaultValue: string }) => (
    <input defaultValue={defaultValue} placeholder="search bar stub" />
  ),
}));

vi.mock("@/components/songDisplay/SongList", () => ({
  SongList: ({ songs }: { songs: SpotifySong[] }) => (
    <ul>
      {songs.map((song) => (
        <li key={song.title}>{song.title}</li>
      ))}
    </ul>
  ),
}));

vi.mock("@/components/songDisplay/SearchStates", () => ({
  EmptyState: ({
    action,
    body,
    title,
  }: {
    action?: ReactNode;
    body: string;
    title: string;
  }) => (
    <div>
      <p>{title}</p>
      <p>{body}</p>
      {action}
    </div>
  ),
  SongListSkeleton: () => <p>Loading results</p>,
}));

function renderSearchPage(route = "/search") {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return {
    user: userEvent.setup(),
    ...render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}>
          <SearchResultsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    ),
  };
}

describe("SearchResultsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("prompts for a search and queries nothing when there is no query", () => {
    renderSearchPage("/search");

    expect(screen.getByText("Find a song to learn")).toBeInTheDocument();
    expect(getSearchResults).not.toHaveBeenCalled();
  });

  it("shows a skeleton while the search is in flight", () => {
    vi.mocked(getSearchResults).mockReturnValue(new Promise(() => undefined));

    renderSearchPage("/search?q=noah");

    expect(screen.getByText("Loading results")).toBeInTheDocument();
  });

  it("shows the results and a count", async () => {
    vi.mocked(getSearchResults).mockResolvedValue([
      buildSpotifySong({ spotifyId: "a", title: "Stick Season" }),
      buildSpotifySong({ spotifyId: "b", title: "Homesick" }),
    ]);

    renderSearchPage("/search?q=noah");

    expect(await screen.findByText("Stick Season")).toBeInTheDocument();
    expect(screen.getByText("Homesick")).toBeInTheDocument();
    expect(
      screen.getByText(/2 results for "noah"/u, { selector: "p" }),
    ).toBeInTheDocument();
  });

  it("says result, singular, for a single match", async () => {
    vi.mocked(getSearchResults).mockResolvedValue([buildSpotifySong()]);

    renderSearchPage("/search?q=noah");

    expect(
      await screen.findByText(/1 result for "noah"/u, { selector: "p" }),
    ).toBeInTheDocument();
  });

  it("distinguishes an empty result set from not having searched", async () => {
    vi.mocked(getSearchResults).mockResolvedValue([]);

    renderSearchPage("/search?q=asdfgh");

    expect(
      await screen.findByText('No songs found for "asdfgh"'),
    ).toBeInTheDocument();
    expect(screen.queryByText("Find a song to learn")).not.toBeInTheDocument();
  });

  it("offers a retry that re-runs the search after a failure", async () => {
    vi.mocked(getSearchResults).mockRejectedValue(new Error("Failed to fetch"));

    const { user } = renderSearchPage("/search?q=noah");

    expect(
      await screen.findByText("That search didn't work"),
    ).toBeInTheDocument();

    vi.mocked(getSearchResults).mockResolvedValue([
      buildSpotifySong({ title: "Stick Season" }),
    ]);

    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByText("Stick Season")).toBeInTheDocument();
  });

  it("seeds the search bar from the query in the URL", () => {
    renderSearchPage("/search?q=noah");

    expect(screen.getByPlaceholderText("search bar stub")).toHaveValue("noah");
  });

  it("announces the outcome of the search in a live region", async () => {
    vi.mocked(getSearchResults).mockResolvedValue([buildSpotifySong()]);

    renderSearchPage("/search?q=noah");

    await waitFor(() => {
      expect(screen.getByText(/1 result for noah/u)).toHaveAttribute(
        "aria-live",
        "polite",
      );
    });
  });

  it("sets the document title from the query", async () => {
    vi.mocked(getSearchResults).mockResolvedValue([]);

    renderSearchPage("/search?q=noah");

    await waitFor(() => {
      expect(document.title).toBe("noah - SongTracker");
    });
  });
});
