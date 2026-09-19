import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const { version } = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));
const banner = `/*! Career Explorer Registration v${version} | Yale SOM Career Development Office */\n`;

// After the files are on disk: stamps the version on the first line of both built files
// (after minification, which strips comments) and copies README.md, the integration guide,
// next to them as INTEGRATION.md.
function finishBundle(): Plugin {
  return {
    name: "finish-bundle",
    writeBundle(options) {
      const dir = options.dir ?? "dist-embed";
      writeFileSync(join(dir, "INTEGRATION.md"), readFileSync("README.md", "utf8"));
      for (const name of readdirSync(dir)) {
        if (!/\.(js|css)$/.test(name) || name === "host.css") continue;
        const file = join(dir, name);
        writeFileSync(file, banner + readFileSync(file, "utf8"));
      }
    },
  };
}

// Builds the embeddable Registration Embed: dist-embed/career-explorer-registration.{js,css}.
// demo/public (a stand-in Host Page) is copied alongside; `pnpm pack:embed`
// zips the folder for the Host Page's developer.
export default defineConfig({
  publicDir: "demo/public",
  plugins: [react(), tailwindcss(), finishBundle()],
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
