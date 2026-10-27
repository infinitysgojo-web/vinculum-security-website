/**
 * Omni-theatre hydration presets. Each preset is a training scenario: a bond
 * vector, a mission profile and the starting inputs of every desk that holds
 * inputs of its own. Hydrating a preset writes the profile, bumps presetEpoch
 * on the bus, and every mounted desk re-seeds from it, recomputes and publishes,
 * so the whole chain moves together. The readings are illustrative scenario
 * figures for practice, not field measurements of the named theatres.
 */
import { useEffect, useRef } from "react";
import { useEngine } from "./engine";
import type { MissionBonds } from "./mission";

export type TheatreId = "GREAT_LAKES" | "HORN_AFRICA" | "NORTHERN_IRELAND" | "COLOMBIA_ANDES" | "MINDANAO_BARMM";

export type DeskSeeds = {
  sentinel: { on: number[]; trend: 0 | 1 | 2 };
  tracks: { done: string[] };
  compound: { on: string[] };
  succession: { inForce: string[]; shocks: string[] };
  verification: { seated: string[]; met: string[]; interval: "30" | "90" | "180" };
  handover: { cleared: string[]; deps: string[] };
  multiparty: { picked: string[] };
  clauses: { picked: number[] };
};

export type TheatrePreset = {
  id: TheatreId;
  sigil: string;
  name: string;
  description: string;
  parties: string;
  coords: { lat: number; lng: number };
  bonds: MissionBonds;
  seeds: DeskSeeds;
};

