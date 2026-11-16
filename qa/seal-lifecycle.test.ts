import { describe, expect, test } from "bun:test";
import { clearLedger, decisionRecords } from "../src/components/desk/ledgerStore";
import { canonicalSeal, clearSeal, createSeal, recordSealBreak, recordSealReplacement, sealPayload, writeSeal, type SealInput } from "../src/components/desk/handoverSeal";

const input = (): SealInput => ({ profile: { theatre: "Test", officer: "Officer", classification: "Restricted", parties: "A; B" }, sessionId: "mission-test", tray: [], signals: { rupture: 20 }, decisions: decisionRecords() });

describe("existing local seal lifecycle", () => {
  test("replacement records both full digests and original UTC timestamp without self-divergence", async () => {
    clearLedger();
    const old = await createSeal(sealPayload(input()), "Officer", new Date("2026-11-16T01:00:00Z"));
    recordSealReplacement(old, null);
    const changed = { ...input(), signals: { rupture: 61 } };
    const next = await createSeal(sealPayload(changed), "Officer", new Date("2026-11-16T01:10:00Z"));
    recordSealReplacement(next, old);
    const rows = decisionRecords();
    expect(rows.map((r) => r.action)).toEqual(["HANDOVER_SEAL", "HANDOVER_RESEAL"]);
    expect(rows[1].details).toContain(old.sealHash);
    expect(rows[1].details).toContain(next.sealHash);
    expect(rows[1].details).toContain("2026-11-16T01:00:00.000Z");
    expect(rows[1].timestamp).toBe("2026-11-16T01:10:00.000Z");
    expect(canonicalSeal(sealPayload({ ...changed, decisions: rows }))).toBe(next.canonical);
    clearLedger();
  });
  test("breaking preserves the removed full digest in covered decisions", async () => {
    clearLedger();
    const old = await createSeal(sealPayload(input()), "Officer");
    recordSealBreak(old, new Date("2026-11-16T01:20:00Z"));
    const rows = decisionRecords();
    expect(rows[0].action).toBe("HANDOVER_SEAL_BROKEN");
    expect(rows[0].details).toContain(old.sealHash);
    expect(rows[0].timestamp).toBe("2026-11-16T01:20:00.000Z");
    expect(sealPayload(input()).decisions[0].action).toBe("HANDOVER_SEAL_BROKEN");
    clearLedger();
  });
  test("unavailable storage cannot report successful creation or removal", async () => {
    const seal = await createSeal(sealPayload(input()), "Officer");
    expect(writeSeal(seal, { setItem() { throw new Error("quota"); } })).toBe(false);
    expect(clearSeal({ removeItem() { throw new Error("denied"); } })).toBe(false);
    const map = new Map<string, string>();
    expect(writeSeal(seal, { setItem: (key, value) => { map.set(key, value); } })).toBe(true);
    expect(clearSeal({ removeItem: (key) => { map.delete(key); } })).toBe(true);
    expect(map.size).toBe(0);
  });
});