/**
 * Sovereign mission archive (.vinculum): schema, filename and validation. Pure
 * functions, no React and no storage, so the format can be tested on its own.
 *
 * Version history
 *   1  profile and binder.
 *   2  adds profile.bonds.
 *   3  adds the live mission signals.
 *   4  adds the `schema` field, the registry ledger state and the session ledger,
 *      and `ledger.merkleRoot`: the Merkle session root over `ledger.events`.
 *      Version 4 files written before the root existed carry no merkleRoot and
 *      still validate; every older version still loads.
 */
export const ARCHIVE_FORMAT = "vinculum-mission-archive";
export const ARCHIVE_SCHEMA = "vinculum.mission-archive";
export const ARCHIVE_VERSION = 4;

/** Registry and gate state at the moment of export. The references themselves are never reused on import. */
export type ArchiveLedger = {
  /** SHA-256 of the normalised mission state (no nonce), as shown on the dashboard. */
  stateDigest: string;
  /** Statutory clearances passed / total at export (the twenty Articles 1.1 to 5.4). */
  clearancesPassed: number;
  clearancesTotal: number;
  /** Dispatches minted in the exporting session, and the last reference among them. */
  dispatchesIssued: number;
  lastRef?: string;
  /** Session ledger entries (UTC), carried for the debrief; not replayed on import. */
  events: { at: string; kind: string; detail: string }[];
  /** calculateMerkleRoot(events): Node_i = SHA-256(Node_{i-1} + at + kind + detail). 64 hex. */
  merkleRoot?: string;
};

export const HEX64 = /^[0-9a-f]{64}$/;

/** `reason` is set whenever `ok` is false. */
export type ArchiveValidation = { ok: boolean; version: number; reason?: string };

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);

/** Structural check before anything is restored. Bad files are rejected with a reason, never half-loaded. */
export function validateArchive(data: unknown): ArchiveValidation {
  if (!isObj(data)) return { ok: false, version: 0, reason: "The file is not a JSON object." };
  if (data.format !== ARCHIVE_FORMAT) return { ok: false, version: 0, reason: "The file is not a Vinculum mission archive." };
  const v = data.version;
  if (v !== undefined && (typeof v !== "number" || !Number.isInteger(v) || v < 1)) {
    return { ok: false, version: 0, reason: "The archive version is not a positive whole number." };
  }
  const version = typeof v === "number" ? v : 1;
  if (version > ARCHIVE_VERSION) return { ok: false, version: 0, reason: "This archive was saved by a newer version of the vault." };
  if (version >= 4 && data.schema !== ARCHIVE_SCHEMA) return { ok: false, version: 0, reason: `Schema mismatch: expected ${ARCHIVE_SCHEMA}.` };
  if (!isObj(data.profile)) return { ok: false, version: 0, reason: "The archive carries no mission profile." };
  const p = data.profile;
  for (const k of ["theatre", "parties", "officer", "classification"]) {
    if (p[k] !== undefined && typeof p[k] !== "string") return { ok: false, version: 0, reason: `Profile field "${k}" is not text.` };
  }
  if (p.bonds !== undefined && !isObj(p.bonds)) return { ok: false, version: 0, reason: "Profile bonds are not a bond vector." };
  if (data.binder !== undefined && !Array.isArray(data.binder)) return { ok: false, version: 0, reason: "The binder is not a list." };
  if (data.signals !== undefined && !isObj(data.signals)) return { ok: false, version: 0, reason: "The mission signals are not an object." };
  if (data.ledger !== undefined && !isObj(data.ledger)) return { ok: false, version: 0, reason: "The ledger state is not an object." };
  if (isObj(data.ledger)) {
    const l = data.ledger;
    if (l.events !== undefined) {
      if (!Array.isArray(l.events)) return { ok: false, version: 0, reason: "The session ledger events are not a list." };
      for (const e of l.events) {
        if (!isObj(e) || typeof e.at !== "string" || typeof e.kind !== "string" || typeof e.detail !== "string") {
          return { ok: false, version: 0, reason: "A session ledger event is malformed." };
        }
      }
    }
    if (l.merkleRoot !== undefined && (typeof l.merkleRoot !== "string" || !HEX64.test(l.merkleRoot))) {
      return { ok: false, version: 0, reason: "The Merkle session root is not a 64-character hex digest." };
    }
    if (l.stateDigest !== undefined && (typeof l.stateDigest !== "string" || !HEX64.test(l.stateDigest))) {
      return { ok: false, version: 0, reason: "The state digest is not a 64-character hex digest." };
    }
  }
  return { ok: true, version };
}

/** VINCULUM-MISSION-[THEATRE]-[YYYY-MM-DD].vinculum, the date in UTC. */
export function archiveFileName(theatre: string, at: Date = new Date()): string {
  const t = theatre.trim().replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "").toUpperCase().slice(0, 48) || "UNNAMED";
  return `VINCULUM-MISSION-${t}-${at.toISOString().slice(0, 10)}.vinculum`;
}
