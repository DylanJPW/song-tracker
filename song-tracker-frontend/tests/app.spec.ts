import { expect, test } from "@playwright/test";


test("shows the landing page to a logged-out visitor", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "SongTracker" }),
  ).toBeVisible();
});

test("shows the dashboard to a logged-in user", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("jwt", "e2e-token");
  });

  await page.route("**/api/users/currentUser", (route) =>
    route.fulfill({ json: { id: 1, username: "dylan" } }),
  );
  await page.route("**/api/user-songs/dashboard", (route) =>
    route.fulfill({
      json: {
        mostRecentlyPractised: null,
        newlyAdded: null,
        oldestPractised: null,
        practisedInLast30Days: 0,
        practisedThisMonth: { count: 0, yearMonth: "2026-11" },
        songCount: 0,
      },
    }),
  );

  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Welcome back, dylan" }),
  ).toBeVisible();
  await expect(page.getByText("In November")).toBeVisible();
  await expect(page.getByText("You haven't added any songs yet.")).toBeVisible();
});