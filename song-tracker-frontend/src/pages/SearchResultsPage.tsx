import {useState} from 'react'
import type {Song, SpotifySong} from '@/api/schemas/SongSchema'
import {SearchBar} from '@/components/SearchBar'
import {SongList} from '@/components/songDisplay/SongList'

export function SearchResultsList() {
	const [searchResults, setSearchResults] = useState<SpotifySong[]>([])
	const mappedResults: Song[] = searchResults.map(song => ({
		...song,
		id: null as unknown as number
	}))
	return (
		<div className='flex flex-col items-center'>
			<SearchBar setSearchResults={setSearchResults} />
			{searchResults.length > 0 ? (
				<SongList songs={mappedResults} />
			) : (
				<p>Search for songs</p>
			)}
		</div>
	)
}
