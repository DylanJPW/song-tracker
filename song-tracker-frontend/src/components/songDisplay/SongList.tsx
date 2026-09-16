import type { Song } from "@/api/schemas/SongSchema";
import { SongItem } from "@/components/songDisplay/SongItem";

interface SongListProps {
  songs: Song[];
}

export function SongList({ songs }: SongListProps) {
  return (
    <ul className="w-full divide-y divide-line border-line border-y">
      {songs.map((song) => (
        <li key={song.spotifyId ?? song.id}>
          <SongItem song={song} />
        </li>
      ))}
    </ul>
  );
}