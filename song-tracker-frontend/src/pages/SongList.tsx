import { useSuspenseQuery } from "@tanstack/react-query";
import { getSongs } from "@/api/songs";
import { Head } from "@/components/Head";
import { SearchBar } from "@/components/SearchBar";
import { SongItem } from "@/components/SongItem";

export function SongList() {
  const { data } = useSuspenseQuery({
    queryFn: getSongs,
    queryKey: ["songs"],
    staleTime: Number.POSITIVE_INFINITY,
  });

  return (
    <>
      <Head title="SongTracker" />
      <div className="flex flex-col items-center">
        <SearchBar />
        <div className="flex place-content-center">
          <table>
            <thead>
              <tr>
                <th className="px-4 py-2">Album Cover</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Artist</th>
              </tr>
            </thead>
            {data.map(({ id, title, artist, album, imageUrl }) => (
              <SongItem
                album={album}
                artist={artist}
                imageUrl={imageUrl}
                key={id}
                title={title}
              />
            ))}
          </table>
        </div>
      </div>
    </>
  );
}
