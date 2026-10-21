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
import { detectSteganographicTokens } from "@/lib/sanitizer";
import { WORKSPACE_SCHEMA, newId, readWorkspace, type Workspace, type WorkspaceStore } from "./workspace";

export const PACKAGE_FORMAT = "vinculum-workspace-package";
export const PACKAGE_VERSION = 1;

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

export type WorkspacePackage = {
  format: typeof PACKAGE_FORMAT;
  packageVersion: number;
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
  return {
    format: PACKAGE_FORMAT,
    packageVersion: PACKAGE_VERSION,
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
  /** Free-text fields that contain hidden or control characters. Reported, never rewritten. */
  hiddenCharacters: number;
};

export type PackageRead = {
  ok: boolean;
  /** Set when the file cannot be imported at all. */
  error?: string;
  purpose?: PackagePurpose;
  exportedAt?: string;
  digest: DigestStatus;
  recordedDigest?: string;
  computedDigest?: string;
  /** The package or its workspaces come from a newer build. Unknown fields are carried. */
  newer: boolean;
  items: IncomingItem[];
  /** Records that failed validation, kept exactly as found for the quarantine. */
  quarantined: unknown[];
  warnings: string[];
};

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const PURPOSES: PackagePurpose[] = ["backup", "handover", "transfer", "training-derivative"];

const failed = (error: string): PackageRead => ({ ok: false, error, digest: "missing", newer: false, items: [], quarantined: [], warnings: [] });

function countHidden(w: Workspace): number {
  const texts: string[] = [w.title, ...Object.values(w.warrant ?? {}), ...w.tray.map((e) => e.text), ...w.decisions.flatMap((d) => [d.what, d.why])];
  return texts.reduce((n, t) => n + (typeof t === "string" && detectSteganographicTokens(t).stripped > 0 ? 1 : 0), 0);
}

async function sealStatus(w: Workspace): Promise<SealStatus> {
  const s = w.sealed;
  if (!s) return "none";
  if (typeof s.canonical !== "string" || typeof s.digest !== "string") return "mismatch";
  return (await sha256(s.canonical)) === s.digest ? "match" : "mismatch";
}

/**
 * Validate an import file. Nothing is written here. A file that is not a package is
 * refused; inside a package, a workspace that fails validation, or a sealed snapshot
 * whose record no longer matches its digest, goes to quarantine instead of being loaded.
 */
export async function readPackage(text: string): Promise<PackageRead> {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return failed("This file is not valid JSON. Nothing was imported.");
  }
  if (!isObj(raw) || raw.format !== PACKAGE_FORMAT) return failed("This file is not a Vinculum workspace package. Nothing was imported.");
  if (typeof raw.packageVersion !== "number" || raw.packageVersion < 1) return failed("The package version is missing. Nothing was imported.");
  if (raw.packageVersion > PACKAGE_VERSION) return failed(`This package was written by a newer version (package v${raw.packageVersion}). Update this app before importing it. Nothing was imported.`);
  if (!Array.isArray(raw.workspaces)) return failed("The package holds no workspace list. Nothing was imported.");
  const purpose = PURPOSES.includes(raw.purpose as PackagePurpose) ? (raw.purpose as PackagePurpose) : undefined;
  if (!purpose) return failed("The package purpose is unknown. Nothing was imported.");
  const schema = typeof raw.workspaceSchema === "number" ? raw.workspaceSchema : 0;
  const newer = schema > WORKSPACE_SCHEMA;
  const warnings: string[] = [];

  const recorded = typeof raw.digest === "string" && /^[0-9a-f]{64}$/.test(raw.digest) ? raw.digest : undefined;
  const computed = await sha256(digestInput(purpose, schema, raw.workspaces));
  const digest: DigestStatus = !recorded ? "missing" : recorded === computed ? "match" : "mismatch";
  if (digest === "mismatch") warnings.push("The package digest does not match its contents: the file changed after it was exported. Review every item before importing.");
  if (digest === "missing") warnings.push("The package carries no digest, so changes after export cannot be detected.");
  if (newer) warnings.push("These workspaces were saved by a newer version. Unknown fields are preserved.");

  const items: IncomingItem[] = [];
  const quarantined: unknown[] = [];
  for (const w of raw.workspaces) {
    const ok = readWorkspace(w);
    if (!ok) {
      quarantined.push(w);
      continue;
    }
    if (purpose === "training-derivative" && !ok.derived) {
      quarantined.push(w);
      warnings.push("A non-derivative workspace was found in a training-derivative package and was kept aside.");
      continue;
    }
    const seal = await sealStatus(ok);
    if (seal === "mismatch") {
      quarantined.push(w);
      warnings.push(`Sealed snapshot "${ok.title}" no longer matches its recorded digest and was kept aside.`);
      continue;
    }
    const hiddenCharacters = countHidden(ok);
    if (hiddenCharacters) warnings.push(`"${ok.title}" has ${hiddenCharacters} field${hiddenCharacters === 1 ? "" : "s"} with hidden or control characters. They are imported unchanged; edit a field to clean it.`);
    items.push({ workspace: ok, seal, hiddenCharacters });
  }
  if (quarantined.length) warnings.push(`${quarantined.length} record${quarantined.length === 1 ? "" : "s"} could not be read and will be kept aside unchanged.`);
  return {
    ok: true,
    purpose,
    exportedAt: typeof raw.exportedAt === "string" ? raw.exportedAt : undefined,
    digest,
    recordedDigest: recorded,
    computedDigest: computed,
    newer,
    items,
    quarantined,
    warnings,
  };
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
export type ImportDecision = "restore" | "replace" | "keep-both" | "skip";

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
      if (contentKey(same) === contentKey(it.workspace)) return { ...it, duplicate: "identical", existing: same, options: ["skip", "keep-both"] };
      // A sealed local snapshot is immutable: it is never replaced in place.
      const options: ImportDecision[] = same.lifecycle === "sealed" ? ["keep-both", "skip"] : ["keep-both", "replace", "skip"];
      return { ...it, duplicate: "conflict", existing: same, options };
    }
    const twin = byContent.get(contentKey(it.workspace));
    if (twin) return { ...it, duplicate: "same-content", existing: twin, options: ["skip", "keep-both"] };
    return { ...it, duplicate: "new", options: ["restore", "skip"] };
  });
}

