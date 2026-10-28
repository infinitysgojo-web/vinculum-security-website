import { expect, test } from "bun:test";
import { counterpartTactics, phaseQuestions, questionLines } from "../src/components/desk/questioning";
import { seatingSelection } from "../src/components/desk/MultiPartySequencer";

test("custom probing retains every nonblank question in entered order", () => {
  const questions = Array.from({ length: 25 }, (_, i) => `Question ${i + 1}?`);
  expect(phaseQuestions(questions.join("\r\n\r\n"), ["Default?"])).toEqual(questions);
});

test("blank custom phases fall back to the complete existing sequence", () => {
  expect(phaseQuestions(" \n\t", ["Opening?", "Evidence?"])).toEqual(["Opening?", "Evidence?"]);
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