import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getDashboardUserSongs,
  getUserSongs,
  updateUserSong,
} from "@/api/userSongs";

const savedSongResponse = {
  capo: null,
  dateAdded: "2026-08-01T12:00:00.000Z",
  difficultyRating: null,
  id: 10,
  lastPractised: null,
  notes: null,
  song: {
    album: "Album A",
    artist: "Artist A",
    id: 1,
    imageUrl: "https://test.image/a.jpg",
    spotifyId: "spotify-a",
    title: "Song A",
  },
  status: "WANT_TO_LEARN",
};

function mockFetch(body: unknown, ok = true) {
  return vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(JSON.stringify(body), {
      headers: { "Content-Type": "application/json" },
      status: ok ? 200 : 500,
    }),
  );
}

describe("getUserSongs", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("turns the ISO date the API sends into a Date", async () => {
    mockFetch([savedSongResponse]);

    const [userSong] = await getUserSongs();

    expect(userSong?.dateAdded).toBeInstanceOf(Date);
    expect(userSong?.dateAdded?.toISOString()).toBe("2026-08-01T12:00:00.000Z");
  });

  it("turns lastPractised into a Date when the song has been practised", async () => {
    mockFetch([
      { ...savedSongResponse, lastPractised: "2026-11-20T09:30:00.000Z" },
    ]);

    const [userSong] = await getUserSongs();

    expect(userSong?.lastPractised).toBeInstanceOf(Date);
    expect(userSong?.lastPractised?.toISOString()).toBe(
      "2026-11-20T09:30:00.000Z",
    );
  });

  it("keeps lastPractised as null for a song never practised", async () => {
    mockFetch([savedSongResponse]);

    const [userSong] = await getUserSongs();

    expect(userSong?.lastPractised).toBeNull();
  });

  it("keeps the song identity the details page needs", async () => {
    mockFetch([savedSongResponse]);

    const [userSong] = await getUserSongs();

    expect(userSong?.id).toBe(10);
    expect(userSong?.song.spotifyId).toBe("spotify-a");
  });
});

describe("updateUserSong", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("patches the row by id and sends only the fields being changed", async () => {
    const fetchSpy = mockFetch({ ...savedSongResponse, status: "LEARNING" });

    await updateUserSong({ id: 10, status: "LEARNING" });

    // The id addresses the row, so it must not also appear in the body.
    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/user-songs/10",
      expect.objectContaining({
        body: JSON.stringify({ status: "LEARNING" }),
        method: "PATCH",
      }),
    );
  });

  it("returns the updated row", async () => {
    mockFetch({ ...savedSongResponse, capo: 3, status: "LEARNING" });

    const updated = await updateUserSong({ id: 10, status: "LEARNING" });

    expect(updated.status).toBe("LEARNING");
    expect(updated.capo).toBe(3);
  });

  it("throws when the update fails, so the mutation reports an error", async () => {
    mockFetch({}, false);

    await expect(
      updateUserSong({ id: 10, status: "LEARNING" }),
    ).rejects.toThrow("Failed to update song");
  });
});

describe("getDashboardUserSongs", () => {
  const dashboardResponse = {
    mostRecentlyPractised: {
      ...savedSongResponse,
      lastPractised: "2026-11-26T18:00:00.000Z",
      status: "LEARNING",
    },
    newlyAdded: savedSongResponse,
    oldestPractised: null,
    practisedInLast30Days: 4,
    practisedThisMonth: { count: 2, yearMonth: "2026-11" },
    songCount: 12,
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches the dashboard endpoint", async () => {
    const fetchSpy = mockFetch(dashboardResponse);

    await getDashboardUserSongs();

    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/user-songs/dashboard",
      expect.anything(),
    );
  });

  it("parses the suggested songs, counts and month", async () => {
    mockFetch(dashboardResponse);

    const dashboard = await getDashboardUserSongs();

    expect(dashboard.mostRecentlyPractised?.status).toBe("LEARNING");
    expect(dashboard.mostRecentlyPractised?.lastPractised).toBeInstanceOf(Date);
    expect(dashboard.newlyAdded?.song.title).toBe("Song A");
    expect(dashboard.practisedInLast30Days).toBe(4);
    expect(dashboard.practisedThisMonth).toEqual({
      count: 2,
      yearMonth: "November",
    });
    expect(dashboard.songCount).toBe(12);
  });

  it("accepts null for each suggested song, as a new user has none", async () => {
    mockFetch({
      ...dashboardResponse,
      mostRecentlyPractised: null,
      newlyAdded: null,
      oldestPractised: null,
    });

    const dashboard = await getDashboardUserSongs();

    expect(dashboard.mostRecentlyPractised).toBeNull();
    expect(dashboard.oldestPractised).toBeNull();
    expect(dashboard.newlyAdded).toBeNull();
  });

  it("throws when the request fails, so the page shows an error", async () => {
    mockFetch({}, false);

    await expect(getDashboardUserSongs()).rejects.toThrow("Failed to fetch");
  });
});
