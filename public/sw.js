/*
 * Vinculum Field Service Worker.
 * Keeps the site and the dashboard fully operational with no connection: every
 * desk chunk, script, stylesheet and self-hosted font is precached at install,
 * same-origin assets are served cache-first, and the app shell answers any page
 * request while offline. Mission state lives only in this browser (IndexedDB and
 * Web Crypto); this worker never stores, reads or sends mission data, and it
 * never touches cross-origin requests.
 *
 * At build time, vite.config.ts replaces BUILD_ID and BUILD_ASSETS below with the
 * hashed bundle list. In development (where this file is not registered) they
 * keep their empty defaults.
 */
const BUILD_ID = "__BUILD_ID__";
const BUILD_ASSETS = /*__BUILD_ASSETS__*/ [];

// v2: fonts are self-hosted under /assets, so the old Google font cache is retired.
const CACHE_VERSION = "v2";
const CACHE_NAME = `vinculum-field-cache-${CACHE_VERSION}-${BUILD_ID}`;
const SHELL = "/index.html";
const SHELL_EXTRAS = [
  "/",
  "/site.webmanifest",
  "/vendor/silktide/silktide-consent-manager.css",
  "/vendor/silktide/silktide-consent-manager.js",
  "/favicon.ico",
  "/vinculum-security-favicon.png",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
];
const NAV_TIMEOUT_MS = 4000;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // The shell is critical: if it cannot be fetched, the install fails and is retried later.
      const shell = await fetch(SHELL, { cache: "reload" });
      if (!shell.ok) throw new Error("Shell unavailable");
      await cache.put(SHELL, shell.clone());
      await cache.put("/", shell.clone());
      // Everything else is best effort, so one slow asset cannot block the whole install.
      await Promise.allSettled(
        [...SHELL_EXTRAS.filter((u) => u !== "/"), ...BUILD_ASSETS].map(async (url) => {
          const res = await fetch(url, { cache: "reload" });
          if (res.ok) await cache.put(url, res);
        })
      );
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      // Every older build cache and the retired font cache are removed.
      await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

const isHtml = (res) => (res.headers.get("content-type") || "").includes("text/html");

async function navigate(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const res = await Promise.race([
      fetch(request),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), NAV_TIMEOUT_MS)),
    ]);
    // Keep the shell fresh so the next offline start matches the latest deploy.
    if (res && res.ok && isHtml(res)) cache.put(SHELL, res.clone());
    return res;
  } catch {
    // Offline or too slow: the single-page shell answers every route client-side.
    return (await cache.match(SHELL)) || (await cache.match("/")) || Response.error();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  // A missing hashed file can come back as the HTML shell with status 200; never store that as a script.
  if (res.ok && !isHtml(res)) cache.put(request, res.clone());
  return res;
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  const refresh = fetch(request)
    .then((res) => {
      if (res && (res.ok || res.type === "opaque")) cache.put(request, res.clone());
      return res;
    })
    .catch(() => null);
  if (hit) return hit;
  return (await refresh) || Response.error();
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // Anything cross-origin (authentication, APIs, analytics) goes straight to the network, untouched.
  if (url.origin !== self.location.origin) return;
  if (url.pathname === "/sw.js") return;

  if (request.mode === "navigate") {
    event.respondWith(navigate(request));
    return;
  }

  // Hashed build output (scripts, styles, fonts) never changes under the same name.
  if (url.pathname.startsWith("/assets/") || /\.(?:woff2?|ttf|otf)$/.test(url.pathname)) {
    event.respondWith(cacheFirst(request).catch(() => Response.error()));
    return;
  }

  event.respondWith(staleWhileRevalidate(request, CACHE_NAME));
});
