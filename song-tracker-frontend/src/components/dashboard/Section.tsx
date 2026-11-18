import type { UserSong } from "@/api/schemas/UserSongSchema";
import { SongItem } from "@/components/songDisplay/SongItem";

interface SectionProps {
  title: string;
  subtitle: string;
  userSongs: UserSong[];
}

export function Section({ title, subtitle, userSongs }: SectionProps) {
  return (
    <div>
      <h2 className="font-medium">{title}</h2>
      <p className="text-muted text-sm">{subtitle}</p>
      <hr className="border-line my-2" />
      <div className="flex flex-row">
        {userSongs?.map((userSong) => (
          <SongItem song={userSong.song} />
        ))}
      </div>
    </div>
  );
}