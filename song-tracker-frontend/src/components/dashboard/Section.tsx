import type { UserSong } from "@/api/schemas/UserSongSchema";
import { SongItem } from "@/components/songDisplay/SongItem";

interface SectionProps {
  title: string;
  userSongs: UserSong[];
}

export function Section({ title, userSongs }: SectionProps) {
  return (
    <div>
      <h2>{title}</h2>
      <div className="flex flex-row">
        {userSongs?.map((userSong) => (
          <SongItem song={userSong.song} />
        ))}
      </div>
    </div>
  );
}