/**
 * Browser-local export and import packages for workspaces: backup, handover, device
 * transfer and sanitized training derivatives. Everything here runs in this browser.
 *
 * A package carries a SHA-256 digest of its canonical workspace list, computed with Web
 * Crypto. That digest is a local integrity reference only: it shows whether the file
 * changed since it was exported. It is not encryption, access control, a signature,
 * third-party certification or legal proof, and it says nothing about who made the file.
 */
import { canonicalJson } from "@/components/desk/registry";
import { sha256 } from "@/components/desk/integrity";
import { IMPORT_LIMITS, checkPayload, precheckJsonText, utf8Bytes } from "@/lib/payloadLimits";
import { openEnvelope, sealEnvelope, type EncryptedPayload } from "@/lib/chancelleryCrypto";
import { WORKSPACE_SCHEMA, newId, quarantineEntry, validateRecord, type Workspace, type WorkspaceStore } from "./workspace";

export const PACKAGE_FORMAT = "vinculum-workspace-package";
export const PACKAGE_VERSION = 1;
/** The app's export format generation, carried for diagnostics. */
export const APP_FORMAT = "vinculum-two-mode-1";
/** Envelope fields this build understands. A package may name others as `critical`; unknown critical fields are refused. */
export const KNOWN_FIELDS = ["format", "packageVersion", "appFormat", "workspaceSchema", "purpose", "exportedAt", "notice", "digest", "workspaces", "lineage", "critical"] as const;

export type PackagePurpose = "backup" | "handover" | "transfer" | "training-derivative";

export const PURPOSE_LABEL: Record<PackagePurpose, string> = {
  backup: "Backup of this browser",
  handover: "Local handover",
  transfer: "Device transfer",
  "training-derivative": "Training derivative",
};

/** Shown on every export screen and written into every package. */
export const LOCAL_DATA_NOTICE =
  "Workspaces are stored only in this browser on this device. Nothing is synced or backed up anywhere. Export a package to keep a copy.";
export const PACKAGE_NOTICE =
  "Plain JSON. Not encrypted and not access-controlled: anyone holding this file can read it. The SHA-256 digest is a local integrity reference that shows whether the file changed after export. It is not a signature, certification or proof of origin.";
/**
 * Custody guidance shown under every export, encrypted or not: the package is the only
 * copy outside this browser, so it belongs in the organisation's own archive.
 */
export const ARCHIVE_CUSTODY_NOTICE =
  "Exported packages are standalone files. Once saved to your device, move them to your organisation’s encrypted vault, offline media, or designated archive to preserve a permanent copy.";

export type WorkspacePackage = {
  format: typeof PACKAGE_FORMAT;
  packageVersion: number;
  appFormat: string;
  /** Optional: where the exported workspaces came from, by id and lineage kind only. */
  lineage?: { id: string; kind?: string; parentId?: string }[];
  /** Envelope fields a reader must understand to import this package safely. */
  critical: string[];
  workspaceSchema: number;
  purpose: PackagePurpose;
  exportedAt: string;
  notice: string;
  digest: string;
  workspaces: Workspace[];
};

/** The bytes the package digest covers: the canonical workspace list and its purpose. */
const digestInput = (purpose: PackagePurpose, workspaceSchema: number, workspaces: unknown[]) =>
  canonicalJson({ purpose, workspaceSchema, workspaces });

/** Why a set of workspaces cannot go into a package of this purpose, or null when it can. */
export function exportBlocker(workspaces: Workspace[], purpose: PackagePurpose): string | null {
  if (workspaces.length === 0) return "Choose at least one workspace.";
  if (purpose === "training-derivative" && workspaces.some((w) => !w.derived)) {
    return "A training-derivative package holds only sanitized derivatives. Create one from the custom mission first.";
  }
  if (purpose === "handover" && workspaces.some((w) => w.mode !== "custom")) {
    return "A handover package holds custom missions only. Training runs travel as a backup or a device transfer.";
  }
  return null;
}

