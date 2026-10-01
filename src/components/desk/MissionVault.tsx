import { useRef, useState } from "react";
import { Archive, Upload, X } from "lucide-react";
import { toast } from "sonner";
import type { BinderEntry } from "./DeskOutput";

import { EMPTY_PROFILE, type MissionProfile } from "./mission";

export { EMPTY_PROFILE };
export type { MissionProfile };

type Archive = {
  format: "vinculum-mission-archive";
  version: 1;
  savedAt: string;
  profile: MissionProfile;
  binder: BinderEntry[];
};

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
}: {
  profile: MissionProfile;
  setProfile: (p: MissionProfile) => void;
  binder: BinderEntry[];
  setBinder: (b: BinderEntry[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const save = () => {
    const archive: Archive = {
      format: "vinculum-mission-archive",
      version: 1,
      savedAt: new Date().toISOString(),
      profile,
      binder,
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
        const data = JSON.parse(String(reader.result)) as Archive;
        if (data?.format !== "vinculum-mission-archive") throw new Error("wrong format");
        setProfile({ ...EMPTY_PROFILE, ...data.profile });
        setBinder(Array.isArray(data.binder) ? data.binder : []);
        toast.success(`Archive restored. ${data.binder?.length ?? 0} document(s) in the binder.`);
        setOpen(true);
      } catch {
        toast.error("That file is not a Vinculum mission archive.");
      }
    };
    reader.readAsText(file);
  };

  const btn =
    "inline-flex items-center gap-2 border border-brass/50 px-3 py-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary hover:border-accent hover:text-accent transition-colors";

  return (
    <div className="border border-brass/40 bg-navy-tint/40">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <Archive size={15} className="text-accent" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/80">
              Mission state vault
            </p>
            <p className="text-xs text-muted-foreground">
              {profile.theatre.trim() || "No active mission named"}
              {binder.length > 0 ? ` · ${binder.length} in binder` : ""}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btn} onClick={() => setOpen((o) => !o)}>
            {open ? <X size={13} /> : null} {open ? "Close" : "Mission details"}
          </button>
          <button type="button" className={btn} onClick={() => fileRef.current?.click()}>
            <Upload size={13} /> Load archive
          </button>
          <button type="button" className={btn} onClick={save}>
            <Archive size={13} /> Save archive
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
