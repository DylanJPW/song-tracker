import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter} from 'react-router'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {useAuth} from '@/context/AuthContext'
import {TopNav} from './TopNav'

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

function renderTopNav(initialEntry = '/') {
	return render(
		<MemoryRouter initialEntries={[initialEntry]}>
			<TopNav />
		</MemoryRouter>
	)
}

describe('TopNav', () => {
	beforeEach(() => {
		mockAuth(false)
	})

	it('renders the brand and the public destinations', () => {
		renderTopNav()

		expect(screen.getByRole('link', {name: 'SongTracker'})).toHaveAttribute(
			'href',
			'/'
		)
		expect(screen.getByRole('link', {name: 'Home'})).toBeInTheDocument()
		expect(screen.getByRole('link', {name: 'Search'})).toBeInTheDocument()
		expect(screen.getByRole('link', {name: 'Log in'})).toBeInTheDocument()
	})

	it('marks the current destination as the current page', () => {
		renderTopNav('/search')

		expect(screen.getByRole('link', {name: 'Search'})).toHaveAttribute(
			'aria-current',
			'page'
		)
		expect(screen.getByRole('link', {name: 'Home'})).not.toHaveAttribute(
			'aria-current'
		)
	})

	it('logs the user out from the log out button', async () => {
		const logout = mockAuth(true)
		const user = userEvent.setup()

		renderTopNav()

		expect(screen.getByRole('link', {name: 'My Songs'})).toBeInTheDocument()

		await user.click(screen.getByRole('button', {name: 'Log out'}))

		expect(logout).toHaveBeenCalledTimes(1)
	})
})
