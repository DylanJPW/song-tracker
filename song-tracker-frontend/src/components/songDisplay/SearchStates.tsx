import type { ReactNode } from "react";

const SKELETON_ROWS = ["s1", "s2", "s3", "s4", "s5"];

export function SongListSkeleton() {
  return (
    <ul
      aria-hidden={true}
      className="w-full divide-y divide-line border-line border-y"
    >
      {SKELETON_ROWS.map((row) => (
        <li className="flex animate-pulse items-center gap-x-3 p-3" key={row}>
          <div className="size-25 shrink-0 rounded-sm bg-surface-hover" />
          <div className="flex min-w-0 grow flex-col gap-y-2">
            <div className="h-4 w-1/2 rounded bg-surface-hover" />
            <div className="h-3 w-1/3 rounded bg-surface-hover" />
            <div className="h-3 w-2/5 rounded bg-surface-hover" />
          </div>
        </li>
      ))}
    </ul>
  );
}

interface EmptyStateProps {
  action?: ReactNode;
  body: string;
  icon: ReactNode;
  title: string;
}

export function EmptyState({ action, body, icon, title }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-y-3 py-16 text-center">
      <span aria-hidden={true} className="text-muted [&>svg]:size-10">
        {icon}
      </span>
      <p className="font-medium">{title}</p>
      <p className="max-w-sm text-muted text-sm">{body}</p>
      {action}
    </div>
  );
}