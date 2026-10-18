import { beforeEach, expect, test } from "bun:test";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  KDF_CURRENT,
  KDF_LEGACY,
  LEGACY_PBKDF2_ITERATIONS,
  PBKDF2_ITERATIONS,
  TAG_MISMATCH,
  bytesToHex,
  deriveEnclaveKey,
  encryptEnclavePayload,
  hasEnclaveKey,
  iterationsFor,
  openEnvelope,
  randomBytes,
  sealEnvelope,
  timingSafeEqual,
  timingSafeEqualText,
  zeroizeBuffer,
  type EncryptedPayload,
} from "../src/lib/chancelleryCrypto";
import {
  VERIFICATION_KEY,
  __resetVaultForTests,
  getAllTheatresFromVault,
  getEnclaveMetadata,
  putEnclaveMetadata,
  putRawTheatreRecord,
  readRawTheatreRecords,
  type SavedTheatreSlot,
} from "../src/lib/chancelleryDb";
import { SNAPSHOT_PREFIX, VERIFICATION_TEXT, enclaveState, lockEnclave, openSnapshot, refreshEnclave, unsealEnclave } from "../src/lib/chancelleryEnclave";
import { countStrippedDeep, detectSteganographicTokens, sanitizeDeep, sanitizeInscriptionText } from "../src/lib/sanitizer";
import { inspectElement, resolvedOrigin } from "../src/lib/domCanary";
import { KEPT_LOCAL_KEYS, PURGED_LOCAL_KEY, purgeVolatileState } from "../src/lib/panicPurge";
import { ledgerEntries, logEvent } from "../src/components/desk/ledgerStore";

const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

// Minimal window / Web Storage for the vault (memory fallback under bun) and the purge.
const makeStorage = () => {
  const m = new Map<string, string>();
  return {
    m,
    get length() {
      return m.size;
    },
    key: (i: number) => [...m.keys()][i] ?? null,
    getItem: (k: string) => (m.has(k) ? m.get(k)! : null),
    setItem: (k: string, v: string) => void m.set(k, String(v)),
    removeItem: (k: string) => void m.delete(k),
    clear: () => m.clear(),
  };
};
const local = makeStorage();
const session = makeStorage();
const g = globalThis as unknown as Record<string, unknown>;
g.window = globalThis;
g.localStorage = local;
g.sessionStorage = session;

beforeEach(() => {
  lockEnclave();
  __resetVaultForTests();
  local.clear();
  session.clear();
});

/* ---------------- envelope (vinculum-cipher-v1) ---------------- */

test("sealEnvelope round-trips any JSON value with a separate 128-bit tag, PBKDF2 310,000, fresh salt and IV", async () => {
  expect(PBKDF2_ITERATIONS).toBe(310_000);
  const data = { theatre: "Sample Basin", bonds: [3.4, 2.6, 3.0, 4.1], note: "Côte d'Ivoire ½ km²" };
  const a = await sealEnvelope(data, "correct horse battery");
  const b = await sealEnvelope(data, "correct horse battery");
  expect(a.format).toBe("vinculum-cipher-v1");
  expect(a.kdf).toBe(KDF_CURRENT);
  expect(a.tagHex).toMatch(/^[0-9a-f]{32}$/);
  expect(a.ivHex).toMatch(/^[0-9a-f]{24}$/);
  expect(a.saltHex).toMatch(/^[0-9a-f]{32}$/);
  expect(a.ivHex).not.toBe(b.ivHex);
  expect(a.saltHex).not.toBe(b.saltHex);
  expect(JSON.stringify(a)).not.toContain("Sample Basin");
  expect(await openEnvelope<typeof data>(a, "correct horse battery")).toEqual(data);
});

