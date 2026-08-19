import {
  type SongStatus,
  songStatusLabels,
  songStatuses
} from '@/api/schemas/UserSongSchema'

const selectedStyles = 'bg-blue-500 text-white'
const unselectedStyles = 'bg-slate-700 text-slate-200 hover:bg-slate-600'

interface StatusControlProps {
  isPending: boolean
  onChange: (status: SongStatus) => void
  status: SongStatus
}

export function StatusControl({isPending, onChange, status}: StatusControlProps) {
  return (
    <fieldset
      className='flex flex-col gap-y-2 disabled:opacity-60'
      disabled={isPending}
    >
      <legend className='font-medium text-sm'>Status</legend>
      <div className='flex flex-row flex-wrap gap-2'>
        {songStatuses.map(option => (
          <button
            aria-pressed={option === status}
            className={`cursor-pointer rounded-full px-3 py-1 text-sm ${option === status ? selectedStyles : unselectedStyles}`}
            key={option}
            onClick={() => onChange(option)}
            type='button'
          >
            {songStatusLabels[option]}
          </button>
        ))}
      </div>
    </fieldset>
  )
}