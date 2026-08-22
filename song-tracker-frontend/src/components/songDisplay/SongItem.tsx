import type {Song} from '@/api/schemas/SongSchema'
import {SongCard} from '@/components/songDisplay/SongCard'
import {SongRowLink} from '@/components/songDisplay/SongRowLink'

interface SongItemProps {
	song: Song
}

export function SongItem({song}: SongItemProps) {
	const {album, artist, imageUrl, spotifyId, title} = song

	return (
		<SongRowLink spotifyId={spotifyId} state={{song}}>
			<SongCard
				album={album}
				artist={artist}
				imageUrl={imageUrl}
				title={title}
			/>
		</SongRowLink>
	)
}
