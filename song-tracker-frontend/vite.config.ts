/// <reference types="vitest/config" />

import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(() => ({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    bail: 1,
    clearMocks: true,
    coverage: {
      enabled: true,
      exclude: ["src/main.tsx", "src/mocks/browser.ts"],
      include: ["src/**/*"],
      reporter: ["text", "lcov"],
      reportsDirectory: "coverage",
      // thresholds: {
      //   "80": true,
      // },
    },
    css: false,
    environment: "happy-dom",
    globals: true,
    include: ["src/**/*.test.ts?(x)"],
    setupFiles: "src/test-setup.ts",
  },
}));
