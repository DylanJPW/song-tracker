import { useState } from "react";
import type { SetURLSearchParams } from "react-router";
import { add, list } from "@/utils/searchHistory";
import { FiClock, FiLoader, FiSearch } from "react-icons/fi";
import { useDebouncedValue } from "@/utils/useDebouncedValue";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getSearchResults } from "@/api/songs";

const DEBOUNCE_MS = 200;
const MIN_QUERY_LENGTH = 3;
const FIVE_MINUTES = 1000 * 60 * 5;
const MAX_SUGGESTIONS = 5;

interface SearchBarProps {
  defaultValue: string;
  setSearchParams: SetURLSearchParams;
}

export function SearchBar({ defaultValue, setSearchParams }: SearchBarProps) {
  const [input, setInput] = useState(defaultValue);

  const searchHistory = list()
    .filter((s) => s.includes(input))
    .slice(0, MAX_SUGGESTIONS);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedInput = useDebouncedValue(input.trim(), DEBOUNCE_MS);
  const isSearchable = debouncedInput.length >= MIN_QUERY_LENGTH;

  const { data: suggestions, isFetching } = useQuery({
    enabled: showSuggestions && isSearchable,
    placeholderData: keepPreviousData,
    queryFn: ({ signal }) => getSearchResults(debouncedInput, signal),
    queryKey: ["songSearch", debouncedInput],
    staleTime: FIVE_MINUTES,
  });

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setSearchParams({ q: input.trim() });
    add(input);
    setShowSuggestions(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  function handleSuggestionClick(suggestion: string) {
    setSearchParams({ q: suggestion });
    setInput(suggestion);
    setShowSuggestions(false);
  }

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit}>
        <input
          className="h-11 w-full rounded-lg border border-line bg-surface px-4 text-base text-content placeholder:text-muted focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-accent"
          onChange={handleChange}
          placeholder="Song, album, or artist"
          type="search"
          value={input}
          onClick={() => setShowSuggestions(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setShowSuggestions(false);
          }}
        />
      </form>
      {showSuggestions && (
        <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-lg border border-line bg-raised shadow-lg shadow-black/40">
          {suggestions && suggestions.length > 0 && (
            <>
              <div className="flex flex-row ps-2 pt-1 text-sm text-muted gap-2 text-center">
                <p>Suggestions</p>
                {isFetching ? (
                  <FiLoader className="size-4 shrink-0 mt-0.5" />
                ) : null}
              </div>
              <ul className="max-h-72 overflow-y-auto py-1">
                {suggestions.slice(0, 5).map((s) => (
                  <li
                    key={s.spotifyId}
                    className="flex cursor-pointer items-center gap-x-3 px-4 py-2.5 text-sm hover:bg-surface-hover"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSuggestionClick(s.title)}
                  >
                    <FiSearch
                      aria-hidden={true}
                      className="size-4 shrink-0 text-muted"
                    />
                    <span className="truncate">{s.title}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {searchHistory.length > 0 && (
            <>
              <p className="ps-2 text-sm text-muted">History</p>
              <ul className="max-h-72 overflow-y-auto py-1">
                {searchHistory.map((s) => (
                  <li
                    key={s}
                    className="flex cursor-pointer items-center gap-x-3 px-4 py-2.5 text-sm hover:bg-surface-hover"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSuggestionClick(s)}
                  >
                    <FiClock
                      aria-hidden={true}
                      className="size-4 shrink-0 text-muted"
                    />
                    <span className="truncate">{s}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}