test("openEnvelope refuses a wrong passphrase, an altered tag or ciphertext, and a foreign format", async () => {
  const a = await sealEnvelope({ x: 1 }, "correct horse battery");
  await expect(openEnvelope(a, "incorrect horse battery")).rejects.toThrow(TAG_MISMATCH);
  const flip = (hex: string) => (hex[0] === "0" ? "1" : "0") + hex.slice(1);
  await expect(openEnvelope({ ...a, tagHex: flip(a.tagHex) }, "correct horse battery")).rejects.toThrow(TAG_MISMATCH);
  await expect(openEnvelope({ ...a, ciphertextHex: flip(a.ciphertextHex) }, "correct horse battery")).rejects.toThrow(TAG_MISMATCH);
  await expect(openEnvelope({ ...a, tagHex: a.tagHex.slice(2) }, "correct horse battery")).rejects.toThrow(TAG_MISMATCH);
  await expect(openEnvelope({ ...a, format: "other" } as unknown as EncryptedPayload, "correct horse battery")).rejects.toThrow(/Unsupported cipher format/);
  // An envelope with no kdf label is read at 310,000, the count the format shipped with.
  const { kdf: _k, ...unlabelled } = a;
  expect(await openEnvelope(unlabelled as EncryptedPayload, "correct horse battery")).toEqual({ x: 1 });
});

test("KDF labels: legacy and unlabelled records read at 100,000, current at 310,000, unknown labels are refused", () => {
  expect(iterationsFor(undefined)).toBe(LEGACY_PBKDF2_ITERATIONS);
  expect(iterationsFor(KDF_LEGACY)).toBe(100_000);
  expect(iterationsFor(KDF_CURRENT)).toBe(310_000);
  expect(() => iterationsFor("PBKDF2-SHA-256-1")).toThrow(TAG_MISMATCH);
});

/* ---------------- old-iteration compatibility and migration ---------------- */

const slot = (id: string, name: string): SavedTheatreSlot => ({
  id,
  name,
  updatedAt: "2026-01-01T00:00:00.000Z",
  profile: { theatre: name, parties: "Party A; Party B", officer: "", classification: "" } as SavedTheatreSlot["profile"],
  binder: [{ id: "b1", title: "Memo", text: `${name} memorandum` }],
  signals: {},
});

/** Seal exactly as #21 did: PBKDF2 100,000, label PBKDF2-SHA-256-100000. */
async function legacySeal(plaintext: string, passphrase: string) {
  const salt = randomBytes(16);
  const key = await deriveEnclaveKey(passphrase, salt, LEGACY_PBKDF2_ITERATIONS);
  const { ciphertextHex, ivHex } = await encryptEnclavePayload(plaintext, key);
  return { alg: "AES-256-GCM" as const, kdf: KDF_LEGACY, saltHex: bytesToHex(salt), ivHex, ciphertextHex };
}

test("a vault sealed at 100,000 iterations still unseals, and every legacy record is re-sealed at 310,000", async () => {
  const pass = "legacy passphrase";
  await putEnclaveMetadata(VERIFICATION_KEY, await legacySeal(VERIFICATION_TEXT, pass));
  await putRawTheatreRecord({ id: "sealed-legacy-1", sealed: true, ...(await legacySeal(JSON.stringify(slot("sample-basin", "Sample Basin")), pass)) });
  await putEnclaveMetadata(`${SNAPSHOT_PREFIX}session:u1`, await legacySeal(JSON.stringify({ profile: { theatre: "Saved" } }), pass));
  await refreshEnclave();
  expect(enclaveState().configured).toBe(true);

  await expect(unsealEnclave("wrong passphrase")).rejects.toThrow(TAG_MISMATCH);
  await unsealEnclave(pass);
  expect(hasEnclaveKey()).toBe(true);
  expect((await getAllTheatresFromVault()).map((s) => s.name)).toEqual(["Sample Basin"]);
  expect(await openSnapshot<{ profile: { theatre: string } }>("session:u1")).toEqual({ profile: { theatre: "Saved" } });

  // Migrated in place: same storage id, current KDF, still no plaintext at rest.
  const raw = (await readRawTheatreRecords()) as unknown as { id: string; kdf: string }[];
  expect(raw.map((r) => [r.id, r.kdf])).toEqual([["sealed-legacy-1", KDF_CURRENT]]);
  expect(JSON.stringify(raw)).not.toContain("Sample Basin");
  expect((await getEnclaveMetadata(VERIFICATION_KEY))?.kdf).toBe(KDF_CURRENT);
  expect((await getEnclaveMetadata(`${SNAPSHOT_PREFIX}session:u1`))?.kdf).toBe(KDF_CURRENT);

  // And the upgraded vault opens again after locking.
  lockEnclave();
  await unsealEnclave(pass);
  expect((await getAllTheatresFromVault()).map((s) => s.name)).toEqual(["Sample Basin"]);
});

