# SongTracker frontend

React + TypeScript single-page app for SongTracker, built with Vite. See the [root README](../README.md) for what the app does and how the pieces fit together.

## Stack

- **React 19** with **React Router**
- **TanStack Query** for server state (fetching, caching, loading/error states)
- **Valibot** to validate API responses and form input at runtime
- **React Hook Form** for forms
- **Tailwind CSS 4** for styling
- **Vitest** + **Testing Library** for unit/component tests, **Playwright** for end-to-end tests
- **Biome** for linting

## Getting started

Requires Node 22+ and pnpm 10+.

```bash
pnpm install
pnpm dev
```

The dev server runs on http://localhost:5173 and proxies `/api` requests to the backend at http://localhost:8080 (see `vite.config.ts`), so start the backend first.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build into `dist/` |
| `pnpm preview` | Serve the production build locally |
| `pnpm test` | Unit/component tests in watch mode |
| `pnpm test:ci` | Unit/component tests once, with a coverage report |
| `pnpm test:e2e` | Playwright end-to-end tests in UI mode |
| `pnpm lint` | Type-check (`tsc`) and lint with Biome, auto-fixing what it can |

## Project layout

```
src/
  api/          fetch functions and Valibot schemas for each backend resource
  components/   reusable UI, grouped by feature (dashboard, forms, navigation, search, songDisplay)
  context/      AuthContext: login state and session-expiry handling
  mocks/        MSW server used by the unit tests
  pages/        one component per route
  utils/        small hooks and helpers
tests/          Playwright end-to-end tests
```

## Acknowledgements

The initial project setup (Vite, Tailwind, Vitest, Playwright and Biome configuration) came from the [Vitamin](https://github.com/wtchnm/Vitamin) template by Gabriel Pereira Woitechen, used under the MIT licence. See [LICENSE](./LICENSE).