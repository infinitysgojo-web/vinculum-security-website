/**
 * Air-gapped attestation: pure verification of a .vinculum mission archive or a
 * pasted NV/VINC- apostille. Recomputes every digest with the same canonical
 * form the dashboard uses (integrity.ts and registry.ts). No network, no storage,
 * no auth or dashboard module.
 */
import { timingSafeEqualText } from "@/lib/chancelleryCrypto";
import { ARCHIVE_SCHEMA, validateArchive } from "@/components/desk/archive";
import { applyInscriptions, breachesFloor, statutoryClearances, VIABLE_FLOOR, type Signals } from "@/components/desk/engine";
import { APOSTILLE_BOTTOM, APOSTILLE_TOP } from "@/components/desk/registry";
import { archiveMerkleRoot, archiveStateDigest, sha256, verifySealedText } from "@/components/desk/integrity";
import { fromBase64Utf8 } from "./chancelleryCrypto";
import { IMPORT_LIMITS, precheckJsonText } from "@/lib/payloadLimits";

export type CheckStatus = "match" | "mismatch" | "absent";
export type Check = { label: string; status: CheckStatus; recorded?: string; computed?: string; note?: string };
export type Verdict = "confirmed" | "mismatch" | "unverifiable" | "invalid";

export type AttestationReceipt = {
  source: "archive" | "apostille";
  verdict: Verdict;
  reference?: string;
  schema?: string;
  version?: number;
  checks: Check[];
  clearances?: { passed: number; total: number; recorded?: number };
  floor?: { vector: number[]; breaches: number[]; floor: number };
  merkleRoot?: string;
  timestamp?: string;
  reason?: string;
};

const BOND_LABELS = ["Interpersonal", "Communal", "Intergenerational", "Institutional"];
export const bondLabel = (i: number) => BOND_LABELS[i] ?? `Bond ${i + 1}`;

const verdictOf = (checks: Check[]): Verdict =>
  checks.some((c) => c.status === "mismatch") ? "mismatch" : checks.some((c) => c.status === "match") ? "confirmed" : "unverifiable";

const floorOf = (vector: number[]) => ({
  vector,
  floor: VIABLE_FLOOR,
  breaches: vector.map((x, i) => (breachesFloor(x) ? i : -1)).filter((i) => i >= 0),
});

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);