/* ---------------- constant time and zeroization ---------------- */

test("timingSafeEqual compares every byte and rejects length or content differences", () => {
  const a = new Uint8Array([1, 2, 3, 4]);
  expect(timingSafeEqual(a, new Uint8Array([1, 2, 3, 4]))).toBe(true);
  expect(timingSafeEqual(a, new Uint8Array([1, 2, 3, 5]))).toBe(false);
  expect(timingSafeEqual(a, new Uint8Array([0, 2, 3, 4]))).toBe(false);
  expect(timingSafeEqual(a, new Uint8Array([1, 2, 3]))).toBe(false);
  expect(timingSafeEqual(new Uint8Array(), new Uint8Array())).toBe(true);
  const h = "a".repeat(64);
  expect(timingSafeEqualText(h, "a".repeat(64))).toBe(true);
  expect(timingSafeEqualText(h, "a".repeat(63) + "b")).toBe(false);
  expect(timingSafeEqualText("é", "e\u0301")).toBe(false);
});

test("zeroizeBuffer leaves every byte zero, including buffers above the 64 KiB getRandomValues limit", () => {
  const small = new Uint8Array([9, 8, 7]);
  zeroizeBuffer(small);
  expect([...small]).toEqual([0, 0, 0]);
  const big = new Uint8Array(200_000).fill(255);
  zeroizeBuffer(big.buffer);
  expect(big.every((b) => b === 0)).toBe(true);
});

/* ---------------- sanitizer ---------------- */

test("sanitizer strips zero-width, bidi override and control characters and keeps tabs and line breaks", () => {
  expect(sanitizeInscriptionText("  Art\u200B. 1.1\u202E evil\u202C \uFEFF")).toBe("Art. 1.1 evil");
  expect(sanitizeInscriptionText("a\u2066b\u2069c\u2060d")).toBe("abcd");
  expect(sanitizeInscriptionText("line one\n\tline two\x07\x00")).toBe("line one\n\tline two");
  expect(sanitizeInscriptionText("x\r\ny")).toBe("x\r\ny");
  expect(sanitizeInscriptionText("")).toBe("");
  expect(sanitizeInscriptionText("  keep  ", { trim: false })).toBe("  keep  ");
});

test("sanitizer does not alter legitimate drafting text: NFC not NFKC, and joiners kept inside joining scripts", () => {
  // NFC composes canonically identical sequences only.
  expect(sanitizeInscriptionText("e\u0301")).toBe("é");
  for (const t of ["40 km² of grazing land", "½ of the fund", "Vinculum™", "ﬁnal", "Ⅳ. Governance", "１２"]) expect(sanitizeInscriptionText(t)).toBe(t);
  expect(sanitizeInscriptionText("ﬁnal", { compatibility: true })).toBe("final");
  // Persian ZWNJ and Devanagari ZWJ are spelling; between Latin letters they are markers.
  expect(sanitizeInscriptionText("می\u200Cخواهم")).toBe("می\u200Cخواهم");
  expect(sanitizeInscriptionText("क्\u200Dष")).toBe("क्\u200Dष");
  expect(sanitizeInscriptionText("trea\u200Cty\u200D")).toBe("treaty");
});

test("steganographic token audit and deep sanitizing for archive import", () => {
  expect(detectSteganographicTokens("clean text")).toEqual({ hasHiddenTokens: false, count: 0, stripped: 0 });
  expect(detectSteganographicTokens("a\u200Bb\u202Ec")).toEqual({ hasHiddenTokens: true, count: 2, stripped: 2 });
  // A Persian joiner is counted as a hidden character but not stripped.
  expect(detectSteganographicTokens("می\u200Cخواهم")).toEqual({ hasHiddenTokens: true, count: 1, stripped: 0 });
  const archive = { profile: { theatre: "Sample\u200B Basin", bonds: { communal: 2.6 } }, binder: [{ id: "b\u200D1", text: "  Memo\u202E  " }] };
  const clean = sanitizeDeep(archive);
  expect(clean).toEqual({ profile: { theatre: "Sample Basin", bonds: { communal: 2.6 } }, binder: [{ id: "b1", text: "  Memo  " }] });
  expect(countStrippedDeep(archive)).toBe(3);
});

