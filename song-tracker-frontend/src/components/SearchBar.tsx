import { useState } from "react";
import type { SetURLSearchParams } from "react-router";
import { add, list } from "@/utils/searchHistory";
import { FiClock } from "react-icons/fi";

interface SearchBarProps {
  defaultValue: string;
  setSearchParams: SetURLSearchParams;
}

export function SearchBar({ defaultValue, setSearchParams }: SearchBarProps) {
  const [input, setInput] = useState(defaultValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestions = list();

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setSearchParams({ q: input.trim() });
    add(input);
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
          placeholder="Search for songs..."
          type="search"
          value={input}
          onClick={() => setShowSuggestions(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setShowSuggestions(false);
          }}
        />
      </form>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-lg border border-line bg-raised shadow-lg shadow-black/40">
          <ul className="max-h-72 overflow-y-auto py-1">
            {suggestions.map((s) => (
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
        </div>
      )}
    </div>
  );
}