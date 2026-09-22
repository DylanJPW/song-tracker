import type { ReactNode } from "react";
import { MdMusicNote } from "react-icons/md";

const ART_SIZE = 100;
const DEFAULT_ART_CLASS = "size-25 shrink-0 rounded-sm";

interface AlbumArtProps {
  album: string;
  className?: string;
  imageUrl: string | null;
  size?: number;
}

export function AlbumArt({
  album,
  className = DEFAULT_ART_CLASS,
  imageUrl,
  size = ART_SIZE,
}: AlbumArtProps) {
  if (imageUrl === null) {
    return (
      <div
        aria-hidden={true}
        className={`flex items-center justify-center bg-surface-hover text-muted ${className}`}
      >
        <MdMusicNote size={Math.round(size / 3)} />
      </div>
    );
  }

  return (
    <img
      alt={`Album art for ${album}`}
      className={`object-cover ${className}`}
      height={size}
      loading="lazy"
      src={imageUrl}
      width={size}
    />
  );
}

interface SongCardProps {
  album: string;
  artist: string;
  children?: ReactNode;
  imageUrl: string | null;
  title: string;
}

export function SongCard({
  album,
  artist,
  children,
  imageUrl,
  title,
}: SongCardProps) {
  return (
    <div className="flex grow flex-row items-center gap-x-3 bg-surface p-3 transition-colors group-hover:bg-surface-hover group-active:bg-surface-hover">
      <AlbumArt album={album} imageUrl={imageUrl} />
      <div className="flex min-w-0 grow flex-col gap-y-1">
        <p className="line-clamp-1 font-medium" title={title}>
          {title}
        </p>
        <p className="line-clamp-1 text-muted text-sm" title={album}>
          {album}
        </p>
        <p className="line-clamp-1 text-sm" title={artist}>
          {artist}
        </p>
      </div>
      {children}
    </div>
  );
}