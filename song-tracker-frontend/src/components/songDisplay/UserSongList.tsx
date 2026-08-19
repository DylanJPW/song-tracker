import type {UserSong} from '@/api/schemas/UserSongSchema'
import {UserSongItem} from '@/components/songDisplay/UserSongItem'

interface UserSongListProps {
  userSongs: UserSong[]
}

export function UserSongList({userSongs}: UserSongListProps) {
  return (
    <ul className='flex w-full flex-col'>
      {userSongs.map(userSong => (
        <li key={userSong.id}>
          <UserSongItem userSong={userSong}/>
        </li>
      ))}
    </ul>
  )
}