import { useState } from "react";
import { type SetURLSearchParams } from "react-router";
import { add, list } from "@/utils/searchHistory";
import { useDebouncedValue } from "@/utils/useDebouncedValue";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getSearchResults } from "@/api/songs";
import {
  DEBOUNCE_MS,
  FIVE_MINUTES,
  MAX_SUGGESTIONS,
  MIN_QUERY_LENGTH,
} from "@/components/search/consts";
import { SearchSuggestions } from "@/components/search/SearchSuggestion";

interface SearchBarProps {
  defaultValue: string;
  setSearchParams: SetURLSearchParams;
}

export function SearchBar({ defaultValue, setSearchParams }: SearchBarProps) {
  const [input, setInput] = useState(defaultValue);

  const searchHistory = list()
    .filter((s) => s.toLowerCase().includes(input.toLowerCase()))
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
        <SearchSuggestions
          suggestions={suggestions}
          isFetching={isFetching}
          handleSuggestionClick={handleSuggestionClick}
          searchHistory={searchHistory}
        />
      )}
    </div>
  );
}
