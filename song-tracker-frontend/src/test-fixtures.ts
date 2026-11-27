import type { Song, SpotifySong } from "@/api/schemas/SongSchema";
import type {
  DashboardUserSongs,
  UserSong,
} from "@/api/schemas/UserSongSchema";

export function buildSong(overrides: Partial<Song> = {}): Song {
  return {
    album: "Album A",
    artist: "Artist A",
    id: 1,
    imageUrl: "https://test.image/a.jpg",
    spotifyId: "spotify-a",
    title: "Song A",
    ...overrides,
  };
}

export function buildUserSong(overrides: Partial<UserSong> = {}): UserSong {
  return {
    capo: 2,
    difficultyRating: 3,
    id: 10,
    song: buildSong(),
    status: "WANT_TO_LEARN",
    dateAdded: new Date(),
    lastPractised: null,
    ...overrides,
  };
}

export function buildSpotifySong(
  overrides: Partial<SpotifySong> = {},
): SpotifySong {
  return {
    album: "Album A",
    artist: "Artist A",
    imageUrl: "https://test.image/a.jpg",
    spotifyId: "spotify-a",
    title: "Song A",
    ...overrides,
  };
}

export function buildDashboard(
  overrides: Partial<DashboardUserSongs> = {},
): DashboardUserSongs {
  return {
    mostRecentlyPractised: null,
    newlyAdded: null,
    oldestPractised: null,
    practisedInLast30Days: 0,
    practisedThisMonth: { count: 0, yearMonth: "November" },
    songCount: 0,
    ...overrides,
  };
}