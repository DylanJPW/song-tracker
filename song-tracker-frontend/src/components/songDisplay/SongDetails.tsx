import {useMutation} from "@tanstack/react-query";
import {saveUserSong} from "@/api/userSongs";
import {toast} from "react-toastify";
import {useLocation} from "react-router";


export function SongDetails() {
  const location = useLocation();
  const {title, artist, album, imageUrl, spotifyId} = location.state?.song;
  const status = location.state?.status;
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
    <div className='flex flex-col items-center'>
      <div className='w-full flex justify-center'>
        <img alt={title} src={imageUrl}/>
      </div>
      <div className='flex flex-col items-center'>
        <div>
          <p>{title}</p>
          <p>{album}</p>
          <p>{artist}</p>
        </div>
        {
          status ?
            <div className='cursor-pointer rounded-sm bg-gray-500 p-2 text-center hover:bg-blue-400'>
              {status}
            </div>
            :
            <button
              className='cursor-pointer rounded-sm bg-blue-500 p-2 text-center hover:bg-blue-400'
              onClick={onClick}
              type='button'
            >
              Want to learn
            </button>
        }
      </div>
    </div>
  )
}