/** Verify a parsed .vinculum archive. */
export async function verifyArchive(data: unknown): Promise<AttestationReceipt> {
  const v = validateArchive(data);
  if (!v.ok) return { source: "archive", verdict: "invalid", checks: [], reason: v.reason };
  const a = data as Record<string, unknown>;
  const checks: Check[] = [];

  // 1. Archive seal: SHA-256 of the body without the seal, exactly as the vault checks it on import.
  if (typeof a.sha256Seal === "string") {
    const { sha256Seal, ...body } = a;
    const computed = await sha256(JSON.stringify(body));
    checks.push({ label: "Archive seal (SHA-256)", status: timingSafeEqualText(computed, sha256Seal) ? "match" : "mismatch", recorded: sha256Seal, computed });
  } else {
    checks.push({ label: "Archive seal (SHA-256)", status: "absent", note: "No seal on this file (saved before sealing)." });
  }

  const ledger = isObj(a.ledger) ? a.ledger : undefined;
  const signals = isObj(a.signals) ? (a.signals as Signals) : undefined;

  // 2. State digest over the normalised bond vector and signals.
  let effective: Signals | undefined;
  if (signals) {
    try {
      effective = applyInscriptions(signals);
    } catch {
      effective = undefined;
    }
  }
  if (ledger && typeof ledger.stateDigest === "string" && signals) {
    let computed = "";
    try {
      computed = await archiveStateDigest(signals);
    } catch {
      computed = "";
    }
    checks.push({ label: "State digest (SHA-256)", status: computed && timingSafeEqualText(computed, ledger.stateDigest) ? "match" : "mismatch", recorded: ledger.stateDigest, computed: computed || "not computable" });
  } else {
    checks.push({ label: "State digest (SHA-256)", status: "absent", note: "This archive version records no state digest." });
  }

  // 3. Merkle session root over the ledger events.
  let merkleRoot: string | undefined;
  if (ledger && Array.isArray(ledger.events)) {
    merkleRoot = await archiveMerkleRoot(ledger.events as { at: string; kind: string; detail: string }[]);
    if (typeof ledger.merkleRoot === "string") {
      checks.push({ label: "Merkle session root", status: timingSafeEqualText(merkleRoot, ledger.merkleRoot) ? "match" : "mismatch", recorded: ledger.merkleRoot, computed: merkleRoot });
    } else {
      checks.push({ label: "Merkle session root", status: "absent", computed: merkleRoot, note: "Root computed from the events; none was recorded." });
    }
  }

  // 4. The twenty statutory clearances, recomputed from the signals.
  let clearances: AttestationReceipt["clearances"];
  if (effective) {
    try {
      const list = statutoryClearances(effective);
      clearances = {
        passed: list.filter((c) => c.passed).length,
        total: list.length,
        recorded: ledger && typeof ledger.clearancesPassed === "number" ? ledger.clearancesPassed : undefined,
      };
      if (clearances.recorded !== undefined) {
        checks.push({
          label: "Statutory clearance count",
          status: clearances.recorded === clearances.passed ? "match" : "mismatch",
          recorded: `${clearances.recorded} / ${ledger?.clearancesTotal ?? clearances.total}`,
          computed: `${clearances.passed} / ${clearances.total}`,
        });
      }
    } catch {
      clearances = undefined;
    }
  }

  // 5. Viable floor: any bond at or below 3.0 is a breach (the engine's rule).
  const b = (signals?.bonds ?? (isObj(a.profile) ? (a.profile as { bonds?: unknown }).bonds : undefined)) as Record<string, unknown> | undefined;
  const vector = b ? ["interpersonal", "communal", "intergenerational", "institutional"].map((k) => Number(b[k])).filter((x) => Number.isFinite(x)) : [];

  return {
    source: "archive",
    verdict: verdictOf(checks),
    reference: ledger && typeof ledger.lastRef === "string" ? ledger.lastRef : undefined,
    schema: typeof a.schema === "string" ? a.schema : v.version >= 4 ? ARCHIVE_SCHEMA : "(pre-schema archive)",
    version: v.version,
    checks,
    clearances,
    floor: vector.length ? floorOf(vector) : undefined,
    merkleRoot,
    timestamp: typeof a.savedAt === "string" ? a.savedAt : undefined,
  };
}

/** Parse a .vinculum file's text. */
export async function verifyArchiveText(text: string): Promise<AttestationReceipt> {
  // Structural limits on the raw text first, so a pathological file is refused before parsing.
  const pre = precheckJsonText(text, IMPORT_LIMITS);
  if (!pre.ok) return { source: "archive", verdict: "invalid", checks: [], reason: `The file exceeds the import limits (${pre.reason}).` };
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { source: "archive", verdict: "invalid", checks: [], reason: "The file is not valid JSON." };
  }
  return verifyArchive(data);
}

export type ParsedApostille = {
  ref?: string;
  digest?: string;
  state?: string;
  canon?: string;
  status?: { clearances: number; clearancesTotal: number; gates: number; gatesTotal: number };
  floor?: "VALIDATED" | "BREACHED";
  merkleRoot?: string;
  /** Everything after the apostille block (the document it heads), when present. */
  rest?: string;
};

/** Read the fields an apostille actually carries. Unknown lines are ignored. */
export function parseApostille(text: string): ParsedApostille {
  const t = text.replace(/\r\n?/g, "\n");
  const out: ParsedApostille = {};
  const ref = /REF(?: NO)?\s*:\s*(NV\/VINC-[A-Z0-9.-]+)/.exec(t);
  if (ref) out.ref = ref[1];
  const dg = /^DIGEST\s*:\s*([0-9a-f]{64})\s*$/m.exec(t);
  if (dg) out.digest = dg[1];
  const st = /^STATE\s*:\s*([0-9a-f]{64})\s*$/m.exec(t);
  if (st) out.state = st[1];
  const status = /STATUS\s*:\s*(\d+)\/(\d+) STATUTORY CLEARANCES \/\/ (\d+)\/(\d+) GATES/.exec(t);
  if (status) out.status = { clearances: +status[1], clearancesTotal: +status[2], gates: +status[3], gatesTotal: +status[4] };
  const fl = /FLOOR\s*:\s*VIABLE FLOOR [\d.]+ (VALIDATED|BREACHED)/.exec(t);
  if (fl) out.floor = fl[1] as ParsedApostille["floor"];
  const mk = /MERKLE SESSION ROOT:\s*([0-9a-f]{64})/.exec(t);
  if (mk) out.merkleRoot = mk[1];
  const lines = t.split("\n");
  const ci = lines.findIndex((l) => /^CANON\s*:\s*/.test(l));
  if (ci >= 0) {
    const parts = [lines[ci].replace(/^CANON\s*:\s*/, "").trim()];
    for (let i = ci + 1; i < lines.length && /^\s+[A-Za-z0-9+/=]+\s*$/.test(lines[i]); i++) parts.push(lines[i].trim());
    out.canon = parts.join("");
  }
  const top = t.indexOf(APOSTILLE_TOP);
  const bottom = top >= 0 ? t.indexOf(APOSTILLE_BOTTOM, top + APOSTILLE_TOP.length) : -1;
  if (bottom >= 0) {
    const rest = t.slice(bottom + APOSTILLE_BOTTOM.length).replace(/^\n\n?/, "");
    if (rest.trim()) out.rest = rest;
  }
  return out;
}

