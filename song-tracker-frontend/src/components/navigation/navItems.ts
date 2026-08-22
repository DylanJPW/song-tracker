import type {IconType} from 'react-icons'
import {FiHome, FiMusic, FiSearch} from 'react-icons/fi'

export interface NavItem {
	end: boolean
	icon: IconType
	label: string
	to: string
}

export function getNavItems(isLoggedIn: boolean): NavItem[] {
	const items: NavItem[] = [
		{end: true, icon: FiHome, label: 'Home', to: '/'},
		{end: false, icon: FiSearch, label: 'Search', to: '/search'}
	]

	if (isLoggedIn) {
		items.push({end: false, icon: FiMusic, label: 'My Songs', to: '/songs'})
	}

	return items
}
