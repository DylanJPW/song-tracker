import {useSuspenseQuery} from '@tanstack/react-query'
import {
  type SongStatus,
  type UserSong,
  songStatusLabels,
  songStatuses
} from '@/api/schemas/UserSongSchema'
import {getUserSongs} from '@/api/userSongs'
import {UserSongList} from '@/components/songDisplay/UserSongList'

function groupByStatus(userSongs: UserSong[]): Record<SongStatus, UserSong[]> {
  const grouped: Record<SongStatus, UserSong[]> = {
    LEARNED: [],
    LEARNING: [],
    WANT_TO_LEARN: []
  }

  for (const userSong of userSongs) {
    grouped[userSong.status].push(userSong)
  }

  return grouped
}

export function MySongsPage() {
  const {data: userSongs} = useSuspenseQuery({
    queryFn: getUserSongs,
    queryKey: ['userSongs']
  })

  if (userSongs.length === 0) {
    return <p className='mt-50 flex flex-col items-center text-2xl'>No songs added</p>
  }

  const grouped = groupByStatus(userSongs)

  return (
    <div className='flex flex-col items-center gap-y-8 p-4'>
      {songStatuses.map(status => (
        <section className='w-full max-w-2xl' key={status}>
          <h2 className='mb-2 flex items-baseline gap-x-2 font-bold text-lg'>
            {songStatusLabels[status]}
            <span className='font-normal text-slate-400 text-sm'>{grouped[status].length}</span>
          </h2>
          {grouped[status].length === 0 ? (
            <p className='text-slate-400 text-sm'>Nothing here yet.</p>
          ) : (
            <UserSongList userSongs={grouped[status]}/>
          )}
        </section>
      ))}
    </div>
  )
}