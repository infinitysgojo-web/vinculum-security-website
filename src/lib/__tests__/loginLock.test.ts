/// <reference types="bun" />
import { describe, it, expect, beforeEach } from "bun:test";
const store = new Map<string, string>();
(globalThis as any).localStorage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => store.set(k, v), removeItem: (k: string) => store.delete(k) };
const { registerLockout, lockSecondsLeft, clearLockout, hasOfflineCredential, verifyOffline } = await import("../offlineAuth");
describe("sign-in hold", () => {
  beforeEach(() => store.clear());
  it("doubles each lockout and caps at 15 minutes", () => {
    expect(registerLockout(60, 0)).toBe(60);
    expect(registerLockout(60, 0)).toBe(120);
    for (let i = 0; i < 6; i++) registerLockout(60, 0);
    expect(registerLockout(60, 0)).toBe(900);
  });
  it("survives a reload and clears on success", () => {
    registerLockout(60, 1000);
    expect(lockSecondsLeft(1000)).toBe(60);
    clearLockout();
    expect(lockSecondsLeft(1000)).toBe(0);
  });
  it("ships no built-in credential", async () => {
    expect(hasOfflineCredential()).toBe(false);
    expect(await verifyOffline("vinculumsecurity@gmail.com", "anything")).toBeNull();
  });
});
