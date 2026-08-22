import {FiLogIn, FiLogOut} from 'react-icons/fi'
import {NavLink} from 'react-router'
import {useAuth} from '@/context/AuthContext'
import {getNavItems} from './navItems'

const tabBase =
	'flex min-h-14 w-full flex-col items-center justify-center gap-y-0.5 rounded-2xl text-xs transition-colors'
const tabInactive = 'text-gray-600 dark:text-gray-300'
const tabActive =
	'bg-amber-50 font-semibold text-amber-600 dark:bg-amber-950 dark:text-amber-400'

function tabClassName({isActive}: {isActive: boolean}) {
	return `${tabBase} ${isActive ? tabActive : tabInactive}`
}

export function BottomNav() {
	const {isLoggedIn, logout} = useAuth()

	return (
		<nav
			aria-label='Primary'
			className='fixed inset-x-0 bottom-0 z-20 pb-[env(safe-area-inset-bottom)] md:hidden'
		>
			<ul className='mx-4 mb-3 flex items-stretch justify-around gap-x-1 rounded-2xl border border-gray-200 bg-white/90 p-1 shadow-lg backdrop-blur dark:border-gray-700 dark:bg-gray-900/90'>
				{getNavItems(isLoggedIn).map(({end, icon: Icon, label, to}) => (
					<li className='flex-1' key={to}>
						<NavLink className={tabClassName} end={end} to={to}>
							<Icon aria-hidden={true} className='size-5' />
							{label}
						</NavLink>
					</li>
				))}
				<li className='flex-1'>
					{isLoggedIn ? (
						<button
							className={`${tabBase} ${tabInactive}`}
							onClick={() => logout()}
							type='button'
						>
							<FiLogOut aria-hidden={true} className='size-5' />
							Log out
						</button>
					) : (
						<NavLink className={tabClassName} to='/login'>
							<FiLogIn aria-hidden={true} className='size-5' />
							Log in
						</NavLink>
					)}
				</li>
			</ul>
		</nav>
	)
}
