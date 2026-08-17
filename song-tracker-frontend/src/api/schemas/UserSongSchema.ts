import * as v from 'valibot'
import {Song} from '@/api/schemas/SongSchema'

export const songStatuses = ['WANT_TO_LEARN', 'LEARNING', 'LEARNED'] as const
export type SongStatus = (typeof songStatuses)[number]

export const songStatusLabels: Record<SongStatus, string> = {
  LEARNED: 'Learned',
  LEARNING: 'Learning',
  WANT_TO_LEARN: 'Want to learn'
}

export const UserSong = v.object({
  capo: v.union([v.number(), v.null()]),
  difficultyRating: v.union([v.number(), v.null()]),
  id: v.number(),
  song: Song,
  status: v.picklist(songStatuses)
})
export type UserSong = v.InferOutput<typeof UserSong>

export const UserSongs = v.array(UserSong)