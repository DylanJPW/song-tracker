import { useSuspenseQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { LandingPage } from "@/pages/LandingPage";
import { currentUser } from "@/api/authentication";
import { getDashboardUserSongs } from "@/api/userSongs";
import { Section } from "@/components/dashboard/Section";
import { TileSection } from "@/components/dashboard/TileSection";

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

  const { data: dashboardData } = useSuspenseQuery({
    queryFn: getDashboardUserSongs,
    queryKey: ["dashboardData", "dashboard"],
  });

  return (
    <div className="flex flex-col mx-auto w-full max-w-2xl p-4 gap-y-4">
      <h1 className="mt-3 font-bold text-3xl">Welcome back, {user.username}</h1>
      <div>
        <TileSection
          practisedInLast30Days={dashboardData.practisedInLast30Days}
          practisedThisMonth={dashboardData.practisedThisMonth}
        />
      </div>
      <div className="flex flex-col gap-y-4">
        <Section
          title="Learning"
          subtitle="Continue learning from where you left off"
          userSongs={[dashboardData.mostRecentlyPractised]}
        />
        <Section
          title="Learned"
          subtitle="It's been a while since you practised this"
          userSongs={[dashboardData.oldestPractised]}
        />
        <Section
          title="Want to Learn"
          subtitle="Try something new"
          userSongs={[dashboardData.newlyAdded]}
        />
      </div>
    </div>
  );
}