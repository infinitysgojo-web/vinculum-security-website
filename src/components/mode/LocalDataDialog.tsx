import { useEffect, useMemo, useState } from "react";
import { Download, FileUp, KeyRound, ShieldAlert, Trash2, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { sanitizeDeep } from "@/lib/sanitizer";
import {
  ARCHIVE_CUSTODY_NOTICE,
  DECISION_LABEL,
  ENCRYPTION_NOTICE,
  LOCAL_DATA_NOTICE,
  MIN_PASSPHRASE,
  PACKAGE_NOTICE,
  PURPOSE_LABEL,
  applyImport,
  buildPackage,
  decryptPackageText,
  encryptPackage,
  exportBlocker,
  packageFileName,
  planImport,
  quarantineExport,
  readPackage,
  shortDigest,
  type ImportDecision,
  type ImportPlanItem,
  type ImportResult,
  type PackagePurpose,
  type PackageRead,
} from "./transfer";
import { LIFECYCLE_LABEL, MODE_LABEL, quarantineView, validateRecord, type Workspace, type WorkspaceStore } from "./workspace";
import { formatBytes, storageUsage, type StorageUsage } from "./localPersistence";
import { btn, btnPrimary, eyebrowCls, fieldCls, labelCls, localStamp } from "./ui";

/** What a browser-only app can and cannot protect against. Shown here and in SECURITY.md. */
export const THREAT_BOUNDARY =
  "This app protects against accidental loss, malformed or hostile import files, hidden-character text, stale or corrupt records, casual tampering of saved files and clickjacking. It cannot protect against a compromised device or browser, malicious extensions, a compromised account, screenshots, keyloggers, or anyone who receives an exported file. Clearing a browser's storage is not guaranteed physical deletion.";

const DUP_TEXT: Record<ImportPlanItem["duplicate"], string> = {
  new: "Not in this browser",
  identical: "Already here, identical",
  conflict: "Same workspace id, different content",
  "same-content": "Same content already here under another id",
};

function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

/** Pick the workspaces a purpose can carry by default. */
const defaultsFor = (purpose: PackagePurpose, list: Workspace[]) =>
  list.filter((w) => (purpose === "training-derivative" ? w.derived : purpose === "handover" ? w.mode === "custom" : true)).map((w) => w.id);

/**
 * Local data: backup, import and recovery for the workspaces in this browser. Export
 * writes a JSON package with a local SHA-256 reference, optionally encrypted under a
 * passphrase; import validates it as data only, shows duplicates and asks open existing,
 * import as a separate copy, or skip for each item, never overwriting; unreadable
 * records stay in quarantine with a reason and can be exported, restored once they pass
 * validation, or discarded after confirmation.
 */
export default function LocalDataDialog({ open, onOpenChange, store, activeId, onImport, onStoreChange, onOpenWorkspace }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  store: WorkspaceStore;
  activeId?: string | null;
  onImport: (r: ImportResult) => void;
  /** Write a whole collection (quarantine restore or discard). */
  onStoreChange: (s: WorkspaceStore) => void;
  onOpenWorkspace: (id: string) => void;
}) {
  const list = store.workspaces;
  const [purpose, setPurpose] = useState<PackagePurpose>("backup");
  const [picked, setPicked] = useState<string[]>([]);
  const [lastDigest, setLastDigest] = useState<string | null>(null);
  const [encrypt, setEncrypt] = useState(false);
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [read, setRead] = useState<PackageRead | null>(null);
  const [fileText, setFileText] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [openPass, setOpenPass] = useState("");
  const [decisions, setDecisions] = useState<ImportDecision[]>([]);
  const [ack, setAck] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState<number | null>(null);
  const [usage, setUsage] = useState<StorageUsage | null>(null);

  // Passphrases and file text live only in this dialog's memory and are dropped on close.
  useEffect(() => {
    if (!open) {
      setPass("");
      setPass2("");
      setOpenPass("");
      setFileText(null);
      return;
    }
    setPurpose("backup");
    setPicked(defaultsFor("backup", list));
    setLastDigest(null);
    setEncrypt(false);
    setRead(null);
    setFileName("");
    setDecisions([]);
    setAck(false);
    setConfirmDiscard(null);
    void storageUsage().then(setUsage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const chosen = list.filter((w) => picked.includes(w.id));
  const blocker = exportBlocker(chosen, purpose);
  const passProblem = encrypt ? (pass.length < MIN_PASSPHRASE ? `Use at least ${MIN_PASSPHRASE} characters.` : pass !== pass2 ? "The two passphrases differ." : null) : null;
  const plan = useMemo(() => (read?.ok ? planImport(read.items, list) : []), [read, list]);
  useEffect(() => setDecisions(plan.map((p) => p.options[0])), [plan]);
  const needsAck = !!read?.ok && read.digest !== "match";
  const importable = !!read?.ok && (plan.length > 0 || read.quarantined.length > 0) && (!needsAck || ack);

  const doExport = async () => {
    try {
      const pkg = await buildPackage(chosen, purpose);
      if (encrypt) {
        const sealed = await encryptPackage(pkg, pass);
        download(packageFileName(pkg).replace(/\.json$/, ".encrypted.json"), JSON.stringify(sealed, null, 2));
      } else {
        download(packageFileName(pkg), JSON.stringify(pkg, null, 2));
      }
      setLastDigest(pkg.digest);
      setPass("");
      setPass2("");
      toast.success(`Exported ${chosen.length} workspace${chosen.length === 1 ? "" : "s"}${encrypt ? " (encrypted)" : ""}. SHA-256 ${shortDigest(pkg.digest)}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "The package could not be built. Nothing was exported.");
    }
  };

  const onFile = async (f: File | undefined) => {
    setRead(null);
    setAck(false);
    setFileText(null);
    setOpenPass("");
    if (!f) return;
    setFileName(f.name);
    if (f.size > 20 * 1024 * 1024) {
      setRead({ ok: false, error: "This file is larger than 20 MB. Nothing was imported.", digest: "missing", items: [], quarantined: [], warnings: [] });
      return;
    }
    const text = await f.text();
    const r = await readPackage(text);
    if (r.encrypted) setFileText(text);
    setRead(r);
  };

  const unlock = async () => {
    if (!fileText) return;
    try {
      const plain = await decryptPackageText(fileText, openPass);
      setOpenPass("");
      setFileText(null);
      setRead(await readPackage(plain));
    } catch {
      setOpenPass("");
      toast.error("The passphrase is wrong or the file was altered. Nothing was imported.");
    }
  };

  const doImport = () => {
    if (!read?.ok) return;
    const r = applyImport(store, plan, decisions, read.quarantined);
    onImport(r);
    toast.success(`Import complete: ${r.added} added, ${r.skipped} not imported${r.quarantined ? `, ${r.quarantined} kept aside in quarantine` : ""}. No workspace was overwritten.`);
    setRead(null);
    setFileName("");
    if (r.openId) onOpenWorkspace(r.openId);
  };

  const q = store.quarantine.map(quarantineView);
  const restoreQuarantined = (i: number, cleaned: boolean) => {
    const record = cleaned ? sanitizeDeep(q[i].record) : q[i].record;
    const v = validateRecord(record);
    if (!v.ok) return toast.error(`Still cannot be restored: ${v.reason}`);
    if (list.some((w) => w.id === v.workspace.id)) return toast.error("A workspace with this id is already here. Export the record and import it as a separate copy.");
    onStoreChange({ ...store, workspaces: [...list, v.workspace], quarantine: store.quarantine.filter((_, j) => j !== i) });
    toast.success(cleaned ? "Restored a cleaned copy. Hidden characters were removed at your request." : "Restored from quarantine.");
  };
  const discard = (i: number) => {
    onStoreChange({ ...store, quarantine: store.quarantine.filter((_, j) => j !== i) });
    setConfirmDiscard(null);
    toast.success("Quarantined record discarded from this browser.");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[calc(100vw-1.5rem)] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-primary">Local data, backup and recovery</DialogTitle>
          <DialogDescription className="text-xs">{LOCAL_DATA_NOTICE} Keeping backups is your responsibility.</DialogDescription>
        </DialogHeader>

        <section aria-labelledby="ld-usage" className="min-w-0 border border-border p-3 sm:p-4">
          <p id="ld-usage" className={eyebrowCls}>Storage on this device</p>
          <p className="mt-2 text-xs text-foreground/85" data-testid="storage-usage">
            {usage
              ? `This app holds ${formatBytes(usage.localBytes)} in this browser's local storage${usage.originQuota ? `; the site uses ${formatBytes(usage.originUsage ?? 0)} of ${formatBytes(usage.originQuota)} available` : ""}.`
              : "Measuring…"}
          </p>
          {usage?.constrained && (
            <p role="alert" className="mt-2 text-xs text-destructive">
              Browser storage is nearly full. Export a backup now. Nothing is removed automatically; saves are refused rather than overwriting good copies.
            </p>
          )}
          <p className="mt-2 text-[11px] text-muted-foreground">Each save is written in full and checked before it replaces the last good copy. Replay history keeps the most recent 1,000 events per workspace.</p>
        </section>

        <section aria-labelledby="ld-export" className="mt-4 min-w-0 border border-border p-3 sm:p-4">
          <p id="ld-export" className={eyebrowCls}>Export a package</p>
          <label className="mt-3 block">
            <span className={labelCls}>Purpose</span>
            <select
              className={fieldCls}
              value={purpose}
              onChange={(e) => {
                const p = e.target.value as PackagePurpose;
                setPurpose(p);
                setPicked(defaultsFor(p, list));
              }}
            >
              {(Object.keys(PURPOSE_LABEL) as PackagePurpose[]).map((p) => (
                <option key={p} value={p}>{PURPOSE_LABEL[p]}</option>
              ))}
            </select>
          </label>
          <fieldset className="mt-3">
            <legend className={labelCls}>Workspaces in this browser</legend>
            {list.length === 0 ? (
              <p className="mt-1 text-xs text-muted-foreground">No workspace is stored in this browser.</p>
            ) : (
              <ul className="mt-1 max-h-48 space-y-1 overflow-y-auto">
                {list.map((w) => (
                  <li key={w.id}>
                    <label className="flex items-start gap-2 text-xs">
                      <input
                        type="checkbox"
                        className="mt-0.5"
                        checked={picked.includes(w.id)}
                        onChange={(e) => setPicked(e.target.checked ? [...picked, w.id] : picked.filter((x) => x !== w.id))}
                      />
                      <span className="min-w-0 [overflow-wrap:anywhere]">
                        {w.title}
                        <span className="text-muted-foreground">
                          {" "}· {w.derived ? "Training derivative" : MODE_LABEL[w.mode]} · {LIFECYCLE_LABEL[w.lifecycle]}
                          {w.id === activeId ? " · open now" : ""}
                        </span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </fieldset>
          <label className="mt-3 flex items-start gap-2 text-xs">
            <input type="checkbox" className="mt-0.5" checked={encrypt} onChange={(e) => setEncrypt(e.target.checked)} data-testid="encrypt-toggle" />
            <span>Encrypt this package with a passphrase</span>
          </label>
          {encrypt && (
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <label className="block">
                <span className={labelCls}>Passphrase</span>
                <input type="password" autoComplete="new-password" value={pass} onChange={(e) => setPass(e.target.value)} className={fieldCls} data-testid="export-pass" />
              </label>
              <label className="block">
                <span className={labelCls}>Repeat passphrase</span>
                <input type="password" autoComplete="new-password" value={pass2} onChange={(e) => setPass2(e.target.value)} className={fieldCls} data-testid="export-pass2" />
              </label>
              <p className="text-[11px] text-muted-foreground sm:col-span-2">{ENCRYPTION_NOTICE}</p>
              {passProblem && <p className="text-[11px] text-destructive sm:col-span-2">{passProblem}</p>}
            </div>
          )}
          {!encrypt && <p className="mt-3 text-[11px] text-muted-foreground">{PACKAGE_NOTICE}</p>}
          <ArchiveCustodyNotice />
          {blocker && list.length > 0 && <p role="status" className="mt-2 text-[11px] text-destructive">{blocker}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" className={btnPrimary} disabled={!!blocker || !!passProblem} onClick={() => void doExport()}>
              <Download size={13} /> Export package
            </button>
            {lastDigest && (
              <span className="font-mono text-[10px] text-muted-foreground [overflow-wrap:anywhere]" data-testid="export-digest">
                SHA-256 {lastDigest}
              </span>
            )}
          </div>
        </section>

        <section aria-labelledby="ld-import" className="mt-4 min-w-0 border border-border p-3 sm:p-4">
          <p id="ld-import" className={eyebrowCls}>Import a package</p>
          <p className="mt-2 text-[11px] text-muted-foreground">Files are read as data only. Nothing in them is run, opened, fetched or shown as formatted content.</p>
          <label className={`${btn} mt-3 cursor-pointer`}>
            <FileUp size={13} /> Choose package file
            <input type="file" accept="application/json,.json" className="sr-only" onChange={(e) => void onFile(e.target.files?.[0])} />
          </label>
          {fileName && <span className="ml-2 text-[11px] text-muted-foreground [overflow-wrap:anywhere]">{fileName}</span>}
          {read && !read.ok && !read.encrypted && <p role="alert" className="mt-3 text-xs text-destructive">{read.error}</p>}
          {read?.encrypted && fileText && (
            <div className="mt-3 flex flex-wrap items-end gap-2">
              <label className="block min-w-0 flex-1">
                <span className={labelCls}>This package is encrypted. Passphrase</span>
                <input type="password" autoComplete="off" value={openPass} onChange={(e) => setOpenPass(e.target.value)} className={fieldCls} data-testid="import-pass" />
              </label>
              <button type="button" className={btn} disabled={!openPass} onClick={() => void unlock()}>
                <KeyRound size={13} /> Open package
              </button>
            </div>
          )}
          {read?.ok && (
            <div className="mt-3 space-y-3">
              <p className="text-xs text-foreground/85">
                {PURPOSE_LABEL[read.purpose!]}
                {read.exportedAt ? ` · exported ${localStamp(read.exportedAt)}` : ""} · {read.items.length} readable
                {read.quarantined.length ? `, ${read.quarantined.length} kept aside` : ""}
              </p>
              <p className={`font-mono text-[10px] [overflow-wrap:anywhere] ${read.digest === "match" ? "text-primary" : "text-destructive"}`} data-testid="import-digest">
                Integrity comparison: {read.digest === "match" ? "the recomputed digest matches the recorded one" : read.digest === "mismatch" ? "the recomputed digest does not match the recorded one" : "no digest recorded"}
                {read.recordedDigest ? ` · recorded ${read.recordedDigest}` : ""}
                {read.digest === "mismatch" ? ` · computed ${read.computedDigest}` : ""}
              </p>
              {read.warnings.length > 0 && (
                <ul className="space-y-1 border-l-2 border-destructive/50 pl-3 text-[11px] text-muted-foreground">
                  {read.warnings.map((w) => <li key={w}>{w}</li>)}
                </ul>
              )}
              <ul className="space-y-2">
                {plan.map((p, i) => (
                  <li key={`${p.workspace.id}-${i}`} className="border border-border p-3">
                    <p className="text-xs text-primary [overflow-wrap:anywhere]">{p.workspace.title}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {p.workspace.derived ? "Training derivative" : MODE_LABEL[p.workspace.mode]} · {LIFECYCLE_LABEL[p.workspace.lifecycle]} · {DUP_TEXT[p.duplicate]}
                      {p.seal === "match" ? " · sealed record matches its digest" : ""}
                    </p>
                    <div role="radiogroup" aria-label={`Decision for ${p.workspace.title}`} className="mt-2 flex flex-wrap gap-3">
                      {p.options.map((o) => (
                        <label key={o} className="flex items-center gap-1.5 text-xs">
                          <input type="radio" name={`decision-${i}`} checked={decisions[i] === o} onChange={() => setDecisions(decisions.map((d, j) => (j === i ? o : d)))} />
                          {DECISION_LABEL[o]}
                        </label>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
              {needsAck && (
                <label className="flex items-start gap-2 text-xs text-destructive">
                  <input type="checkbox" className="mt-0.5" checked={ack} onChange={(e) => setAck(e.target.checked)} />
                  I have reviewed these items knowing the file cannot be shown to be unchanged since export.
                </label>
              )}
            </div>
          )}
        </section>

        <section aria-labelledby="ld-quarantine" className="mt-4 min-w-0 border border-border p-3 sm:p-4">
          <p id="ld-quarantine" className={eyebrowCls}>Quarantine</p>
          <p className="mt-2 text-xs text-foreground/85">
            {q.length
              ? `${q.length} record${q.length === 1 ? "" : "s"} this browser could not read or would not trust, kept unchanged. Nothing is erased unless you discard it.`
              : "No unreadable records in this browser."}
          </p>
          {q.length > 0 && (
            <>
              <ul className="mt-2 space-y-2">
                {q.map((item, i) => (
                  <li key={i} className="border border-border p-3" data-testid="quarantine-item">
                    <p className="text-[11px] text-foreground/85 [overflow-wrap:anywhere]">{item.reason}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{item.at ? `Kept aside ${localStamp(item.at)}` : "Kept aside earlier"}{item.source === "import" ? " · from an import" : ""}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button type="button" className={btn} onClick={() => download(`vinculum-quarantine-record-${i + 1}.json`, quarantineExport([store.quarantine[i]]))}>
                        <Download size={13} /> Export for inspection
                      </button>
                      <button type="button" className={btn} onClick={() => restoreQuarantined(i, false)}>
                        <Undo2 size={13} /> Try restore
                      </button>
                      {/hidden or bidirectional/.test(item.reason) && (
                        <button type="button" className={btn} onClick={() => restoreQuarantined(i, true)}>
                          <Undo2 size={13} /> Restore a cleaned copy
                        </button>
                      )}
                      {confirmDiscard === i ? (
                        <>
                          <button type="button" className={`${btn} border-destructive text-destructive`} onClick={() => discard(i)}>
                            <Trash2 size={13} /> Confirm discard
                          </button>
                          <button type="button" className={btn} onClick={() => setConfirmDiscard(null)}>Keep it</button>
                        </>
                      ) : (
                        <button type="button" className={btn} onClick={() => setConfirmDiscard(i)}>
                          <Trash2 size={13} /> Discard
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <button type="button" className={`${btn} mt-2`} onClick={() => download(`vinculum-quarantine-${new Date().toISOString().slice(0, 10)}.json`, quarantineExport(store.quarantine))}>
                <ShieldAlert size={13} /> Download all quarantined records
              </button>
            </>
          )}
        </section>

        <section aria-labelledby="ld-limits" className="mt-4 min-w-0 border border-border p-3 sm:p-4">
          <p id="ld-limits" className={eyebrowCls}>What this protects, and what it cannot</p>
          <p className="mt-2 text-[11px] text-muted-foreground">{THREAT_BOUNDARY}</p>
        </section>

        <DialogFooter className="gap-2 sm:gap-2">
          <button type="button" className={btn} onClick={() => onOpenChange(false)}>Close</button>
          <button type="button" className={btnPrimary} disabled={!importable} onClick={doImport}>Import selected</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Institutional custody advisory for the export section. Shown whether or not the
 * package is encrypted: either way the file needs a proper archive.
 */
export function ArchiveCustodyNotice() {
  return (
    <p className="text-[11px] text-muted-foreground border-l-2 border-brass/50 pl-3 py-1 my-3 italic leading-relaxed" data-testid="archive-custody-notice">
      {ARCHIVE_CUSTODY_NOTICE}
    </p>
  );
}
