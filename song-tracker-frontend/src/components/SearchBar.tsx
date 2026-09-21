import { useState } from "react";
import type { SetURLSearchParams } from "react-router";
import { add, list } from "@/utils/searchHistory";

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
    <div>
      <form className="flex flex-col w-full" onSubmit={handleSubmit}>
        <input
          className="m-2 flex grow rounded-md border p-1 dark:border-gray-400"
          onChange={handleChange}
          placeholder="Search for songs..."
          type="text"
          value={input}
          onClick={() => setShowSuggestions(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setShowSuggestions(false);
          }}
        />
      </form>
      {showSuggestions && (
        <ul className="absolute z-10 bg-surface rounded-md">
          {suggestions.map((s) => (
            <li
              key={s}
              className="px-3 hover:bg-surface-hover cursor-pointer"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSuggestionClick(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}