import * as v from "valibot";

const Song = v.object({
  name: v.string(),
  singer: v.string(),
  dateAdded: v.pipe(
    v.union([v.string(), v.date()]),
    v.transform((input) =>
      typeof input === "string" ? new Date(input) : input,
    ),
  ),
  notes: v.string(),
  links: v.array(v.string()),
});
export type Song = v.InferOutput<typeof Song>;

const Songs = v.array(Song);

export async function getSongs() {
  const response = await fetch("/songs");
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  return v.parse(Songs, await response.json());
}
