/**
 * Cryptographic Dispatch Registry. Browser-local, no network, no server.
 *
 * Every document, cable, note or attestation that leaves a desk is minted here and
 * receives a reference of the form NV/VINC-[SIGIL]-[EPOCH_HEX]-[SEQ] and a SHA-256
 * digest of the normalised mission state. A monotonic counter (kept in localStorage)
 * and an 8-byte random nonce guarantee that no two dispatches share a reference or a
 * digest. Reissuing an unchanged state carries a revision suffix (-REV.B, -REV.C ...)
 * and still gets its own nonce and digest. Nothing here is a calendar date: the
 * UTC instant enters the hash only and is never displayed.
 */
import { useEffect, useState } from "react";
import { inscriptionLines, stageGateAudit, statutoryClearances, VIABLE_FLOOR, holdsFloor, type Signals } from "./engine";
import { theatreById } from "./theatres";
import { toBase64Utf8 } from "@/lib/chancelleryCrypto";

export type DispatchKind = "note-verbale" | "demarche" | "aide-memoire" | "cable" | "dossier" | "attestation" | "text" | "minute";

export type Dispatch = {
  ref: string;
  digest: string;
  nonce: string;
  seq: number;
  revision: string | null;
  kind: DispatchKind;
  /** Desk the dispatch was minted from, when known. */
  desk?: string;
  gatesPassed: number;
  gatesTotal: number;
  clearancesPassed: number;
  clearancesTotal: number;
  floorValidated: boolean;
  /** SHA-256 of the canonical state JSON (no nonce): recomputable by any verifier. */
  stateDigest: string;
  /** The canonical state JSON itself, exactly as hashed into stateDigest. */
  canon: string;
};

const SEQ_KEY = "vs:registry_seq";

/** Session ledger: every reference and digest emitted in this tab. Never reused. */
const issuedRefs = new Set<string>();
const issuedDigests = new Set<string>();
/** State key to number of times that exact state has been issued. */
const revisions = new Map<string, number>();
const listeners = new Set<(d: Dispatch) => void>();
/** The most recent reference minted in this tab, for the archive's ledger state. */
let lastRef: string | undefined;

function hex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return hex(new Uint8Array(buf));
}

/** Theatre sigil: initials of the theatre name (Great Lakes Region gives GLR). */
export function theatreSigil(theatre?: string): string {
  const words = (theatre ?? "").replace(/[^A-Za-z\s]/g, " ").split(/\s+/).filter(Boolean);
  const stop = new Set(["of", "the", "and", "de", "la", "du"]);
  const initials = words.filter((w) => !stop.has(w.toLowerCase())).map((w) => w[0].toUpperCase()).join("");
  return (initials || "UNK").slice(0, 4);
}

/** In-memory floor for the counter, so it stays monotonic even when storage is unavailable. */
let memSeq = 0;

function nextSeq(): number {
  let n = memSeq;
  try {
    n = Math.max(n, Number(localStorage.getItem(SEQ_KEY)) || 0);
  } catch {
    // Storage unavailable: the in-memory ledger still prevents collisions in this tab.
  }
  n += 1;
  memSeq = n;
  try {
    localStorage.setItem(SEQ_KEY, String(n));
  } catch {
    // ignore
  }
  return n;
}

/** The mission state the digest covers, without nonce or instant. Stable key order. */
export function stateSnapshot(s: Signals) {
  const b = s.bonds;
  return {
    vector: b ? [b.interpersonal, b.communal, b.intergenerational, b.institutional] : [],
    activeCase: (s.theatre ?? "").trim(),
    gateClearances: statutoryClearances(s).map((c) => `${c.id}:${c.passed ? 1 : 0}`),
    covenants: [...(s.covenants ?? [])],
    inscriptions: inscriptionLines(s),
  };
}

/** Live state digest (no nonce): changes the moment any bond, gate or covenant changes. */
export function useStateDigest(s: Signals): string {
  const [d, setD] = useState("");
  const key = JSON.stringify(stateSnapshot(s));
  useEffect(() => {
    let live = true;
    sha256Hex(key).then((h) => live && setD(h));
    return () => {
      live = false;
    };
  }, [key]);
  return d;
}

