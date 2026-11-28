import type { HttpHandler } from "msw";

// Shared MSW handlers for the test server (mocks/server.ts) and the browser
// worker (mocks/browser.ts). Empty for now: the tests stub fetch directly.
export const handlers: HttpHandler[] = [];
