import { useSuspenseQuery } from "@tanstack/react-query";
import { getSongs } from "@/api/songs";
import { SongList } from "@/components/songDisplay/SongList";
import { useAuth } from "@/context/AuthContext";
import { LandingPage } from "@/pages/LandingPage";

export function HomePage() {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <LandingPage />;
  }

  return <SongCatalogue username={user?.username} />;
}

function SongCatalogue(username: string) {
  const { data } = useSuspenseQuery({
    queryFn: getSongs,
    queryKey: ["songs"],
    staleTime: Number.POSITIVE_INFINITY,
  });

  return (
    <div className="mx-auto w-full max-w-2xl p-4">
      <h1>Welcome back, {username}</h1>
      <SongList songs={data} />
    </div>
  );
}
