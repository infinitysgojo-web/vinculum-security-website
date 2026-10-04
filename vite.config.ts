import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { createHash } from "crypto";
import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from "fs";

/**
 * Offline field PWA: after the build, stamp public/sw.js (copied to dist) with this
 * build's id and the full list of hashed bundles, so every desk chunk is cached up
 * front and the dashboard keeps working with no connection.
 */
function offlineManifest() {
  let outDir = "dist";
  return {
    name: "vinculum-offline-manifest",
    apply: "build" as const,
    configResolved(cfg: { build: { outDir: string }; root: string }) {
      outDir = path.resolve(cfg.root, cfg.build.outDir);
    },
    closeBundle() {
      const swPath = path.join(outDir, "sw.js");
      const assetsDir = path.join(outDir, "assets");
      if (!existsSync(swPath) || !existsSync(assetsDir)) return;
      const files = readdirSync(assetsDir)
        .filter((f) => !f.endsWith(".map"))
        .sort();
      const urls = files.map((f) => `/assets/${f}`);
      const id = createHash("sha256")
        .update(files.map((f) => `${f}:${statSync(path.join(assetsDir, f)).size}`).join("|"))
        .digest("hex")
        .slice(0, 10);
      const src = readFileSync(swPath, "utf8")
        .replace("__BUILD_ID__", id)
        .replace("/*__BUILD_ASSETS__*/ []", JSON.stringify(urls));
      writeFileSync(swPath, src);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger(), offlineManifest()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
