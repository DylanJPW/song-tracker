import type { MonthlyPractice } from "@/api/schemas/common";

interface TileProps {
  subtitle: string;
  value: string | number;
}

function Tile({ subtitle, value }: TileProps) {
  return (
    <div className="flex flex-col bg-surface rounded-sm p-4">
      <div className="flex flex-row items-baseline gap-x-3">
        <p className="text-6xl">{value}</p>
        <p>Song</p>
      </div>
      <p>{subtitle}</p>
    </div>
  );
}

interface TileSectionProps {
  practisedInLast30Days: number;
  practisedThisMonth: MonthlyPractice;
}

export function TileSection({
  practisedInLast30Days,
  practisedThisMonth: { yearMonth, count },
}: TileSectionProps) {
  return (
    <div className="flex flex-row gap-4">
      <Tile subtitle="In last 30 days" value={practisedInLast30Days} />
      <Tile subtitle="In last 30 days" value={practisedInLast30Days} />
      <Tile subtitle={`In ${yearMonth}`} value={count} />
    </div>
  );
}