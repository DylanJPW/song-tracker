import type {UserSong} from "@/api/schemas/UserSongSchema";

export function UserSongItem({song, capo, difficultyRating, status}: UserSong) {
  const {title, artist, album, imageUrl} = song;
  return (
    <tr className="font-medium">
      <td className="border border-gray-300 px-4 py-2">
        <img alt={title} height={100} src={imageUrl} width={100}/>
      </td>
      <td className="border border-gray-300 px-4 py-2">
        <p>
          {title} - {album}
        </p>
      </td>
      <td className="border border-gray-300 px-4 py-2">{artist}</td>
      <td className="border border-gray-300 px-4 py-2">{capo}</td>
      <td className="border border-gray-300 px-4 py-2">{difficultyRating}</td>
      <td className="border border-gray-300 px-4 py-2">{status}</td>
    </tr>
  );
}