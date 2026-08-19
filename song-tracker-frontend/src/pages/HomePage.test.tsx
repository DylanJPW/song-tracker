import {useSuspenseQuery} from "@tanstack/react-query";
import {render, screen} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vitest";
import type {Song} from "@/api/schemas/SongSchema";
import {useAuth} from "@/context/AuthContext";
import {HomePage} from "./HomePage";

vi.mock("@tanstack/react-query", () => ({
  useSuspenseQuery: vi.fn(),
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/components/songDisplay/SongList", () => ({
  SongList: ({songs}: { songs: Song[] }) => <p>{songs.length} catalogue songs</p>,
}));

vi.mock("@/pages/LandingPage", () => ({
  LandingPage: () => <p>Landing page</p>,
}));

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the landing page when logged out, without querying the catalogue", () => {
    vi.mocked(useAuth).mockReturnValue({
      authToken: null,
      isLoggedIn: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(<HomePage/>);

    expect(screen.getByText("Landing page")).toBeInTheDocument();
    expect(useSuspenseQuery).not.toHaveBeenCalled();
  });

  it("shows the song catalogue when logged in", () => {
    vi.mocked(useAuth).mockReturnValue({
      authToken: "token",
      isLoggedIn: true,
      login: vi.fn(),
      logout: vi.fn(),
    });
    vi.mocked(useSuspenseQuery).mockReturnValue({
      data: [{id: 1}, {id: 2}],
    } as never);

    render(<HomePage/>);

    expect(screen.getByText("2 catalogue songs")).toBeInTheDocument();
    expect(screen.queryByText("Landing page")).not.toBeInTheDocument();
  });
});