import type {UserSong} from '@/api/schemas/UserSongSchema'
import {UserSongItem} from './UserSongItem'

interface UserSongListProps {
  songs: UserSong[]
}

export function UserSongList({songs}: UserSongListProps) {
  return (
    <div className='flex place-content-center'>
      <table>
        <thead>
        <tr>
          <th className='px-4 py-2'>Album Cover</th>
          <th className='px-4 py-2'>Title</th>
          <th className='px-4 py-2'>Artist</th>
          <th className='px-4 py-2'>Capo</th>
          <th className='px-4 py-2'>Difficulty</th>
          <th className='px-4 py-2'>Status</th>
        </tr>
        </thead>
        <tbody>
        {songs.map(({song, capo, difficultyRating, status}) => (
          <UserSongItem
            capo={capo}
            difficultyRating={difficultyRating}
            key={`${song.title}-${song.artist}`}
            song={song}
            status={status}
          />
        ))}
        </tbody>
      </table>
    </div>
  )
}