/** Mint a fresh, collision-proof dispatch for the current bus state. */
export async function mintDispatch(s: Signals, kind: DispatchKind, desk?: string): Promise<Dispatch> {
  const snap = stateSnapshot(s);
  const canon = JSON.stringify(snap);
  const stateDigest = await sha256Hex(canon);
  const stateKey = `${kind}|${desk ?? ""}|${JSON.stringify(snap)}`;
  const prior = revisions.get(stateKey) ?? 0;
  revisions.set(stateKey, prior + 1);
  const revision = prior > 0 ? String.fromCharCode(65 + Math.min(prior, 25)) : null;
  const audit = stageGateAudit(s);
  const gatesPassed = audit.gates.filter((g) => g.passed).length;
  const clearances = statutoryClearances(s);
  const clearancesPassed = clearances.filter((c) => c.passed).length;
  const floorValidated = s.weakestScore !== undefined && holdsFloor(s.weakestScore);
  const preset = theatreById(s.presetId);
  const sigil = preset && preset.name === (s.theatre ?? "").trim() ? preset.sigil : theatreSigil(s.theatre);

  for (;;) {
    const seq = nextSeq();
    const nonce = hex(crypto.getRandomValues(new Uint8Array(8)));
    const epochHex = (Math.floor(performance.timeOrigin + performance.now()) >>> 0).toString(16).toUpperCase().slice(-7).padStart(7, "0");
    const ref = `NV/VINC-${sigil}-${epochHex}-${String(seq % 10000).padStart(4, "0")}${revision ? `-REV.${revision}` : ""}`;
    const digest = await sha256Hex(JSON.stringify({ ...snap, desk: desk ?? null, nonce, timestampUtc: new Date().toISOString(), kind, seq }));
    if (issuedRefs.has(ref) || issuedDigests.has(digest)) continue;
    issuedRefs.add(ref);
    issuedDigests.add(digest);
    lastRef = ref;
    const d: Dispatch = { ref, digest, nonce, seq, revision, kind, desk, gatesPassed, gatesTotal: audit.gates.length, clearancesPassed, clearancesTotal: clearances.length, floorValidated, stateDigest, canon };
    listeners.forEach((fn) => fn(d));
    return d;
  }
}

/** Subscribe to every dispatch minted in this tab (the Protocol Wire listens here). */
export function onDispatch(fn: (d: Dispatch) => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/**
 * Emergency zeroization: forget the state snapshots, digests and references
 * held for this tab. The sequence floor is kept, so numbering stays monotonic
 * and a reference is still never reissued.
 */
export function purgeRegistrySession() {
  issuedRefs.clear();
  issuedDigests.clear();
  revisions.clear();
  lastRef = undefined;
}

/** The last reference minted in this tab, if any. */
export function lastIssuedRef(): string | undefined {
  return lastRef;
}

/** Number of distinct dispatches issued this session. */
export function ledgerSize(): number {
  return issuedRefs.size;
}

export const APOSTILLE_TOP = "+--- VINCULUM PROTOCOL REGISTRY // SIGILLUM CANCELLARIAE ---+";
export const APOSTILLE_BOTTOM = `+${"-".repeat(59)}+`;
/** Indent of CANON continuation lines (aligned under the value column). */
export const CANON_INDENT = " ".repeat(10);
const CANON_WIDTH = 64;

/**
 * The ASCII apostille block printed at the head of every transmittal.
 * DIGEST is the nonce-salted dispatch digest (unique per dispatch). STATE is the
 * SHA-256 of the canonical state JSON, which the CANON lines carry in base64, so
 * the public Attestation Verifier can recompute it with no archive and no network.
 * The Merkle session root line is added when the ledger root is known.
 */
export function apostille(d: Dispatch, merkleRoot?: string): string {
  const canon = d.canon ? toBase64Utf8(d.canon) : "";
  const chunks = canon.match(new RegExp(`.{1,${CANON_WIDTH}}`, "g")) ?? [];
  return [
    APOSTILLE_TOP,
    `REF NO  : ${d.ref}`,
    `DIGEST  : ${d.digest}`,
    ...(d.stateDigest ? [`STATE   : ${d.stateDigest}`] : []),
    `STATUS  : ${d.clearancesPassed}/${d.clearancesTotal} STATUTORY CLEARANCES // ${d.gatesPassed}/${d.gatesTotal} GATES`,
    `FLOOR   : VIABLE FLOOR ${VIABLE_FLOOR.toFixed(1)} ${d.floorValidated ? "VALIDATED" : "BREACHED"}`,
    `SEAL    : EXEQUATUR CANONICALIS // UNALTERABLE RECORD`,
    ...(merkleRoot ? [`MERKLE SESSION ROOT: ${merkleRoot}`] : []),
    ...chunks.map((c, i) => (i === 0 ? `CANON   : ${c}` : `${CANON_INDENT}${c}`)),
    APOSTILLE_BOTTOM,
  ].join("\n");
}

/* ------------------------------------------------------------------ */
/* Chancellery Apostille (Desk 18, Mission Binder)                     */
/* ------------------------------------------------------------------ */

/**
 * Deterministic canonical JSON: object keys sorted at every depth, undefined members
 * dropped, non-finite numbers written as null. The same state always yields the same
 * bytes, so any verifier can recompute the digest offline.
 */
export function canonicalJson(value: unknown): string {
  const norm = (v: unknown): unknown => {
    if (v === null || typeof v === "string" || typeof v === "boolean") return v;
    if (typeof v === "number") return Number.isFinite(v) ? v : null;
    if (Array.isArray(v)) return v.map((x) => (x === undefined || typeof x === "function" ? null : norm(x)));
    if (typeof v === "object") {
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(v as object).sort()) {
        const x = (v as Record<string, unknown>)[k];
        if (x === undefined || typeof x === "function") continue;
        out[k] = norm(x);
      }
      return out;
    }
    return null;
  };
  return JSON.stringify(norm(value));
}

