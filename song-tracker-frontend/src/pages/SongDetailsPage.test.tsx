import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter, Route, Routes} from 'react-router'
import {toast} from 'react-toastify'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import type {UserSong} from '@/api/schemas/UserSongSchema'
import {getSpotifySong} from '@/api/songs'
import {getUserSongs, saveUserSong, updateUserSong} from '@/api/userSongs'
import {useAuth} from '@/context/AuthContext'
import {buildSong, buildSpotifySong, buildUserSong} from '@/test-fixtures'
import {SongDetailsPage} from './SongDetailsPage'

vi.mock('@/api/songs', () => ({
  getSpotifySong: vi.fn()
}))

vi.mock('@/api/userSongs', () => ({
  getUserSongs: vi.fn(),
  saveUserSong: vi.fn(),
  updateUserSong: vi.fn()
}))

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn()
}))

vi.mock('react-toastify', () => ({
  toast: {error: vi.fn(), success: vi.fn()}
}))

interface RenderOptions {
  isLoggedIn?: boolean
  path?: string
  state?: unknown
  userSongs?: UserSong[]
}

function renderSongDetailsPage({
                                 isLoggedIn = false,
                                 path = '/songs/spotify-a',
                                 state = null,
                                 userSongs = []
                               }: RenderOptions = {}) {
  vi.mocked(useAuth).mockReturnValue({
    authToken: isLoggedIn ? 'token' : null,
    isLoggedIn,
    login: vi.fn(),
    logout: vi.fn()
  })
  vi.mocked(getUserSongs).mockResolvedValue(userSongs)

  const queryClient = new QueryClient({
    defaultOptions: {queries: {retry: false}}
  })

  return {
    user: userEvent.setup(),
    ...render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[{pathname: path, state}]}>
          <Routes>
            <Route element={<SongDetailsPage/>} path='/songs/:spotifyId'/>
            <Route element={<SongDetailsPage/>} path='/songs'/>
            <Route element={<p>Log in page</p>} path='/login'/>
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }
}

