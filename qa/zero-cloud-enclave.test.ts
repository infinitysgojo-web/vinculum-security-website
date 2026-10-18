import { beforeEach, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import {
  TAG_MISMATCH,
  calculateMerkleRoot,
  decryptEnclavePayload,
  deriveEnclaveKey,
  encryptEnclavePayload,
  hasEnclaveKey,
  randomBytes,
} from "../src/lib/chancelleryCrypto";
import {
  LEGACY_LIBRARY_KEY,
  __resetVaultForTests,
  getAllTheatresFromVault,
  migrateLegacyStorage,
  readRawTheatreRecords,
  saveTheatreToVault,
  vaultBackendKind,
  type SavedTheatreSlot,
} from "../src/lib/chancelleryDb";
import {
  changeEnclavePassphrase,
  clearEnclavePassphrase,
  lockEnclave,
  setEnclavePassphrase,
  unsealEnclave,
} from "../src/lib/chancelleryEnclave";
import { ARCHIVE_FORMAT, ARCHIVE_SCHEMA, ARCHIVE_VERSION, validateArchive } from "../src/components/desk/archive";
import { archiveMerkleRoot, archiveStateDigest, sha256 } from "../src/components/desk/integrity";
import { applyInscriptions, statutoryClearances, type Signals } from "../src/components/desk/engine";
import { apostille, mintDispatch } from "../src/components/desk/registry";
import { parseApostille, verifyApostilleText, verifyArchive, verifyArchiveText } from "../src/lib/attestation";

const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

// A minimal window/localStorage so the vault's legacy migration can run under bun (no IndexedDB here: memory fallback).
const store = new Map<string, string>();
const localStorageShim = {
  getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
  setItem: (k: string, v: string) => void store.set(k, String(v)),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
};
(globalThis as unknown as { window: unknown }).window = globalThis;
(globalThis as unknown as { localStorage: unknown }).localStorage = localStorageShim;

const SIGNALS: Signals = {
  bonds: { interpersonal: 3.4, communal: 2.6, intergenerational: 3.0, institutional: 4.1 },
  theatre: "Sample Basin Theatre",
  weakestScore: 2.6,
  covenants: ["sunset audit"],
} as Signals;

const slot = (id: string, name: string): SavedTheatreSlot => ({
  id,
  name,
  updatedAt: "2026-01-01T00:00:00.000Z",
  profile: { theatre: name, parties: "Party A; Party B", officer: "", classification: "", bonds: SIGNALS.bonds } as SavedTheatreSlot["profile"],
  binder: [{ id: "b1", title: "Memo", text: `${name} memorandum` }],
  signals: SIGNALS,
});

beforeEach(() => {
  lockEnclave();
  __resetVaultForTests();
  store.clear();
});

/* ---------------- crypto ---------------- */

test("AES-256-GCM round trip with PBKDF2 key, fresh 12-byte IV per call", async () => {
  const salt = randomBytes(16);
  const key = await deriveEnclaveKey("correct horse battery", salt);
  expect(key.algorithm).toMatchObject({ name: "AES-GCM", length: 256 });
  expect(key.extractable).toBe(false);
  const a = await encryptEnclavePayload("Sample Basin Theatre: bonds 3.4/2.6", key);
  const b = await encryptEnclavePayload("Sample Basin Theatre: bonds 3.4/2.6", key);
  expect(a.ivHex).toMatch(/^[0-9a-f]{24}$/);
  expect(a.ivHex).not.toBe(b.ivHex);
  expect(a.ciphertextHex).not.toBe(b.ciphertextHex);
  expect(a.ciphertextHex).toMatch(/^[0-9a-f]+$/);
  expect(await decryptEnclavePayload(a.ciphertextHex, a.ivHex, key)).toBe("Sample Basin Theatre: bonds 3.4/2.6");
});

test("wrong passphrase or altered ciphertext throws the exact diplomatic error", async () => {
  const salt = randomBytes(16);
  const right = await deriveEnclaveKey("correct horse battery", salt);
  const wrong = await deriveEnclaveKey("incorrect horse battery", salt);
  const { ciphertextHex, ivHex } = await encryptEnclavePayload("payload", right);
  await expect(decryptEnclavePayload(ciphertextHex, ivHex, wrong)).rejects.toThrow(TAG_MISMATCH);
  const flipped = (ciphertextHex[0] === "0" ? "1" : "0") + ciphertextHex.slice(1);
  await expect(decryptEnclavePayload(flipped, ivHex, right)).rejects.toThrow(TAG_MISMATCH);
  expect(TAG_MISMATCH).toBe("Authentication tag mismatch. Invalid passphrase or corrupted enclave payload.");
});

/* ---------------- Merkle ---------------- */

const EVENTS = [
  { at: "2026-01-02T03:04:05.000Z", kind: "MISSION_HYDRATED", detail: "Sample Basin Theatre" },
  { at: "2026-01-02T03:04:06.000Z", kind: "SHOCK_INJECTED", detail: "Drought displacement" },
  { at: "2026-01-02T03:04:07.000Z", kind: "MINUTE_MINTED", detail: "Ref SAMPLE-REF" },
];

test("Merkle root is deterministic, follows Node_i = SHA-256(Node_{i-1}+at+kind+detail), and changes on tamper", async () => {
  const r1 = await calculateMerkleRoot(EVENTS);
  const r2 = await calculateMerkleRoot(EVENTS.map((e) => ({ ...e })));
  expect(r1).toMatch(/^[0-9a-f]{64}$/);
  expect(r1).toBe(r2);
  let node = "";
  for (const e of EVENTS) node = await sha256(`${node}${e.at}${e.kind}${e.detail}`);
  expect(r1).toBe(node);
  expect(await calculateMerkleRoot([{ ...EVENTS[0] }, EVENTS[1], { ...EVENTS[2], detail: "Ref SAMPLE-REG" }])).not.toBe(r1);
  expect(await calculateMerkleRoot([EVENTS[1], EVENTS[0], EVENTS[2]])).not.toBe(r1);
  expect(await calculateMerkleRoot(EVENTS.slice(0, 2))).not.toBe(r1);
  expect(await calculateMerkleRoot([])).toBe(await sha256(""));
  expect(await archiveMerkleRoot(EVENTS)).toBe(r1);
});

/* ---------------- archive v4 ---------------- */

async function sealedArchive(signals: Signals = SIGNALS) {
  const effective = applyInscriptions(signals);
  const clearances = statutoryClearances(effective);
  const body = {
    format: ARCHIVE_FORMAT,
    schema: ARCHIVE_SCHEMA,
    version: ARCHIVE_VERSION,
    savedAt: "2026-01-02T03:04:08.000Z",
    profile: { theatre: "Sample Basin Theatre", parties: "", officer: "", classification: "", bonds: signals.bonds },
    binder: [],
    signals,
    ledger: {
      stateDigest: await archiveStateDigest(signals),
      clearancesPassed: clearances.filter((c) => c.passed).length,
      clearancesTotal: clearances.length,
      dispatchesIssued: 1,
      lastRef: "NV/VINC-SBT-0000000-0001",
      events: EVENTS,
      merkleRoot: await archiveMerkleRoot(EVENTS),
    },
  };
  const seal = await sha256(JSON.stringify(JSON.parse(JSON.stringify(body))));
  return { ...body, sha256Seal: seal };
}

test("archive v4 with ledger.merkleRoot validates; malformed roots and events are rejected; older versions still load", async () => {
  const a = await sealedArchive();
  expect(ARCHIVE_VERSION).toBe(4);
  expect(validateArchive(a)).toEqual({ ok: true, version: 4 });
  const noRoot = { ...a, ledger: { ...a.ledger, merkleRoot: undefined } };
  expect(validateArchive(JSON.parse(JSON.stringify(noRoot))).ok).toBe(true);
  for (const bad of [
    { ...a, ledger: { ...a.ledger, merkleRoot: "xyz" } },
    { ...a, ledger: { ...a.ledger, merkleRoot: "A".repeat(64) } },
    { ...a, ledger: { ...a.ledger, events: {} } },
    { ...a, ledger: { ...a.ledger, events: [{ at: 1, kind: "X", detail: "" }] } },
    { ...a, ledger: { ...a.ledger, stateDigest: "short" } },
  ]) {
    const v = validateArchive(bad);
    expect(v.ok).toBe(false);
    expect(typeof v.reason).toBe("string");
  }
  expect(validateArchive({ format: ARCHIVE_FORMAT, profile: { theatre: "Old" } })).toEqual({ ok: true, version: 1 });
  expect(validateArchive({ format: ARCHIVE_FORMAT, version: 2, profile: { theatre: "Old", bonds: {} } }).ok).toBe(true);
  expect(validateArchive({ format: ARCHIVE_FORMAT, version: 3, profile: {}, signals: {} }).ok).toBe(true);
});

test("verifier confirms an untouched archive and flags a tampered bond", async () => {
  const a = await sealedArchive();
  const ok = await verifyArchive(JSON.parse(JSON.stringify(a)));
  expect(ok.verdict).toBe("confirmed");
  expect(ok.clearances?.total).toBe(20);
  expect(ok.clearances?.passed).toBe(a.ledger.clearancesPassed);
  // 2.6 and exactly 3.0 are both breaches of the viable floor.
  expect(ok.floor?.breaches).toEqual([1, 2]);
  expect(ok.checks.find((c) => c.label === "Merkle session root")?.status).toBe("match");

  const tampered = JSON.parse(JSON.stringify(a));
  tampered.signals.bonds.communal = 3.6;
  const bad = await verifyArchiveText(JSON.stringify(tampered));
  expect(bad.verdict).toBe("mismatch");
  expect(bad.checks.find((c) => c.label === "State digest (SHA-256)")?.status).toBe("mismatch");
  expect(bad.checks.find((c) => c.label === "Archive seal (SHA-256)")?.status).toBe("mismatch");

  const events = JSON.parse(JSON.stringify(a));
  events.ledger.events[1].detail = "Edited";
  expect((await verifyArchive(events)).checks.find((c) => c.label === "Merkle session root")?.status).toBe("mismatch");

  expect((await verifyArchiveText("not json")).verdict).toBe("invalid");
  expect((await verifyArchive({ format: "other" })).verdict).toBe("invalid");
});

test("an apostille carries its canonical state, so a pasted one recomputes; tampering is caught; old ones are honest", async () => {
  const d = await mintDispatch(applyInscriptions(SIGNALS), "minute", "succession");
  const root = await calculateMerkleRoot(EVENTS);
  const text = `${apostille(d, root)}\n\nCHANCELLERY MINUTE\nBody text`;
  expect(text).toContain(`MERKLE SESSION ROOT: ${root}`);
  const parsed = parseApostille(text);
  expect(parsed.ref).toBe(d.ref);
  expect(parsed.state).toBe(d.stateDigest);
  expect(parsed.merkleRoot).toBe(root);
  const ok = await verifyApostilleText(text);
  expect(ok.verdict).toBe("confirmed");
  expect(ok.clearances).toMatchObject({ passed: d.clearancesPassed, total: 20 });
  expect(ok.floor?.breaches.length).toBeGreaterThan(0);

  const forged = text.replace(/STATUS  : \d+\//, "STATUS  : 19/");
  expect((await verifyApostilleText(forged)).verdict).toBe(d.clearancesPassed === 19 ? "confirmed" : "mismatch");
  const lines = text.split("\n");
  const ci = lines.findIndex((l) => l.startsWith("CANON"));
  lines[ci] = lines[ci].slice(0, -4) + (lines[ci].endsWith("AAAA") ? "BBBB" : "AAAA");
  expect((await verifyApostilleText(lines.join("\n"))).verdict).toBe("mismatch");

  const legacy = [
    "+--- VINCULUM PROTOCOL REGISTRY // SIGILLUM CANCELLARIAE ---+",
    `REF NO  : ${d.ref}`,
    `DIGEST  : ${d.digest}`,
    "STATUS  : 12/20 STATUTORY CLEARANCES // 3/7 GATES",
    "+-----------------------------------------------------------+",
  ].join("\n");
  const old = await verifyApostilleText(legacy);
  expect(old.verdict).toBe("unverifiable");
  expect(old.checks.some((c) => /recompute needs the archive/.test(c.note ?? ""))).toBe(true);
  expect((await verifyApostilleText("hello")).verdict).toBe("invalid");
});

/* ---------------- vault + enclave (memory fallback under bun) ---------------- */

test("vault falls back to memory without IndexedDB; legacy library migrates but the key is kept when nothing persists", async () => {
  expect(await vaultBackendKind()).toBe("memory");
  store.set(LEGACY_LIBRARY_KEY, JSON.stringify([slot("sample-basin", "Sample Basin"), { junk: true }]));
  await migrateLegacyStorage();
  const all = await getAllTheatresFromVault();
  expect(all.map((s) => s.id)).toEqual(["sample-basin"]);
  expect(store.has(LEGACY_LIBRARY_KEY)).toBe(true);
});

test("enclave: set seals every record (no plaintext), wrong passphrase errors, unseal/change/clear round trip", async () => {
  await saveTheatreToVault(slot("sample-basin", "Sample Basin"));
  await setEnclavePassphrase("first passphrase");
  let raw = JSON.stringify(await readRawTheatreRecords());
  expect(raw).not.toContain("Sample Basin");
  expect(raw).not.toContain("sample-basin");
  const [rec] = (await readRawTheatreRecords()) as unknown as { sealed: boolean; saltHex: string; ivHex: string; ciphertextHex: string }[];
  expect(rec.sealed).toBe(true);
  expect(rec.saltHex).toMatch(/^[0-9a-f]{32}$/);
  expect(rec.ivHex).toMatch(/^[0-9a-f]{24}$/);

  await saveTheatreToVault(slot("north-ridge", "North Ridge"));
  expect((await readRawTheatreRecords()).length).toBe(2);
  raw = JSON.stringify(await readRawTheatreRecords());
  expect(raw).not.toContain("North Ridge");

  lockEnclave();
  expect(hasEnclaveKey()).toBe(false);
  expect(await getAllTheatresFromVault()).toEqual([]);
  await expect(saveTheatreToVault(slot("x", "X"))).rejects.toThrow(/sealed/);
  await expect(unsealEnclave("wrong passphrase")).rejects.toThrow(TAG_MISMATCH);
  await unsealEnclave("first passphrase");
  expect((await getAllTheatresFromVault()).map((s) => s.name).sort()).toEqual(["North Ridge", "Sample Basin"]);

  await changeEnclavePassphrase("first passphrase", "second passphrase");
  lockEnclave();
  await expect(unsealEnclave("first passphrase")).rejects.toThrow(TAG_MISMATCH);
  await unsealEnclave("second passphrase");
  expect((await getAllTheatresFromVault()).length).toBe(2);
  expect((await readRawTheatreRecords()).length).toBe(2);

  await clearEnclavePassphrase("second passphrase");
  const plain = await readRawTheatreRecords();
  expect(plain.map((r) => r.id).sort()).toEqual(["north-ridge", "sample-basin"]);
  expect(JSON.stringify(plain)).toContain("Sample Basin");
});

/* ---------------- edge headers ---------------- */

const EXPECTED_CSP =
  "default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self'; connect-src 'self' https://*.lovable.cloud https://*.supabase.co data: blob:; frame-ancestors 'self' https://lovable.dev https://*.lovable.dev https://lovable.app https://*.lovable.app https://lovableproject.com https://*.lovableproject.com; object-src 'none'; base-uri 'self'; form-action 'self'; worker-src 'self' blob:; manifest-src 'self'; upgrade-insecure-requests";
const EXPECTED_PP =
  "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=(), accelerometer=(), gyroscope=(), magnetometer=()";

test("CSP is the hardened policy on every route; connect-src allows only self and the auth host", () => {
  const config = JSON.parse(read("vercel.json"));
  for (const source of ["/(.*)", "/dashboard", "/login"]) {
    const rule = config.headers.find((e: { source: string }) => e.source === source);
    const csp: string = rule.headers.find((h: { key: string }) => h.key === "Content-Security-Policy").value;
    expect(csp).toBe(EXPECTED_CSP);
    const d = Object.fromEntries(csp.split(";").map((x) => x.trim().split(/\s+/)).map(([k, ...v]) => [k, v]));
    expect(d["font-src"]).toEqual(["'self'"]);
    expect(d["connect-src"].filter((v: string) => /^(https?|wss?):/.test(v))).toEqual(["https://*.lovable.cloud", "https://*.supabase.co"]);
    for (const a of ["'self'", "https://*.lovable.app", "https://*.lovableproject.com", "https://*.lovable.dev"]) expect(d["frame-ancestors"]).toContain(a);
  }
  expect(read("index.html")).not.toMatch(/fonts\.googleapis|fonts\.gstatic/);
});

test("Permissions-Policy is exactly the specified sensor lockdown", () => {
  const config = JSON.parse(read("vercel.json"));
  const rule = config.headers.find((e: { source: string }) => e.source === "/(.*)");
  expect(rule.headers.find((h: { key: string }) => h.key === "Permissions-Policy").value).toBe(EXPECTED_PP);
});

test("verifier and vault code import no auth or dashboard module and make no network calls", () => {
  for (const f of ["src/components/AttestationVerifier.tsx", "src/lib/attestation.ts", "src/lib/chancelleryCrypto.ts", "src/lib/chancelleryDb.ts", "src/lib/chancelleryEnclave.ts"]) {
    const src = read(f);
    expect(src).not.toMatch(/integrations\/supabase|offlineAuth|pages\/Dashboard|pages\/Login/);
    expect(src).not.toMatch(/\bfetch\(|XMLHttpRequest|sendBeacon|WebSocket|supabase\./);
  }
  expect(read("src/pages/Practice.tsx")).not.toMatch(/\/dashboard|\/login/);
});
