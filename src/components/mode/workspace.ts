/**
 * Two-mode mission workspace model: Preset Proving Ground and Custom Operational Mission.
 *
 * Pure, browser-local data. A workspace wraps the same desk-state payload the saved
 * session already keeps (mission profile, binder, bus signals and desk position) with
 * the mode, lifecycle, Context Tray entries, Decision Record and lineage. Nothing here
 * computes a desk reading: every figure the shell shows is read from the MissionEngine.
 */
import type { BinderEntry } from "@/components/desk/DeskOutput";
import type { Signals } from "@/components/desk/engine";
import { EMPTY_PROFILE, sanitizeBonds, type MissionProfile } from "@/components/desk/mission";

export const WORKSPACE_SCHEMA = 1;

export type Mode = "preset" | "custom";

/** Training runs live in Preset mode; the four custom states are browser-local workflow states only. */
export type Lifecycle = "training" | "draft" | "review" | "ready" | "sealed";

export const LIFECYCLE_LABEL: Record<Lifecycle, string> = {
  training: "Training Run",
  draft: "Draft",
  review: "Internal Review Preparation",
  ready: "Ready for Local Handover",
  sealed: "Sealed Local Snapshot",
};

/** The short status the shared header shows. */
export const LIFECYCLE_SHORT: Record<Lifecycle, string> = {
  training: "Training Run",
  draft: "Draft",
  review: "Review Preparation",
  ready: "Ready for Local Handover",
  sealed: "Sealed Local Snapshot",
};

export const MODE_LABEL: Record<Mode, string> = {
  preset: "Preset Proving Ground",
  custom: "Custom Operational Mission",
};

export const TRAINING_NOTICE = "TRAINING SIMULATION — NOT AN OPERATIONAL RECORD.";
export const DERIVED_NOTICE = "DERIVED TRAINING EXERCISE — NOT A LIVE OPERATIONAL RECORD.";
export const PROMOTION_LINEAGE = "Initialized from a reviewed training structure.";

export type EntryStatus = "fact" | "assumption" | "question" | "excluded";
export const STATUS_LABEL: Record<EntryStatus, string> = {
  fact: "Fact",
  assumption: "Working Assumption",
  question: "Open Question",
  excluded: "Excluded",
};
/** A text marker for each status, so the state never rests on colour alone. */
export const STATUS_MARK: Record<EntryStatus, string> = { fact: "F", assumption: "A", question: "Q", excluded: "X" };

export type TrayPanel = "assumptions" | "evidence" | "questions";
export const PANEL_LABEL: Record<TrayPanel, string> = { assumptions: "Assumptions", evidence: "Evidence", questions: "Open Questions" };
export const PANEL_DEFAULT_STATUS: Record<TrayPanel, EntryStatus> = { assumptions: "assumption", evidence: "fact", questions: "question" };

export type ContextEntry = {
  id: string;
  panel: TrayPanel;
  status: EntryStatus;
  text: string;
  /** Source or reference label, as the user typed it. Never verified by the app. */
  source?: string;
  /** Desk the entry concerns, by dashboard desk id. */
  desk?: string;
  at: string;
};

export type DecisionStatus = "active" | "superseded" | "withdrawn";
export type Decision = {
  id: string;
  what: string;
  why: string;
  desk?: string;
  impact?: string;
  before?: string;
  after?: string;
  at: string;
  status: DecisionStatus;
};

export type Warrant = {
  title: string;
  objective: string;
  theatre: string;
  custodian: string;
  authority: string;
  handling: string;
  scope: string;
};

export const EMPTY_WARRANT: Warrant = { title: "", objective: "", theatre: "", custodian: "", authority: "", handling: "", scope: "" };

export const WARRANT_FIELDS: { key: keyof Warrant; label: string; hint: string; required: boolean }[] = [
  { key: "title", label: "Mission title", hint: "A short working title.", required: true },
  { key: "objective", label: "Concise objective", hint: "One or two sentences.", required: true },
  { key: "theatre", label: "Theatre / working context", hint: "Carried to the mission profile and the registry sigil.", required: true },
  { key: "custodian", label: "Mission custodian", hint: "Carried to the mission profile as the drafting officer.", required: true },
  { key: "authority", label: "Authority or mandate basis", hint: "As you hold it. The app does not verify it.", required: true },
  { key: "handling", label: "Handling / classification label", hint: "Carried to the mission profile classification.", required: true },
  { key: "scope", label: "Scope boundary", hint: "What this mission covers and where it stops.", required: true },
];

