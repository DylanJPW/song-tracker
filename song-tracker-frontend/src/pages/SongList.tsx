import { useSuspenseQuery } from "@tanstack/react-query";
import { getSongs } from "@/api/songs";
import { Head } from "@/components/Head";
import { Song } from "@/components/Song";

export function SongList() {
  const { data } = useSuspenseQuery({
    queryFn: getSongs,
    queryKey: ["songs"],
  });

  return (
    <>
      <Head title="SongTracker" />
      <div className="flex place-content-center">
        <table>
          <thead>
            <tr>
              <th className="px-4 py-2">Song</th>
              <th className="px-4 py-2">Singer</th>
              <th className="px-4 py-2">Date Added</th>
              <th className="px-4 py-2">Links</th>
              <th className="px-4 py-2">Notes</th>
            </tr>
          </thead>
          {data.map(({ name, singer, dateAdded, links, notes }) => (
            <Song
              dateAdded={dateAdded}
              key={`${name}By${singer}`}
              links={links}
              name={name}
              notes={notes}
              singer={singer}
            />
          ))}
        </table>
      </div>
    </>
  );
}
