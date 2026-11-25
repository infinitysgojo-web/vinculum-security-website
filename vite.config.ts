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

/**
 * Vendor partitioning. Matches on exact node_modules package paths so that
 * packages merely containing "react" in their name (react-hook-form,
 * @react-pdf/*, lucide-react, ...) never land in the core chunk.
 */
function vendorChunk(id: string): string | undefined {
  // Rollup's CommonJS interop helpers are shared by React (CJS) and @react-pdf. Pin them
  // to the always-loaded core chunk so the lazy PDF vendor chunk is never pulled into
  // the entry's static imports (and modulepreloaded on every public page).
  if (id.includes("commonjsHelpers")) return "vendor-react-core";
  // Academy lecture text is the largest body of static data in the dashboard. It stays a static
  // import (the air-gapped terminal never fetches a chunk on demand) but ships in its own chunk,
  // so the entry chunk does not grow as the lectures are expanded.
  if (/\/src\/components\/mode\/academy(?:CurriculumPart\d|ModuleIV\w*|ModuleV\w*|LectureHeadings|Formulas)\.ts$/.test(id.replace(/\\/g, "/"))) return "academy-lectures";
  const m = id.replace(/\\/g, "/").match(/\/node_modules\/((?:@[^/]+\/)?[^/]+)\//g);
  if (!m) return undefined;
  const pkg = m[m.length - 1].replace(/^\/node_modules\//, "").replace(/\/$/, "");
  if (pkg.startsWith("@react-pdf/")) return "vendor-pdf";
  if (pkg === "lucide-react") return "vendor-icons";
  if (pkg.startsWith("@radix-ui/")) return "vendor-radix";
  if (["react", "react-dom", "react-router", "react-router-dom", "scheduler", "@remix-run/router"].includes(pkg)) {
    return "vendor-react-core";
  }
  return undefined;
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
  build: {
    // Offline analytical workstation: client-side PDF synthesis and crypto ship in the bundle.
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: vendorChunk,
      },
    },
  },
}));
