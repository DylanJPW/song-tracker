import type { MonthlyPractice } from "@/api/schemas/common";

interface TileProps {
  subtitle: string;
  value: string | number;
}

function Tile({ subtitle, value }: TileProps) {
  const songWording = value === 1 ? "Song" : "Songs";
  return (
    <div className="flex flex-col bg-surface rounded-sm p-4">
      <div className="flex flex-row items-baseline gap-x-3">
        <p className="text-6xl">{value}</p>
        <p>{songWording}</p>
      </div>
      <p>{subtitle}</p>
    </div>
  );
}

interface TileSectionProps {
  practisedInLast30Days: number;
  practisedThisMonth: MonthlyPractice;
  songCount: number;
}

export function TileSection({
  practisedInLast30Days,
  practisedThisMonth: { yearMonth, count },
  songCount,
}: TileSectionProps) {
  return (
    <div className="flex flex-row gap-4">
      <Tile subtitle="In last 30 days" value={practisedInLast30Days} />
      <Tile subtitle={`In ${yearMonth}`} value={count} />
      <Tile subtitle="In library" value={songCount} />
    </div>
  );
}