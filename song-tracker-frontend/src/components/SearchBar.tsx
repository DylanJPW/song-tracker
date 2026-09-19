import { useState } from "react";
import type { SetURLSearchParams } from "react-router";
import { add, list } from "@/utils/searchHistory";

interface SearchBarProps {
  defaultValue: string;
  setSearchParams: SetURLSearchParams;
}

export function SearchBar({ defaultValue, setSearchParams }: SearchBarProps) {
  const [input, setInput] = useState("");
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

  return (
    <>
      <form className="flex flex-col w-full" onSubmit={handleSubmit}>
        <input
          className="m-2 flex grow rounded-md border p-1 dark:border-gray-400"
          defaultValue={defaultValue}
          onChange={handleChange}
          placeholder="Search for songs..."
          type="text"
          value={input}
          onClick={() => setShowSuggestions(true)}
          onBlur={() => setShowSuggestions(false)}
        />
      </form>
      {showSuggestions && (
        <ul className="absolute z-10 bg-surface rounded-md">
          {suggestions.map((s) => (
            <li
              key={s}
              className="px-3 hover:bg-surface-hover"
              onClick={() => setSearchParams({ q: s })}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
