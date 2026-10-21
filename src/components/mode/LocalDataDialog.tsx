import { useEffect, useMemo, useState } from "react";
import { Download, FileUp, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DECISION_LABEL,
  LOCAL_DATA_NOTICE,
  PACKAGE_NOTICE,
  PURPOSE_LABEL,
  applyImport,
  buildPackage,
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
import { LIFECYCLE_LABEL, MODE_LABEL, type Workspace, type WorkspaceStore } from "./workspace";
import { btn, btnPrimary, eyebrowCls, fieldCls, labelCls, localStamp } from "./ui";

const DUP_TEXT: Record<ImportPlanItem["duplicate"], string> = {
  new: "Not in this browser",
  identical: "Already here, identical",
  conflict: "Same workspace, different content",
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
 * writes a plain JSON package with a local SHA-256 reference; import validates it, shows
 * duplicates and asks restore, replace, keep both or skip for each item; unreadable
 * records stay in quarantine and can be downloaded, never erased.
 */
export default function LocalDataDialog({ open, onOpenChange, store, activeId, onImport }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  store: WorkspaceStore;
  activeId?: string | null;
  onImport: (r: ImportResult) => void;
}) {
  const list = store.workspaces;
  const [purpose, setPurpose] = useState<PackagePurpose>("backup");
  const [picked, setPicked] = useState<string[]>([]);
  const [lastDigest, setLastDigest] = useState<string | null>(null);
  const [read, setRead] = useState<PackageRead | null>(null);
  const [fileName, setFileName] = useState("");
  const [decisions, setDecisions] = useState<ImportDecision[]>([]);
  const [ack, setAck] = useState(false);

  useEffect(() => {
    if (!open) return;
    setPurpose("backup");
    setPicked(defaultsFor("backup", list));
    setLastDigest(null);
    setRead(null);
    setFileName("");
    setDecisions([]);
    setAck(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const chosen = list.filter((w) => picked.includes(w.id));
  const blocker = exportBlocker(chosen, purpose);
  const plan = useMemo(() => (read?.ok ? planImport(read.items, list) : []), [read, list]);
  useEffect(() => setDecisions(plan.map((p) => p.options[0])), [plan]);
  const needsAck = !!read?.ok && read.digest !== "match";
  const importable = !!read?.ok && (plan.length > 0 || read.quarantined.length > 0) && (!needsAck || ack);

  const doExport = async () => {
    try {
      const pkg = await buildPackage(chosen, purpose);
      download(packageFileName(pkg), JSON.stringify(pkg, null, 2));
      setLastDigest(pkg.digest);
      toast.success(`Exported ${chosen.length} workspace${chosen.length === 1 ? "" : "s"}. SHA-256 ${shortDigest(pkg.digest)}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "The package could not be built. Nothing was exported.");
    }
  };

  const onFile = async (f: File | undefined) => {
    setRead(null);
    setAck(false);
    if (!f) return;
    setFileName(f.name);
    if (f.size > 20 * 1024 * 1024) {
      setRead({ ok: false, error: "This file is larger than 20 MB. Nothing was imported.", digest: "missing", newer: false, items: [], quarantined: [], warnings: [] });
      return;
    }
    setRead(await readPackage(await f.text()));
  };

  const doImport = () => {
    if (!read?.ok) return;
    const r = applyImport(store, plan, decisions, read.quarantined);
    onImport(r);
    toast.success(
      `Import complete: ${r.added} added, ${r.replaced} replaced, ${r.skipped} skipped${r.quarantined ? `, ${r.quarantined} kept aside in quarantine` : ""}.`,
    );
    setRead(null);
    setFileName("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[calc(100vw-1.5rem)] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-primary">Local data, backup and recovery</DialogTitle>
          <DialogDescription className="text-xs">{LOCAL_DATA_NOTICE}</DialogDescription>
        </DialogHeader>

        <section aria-labelledby="ld-export" className="min-w-0 border border-border p-3 sm:p-4">
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
          <p className="mt-3 text-[11px] text-muted-foreground">{PACKAGE_NOTICE}</p>
          {blocker && list.length > 0 && <p role="status" className="mt-2 text-[11px] text-destructive">{blocker}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" className={btnPrimary} disabled={!!blocker} onClick={() => void doExport()}>
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
          <label className={`${btn} mt-3 cursor-pointer`}>
            <FileUp size={13} /> Choose package file
            <input type="file" accept="application/json,.json" className="sr-only" onChange={(e) => void onFile(e.target.files?.[0])} />
          </label>
          {fileName && <span className="ml-2 text-[11px] text-muted-foreground [overflow-wrap:anywhere]">{fileName}</span>}
          {read && !read.ok && <p role="alert" className="mt-3 text-xs text-destructive">{read.error}</p>}
          {read?.ok && (
            <div className="mt-3 space-y-3">
              <p className="text-xs text-foreground/85">
                {PURPOSE_LABEL[read.purpose!]}
                {read.exportedAt ? ` · exported ${localStamp(read.exportedAt)}` : ""} · {read.items.length} readable
                {read.quarantined.length ? `, ${read.quarantined.length} unreadable` : ""}
              </p>
              <p className={`font-mono text-[10px] [overflow-wrap:anywhere] ${read.digest === "match" ? "text-primary" : "text-destructive"}`} data-testid="import-digest">
                Package digest: {read.digest === "match" ? "matches its contents" : read.digest === "mismatch" ? "does not match its contents" : "not recorded"}
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
                      {p.existing?.lifecycle === "sealed" && p.duplicate === "conflict" ? " · the local sealed snapshot is never replaced" : ""}
                    </p>
                    {p.existing?.id === activeId && decisions[i] === "replace" && (
                      <p className="mt-1 text-[11px] text-destructive">This workspace is open now. Replacing it reopens it on the imported copy; its current local state is not kept.</p>
                    )}
                    <div role="radiogroup" aria-label={`Decision for ${p.workspace.title}`} className="mt-2 flex flex-wrap gap-3">
                      {p.options.map((o) => (
                        <label key={o} className="flex items-center gap-1.5 text-xs">
                          <input
                            type="radio"
                            name={`decision-${i}`}
                            checked={decisions[i] === o}
                            onChange={() => setDecisions(decisions.map((d, j) => (j === i ? o : d)))}
                          />
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
            {store.quarantine.length
              ? `${store.quarantine.length} record${store.quarantine.length === 1 ? "" : "s"} this browser could not read, kept unchanged. Nothing is erased.`
              : "No unreadable records in this browser."}
          </p>
          {store.quarantine.length > 0 && (
            <button type="button" className={`${btn} mt-2`} onClick={() => download(`vinculum-quarantine-${new Date().toISOString().slice(0, 10)}.json`, quarantineExport(store))}>
              <ShieldAlert size={13} /> Download quarantined records
            </button>
          )}
        </section>

        <DialogFooter className="gap-2 sm:gap-2">
          <button type="button" className={btn} onClick={() => onOpenChange(false)}>Close</button>
          <button type="button" className={btnPrimary} disabled={!importable} onClick={doImport}>Import selected</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
