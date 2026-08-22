import {useEffect, useState} from 'react'
import {CgClose} from 'react-icons/cg'
import {RxHamburgerMenu} from 'react-icons/rx'
import {Link, NavLink} from 'react-router'
import {useAuth} from '@/context/AuthContext'
import {LogoutButton} from './LogoutButton'

const menuId = 'navbar-menu'

interface NavItemProps {
	name: string
	link: string
	end?: boolean
	onNavigate: () => void
}

function NavItem({name, link, end=false, onNavigate}: NavItemProps) {
	return (
		<NavLink
			className={({isActive}) =>
				`flex hover:text-gray-500 ${isActive ? 'text-amber-600' : ''}`
			}
			end={end}
			onClick={onNavigate}
			to={link}
		>
			{name}
		</NavLink>
	)
}

export function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

	const {isLoggedIn, logout} = useAuth()

	function closeMenu() {
		setIsMenuOpen(false)
	}

	function handleLogout() {
		closeMenu()
		logout()
	}

	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				setIsMenuOpen(false)
			}
		}

		globalThis.document.addEventListener('keydown', onKeyDown)

		return () => {
			globalThis.document.removeEventListener('keydown', onKeyDown)
		}
	}, [])

	return (
		<div className='sticky top-0 z-10 flex w-auto flex-col items-start gap-x-4 border-b border-b-gray-200 bg-white p-4 font-bold md:flex-row md:items-center md:justify-between dark:border-b-gray-700 dark:bg-gray-900'>
			<div className='flex w-full flex-row justify-between text-lg'>
				<Link to='/'>SongTracker</Link>
				<button
					aria-controls={menuId}
					aria-expanded={isMenuOpen}
					aria-label={
						isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
					}
					className='md:hidden'
					id='navbar-hamburger-button'
					onClick={() => setIsMenuOpen(!isMenuOpen)}
					type='button'
				>
					{isMenuOpen ? <CgClose /> : <RxHamburgerMenu />}
				</button>
			</div>
			<div
				className={`${isMenuOpen ? 'flex' : 'hidden'} flex-col gap-12 pt-12 pb-4 text-sm md:flex md:flex-row md:gap-4 md:p-0`}
				id={menuId}
			>
				<NavItem end={true} link='/' name='HOME' onNavigate={closeMenu} />
				<NavItem link='/search' name='SEARCH' onNavigate={closeMenu} />
				{isLoggedIn ? (
					<>
						<NavItem link='/songs' name='MY SONGS' onNavigate={closeMenu} />
						<LogoutButton logout={handleLogout} />
					</>
				) : (
					<NavItem link='/login' name='LOG IN' onNavigate={closeMenu} />
				)}
			</div>
		</div>
	)
}
