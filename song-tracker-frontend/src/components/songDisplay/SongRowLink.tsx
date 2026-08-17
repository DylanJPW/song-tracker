import type {ReactNode} from 'react'
import {Link} from 'react-router'

interface SongRowLinkProps {
  children: ReactNode
  spotifyId: string | null
  state?: unknown
}

export function SongRowLink({children, spotifyId, state}: SongRowLinkProps) {
  if (spotifyId === null) {
    return <div>{children}</div>
  }

  return (
    <Link
      className='group block focus-visible:outline-2 focus-visible:outline-blue-400'
      state={state}
      to={`/songs/${spotifyId}`}
    >
      {children}
    </Link>
  )
}