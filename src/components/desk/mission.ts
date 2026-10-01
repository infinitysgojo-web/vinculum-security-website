import { createContext, useContext } from "react";

/** The active mission profile, shared by every desk on the dashboard. */
export type MissionProfile = {
  theatre: string;
  parties: string;
  classification: string;
  officer: string;
};

export const EMPTY_PROFILE: MissionProfile = {
  theatre: "",
  parties: "",
  classification: "Unrestricted, working draft",
  officer: "",
};

export const MissionContext = createContext<MissionProfile>(EMPTY_PROFILE);

/** Read the active mission profile from any desk. */
export function useMission() {
  return useContext(MissionContext);
}
