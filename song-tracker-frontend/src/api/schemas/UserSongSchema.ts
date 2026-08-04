import * as v from "valibot";
import {SongDTO} from "@/api/schemas/SongSchema";

const SongStatuses = ["WANT_TO_LEARN", "LEARNING", "LEARNED"]

export const UserSong = v.object({
  song: SongDTO,
  status: v.picklist(SongStatuses),
  capo: v.union([v.number(), v.null()]),
  difficultyRating: v.union([v.number(), v.null()]),
})
export type UserSong = v.InferOutput<typeof UserSong>;

export const UserSongs = v.array(UserSong);