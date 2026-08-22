import {afterEach, describe, expect, it, vi} from 'vitest'
import {getSearchResults, getSpotifySong} from '@/api/songs'
import {buildSpotifySong} from '@/test-fixtures'

function mockFetch(body: unknown, ok = true) {
	return vi.spyOn(globalThis, 'fetch').mockResolvedValue(
		new Response(JSON.stringify(body), {
			headers: {'Content-Type': 'application/json'},
			status: ok ? 200 : 500
		})
	)
}

describe('getSearchResults', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('encodes the query, so a slash in a band name does not break the URL', async () => {
		const fetchSpy = mockFetch([])

		await getSearchResults('AC/DC')

		expect(fetchSpy).toHaveBeenCalledWith(
			'/api/spotify/search?query=AC%2FDC',
			expect.anything()
		)
	})

	it('encodes ampersands and hashes too', async () => {
		const fetchSpy = mockFetch([])

		await getSearchResults('Florence + the Machine & co #1')

		expect(fetchSpy).toHaveBeenCalledWith(
			'/api/spotify/search?query=Florence%20%2B%20the%20Machine%20%26%20co%20%231',
			expect.anything()
		)
	})
})

describe('getSpotifySong', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('requests the track by its spotify id', async () => {
		const fetchSpy = mockFetch(buildSpotifySong())

		await getSpotifySong('spotify-a')

		expect(fetchSpy).toHaveBeenCalledWith(
			'/api/spotify/tracks/spotify-a',
			expect.anything()
		)
	})

	it('returns the parsed song', async () => {
		mockFetch(buildSpotifySong({title: 'Song A'}))

		const song = await getSpotifySong('spotify-a')

		expect(song.title).toBe('Song A')
		expect(song.spotifyId).toBe('spotify-a')
	})

	it('accepts a track with no album art', async () => {
		mockFetch(buildSpotifySong({imageUrl: null}))

		const song = await getSpotifySong('spotify-a')

		expect(song.imageUrl).toBeNull()
	})

	it('throws when the request fails, so the query surfaces an error state', async () => {
		mockFetch({}, false)

		await expect(getSpotifySong('spotify-a')).rejects.toThrow('Failed to fetch')
	})
})
