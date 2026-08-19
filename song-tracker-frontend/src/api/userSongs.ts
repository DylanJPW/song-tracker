import * as v from "valibot";
import {apiClient} from "@/api/client";
import {type UpdateUserSong, UserSong, UserSongs} from "@/api/schemas/UserSongSchema";

export async function getUserSongs() {
  const response = await apiClient("/user-songs");
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  return v.parse(UserSongs, await response.json());
}

export async function saveUserSong(spotifyId: string) {
  const requestOptions: RequestInit = {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({spotifyId}),
  }
  const response = await apiClient("/user-songs", requestOptions)
  if (!response.ok) {
    throw new Error("Failed to save song")
  }
  return v.parse(UserSong, await response.json())
}

export async function updateUserSong({id, ...patch}: UpdateUserSong) {
  const response = await apiClient(`/user-songs/${id}`, {
    body: JSON.stringify(patch),
    headers: {'Content-Type': 'application/json'},
    method: 'PATCH'
  })
  if (!response.ok) {
    throw new Error('Failed to update song')
  }
  return v.parse(UserSong, await response.json())
}