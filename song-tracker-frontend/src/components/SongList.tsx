import type {Song} from "@/api/schemas/SongSchema";
import {SongItem} from "@/components/SongItem";

interface SongListProps {
  songs: Song[];
}

export function SongList({songs}: SongListProps) {
  return (
    <div className="flex flex-col place-content-center">
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
    </div>
  );
}