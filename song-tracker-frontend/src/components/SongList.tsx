import type { Song } from "@/api/songs";
import { SongItem } from "./SongItem";

interface SongListProps {
  songs: Song[];
}

export function SongList({ songs }: SongListProps) {
  return (
    <div className="flex place-content-center">
      <table>
        <thead>
          <tr>
            <th className="px-4 py-2">Album Cover</th>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Artist</th>
          </tr>
        </thead>
        <tbody>
          {songs.map(({ id, title, artist, album, imageUrl }) => (
            <SongItem
              album={album}
              artist={artist}
              imageUrl={imageUrl}
              key={id}
              title={title}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
