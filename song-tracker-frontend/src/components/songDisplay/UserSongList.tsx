import type {UserSong} from '@/api/schemas/UserSongSchema'
import {UserSongItem} from './UserSongItem'

interface UserSongListProps {
  songs: UserSong[]
}

export function UserSongList({songs}: UserSongListProps) {
  return (
    <div className="flex flex-col place-content-center">
      {songs.map(({song, capo, difficultyRating, status}) => (
        <UserSongItem
          capo={capo}
          difficultyRating={difficultyRating}
          key={`${song.title}-${song.artist}`}
          song={song}
          status={status}
        />
      ))}
    </div>
  )
}