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
		<tr className='font-medium'>
			<td className='border border-gray-300 px-4 py-2'>
				<img alt={title} height={100} src={imageUrl} width={100} />
			</td>
			<td className='border border-gray-300 px-4 py-2'>
				<p>
					{title} - {album}
				</p>
			</td>
			<td className='border border-gray-300 px-4 py-2'>{artist}</td>
			<td className='border border-gray-300 px-4 py-2'>
				<button
					className='cursor-pointer rounded-sm bg-blue-500 p-2 text-center hover:bg-blue-400'
					onClick={onClick}
					type='button'
				>
					Want to learn
				</button>
			</td>
		</tr>
	)
}