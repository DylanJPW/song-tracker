import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {render, screen} from '@testing-library/react'
import {Suspense} from 'react'
import {MemoryRouter} from 'react-router'
import {describe, expect, it, vi} from 'vitest'
import type {UserSong} from '@/api/schemas/UserSongSchema'
import {getUserSongs} from '@/api/userSongs'
import {buildSong, buildUserSong} from '@/test-fixtures'
import {MySongsPage} from './MySongsPage'

vi.mock('@/api/userSongs', () => ({
	getUserSongs: vi.fn()
}))

function renderMySongsPage(userSongs: UserSong[]) {
	vi.mocked(getUserSongs).mockResolvedValue(userSongs)

	const queryClient = new QueryClient({
		defaultOptions: {queries: {retry: false}}
	})

	render(
		<QueryClientProvider client={queryClient}>
			<MemoryRouter>
				<Suspense fallback='Loading'>
					<MySongsPage />
				</Suspense>
			</MemoryRouter>
		</QueryClientProvider>
	)
}

describe('MySongsPage', () => {
	it('tells the user when they have not saved anything', async () => {
		renderMySongsPage([])

		expect(await screen.findByText('No songs added')).toBeInTheDocument()
		expect(screen.queryAllByRole('heading', {level: 2})).toHaveLength(0)
	})

	it('renders a section for every status, in learning order', async () => {
		renderMySongsPage([buildUserSong()])

		await screen.findByRole('heading', {level: 2, name: /want to learn/iu})

		const headings = screen.getAllByRole('heading', {level: 2})

		expect(headings.map(heading => heading.textContent)).toEqual([
			expect.stringContaining('Want to learn'),
			expect.stringContaining('Learning'),
			expect.stringContaining('Learned')
		])
	})

	it('counts the songs in each section', async () => {
		renderMySongsPage([
			buildUserSong({id: 10, status: 'WANT_TO_LEARN'}),
			buildUserSong({
				id: 11,
				song: buildSong({spotifyId: 'spotify-b'}),
				status: 'WANT_TO_LEARN'
			})
		])

		expect(
			await screen.findByRole('heading', {level: 2, name: /want to learn/iu})
		).toHaveTextContent('2')
		expect(
			screen.getByRole('heading', {level: 2, name: /learned/iu})
		).toHaveTextContent('0')
	})

	it('puts each song under its own status, in section order', async () => {
		renderMySongsPage([
			buildUserSong({
				id: 10,
				song: buildSong({title: 'Wanted'}),
				status: 'WANT_TO_LEARN'
			}),
			buildUserSong({
				id: 11,
				song: buildSong({spotifyId: 'spotify-b', title: 'In progress'}),
				status: 'LEARNING'
			}),
			buildUserSong({
				id: 12,
				song: buildSong({spotifyId: 'spotify-c', title: 'Done'}),
				status: 'LEARNED'
			})
		])

		await screen.findByRole('heading', {level: 2, name: /want to learn/iu})

		const rows = screen.getAllByRole('listitem')

		expect(rows.map(row => row.textContent)).toEqual([
			expect.stringContaining('Wanted'),
			expect.stringContaining('In progress'),
			expect.stringContaining('Done')
		])
	})

	it('shows an empty message for a status with no songs', async () => {
		renderMySongsPage([buildUserSong({status: 'LEARNED'})])

		await screen.findByRole('heading', {level: 2, name: /want to learn/iu})

		expect(screen.getAllByText('Nothing here yet.')).toHaveLength(2)
	})
})
