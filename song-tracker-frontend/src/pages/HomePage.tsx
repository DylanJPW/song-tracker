import { useSuspenseQuery } from "@tanstack/react-query";
import { getSongs } from "@/api/songs";
import { SongList } from "@/components/SongList";

export function HomePage() {
  const { data } = useSuspenseQuery({
    queryFn: getSongs,
    queryKey: ["songs"],
    staleTime: Number.POSITIVE_INFINITY,
  });

  return (
    <div className="flex flex-col items-center">
      <SongList songs={data} />
    </div>
  );
}
