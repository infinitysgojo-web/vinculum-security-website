import { describe, expect, it } from "bun:test";
import {
  assertEntropyHealth,
  randomBytes,
  timingSafeEqual,
  timingSafeEqualText,
  zeroizeBuffer,
} from "../src/lib/chancelleryCrypto";

describe("Security Hardening Batch 2: Measures 26 to 65", () => {
  it("enforces CSPRNG entropy health and rejects degenerate or stuck-generator bitstreams", () => {
    // Valid random output passes health check
    const bytes = randomBytes(32);
    expect(bytes.length).toBe(32);
    expect(() => assertEntropyHealth(bytes)).not.toThrow();

    // Degenerate all-zero sequence is caught and rejected
    const zeros = new Uint8Array(16);
    expect(() => assertEntropyHealth(zeros)).toThrow(/CSPRNG entropy failure/);

    // Degenerate uniform sequence (e.g. all 0xFF) is caught and rejected
    const uniform = new Uint8Array(16).fill(0xaa);
    expect(() => assertEntropyHealth(uniform)).toThrow(/CSPRNG entropy failure/);
  });

  it("verifies in-place cryptographic memory zeroization", () => {
    const sensitive = new Uint8Array([12, 34, 56, 78, 90, 101, 112, 123]);
    zeroizeBuffer(sensitive);
    expect(sensitive.every((b) => b === 0)).toBe(true);
  });

  it("enforces constant-time comparison across digests and tokens to prevent timing side-channels", () => {
    const hashA = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
    const hashB = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
    const hashC = "0000000000000000000000000000000000000000000000000000000000000000";

    expect(timingSafeEqualText(hashA, hashB)).toBe(true);
    expect(timingSafeEqualText(hashA, hashC)).toBe(false);

    const bufA = new Uint8Array([1, 2, 3, 4]);
    const bufB = new Uint8Array([1, 2, 3, 4]);
    const bufC = new Uint8Array([1, 2, 3, 5]);
    expect(timingSafeEqual(bufA, bufB)).toBe(true);
    expect(timingSafeEqual(bufA, bufC)).toBe(false);
  });
});
