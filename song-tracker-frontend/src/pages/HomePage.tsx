import {useSuspenseQuery} from "@tanstack/react-query";
import {getSongs} from "@/api/songs";
import {getUserSongs} from "@/api/userSongs";
import {SongList} from "@/components/SongList";
import {useAuth} from "@/context/AuthContext";

export function HomePage() {
  const {isLoggedIn} = useAuth();
  const {data} = useSuspenseQuery({
    queryFn: isLoggedIn ? getUserSongs : getSongs,
    queryKey: ["songs"],
    staleTime: Number.POSITIVE_INFINITY,
  });

  return (
    <div className="flex flex-col items-center">
      <SongList songs={data}/>
    </div>
  );
}