describe('SongDetailsPage', () => {
  beforeEach(() => {
    // clearMocks only clears calls, not implementations - a mockRejectedValue
    // from one test would otherwise leak into the next.
    vi.resetAllMocks()
    vi.mocked(getSpotifySong).mockResolvedValue(buildSpotifySong())
  })

  describe('loading the song', () => {
    it('renders straight from router state without hitting the network', async () => {
      renderSongDetailsPage({state: {song: buildSong()}})

      expect(await screen.findByRole('heading', {level: 1, name: 'Song A'})).toBeInTheDocument()
      expect(screen.getByText('Album A')).toBeInTheDocument()
      expect(screen.getByText('Artist A')).toBeInTheDocument()
      expect(getSpotifySong).not.toHaveBeenCalled()
    })

    it('fetches the song on a cold load, when there is no router state', async () => {
      renderSongDetailsPage()

      expect(await screen.findByRole('heading', {level: 1, name: 'Song A'})).toBeInTheDocument()
      expect(getSpotifySong).toHaveBeenCalledWith('spotify-a')
    })

    it('ignores malformed router state and fetches instead of throwing', async () => {
      renderSongDetailsPage({state: {song: {title: 'Only a title'}}})

      expect(await screen.findByRole('heading', {level: 1, name: 'Song A'})).toBeInTheDocument()
      expect(getSpotifySong).toHaveBeenCalledWith('spotify-a')
    })

    it('shows the error rather than a blank page when the song cannot be loaded', async () => {
      vi.mocked(getSpotifySong).mockRejectedValue(new Error('Failed to fetch'))

      renderSongDetailsPage()

      expect(await screen.findByText('Failed to fetch')).toBeInTheDocument()
    })

    it('tells the user when the route has no spotify id', () => {
      renderSongDetailsPage({path: '/songs'})

      expect(screen.getByText('That song link is missing an id.')).toBeInTheDocument()
      expect(getSpotifySong).not.toHaveBeenCalled()
    })

    it('sets the document title from the song', async () => {
      renderSongDetailsPage({state: {song: buildSong()}})

      await waitFor(() => {
        expect(document.title).toBe('Song A - SongTracker')
      })
    })
  })

  describe('when logged out', () => {
    it('offers a link to log in instead of a save button', async () => {
      renderSongDetailsPage({state: {song: buildSong()}})

      expect(
        await screen.findByRole('link', {name: 'Log in to save this song'})
      ).toHaveAttribute('href', '/login')
      expect(screen.queryByRole('button', {name: 'Want to learn'})).not.toBeInTheDocument()
    })

    it('does not request the user library', async () => {
      renderSongDetailsPage({state: {song: buildSong()}})

      await screen.findByRole('link', {name: 'Log in to save this song'})

      expect(getUserSongs).not.toHaveBeenCalled()
    })
  })

  describe('when the song is not saved yet', () => {
    it('saves the song by its spotify id', async () => {
      vi.mocked(saveUserSong).mockResolvedValue(buildUserSong())

      const {user} = renderSongDetailsPage({
        isLoggedIn: true,
        state: {song: buildSong()}
      })

      await user.click(await screen.findByRole('button', {name: 'Want to learn'}))

      await waitFor(() => {
        expect(saveUserSong).toHaveBeenCalledWith('spotify-a')
      })
      expect(saveUserSong).toHaveBeenCalledTimes(1)
    })

    it('disables the button while the save is in flight, so a double click cannot save twice', async () => {
      vi.mocked(saveUserSong).mockReturnValue(new Promise<UserSong>(() => undefined))

      const {user} = renderSongDetailsPage({
        isLoggedIn: true,
        state: {song: buildSong()}
      })

      await user.click(await screen.findByRole('button', {name: 'Want to learn'}))

      const button = await screen.findByRole('button', {name: 'Saving...'})

      expect(button).toBeDisabled()

      await user.click(button)

      expect(saveUserSong).toHaveBeenCalledTimes(1)
    })

    it('tells the user when the save fails, instead of failing silently', async () => {
      vi.mocked(saveUserSong).mockRejectedValue(new Error('nope'))

      const {user} = renderSongDetailsPage({
        isLoggedIn: true,
        state: {song: buildSong()}
      })

      await user.click(await screen.findByRole('button', {name: 'Want to learn'}))

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Could not save that song. Try again.')
      })
    })

    it('shows no tracking details for a song that is not saved', async () => {
      renderSongDetailsPage({isLoggedIn: true, state: {song: buildSong()}})

      await screen.findByRole('button', {name: 'Want to learn'})

      expect(screen.queryByText('Capo')).not.toBeInTheDocument()
      expect(screen.queryByText('Difficulty')).not.toBeInTheDocument()
      expect(screen.queryByRole('group', {name: 'Status'})).not.toBeInTheDocument()
    })
  })

  describe('when the song is already saved', () => {
    const saved = buildUserSong({
      capo: 2,
      difficultyRating: 4,
      id: 10,
      song: buildSong(),
      status: 'LEARNING'
    })

    it('shows the status control set to the current status', async () => {
      renderSongDetailsPage({
        isLoggedIn: true,
        state: {song: buildSong()},
        userSongs: [saved]
      })

      expect(
        await screen.findByRole('button', {name: 'Learning', pressed: true})
      ).toBeInTheDocument()
      expect(screen.queryByRole('button', {name: 'Want to learn', pressed: true})).not.toBeInTheDocument()
      // The save affordance is gone: every 'Want to learn' on screen is now a status option.
      expect(screen.getByRole('group', {name: 'Status'})).toBeInTheDocument()
    })

    it('patches the saved song when another status is chosen', async () => {
      vi.mocked(updateUserSong).mockResolvedValue({...saved, status: 'LEARNED'})

      const {user} = renderSongDetailsPage({
        isLoggedIn: true,
        state: {song: buildSong()},
        userSongs: [saved]
      })

      await user.click(await screen.findByRole('button', {name: 'Learned'}))

      await waitFor(() => {
        expect(updateUserSong).toHaveBeenCalledWith({id: 10, status: 'LEARNED'})
      })
      expect(updateUserSong).toHaveBeenCalledTimes(1)
    })

    it('tells the user when the status change fails', async () => {
      vi.mocked(updateUserSong).mockRejectedValue(new Error('nope'))

      const {user} = renderSongDetailsPage({
        isLoggedIn: true,
        state: {song: buildSong()},
        userSongs: [saved]
      })

      await user.click(await screen.findByRole('button', {name: 'Learned'}))

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Could not update that song. Try again.')
      })
    })

    it('shows the tracking details the list rows cannot fit', async () => {
      renderSongDetailsPage({
        isLoggedIn: true,
        state: {song: buildSong()},
        userSongs: [saved]
      })

      expect(await screen.findByText('Capo')).toBeInTheDocument()
      expect(screen.getByText('Fret 2')).toBeInTheDocument()
      expect(screen.getByText('4 / 5')).toBeInTheDocument()
    })

    it('shows placeholders rather than blanks for details that are not set', async () => {
      renderSongDetailsPage({
        isLoggedIn: true,
        state: {song: buildSong()},
        userSongs: [
          buildUserSong({
            capo: null,
            difficultyRating: null,
          })
        ]
      })

      expect(await screen.findByText('Not set')).toBeInTheDocument()
      expect(screen.getByText('Not rated')).toBeInTheDocument()
    })
  })
})