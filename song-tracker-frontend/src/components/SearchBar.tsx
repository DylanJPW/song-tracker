import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getSearchResults } from "../api/songs";

export function SearchBar() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["query", query],
    queryFn: () => getSearchResults(query),
    enabled: query.length > 0,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setQuery(input);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          placeholder="Search for songs..."
          type="text"
          value={input}
        />
      </form>

      {isLoading && <p>Searching...</p>}

      {error && <p>{error.message}</p>}

      {data?.map((song) => (
        <div key={`${song.name}By${song.artist}`}>{song.name}</div>
      ))}
    </>
  );
}
