import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getSearchResults, type Song } from "../api/songs";

interface SearchBarProps {
  setSearchResults?: (results: Song[]) => void;
}

export function SearchBar({ setSearchResults }: SearchBarProps) {
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["query", query],
    queryFn: () => getSearchResults(query),
    enabled: query.length > 0,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

  useEffect(() => {
    if (data && setSearchResults) setSearchResults(data);
  }, [data]);

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setQuery(input);
    if (!setSearchResults) navigate("/search");
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  return (
    <>
      <form className="flex w-full" onSubmit={handleSubmit}>
        <input
          className="m-2 flex grow rounded-md border p-1 dark:border-gray-400"
          onChange={handleChange}
          placeholder="Search for songs..."
          type="text"
          value={input}
        />
      </form>

      {isLoading && <p>Searching...</p>}

      {error && <p>{error.message}</p>}
    </>
  );
}
