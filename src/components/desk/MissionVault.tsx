import { useEffect, useRef, useState } from "react";
import { seal as sealChime } from "@/lib/chancelleryHaptics";
import { Archive, BookmarkCheck, RotateCcw, ShieldCheck, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import type { BinderEntry } from "./DeskOutput";

import { DEFAULT_BONDS, EMPTY_PROFILE, sanitizeBonds, type MissionProfile } from "./mission";
import { applyInscriptions, sanitizeSignals, statutoryClearances, type Signals } from "./engine";
import { archiveMerkleRoot, archiveStateDigest, sha256, verifySealedText } from "./integrity";
import { ARCHIVE_FORMAT, ARCHIVE_SCHEMA, ARCHIVE_VERSION, archiveFileName, validateArchive, type ArchiveLedger } from "./archive";
import { lastIssuedRef, ledgerSize, mintDispatch } from "./registry";
import { ledgerEntries, logEvent } from "./ledgerStore";
import { Lex } from "./Lexicon";
import EnclaveSecurityDrawer from "./EnclaveSecurityDrawer";
import {
  LEGACY_LIBRARY_KEY,
  countSealedTheatres,
  deleteTheatreFromVault,
  getAllTheatresFromVault,
  getStorageQuota,
  migrateLegacyStorage,
  requestPersistentStorage,
  saveTheatreToVault,
  vaultBackendKind,
  type SavedTheatreSlot,
} from "@/lib/chancelleryDb";
import { refreshEnclave, useEnclave } from "@/lib/chancelleryEnclave";
import { timingSafeEqualText } from "@/lib/chancelleryCrypto";
import { countStrippedDeep, sanitizeDeep } from "@/lib/sanitizer";

export { EMPTY_PROFILE };
export type { MissionProfile, SavedTheatreSlot };

type ArchiveBody = {
  format: typeof ARCHIVE_FORMAT;
  /** Schema name; required from version 4. */
  schema: typeof ARCHIVE_SCHEMA;
  /**
   * 4 adds the schema field and the registry/session ledger state.
   * 3 added the live mission signals (rupture index, active shocks, covenants, track divergence,
   * every Sovereign inscription: custom parties, shocks, covenants, traps and readiness gates).
   * 2 added profile.bonds. Versions 1 to 3 still load.
   * The optional sha256Seal is the SHA-256 of the archive body without the seal itself.
   */
  version: typeof ARCHIVE_VERSION;
  savedAt: string;
  profile: MissionProfile;
  binder: BinderEntry[];
  signals?: Signals;
  ledger?: ArchiveLedger;
};
type Archive = ArchiveBody & { sha256Seal?: string };

/** The localStorage key the library used before the IndexedDB vault (migrated on first boot). */
export const THEATRE_LIBRARY_KEY = LEGACY_LIBRARY_KEY;

const fieldCls = "w-full border border-input bg-background px-3 py-2.5 text-sm";
const labelCls = "text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/70 mb-2 block";

const slotIdFor = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "untitled-mission";

/** Normalise a stored slot defensively: a damaged or hand-edited entry is repaired, never trusted. */
const normaliseSlot = (s: SavedTheatreSlot): SavedTheatreSlot => ({
  id: s.id,
  name: s.name,
  updatedAt: typeof s.updatedAt === "string" ? s.updatedAt : new Date(0).toISOString(),
  profile: { ...EMPTY_PROFILE, ...s.profile, bonds: sanitizeBonds(s.profile?.bonds) },
  binder: Array.isArray(s.binder) ? s.binder : [],
  signals: sanitizeSignals(s.signals),
});

type StorageTelemetry = { backend: "indexeddb" | "memory"; persisted: boolean; usedBytes: number };

/**
 * Mission State Vault. Saves the working session to a file on the practitioner's
 * own machine and reloads it later, and keeps a library of named theatres in this
 * browser so a practitioner can switch between them without losing records.
 * Nothing is uploaded and nothing is stored by the system. Exported archives
 * carry a SHA-256 seal that is checked again on import.
 */
export default function MissionVault({
  profile,
  setProfile,
  binder,
  setBinder,
  signals,
  setSignals,
}: {
  profile: MissionProfile;
  setProfile: (p: MissionProfile) => void;
  binder: BinderEntry[];
  setBinder: (b: BinderEntry[]) => void;
  /** The live mission-engine bus, saved with the archive so a restore needs no upstream re-clicking. */
  signals: Signals;
  setSignals: (s: Signals) => void;
}) {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [slots, setSlots] = useState<SavedTheatreSlot[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const verifyRef = useRef<HTMLInputElement>(null);

  const enclave = useEnclave();
  const [telemetry, setTelemetry] = useState<StorageTelemetry | null>(null);
  const [sealedCount, setSealedCount] = useState(0);

  const refreshTelemetry = async () => {
    const [backend, q] = await Promise.all([vaultBackendKind(), getStorageQuota()]);
    setTelemetry((t) => ({ backend, persisted: t?.persisted ?? false, usedBytes: q.usedBytes }));
  };

  const reloadSlots = async () => {
    try {
      setSlots((await getAllTheatresFromVault()).map(normaliseSlot));
      setSealedCount(await countSealedTheatres());
    } catch {
      setSlots([]);
    }
  };

  // Asynchronous hydration: migrate the legacy localStorage library once, then read the vault.
  useEffect(() => {
    let live = true;
    (async () => {
      await refreshEnclave();
      try {
        await migrateLegacyStorage();
      } catch {
        // A failed migration leaves the legacy key in place for the next boot.
      }
      if (!live) return;
      await reloadSlots();
      const persisted = await requestPersistentStorage();
      const [backend, q] = await Promise.all([vaultBackendKind(), getStorageQuota()]);
      if (live) setTelemetry({ backend, persisted, usedBytes: q.usedBytes });
    })();
    return () => {
      live = false;
    };
  }, []);

  // Sealing or unsealing changes which records can be read.
  useEffect(() => {
    if (!enclave.ready) return;
    void (async () => {
      if (enclave.unlocked) {
        try {
          await migrateLegacyStorage();
        } catch {
          // ignore
        }
      }
      await reloadSlots();
      await refreshTelemetry();
    })();
  }, [enclave.ready, enclave.unlocked, enclave.configured]);

  const enclaveLocked = enclave.configured && !enclave.unlocked;

  const saveCurrentToLibrary = async () => {
    if (enclaveLocked) {
      toast.error("The enclave is sealed. Enter the passphrase under Sovereign Enclave Security to save.");
      return;
    }
    const name = profile.theatre.trim() || "Untitled mission";
    const id = slotIdFor(name);
    const slot: SavedTheatreSlot = {
      id,
      name,
      updatedAt: new Date().toISOString(),
      profile: { ...profile, bonds: profile.bonds ?? DEFAULT_BONDS },
      binder,
      signals,
    };
    const exists = slots.some((s) => s.id === id);
    try {
      await saveTheatreToVault(slot);
    } catch (e) {
      toast.error(e instanceof Error && /sealed/i.test(e.message) ? e.message : "This browser would not store the library (storage full or blocked). Export a file instead.");
      return;
    }
    setSlots(exists ? slots.map((s) => (s.id === id ? slot : s)) : [slot, ...slots]);
    void refreshTelemetry();
    sealChime();
    toast.success(`${exists ? "Updated" : "Saved"} “${name}” in the theatre library${enclave.configured ? " (sealed AES-256-GCM)" : ""}`);
  };

  const loadSlot = (slot: SavedTheatreSlot) => {
    setProfile({ ...EMPTY_PROFILE, ...slot.profile, bonds: sanitizeBonds(slot.profile.bonds) });
    setBinder(slot.binder ?? []);
    setSignals(sanitizeSignals(slot.signals));
    logEvent("MISSION_HYDRATED", `${slot.name} (theatre library)`);
    toast.success(`Switched theatre to “${slot.name}”`);
  };

  const deleteSlot = (slot: SavedTheatreSlot) => {
    if (!window.confirm(`Remove “${slot.name}” from the theatre library? This cannot be undone.`)) return;
    void (async () => {
      try {
        await deleteTheatreFromVault(slot.id);
        setSlots((prev) => prev.filter((s) => s.id !== slot.id));
        void refreshTelemetry();
        toast.success("Theatre removed from the library");
      } catch {
        toast.error("The theatre could not be removed from this browser's vault.");
      }
    })();
  };

  const save = async () => {
    const effective = applyInscriptions(signals);
    const clearances = statutoryClearances(effective);
    const events = ledgerEntries().map(({ at, kind, detail }) => ({ at, kind, detail }));
    const ledger: ArchiveLedger = {
      stateDigest: await archiveStateDigest(signals),
      clearancesPassed: clearances.filter((c) => c.passed).length,
      clearancesTotal: clearances.length,
      dispatchesIssued: ledgerSize(),
      lastRef: lastIssuedRef(),
      events,
      merkleRoot: await archiveMerkleRoot(events),
    };
    const body: ArchiveBody = {
      format: ARCHIVE_FORMAT,
      schema: ARCHIVE_SCHEMA,
      version: ARCHIVE_VERSION,
      savedAt: new Date().toISOString(),
      profile: { ...profile, bonds: profile.bonds ?? DEFAULT_BONDS },
      binder,
      signals,
      ledger,
    };
    // The seal covers the body exactly as it will be re-read: parsed back from its own JSON.
    const seal = await sha256(JSON.stringify(JSON.parse(JSON.stringify(body))));
    const archive: Archive = { ...body, sha256Seal: seal };
    const url = URL.createObjectURL(new Blob([JSON.stringify(archive, null, 2)], { type: "application/json" }));
    const name = archiveFileName(profile.theatre);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    sealChime();
    logEvent("ARCHIVE_EXPORTED", name);
    toast.success("Sovereign mission archive exported with SHA-256 seal", { description: name });
  };

  const load = (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(String(reader.result));
      } catch {
        toast.error("Import rejected: the file is not valid JSON.");
        return;
      }
      const check = validateArchive(parsed);
      if (!check.ok) {
        toast.error(`Import rejected: ${check.reason}`);
        return;
      }
      try {
        const data = parsed as Omit<Archive, "version"> & { version?: number };

        // Verify the SHA-256 seal before anything is restored.
        let sealNote = "";
        if (typeof data.sha256Seal === "string") {
          const { sha256Seal, ...body } = data;
          const actual = await sha256(JSON.stringify(body));
          if (!timingSafeEqualText(actual, sha256Seal)) {
            const proceed = window.confirm(
              "SEAL MISMATCH. This archive was altered after it was sealed, or is damaged.\n\nLoad it anyway? Treat its contents as unverified."
            );
            if (!proceed) {
              toast.error("Import cancelled: the SHA-256 seal does not match.");
              return;
            }
            sealNote = " Seal mismatch accepted; contents unverified.";
          } else {
            sealNote = " SHA-256 seal verified.";
          }
        } else {
          sealNote = " No seal on this file (saved before sealing).";
        }

        // The seal is checked on the bytes as received; only then is every text field
        // stripped of zero-width, bidi-override and control characters before restore.
        const stripped = countStrippedDeep([data.profile, data.binder, data.signals ?? null]);
        const cleanProfile = sanitizeDeep(data.profile);
        const cleanBinder = Array.isArray(data.binder) ? sanitizeDeep(data.binder) : [];
        if (data.signals) data.signals = sanitizeDeep(data.signals);
        if (stripped > 0) sealNote += ` ${stripped} hidden or control character${stripped === 1 ? "" : "s"} removed.`;
        // Version 1 archives carry no bonds, so they restore at the 3.0 default.
        const restoredProfile = { ...EMPTY_PROFILE, ...cleanProfile, bonds: sanitizeBonds(cleanProfile?.bonds) };
        setProfile(restoredProfile);
        setBinder(cleanBinder);
        // Version 3+ archives carry the live signals; restore them so every downstream desk reads the saved mission at once.
        // Older archives carry none, so the bus is left as it stands rather than wiped.
        const restoredSignals = check.version >= 3 && data.signals ? sanitizeSignals(data.signals) : null;
        if (restoredSignals) setSignals(restoredSignals);
        const theatre = restoredProfile.theatre.trim();
        logEvent("ARCHIVE_IMPORTED", `${file.name} (schema v${check.version})`);
        logEvent("MISSION_HYDRATED", theatre || "Unnamed mission");
        // Re-mint a fresh verification stamp for the restored state. References are never reused,
        // so the archived reference is superseded rather than revived.
        const b = restoredProfile.bonds;
        const stamp = await mintDispatch(
          applyInscriptions({ ...(restoredSignals ?? signals), bonds: b, theatre: theatre || undefined }),
          "attestation",
          "vault",
        );
        toast.success(
          `Archive restored. ${cleanBinder.length} document(s) in the binder${restoredSignals ? " and the live mission signals" : ""}.${sealNote}`,
          { description: `Verification stamp re-minted: ${stamp.ref}` },
        );
        setOpen(true);
      } catch {
        toast.error("Import rejected: the archive could not be restored.");
      }
    };
    reader.readAsText(file);
  };

  /** Check a sealed chancellery text file (.txt) exported from any desk or the Breviary. */
  const verifyText = (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const v = await verifySealedText(String(reader.result));
      if (v.status === "valid") toast.success(`Seal valid. SHA-256 ${v.hash.slice(0, 12)}… matches the text.`);
      else if (v.status === "tampered") toast.error("SEAL BROKEN. The text above the stamp no longer matches its recorded SHA-256.");
      else toast.error("No Vinculum integrity stamp found in that file.");
    };
    reader.readAsText(file);
  };

  const btn =
    "inline-flex items-center justify-center gap-2 border border-brass/50 px-3 py-2 min-h-11 text-[10px] uppercase tracking-[0.18em] font-semibold text-primary hover:border-accent hover:text-accent transition-colors";

  return (
    <div
      className={`border bg-navy-tint/40 w-full min-w-0 max-w-full transition-colors ${dragging ? "border-accent" : "border-brass/40"}`}
      onDragOver={(e) => {
        if (!e.dataTransfer.types.includes("Files")) return;
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        if (!e.dataTransfer.files.length) return;
        e.preventDefault();
        setDragging(false);
        load(e.dataTransfer.files[0]);
      }}
      data-testid="mission-vault"
    >
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <Archive size={15} className="text-accent shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/80">
              Mission state vault
            </p>
            <p className="text-xs text-muted-foreground [overflow-wrap:anywhere]">
              {profile.theatre.trim() || "No active mission named"}
              {binder.length > 0 ? ` · ${binder.length} in binder` : ""}
              {slots.length > 0 ? ` · ${slots.length} in library` : ""}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 min-w-0">
          <button type="button" className={`${btn} col-span-2 sm:col-span-1`} onClick={() => setOpen((o) => !o)}>
            {open ? <X size={13} /> : null} {open ? "Close" : "Mission details & library"}
          </button>
          <button type="button" className={btn} onClick={saveCurrentToLibrary} title="Save this theatre to the library kept in this browser">
            <BookmarkCheck size={13} /> Save to library
          </button>
          <button type="button" className={btn} onClick={() => fileRef.current?.click()} aria-label="Import mission archive" title="Import a .vinculum mission archive from your device (or drop it on this bar)">
            <Upload size={13} /> <span className="sm:hidden">Import archive</span><span className="hidden sm:inline">Import mission archive</span>
          </button>
          <button type="button" className={btn} onClick={save} aria-label="Export sovereign mission archive" title="Export this mission as a sealed file to your device">
            <Archive size={13} /> <span className="sm:hidden">Export archive</span><span className="hidden sm:inline">Export sovereign mission archive</span>
          </button>
          <button
            type="button"
            className={`${btn} col-span-2 sm:col-span-1`}
            onClick={() => {
              if (!window.confirm("Start a new blank mission? The profile, bond scores, live readings and binder will be cleared. Save it to the library or export a file first if you want to keep this mission.")) return;
              setProfile({ ...EMPTY_PROFILE });
              setBinder([]);
              setSignals({});
              logEvent("MISSION_HYDRATED", "New blank mission");
              toast.success("New blank mission started.");
            }}
          >
            <RotateCcw size={13} /> New mission
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".vinculum,application/json"
            className="hidden"
            data-testid="archive-input"
            aria-label="Mission archive file"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) load(f);
              e.target.value = "";
            }}
          />
          <input
            ref={verifyRef}
            type="file"
            accept=".txt,text/plain"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) verifyText(f);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-brass/30 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em]">
        <span data-testid="enclave-badge" className={enclave.configured ? "text-accent" : "text-muted-foreground"}>
          {enclave.configured ? "[ENCLAVE: SEALED (AES-256-GCM)]" : "[ENCLAVE: PLAINTEXT LOCAL]"}
        </span>
        <span data-testid="storage-badge" className="text-muted-foreground [overflow-wrap:anywhere]">
          {telemetry
            ? telemetry.backend === "indexeddb"
              ? `STORAGE: INDEXEDDB ${telemetry.persisted ? "PERSISTED" : "BEST-EFFORT"} · ${Math.max(0, Math.round(telemetry.usedBytes / 1024)).toLocaleString("en-US")} KB USED`
              : "STORAGE: IN-MEMORY (INDEXEDDB UNAVAILABLE) · NOT PERSISTED"
            : "STORAGE: READING…"}
        </span>
        {enclaveLocked && (
          <span className="text-destructive" data-testid="enclave-locked-note">
            {sealedCount} sealed {sealedCount === 1 ? "theatre" : "theatres"} · key not in memory
          </span>
        )}
      </div>
      <EnclaveSecurityDrawer sealedCount={sealedCount} />

      {open && (
        <div className="border-t border-brass/30 px-4 py-5 space-y-6 min-w-0">
          <div>
            <span className={labelCls}>
              Saved operational theatres ({slots.length}) · <Lex term="theatre-library">local library</Lex>
            </span>
            {slots.length === 0 && enclaveLocked && sealedCount > 0 ? (
              <p className="text-xs text-muted-foreground border border-dashed border-brass/50 p-3">
                {sealedCount} sealed {sealedCount === 1 ? "theatre is" : "theatres are"} held in this browser. Unseal the enclave
                under Sovereign Enclave Security to read or switch to them.
              </p>
            ) : slots.length === 0 ? (
              <p className="text-xs text-muted-foreground border border-dashed border-brass/50 p-3">
                Empty. Name the theatre below, then press “Save to library”. Each theatre keeps its profile, bond scores,
                live readings and binder, so you can switch between them without losing records.
              </p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {slots.map((s) => {
                  const active = slotIdFor(profile.theatre.trim() || "Untitled mission") === s.id;
                  return (
                    <div
                      key={s.id}
                      className={`flex min-w-0 items-stretch border bg-background ${active ? "border-accent" : "border-border hover:border-accent"} transition-colors`}
                    >
                      <button
                        type="button"
                        onClick={() => loadSlot(s)}
                        aria-label={`Switch to ${s.name}`}
                        className="min-w-0 flex-1 p-3 text-left min-h-11"
                      >
                        <span className="block truncate font-serif text-primary text-sm font-semibold">{s.name}</span>
                        <span className="mt-1 block text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                          {active ? "Active · " : ""}Saved {new Date(s.updatedAt).toLocaleDateString()}
                          {s.binder.length ? ` · ${s.binder.length} in binder` : ""}
                        </span>
                      </button>
                      <button
                        type="button"
                        aria-label={`Remove ${s.name} from the library`}
                        onClick={() => deleteSlot(s)}
                        className="shrink-0 px-3 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="min-w-0">
              <label className={labelCls} htmlFor="mv-theatre">Mission or theatre</label>
              <input
                id="mv-theatre"
                className={fieldCls}
                value={profile.theatre}
                onChange={(e) => setProfile({ ...profile, theatre: e.target.value })}
                placeholder="Mara Basin, Great Lakes, Northern Rift"
              />
            </div>
            <div className="min-w-0">
              <label className={labelCls} htmlFor="mv-parties">Parties of record</label>
              <input
                id="mv-parties"
                className={fieldCls}
                value={profile.parties}
                onChange={(e) => setProfile({ ...profile, parties: e.target.value })}
                placeholder="State executive; youth coalition; guarantor"
              />
            </div>
            <div className="min-w-0">
              <label className={labelCls} htmlFor="mv-officer">Drafting officer</label>
              <input
                id="mv-officer"
                className={fieldCls}
                value={profile.officer}
                onChange={(e) => setProfile({ ...profile, officer: e.target.value })}
                placeholder="Name and desk"
              />
            </div>
            <div className="min-w-0">
              <label className={labelCls} htmlFor="mv-class">Classification</label>
              <input
                id="mv-class"
                className={fieldCls}
                value={profile.classification}
                onChange={(e) => setProfile({ ...profile, classification: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
              <button type="button" className={btn} onClick={() => verifyRef.current?.click()} title="Check the SHA-256 seal of a text file exported from any desk">
                <ShieldCheck size={13} /> Verify a sealed .txt
              </button>
              <p className="min-w-0 flex-1 basis-60 text-xs text-muted-foreground leading-relaxed">
                Archive files are sealed with a SHA-256 digest that is checked again on import. The theatre library is kept
                in this browser's IndexedDB only{enclave.configured ? ", encrypted with AES-256-GCM" : ""}. It is never uploaded and the system keeps no copy. Anything not saved to the library
                or to a file clears when you refresh.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
