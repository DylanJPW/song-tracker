import { delay, HttpResponse, http } from "msw";
import songs from "./data/songs.json" with { type: "json" };

export const handlers = [
  http.get("/songs", async () => {
    await delay("real");
    return HttpResponse.json(songs);
  }),
];
