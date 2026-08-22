export function LogoutButton({logout}: {logout: () => void}) {
	return (
		<button
			className='d-flex cursor-pointer text-start'
			onClick={() => logout()}
			type='button'
		>
			LOG OUT
		</button>
	)
}
