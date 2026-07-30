import type {SongDTO} from "@/api/schemas/SongSchema";

export function SongItem({title, artist, album, imageUrl}: SongDTO) {
  
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
      <td className="border border-gray-300 px-4 py-2">
        <button type="button" className="cursor-pointer rounded-sm bg-blue-500 p-2 text-center hover:bg-blue-400">Want
          to learn
        </button>
      </td>
    </tr>
  );
}