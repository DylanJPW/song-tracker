import type {Song} from '@/api/schemas/SongSchema'

export function SongItem({title, artist, album, imageUrl}: Song) {


  return (
    <div className='flex grow flex-row gap-x-2 border-slate-400 border-b bg-slate-900 p-2'>
      <img alt={title} height={100} src={imageUrl} width={100}/>
      <div className='flex grow flex-col justify-between'>
        <div>
          <p className='line-clamp-1' title={title}>{title}</p>
          <p className='line-clamp-1' title={album}>{album}</p>
        </div>
        <p className=''>{artist}</p>
      </div>
    </div>
  )
}