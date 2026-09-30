import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { add, list } from "@/utils/searchHistory";
import { SearchBar } from "./SearchBar";

vi.mock("@/utils/searchHistory", () => ({
  add: vi.fn(),
  list: vi.fn(),
}));

const PLACEHOLDER = "Song, album, or artist";

interface RenderOptions {
  defaultValue?: string;
  suggestions?: string[];
}

function renderSearchBar({
  defaultValue = "",
  suggestions = [],
}: RenderOptions = {}) {
  vi.mocked(list).mockReturnValue(suggestions);

  const setSearchParams = vi.fn();

  return {
    setSearchParams,
    user: userEvent.setup(),
    ...render(
      <SearchBar
        defaultValue={defaultValue}
        setSearchParams={setSearchParams}
      />,
    ),
  };
}

function submitSearch(input: HTMLElement) {
  const form = input.closest("form");

  if (form === null) {
    throw new Error("The search input is not inside a form");
  }

  fireEvent.submit(form);
}

describe("SearchBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("seeds the input from the current query", () => {
    renderSearchBar({ defaultValue: "noah kahan" });

    expect(screen.getByPlaceholderText(PLACEHOLDER)).toHaveValue("noah kahan");
  });

  it("searches for the submitted value, trimmed", async () => {
    const { setSearchParams, user } = renderSearchBar();
    const input = screen.getByPlaceholderText(PLACEHOLDER);

    await user.type(input, "  nirvana  ");
    submitSearch(input);

    expect(setSearchParams).toHaveBeenCalledWith({ q: "nirvana" });
  });

  it("records the submitted search in the history", async () => {
    const { user } = renderSearchBar();
    const input = screen.getByPlaceholderText(PLACEHOLDER);

    await user.type(input, "nirvana");
    submitSearch(input);

    expect(add).toHaveBeenCalledWith("nirvana");
  });

  it("hides the suggestions until the input is clicked", async () => {
    const { user } = renderSearchBar({ suggestions: ["noah kahan"] });

    expect(screen.queryByText("noah kahan")).not.toBeInTheDocument();

    await user.click(screen.getByPlaceholderText(PLACEHOLDER));

    expect(screen.getByText("noah kahan")).toBeInTheDocument();
  });

  it("shows no panel when the history is empty", async () => {
    const { user } = renderSearchBar({ suggestions: [] });

    await user.click(screen.getByPlaceholderText(PLACEHOLDER));

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("searches for the suggestion that was clicked, not what was typed", async () => {
    const { setSearchParams, user } = renderSearchBar({
      suggestions: ["noah kahan"],
    });
    const input = screen.getByPlaceholderText(PLACEHOLDER);

    await user.click(input);
    await user.type(input, "nir");
    await user.click(screen.getByText("noah kahan"));

    expect(setSearchParams).toHaveBeenCalledWith({ q: "noah kahan" });
    expect(input).toHaveValue("noah kahan");
  });

  it("stays open long enough for a suggestion click to land", async () => {
    const { setSearchParams, user } = renderSearchBar({
      suggestions: ["noah kahan"],
    });

    await user.click(screen.getByPlaceholderText(PLACEHOLDER));
    await user.click(screen.getByText("noah kahan"));

    expect(setSearchParams).toHaveBeenCalledTimes(1);
  });

  it("closes the suggestions once one is chosen", async () => {
    const { user } = renderSearchBar({ suggestions: ["noah kahan"] });

    await user.click(screen.getByPlaceholderText(PLACEHOLDER));
    await user.click(screen.getByText("noah kahan"));

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("closes the suggestions when focus leaves the search bar", async () => {
    const { user } = renderSearchBar({ suggestions: ["noah kahan"] });

    await user.click(screen.getByPlaceholderText(PLACEHOLDER));

    expect(screen.getByText("noah kahan")).toBeInTheDocument();

    await user.tab();

    expect(screen.queryByText("noah kahan")).not.toBeInTheDocument();
  });
});