export type DeskState = {
  profile: MissionProfile;
  binder: BinderEntry[];
  signals: Signals;
  division: string;
  desk: string;
};

export type ReplayEvent = { at: string; kind: string; detail: string };

export type SealRecord = {
  ref: string;
  digest: string;
  at: string;
  /** Canonical JSON exactly as hashed, so the snapshot can be re-verified offline. */
  canonical: string;
};

export type Lineage = {
  parentId?: string;
  kind: "branch" | "promotion" | "derivative" | "import" | "continuation";
  note: string;
  at: string;
};

export type Workspace = {
  schema: number;
  id: string;
  mode: Mode;
  title: string;
  lifecycle: Lifecycle;
  createdAt: string;
  updatedAt: string;
  /** Preset mode: the scenario package this exercise was started from. */
  scenario?: { id: string; version: number };
  /** Branch label, when the exercise was branched under one. */
  label?: string;
  lineage?: Lineage;
  /** Custom mode: the Mission Warrant. */
  warrant?: Warrant;
  /** Marks a sanitized training derivative of a custom mission. */
  derived?: boolean;
  state: DeskState;
  tray: ContextEntry[];
  decisions: Decision[];
  replay: ReplayEvent[];
  checkpointsRevealed: string[];
  sealed?: SealRecord;
  /** Preset mode: the desk state at creation, restored by Reset. */
  baseline?: DeskState;
  [extra: string]: unknown;
};

export type WorkspaceStore = {
  schema: number;
  workspaces: Workspace[];
  /** Entries that failed validation. Kept, never erased, so nothing a user made is lost. */
  quarantine: unknown[];
  [extra: string]: unknown;
};

export const EMPTY_STORE: WorkspaceStore = { schema: WORKSPACE_SCHEMA, workspaces: [], quarantine: [] };

