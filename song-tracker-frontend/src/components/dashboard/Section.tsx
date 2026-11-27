import type { UserSong } from "@/api/schemas/UserSongSchema";
import { SongItem } from "@/components/songDisplay/SongItem";

interface SectionProps {
  title: string;
  emptyMessage: string;
  userSong: UserSong | null;
}

export function Section({ title, emptyMessage, userSong }: SectionProps) {
  return (
    <div>
      <h2 className="font-medium">{title}</h2>
      <hr className="border-line my-2" />
      <div>
        {userSong ? (
          <SongItem song={userSong.song} />
        ) : (
          <p className="text-muted text-sm">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
}