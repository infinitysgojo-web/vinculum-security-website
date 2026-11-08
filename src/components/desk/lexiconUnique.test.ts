import { test, expect } from "vitest";
import { LEXICON } from "./lexiconData";
test("each term once", () => { const t = LEXICON.map(e=>e.term.trim().toLowerCase()); const d=t.filter((x,i)=>t.indexOf(x)!==i); console.log(LEXICON.length, d); expect(d).toEqual([]); });
