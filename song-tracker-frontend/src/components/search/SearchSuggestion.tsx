import { Link } from "react-router";
import { FiClock, FiLoader, FiSearch } from "react-icons/fi";
import type { SpotifySong } from "@/api/schemas/SongSchema";
import { MAX_SUGGESTIONS } from "@/components/search/consts";

interface SearchSuggestionsProps {
  showHistory: boolean;
  suggestions: SpotifySong[] | string[] | undefined;
  isFetching: boolean;
  handleSuggestionClick: (s: string) => void;
}

export function SearchSuggestions({
  showHistory,
  suggestions = [],
  isFetching,
  handleSuggestionClick,
}: SearchSuggestionsProps) {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-lg border border-line bg-raised shadow-lg shadow-black/40">
      {showHistory ? (
        <>
          <p className="ps-2 pt-1 text-sm text-muted">History</p>
          <ul className="max-h-72 overflow-y-auto py-1">
            {(suggestions as string[]).map((s) => (
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
      ) : (
        <>
          <div className="flex flex-row ps-2 pt-1 text-sm text-muted gap-2 text-center">
            <p>Suggestions</p>
            {isFetching ? (
              <FiLoader className="size-4 shrink-0 mt-0.5" />
            ) : null}
          </div>
          <ul className="max-h-72 overflow-y-auto py-1">
            {(suggestions as SpotifySong[])
              .slice(0, MAX_SUGGESTIONS)
              .map((s) => (
                <li
                  key={s.spotifyId}
                  className="flex cursor-pointer items-center gap-x-3 px-4 py-2.5 text-sm hover:bg-surface-hover"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <FiSearch
                    aria-hidden={true}
                    className="size-4 shrink-0 text-muted"
                  />
                  <Link
                    className="truncate"
                    to={`/songs/${s.spotifyId}`}
                    onClick={() => handleSuggestionClick(s.title)}
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
          </ul>
        </>
      )}
      )
    </div>
  );
}
