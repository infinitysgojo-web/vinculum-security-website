import { applyInscriptions, type Signals } from "./engine";
import { stateSnapshot } from "./registry";
import { calculateMerkleRoot } from "@/lib/chancelleryCrypto";

export { calculateMerkleRoot };

/** SHA-256 hex digest computed locally with the browser's Web Crypto. Nothing leaves the device. */
export async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

const BAR = "=".repeat(64);
const STAMP_HEAD = "INTEGRITY STAMP (TAMPER-EVIDENT AUDIT RECORD)";

/** The integrity footer appended to every exported chancellery text. */
export const integrityFooter = (hash: string, stamp: string) =>
  `\n\n${BAR}\n${STAMP_HEAD}\n  SHA-256 Digest : ${hash}\n  Platform       : Vinculum Security Client-Side Cryptographic Seal\n  Re-hash the document text above this delimiter to verify chain of custody.\n${BAR}`;

/** Short form for on-screen display. */
export const shortHash = (h: string) => (h ? `${h.slice(0, 10)}…${h.slice(-8)}` : "computing…");

/**
 * Hash the text at the moment of export and append the footer. Hashing on demand
 * (rather than reading a cached state value) means a copy or download can never
 * carry an empty or stale digest.
 */
export async function sealText(text: string): Promise<{ hash: string; stamped: string }> {
  const hash = await sha256(text);
  return { hash, stamped: `${text}${integrityFooter(hash, new Date().toISOString())}` };
}

export type SealVerdict =
  | { status: "valid"; hash: string }
  | { status: "tampered"; expected: string; actual: string }
  | { status: "unsealed" };

/**
 * Verify a text previously sealed by `sealText`: split at the last integrity delimiter,
 * re-hash everything above it and compare with the recorded digest.
 */
export async function verifySealedText(stamped: string): Promise<SealVerdict> {
  const marker = `\n\n${BAR}\n${STAMP_HEAD}\n`;
  const at = stamped.lastIndexOf(marker);
  if (at < 0) return { status: "unsealed" };
  const body = stamped.slice(0, at);
  const m = /SHA-256 Digest : ([0-9a-f]{64})/.exec(stamped.slice(at));
  if (!m) return { status: "unsealed" };
  const actual = await sha256(body);
  return actual === m[1] ? { status: "valid", hash: actual } : { status: "tampered", expected: m[1], actual };
}

/**
 * Canonical state JSON for a mission archive: the normalised bond vector, active
 * case, twenty gate clearances, covenants and inscriptions, with inscriptions
 * applied, exactly as the dashboard hashes it into ledger.stateDigest.
 */
export const canonicalArchiveState = (signals: Signals) => JSON.stringify(stateSnapshot(applyInscriptions(signals)));

/** ledger.stateDigest for an archive. */
export const archiveStateDigest = (signals: Signals) => sha256(canonicalArchiveState(signals));

/** ledger.merkleRoot for an archive (version 4): the Merkle session root over its events. */
export const archiveMerkleRoot = (events: ReadonlyArray<{ at: string; kind: string; detail: string }>) => calculateMerkleRoot(events);
