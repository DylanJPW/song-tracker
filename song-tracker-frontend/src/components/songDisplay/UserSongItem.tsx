import type {UserSong} from '@/api/schemas/UserSongSchema'
import {SongCard} from '@/components/songDisplay/SongCard'
import {SongRowLink} from '@/components/songDisplay/SongRowLink'
import {StatusBadge} from '@/components/songDisplay/StatusBadge'

interface UserSongItemProps {
	userSong: UserSong
}

export function UserSongItem({userSong}: UserSongItemProps) {
	const {capo, difficultyRating, song, status} = userSong

	return (
		<SongRowLink spotifyId={song.spotifyId} state={{song, status}}>
			<SongCard
				album={song.album}
				artist={song.artist}
				imageUrl={song.imageUrl}
				title={song.title}
			>
				<div className='flex shrink-0 flex-col items-end gap-y-2 pl-2 text-sm'>
					<StatusBadge status={status} />
					<dl className='flex gap-x-3 text-slate-400'>
						<div className='flex gap-x-1'>
							<dt>Capo</dt>
							<dd>{capo === null ? '—' : capo}</dd>
						</div>
						<div className='flex gap-x-1'>
							<dt>Difficulty</dt>
							<dd>
								{difficultyRating === null ? '—' : `${difficultyRating}/5`}
							</dd>
						</div>
					</dl>
				</div>
			</SongCard>
		</SongRowLink>
	)
}
