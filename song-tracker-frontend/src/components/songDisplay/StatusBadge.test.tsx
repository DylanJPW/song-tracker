import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import type {SongStatus} from '@/api/schemas/UserSongSchema'
import {StatusBadge} from './StatusBadge'

const cases: [SongStatus, string][] = [
  ['WANT_TO_LEARN', 'Want to learn'],
  ['LEARNING', 'Learning'],
  ['LEARNED', 'Learned']
]

describe('StatusBadge', () => {
  it.each(cases)('renders %s as "%s"', (status, label) => {
    render(<StatusBadge status={status}/>)

    expect(screen.getByText(label)).toBeInTheDocument()
    expect(screen.queryByText(status)).not.toBeInTheDocument()
  })
})