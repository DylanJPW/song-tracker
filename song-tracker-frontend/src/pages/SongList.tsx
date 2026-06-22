import { useSuspenseQuery } from "@tanstack/react-query";
import { getSongs } from "@/api/songs";
import { Head } from "@/components/Head";

export function SongList() {
  const { data } = useSuspenseQuery({
    queryFn: getSongs,
    queryKey: ["songs"],
  });



  return (
    <>
      <Head title="SongTracker" />
      <div>
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
            <tr className="font-medium" key={`${name}By${singer}`}>
              <td className="border border-gray-300 px-4 py-2">{name}</td>
              <td className="border border-gray-300 px-4 py-2">{singer}</td>
              <td className="border border-gray-300 px-4 py-2">
                {dateAdded.toDateString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">{links}</td>
              <td className="border border-gray-300 px-4 py-2">{notes}</td>
            </tr>
          ))}
        </table>
      </div>
    </>
  );
}
