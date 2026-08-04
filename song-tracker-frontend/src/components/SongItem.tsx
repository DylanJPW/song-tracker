import {useMutation} from '@tanstack/react-query'
import {toast} from 'react-toastify'
import type {Song} from '@/api/schemas/SongSchema'
import {saveUserSong} from '@/api/userSongs'

export function SongItem({title, artist, album, imageUrl, spotifyId}: Song) {
  const saveSongMutation = useMutation({
    mutationFn: saveUserSong,
    onSuccess: data => {
      toast(`Saved ${data.song.title}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: 'light'
      })
    }
  })

  function onClick() {
    saveSongMutation.mutate(spotifyId as string)
  }

  return (
    <div className='flex grow flex-row gap-x-2 border-slate-400 border-b bg-slate-900 p-2'>
      <img alt={title} height={100} src={imageUrl} width={100}/>
      <div className='flex grow flex-col justify-between'>
        <div>
          <p>{title}</p>
          <p>{album}</p>
        </div>
        <p className=''>{artist}</p>
      </div>
      {/*<div className='flex items-center'>*/}
      {/*  <button*/}
      {/*    className='cursor-pointer rounded-sm bg-blue-500 p-2 text-center hover:bg-blue-400'*/}
      {/*    onClick={onClick}*/}
      {/*    type='button'*/}
      {/*  >*/}
      {/*    Want to learn*/}
      {/*  </button>*/}
      {/*</div>*/}
    </div>
  )
}