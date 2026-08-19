import {type SongStatus, songStatusLabels} from '@/api/schemas/UserSongSchema'

const statusStyles: Record<SongStatus, string> = {
  LEARNED: 'bg-green-900 text-green-200',
  LEARNING: 'bg-amber-900 text-amber-200',
  WANT_TO_LEARN: 'bg-slate-700 text-slate-200'
}

interface StatusBadgeProps {
  status: SongStatus
}

export function StatusBadge({status}: StatusBadgeProps) {
  return (
    <span className={`rounded-full px-2 py-0.5 font-medium text-xs ${statusStyles[status]}`}>
			{songStatusLabels[status]}
		</span>
  )
}