export async function buildPackage(workspaces: Workspace[], purpose: PackagePurpose, at = new Date().toISOString()): Promise<WorkspacePackage> {
  const blocker = exportBlocker(workspaces, purpose);
  if (blocker) throw new Error(blocker);
  const list = JSON.parse(JSON.stringify(workspaces)) as Workspace[];
  const lineage = list.filter((w) => w.lineage).map((w) => ({ id: w.id, kind: w.lineage!.kind, parentId: w.lineage!.parentId }));
  return {
    format: PACKAGE_FORMAT,
    packageVersion: PACKAGE_VERSION,
    appFormat: APP_FORMAT,
    critical: ["workspaces", "digest"],
    ...(lineage.length ? { lineage } : {}),
    workspaceSchema: WORKSPACE_SCHEMA,
    purpose,
    exportedAt: at,
    notice: PACKAGE_NOTICE,
    digest: await sha256(digestInput(purpose, WORKSPACE_SCHEMA, list)),
    workspaces: list,
  };
}

export const packageFileName = (p: Pick<WorkspacePackage, "purpose" | "exportedAt">) =>
  `vinculum-${p.purpose}-${p.exportedAt.slice(0, 19).replace(/[:T]/g, "-")}.json`;

/** A short form of a digest for display. The full value is always available alongside. */
export const shortDigest = (d: string) => (d.length > 16 ? `${d.slice(0, 8)}…${d.slice(-8)}` : d);

/* ------------------------------------------------------------------ */
/* Reading a package                                                   */
/* ------------------------------------------------------------------ */

export type DigestStatus = "match" | "mismatch" | "missing";
export type SealStatus = "none" | "match" | "mismatch";

export type IncomingItem = {
  workspace: Workspace;
  /** For a sealed snapshot: whether its recorded canonical text still hashes to its digest. */
  seal: SealStatus;
};

export type PackageRead = {
  ok: boolean;
  /** Set when the file cannot be imported at all. */
  error?: string;
  /** The file is a passphrase-encrypted package: open it with decryptPackageText first. */
  encrypted?: boolean;
  purpose?: PackagePurpose;
  exportedAt?: string;
  digest: DigestStatus;
  recordedDigest?: string;
  computedDigest?: string;
  items: IncomingItem[];
  /** Records that failed validation, wrapped with a reason for the quarantine. */
  quarantined: unknown[];
  warnings: string[];
};

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const PURPOSES: PackagePurpose[] = ["backup", "handover", "transfer", "training-derivative"];

const failed = (error: string, extra: Partial<PackageRead> = {}): PackageRead => ({ ok: false, error, digest: "missing", items: [], quarantined: [], warnings: [], ...extra });

async function sealStatus(w: Workspace): Promise<SealStatus> {
  const s = w.sealed;
  if (!s) return "none";
  if (typeof s.canonical !== "string" || typeof s.digest !== "string") return "mismatch";
  return (await sha256(s.canonical)) === s.digest ? "match" : "mismatch";
}

export const isEncryptedPackage = (v: unknown): v is EncryptedPayload =>
  isObj(v) && v.format === "vinculum-cipher-v1" && typeof v.ciphertextHex === "string" && typeof v.ivHex === "string" && typeof v.saltHex === "string" && typeof v.tagHex === "string";

/**
 * Validate an import file as data only: nothing in it is executed, fetched, rendered or
 * followed. Nothing is written here. A file that is too large, too deep, not a package,
 * from a newer format or naming a critical field this build does not understand is
 * refused whole. Inside a package, a workspace that fails validation (limits, schema,
 * newer version, hidden or bidirectional characters), a sealed snapshot whose record no
 * longer matches its digest, or a non-derivative in a derivative package is kept aside.
 */
