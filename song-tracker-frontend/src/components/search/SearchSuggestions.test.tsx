import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import type { SpotifySong } from "@/api/schemas/SongSchema";
import { MAX_SUGGESTIONS } from "@/components/search/consts";
import { buildSpotifySong } from "@/test-fixtures";
import { SearchSuggestions } from "./SearchSuggestions";

interface RenderOptions {
  showHistory?: boolean;
  history?: string[];
  predictions?: SpotifySong[] | undefined;
}

function renderSuggestions(options: RenderOptions = {}) {
  const { showHistory = false, history = [] } = options;

  const predictions = "predictions" in options ? options.predictions : [];

  const handleSuggestionClick = vi.fn();

  return {
    handleSuggestionClick,
    user: userEvent.setup(),
    ...render(
      <MemoryRouter>
        <SearchSuggestions
          handleSuggestionClick={handleSuggestionClick}
          history={history}
          predictions={predictions}
          showHistory={showHistory}
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
  describe("song predictions (the user is typing)", () => {
    it("links each song to its details page", () => {
      renderSuggestions({
        predictions: [
          buildSpotifySong({ spotifyId: "spotify-a", title: "Stick Season" }),
        ],
      });

      expect(
        screen.getByRole("link", { name: "Stick Season" }),
      ).toHaveAttribute("href", "/songs/spotify-a");
    });

    it("shows at most MAX_SUGGESTIONS songs", () => {
      renderSuggestions({ predictions: buildSongs(MAX_SUGGESTIONS + 3) });

      expect(screen.getAllByRole("link")).toHaveLength(MAX_SUGGESTIONS);
    });

    it("reports the title of the song that was clicked", async () => {
      const { handleSuggestionClick, user } = renderSuggestions({
        predictions: [
          buildSpotifySong({ spotifyId: "spotify-a", title: "Stick Season" }),
        ],
      });

      await user.click(screen.getByRole("link", { name: "Stick Season" }));

      expect(handleSuggestionClick).toHaveBeenCalledWith("Stick Season");
    });

    it("does not show history entries alongside the songs", () => {
      renderSuggestions({
        history: ["noah kahan"],
        predictions: buildSongs(1),
      });

      expect(screen.queryByText("noah kahan")).not.toBeInTheDocument();
    });
  });

  describe("history (the input is empty)", () => {
    it("lists each history entry", () => {
      renderSuggestions({
        history: ["noah kahan", "nirvana"],
        showHistory: true,
      });

      expect(screen.getByText("noah kahan")).toBeInTheDocument();
      expect(screen.getByText("nirvana")).toBeInTheDocument();
    });

    it("reports the entry that was clicked", async () => {
      const { handleSuggestionClick, user } = renderSuggestions({
        history: ["noah kahan", "nirvana"],
        showHistory: true,
      });

      await user.click(screen.getByText("nirvana"));

      expect(handleSuggestionClick).toHaveBeenCalledWith("nirvana");
    });

    it("does not show song predictions alongside the history", () => {
      renderSuggestions({
        history: ["noah kahan"],
        predictions: buildSongs(1),
        showHistory: true,
      });

      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
  });

  describe("when there is nothing to show", () => {
    it("renders nothing when there are no song predictions", () => {
      const { container } = renderSuggestions({ predictions: [] });

      expect(container).toBeEmptyDOMElement();
    });

    it("renders nothing before the first search has resolved", () => {
      const { container } = renderSuggestions({ predictions: undefined });

      expect(container).toBeEmptyDOMElement();
    });

    it("renders nothing when there is no history", () => {
      const { container } = renderSuggestions({
        history: [],
        showHistory: true,
      });

      expect(container).toBeEmptyDOMElement();
    });
  });
});