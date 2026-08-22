import {FiLogOut} from 'react-icons/fi'
import {Link, NavLink} from 'react-router'
import {useAuth} from '@/context/AuthContext'
import {getNavItems} from './navItems'

const linkBase = 'rounded-md px-3 py-2 font-medium text-sm transition-colors'
const linkInactive =
	'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
const linkActive =
	'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400'

function linkClassName({isActive}: {isActive: boolean}) {
	return `${linkBase} ${isActive ? linkActive : linkInactive}`
}

export function TopNav() {
	const {isLoggedIn, logout} = useAuth()

	return (
		<header className='sticky top-0 z-20 hidden border-gray-200 border-b bg-white md:block dark:border-gray-700 dark:bg-gray-900'>
			<div className='mx-auto flex max-w-5xl items-center justify-between gap-x-6 px-4 py-3'>
				<Link className='font-bold text-lg' to='/'>
					SongTracker
				</Link>
				<nav aria-label='Primary'>
					<ul className='flex items-center gap-x-1'>
						{getNavItems(isLoggedIn).map(({end, label, to}) => (
							<li key={to}>
								<NavLink className={linkClassName} end={end} to={to}>
									{label}
								</NavLink>
							</li>
						))}
					</ul>
				</nav>
				{isLoggedIn ? (
					<button
						className={`${linkBase} ${linkInactive} flex items-center gap-x-2`}
						onClick={() => logout()}
						type='button'
					>
						<FiLogOut aria-hidden={true} />
						Log out
					</button>
				) : (
					<NavLink className={linkClassName} to='/login'>
						Log in
					</NavLink>
				)}
			</div>
		</header>
	)
}
