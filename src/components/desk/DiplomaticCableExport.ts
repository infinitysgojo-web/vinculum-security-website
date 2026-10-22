/**
 * Three-Tier Evidentiary Export Package: the telegraphic cable and the canonical manifest.
 * (The briefing PDF is ExecutiveSummaryPdf.tsx.) Everything is assembled in the browser
 * from the executive summary model, so the three files carry the same readings.
 *
 *   [mission-slug]-manifest.json   canonical JSON with a top-level SHA-256 integrity hash
 *   [mission-slug]-briefing.pdf    single-page executive summary
 *   [mission-slug]-cable.txt       monospaced Note Verbale dispatch, 7-bit ASCII, 69 columns
 */
import { sha256HexText } from "@/lib/chancelleryCrypto";
import { canonicalJson } from "./registry";
import { STATUTORY_NOTICE, type ExecSummary } from "./executiveBrief";
import type { DecisionRecord } from "./ledgerStore";
import type { Signals } from "./engine";

/** Telegraph line width. */
export const CABLE_WIDTH = 69;

const ASCII_MAP: [RegExp, string][] = [
  [/[‘’]/g, "'"], [/[“”]/g, '"'], [/[–—−]/g, "-"], [/…/g, "..."], [/·/g, "-"], [/×/g, "X"], [/÷/g, "/"],
  [/≥/g, ">="], [/≤/g, "<="], [/→/g, "->"], [/λ/g, "LAMBDA"], [/Δ/g, "DELTA"], [/Ω/g, "OMEGA"], [/μ/g, "MU"], [/½/g, "1/2"], [/§/g, "SEC."],
];

/** Upper-case 7-bit ASCII, as a telegraph line can carry it. */
export function telegraphic(text: string): string {
  let t = text;
  for (const [re, r] of ASCII_MAP) t = t.replace(re, r);
  return t.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7E\n]/g, "").toUpperCase();
}

/** Word-wrap one paragraph to the cable width, with a hanging indent for continuation lines. */
export function wrapCable(text: string, width = CABLE_WIDTH, indent = ""): string[] {
  const words = telegraphic(text).split(/\s+/).filter(Boolean);
  const out: string[] = [];
  let line = "";
  for (const w of words) {
    const cand = line ? `${line} ${w}` : w;
    if (cand.length <= width) line = cand;
    else {
      if (line) out.push(line);
      // A single word longer than the line is broken hard.
      let rest = w;
      while (rest.length > width - indent.length) {
        out.push((out.length ? indent : "") + rest.slice(0, width - indent.length));
        rest = rest.slice(width - indent.length);
      }
      line = (out.length ? indent : "") + rest;
    }
  }
  if (line) out.push(line);
  return out;
}

/**
 * The telegraphic Note Verbale: ZCZC header, FM/TO/SUBJ/REF, numbered paragraphs opening
 * with the compliments formula and closing with the assurances formula, then NNNN.
 */
export function diplomaticCable(m: ExecSummary, opts: { digest?: string; to?: string } = {}): string {
  const p: string[] = [];
  const b = m.bonds.map((x) => `${x.name} ${x.score === null ? "NOT SCORED" : x.score.toFixed(1)}`).join(", ");
  p.push("The Chancellery presents its compliments and has the honour to transmit the following mission assessment.");
  p.push(`Bond vector (of 5.0): ${b}${m.meanBond !== null ? `; mean ${m.meanBond.toFixed(2)}` : ""}.`);
  p.push(`Rupture index R ${m.rupture === null ? "not measured" : `${m.rupture} per cent (${m.ruptureBand})`}${m.exposure !== null ? `; unmitigated exposure U ${m.exposure} points` : ""}${m.survival !== null ? `; succession durability ${m.survival} per cent` : ""}.`);
  p.push(m.shocks.length ? `Active shocks: ${m.shocks.join("; ")}.` : "No shocks active.");
  p.push(m.covenants.length ? `Covenants of record: ${m.covenants.map((c) => c.text + (c.contested ? " (contested)" : "")).join("; ")}. Open redline flags: ${m.redlineFlags}.` : `No covenants of record. Open redline flags: ${m.redlineFlags}.`);
  p.push(`Readiness gates cleared ${m.gatesCleared} of ${m.gates.length}: ${m.gates.map((g) => `${g.name} ${g.cleared ? "cleared" : "not cleared"}`).join("; ")}.`);
  p.push("The Chancellery avails itself of this opportunity to renew the assurances of its highest consideration.");
  const L = [
    "ZCZC",
    ...wrapCable(`${m.masthead.classification} // PRIORITY ROUTINE`),
    ...wrapCable(`FM VINCULUM CHANCELLERY // ${m.masthead.envoy}`),
    ...wrapCable(`TO ${opts.to?.trim() || "RECEIVING CHANCELLERY"}`),
    ...wrapCable(`SUBJ MISSION ASSESSMENT // ${m.masthead.title} // ${m.masthead.theatre}`),
    ...wrapCable(`PARTIES ${m.masthead.parties}`),
    ...wrapCable(`DTG ${m.masthead.assessedUtc}`),
    ...wrapCable(`REF SEAL ${m.masthead.seal}`, CABLE_WIDTH, "    "),
    ...(opts.digest ? wrapCable(`REF MANIFEST SHA-256 ${opts.digest}`, CABLE_WIDTH, "    ") : []),
    "TEXT",
    ...p.flatMap((x, k) => wrapCable(`${k + 1}. ${x}`, CABLE_WIDTH, "   ")),
    "",
    ...wrapCable(STATUTORY_NOTICE),
    "NNNN",
  ];
  return L.join("\n") + "\n";
}

export const MANIFEST_FORMAT = "vinculum.pouch.v1";

export type ManifestBody = {
  format: typeof MANIFEST_FORMAT;
  mission: { slug: string; title: string; theatre: string; parties: string; envoy: string; classification: string; sessionId: string };
  generatedAt: string;
  summary: ExecSummary;
  signals: Signals;
  decisions: DecisionRecord[];
  workspace: unknown;
  files: string[];
};

export type Manifest = ManifestBody & { integrity: { algorithm: "SHA-256"; canonicalization: "sorted-key JSON, integrity member omitted"; hash: string } };

/** Seal the manifest: SHA-256 over the canonical JSON of every member except `integrity`. */
export async function buildManifest(body: ManifestBody): Promise<Manifest> {
  const hash = await sha256HexText(canonicalJson(body));
  return { ...body, integrity: { algorithm: "SHA-256", canonicalization: "sorted-key JSON, integrity member omitted", hash } };
}

/** Recompute a manifest's integrity hash; true only when it matches. */
export async function verifyManifest(m: Manifest): Promise<boolean> {
  const { integrity, ...body } = m;
  if (!integrity || typeof integrity.hash !== "string") return false;
  return (await sha256HexText(canonicalJson(body))) === integrity.hash;
}

/** Save a file to the user's device. No network: a local object URL, revoked shortly after. */
export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
