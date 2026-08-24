import {useSuspenseQuery} from "@tanstack/react-query";
import {getSongs} from "@/api/songs";
import {SongList} from "@/components/songDisplay/SongList";
import {useAuth} from "@/context/AuthContext";
import {LandingPage} from "@/pages/LandingPage";

export function HomePage() {
  const {isLoggedIn} = useAuth();

  if (!isLoggedIn) {
    return <LandingPage/>;
  }

  return <SongCatalogue/>;
}

function SongCatalogue() {
  const {data} = useSuspenseQuery({
    queryFn: getSongs,
    queryKey: ["songs"],
    staleTime: Number.POSITIVE_INFINITY,
  });

  return (
    <div className="flex flex-col items-center">
      <SongList songs={data}/>
    </div>
  );
}