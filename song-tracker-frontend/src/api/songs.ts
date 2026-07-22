import * as v from "valibot";
import {apiClient} from "@/api/client";

const Song = v.object({
  id: v.pipe(
    v.union([v.string(), v.number()]), // Accept id as string or number
    v.transform(
      (input) => (typeof input === "number" ? input.toString() : input), // If number, convert to string
    ),
  ),
  title: v.string(),
  artist: v.string(),
  album: v.string(),
  imageUrl: v.string(),
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

const Songs = v.array(Song);

export async function getSongs() {
  const response = await apiClient("/songs");
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  return v.parse(Songs, await response.json());
}

export async function getSearchResults(query: string) {
  const response = await apiClient(`/spotify/search?query=${query}`);
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  return v.parse(Songs, await response.json());
}