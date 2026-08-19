import {render, screen} from '@testing-library/react'
import {MemoryRouter} from 'react-router'
import {describe, expect, it} from 'vitest'
import {buildUserSong} from '@/test-fixtures'
import {UserSongItem} from './UserSongItem'

function renderUserSongItem(userSong = buildUserSong()) {
  return render(
    <MemoryRouter>
      <UserSongItem userSong={userSong}/>
    </MemoryRouter>
  )
}

describe('UserSongItem', () => {
  it('renders the song information', () => {
    renderUserSongItem()

    expect(screen.getByText('Song A')).toBeInTheDocument()
    expect(screen.getByText('Album A')).toBeInTheDocument()
    expect(screen.getByText('Artist A')).toBeInTheDocument()
  })

  it('renders the tracking data the list is for', () => {
    renderUserSongItem(
      buildUserSong({capo: 2, difficultyRating: 3, status: 'LEARNING'})
    )

    expect(screen.getByText('Learning')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3/5')).toBeInTheDocument()
  })

  it('shows a dash rather than a blank when capo and difficulty are unset', () => {
    renderUserSongItem(buildUserSong({capo: null, difficultyRating: null}))

    expect(screen.getAllByText('—')).toHaveLength(2)
  })

  it('renders the human label for the status, not the raw enum', () => {
    renderUserSongItem(buildUserSong({status: 'WANT_TO_LEARN'}))

    expect(screen.getByText('Want to learn')).toBeInTheDocument()
    expect(screen.queryByText('WANT_TO_LEARN')).not.toBeInTheDocument()
  })

  it('links to the song details page', () => {
    renderUserSongItem()

    expect(screen.getByRole('link')).toHaveAttribute('href', '/songs/spotify-a')
  })
})