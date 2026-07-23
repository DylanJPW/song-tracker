import {apiClient} from "@/api/client";
import * as v from "valibot";
import {UserSongs} from "@/api/schemas/UserSongSchema";

export async function getUserSongs() {
  const response = await apiClient("/user-songs");
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  return v.parse(UserSongs, await response.json());
}