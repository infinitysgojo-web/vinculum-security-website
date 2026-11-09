// Surface 1: the Tamper-Evident Handover Seal and the Divergence Beacon.
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  SEAL_STORAGE_KEY,
  canonicalSeal,
  computeSealHash,
  createSeal,
  modifiedParameters,
  readSeal,
  sealDifferences,
  sealPayload,
  sealStatus,
  sha8,
  writeSeal,
  type SealInput,
} from "../src/components/desk/handoverSeal";
import type { DecisionRecord } from "../src/components/desk/ledgerStore";

const decisions: DecisionRecord[] = [
  { id: "evt_001", timestamp: "2026-01-02T03:04:05.000Z", deskId: "03", action: "INSCRIBE_SHOCK", details: "Shock applied: Drought" },
];
const input = (patch: Partial<SealInput> = {}): SealInput => ({
  profile: { theatre: "Northern Rift", officer: "Envoy A", classification: "Restricted", parties: "State one; State two" },
  sessionId: "ws_1",
  tray: [
    { status: "fact", text: "Ceasefire signed" },
    { status: "assumption", text: "Guarantor stays" },
    { status: "excluded", text: "Maritime claims" },
    { status: "question", text: "Who funds the verifier?" },
  ],
  signals: { rupture: 48, bonds: { interpersonal: 3.8, communal: 1.2, intergenerational: 2.5, institutional: 4.1 }, customShocks: [], customCovenants: [] },
  decisions,
  ...patch,
});
const store = () => {
  const m = new Map<string, string>();
  return { m, getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) };
};

describe("canonical serialisation", () => {
  test("profile, binder (facts, assumptions, exclusions), signals and decisions; keys sorted at every depth", () => {
    const p = sealPayload(input());
    expect(p.profile).toEqual({ theatre: "Northern Rift", envoy: "Envoy A", mandate: "Restricted", parties: "State one; State two", sessionId: "ws_1" });
    expect(p.binder).toEqual({ facts: ["Ceasefire signed"], assumptions: ["Guarantor stays"], exclusions: ["Maritime claims"] });
    expect(p.decisions).toEqual([{ timestamp: "2026-01-02T03:04:05.000Z", deskId: "03", action: "INSCRIBE_SHOCK", details: "Shock applied: Drought" }]);
    const c = canonicalSeal(p);
    expect(c.startsWith('{"binder":')).toBe(true);
    expect(c.indexOf('"decisions"')).toBeLessThan(c.indexOf('"profile"'));
    // Key order of the input does not change the bytes.
    const shuffled = input({ signals: { customCovenants: [], customShocks: [], bonds: { institutional: 4.1, intergenerational: 2.5, communal: 1.2, interpersonal: 3.8 }, rupture: 48 } });
    expect(canonicalSeal(sealPayload(shuffled))).toBe(c);
  });

  test("the seal's own HANDOVER_SEAL entry is not sealed, so sealing never diverges by itself", () => {
    const withSeal = [...decisions, { id: "evt_002", timestamp: "2026-01-02T04:00:00.000Z", deskId: "00", action: "HANDOVER_SEAL", details: "sealed" }];
    expect(canonicalSeal(sealPayload(input({ decisions: withSeal })))).toBe(canonicalSeal(sealPayload(input())));
  });
});

