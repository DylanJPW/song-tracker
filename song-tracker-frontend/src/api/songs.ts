import * as v from "valibot";

const Song = v.object({
  name: v.string(),
  artist: v.string(),
  dateAdded: v.pipe(
    v.union([v.string(), v.date()]), // Accept dateAdded as string or date
    v.transform(
      (input) => (typeof input === "string" ? new Date(input) : input), // If string, convert to date
    ),
  ),
  notes: v.string(),
  links: v.array(v.string()),
});
export type Song = v.InferOutput<typeof Song>;

const Songs = v.array(Song);

export async function getSongs() {
  const response = await fetch("/api/songs");
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  return v.parse(Songs, await response.json());
}
