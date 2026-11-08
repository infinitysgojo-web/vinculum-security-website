import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { DESK_GUIDES } from "../src/components/mode/scenarios";
import { searchCommands } from "../src/components/commandIndex";
import { dismissOrientation, orientationInvited, ORIENTATION_KEY } from "../src/components/mode/orientation";

describe("optional eighteen-desk orientation", () => {
  test("every actual dashboard desk has guidance, with no extra desk", () => {
    const ids = [...readFileSync("src/pages/Dashboard.tsx", "utf8").matchAll(/\n    id: "([a-z]+)",\n    division:/g)].map((m) => m[1]);
    expect(ids).toHaveLength(18);
    expect(Object.keys(DESK_GUIDES).sort()).toEqual(ids.sort());
  });
  test("dismissal stores only one non-sensitive preference and suppresses the invitation", () => {
    const values = new Map<string, string>();
    const storage = { getItem: (k: string) => values.get(k) ?? null, setItem: (k: string, v: string) => { values.set(k, v); } };
    expect(orientationInvited(storage)).toBe(false);
    dismissOrientation(storage);
    expect(orientationInvited(storage)).toBe(true);
    expect([...values]).toEqual([[ORIENTATION_KEY, "dismissed"]]);
  });
  test("unavailable storage never blocks orientation", () => {
    const storage = { getItem: () => { throw Error("blocked"); }, setItem: () => { throw Error("blocked"); } };
    expect(orientationInvited(storage)).toBe(false);
    expect(() => dismissOrientation(storage)).not.toThrow();
  });
  test("tour and guide are available on demand in the existing palette", () => {
    for (const q of ["tour", "guide", "orientation"]) expect(searchCommands(q, [])[0]).toMatchObject({ kind: "action", id: "orientation" });
  });
});