export async function readPackage(text: string): Promise<PackageRead> {
  if (utf8Bytes(text) > IMPORT_LIMITS.maxBytes) return failed("This file is larger than 20 MB. Nothing was imported.");
  // Depth, list, key and string limits on the raw text, before the parser allocates anything.
  const pre = precheckJsonText(text, IMPORT_LIMITS);
  if (!pre.ok) return failed(`This file exceeds the import limits (${pre.reason}). Nothing was imported.`);
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return failed("This file is not valid JSON. Nothing was imported.");
  }
  if (isEncryptedPackage(raw)) return failed("This package is encrypted. Enter its passphrase to open it.", { encrypted: true });
  const lim = checkPayload(raw, IMPORT_LIMITS);
  if (!lim.ok) return failed(`This file exceeds the import limits (${lim.reason}). Nothing was imported.`);
  if (!isObj(raw) || raw.format !== PACKAGE_FORMAT) return failed("This file is not a Vinculum workspace package. Nothing was imported.");
  if (typeof raw.packageVersion !== "number" || raw.packageVersion < 1) return failed("The package version is missing. Nothing was imported.");
  if (raw.packageVersion > PACKAGE_VERSION) return failed(`This package was written by a newer version (package v${raw.packageVersion}). Update this app before importing it. Nothing was imported.`);
  if (raw.critical !== undefined) {
    if (!Array.isArray(raw.critical) || raw.critical.some((c) => typeof c !== "string")) return failed("The package's critical field list is malformed. Nothing was imported.");
    const unknown = (raw.critical as string[]).filter((c) => !(KNOWN_FIELDS as readonly string[]).includes(c));
    if (unknown.length) return failed(`The package requires fields this version does not understand (${unknown.slice(0, 3).join(", ")}). Nothing was imported.`);
  }
  if (!Array.isArray(raw.workspaces)) return failed("The package holds no workspace list. Nothing was imported.");
  const purpose = PURPOSES.includes(raw.purpose as PackagePurpose) ? (raw.purpose as PackagePurpose) : undefined;
  if (!purpose) return failed("The package purpose is unknown. Nothing was imported.");
  if (typeof raw.workspaceSchema !== "number") return failed("The package does not name its workspace schema. Nothing was imported.");
  const schema = raw.workspaceSchema;
  if (schema > WORKSPACE_SCHEMA) return failed(`These workspaces were saved by a newer version (workspace schema ${schema}). Update this app before importing them. Nothing was imported.`);
  const warnings: string[] = [];

  const recorded = typeof raw.digest === "string" && /^[0-9a-f]{64}$/.test(raw.digest) ? raw.digest : undefined;
  const computed = await sha256(digestInput(purpose, schema, raw.workspaces));
  const digest: DigestStatus = !recorded ? "missing" : recorded === computed ? "match" : "mismatch";
  if (digest === "mismatch") warnings.push("The package digest does not match its contents: the file changed after it was exported. Review every item before importing.");
  if (digest === "missing") warnings.push("The package carries no digest, so changes after export cannot be detected.");

  const items: IncomingItem[] = [];
  const quarantined: unknown[] = [];
  const keepAside = (w: unknown, reason: string) => quarantined.push(quarantineEntry(w, reason, "import"));
  for (const w of raw.workspaces) {
    const v = validateRecord(w);
    if (!v.ok) {
      keepAside(w, v.reason);
      continue;
    }
    const ok = v.workspace;
    if (purpose === "training-derivative" && !ok.derived) {
      keepAside(w, "A non-derivative workspace inside a training-derivative package.");
      continue;
    }
    const seal = await sealStatus(ok);
    if (seal === "mismatch") {
      keepAside(w, "Sealed snapshot no longer matches its recorded digest.");
      continue;
    }
    items.push({ workspace: ok, seal });
  }
  if (quarantined.length) warnings.push(`${quarantined.length} record${quarantined.length === 1 ? "" : "s"} failed validation and will be kept aside in quarantine, unchanged.`);
  return {
    ok: true,
    purpose,
    exportedAt: typeof raw.exportedAt === "string" ? raw.exportedAt : undefined,
    digest,
    recordedDigest: recorded,
    computedDigest: computed,
    items,
    quarantined,
    warnings,
  };
}

/* ------------------------------------------------------------------ */
/* Optional passphrase encryption                                      */
/* ------------------------------------------------------------------ */

export const MIN_PASSPHRASE = 12;
export const ENCRYPTION_NOTICE =
  "Optional. AES-256-GCM with a key derived in this browser from your passphrase (PBKDF2-SHA-256, 310,000 iterations). The passphrase is never stored, sent or logged, and cannot be recovered: forget it and this backup cannot be opened by anyone, including you.";

/** Encrypt a built package under a passphrase with the app's existing authenticated envelope. */
export async function encryptPackage(pkg: WorkspacePackage, passphrase: string): Promise<EncryptedPayload> {
  if (passphrase.length < MIN_PASSPHRASE) throw new Error(`Use a passphrase of at least ${MIN_PASSPHRASE} characters.`);
  return sealEnvelope(pkg, passphrase);
}

/** Decrypt an encrypted package file to the package text, for readPackage. Wrong passphrase or altered bytes throw. */
export async function decryptPackageText(text: string, passphrase: string): Promise<string> {
  const pre = precheckJsonText(text, IMPORT_LIMITS);
  if (!pre.ok) throw new Error(`This file exceeds the import limits (${pre.reason}).`);
  const raw: unknown = JSON.parse(text);
  if (!isEncryptedPackage(raw)) throw new Error("This file is not an encrypted package.");
  return JSON.stringify(await openEnvelope<unknown>(raw, passphrase));
}