export type ApostilleEntry = { id: string; title: string; text: string };

/** The sealed body: every live signal on the bus and every binder tab, in binder order. */
export const apostilleBody = (s: Signals, entries: ReadonlyArray<ApostilleEntry>) => ({
  signals: s,
  binder: entries.map((e, i) => ({ tab: i + 1, id: e.id, title: e.title, text: e.text })),
});

export const ATTEST_FORMAT = "vinculum.attest.v1";

export type ChancelleryApostille = {
  format: typeof ATTEST_FORMAT;
  algorithm: "SHA-256";
  ref: string;
  /** SHA-256 of `canonical`, computed in this browser with Web Crypto. */
  digest: string;
  /** The registry state digest for the same moment (no nonce). */
  stateDigest: string;
  theatreCode: string;
  tabs: number;
  signalKeys: number;
  clearancesPassed: number;
  clearancesTotal: number;
  gatesPassed: number;
  gatesTotal: number;
  floorValidated: boolean;
  /** Canonical JSON of { ref, signals, binder }, exactly as hashed into `digest`. */
  canonical: string;
  /** Canonical JSON of the body without the reference: compared to tell whether the seal is current. */
  bodyKey: string;
};

/**
 * Seal & mint: draws a registry reference NV/VINC-[THEATRE_CODE]-[EPOCH]-[SEQ] from the
 * monotonic counter, then hashes the canonical JSON of the reference, the live signals
 * and the binder entries with SHA-256 in the client runtime. Nothing leaves the browser.
 */
export async function mintChancelleryApostille(s: Signals, entries: ReadonlyArray<ApostilleEntry>): Promise<ChancelleryApostille> {
  const d = await mintDispatch(s, "attestation", "binder");
  const body = apostilleBody(s, entries);
  const canonical = canonicalJson({ format: ATTEST_FORMAT, ref: d.ref, ...body });
  const digest = await sha256Hex(canonical);
  return {
    format: ATTEST_FORMAT,
    algorithm: "SHA-256",
    ref: d.ref,
    digest,
    stateDigest: d.stateDigest,
    theatreCode: d.ref.split("-")[1] ?? "UNK",
    tabs: entries.length,
    signalKeys: Object.keys(JSON.parse(canonicalJson(s)) as object).length,
    clearancesPassed: d.clearancesPassed,
    clearancesTotal: d.clearancesTotal,
    gatesPassed: d.gatesPassed,
    gatesTotal: d.gatesTotal,
    floorValidated: d.floorValidated,
    canonical,
    bodyKey: canonicalJson(body),
  };
}

/** Recompute the digest of an attestation file's canonical payload. */
export async function verifyChancelleryApostille(a: Pick<ChancelleryApostille, "canonical" | "digest">): Promise<boolean> {
  return (await sha256Hex(a.canonical)) === a.digest;
}

const BOX_INNER = 76;

/** Tamper-evident ASCII certificate, fixed width, monospace borders. */
export function apostilleCertificate(a: ChancelleryApostille): string {
  const title = "+--- [CHANCELLERY APOSTILLE] ";
  const top = `${title}${"-".repeat(BOX_INNER + 3 - title.length)}+`;
  const rows: [string, string][] = [
    ["REF NO", a.ref],
    ["SHA-256", a.digest],
    ["STATE", a.stateDigest],
    ["THEATRE", a.theatreCode],
    ["BINDER", `${a.tabs} TAB${a.tabs === 1 ? "" : "S"} // ${a.signalKeys} LIVE SIGNALS SEALED`],
    ["STATUS", `${a.clearancesPassed}/${a.clearancesTotal} STATUTORY CLEARANCES // ${a.gatesPassed}/${a.gatesTotal} GATES`],
    ["FLOOR", `VIABLE FLOOR ${VIABLE_FLOOR.toFixed(1)} ${a.floorValidated ? "VALIDATED" : "BREACHED"}`],
    ["SEAL", "EXEQUATUR CANONICALIS // UNALTERABLE RECORD"],
    ["VERIFY", "SHA-256 OF THE CANONICAL JSON IN THE .VINCULUM.ATTEST.JSON FILE"],
  ];
  const lines: string[] = [];
  for (const [k, v] of rows) {
    const head = `${k.padEnd(8)} : `;
    const width = BOX_INNER - head.length;
    for (let i = 0; i < Math.max(1, v.length); i += width) {
      const chunk = v.slice(i, i + width);
      lines.push(`| ${(i === 0 ? head : " ".repeat(head.length)) + chunk.padEnd(width)} |`);
    }
  }
  return [top, ...lines, `+${"-".repeat(BOX_INNER + 2)}+`].join("\n");
}

/** The raw verifiable payload offered for download, pretty-printed for reading. */
export function apostilleFile(a: ChancelleryApostille): string {
  const { bodyKey: _bodyKey, ...file } = a;
  return JSON.stringify({ ...file, payload: JSON.parse(a.canonical) }, null, 2);
}
