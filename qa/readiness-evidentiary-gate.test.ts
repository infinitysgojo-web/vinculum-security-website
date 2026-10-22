import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { openQuestionCount, type ContextEntry } from "@/components/mode/workspace";

const e = (status: ContextEntry["status"]): ContextEntry => ({ id: status + Math.random(), panel: "questions", status, text: "x", at: "" });

test("only entries still marked Open Question count as unresolved", () => {
  expect(openQuestionCount([])).toBe(0);
  expect(openQuestionCount([e("question"), e("question"), e("fact"), e("assumption"), e("excluded")])).toBe(2);
});

test("an unresolved open question withholds Readiness clearance", () => {
  const src = readFileSync("src/components/desk/ReadinessDesk.tsx", "utf8");
  expect(src).toMatch(/sovereignOpen\.length \|\| questionsOpen \? "NOT CLEARED"/);
});

test("binder Theatre and Prepared-for write back to the mission profile, not when sealed", () => {
  const dash = readFileSync("src/pages/Dashboard.tsx", "utf8");
  expect(dash).toMatch(/onProfileChange=\{activeWs\?\.lifecycle === "sealed" \? undefined/);
  const binder = readFileSync("src/components/desk/MissionBinder.tsx", "utf8");
  expect(binder).toMatch(/onProfileChange\?\.\(\{ theatre: v \}\)/);
  expect(binder).toMatch(/onProfileChange\?\.\(\{ officer: v \}\)/);
});