export const THEATRES: TheatrePreset[] = [
  {
    id: "GREAT_LAKES",
    sigil: "GLK",
    name: "Great Lakes Cross-Border Corridor",
    description: "Cross-border security and an extractive corridor under armed-group pressure.",
    parties: "Two governments; armed movement; corridor communities; regional guarantor",
    coords: { lat: -1.68, lng: 29.23 }, // Goma / Kivu corridor
    bonds: { interpersonal: 2.6, communal: 2.2, intergenerational: 2.4, institutional: 2.8 },
    seeds: {
      sentinel: { on: [0, 2, 6, 7, 9, 12, 15, 18, 20], trend: 0 },
      tracks: { done: ["i1", "ii1", "i2", "i3"] },
      compound: { on: ["displacement", "currency", "capture"] },
      succession: { inForce: ["verify", "outcome"], shocks: ["principal", "capture"] },
      verification: { seated: ["civil", "guarantor"], met: ["o1", "o2"], interval: "30" },
      handover: { cleared: ["t1", "t2"], deps: ["d1", "d2", "d3"] },
      multiparty: { picked: ["state", "armed", "civil", "guarantor"] },
      clauses: { picked: [0, 2, 4] },
    },
  },
  {
    id: "HORN_AFRICA",
    sigil: "HOA",
    name: "Horn of Africa Red Sea Littoral",
    description: "Maritime security on the Bab el-Mandeb and Red Sea littoral with external patrons.",
    parties: "Littoral state; armed movement; coastal communities; external patrons",
    coords: { lat: 11.59, lng: 43.15 }, // Bab el-Mandeb littoral
    bonds: { interpersonal: 2.9, communal: 2.5, intergenerational: 2.3, institutional: 2.6 },
    seeds: {
      sentinel: { on: [1, 6, 8, 12, 13, 19, 21], trend: 0 },
      tracks: { done: ["i1", "ii1", "i2"] },
      compound: { on: ["theatre", "attention", "donor"] },
      succession: { inForce: ["office", "verify"], shocks: ["principal", "theater"] },
      verification: { seated: ["technical", "guarantor"], met: ["o1"], interval: "30" },
      handover: { cleared: ["t1"], deps: ["d1", "d4"] },
      multiparty: { picked: ["state", "armed", "guarantor", "donor"] },
      clauses: { picked: [0, 4] },
    },
  },
  {
    id: "NORTHERN_IRELAND",
    sigil: "NIR",
    name: "Northern Ireland Legacy and Protocol",
    description: "Legacy arrangements and internal-market protocol strain on a mature accord.",
    parties: "Two governments; devolved executive; unionist and nationalist communities; victims' groups",
    coords: { lat: 54.60, lng: -5.93 }, // Belfast
    bonds: { interpersonal: 3.4, communal: 2.8, intergenerational: 3.1, institutional: 3.3 },
    seeds: {
      sentinel: { on: [7, 10, 16, 22], trend: 1 },
      tracks: { done: ["i1", "ii1", "i2", "ii2", "i3", "ii3", "i4", "ii4", "i5", "ii5"] },
      compound: { on: ["election", "attention"] },
      succession: { inForce: ["office", "verify", "budget", "outcome", "auto"], shocks: ["election"] },
      verification: { seated: ["civil", "elders", "ombuds", "technical"], met: ["o1", "o2", "o3", "o4", "o5", "o6"], interval: "90" },
      handover: { cleared: ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8"], deps: ["d2"] },
      multiparty: { picked: ["state", "civil", "youth", "guarantor"] },
      clauses: { picked: [1, 2, 3, 5] },
    },
  },
  {
    id: "COLOMBIA_ANDES",
    sigil: "COL",
    name: "Colombia Andes Border Accord",
    description: "Border peace accord implementation with illicit-crop substitution and dissident pressure.",
    parties: "Government; former insurgency; dissident fronts; rural communities; guarantor states",
    coords: { lat: 4.71, lng: -74.07 }, // Bogotá
    bonds: { interpersonal: 3.1, communal: 2.7, intergenerational: 2.6, institutional: 2.9 },
    seeds: {
      sentinel: { on: [3, 8, 12, 14, 19], trend: 2 },
      tracks: { done: ["i1", "ii1", "i2", "ii2", "i3", "ii3", "i4"] },
      compound: { on: ["capture", "youth", "currency"] },
      succession: { inForce: ["office", "verify", "youth", "outcome"], shocks: ["election", "capture"] },
      verification: { seated: ["civil", "youth", "guarantor", "technical"], met: ["o1", "o2", "o3", "o4"], interval: "90" },
      handover: { cleared: ["t1", "t2", "t3", "t5"], deps: ["d1", "d3"] },
      multiparty: { picked: ["state", "armed", "youth", "guarantor"] },
      clauses: { picked: [1, 3, 4] },
    },
  },
  {
    id: "MINDANAO_BARMM",
    sigil: "BAR",
    name: "Mindanao BARMM Normalization",
    description: "Autonomous-region political transition and decommissioning under normalization.",
    parties: "National government; autonomous authority; decommissioning combatants; clan elders; third-party monitors",
    coords: { lat: 7.22, lng: 124.25 }, // Cotabato City
    bonds: { interpersonal: 3.2, communal: 3.0, intergenerational: 3.0, institutional: 3.1 },
    seeds: {
      sentinel: { on: [9, 13, 20], trend: 2 },
      tracks: { done: ["i1", "ii1", "i2", "ii2", "i3", "ii3", "i4", "ii4", "i5"] },
      compound: { on: ["principal", "election"] },
      succession: { inForce: ["office", "verify", "budget", "outcome"], shocks: ["principal"] },
      verification: { seated: ["civil", "elders", "guarantor"], met: ["o1", "o2", "o3", "o5"], interval: "90" },
      handover: { cleared: ["t1", "t2", "t3", "t4", "t6"], deps: ["d1"] },
      multiparty: { picked: ["state", "armed", "elders", "guarantor"] },
      clauses: { picked: [0, 2, 5] },
    },
  },
];

export const theatreById = (id?: string) => THEATRES.find((t) => t.id === id);

/**
 * Re-seed a desk's own inputs whenever a theatre preset is hydrated. Runs on mount
 * and on every new presetEpoch, so a desk opened later still starts from the preset.
 */
export function useTheatreSeed<K extends keyof DeskSeeds>(desk: K, apply: (seed: DeskSeeds[K]) => void) {
  const { signals } = useEngine();
  const fn = useRef(apply);
  fn.current = apply;
  const seen = useRef<number | undefined>(undefined);
  useEffect(() => {
    const t = theatreById(signals.presetId);
    if (!t || seen.current === signals.presetEpoch) return;
    seen.current = signals.presetEpoch;
    fn.current(t.seeds[desk]);
  }, [desk, signals.presetId, signals.presetEpoch]);
}
