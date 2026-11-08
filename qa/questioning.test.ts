import { expect, test } from "bun:test";
import { counterpartTactics, phaseQuestions, questionLines, STALL_CONDITIONS, stallResponse, newSeat, updateSeat } from "../src/components/desk/questioning";
import { seatingSelection } from "../src/components/desk/MultiPartySequencer";

test("custom probing retains every nonblank question in entered order", () => {
  const questions = Array.from({ length: 25 }, (_, i) => `Question ${i + 1}?`);
  expect(phaseQuestions(questions.join("\r\n\r\n"), ["Default?"])).toEqual(questions);
});

test("blank custom phases fall back to the complete existing sequence", () => {
  expect(phaseQuestions(" \n\t", ["Opening?", "Evidence?"])).toEqual(["Opening?", "Evidence?"]);
});

const safeguards = [
  ["Opening", "Who authorised your participation, and how can that mandate be independently checked?"],
  ["Probing", "What dated record supports that answer, and who can verify it independently?"],
  ["Commitment", "Which office owns the obligation, and by what date must it act?", "What evidence will demonstrate performance, and what happens if it fails?"],
  ["Close", "Which points remain disputed or unanswered in the written record?"],
];

for (const [kind, question] of [
  ["evidence", safeguards[1][1]], ["mandate", safeguards[0][1]],
  ["ownership", safeguards[2][1]], ["verification", safeguards[2][2]],
  ["unanswered", safeguards[3][1]],
] as const) {
  test(`${kind} reuses its exact existing safeguard deterministically`, () => {
    expect(stallResponse(kind, safeguards, "Existing pivot")).toEqual({ question, pivot: "Existing pivot", phase: STALL_CONDITIONS.find((c) => c.id === kind)?.phase, index: STALL_CONDITIONS.find((c) => c.id === kind)?.index });
    expect(stallResponse(kind, safeguards, "Existing pivot")).toEqual(stallResponse(kind, safeguards, "Existing pivot"));
  });
}

test("no selection or missing source never manufactures a response", () => {
  expect(stallResponse("none", safeguards, "Pivot")).toBeUndefined();
  expect(stallResponse("evidence", [], "Pivot")).toBeUndefined();
});

test("unresolved selections isolate counterparts and never advance their examination", () => {
  const original = [newSeat("a"), newSeat("b")];
  const selected = updateSeat(original, "a", { stall: "verification" });
  expect(selected[0]).toMatchObject({ stall: "verification", phase: 0, questionIndex: 0 });
  expect(selected[1]).toEqual(original[1]);
  expect(original[0].stall).toBe("none");
  expect(updateSeat(selected, "a", { stall: "none" })[0]).toEqual(original[0]);
});

test("question parsing preserves meaningful Unicode and punctuation", () => {
  expect(questionLines("  Who holds café's record?\n誰が確認しますか？  ")).toEqual(["Who holds café's record?", "誰が確認しますか？"]);
});

test("only counterpart inscriptions are selected and deletion leaves no stale tactic", () => {
  const note = { id: "t1", desk: "counterpart", kind: "Counterpart tactic", title: "Side letter", body: "Ask which office holds it." };
  expect(counterpartTactics([note, { ...note, id: "other", desk: "legal" }])).toEqual([note]);
  expect(counterpartTactics([])).toEqual([]);
});

test("seating accepts all eight standard delegations and added custom actors", () => {
  const roster = ["state", "armed", "youth", "elders", "civil", "donor", "spoiler", "guarantor", "own-1", "own-2"];
  expect(seatingSelection(roster, roster)).toEqual(roster);
});
test("switching counterparts keeps each one's place and wording", async () => {
  const { newSeat, updateSeat, removeSeat } = await import("../src/components/desk/questioning");
  let room = [newSeat("a", 0), newSeat("b", 1)];
  room = updateSeat(room, "a", { phase: 2, questionIndex: 3, cLabel: "Diaspora council" });
  room = updateSeat(room, "b", { phase: 1 });
  expect(room[0]).toMatchObject({ phase: 2, questionIndex: 3, cLabel: "Diaspora council" });
  expect(room[1]).toMatchObject({ phase: 1, questionIndex: 0, cLabel: "" });
  expect(removeSeat(room, "a").map((s) => s.key)).toEqual(["b"]);
  expect(removeSeat([room[1]], "b").length).toBe(1);
});
