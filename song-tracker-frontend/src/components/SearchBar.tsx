import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getSearchResults } from "../api/songs";

interface SearchBarProps {
  defaultValue: string;
  onSearch: (query: string) => void;
}

export function SearchBar({ defaultValue, onSearch }: SearchBarProps) {
  const [input, setInput] = useState("");

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    onSearch(input);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  return (
    <>
      <form className="flex w-full" onSubmit={handleSubmit}>
        <input
          className="m-2 flex grow rounded-md border p-1 dark:border-gray-400"
          defaultValue={defaultValue}
          onChange={handleChange}
          placeholder="Search for songs..."
          type="text"
          value={input}
        />
      </form>
    </>
  );
}