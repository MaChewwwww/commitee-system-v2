import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./frontend", import.meta.url)) },
  },
  build: {
    outDir: "assets/build",
    emptyOutDir: true,
    lib: {
      entry: "frontend/main.tsx",
      formats: ["es"],
      fileName: () => "ui.js",
      cssFileName: "ui",
    },
  },
  // Browser code must never receive server environment variables.
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
})
