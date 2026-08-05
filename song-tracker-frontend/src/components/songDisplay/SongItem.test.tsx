import {render, screen, fireEvent} from '@testing-library/react'
import {describe, expect, it, vi, beforeEach} from 'vitest'
import {useMutation} from '@tanstack/react-query'
import {SongItem} from './SongItem'

vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(),
}))

vi.mock('react-toastify', () => ({
  toast: vi.fn(),
}))

vi.mock('@/api/userSongs', () => ({
  saveUserSong: vi.fn(),
}))

describe('SongItem', () => {
  const mutate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useMutation).mockReturnValue({
      mutate,
    } as any)
  })

  it('renders song information', () => {
    render(
      <table>
        <tbody>
        <SongItem
          album="Song Album"
          artist="Artist"
          id={0}
          imageUrl="https://test.image"
          spotifyId="spotify-id"
          title="Song Name"
        />
        </tbody>
      </table>
    )

    expect(screen.getByText('Song Name - Song Album')).toBeInTheDocument()
    expect(screen.getByText('Artist')).toBeInTheDocument()
    expect(
      screen.getByRole('img', {name: 'Song Name'})
    ).toHaveAttribute('src', 'https://test.image')
    expect(
      screen.getByRole('button', {name: 'Want to learn'})
    ).toBeInTheDocument()
  })

  it('calls mutate with the spotify id when button is clicked', () => {
    render(
      <table>
        <tbody>
        <SongItem
          album="Song Album"
          artist="Artist"
          id={0}
          imageUrl="https://test.image"
          spotifyId="spotify-id"
          title="Song Name"
        />
        </tbody>
      </table>
    )

    fireEvent.click(screen.getByRole('button', {name: 'Want to learn'}))

    expect(mutate).toHaveBeenCalledTimes(1)
    expect(mutate).toHaveBeenCalledWith('spotify-id')
  })
})