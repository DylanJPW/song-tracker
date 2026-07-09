import { useSuspenseQuery } from "@tanstack/react-query";
import { getSongs } from "@/api/songs";
import { Head } from "@/components/Head";
import { SearchBar } from "@/components/SearchBar";
import { Song } from "@/components/Song";

export function SongList() {
  const { data } = useSuspenseQuery({
    queryFn: getSongs,
    queryKey: ["songs"],
    staleTime: Number.POSITIVE_INFINITY,
  });

  return (
    <>
      <Head title="SongTracker" />
      <div className="flex flex-col place-content-center">
        <SearchBar />
        <div className="flex place-content-center">
          <table>
            <thead>
              <tr>
                <th className="px-4 py-2">Song</th>
                <th className="px-4 py-2">Artist</th>
                <th className="px-4 py-2">Date Added</th>
                <th className="px-4 py-2">Links</th>
                <th className="px-4 py-2">Notes</th>
              </tr>
            </thead>
            {data.map(({ name, artist, dateAdded, links, notes }) => (
              <Song
                artist={artist}
                dateAdded={dateAdded}
                key={`${name}By${artist}`}
                links={links}
                name={name}
                notes={notes}
              />
            ))}
          </table>
        </div>
      </div>
    </>
  );
}