/** Verify a pasted apostille (with or without the document under it). */
export async function verifyApostilleText(text: string): Promise<AttestationReceipt> {
  const p = parseApostille(text);
  if (!p.ref && !p.digest) {
    return { source: "apostille", verdict: "invalid", checks: [], reason: "No NV/VINC- reference or registry digest found in the pasted text." };
  }
  const checks: Check[] = [];
  let clearances: AttestationReceipt["clearances"];
  let floor: AttestationReceipt["floor"];

  if (p.digest) {
    checks.push({
      label: "Dispatch digest",
      status: "absent",
      recorded: p.digest,
      note: "Nonce-salted per dispatch: recorded, not recomputable from text.",
    });
  }

  if (p.state && p.canon) {
    let canon = "";
    try {
      canon = fromBase64Utf8(p.canon);
    } catch {
      canon = "";
    }
    const computed = canon ? await sha256(canon) : "";
    checks.push({ label: "State digest (SHA-256)", status: computed && timingSafeEqualText(computed, p.state) ? "match" : "mismatch", recorded: p.state, computed: computed || "canonical state unreadable" });
    let snap: { vector?: unknown; gateClearances?: unknown } | undefined;
    try {
      snap = canon ? JSON.parse(canon) : undefined;
    } catch {
      snap = undefined;
    }
    if (snap && Array.isArray(snap.gateClearances)) {
      const list = snap.gateClearances.map(String);
      clearances = { passed: list.filter((g) => g.endsWith(":1")).length, total: list.length, recorded: p.status?.clearances };
      if (p.status) {
        checks.push({
          label: "Statutory clearance count",
          status: p.status.clearances === clearances.passed && p.status.clearancesTotal === clearances.total ? "match" : "mismatch",
          recorded: `${p.status.clearances} / ${p.status.clearancesTotal}`,
          computed: `${clearances.passed} / ${clearances.total}`,
        });
      }
    }
    if (snap && Array.isArray(snap.vector)) {
      const vector = snap.vector.map(Number).filter((x) => Number.isFinite(x));
      if (vector.length) floor = floorOf(vector);
    }
  } else if (p.state || p.digest) {
    checks.push({
      label: "State digest (SHA-256)",
      status: "absent",
      recorded: p.state ?? p.digest,
      note: "Digest recorded; recompute needs the archive (this apostille carries no canonical state).",
    });
    if (p.status) clearances = { passed: p.status.clearances, total: p.status.clearancesTotal, recorded: p.status.clearances };
  }

  if (p.rest && /INTEGRITY STAMP/.test(p.rest)) {
    const v = await verifySealedText(p.rest);
    if (v.status === "valid") checks.push({ label: "Document integrity stamp", status: "match", computed: v.hash });
    else if (v.status === "tampered") checks.push({ label: "Document integrity stamp", status: "mismatch", recorded: v.expected, computed: v.actual });
  }

  if (p.merkleRoot) {
    checks.push({ label: "Merkle session root", status: "absent", recorded: p.merkleRoot, note: "Recorded; recompute needs the archive's session events." });
  }

  return {
    source: "apostille",
    verdict: verdictOf(checks),
    reference: p.ref,
    checks,
    clearances,
    floor,
    merkleRoot: p.merkleRoot,
  };
}

/** Floor reading recorded on the apostille, for display beside the recomputed one. */
export const recordedFloor = (text: string) => parseApostille(text).floor;
