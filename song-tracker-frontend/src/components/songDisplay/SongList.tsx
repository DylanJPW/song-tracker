import type {Song} from '@/api/schemas/SongSchema'
import {SongItem} from '@/components/songDisplay/SongItem'

interface SongListProps {
  songs: Song[]
}

export function SongList({songs}: SongListProps) {
  return (
    <ul className='flex w-full max-w-2xl flex-col'>
      {songs.map(song => (
        <li key={song.spotifyId ?? song.id}>
          <SongItem song={song}/>
        </li>
      ))}
    </ul>
  )
}