import {render, screen} from '@testing-library/react'
import {MemoryRouter} from 'react-router'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {buildSong, buildUserSong} from '@/test-fixtures'
import {UserSongList} from './UserSongList'

function renderUserSongList(userSongs = [buildUserSong()]) {
	return render(
		<MemoryRouter>
			<UserSongList userSongs={userSongs} />
		</MemoryRouter>
	)
}

function keyWarnings(calls: unknown[][]) {
	return calls
		.map(call => call.map(String).join(' '))
		.filter(message => message.includes('same key'))
}

describe('UserSongList', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('renders one list item per saved song', () => {
		renderUserSongList([
			buildUserSong({id: 10, song: buildSong({title: 'Song A'})}),
			buildUserSong({
				id: 11,
				song: buildSong({spotifyId: 'spotify-b', title: 'Song B'})
			})
		])

		expect(screen.getAllByRole('listitem')).toHaveLength(2)
		expect(screen.getByText('Song A')).toBeInTheDocument()
		expect(screen.getByText('Song B')).toBeInTheDocument()
	})

	it('renders an empty list rather than failing when there are no songs', () => {
		renderUserSongList([])

		expect(screen.queryAllByRole('listitem')).toHaveLength(0)
	})

	it('keys rows by id, so the same song on two albums does not collide', () => {
		const consoleError = vi
			.spyOn(console, 'error')
			.mockImplementation(() => undefined)

		renderUserSongList([
			buildUserSong({
				id: 10,
				song: buildSong({album: 'Album A', title: 'Song A'})
			}),
			buildUserSong({
				id: 11,
				song: buildSong({
					album: 'Album B',
					spotifyId: 'spotify-b',
					title: 'Song A'
				})
			})
		])

		expect(keyWarnings(consoleError.mock.calls)).toHaveLength(0)
		expect(screen.getAllByRole('listitem')).toHaveLength(2)
	})
})
