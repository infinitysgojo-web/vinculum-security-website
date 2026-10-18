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
