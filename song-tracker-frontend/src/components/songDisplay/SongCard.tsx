import type {ReactNode} from 'react'
import {MdMusicNote} from 'react-icons/md'

const ART_SIZE = 100

interface AlbumArtProps {
  album: string
  imageUrl: string | null
}

function AlbumArt({album, imageUrl}: AlbumArtProps) {
  if (imageUrl === null) {
    return (
      <div
        aria-hidden={true}
        className='flex size-25 shrink-0 items-center justify-center rounded-sm bg-slate-700 text-slate-400'
      >
        <MdMusicNote size={32}/>
      </div>
    )
  }

  return (
    <img
      alt={`Album art for ${album}`}
      className='size-25 shrink-0 rounded-sm object-cover'
      height={ART_SIZE}
      loading='lazy'
      src={imageUrl}
      width={ART_SIZE}
    />
  )
}

interface SongCardProps {
  album: string
  artist: string
  children?: ReactNode
  imageUrl: string | null
  title: string
}

export function SongCard({album, artist, children, imageUrl, title}: SongCardProps) {
  return (
    <div
      className='flex grow flex-row items-center gap-x-3 border-slate-400 border-b bg-slate-900 p-2 group-hover:bg-slate-800'>
      <AlbumArt album={album} imageUrl={imageUrl}/>
      <div className='flex min-w-0 grow flex-col gap-y-1'>
        <p className='line-clamp-1 font-medium' title={title}>
          {title}
        </p>
        <p className='line-clamp-1 text-slate-400 text-sm' title={album}>
          {album}
        </p>
        <p className='line-clamp-1 text-sm' title={artist}>
          {artist}
        </p>
      </div>
      {children}
    </div>
  )
}