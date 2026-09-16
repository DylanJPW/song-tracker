import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getSearchResults } from "@/api/songs";
import type { Song } from "@/api/schemas/SongSchema";
import { SearchBar } from "@/components/SearchBar";
import { SongList } from "@/components/songDisplay/SongList";

interface GetSearchMessageProps {
  query: string;
  isPending: boolean;
  error: Error | null;
}

function getSearchMessage({
  query,
  isPending,
  error,
}: GetSearchMessageProps): string {
  if (isPending) return "Searching...";
  if (error) return error.message;
  return query;
}

export function SearchResultsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const { data, isPending, error } = useQuery({
    queryKey: ["songSearch", query],
    queryFn: () => getSearchResults(query),
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const mappedResults: Song[] = (data ?? []).map((song) => ({
    ...song,
    id: null as unknown as number,
  }));
  return (
    <div className="flex flex-col items-center">
      <SearchBar
        defaultValue={getSearchMessage({ query, isPending, error })}
        setSearchParams={setSearchParams}
      />
      {data !== undefined && data.length > 0 ? (
        <SongList songs={mappedResults} />
      ) : (
        <p>Search for songs</p>
      )}
    </div>
  );
}