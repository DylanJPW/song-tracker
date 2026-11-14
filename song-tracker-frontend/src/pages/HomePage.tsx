import { useSuspenseQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { LandingPage } from "@/pages/LandingPage";
import { currentUser } from "@/api/authentication";
import { getDashboardUserSongs } from "@/api/userSongs";
import { Section } from "@/components/dashboard/Section";

export function HomePage() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <LandingPage />;
  }

  return <SongCatalogue />;
}

function SongCatalogue() {
  const { data: user } = useSuspenseQuery({
    queryFn: currentUser,
    queryKey: ["user"],
    refetchOnMount: true,
  });

  const { data: userSongs } = useSuspenseQuery({
    queryFn: getDashboardUserSongs,
    queryKey: ["userSongs"],
  });

  return (
    <div className="mx-auto w-full max-w-2xl p-4">
      <h1>Welcome back, {user.username}</h1>
      <div className="flex flex-col gap-y-4">
        <Section title="Want to Learn" userSongs={userSongs.wantToLearn} />
        <Section title="Learning" userSongs={userSongs.learning} />
        <Section title="Learned" userSongs={userSongs.learned} />
      </div>
    </div>
  );
}