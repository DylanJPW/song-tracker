import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import { Suspense } from "react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { currentUser } from "@/api/authentication";
import type { DashboardUserSongs } from "@/api/schemas/UserSongSchema";
import { getDashboardUserSongs } from "@/api/userSongs";
import { useAuth } from "@/context/AuthContext";
import { buildDashboard, buildSong, buildUserSong } from "@/test-fixtures";
import { HomePage } from "./HomePage";

vi.mock("@/api/authentication", () => ({
  currentUser: vi.fn(),
}));

vi.mock("@/api/userSongs", () => ({
  getDashboardUserSongs: vi.fn(),
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/pages/LandingPage", () => ({
  LandingPage: () => <p>Landing page</p>,
}));

interface RenderOptions {
  dashboard?: DashboardUserSongs;
  isLoggedIn?: boolean;
}

function renderHomePage({
  dashboard = buildDashboard(),
  isLoggedIn = true,
}: RenderOptions = {}) {
  vi.mocked(useAuth).mockReturnValue({
    authToken: isLoggedIn ? "token" : null,
    isLoggedIn,
    login: vi.fn(),
    logout: vi.fn(),
  });
  vi.mocked(currentUser).mockResolvedValue({ id: 1, username: "dylan" });
  vi.mocked(getDashboardUserSongs).mockResolvedValue(dashboard);

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Suspense fallback="Loading">
          <HomePage />
        </Suspense>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

function getTile(label: string) {
  const tile = screen.getByText(label).parentElement;
  if (tile === null) {
    throw new Error(`No tile found for "${label}"`);
  }
  return tile;
}

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("when logged out", () => {
    it("shows the landing page without calling the API", () => {
      renderHomePage({ isLoggedIn: false });

      expect(screen.getByText("Landing page")).toBeInTheDocument();
      expect(currentUser).not.toHaveBeenCalled();
      expect(getDashboardUserSongs).not.toHaveBeenCalled();
    });
  });

  describe("when logged in", () => {
    it("welcomes the user by name", async () => {
      renderHomePage();

      expect(
        await screen.findByRole("heading", {
          level: 1,
          name: "Welcome back, dylan",
        }),
      ).toBeInTheDocument();
      expect(screen.queryByText("Landing page")).not.toBeInTheDocument();
    });

    it("shows the practice stats in their tiles", async () => {
      renderHomePage({
        dashboard: buildDashboard({
          practisedInLast30Days: 4,
          practisedThisMonth: { count: 2, yearMonth: "November" },
          songCount: 12,
        }),
      });

      await screen.findByRole("heading", { level: 1 });

      expect(within(getTile("In last 30 days")).getByText("4")).toBeInTheDocument();
      expect(within(getTile("In November")).getByText("2")).toBeInTheDocument();
      expect(within(getTile("In library")).getByText("12")).toBeInTheDocument();
    });

    it("shows the suggested song in each section", async () => {
      renderHomePage({
        dashboard: buildDashboard({
          mostRecentlyPractised: buildUserSong({
            song: buildSong({ spotifyId: "recent", title: "Recent Song" }),
          }),
          newlyAdded: buildUserSong({
            song: buildSong({ spotifyId: "new", title: "New Song" }),
          }),
          oldestPractised: buildUserSong({
            song: buildSong({ spotifyId: "oldest", title: "Oldest Song" }),
          }),
        }),
      });

      await screen.findByRole("heading", { level: 1 });

      const headings = screen.getAllByRole("heading", { level: 2 });
      expect(headings.map((heading) => heading.textContent)).toEqual([
        "Continue learning from where you left off",
        "It's been a while since you practised this",
        "Try something new",
      ]);

      expect(screen.getByText("Recent Song")).toBeInTheDocument();
      expect(screen.getByText("Oldest Song")).toBeInTheDocument();
      expect(screen.getByText("New Song")).toBeInTheDocument();
      expect(screen.getAllByRole("link")).toHaveLength(3);
    });

    it("shows an empty message in each section for a brand new user", async () => {
      renderHomePage({ dashboard: buildDashboard() });

      await screen.findByRole("heading", { level: 1 });

      expect(
        screen.getAllByText("You haven't practised anything yet."),
      ).toHaveLength(2);
      expect(
        screen.getByText("You haven't added any songs yet."),
      ).toBeInTheDocument();
      expect(screen.queryAllByRole("link")).toHaveLength(0);
    });
  });
});