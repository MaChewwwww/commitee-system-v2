import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL("./frontend", import.meta.url)) } },
  test: {
    environment: "jsdom",
    setupFiles: ["./frontend/tests/setup.ts"],
    include: ["frontend/**/*.test.ts", "frontend/**/*.test.tsx"],
  },
})
