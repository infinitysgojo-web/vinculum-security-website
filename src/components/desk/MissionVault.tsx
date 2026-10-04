import { useRef, useState } from "react";
import { Archive, RotateCcw, Upload, X } from "lucide-react";
import { toast } from "sonner";
import type { BinderEntry } from "./DeskOutput";

import { DEFAULT_BONDS, EMPTY_PROFILE, sanitizeBonds, type MissionProfile } from "./mission";
import { sanitizeSignals, type Signals } from "./engine";

export { EMPTY_PROFILE };
export type { MissionProfile };

type Archive = {
  format: "vinculum-mission-archive";
  /**
   * 3 adds the live mission signals (rupture index, active shocks, covenants, track divergence).
   * 2 added profile.bonds. Version 1 and 2 archives still load; they carry no signals,
   * so the desks upstream have to be revisited, as before.
   */
  version: 3;
  savedAt: string;
  profile: MissionProfile;
  binder: BinderEntry[];
  signals?: Signals;
};

const ARCHIVE_VERSION = 3;

const fieldCls = "w-full border border-input bg-background px-3 py-2.5 text-sm";
const labelCls = "text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/70 mb-2 block";

/**
 * Mission State Vault. Saves the working session to a file on the practitioner's
 * own machine and reloads it later. Nothing is uploaded and nothing is stored
 * by the system; the file never leaves the device unless the user moves it.
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
  const fileRef = useRef<HTMLInputElement>(null);

  const save = () => {
    const archive: Archive = {
      format: "vinculum-mission-archive",
      version: ARCHIVE_VERSION,
      savedAt: new Date().toISOString(),
      profile: { ...profile, bonds: profile.bonds ?? DEFAULT_BONDS },
      binder,
      signals,
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(archive, null, 2)], { type: "application/json" })
    );
    const slug = (profile.theatre.trim() || "mission").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    const a = document.createElement("a");
    a.href = url;
    a.download = `vinculum-${slug}.vinculum`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    toast.success("Mission archive saved to your device");
  };

  const load = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result)) as Omit<Archive, "version"> & { version?: number };
        if (data?.format !== "vinculum-mission-archive") throw new Error("wrong format");
        if (typeof data.version === "number" && data.version > ARCHIVE_VERSION) {
          toast.error("This archive was saved by a newer version of the vault.");
          return;
        }
        // Version 1 archives carry no bonds, so they restore at the 3.0 default.
        setProfile({ ...EMPTY_PROFILE, ...data.profile, bonds: sanitizeBonds(data.profile?.bonds) });
        setBinder(Array.isArray(data.binder) ? data.binder : []);
        // Version 3 archives carry the live signals; restore them so every downstream desk reads the saved mission at once.
        // Older archives carry none, so the bus is left as it stands rather than wiped.
        const restoredSignals = data.version === 3 && data.signals ? sanitizeSignals(data.signals) : null;
        if (restoredSignals) setSignals(restoredSignals);
        toast.success(
          `Archive restored. ${data.binder?.length ?? 0} document(s) in the binder${restoredSignals ? " and the live mission signals" : ""}.`
        );
        setOpen(true);
      } catch {
        toast.error("That file is not a Vinculum mission archive.");
      }
    };
    reader.readAsText(file);
  };


  const btn =
    "inline-flex items-center justify-center gap-2 border border-brass/50 px-3 py-2 min-h-11 text-[10px] uppercase tracking-[0.18em] font-semibold text-primary hover:border-accent hover:text-accent transition-colors";

  return (
    <div className="border border-brass/40 bg-navy-tint/40">
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <Archive size={15} className="text-accent shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/80">
              Mission state vault
            </p>
            <p className="text-xs text-muted-foreground">
              {profile.theatre.trim() || "No active mission named"}
              {binder.length > 0 ? ` · ${binder.length} in binder` : ""}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
          <button type="button" className={`${btn} col-span-2 sm:col-span-1`} onClick={() => setOpen((o) => !o)}>
            {open ? <X size={13} /> : null} {open ? "Close" : "Mission details"}
          </button>
          <button type="button" className={btn} onClick={() => fileRef.current?.click()} title="Import a mission file from your device">
            <Upload size={13} /> Import file
          </button>
          <button type="button" className={btn} onClick={save} title="Export this mission as a file to your device">
            <Archive size={13} /> Export file
          </button>
          <button
            type="button"
            className={`${btn} col-span-2 sm:col-span-1`}
            onClick={() => {
              if (!window.confirm("Start a new blank mission? The profile, bond scores, live readings and binder will be cleared. Export a file first if you want to keep this mission.")) return;
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
        </div>
      </div>

      {open && (
        <div className="border-t border-brass/30 px-4 py-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="mv-theatre">Mission or theatre</label>
            <input
              id="mv-theatre"
              className={fieldCls}
              value={profile.theatre}
              onChange={(e) => setProfile({ ...profile, theatre: e.target.value })}
              placeholder="Eastern corridor transition"
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="mv-parties">Parties of record</label>
            <input
              id="mv-parties"
              className={fieldCls}
              value={profile.parties}
              onChange={(e) => setProfile({ ...profile, parties: e.target.value })}
              placeholder="State executive; youth coalition; guarantor"
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="mv-officer">Drafting officer</label>
            <input
              id="mv-officer"
              className={fieldCls}
              value={profile.officer}
              onChange={(e) => setProfile({ ...profile, officer: e.target.value })}
              placeholder="Name and desk"
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="mv-class">Classification</label>
            <input
              id="mv-class"
              className={fieldCls}
              value={profile.classification}
              onChange={(e) => setProfile({ ...profile, classification: e.target.value })}
            />
          </div>
          <p className="sm:col-span-2 text-xs text-muted-foreground leading-relaxed">
            The archive is a file on your own machine. It is never uploaded, and the system keeps no copy.
            Anything not saved to an archive clears when you sign out or refresh.
          </p>
        </div>
      )}
    </div>
  );
}
