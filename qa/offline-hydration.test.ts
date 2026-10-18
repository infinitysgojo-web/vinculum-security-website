import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { AUTH_RACE_MS, raceAuth } from "../src/lib/offlineAuth";

const dashboard = readFileSync(new URL("../src/pages/Dashboard.tsx", import.meta.url), "utf8");
const login = readFileSync(new URL("../src/pages/Login.tsx", import.meta.url), "utf8");

describe("air-gapped dashboard restoration", () => {
  test("no desk is loaded through a dynamic import", () => {
    expect(dashboard).not.toMatch(/\blazy\s*\(/);
    expect(dashboard).not.toMatch(/import\(\s*["']/);
    expect(dashboard).not.toMatch(/<Suspense/);
  });

  test("all 18 desks still render from the static imports", () => {
    const desks = dashboard.match(/^\s*id: "[a-z]+",\s*\n\s*division:/gm) ?? [];
    expect(desks.length).toBe(18);
    for (const name of ["BondDiagnostic", "CableComposer", "ClauseRedliner", "HandoverProtocol", "MissionBinder"]) {
      expect(dashboard).toMatch(new RegExp(`^import ${name} from "@/components/`, "m"));
    }
  });

  test("session and ready hydrate synchronously from the offline session", () => {
    expect(dashboard).toMatch(/useState<Session \| null>\(\(\) => offlineSessionAsSession\(\)\)/);
    expect(dashboard).toMatch(/useState<boolean>\(\(\) => !navigator\.onLine \|\| !!getOfflineSession\(\)\)/);
  });

  test("login bypasses to the dashboard on an offline session and never polls cloud auth offline", () => {
    const i = login.indexOf("getOfflineSession()) {");
    const j = login.indexOf("if (!navigator.onLine) return;");
    const k = login.indexOf("raceAuth(supabase.auth.getSession())");
    expect(i).toBeGreaterThan(-1);
    expect(j).toBeGreaterThan(i);
    expect(k).toBeGreaterThan(j);
  });
});

describe("raceAuth", () => {
  test("a fast answer settles with its value", async () => {
    expect(await raceAuth(Promise.resolve(7), 50)).toEqual({ settled: true, value: 7 });
  });
  test("a rejection settles with null instead of throwing", async () => {
    expect(await raceAuth(Promise.reject(new Error("Failed to fetch")), 50)).toEqual({ settled: true, value: null });
  });
  test("a hanging call yields after the budget", async () => {
    const t = Date.now();
    expect(await raceAuth(new Promise(() => {}), 60)).toEqual({ settled: false });
    expect(Date.now() - t).toBeLessThan(500);
  });
  test("cloud auth gets 1.5 s by default", () => {
    expect(AUTH_RACE_MS).toBe(1500);
  });
});
