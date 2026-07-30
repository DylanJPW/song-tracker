import * as v from "valibot";

export const SongDTO = v.object({
  title: v.string(),
  artist: v.string(),
  album: v.string(),
  imageUrl: v.string(),
})
export type SongDTO = v.InferOutput<typeof SongDTO>

export const SpotifySong = v.object({
  ...v.entriesFromObjects([SongDTO]),
  spotifyId: v.union([v.string(), v.null()]),
})
export type SpotifySong = v.InferOutput<typeof SpotifySong>

export const Song = v.object({
  ...v.entriesFromObjects([SongDTO]),
  id: v.number(),
  spotifyId: v.union([v.string(), v.null()]),
  dateAdded: v.optional(
    v.pipe(
      v.union([v.string(), v.date()]), // Accept dateAdded as string or date
      v.transform(
        (input) => (typeof input === "string" ? new Date(input) : input), // If string, convert to date
      ),
    ),
  ),
});
export type Song = v.InferOutput<typeof Song>;

export const Songs = v.array(Song);