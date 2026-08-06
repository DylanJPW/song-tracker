import type {Song} from "@/api/schemas/SongSchema";
import {useMutation} from "@tanstack/react-query";
import {saveUserSong} from "@/api/userSongs";
import {toast} from "react-toastify";

export function SongPage({title, artist, album, imageUrl, spotifyId}: Song) {
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
    <div className=''>
      <div></div>
      <div className='flex items-center'>
        <button
          className='cursor-pointer rounded-sm bg-blue-500 p-2 text-center hover:bg-blue-400'
          onClick={onClick}
          type='button'
        >
          Want to learn
        </button>
      </div>
    </div>
  )
}