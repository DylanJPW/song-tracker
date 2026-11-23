interface TileProps {
  title: string;
  value: string | number;
}

function Tile({ title, value }: TileProps) {
  return (
    <div className="flex flex-col bg-dark border border-slate-400 rounded-sm p-4">
      <h2>{title}</h2>
      <p>{value}</p>
    </div>
  );
}

interface TileSectionProps {
  practisedInLast30Days: number;
}

export function TileSection({ practisedInLast30Days }: TileSectionProps) {
  return (
    <div className="flex flex-row gap-4">
      <Tile title="Practised in last 30 days" value={practisedInLast30Days} />
      <Tile title="Practised in last 30 days" value={practisedInLast30Days} />
      <Tile title="Practised in last 30 days" value={practisedInLast30Days} />
    </div>
  );
}