/* ------------------------------------------------------------------ */
/* Duplicates and the import decision                                  */
/* ------------------------------------------------------------------ */

/**
 * How an incoming workspace relates to what is already here:
 *  - new: nothing local shares its id or content;
 *  - identical: same id and same content, already present;
 *  - conflict: same id, different content;
 *  - same-content: different id, identical content (an earlier import or copy).
 */
export type DuplicateKind = "new" | "identical" | "conflict" | "same-content";
/**
 * The choice for each incoming item. Nothing ever overwrites a local workspace: an
 * existing copy can be opened, the incoming one imported as a separate copy, or skipped.
 */
export type ImportDecision = "restore" | "open" | "keep-both" | "skip";

/** Content identity ignores the id and the save timestamp, which differ between copies. */
const contentKey = (w: Workspace) => {
  const { id: _id, updatedAt: _u, ...rest } = w;
  return canonicalJson(rest);
};

export type ImportPlanItem = IncomingItem & {
  duplicate: DuplicateKind;
  existing?: Workspace;
  /** The decisions offered for this item; the first is the default. */
  options: ImportDecision[];
};

export function planImport(items: IncomingItem[], current: Workspace[]): ImportPlanItem[] {
  const byId = new Map(current.map((w) => [w.id, w]));
  const byContent = new Map(current.map((w) => [contentKey(w), w]));
  return items.map((it) => {
    const same = byId.get(it.workspace.id);
    if (same) {
      if (contentKey(same) === contentKey(it.workspace)) return { ...it, duplicate: "identical", existing: same, options: ["open", "keep-both", "skip"] };
      return { ...it, duplicate: "conflict", existing: same, options: ["keep-both", "open", "skip"] };
    }
    const twin = byContent.get(contentKey(it.workspace));
    if (twin) return { ...it, duplicate: "same-content", existing: twin, options: ["open", "keep-both", "skip"] };
    return { ...it, duplicate: "new", options: ["restore", "skip"] };
  });
}

export const DECISION_LABEL: Record<ImportDecision, string> = {
  restore: "Restore",
  open: "Open existing",
  "keep-both": "Import as separate copy",
  skip: "Skip",
};

export type ImportResult = { store: WorkspaceStore; added: number; skipped: number; quarantined: number; openId?: string };

/**
 * Apply the user's decisions. Restore adds a workspace that is not here; a separate copy
 * gets a new id with import lineage; open existing adds nothing and names the local
 * workspace to open. No local workspace is ever replaced or deleted; quarantined
 * records join the local quarantine.
 */
export function applyImport(store: WorkspaceStore, plan: ImportPlanItem[], decisions: ImportDecision[], quarantined: unknown[], at = new Date().toISOString()): ImportResult {
  const workspaces = [...store.workspaces];
  let added = 0;
  let skipped = 0;
  let openId: string | undefined;
  plan.forEach((it, i) => {
    const d = decisions[i] ?? it.options[0];
    const w = it.workspace;
    if (!it.options.includes(d) || d === "skip") {
      skipped++;
    } else if (d === "open") {
      openId = openId ?? it.existing?.id;
      skipped++;
    } else if (d === "restore") {
      if (workspaces.some((x) => x.id === w.id)) skipped++;
      else {
        workspaces.push(w);
        added++;
      }
    } else {
      workspaces.push({
        ...w,
        id: newId(w.mode === "preset" ? "ex" : "ms"),
        lineage: { parentId: w.id, kind: "import", note: `Imported copy of ${w.title}.`, at },
        updatedAt: at,
      });
      added++;
    }
  });
  return { store: { ...store, workspaces, quarantine: [...store.quarantine, ...quarantined] }, added, skipped, quarantined: quarantined.length, openId };
}

/** The quarantine as a downloadable file, exactly as kept. Viewing it changes nothing. */
export const quarantineExport = (items: unknown[], at = new Date().toISOString()) =>
  JSON.stringify({ format: "vinculum-quarantine", exportedAt: at, note: "Records this browser could not read, each with its reason. Kept unchanged. For inspection only: nothing here is executed.", records: items }, null, 2);
