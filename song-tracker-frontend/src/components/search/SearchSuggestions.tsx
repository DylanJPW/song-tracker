import { Link } from "react-router";
import { FiClock, FiSearch } from "react-icons/fi";
import type { SpotifySong } from "@/api/schemas/SongSchema";
import { MAX_SUGGESTIONS } from "@/components/search/consts";

interface HistorySuggestionProps {
  history: string[];
  handleSuggestionClick: (s: string) => void;
}

function HistorySuggestion({
  history,
  handleSuggestionClick,
}: HistorySuggestionProps) {
  return (
    <ul className="max-h-72 overflow-y-auto py-1">
      {history.map((s) => (
        <li
          key={s}
          className="flex cursor-pointer items-center gap-x-3 px-4 py-2.5 text-sm hover:bg-surface-hover"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleSuggestionClick(s)}
        >
          <FiClock aria-hidden={true} className="size-4 shrink-0 text-muted" />
          <span className="truncate">{s}</span>
        </li>
      ))}
    </ul>
  );
}

interface PredictionSuggestionProps {
  predictions: SpotifySong[] | undefined;
  handleSuggestionClick: (s: string) => void;
}

function PredictionSuggestion({
  predictions = [],
  handleSuggestionClick,
}: PredictionSuggestionProps) {
  return (
    <ul className="max-h-72 overflow-y-auto py-1">
      {predictions.slice(0, MAX_SUGGESTIONS).map((s) => (
        <li
          key={s.spotifyId}
          className="flex cursor-pointer items-center gap-x-3 px-4 py-2.5 text-sm hover:bg-surface-hover"
          onMouseDown={(e) => e.preventDefault()}
        >
          <FiSearch aria-hidden={true} className="size-4 shrink-0 text-muted" />
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
  );
}

interface SearchSuggestionsProps {
  showHistory: boolean;
  history: string[];
  predictions: SpotifySong[] | undefined;
  handleSuggestionClick: (s: string) => void;
}

export function SearchSuggestions({
  showHistory,
  history = [],
  predictions = [],
  handleSuggestionClick,
}: SearchSuggestionsProps) {
  if ((showHistory && !history) || (!showHistory && predictions?.length < 0)) {
    return null;
  }

  console.log("Test predictions:", predictions);

  return (
    <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-lg border border-line bg-raised shadow-lg shadow-black/40">
      {showHistory ? (
        <HistorySuggestion
          history={history}
          handleSuggestionClick={handleSuggestionClick}
        />
      ) : (
        <PredictionSuggestion
          predictions={predictions}
          handleSuggestionClick={handleSuggestionClick}
        />
      )}
    </div>
  );
}