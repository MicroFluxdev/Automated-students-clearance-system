import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "::",
    port: 2000,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setUpTests.ts",
  },
  build: {
    outDir: "dist",
  },
});
