import { test, expect } from "bun:test";
import { LEXICON } from "../src/components/desk/lexiconData";
test("each term once", () => { const t = LEXICON.map(e=>e.term.trim().toLowerCase()); const d=t.filter((x,i)=>t.indexOf(x)!==i); expect(d).toEqual([]); });
