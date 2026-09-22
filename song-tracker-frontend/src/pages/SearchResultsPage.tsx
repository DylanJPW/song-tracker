import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getSearchResults } from "@/api/songs";
import type { Song } from "@/api/schemas/SongSchema";
import { SearchBar } from "@/components/SearchBar";
import { Head } from "@/components/Head";
import { FiAlertCircle, FiSearch } from "react-icons/fi";
import { SongList } from "@/components/songDisplay/SongList";
import {
  EmptyState,
  SongListSkeleton,
} from "@/components/songDisplay/SearchStates";

const FIVE_MINUTES = 5 * 60 * 1000;

interface GetSearchMessageProps {
  query: string;
  isPending: boolean;
  isError: boolean;
  count: number | undefined;
}

function getSearchMessage({
  query,
  isPending,
  isError,
  count,
}: GetSearchMessageProps): string {
  if (query === "") {
    return "";
  }
  if (isPending) {
    return `Searching for ${query}`;
  }
  if (isError) {
    return "Search failed";
  }
  const noun = count === 1 ? "result" : "results";
  return `${count ?? 0} ${noun} for ${query}`;
}

interface SearchContentProps {
  data: Song[] | undefined;
  isError: boolean;
  isPending: boolean;
  onRetry: () => void;
  query: string;
}

function SearchContent({
  data,
  isError,
  isPending,
  onRetry,
  query,
}: SearchContentProps) {
  if (query === "") {
    return (
      <EmptyState
        body="Search by song title or artist, then add it to your list."
        icon={<FiSearch />}
        title="Find a song to learn"
      />
    );
  }

  if (isError) {
    return (
      <EmptyState
        action={
          <button
            className="cursor-pointer rounded-full bg-accent px-4 py-2 font-medium text-page text-sm"
            onClick={onRetry}
            type="button"
          >
            Try again
          </button>
        }
        body="We couldn't reach Spotify just then. It's usually temporary."
        icon={<FiAlertCircle />}
        title="That search didn't work"
      />
    );
  }

  if (isPending) {
    return <SongListSkeleton />;
  }

  if (data === undefined || data.length === 0) {
    return (
      <EmptyState
        body="Check the spelling, or try searching for just the artist."
        icon={<FiSearch />}
        title={`No songs found for "${query}"`}
      />
    );
  }

  return (
    <>
      <p className="my-2 text-muted text-sm">
        {data.length} {data.length === 1 ? "result" : "results"} for "{query}"
      </p>
      <SongList songs={data} />
    </>
  );
}

export function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["songSearch", query],
    queryFn: () => getSearchResults(query),
    enabled: query.length > 0,
    staleTime: FIVE_MINUTES,
  });

  const mappedResults: Song[] = (data ?? []).map((song) => ({
    ...song,
    id: null as unknown as number,
  }));

  return (
    <div className="mx-auto w-full max-w-2xl p-4">
      <Head
        title={query === "" ? "Search - SongTracker" : `${query} - SongTracker`}
      />
      <h1 className="mb-4 font-bold text-xl">Search</h1>

      <SearchBar defaultValue={query} setSearchParams={setSearchParams} />

      <p aria-live="polite" className="sr-only">
        {getSearchMessage({ query, isPending, isError, count: data?.length })}
      </p>

      <SearchContent
        data={mappedResults}
        isError={isError}
        isPending={isPending}
        onRetry={refetch}
        query={query}
      />
    </div>
  );
}
