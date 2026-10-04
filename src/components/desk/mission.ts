import { createContext, useContext } from "react";

/** The four relational bond scores (1.0 to 5.0, one decimal), carried with the mission. */
export type MissionBonds = {
  interpersonal: number;
  communal: number;
  intergenerational: number;
  institutional: number;
};

/** The active mission profile, shared by every desk on the dashboard. */
export type MissionProfile = {
  theatre: string;
  parties: string;
  classification: string;
  officer: string;
  /** Baseline bond vector. Optional so version 1 archives and older saved sessions still load. */
  bonds?: MissionBonds;
};

export const DEFAULT_BONDS: MissionBonds = {
  interpersonal: 3.0,
  communal: 3.0,
  intergenerational: 3.0,
  institutional: 3.0,
};

export const EMPTY_PROFILE: MissionProfile = {
  theatre: "",
  parties: "",
  classification: "Unrestricted, working draft",
  officer: "",
};


/** Coerce anything read from a file or a saved session into a valid bond vector. */
export function sanitizeBonds(raw: unknown): MissionBonds {
  const src = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const pick = (k: keyof MissionBonds) => {
    const n = Number(src[k]);
    return Number.isFinite(n) ? Math.min(5, Math.max(1, Math.round(n * 10) / 10)) : DEFAULT_BONDS[k];
  };
  return {
    interpersonal: pick("interpersonal"),
    communal: pick("communal"),
    intergenerational: pick("intergenerational"),
    institutional: pick("institutional"),
  };
}

export const MissionContext = createContext<MissionProfile>(EMPTY_PROFILE);

/** Read the active mission profile from any desk. */
export function useMission() {
  return useContext(MissionContext);
}
