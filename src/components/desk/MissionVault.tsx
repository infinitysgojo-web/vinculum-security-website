import { useEffect, useRef, useState } from "react";
import { Archive, BookmarkCheck, RotateCcw, ShieldCheck, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import type { BinderEntry } from "./DeskOutput";

import { DEFAULT_BONDS, EMPTY_PROFILE, sanitizeBonds, type MissionProfile } from "./mission";
import { sanitizeSignals, type Signals } from "./engine";
import { sha256, verifySealedText } from "./integrity";
import { Lex } from "./Lexicon";

export { EMPTY_PROFILE };
export type { MissionProfile };

type ArchiveBody = {
  format: "vinculum-mission-archive";
  /**
   * 3 adds the live mission signals (rupture index, active shocks, covenants, track divergence).
   * 2 added profile.bonds. Version 1 and 2 archives still load; they carry no signals,
   * so the desks upstream have to be revisited, as before.
   * The optional sha256Seal is the SHA-256 of the archive body without the seal itself.
   */
  version: 3;
  savedAt: string;
  profile: MissionProfile;
  binder: BinderEntry[];
  signals?: Signals;
};
type Archive = ArchiveBody & { sha256Seal?: string };

const ARCHIVE_VERSION = 3;

/** Browser-local library of operational theatres. Never leaves this device. */
export const THEATRE_LIBRARY_KEY = "vinculum-theatre-library";

type SavedTheatreSlot = {
  id: string;
  name: string;
  updatedAt: string;
  profile: MissionProfile;
  binder: BinderEntry[];
  signals: Signals;
};

const fieldCls = "w-full border border-input bg-background px-3 py-2.5 text-sm";
const labelCls = "text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/70 mb-2 block";

const slotIdFor = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "untitled-mission";

/** Read the library defensively: a damaged or hand-edited entry is dropped, never trusted. */
function readLibrary(): SavedTheatreSlot[] {
  try {
    const raw = window.localStorage.getItem(THEATRE_LIBRARY_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((s): s is SavedTheatreSlot => !!s && typeof s === "object" && typeof (s as SavedTheatreSlot).id === "string" && typeof (s as SavedTheatreSlot).name === "string" && !!(s as SavedTheatreSlot).profile)
      .map((s) => ({
        id: s.id,
        name: s.name,
        updatedAt: typeof s.updatedAt === "string" ? s.updatedAt : new Date(0).toISOString(),
        profile: { ...EMPTY_PROFILE, ...s.profile, bonds: sanitizeBonds(s.profile.bonds) },
        binder: Array.isArray(s.binder) ? s.binder : [],
        signals: sanitizeSignals(s.signals),
      }));
  } catch {
    return [];
  }
}

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
  const [slots, setSlots] = useState<SavedTheatreSlot[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const verifyRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSlots(readLibrary());
  }, []);

  const persistSlots = (updated: SavedTheatreSlot[]): boolean => {
    try {
      window.localStorage.setItem(THEATRE_LIBRARY_KEY, JSON.stringify(updated));
      setSlots(updated);
      return true;
    } catch {
      toast.error("This browser would not store the library (storage full or blocked). Export a file instead.");
      return false;
    }
  };

  const saveCurrentToLibrary = () => {
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
    const updated = exists ? slots.map((s) => (s.id === id ? slot : s)) : [slot, ...slots];
    if (persistSlots(updated)) toast.success(`${exists ? "Updated" : "Saved"} “${name}” in the theatre library`);
  };

  const loadSlot = (slot: SavedTheatreSlot) => {
    setProfile({ ...EMPTY_PROFILE, ...slot.profile, bonds: sanitizeBonds(slot.profile.bonds) });
    setBinder(slot.binder ?? []);
    setSignals(sanitizeSignals(slot.signals));
    toast.success(`Switched theatre to “${slot.name}”`);
  };

  const deleteSlot = (slot: SavedTheatreSlot) => {
    if (!window.confirm(`Remove “${slot.name}” from the theatre library? This cannot be undone.`)) return;
    if (persistSlots(slots.filter((s) => s.id !== slot.id))) toast.success("Theatre removed from the library");
  };

  const save = async () => {
    const body: ArchiveBody = {
      format: "vinculum-mission-archive",
      version: ARCHIVE_VERSION,
      savedAt: new Date().toISOString(),
      profile: { ...profile, bonds: profile.bonds ?? DEFAULT_BONDS },
      binder,
      signals,
    };
    // The seal covers the body exactly as it will be re-read: parsed back from its own JSON.
    const seal = await sha256(JSON.stringify(JSON.parse(JSON.stringify(body))));
    const archive: Archive = { ...body, sha256Seal: seal };
    const url = URL.createObjectURL(new Blob([JSON.stringify(archive, null, 2)], { type: "application/json" }));
    const slug = (profile.theatre.trim() || "mission").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    const a = document.createElement("a");
    a.href = url;
    a.download = `vinculum-${slug}.vinculum`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    toast.success("Mission archive saved with SHA-256 seal");
  };

  const load = (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const data = JSON.parse(String(reader.result)) as Omit<Archive, "version"> & { version?: number };
        if (data?.format !== "vinculum-mission-archive") throw new Error("wrong format");
        if (typeof data.version === "number" && data.version > ARCHIVE_VERSION) {
          toast.error("This archive was saved by a newer version of the vault.");
          return;
        }

        // Verify the SHA-256 seal before anything is restored.
        let sealNote = "";
        if (typeof data.sha256Seal === "string") {
          const { sha256Seal, ...body } = data;
          const actual = await sha256(JSON.stringify(body));
          if (actual !== sha256Seal) {
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

        // Version 1 archives carry no bonds, so they restore at the 3.0 default.
        setProfile({ ...EMPTY_PROFILE, ...data.profile, bonds: sanitizeBonds(data.profile?.bonds) });
        setBinder(Array.isArray(data.binder) ? data.binder : []);
        // Version 3 archives carry the live signals; restore them so every downstream desk reads the saved mission at once.
        // Older archives carry none, so the bus is left as it stands rather than wiped.
        const restoredSignals = data.version === 3 && data.signals ? sanitizeSignals(data.signals) : null;
        if (restoredSignals) setSignals(restoredSignals);
        toast.success(
          `Archive restored. ${Array.isArray(data.binder) ? data.binder.length : 0} document(s) in the binder${restoredSignals ? " and the live mission signals" : ""}.${sealNote}`
        );
        setOpen(true);
      } catch {
        toast.error("That file is not a Vinculum mission archive.");
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
    <div className="border border-brass/40 bg-navy-tint/40 w-full min-w-0 max-w-full">
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
          <button type="button" className={btn} onClick={() => fileRef.current?.click()} title="Import a mission file from your device">
            <Upload size={13} /> Import file
          </button>
          <button type="button" className={btn} onClick={save} title="Export this mission as a sealed file to your device">
            <Archive size={13} /> Export file
          </button>
          <button
            type="button"
            className={`${btn} col-span-2 sm:col-span-1`}
            onClick={() => {
              if (!window.confirm("Start a new blank mission? The profile, bond scores, live readings and binder will be cleared. Save it to the library or export a file first if you want to keep this mission.")) return;
              setProfile({ ...EMPTY_PROFILE });
              setBinder([]);
              setSignals({});
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

      {open && (
        <div className="border-t border-brass/30 px-4 py-5 space-y-6 min-w-0">
          <div>
            <span className={labelCls}>
              Saved operational theatres ({slots.length}) · <Lex term="theatre-library">local library</Lex>
            </span>
            {slots.length === 0 ? (
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
                in this browser only. It is never uploaded and the system keeps no copy. Anything not saved to the library
                or to a file clears when you refresh.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
