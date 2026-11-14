import { useSuspenseQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { LandingPage } from "@/pages/LandingPage";
import { currentUser } from "@/api/authentication";

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

  return (
    <div className="mx-auto w-full max-w-2xl p-4">
      <h1>Welcome back, {user.username}</h1>
    </div>
  );
}