import type {Song} from "@/api/schemas/SongSchema";
import {SongItem} from "@/components/SongItem";

interface SongListProps {
  songs: Song[];
}

export function SongList({songs}: SongListProps) {
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
        {songs.map(({id, title, artist, album, imageUrl, spotifyId}) => (
          <SongItem
            album={album}
            artist={artist}
            id={id}
            imageUrl={imageUrl}
            key={id}
            spotifyId={spotifyId}
            title={title}
          />
        ))}
        </tbody>
      </table>
    </div>
  );
}