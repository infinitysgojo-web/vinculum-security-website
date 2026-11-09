// Surface 3: Sovereign Navigation Hotkeys and the Diplomatic Command Palette index.
import { describe, expect, test } from "bun:test";
import { readFileSync, existsSync } from "node:fs";
import { isTypingTarget, resolveHotkey, stepDesk } from "../src/hooks/useSovereignHotkeys";
import { searchCommands } from "../src/components/commandIndex";

const DASH = readFileSync("src/pages/Dashboard.tsx", "utf8");
const DESKS = [...DASH.matchAll(/\n {4}id: "([a-z]+)",\n {4}division: "[a-z]+",\n {4}label: "([^"]+)",[\s\S]*?\n {4}title: "([^"]+)"/g)].map((m) => ({ id: m[1], label: m[2], title: m[3] }));

describe("hotkeys cycle desks", () => {
  test("[ and ] step backward and forward; Alt+arrows too", () => {
    expect(resolveHotkey({ key: "[" }, false)).toBe("prev");
    expect(resolveHotkey({ key: "]" }, false)).toBe("next");
    expect(resolveHotkey({ key: "ArrowLeft", altKey: true }, false)).toBe("prev");
    expect(resolveHotkey({ key: "ArrowRight", altKey: true }, false)).toBe("next");
    expect(DESKS).toHaveLength(18);
    expect(stepDesk(DESKS, "audit", -1)?.id).toBe("tracks"); // Desk 09 -> Desk 08
    expect(stepDesk(DESKS, "audit", 1)?.id).toBe("clauses"); // Desk 09 -> Desk 10
    expect(stepDesk(DESKS, "diagnostics", -1)).toBeNull();
    expect(stepDesk(DESKS, "binder", 1)).toBeNull();
  });

  test("? opens the shortcut sheet; Escape closes; Ctrl/Cmd+K opens the palette; Ctrl/Cmd+S saves", () => {
    expect(resolveHotkey({ key: "?", shiftKey: true }, false)).toBe("help");
    expect(resolveHotkey({ key: "Escape" }, false)).toBe("escape");
    expect(resolveHotkey({ key: "k", ctrlKey: true }, false)).toBe("palette");
    expect(resolveHotkey({ key: "K", metaKey: true, shiftKey: true }, false)).toBe("palette");
    expect(resolveHotkey({ key: "s", metaKey: true }, false)).toBe("save");
    expect(resolveHotkey({ key: "[", ctrlKey: true }, false)).toBeNull();
    expect(resolveHotkey({ key: "a" }, false)).toBeNull();
  });

  test("ignored while the user types in an input, textarea, select or content-editable field", () => {
    for (const k of ["[", "]", "?", "Escape"]) expect(resolveHotkey({ key: k, shiftKey: k === "?" }, true)).toBeNull();
    expect(resolveHotkey({ key: "k", ctrlKey: true }, true)).toBe("palette");
    expect(resolveHotkey({ key: "s", ctrlKey: true }, true)).toBe("save");
    expect(isTypingTarget({ tagName: "INPUT" })).toBe(true);
    expect(isTypingTarget({ tagName: "textarea" })).toBe(true);
    expect(isTypingTarget({ tagName: "SELECT" })).toBe(true);
    expect(isTypingTarget({ tagName: "DIV", isContentEditable: true })).toBe(true);
    expect(isTypingTarget({ tagName: "BUTTON" })).toBe(false);
    expect(isTypingTarget(null)).toBe(false);
  });

  test("one navigation listener: the hook replaces the old dashboard and desk-finder listeners; panic keys stay with the Sentinel", () => {
    expect(existsSync("src/components/desk/DeskFinder.tsx")).toBe(false);
    expect(DASH).toContain("useSovereignHotkeys({");
    expect(DASH).not.toMatch(/addEventListener\("keydown"/);
    const hook = readFileSync("src/hooks/useSovereignHotkeys.ts", "utf8");
    expect(hook.match(/addEventListener\("keydown"/g)).toHaveLength(1);
    expect(hook).not.toMatch(/stopPropagation|stopImmediatePropagation/);
    expect(hook).not.toMatch(/setTimeout|setInterval/);
    expect(hook).not.toMatch(/executePanicPurge|panicPurge\(/);
  });
});

describe("command palette index", () => {
  test("01 to 18 and desk titles jump to the desk", () => {
    expect(searchCommands("09", DESKS)[0]).toMatchObject({ kind: "desk", id: "audit", number: "09" });
    expect(searchCommands("18", DESKS)[0]).toMatchObject({ kind: "desk", id: "binder" });
    expect(searchCommands("Clause Architect", DESKS)[0]).toMatchObject({ kind: "desk", id: "clauses" });
    expect(searchCommands("Compound Shock", DESKS)[0]).toMatchObject({ kind: "desk", id: "compound" });
    expect(searchCommands("readiness", DESKS)[0]).toMatchObject({ kind: "desk", id: "readiness" });
    expect(searchCommands("", DESKS)).toHaveLength(18);
  });

  test("topic and legal keywords list the desks that deal with them", () => {
    const ids = (q: string) => searchCommands(q, DESKS).filter((x) => x.kind === "desk").map((x) => x.id);
    expect(ids("decay")).toContain("succession");
    expect(ids("arbitration")).toEqual(expect.arrayContaining(["redliner", "legal"]));
    expect(ids("escrow")).toContain("multiparty");
    expect(ids("covenant")).toEqual(expect.arrayContaining(["clauses", "redliner"]));
    expect(ids("kenya")).toEqual(expect.arrayContaining(["diagnostics", "mirror"]));
    expect(ids("icsid")).toEqual(expect.arrayContaining(["redliner", "legal"]));
    expect(ids("vclt")).toEqual(expect.arrayContaining(["clauses", "redliner"]));
    expect(ids("rupture")).toEqual(expect.arrayContaining(["sentinel", "compound"]));
  });

  test("quick system actions: seal, wire, export, diff, branch, mask, panic", () => {
    for (const a of ["seal", "wire", "export", "diff", "branch", "mask", "panic"]) {
      const hit = searchCommands(a, DESKS).find((x) => x.kind === "action");
      expect(hit?.id).toBe(a as never);
    }
    expect(DASH).toMatch(/case "panic":\n\s+if \(window\.confirm\(/);
  });
});
