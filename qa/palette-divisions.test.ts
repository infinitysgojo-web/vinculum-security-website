import { describe, expect, it } from "bun:test";
import { searchCommands } from "../src/components/commandIndex";

const desks = [
  { id: "diagnostics", label: "Diagnostics", title: "Bond vector", division: "assess" },
  { id: "briefing", label: "Briefing", title: "Cable", division: "engage" },
  { id: "clauses", label: "Clause Architect", title: "Covenants", division: "legal" },
  { id: "readiness", label: "Readiness", title: "Gates", division: "govern" },
];

describe("palette division words", () => {
  it("'div 3' lists only Division III desks", () => {
    const ids = searchCommands("div 3", desks).filter((x) => x.kind === "desk").map((x) => x.id);
    expect(ids).toEqual(["clauses"]);
  });
  it("'division iv' lists Division IV desks", () => {
    expect(searchCommands("Division IV", desks).some((x) => x.kind === "desk" && x.id === "readiness")).toBe(true);
  });
});
