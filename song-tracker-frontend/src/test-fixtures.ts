import type {Song} from '@/api/schemas/SongSchema'
import type {UserSong} from '@/api/schemas/UserSongSchema'

export function buildSong(overrides: Partial<Song> = {}): Song {
  return {
    album: 'Album A',
    artist: 'Artist A',
    id: 1,
    imageUrl: 'https://test.image/a.jpg',
    spotifyId: 'spotify-a',
    title: 'Song A',
    ...overrides
  }
}

export function buildUserSong(overrides: Partial<UserSong> = {}): UserSong {
  return {
    capo: 2,
    difficultyRating: 3,
    id: 10,
    song: buildSong(),
    status: 'WANT_TO_LEARN',
    ...overrides
  }
}