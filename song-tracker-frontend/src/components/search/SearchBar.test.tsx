import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSearchResults } from "@/api/songs";
import { DEBOUNCE_MS } from "@/components/search/consts";
import { buildSpotifySong } from "@/test-fixtures";
import { add, list } from "@/utils/searchHistory";
import { SearchBar } from "./SearchBar";

vi.mock("@/api/songs", () => ({ getSearchResults: vi.fn() }));

vi.mock("@/utils/searchHistory", () => ({
  add: vi.fn(),
  list: vi.fn(),
}));

const PLACEHOLDER = "Song, album, or artist";

interface RenderOptions {
  defaultValue?: string;
  history?: string[];
}

function renderSearchBar({
  defaultValue = "",
  history = [],
}: RenderOptions = {}) {
  vi.mocked(list).mockReturnValue(history);

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const setSearchParams = vi.fn();

  return {
    setSearchParams,
    user: userEvent.setup({ delay: null }),
    ...render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SearchBar
            defaultValue={defaultValue}
            setSearchParams={setSearchParams}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    ),
  };
}

function getInput() {
  return screen.getByPlaceholderText(PLACEHOLDER);
}

function submitSearch() {
  const form = getInput().closest("form");

  if (form === null) {
    throw new Error("The search input is not inside a form");
  }

  fireEvent.submit(form);
}

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

describe("SearchBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getSearchResults).mockResolvedValue([]);
  });

  describe("the input", () => {
    it("seeds the input from the current query", () => {
      renderSearchBar({ defaultValue: "noah kahan" });

      expect(getInput()).toHaveValue("noah kahan");
    });

    it("searches for the submitted value, trimmed", async () => {
      const { setSearchParams, user } = renderSearchBar();

      await user.type(getInput(), "  nirvana  ");
      submitSearch();

      expect(setSearchParams).toHaveBeenCalledWith({ q: "nirvana" });
    });

    it("records the submitted search in the history", async () => {
      const { user } = renderSearchBar();

      await user.type(getInput(), "nirvana");
      submitSearch();

      expect(add).toHaveBeenCalledWith("nirvana");
    });

    it("closes the panel on submit", async () => {
      const { user } = renderSearchBar({ history: ["noah kahan"] });

      await user.click(getInput());

      expect(screen.getByText("History")).toBeInTheDocument();

      submitSearch();

      expect(screen.queryByText("History")).not.toBeInTheDocument();
    });
  });

  describe("history rows", () => {
    it("stays hidden until the input is clicked", async () => {
      const { user } = renderSearchBar({ history: ["noah kahan"] });

      expect(screen.queryByText("noah kahan")).not.toBeInTheDocument();

      await user.click(getInput());

      expect(screen.getByText("noah kahan")).toBeInTheDocument();
    });

    it("searches for the row that was clicked, not what was typed", async () => {
      const { setSearchParams, user } = renderSearchBar({
        history: ["noah kahan"],
      });

      await user.click(getInput());
      await user.type(getInput(), "noah");
      await user.click(screen.getByText("noah kahan"));

      expect(setSearchParams).toHaveBeenCalledWith({ q: "noah kahan" });
      expect(getInput()).toHaveValue("noah kahan");
    });

    it("stays open long enough for a row click to land", async () => {
      const { setSearchParams, user } = renderSearchBar({
        history: ["noah kahan"],
      });

      await user.click(getInput());
      await user.click(screen.getByText("noah kahan"));

      expect(setSearchParams).toHaveBeenCalledTimes(1);
    });

    it("closes the panel once a row is chosen", async () => {
      const { user } = renderSearchBar({ history: ["noah kahan"] });

      await user.click(getInput());
      await user.click(screen.getByText("noah kahan"));

      expect(screen.queryByText("History")).not.toBeInTheDocument();
    });

    it("matches history case-insensitively", async () => {
      const { user } = renderSearchBar({ history: ["Noah Kahan"] });

      await user.click(getInput());
      await user.type(getInput(), "noah");

      expect(screen.getByText("Noah Kahan")).toBeInTheDocument();
    });

    it("closes the panel when focus leaves the search bar", async () => {
      const { user } = renderSearchBar({ history: ["noah kahan"] });

      await user.click(getInput());
      await user.tab();

      expect(screen.queryByText("noah kahan")).not.toBeInTheDocument();
    });
  });

  describe("song suggestions", () => {
    it("shows matching songs once the query settles", async () => {
      vi.mocked(getSearchResults).mockResolvedValue([
        buildSpotifySong({ spotifyId: "spotify-a", title: "Stick Season" }),
        buildSpotifySong({ spotifyId: "spotify-b", title: "Homesick" }),
      ]);

      const { user } = renderSearchBar();

      await user.click(getInput());
      await user.type(getInput(), "noah");

      expect(await screen.findByText("Stick Season")).toBeInTheDocument();
      expect(screen.getByText("Homesick")).toBeInTheDocument();
    });

    it("links each song to its details page", async () => {
      vi.mocked(getSearchResults).mockResolvedValue([
        buildSpotifySong({ spotifyId: "spotify-a", title: "Stick Season" }),
      ]);

      const { user } = renderSearchBar();

      await user.click(getInput());
      await user.type(getInput(), "noah");

      expect(
        await screen.findByRole("link", { name: "Stick Season" }),
      ).toHaveAttribute("href", "/songs/spotify-a");
    });

    it("searches once for a burst of typing, with the settled value", async () => {
      vi.mocked(getSearchResults).mockResolvedValue([
        buildSpotifySong({ spotifyId: "spotify-a", title: "Stick Season" }),
      ]);

      const { user } = renderSearchBar();

      await user.click(getInput());
      await user.type(getInput(), "noah");

      await screen.findByText("Stick Season");

      expect(getSearchResults).toHaveBeenCalledTimes(1);
      expect(getSearchResults).toHaveBeenCalledWith("noah", expect.anything());
    });

    it("does not search a query below the minimum length", async () => {
      const { user } = renderSearchBar();

      await user.click(getInput());
      await user.type(getInput(), "no");
      await wait(DEBOUNCE_MS + 100);

      expect(getSearchResults).not.toHaveBeenCalled();
    });

    it("does not search while the panel is closed", async () => {
      const { user } = renderSearchBar();

      await user.type(getInput(), "noah", { skipClick: true });
      await wait(DEBOUNCE_MS + 100);

      expect(getSearchResults).not.toHaveBeenCalled();
    });
  });
});
