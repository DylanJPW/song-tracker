import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter} from 'react-router'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {useAuth} from '@/context/AuthContext'
import {BottomNav} from './BottomNav'

vi.mock('@/context/AuthContext', () => ({useAuth: vi.fn()}))

function mockAuth(isLoggedIn: boolean, logout = vi.fn()) {
	vi.mocked(useAuth).mockReturnValue({
		authToken: isLoggedIn ? 'token' : null,
		isLoggedIn,
		login: vi.fn(),
		logout
	})

	return logout
}

function renderTabBar(initialEntry = '/') {
	return render(
		<MemoryRouter initialEntries={[initialEntry]}>
			<BottomNav />
		</MemoryRouter>
	)
}

describe('BottomNav', () => {
	beforeEach(() => {
		mockAuth(false)
	})

	it('shows the public tabs and a log in tab when logged out', () => {
		renderTabBar()

		expect(screen.getByRole('link', {name: 'Home'})).toBeInTheDocument()
		expect(screen.getByRole('link', {name: 'Search'})).toBeInTheDocument()
		expect(screen.getByRole('link', {name: 'Log in'})).toBeInTheDocument()
		expect(
			screen.queryByRole('link', {name: 'My Songs'})
		).not.toBeInTheDocument()
	})

	it('swaps in my songs and log out when logged in', () => {
		mockAuth(true)

		renderTabBar()

		expect(screen.getByRole('link', {name: 'My Songs'})).toBeInTheDocument()
		expect(screen.getByRole('button', {name: 'Log out'})).toBeInTheDocument()
		expect(screen.queryByRole('link', {name: 'Log in'})).not.toBeInTheDocument()
	})

	it('marks the tab for the current route as the current page', () => {
		renderTabBar('/search')

		expect(screen.getByRole('link', {name: 'Search'})).toHaveAttribute(
			'aria-current',
			'page'
		)
	})

	it('does not mark home as current on another route', () => {
		renderTabBar('/search')

		expect(screen.getByRole('link', {name: 'Home'})).not.toHaveAttribute(
			'aria-current'
		)
	})

	it('keeps my songs current while viewing a song details page', () => {
		mockAuth(true)

		renderTabBar('/songs/spotify-a')

		expect(screen.getByRole('link', {name: 'My Songs'})).toHaveAttribute(
			'aria-current',
			'page'
		)
	})

	it('logs the user out from the log out tab', async () => {
		const logout = mockAuth(true)
		const user = userEvent.setup()

		renderTabBar()

		await user.click(screen.getByRole('button', {name: 'Log out'}))

		expect(logout).toHaveBeenCalledTimes(1)
	})
})
