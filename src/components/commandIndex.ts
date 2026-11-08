/**
 * Diplomatic Command Palette index: desk jumps, topic and legal keyword indexing, and quick
 * system actions. Pure: the palette renders whatever searchCommands() returns.
 */

export type PaletteDesk = { id: string; label: string; title: string };

export type PaletteAction = "seal" | "wire" | "export" | "diff" | "branch" | "mask" | "panic" | "shortcuts" | "summary" | "timeline" | "inspector" | "ledger" | "orientation";

export type CommandItem =
  | { kind: "desk"; id: string; number: string; label: string; detail: string; score: number }
  | { kind: "action"; id: PaletteAction; label: string; detail: string; score: number };

/** Subjects each desk deals with, by dashboard desk id. */
export const DESK_TOPICS: Record<string, string[]> = {
  diagnostics: ["bond", "bonds", "vector", "diagnostic", "kenya", "rwanda", "colombia", "northern ireland", "case", "precedent", "analogue"],
  sentinel: ["rupture", "early warning", "trap", "traps", "trend", "sentinel", "tripwire"],
  compound: ["shock", "shocks", "rupture", "strain", "first to break", "timeline", "compound"],
  mirror: ["precedent", "comparative", "kenya", "rwanda", "colombia", "liberia", "cambodia", "south africa", "case"],
  briefing: ["cable", "memorandum", "note verbale", "dispatch", "demarche"],
  counterpart: ["meeting", "counterpart", "script", "protocol"],
  multiparty: ["escrow", "tranche", "clawback", "friction", "veto", "parties", "resource", "waterfall", "uti possidetis", "demarcation"],
  tracks: ["track", "elite pact", "sequencing", "communal track"],
  audit: ["safeguard", "stakeholder", "field audit"],
  clauses: ["covenant", "clause", "continuity", "vclt", "pacta sunt servanda", "treaty", "drafting"],
  redliner: ["covenant", "redline", "arbitration", "icsid", "pca", "lcia", "icc", "siac", "icj", "forum", "immunity", "new york convention", "vclt", "enforceability"],
  succession: ["decay", "half-life", "half life", "fracture", "succession", "durability", "lambda", "covenant", "timeline"],
  legal: ["arbitration", "litigation", "pleadings", "provisional measures", "icsid", "icj", "new york convention", "admissibility"],
  adversarial: ["critic", "objection", "rebuttal", "adversarial"],
  readiness: ["readiness", "gate", "clearance", "certification", "evidentiary"],
  verification: ["verifier", "verification", "compliance", "monitor"],
  handover: ["handover", "durability", "oversight", "successor"],
  binder: ["binder", "dossier", "apostille", "export", "seal"],
};

export const PALETTE_ACTIONS: { id: PaletteAction; label: string; detail: string; words: string[] }[] = [
  { id: "orientation", label: "Open desk orientation", detail: "Purpose, controls and safeguards of all eighteen desks", words: ["tour", "guide", "orientation"] },
  { id: "seal", label: "Seal mission assessment", detail: "Tamper-evident SHA-256 handover seal", words: ["seal", "handover", "hash", "integrity", "sha"] },
  { id: "wire", label: "Open the Chancellery Wire", detail: "Record of dispatches", words: ["wire", "dispatch", "log"] },
  { id: "inspector", label: "Open the Live Bus Signal Inspector", detail: "Raw reactive payload monitor", words: ["inspector", "signals", "bus", "telemetry", "payload"] },
  { id: "ledger", label: "Open the Mission Decision Log", detail: "Chronological UTC decision ledger", words: ["ledger", "decision", "decisions", "audit", "log"] },
  { id: "export", label: "Evidentiary export pouch", detail: "Manifest JSON, briefing PDF and telegraphic cable", words: ["export", "pouch", "manifest", "pdf", "cable", "download"] },
  { id: "summary", label: "One-page executive summary", detail: "Print-optimised leadership brief", words: ["summary", "brief", "print", "executive", "minister"] },
  { id: "diff", label: "Bilateral posture diff", detail: "Baseline against active delta", words: ["diff", "delta", "compare", "posture"] },
  { id: "branch", label: "Posture branching", detail: "Local what-if sandboxes", words: ["branch", "what-if", "what if", "sandbox", "posture"] },
  { id: "timeline", label: "Shock timeline scrubber", detail: "Sequential fracture playback", words: ["timeline", "scrubber", "playback", "shock"] },
  { id: "mask", label: "Toggle presentation privacy mask", detail: "Redaction shroud for screen shares · Alt+M", words: ["mask", "privacy", "redact", "shroud", "presentation"] },
  { id: "shortcuts", label: "Keyboard shortcut reference", detail: "[ ] ? Esc and Ctrl+K", words: ["shortcuts", "keys", "hotkeys", "help", "?"] },
  { id: "panic", label: "Panic purge", detail: "Wipe memory and browser storage (asks first)", words: ["panic", "purge", "wipe", "zeroize"] },
];

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

/**
 * Rank desks and actions for a query. "01" to "18" (or "9") jumps to that desk; titles and
 * labels match by substring; topic words list every desk that deals with the subject;
 * action words list the matching dashboard workflow. An empty query lists every desk.
 */
export function searchCommands(query: string, desks: ReadonlyArray<PaletteDesk>): CommandItem[] {
  const q = norm(query);
  const num = (i: number) => String(i + 1).padStart(2, "0");
  const deskItem = (d: PaletteDesk, i: number, score: number): CommandItem => ({ kind: "desk", id: d.id, number: num(i), label: d.label, detail: d.title, score });
  if (!q) return desks.map((d, i) => deskItem(d, i, 0));
  const out: CommandItem[] = [];
  const n = /^\d{1,2}$/.test(q) ? Number(q) : NaN;
  desks.forEach((d, i) => {
    let score = 0;
    if (n === i + 1) score = 100;
    const label = norm(d.label);
    const title = norm(d.title);
    if (label === q) score = Math.max(score, 90);
    else if (label.startsWith(q)) score = Math.max(score, 80);
    else if (label.includes(q)) score = Math.max(score, 70);
    else if (title.includes(q)) score = Math.max(score, 60);
    const topics = DESK_TOPICS[d.id] ?? [];
    if (q.length >= 3 && topics.some((t) => t === q)) score = Math.max(score, 55);
    else if (q.length >= 3 && topics.some((t) => t.startsWith(q) || q.startsWith(t))) score = Math.max(score, 45);
    if (score) out.push(deskItem(d, i, score));
  });
  for (const a of PALETTE_ACTIONS) {
    let score = 0;
    if (a.words.some((w) => w === q)) score = 85;
    else if (q.length >= 2 && a.words.some((w) => w.startsWith(q))) score = 65;
    else if (q.length >= 3 && norm(a.label).includes(q)) score = 50;
    if (score) out.push({ kind: "action", id: a.id, label: a.label, detail: a.detail, score });
  }
  return out.sort((a, b) => b.score - a.score);
}
