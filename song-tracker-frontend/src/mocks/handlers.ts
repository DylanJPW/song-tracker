import type { HttpHandler } from "msw";

// Default MSW handlers for the test server (mocks/server.ts). Empty for now:
// the tests stub fetch directly.
export const handlers: HttpHandler[] = [];
