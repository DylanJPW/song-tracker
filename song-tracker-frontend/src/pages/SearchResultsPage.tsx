import { useState } from "react";
import type { Song } from "@/api/songs";
import { SearchBar } from "@/components/SearchBar";
import { SongList } from "@/components/SongList";

export function SearchResultsList() {
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  return (
    <div className="flex flex-col items-center">
      <SearchBar setSearchResults={setSearchResults} />
      <SongList songs={searchResults} />
    </div>
  );
}