export const DECISION_LABEL: Record<ImportDecision, string> = {
  restore: "Restore",
  replace: "Replace local copy",
  "keep-both": "Keep both",
  skip: "Skip",
};

export type ImportResult = { store: WorkspaceStore; added: number; replaced: number; skipped: number; quarantined: number };

/**
 * Apply the user's decisions. Keep both writes the incoming workspace under a new id
 * with import lineage; replace never touches a sealed snapshot; quarantined records are
 * appended to the store's quarantine. Nothing local is deleted.
 */
export function applyImport(store: WorkspaceStore, plan: ImportPlanItem[], decisions: ImportDecision[], quarantined: unknown[], at = new Date().toISOString()): ImportResult {
  let workspaces = [...store.workspaces];
  let added = 0;
  let replaced = 0;
  let skipped = 0;
  plan.forEach((it, i) => {
    const d = decisions[i] ?? it.options[0];
    if (!it.options.includes(d) || d === "skip") {
      skipped++;
      return;
    }
    const w = it.workspace;
    if (d === "restore") {
      if (workspaces.some((x) => x.id === w.id)) {
        skipped++;
        return;
      }
      workspaces.push(w);
      added++;
    } else if (d === "replace") {
      const local = workspaces.find((x) => x.id === w.id);
      if (!local || local.lifecycle === "sealed") {
        skipped++;
        return;
      }
      workspaces = workspaces.map((x) => (x.id === w.id ? w : x));
      replaced++;
    } else {
      const copy: Workspace = {
        ...w,
        id: newId(w.mode === "preset" ? "ex" : "ms"),
        lineage: { parentId: w.id, kind: "import", note: `Imported copy of ${w.title}.`, at },
        updatedAt: at,
      };
      workspaces.push(copy);
      added++;
    }
  });
  return {
    store: { ...store, workspaces, quarantine: [...store.quarantine, ...quarantined] },
    added,
    replaced,
    skipped,
    quarantined: quarantined.length,
  };
}

/** The quarantine as a downloadable file, exactly as kept. Viewing it changes nothing. */
export const quarantineExport = (store: WorkspaceStore, at = new Date().toISOString()) =>
  JSON.stringify({ format: "vinculum-quarantine", exportedAt: at, note: "Records this browser could not read. Kept unchanged.", records: store.quarantine }, null, 2);
