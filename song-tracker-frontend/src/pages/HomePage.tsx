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

  return <Dashboard />;
}

function Dashboard() {
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
    <div className="grid grid-cols-3 mx-auto w-full max-w-2xl p-4 gap-y-4">
      <section className="col-span-3" aria-labelledby="title">
        <div className="flex flex-col gap-y-2">
          <h1 className="col-span-3 mt-3 font-bold text-3xl">
            Welcome back, {user.username}
          </h1>
          <p className="text-muted text-sm">
            Track the songs you're learning to play.
          </p>
        </div>
      </section>
      <section className="col-span-3" aria-labelledby="tiles">
        <TileSection
          practisedInLast30Days={dashboardData.practisedInLast30Days}
          practisedThisMonth={dashboardData.practisedThisMonth}
          songCount={dashboardData.songCount}
        />
      </section>
      <section
        className="col-span-3 flex flex-col sm:grid sm:grid-cols-3 gap-4"
        aria-labelledby="suggestions"
      >
        <Section
          title="Continue learning from where you left off"
          emptyMessage="You haven't practised anything yet."
          userSong={dashboardData.mostRecentlyPractised}
        />
        <Section
          title="It's been a while since you practised this"
          emptyMessage="You haven't practised anything yet."
          userSong={dashboardData.oldestPractised}
        />
        <Section
          title="Try something new"
          emptyMessage="You haven't added any songs yet."
          userSong={dashboardData.newlyAdded}
        />
      </section>
    </div>
  );
}