import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import type { UserSong } from "@/api/schemas/UserSongSchema";
import { buildSong, buildUserSong } from "@/test-fixtures";
import { Section } from "./Section";

function renderSection(userSong: UserSong | null) {
  return render(
    <MemoryRouter>
      <Section
        emptyMessage="Nothing here yet."
        title="Try something new"
        userSong={userSong}
      />
    </MemoryRouter>,
  );
}

describe("Section", () => {
  it("shows the title as a heading", () => {
    renderSection(buildUserSong());

    expect(
      screen.getByRole("heading", { level: 2, name: "Try something new" }),
    ).toBeInTheDocument();
  });

  it("links to the suggested song", () => {
    renderSection(
      buildUserSong({
        song: buildSong({ spotifyId: "spotify-b", title: "Song B" }),
      }),
    );

    expect(screen.getByText("Song B")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/songs/spotify-b",
    );
    expect(screen.queryByText("Nothing here yet.")).not.toBeInTheDocument();
  });

  it("keeps the heading and shows the empty message when there is no song", () => {
    renderSection(null);

    expect(
      screen.getByRole("heading", { level: 2, name: "Try something new" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Nothing here yet.")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});