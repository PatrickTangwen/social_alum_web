import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Builds the embeddable Registration Embed: dist-embed/career-explorer-registration.{js,css}.
// demo/public (a stand-in Host Page) is copied alongside so the built files can be opened.
export default defineConfig({
  publicDir: "demo/public",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    outDir: "dist-embed",
    emptyOutDir: true,
    lib: {
      entry: "src/embed/index.tsx",
      name: "CareerExplorerRegistration",
      formats: ["iife"],
      fileName: () => "career-explorer-registration.js",
      cssFileName: "career-explorer-registration",
    },
  },
});
