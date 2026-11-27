import type { UserSong } from "@/api/schemas/UserSongSchema";
import { SongItem } from "@/components/songDisplay/SongItem";

interface SectionProps {
  title: string;
  emptyMessage: string;
  userSong: UserSong | null;
}

export function Section({ title, emptyMessage, userSong }: SectionProps) {
  if (userSong === null) {
    return (
      <div>
        <h2 className="font-medium">{title}</h2>
        <p className="text-muted text-sm">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-medium">{title}</h2>
      <hr className="border-line my-2" />
      <div>
        <SongItem song={userSong.song} />
      </div>
    </div>
  );
}