export const newId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 0xffffff).toString(36)}`;

export const blankState = (): DeskState => ({ profile: { ...EMPTY_PROFILE }, binder: [], signals: {}, division: "assess", desk: "diagnostics" });

/* ------------------------------------------------------------------ */
/* Validation and migration                                            */
/* ------------------------------------------------------------------ */

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const str = (v: unknown, d = "") => (typeof v === "string" ? v : d);
const LIFECYCLES: Lifecycle[] = ["training", "draft", "review", "ready", "sealed"];
const STATUSES: EntryStatus[] = ["fact", "assumption", "question", "excluded"];
const PANELS: TrayPanel[] = ["assumptions", "evidence", "questions"];
const DSTAT: DecisionStatus[] = ["active", "superseded", "withdrawn"];

function readState(raw: unknown): DeskState {
  const s = isObj(raw) ? raw : {};
  const p = isObj(s.profile) ? s.profile : {};
  const profile: MissionProfile = {
    ...EMPTY_PROFILE,
    ...(p as Partial<MissionProfile>),
    theatre: str(p.theatre),
    parties: str(p.parties),
    classification: str(p.classification, EMPTY_PROFILE.classification),
    officer: str(p.officer),
    ...(p.bonds ? { bonds: sanitizeBonds(p.bonds) } : {}),
  };
  const binder = Array.isArray(s.binder)
    ? (s.binder.filter((e) => isObj(e) && typeof e.id === "string" && typeof e.text === "string") as BinderEntry[])
    : [];
  return {
    profile,
    binder,
    signals: isObj(s.signals) ? (s.signals as Signals) : {},
    division: str(s.division, "assess"),
    desk: str(s.desk, "diagnostics"),
  };
}

/**
 * Validate one stored workspace. Returns null when the shape cannot be trusted; unknown
 * fields are carried through untouched so a newer or older build never drops them.
 */
export function readWorkspace(raw: unknown): Workspace | null {
  if (!isObj(raw)) return null;
  if (typeof raw.id !== "string" || !raw.id) return null;
  if (raw.mode !== "preset" && raw.mode !== "custom") return null;
  if (!isObj(raw.state)) return null;
  const mode = raw.mode;
  const lifecycle = LIFECYCLES.includes(raw.lifecycle as Lifecycle) ? (raw.lifecycle as Lifecycle) : mode === "preset" ? "training" : "draft";
  const tray = Array.isArray(raw.tray)
    ? raw.tray.filter(isObj).filter((e) => typeof e.id === "string" && typeof e.text === "string").map((e) => ({
        ...e,
        id: e.id as string,
        text: e.text as string,
        panel: PANELS.includes(e.panel as TrayPanel) ? (e.panel as TrayPanel) : "assumptions",
        status: STATUSES.includes(e.status as EntryStatus) ? (e.status as EntryStatus) : "assumption",
        at: str(e.at),
      }))
    : [];
  const decisions = Array.isArray(raw.decisions)
    ? raw.decisions.filter(isObj).filter((d) => typeof d.id === "string").map((d) => ({
        ...d,
        id: d.id as string,
        what: str(d.what),
        why: str(d.why),
        at: str(d.at),
        status: DSTAT.includes(d.status as DecisionStatus) ? (d.status as DecisionStatus) : "active",
      }))
    : [];
  const replay = Array.isArray(raw.replay)
    ? raw.replay.filter(isObj).map((r) => ({ at: str(r.at), kind: str(r.kind), detail: str(r.detail) }))
    : [];
  return {
    ...raw,
    schema: WORKSPACE_SCHEMA,
    id: raw.id,
    mode,
    title: str(raw.title, mode === "preset" ? "Untitled exercise" : "Untitled mission"),
    lifecycle: mode === "preset" ? "training" : lifecycle === "training" ? "draft" : lifecycle,
    createdAt: str(raw.createdAt),
    updatedAt: str(raw.updatedAt),
    warrant: mode === "custom" ? { ...EMPTY_WARRANT, ...(isObj(raw.warrant) ? (raw.warrant as Partial<Warrant>) : {}) } : undefined,
    state: readState(raw.state),
    baseline: mode === "preset" && isObj(raw.baseline) ? readState(raw.baseline) : undefined,
    tray,
    decisions,
    replay,
    checkpointsRevealed: Array.isArray(raw.checkpointsRevealed) ? raw.checkpointsRevealed.filter((x): x is string => typeof x === "string") : [],
  } as Workspace;
}

export type StoreRead = { store: WorkspaceStore; error?: string };

/**
 * Read a stored workspace collection. A damaged or newer-schema record never blanks the
 * dashboard: valid workspaces load, invalid ones are kept in quarantine with a
 * recoverable error message, and nothing is deleted.
 */
export function readStore(raw: unknown): StoreRead {
  if (raw === null || raw === undefined) return { store: { ...EMPTY_STORE, workspaces: [], quarantine: [] } };
  if (!isObj(raw) || !Array.isArray(raw.workspaces)) {
    return { store: { ...EMPTY_STORE, workspaces: [], quarantine: [raw] }, error: "The stored workspace list could not be read. It has been kept aside unchanged." };
  }
  const workspaces: Workspace[] = [];
  const quarantine: unknown[] = Array.isArray(raw.quarantine) ? [...raw.quarantine] : [];
  for (const w of raw.workspaces) {
    const ok = readWorkspace(w);
    if (ok) workspaces.push(ok);
    else quarantine.push(w);
  }
  const bad = quarantine.length - (Array.isArray(raw.quarantine) ? raw.quarantine.length : 0);
  const newer = typeof raw.schema === "number" && raw.schema > WORKSPACE_SCHEMA;
  return {
    store: { ...raw, schema: WORKSPACE_SCHEMA, workspaces, quarantine },
    error: bad > 0
      ? `${bad} stored workspace${bad === 1 ? "" : "s"} could not be read and ${bad === 1 ? "was" : "were"} kept aside unchanged.`
      : newer
        ? "These workspaces were saved by a newer version. Unknown fields are preserved."
        : undefined,
  };
}

/* ------------------------------------------------------------------ */
/* Creation, branching and lifecycle                                   */
/* ------------------------------------------------------------------ */

const now = () => new Date().toISOString();
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

export function createPresetWorkspace(scenario: { id: string; version: number; title: string }, state: DeskState): Workspace {
  const t = now();
  return {
    schema: WORKSPACE_SCHEMA,
    id: newId("ex"),
    mode: "preset",
    title: scenario.title,
    lifecycle: "training",
    createdAt: t,
    updatedAt: t,
    scenario: { id: scenario.id, version: scenario.version },
    state,
    baseline: clone(state),
    tray: [],
    decisions: [],
    replay: [],
    checkpointsRevealed: [],
  };
}

export function createCustomWorkspace(warrant: Warrant = EMPTY_WARRANT, state: DeskState = blankState()): Workspace {
  const t = now();
  return {
    schema: WORKSPACE_SCHEMA,
    id: newId("ms"),
    mode: "custom",
    title: warrant.title.trim() || "Untitled mission",
    lifecycle: "draft",
    createdAt: t,
    updatedAt: t,
    warrant: { ...warrant },
    state,
    tray: [],
    decisions: [],
    replay: [],
    checkpointsRevealed: [],
  };
}

/** Duplicate the current local exercise under a user-entered label. The source is untouched. */
export function branchWorkspace(src: Workspace, label: string): Workspace {
  const t = now();
  const copy = clone(src);
  delete copy.sealed;
  return {
    ...copy,
    id: newId(src.mode === "preset" ? "ex" : "ms"),
    label: label.trim() || "Branch",
    title: `${src.title} · ${label.trim() || "Branch"}`,
    lifecycle: src.mode === "preset" ? "training" : "draft",
    createdAt: t,
    updatedAt: t,
    lineage: { parentId: src.id, kind: "branch", note: `Branched from ${src.title}.`, at: t },
  };
}

/** Map the warrant onto the mission profile the desks already read (theatre, officer, classification). */
export function warrantToProfile(w: Warrant, base: MissionProfile): MissionProfile {
  return {
    ...base,
    theatre: w.theatre.trim() || base.theatre,
    officer: w.custodian.trim() || base.officer,
    classification: w.handling.trim() || base.classification,
  };
}

export type ReviewFinding = { kind: "warrant" | "question" | "assumption" | "decision"; text: string };

/**
 * Local completeness review. Lists missing required warrant content and unresolved
 * structured items. It reviews what is recorded here; it approves nothing.
 */
export function completenessReview(w: Workspace): ReviewFinding[] {
  const out: ReviewFinding[] = [];
  for (const f of WARRANT_FIELDS) if (f.required && !(w.warrant?.[f.key] ?? "").trim()) out.push({ kind: "warrant", text: `Mission Warrant: ${f.label} is empty.` });
  for (const e of w.tray) {
    if (e.status === "question") out.push({ kind: "question", text: `Open question unresolved: ${e.text}` });
  }
  const assumptions = w.tray.filter((e) => e.status === "assumption").length;
  if (assumptions > 0) out.push({ kind: "assumption", text: `${assumptions} working assumption${assumptions === 1 ? "" : "s"} still recorded as assumption${assumptions === 1 ? "" : "s"}: confirm, exclude or keep them knowingly.` });
  for (const d of w.decisions) if (d.status === "active" && !d.why.trim()) out.push({ kind: "decision", text: `Decision without a recorded reason: ${d.what || "untitled"}` });
  return out;
}

/** Findings that block Ready for Local Handover: missing warrant content and open questions. */
export const blockingFindings = (w: Workspace) => completenessReview(w).filter((f) => f.kind === "warrant" || f.kind === "question");

/** Allowed transitions between the custom workflow states. Sealing is a separate, one-way step. */
export function canMove(w: Workspace, to: Lifecycle): { ok: boolean; reason?: string } {
  if (w.mode !== "custom") return { ok: false, reason: "Training runs have no workflow states." };
  if (w.lifecycle === "sealed") return { ok: false, reason: "A sealed local snapshot is immutable. Continue in a new draft instead." };
  if (to === "training") return { ok: false, reason: "Not a custom workflow state." };
  if (to === "sealed") return w.lifecycle === "ready" ? { ok: true } : { ok: false, reason: "Seal only from Ready for Local Handover." };
  if (to === "ready") {
    const b = blockingFindings(w);
    return b.length === 0 ? { ok: true } : { ok: false, reason: `${b.length} item${b.length === 1 ? "" : "s"} to resolve before local handover.` };
  }
  return { ok: true };
}

/** Start a fresh editable draft from a sealed snapshot; the sealed record stays as it is. */
export function continueFromSealed(src: Workspace): Workspace {
  const t = now();
  const copy = clone(src);
  delete copy.sealed;
  return {
    ...copy,
    id: newId("ms"),
    title: `${src.title} · continued`,
    lifecycle: "draft",
    createdAt: t,
    updatedAt: t,
    lineage: { parentId: src.id, kind: "continuation", note: `Continued from sealed local snapshot ${src.sealed?.ref ?? ""}`.trim(), at: t },
  };
}

/* ------------------------------------------------------------------ */
/* Promotion and training derivative                                   */
/* ------------------------------------------------------------------ */

export type CarriedValue = { key: string; label: string; value: string; status: EntryStatus };

/**
 * The values a training run would carry into an operational draft, for the Promotion
 * Review. Every one starts as a Working Assumption: preset readings are scenario figures,
 * never verified facts.
 */
export function carriedValues(src: Workspace): CarriedValue[] {
  const s = src.state.signals;
  const p = src.state.profile;
  const out: CarriedValue[] = [];
  if (p.bonds) out.push({ key: "bonds", label: "Bond vector (I, C, G, Inst)", value: [p.bonds.interpersonal, p.bonds.communal, p.bonds.intergenerational, p.bonds.institutional].map((n) => n.toFixed(1)).join(", "), status: "assumption" });
  if (p.parties.trim()) out.push({ key: "parties", label: "Parties", value: p.parties, status: "assumption" });
  if (p.theatre.trim()) out.push({ key: "theatre", label: "Theatre", value: p.theatre, status: "assumption" });
  if ((s.covenants?.length ?? 0) > 0) out.push({ key: "covenants", label: "Covenants of record", value: s.covenants!.join("; "), status: "assumption" });
  if ((s.shocks?.length ?? 0) > 0) out.push({ key: "shocks", label: "Shocks under test", value: s.shocks!.join("; "), status: "assumption" });
  if (s.disputeForum) out.push({ key: "forum", label: "Dispute forum", value: s.disputeForum, status: "assumption" });
  if (src.state.binder.length) out.push({ key: "binder", label: "Binder tabs", value: `${src.state.binder.length} tab${src.state.binder.length === 1 ? "" : "s"} of training text`, status: "excluded" });
  for (const e of src.tray) out.push({ key: `tray:${e.id}`, label: `Note (${PANEL_LABEL[e.panel]})`, value: e.text, status: e.status === "fact" ? "assumption" : e.status });
  return out;
}

/** Signal keys that exist only because of the preset or the training layer. */
const TRAINING_ONLY_SIGNALS: (keyof Signals)[] = ["presetId", "presetEpoch"];

/**
 * Promote a training run: a NEW custom draft built from the reviewed carried values. The
 * training run is never changed. Excluded values are dropped; preset markers, guides and
 * checkpoint answers are not carried; lineage records only the reviewed origin.
 */
export function promoteToCustom(src: Workspace, warrant: Warrant, reviewed: CarriedValue[]): Workspace {
  const keep = new Map(reviewed.map((r) => [r.key, r]));
  const included = (k: string) => {
    const r = keep.get(k);
    return !!r && r.status !== "excluded";
  };
  const signals: Signals = { ...clone(src.state.signals) };
  for (const k of TRAINING_ONLY_SIGNALS) delete signals[k];
  if (!included("covenants")) delete signals.covenants;
  if (!included("shocks")) delete signals.shocks;
  if (!included("forum")) {
    delete signals.disputeForum;
    delete signals.disputeForumId;
  }
  if (!included("bonds")) delete signals.bonds;
  const base = src.state.profile;
  const profile = warrantToProfile(warrant, {
    ...EMPTY_PROFILE,
    parties: included("parties") ? base.parties : "",
    ...(included("bonds") && base.bonds ? { bonds: { ...base.bonds } } : {}),
  });
  const t = now();
  const tray: ContextEntry[] = reviewed
    .filter((r) => r.status !== "excluded")
    .map((r) => ({
      id: newId("ce"),
      panel: r.status === "question" ? "questions" : r.status === "fact" ? "evidence" : "assumptions",
      status: r.status,
      text: `${r.label}: ${r.value}`,
      at: t,
    }));
  const ws = createCustomWorkspace(warrant, {
    profile,
    binder: included("binder") ? clone(src.state.binder) : [],
    signals,
    division: "assess",
    desk: "diagnostics",
  });
  return { ...ws, tray, lineage: { kind: "promotion", note: PROMOTION_LINEAGE, at: t } };
}

export type DerivativeChoice = { key: string; label: string; original: string; replacement: string; omit: boolean };

/** The sensitive items a training derivative must replace or omit, all omitted by default. */
export function derivativeChoices(src: Workspace): DerivativeChoice[] {
  const p = src.state.profile;
  const w = src.warrant ?? EMPTY_WARRANT;
  const out: DerivativeChoice[] = [];
  const add = (key: string, label: string, original: string) => original.trim() && out.push({ key, label, original, replacement: "", omit: true });
  add("title", "Mission title", w.title || src.title);
  add("theatre", "Theatre", w.theatre || p.theatre);
  add("parties", "Parties", p.parties);
  add("custodian", "Mission custodian", w.custodian || p.officer);
  add("authority", "Authority basis", w.authority);
  return out;
}

/**
 * Create a sanitized training derivative from a custom mission: a new preset-mode copy.
 * Excluded by default and never carried: source references, private notes, binder text,
 * sealed records, integrity references and free-text entries. Only the bond vector,
 * structural readings and the labels the user chose to replace are kept.
 */
export function deriveTraining(src: Workspace, choices: DerivativeChoice[]): Workspace {
  const pick = (k: string, d = "") => {
    const c = choices.find((x) => x.key === k);
    return c && !c.omit ? c.replacement.trim() : d;
  };
  const s = src.state.signals;
  const signals: Signals = {};
  if (s.bonds) Object.assign(signals, { bonds: { ...s.bonds } });
  const profile: MissionProfile = {
    ...EMPTY_PROFILE,
    theatre: pick("theatre"),
    parties: pick("parties"),
    officer: pick("custodian"),
    classification: "Training derivative",
    ...(src.state.profile.bonds ? { bonds: { ...src.state.profile.bonds } } : {}),
  };
  const t = now();
  return {
    schema: WORKSPACE_SCHEMA,
    id: newId("ex"),
    mode: "preset",
    title: pick("title") || "Derived training exercise",
    lifecycle: "training",
    createdAt: t,
    updatedAt: t,
    derived: true,
    lineage: { kind: "derivative", note: DERIVED_NOTICE, at: t },
    state: { profile, binder: [], signals, division: "assess", desk: "diagnostics" },
    baseline: { profile: clone(profile), binder: [], signals: clone(signals), division: "assess", desk: "diagnostics" },
    tray: [],
    decisions: [],
    replay: [],
    checkpointsRevealed: [],
  };
}

/* ------------------------------------------------------------------ */
/* After-action review                                                 */
/* ------------------------------------------------------------------ */

export type GateLine = { name: string; passed: boolean; reading: string };

/**
 * Compile an after-action review from actual desk state, recorded changes, encountered
 * gates and authored notes. It reports; it does not grade or predict.
 */
export function afterActionReview(w: Workspace, input: { scenarioTitle?: string; gates: GateLine[]; telemetry: string[]; notice: string }): string {
  const bar = "=".repeat(64);
  const L = [
    input.notice,
    "",
    "VINCULUM · AFTER-ACTION REVIEW",
    `EXERCISE: ${w.title}`,
    ...(input.scenarioTitle ? [`SCENARIO: ${input.scenarioTitle}${w.scenario ? ` (v${w.scenario.version})` : ""}`] : []),
    ...(w.lineage ? [`LINEAGE: ${w.lineage.note}`] : []),
    "",
    bar,
    "I. DESK STATE AT REVIEW",
    bar,
    ...(input.telemetry.length ? input.telemetry : ["  No readings on the bus."]),
    "",
    bar,
    "II. STAGE GATES ENCOUNTERED",
    bar,
    ...input.gates.map((g) => `  [${g.passed ? "PASS" : "HOLD"}] ${g.name}: ${g.reading}`),
    "",
    bar,
    "III. RECORDED CHANGES (browser-local replay)",
    bar,
    ...(w.replay.length ? w.replay.map((r) => `  ${r.at}  ${r.kind}  ${r.detail}`) : ["  No changes recorded."]),
    "",
    bar,
    "IV. AUTHORED NOTES",
    bar,
    ...(w.tray.length ? w.tray.map((e) => `  [${STATUS_LABEL[e.status]}] ${e.text}${e.source ? ` (source: ${e.source})` : ""}`) : ["  No notes authored."]),
    ...(w.decisions.length ? ["", "  Decisions:", ...w.decisions.map((d) => `  [${d.status}] ${d.what}${d.why ? ` because ${d.why}` : ""}`)] : []),
    "",
    input.notice,
  ];
  return L.join("\n");
}