describe("SHA-256 seal", () => {
  test("a valid SHA-256 of the canonical UTF-8 bytes, 64 lowercase hex characters", async () => {
    const p = sealPayload(input());
    const h = await computeSealHash(p);
    expect(h).toMatch(/^[0-9a-f]{64}$/);
    expect(h).toBe(createHash("sha256").update(Buffer.from(canonicalSeal(p), "utf8")).digest("hex"));
    const s = await createSeal(p, "Envoy A", new Date("2026-01-02T05:00:00.000Z"));
    expect(s).toMatchObject({ sealHash: h, sealedAt: "2026-01-02T05:00:00.000Z", sealedBy: "Envoy A", sessionId: "ws_1" });
    expect(sha8(h)).toBe(h.slice(0, 8));
    expect((await createSeal(p, "  ")).sealedBy).toBe("Unnamed officer");
  });

  test("sessionStorage round trip under vs:handover-seal; another mission or a malformed record reads as none", async () => {
    const st = store();
    const s = await createSeal(sealPayload(input()), "Envoy A");
    expect(writeSeal(s, st)).toBe(true);
    expect([...st.m.keys()]).toEqual([SEAL_STORAGE_KEY]);
    expect(readSeal("ws_1", st)).toEqual(s);
    expect(readSeal("ws_2", st)).toBeNull();
    st.m.set(SEAL_STORAGE_KEY, JSON.stringify({ ...s, sealHash: "not-hex" }));
    expect(readSeal("ws_1", st)).toBeNull();
    st.m.set(SEAL_STORAGE_KEY, "{broken");
    expect(readSeal("ws_1", st)).toBeNull();
  });
});

describe("divergence beacon", () => {
  test("an untouched mission is INTEGRITY INTACT", async () => {
    const s = await createSeal(sealPayload(input()), "Envoy A");
    const now = await computeSealHash(sealPayload(input()));
    expect(sealStatus(s, now, () => sealDifferences(s.canonical, sealPayload(input()))).state).toBe("intact");
    expect(sealDifferences(s.canonical, sealPayload(input()))).toEqual([]);
  });

  test("a parameter mutation trips the beacon immediately and names the modified parameter", async () => {
    const s = await createSeal(sealPayload(input()), "Envoy A");
    const moved = sealPayload(input({ signals: { ...input().signals, rupture: 61 } }));
    const h = await computeSealHash(moved);
    expect(h).not.toBe(s.sealHash);
    const st = sealStatus(s, h, () => sealDifferences(s.canonical, moved));
    expect(st.state).toBe("diverged");
    expect(st.state === "diverged" && st.parameters).toEqual(["signals.rupture"]);
    expect(sealDifferences(s.canonical, moved)).toEqual([{ path: "signals.rupture", sealed: "48", current: "61" }]);
  });

  test("bond, covenant, warrant and decision changes are each itemised; an added list member reads absent on the sealed side", async () => {
    const s = await createSeal(sealPayload(input()), "Envoy A");
    const base = input();
    const moved = sealPayload(input({
      signals: { ...base.signals, bonds: { ...base.signals.bonds!, communal: 1.4 }, customCovenants: [{ id: "c1", title: "Firebreak", obligation: "", enforcementMechanism: "Sunset Audit" }] },
      tray: [...base.tray, { status: "fact", text: "Verifier seated" }],
      decisions: [...decisions, { id: "evt_002", timestamp: "2026-01-02T06:00:00.000Z", deskId: "10", action: "INSCRIBE_COVENANT", details: "Firebreak" }],
    }));
    const d = sealDifferences(s.canonical, moved);
    expect(modifiedParameters(d)).toEqual(["binder.facts", "decisions", "signals.bonds", "signals.customCovenants"]);
    expect(d.find((x) => x.path === "signals.bonds.communal")).toEqual({ path: "signals.bonds.communal", sealed: "1.2", current: "1.4" });
    expect(d.find((x) => x.path === "binder.facts[1]")).toEqual({ path: "binder.facts[1]", sealed: "absent", current: '"Verifier seated"' });
  });

  test("unsealed missions show the seal action; the dashboard compares canonical bytes so a stale hash never reads intact", () => {
    expect(sealStatus(null, "x", () => []).state).toBe("unsealed");
    const dash = readFileSync("src/pages/Dashboard.tsx", "utf8") as string;
    expect(dash).toContain("canonicalSeal(sealInput) === hSeal.canonical");
    expect(dash).toContain("<HandoverSealBadge");
  });
});
