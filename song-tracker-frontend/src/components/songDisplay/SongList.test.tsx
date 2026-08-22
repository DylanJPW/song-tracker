import {render, screen} from '@testing-library/react'
import {MemoryRouter} from 'react-router'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {buildSong} from '@/test-fixtures'
import {SongList} from './SongList'

function renderSongList(songs = [buildSong()]) {
	return render(
		<MemoryRouter>
			<SongList songs={songs} />
		</MemoryRouter>
	)
}

function keyWarnings(calls: unknown[][]) {
	return calls
		.map(call => call.map(String).join(' '))
		.filter(message => message.includes('same key'))
}

describe('SongList', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('renders one list item per song', () => {
		renderSongList([
			buildSong({id: 1, spotifyId: 'spotify-a', title: 'Song A'}),
			buildSong({id: 2, spotifyId: 'spotify-b', title: 'Song B'})
		])

		expect(screen.getAllByRole('listitem')).toHaveLength(2)
		expect(screen.getByText('Song A')).toBeInTheDocument()
		expect(screen.getByText('Song B')).toBeInTheDocument()
	})

	it('renders an empty list rather than failing when there are no songs', () => {
		renderSongList([])

		expect(screen.queryAllByRole('listitem')).toHaveLength(0)
	})

	it('gives search results distinct keys even though they share an id', () => {
		const consoleError = vi
			.spyOn(console, 'error')
			.mockImplementation(() => undefined)

		// Search results are cast to Song with no real id, so every row carries the same one.
		renderSongList([
			buildSong({id: 0, spotifyId: 'spotify-a', title: 'Song A'}),
			buildSong({id: 0, spotifyId: 'spotify-b', title: 'Song B'})
		])

		expect(keyWarnings(consoleError.mock.calls)).toHaveLength(0)
		expect(screen.getAllByRole('listitem')).toHaveLength(2)
	})
})
