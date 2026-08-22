import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter, Route, Routes, useLocation} from 'react-router'
import {describe, expect, it} from 'vitest'
import {SongRowLink} from './SongRowLink'

function LocationStateProbe() {
	const location = useLocation()

	return <pre>{JSON.stringify(location.state)}</pre>
}

describe('SongRowLink', () => {
	it('links to the song details page for the spotify id', () => {
		render(
			<MemoryRouter>
				<SongRowLink spotifyId='spotify-a'>Row</SongRowLink>
			</MemoryRouter>
		)

		expect(screen.getByRole('link', {name: 'Row'})).toHaveAttribute(
			'href',
			'/songs/spotify-a'
		)
	})

	it('renders a plain row when there is no spotify id to link to', () => {
		render(
			<MemoryRouter>
				<SongRowLink spotifyId={null}>Row</SongRowLink>
			</MemoryRouter>
		)

		expect(screen.getByText('Row')).toBeInTheDocument()
		expect(screen.queryByRole('link')).not.toBeInTheDocument()
	})

	it('carries router state through to the details page', async () => {
		const user = userEvent.setup()

		render(
			<MemoryRouter initialEntries={['/']}>
				<Routes>
					<Route
						element={
							<SongRowLink spotifyId='spotify-a' state={{status: 'LEARNING'}}>
								Row
							</SongRowLink>
						}
						path='/'
					/>
					<Route element={<LocationStateProbe />} path='/songs/:spotifyId' />
				</Routes>
			</MemoryRouter>
		)

		await user.click(screen.getByRole('link', {name: 'Row'}))

		expect(screen.getByText('{"status":"LEARNING"}')).toBeInTheDocument()
	})
})
