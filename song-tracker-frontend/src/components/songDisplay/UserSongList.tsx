import type { UserSong } from "@/api/schemas/UserSongSchema";
import { UserSongItem } from "@/components/songDisplay/UserSongItem";

interface UserSongListProps {
  userSongs: UserSong[];
}

export function UserSongList({ userSongs }: UserSongListProps) {
  return (
    <ul className="w-full divide-y divide-line border-line border-y">
      {userSongs.map((userSong) => (
        <li key={userSong.id}>
          <UserSongItem userSong={userSong} />
        </li>
      ))}
    </ul>
  );
}