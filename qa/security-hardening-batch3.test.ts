import { describe, test, expect } from "bun:test";
import { scrubExportPayload, zeroizeExportBuffer, OPERATIONAL_SECURITY_POLICY } from "../src/lib/exportSanitizer";

describe("Security Hardening Batch 3: Measures 66 to 100", () => {
  test("Export metadata scrubber strips forensic leaks and freezes payload", () => {
    const rawDossier = {
      theatre: "Strait of Hormuz",
      producer: "pdfmake v0.2.7",
      creator: "HeadlessChrome/124.0",
      _internalId: "priv_trace_8819",
      signals: {
        rupture: 0.42,
        domId: "gauge-elem-02",
        bonds: { mean: 3.8, _debug: true },
      },
      decisions: [
        { id: "evt_001", action: "GATE_OVERRIDE", _transientToken: "tok_secret" },
      ],
    };

    const result = scrubExportPayload(rawDossier);

    expect(result.data.theatre).toBe("Strait of Hormuz");
    expect((result.data as Record<string, unknown>).producer).toBeUndefined();
    expect((result.data as Record<string, unknown>).creator).toBeUndefined();
    expect((result.data as Record<string, unknown>)._internalId).toBeUndefined();
    expect((result.data.signals as Record<string, unknown>).domId).toBeUndefined();
    expect((result.data.signals.bonds as Record<string, unknown>)._debug).toBeUndefined();
    expect((result.data.decisions[0] as Record<string, unknown>)._transientToken).toBeUndefined();
    expect(result.scrubbedKeysCount).toBe(6);
    expect(Object.isFrozen(result.data)).toBe(true);
  });

  test("In-place buffer zeroization wipes export artifacts", () => {
    const buffer = new Uint8Array([0x4a, 0x61, 0x6d, 0x65, 0x73, 0x20, 0x4e, 0x64, 0x75, 0x61]);
    expect(buffer.reduce((acc, b) => acc + b, 0)).toBeGreaterThan(0);

    zeroizeExportBuffer(buffer);

    expect(buffer.reduce((acc, b) => acc + b, 0)).toBe(0);
    expect(buffer.every((b) => b === 0)).toBe(true);
  });

  test("Operational security policy constants are deeply frozen against tampering", () => {
    expect(OPERATIONAL_SECURITY_POLICY.zeroEgress).toBe(true);
    expect(OPERATIONAL_SECURITY_POLICY.maxPbkdf2Iterations).toBe(310000);
    expect(Object.isFrozen(OPERATIONAL_SECURITY_POLICY)).toBe(true);

    expect(() => {
      (OPERATIONAL_SECURITY_POLICY as Record<string, unknown>).zeroEgress = false;
    }).toThrow();
  });
});
