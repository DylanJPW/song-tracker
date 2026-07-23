import * as v from "valibot";
import {apiClient} from "@/api/client";
import {Songs} from "@/api/schemas/SongSchema";


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