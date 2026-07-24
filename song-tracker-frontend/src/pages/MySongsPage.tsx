import {useSuspenseQuery} from "@tanstack/react-query";
import {getUserSongs} from "@/api/userSongs";
import {UserSongList} from "@/components/UserSongList";

export function MySongsPage() {
  const {data: userData} = useSuspenseQuery({
    queryFn: getUserSongs,
    queryKey: ["userSongs"],
    staleTime: Number.POSITIVE_INFINITY,
  });

  return (
    <div className="flex flex-col items-center">
      <UserSongList songs={userData}/>
    </div>
  );
}