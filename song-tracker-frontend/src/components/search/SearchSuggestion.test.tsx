import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import type { SpotifySong } from "@/api/schemas/SongSchema";
import { MAX_SUGGESTIONS } from "@/components/search/consts";
import { buildSpotifySong } from "@/test-fixtures";
import { SearchSuggestions } from "./SearchSuggestion";

interface RenderOptions {
  isFetching?: boolean;
  searchHistory?: string[];
  suggestions?: SpotifySong[] | undefined;
}

function renderSuggestions({
  isFetching = false,
  searchHistory = [],
  suggestions = [],
}: RenderOptions = {}) {
  const handleSuggestionClick = vi.fn();

  return {
    handleSuggestionClick,
    user: userEvent.setup(),
    ...render(
      <MemoryRouter>
        <SearchSuggestions
          handleSuggestionClick={handleSuggestionClick}
          isFetching={isFetching}
          searchHistory={searchHistory}
          suggestions={suggestions}
        />
      </MemoryRouter>,
    ),
  };
}

function buildSongs(count: number): SpotifySong[] {
  return Array.from({ length: count }, (_, index) =>
    buildSpotifySong({ spotifyId: `spotify-${index}`, title: `Song ${index}` }),
  );
}

describe("SearchSuggestions", () => {
  describe("song suggestions", () => {
    it("links each song to its details page", () => {
      renderSuggestions({
        suggestions: [
          buildSpotifySong({ spotifyId: "spotify-a", title: "Stick Season" }),
        ],
      });

      expect(
        screen.getByRole("link", { name: "Stick Season" }),
      ).toHaveAttribute("href", "/songs/spotify-a");
    });

    it("shows at most MAX_SUGGESTIONS songs", () => {
      renderSuggestions({ suggestions: buildSongs(MAX_SUGGESTIONS + 3) });

      expect(screen.getAllByRole("link")).toHaveLength(MAX_SUGGESTIONS);
    });

    it("shows the suggestions heading when there are songs", () => {
      renderSuggestions({ suggestions: buildSongs(1) });

      expect(screen.getByText("Suggestions")).toBeInTheDocument();
    });

    it("omits the suggestions heading when there are none", () => {
      renderSuggestions({ searchHistory: ["noah kahan"] });

      expect(screen.queryByText("Suggestions")).not.toBeInTheDocument();
    });

    it("tolerates suggestions being undefined before the first search", () => {
      renderSuggestions({
        searchHistory: ["noah kahan"],
        suggestions: undefined,
      });

      expect(screen.getByText("noah kahan")).toBeInTheDocument();
      expect(screen.queryByText("Suggestions")).not.toBeInTheDocument();
    });
  });

  describe("history suggestions", () => {
    it("lists the history entries under a heading", () => {
      renderSuggestions({ searchHistory: ["noah kahan", "nirvana"] });

      expect(screen.getByText("History")).toBeInTheDocument();
      expect(screen.getByText("noah kahan")).toBeInTheDocument();
      expect(screen.getByText("nirvana")).toBeInTheDocument();
    });

    it("reports the entry that was clicked", async () => {
      const { handleSuggestionClick, user } = renderSuggestions({
        searchHistory: ["noah kahan", "nirvana"],
      });

      await user.click(screen.getByText("nirvana"));

      expect(handleSuggestionClick).toHaveBeenCalledWith("nirvana");
    });

    it("omits the history heading when there are no entries", () => {
      renderSuggestions({ suggestions: buildSongs(1) });

      expect(screen.queryByText("History")).not.toBeInTheDocument();
    });
  });
});
