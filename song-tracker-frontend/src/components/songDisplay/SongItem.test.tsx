import {render, screen} from '@testing-library/react'
import {MemoryRouter} from 'react-router'
import {describe, expect, it} from 'vitest'
import {buildSong} from '@/test-fixtures'
import {SongItem} from './SongItem'

function renderSongItem(song = buildSong()) {
	return render(
		<MemoryRouter>
			<SongItem song={song} />
		</MemoryRouter>
	)
}

describe('SongItem', () => {
	it('renders the song information', () => {
		renderSongItem()

		expect(screen.getByText('Song A')).toBeInTheDocument()
		expect(screen.getByText('Album A')).toBeInTheDocument()
		expect(screen.getByText('Artist A')).toBeInTheDocument()
		expect(
			screen.getByRole('img', {name: 'Album art for Album A'})
		).toHaveAttribute('src', 'https://test.image/a.jpg')
	})

	it('links to the song details page', () => {
		renderSongItem()

		expect(screen.getByRole('link')).toHaveAttribute('href', '/songs/spotify-a')
	})

	it('is not a link when the song has no spotify id', () => {
		renderSongItem(buildSong({spotifyId: null}))

		expect(screen.queryByRole('link')).not.toBeInTheDocument()
		expect(screen.getByText('Song A')).toBeInTheDocument()
	})
})
