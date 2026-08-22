import {fireEvent, render, screen} from '@testing-library/react'
import {MemoryRouter} from 'react-router'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {useAuth} from '@/context/AuthContext'
import {Navbar} from './Navbar'

vi.mock('@/context/AuthContext', () => ({
	useAuth: vi.fn()
}))

describe('Navbar', () => {
	const renderNavbar = (initialEntry = '/') =>
		render(
			<MemoryRouter initialEntries={[initialEntry]}>
				<Navbar />
			</MemoryRouter>
		)

	const getMenuButton = () =>
		screen.getByRole('button', {name: /navigation menu/iu})

	beforeEach(() => {
		vi.mocked(useAuth).mockReturnValue({
			authToken: null,
			isLoggedIn: false,
			login: vi.fn(),
			logout: vi.fn()
		})
	})

	it('renders the app name and navigation links', () => {
		renderNavbar()

		expect(screen.getByText('SongTracker')).toBeInTheDocument()
		expect(screen.getByRole('link', {name: 'HOME'})).toBeInTheDocument()
		expect(screen.getByRole('link', {name: 'SEARCH'})).toBeInTheDocument()
		expect(screen.getByRole('link', {name: 'LOG IN'})).toBeInTheDocument()
	})

	it('marks the current page as active', () => {
		renderNavbar('/search')

		const searchLink = screen.getByRole('link', {name: 'SEARCH'})

		expect(searchLink).toHaveAttribute('href', '/search')
		expect(searchLink).toHaveAttribute('aria-current', 'page')
	})

	it('does not mark home as active on another route', () => {
		renderNavbar('/search')

		expect(screen.getByRole('link', {name: 'HOME'})).not.toHaveAttribute(
			'aria-current'
		)
	})

	it('renders the log out button when the user is logged in', () => {
		vi.mocked(useAuth).mockReturnValue({
			authToken: 'token',
			isLoggedIn: true,
			login: vi.fn(),
			logout: vi.fn()
		})

		renderNavbar()

		expect(screen.getByRole('button', {name: 'LOG OUT'})).toBeInTheDocument()
	})

	it('calls logout when the log out button is clicked', () => {
		const logout = vi.fn()

		vi.mocked(useAuth).mockReturnValue({
			authToken: 'token',
			isLoggedIn: true,
			login: vi.fn(),
			logout
		})

		renderNavbar()

		fireEvent.click(screen.getByRole('button', {name: 'LOG OUT'}))

		expect(logout).toHaveBeenCalledTimes(1)
	})

	it('reports the mobile menu state through aria-expanded', () => {
		renderNavbar()

		const button = getMenuButton()

		expect(button).toHaveAttribute('aria-controls', 'navbar-menu')
		expect(button).toHaveAttribute('aria-expanded', 'false')

		fireEvent.click(button)
		expect(button).toHaveAttribute('aria-expanded', 'true')

		fireEvent.click(button)
		expect(button).toHaveAttribute('aria-expanded', 'false')
	})

	it('closes the mobile menu after following a link', () => {
		renderNavbar()

		const button = getMenuButton()

		fireEvent.click(button)
		expect(button).toHaveAttribute('aria-expanded', 'true')

		fireEvent.click(screen.getByRole('link', {name: 'SEARCH'}))

		expect(button).toHaveAttribute('aria-expanded', 'false')
	})

	it('closes the mobile menu when escape is pressed', () => {
		renderNavbar()

		const button = getMenuButton()

		fireEvent.click(button)
		expect(button).toHaveAttribute('aria-expanded', 'true')

		fireEvent.keyDown(globalThis.document, {key: 'Escape'})

		expect(button).toHaveAttribute('aria-expanded', 'false')
	})
})