/* ---------------- DOM canary rules ---------------- */

const el = (tagName: string, attrs: Record<string, string> = {}) => ({
  tagName,
  getAttribute: (n: string) => (n in attrs ? attrs[n] : null),
  hasAttribute: (n: string) => n in attrs,
});
const PAGE = "https://www.vinculumsecurity.kidnexus.or.ke/dashboard";

test("canary ignores the app's own nodes: same-origin chunks, JSON-LD, blob frames, links and portals", () => {
  for (const e of [
    el("SCRIPT", { src: "/assets/Dashboard-abc123.js", type: "module" }),
    el("SCRIPT", { src: "https://www.vinculumsecurity.kidnexus.or.ke/vendor/silktide/silktide-consent-manager.js" }),
    el("SCRIPT", { type: "application/ld+json" }),
    el("IFRAME", { src: "blob:https://www.vinculumsecurity.kidnexus.or.ke/5c1e" }),
    el("IFRAME", { src: "/print-preview" }),
    el("LINK", { rel: "modulepreload", href: "/assets/x.js" }),
    el("DIV", { "data-radix-portal": "" }),
    el("SECTION", { "aria-label": "Notifications" }),
  ])
    expect(inspectElement(e, PAGE)).toBeNull();
});

test("canary flags foreign scripts, injected inline scripts and foreign or blank frames", () => {
  expect(inspectElement(el("SCRIPT", { src: "https://tracker.example/t.js" }), PAGE)?.reason).toBe("Script from a foreign origin");
  expect(inspectElement(el("SCRIPT", { src: "//cdn.example/x.js", type: "text/javascript" }), PAGE)).not.toBeNull();
  expect(inspectElement(el("SCRIPT", { src: "data:text/javascript,alert(1)" }), PAGE)).not.toBeNull();
  expect(inspectElement(el("SCRIPT"), PAGE)?.source).toBe("inline");
  expect(inspectElement(el("IFRAME", { src: "https://foreign.invalid/" }), PAGE)?.reason).toBe("Frame from a foreign origin");
  expect(inspectElement(el("IFRAME", { src: "chrome-extension://abcdef/panel.html" }), PAGE)).not.toBeNull();
  expect(inspectElement(el("IFRAME"), PAGE)?.source).toBe("about:blank");
  expect(inspectElement(el("IFRAME", { srcdoc: "<p>x</p>" }), PAGE)?.source).toBe("srcdoc");
  expect(inspectElement(el("OBJECT", { data: "https://foreign.invalid/x.swf" }), PAGE)).not.toBeNull();
  expect(resolvedOrigin("blob:https://a.example/1", PAGE)).toBe("https://a.example");
});

/* ---------------- panic purge ---------------- */

test("panic purge wipes session storage, saved sessions, the offline credential and the auth token, keeps the sequence floor", () => {
  for (const k of ["vinculum-session:u1", "vinculum-theatre-library", "vs:offline-cred", "vs:enclave-idle-minutes", "sb-abc-auth-token", "vs:registry_seq", "silktideCookieChoice_essential"]) local.setItem(k, "x");
  session.setItem("vs:offline-session", "{}");
  session.setItem("vs:scif", "1");
  logEvent("MISSION_HYDRATED", "Sample Basin");
  const removed = purgeVolatileState();
  expect(removed).toBe(5);
  expect([...local.m.keys()].sort()).toEqual(["silktideCookieChoice_essential", "vs:registry_seq"]);
  expect(session.length).toBe(0);
  expect(ledgerEntries()).toEqual([]);
  expect(hasEnclaveKey()).toBe(false);
  expect(enclaveState().configured).toBe(false);
  expect(PURGED_LOCAL_KEY.test("vs:registry_seq") && KEPT_LOCAL_KEYS.has("vs:registry_seq")).toBe(true);
});

/* ---------------- scoping and public-page rules ---------------- */

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(tsx?|jsx?)$/.test(f) ? [p] : [];
  });
