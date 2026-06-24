interface SongProps {
  name: string;
  singer: string;
  dateAdded: Date;
  links: string[];
  notes: string;
}

export function Song({ name, singer, dateAdded, links, notes }: SongProps) {
  return (
    <tr className="font-medium">
      <td className="border border-gray-300 px-4 py-2">{name}</td>
      <td className="border border-gray-300 px-4 py-2">{singer}</td>
      <td className="border border-gray-300 px-4 py-2">
        {dateAdded.toDateString()}
      </td>
      <td className="border border-gray-300 px-4 py-2">
        {links.map((link) => (
          <a
            className="block"
            href={link}
            key={link}
            rel="noreferrer"
            target="_blank"
          >
            {link}
          </a>
        ))}
      </td>
      <td className="border border-gray-300 px-4 py-2">{notes}</td>
    </tr>
  );
}