const SRC = new URL("../src", import.meta.url).pathname;

test("only Dashboard.tsx and Login.tsx link or navigate to /dashboard or /login; the Sentinel never navigates", () => {
  const hits = walk(SRC).filter((f) => /(to|href|navigate)[=(]["'`]\/(dashboard|login)/.test(readFileSync(f, "utf8")));
  expect(hits.map((f) => f.slice(SRC.length + 1)).sort()).toEqual(["pages/Dashboard.tsx", "pages/Login.tsx"]);
  const sentinel = read("src/components/desk/ChancellerySentinel.tsx");
  expect(sentinel).not.toMatch(/useNavigate|navigate\(|\/login|\/dashboard/);
  // Mounted by the dashboard alone, so the panic keys exist on no other route.
  const importers = walk(SRC).filter((f) => /ChancellerySentinel/.test(readFileSync(f, "utf8"))).map((f) => f.slice(SRC.length + 1));
  expect(importers.sort()).toEqual(["components/desk/ChancellerySentinel.tsx", "pages/Dashboard.tsx"]);
});

test("new Sentinel and sanitizer code uses semantic tokens only: no raw hex colours and no emoji", () => {
  for (const f of ["src/components/desk/ChancellerySentinel.tsx", "src/lib/sanitizeFields.ts", "src/components/AttestationVerifier.tsx"]) {
    const s = read(f);
    expect(s).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(s).not.toMatch(/\p{Extended_Pictographic}/u);
  }
});

/* ---------------- edge headers ---------------- */

const config = JSON.parse(read("vercel.json"));
const header = (source: string, key: string) =>
  config.headers.find((e: { source: string }) => e.source === source)?.headers.find((h: { key: string }) => h.key === key)?.value;

test("zero-sink isolation headers: COOP and CORP on, COEP and X-Frame-Options deliberately absent", () => {
  expect(header("/(.*)", "Cross-Origin-Opener-Policy")).toBe("same-origin");
  expect(header("/(.*)", "Cross-Origin-Resource-Policy")).toBe("same-origin");
  expect(header("/(.*)", "X-Content-Type-Options")).toBe("nosniff");
  expect(header("/(.*)", "X-Permitted-Cross-Domain-Policies")).toBe("none");
  expect(header("/(.*)", "Strict-Transport-Security")).toBe("max-age=63072000; includeSubDomains; preload");
  // Social cards and icons stay embeddable by other origins.
  expect(header("/og/(.*)", "Cross-Origin-Resource-Policy")).toBe("cross-origin");
  const all = JSON.stringify(config);
  // COEP require-corp would block the cross-origin article covers on Home and Dispatches; XFO would block Lovable previews.
  expect(all).not.toContain("Cross-Origin-Embedder-Policy");
  expect(all).not.toContain("X-Frame-Options");
});

test("dashboard and sign-in are noindex and no-store; rewrites unchanged", () => {
  for (const s of ["/dashboard", "/login"]) {
    expect(header(s, "X-Robots-Tag")).toBe("noindex, nofollow, noarchive, nosnippet, noimageindex");
    expect(header(s, "Cache-Control")).toBe("no-store, no-cache, must-revalidate, private");
  }
  expect(config.rewrites).toEqual([{ source: "/(.*)", destination: "/index.html" }]);
});

test("CSP keeps the PDF engine allowances and the auth hosts, and adds no Google Fonts or websocket hosts", () => {
  for (const s of ["/(.*)", "/dashboard", "/login"]) {
    const d = Object.fromEntries((header(s, "Content-Security-Policy") as string).split(";").map((x) => x.trim().split(/\s+/)).map(([k, ...v]) => [k, v]));
    expect(d["script-src"]).toContain("'wasm-unsafe-eval'");
    expect(d["worker-src"]).toEqual(["'self'", "blob:"]);
    expect(d["connect-src"]).toEqual(["'self'", "https://*.lovable.cloud", "https://*.supabase.co", "data:", "blob:"]);
    expect(d["font-src"]).toEqual(["'self'"]);
    expect(d["style-src"]).toEqual(["'self'", "'unsafe-inline'"]);
    expect(JSON.stringify(d)).not.toMatch(/googleapis|gstatic|wss:/);
  }
});
