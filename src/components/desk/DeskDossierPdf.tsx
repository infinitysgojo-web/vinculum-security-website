import { Document, Page, Text, View, Image, StyleSheet, Font, pdf } from "@react-pdf/renderer";
import { AUTHOR_NAME, SITE_URL } from "@/lib/seo-entities";
import mark from "@/assets/vinculum-mark.png";
import serifRegular from "@/assets/fonts/CormorantGaramond-Regular.ttf";
import serifItalic from "@/assets/fonts/CormorantGaramond-Italic.ttf";
import serifSemiBold from "@/assets/fonts/CormorantGaramond-SemiBold.ttf";
import sansRegular from "@/assets/fonts/Inter-Regular.ttf";
import sansSemiBold from "@/assets/fonts/Inter-SemiBold.ttf";
import type { MissionProfile } from "./mission";

/**
 * Publication-grade PDF for every dashboard desk document, matching the
 * executive case dossiers: cover sheet, running chancellery header, body,
 * and a statutory back cover. Generated entirely in the browser.
 */

Font.register({
  family: "Cormorant",
  fonts: [
    { src: serifRegular, fontWeight: 400 },
    { src: serifItalic, fontWeight: 400, fontStyle: "italic" },
    { src: serifSemiBold, fontWeight: 600 },
  ],
});
Font.register({
  family: "InterDoc",
  fonts: [
    { src: sansRegular, fontWeight: 400 },
    { src: sansSemiBold, fontWeight: 600 },
  ],
});
Font.registerHyphenationCallback((w) => [w]);

const NAVY = "#1B3A6B";
const INK = "#2B2B2B";
const BRASS = "#D4A24C";
const RULE = "#C9CBD1";
const MUTED = "#5F6470";

const s = StyleSheet.create({
  cover: { fontFamily: "Cormorant", color: INK, backgroundColor: "#FFFFFF" },
  coverFrame: {
    margin: 26,
    borderWidth: 0.9,
    borderColor: NAVY,
    flexGrow: 1,
    paddingTop: 54,
    paddingBottom: 30,
    paddingHorizontal: 40,
    justifyContent: "space-between",
  },
  center: { alignItems: "center" },
  emblem: { width: 64, height: 64, objectFit: "contain", marginBottom: 20 },
  emblemSm: { width: 44, height: 44, objectFit: "contain", marginBottom: 14 },
  wordmark: { fontSize: 22, letterSpacing: 6, color: NAVY, textTransform: "uppercase" },
  motto: { fontSize: 10.5, fontStyle: "italic", color: MUTED, marginTop: 9 },
  hair: { width: 180, borderBottomWidth: 0.6, borderBottomColor: BRASS, marginVertical: 20 },
  series: {
    fontFamily: "InterDoc",
    fontSize: 7,
    letterSpacing: 2.6,
    color: MUTED,
    textTransform: "uppercase",
    textAlign: "center",
  },
  docTitle: {
    fontSize: 26,
    letterSpacing: 2,
    color: NAVY,
    textTransform: "uppercase",
    textAlign: "center",
    marginTop: 18,
    lineHeight: 1.25,
  },
  sub: { fontSize: 11.5, color: MUTED, textAlign: "center", marginTop: 12, fontStyle: "italic" },
  ledger: { borderTopWidth: 0.6, borderTopColor: RULE, paddingTop: 14 },
  ledgerRow: { flexDirection: "row", marginBottom: 4 },
  ledgerKey: {
    fontFamily: "InterDoc",
    fontSize: 6.6,
    letterSpacing: 1.8,
    color: MUTED,
    textTransform: "uppercase",
    width: 148,
  },
  ledgerVal: { fontSize: 9.5, color: INK, flex: 1 },

  page: {
    paddingTop: 92,
    paddingBottom: 80,
    paddingHorizontal: 58,
    fontFamily: "Cormorant",
    fontSize: 10.5,
    lineHeight: 1.55,
    color: INK,
    backgroundColor: "#FFFFFF",
  },
  // Running header and footer: strictly bounded so body copy can never collide with them.
  runHead: {
    position: "absolute",
    top: 28,
    left: 58,
    right: 58,
    minHeight: 14,
    maxHeight: 28,
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: RULE,
    paddingBottom: 4,
  },
  runText: {
    fontFamily: "InterDoc",
    fontSize: 6.4,
    letterSpacing: 0.8,
    color: MUTED,
    textTransform: "uppercase",
    lineHeight: 1.4,
  },
  runHeadLabel: { width: "62%", paddingRight: 12 },
  runHeadClass: { width: "38%", textAlign: "right" },
  runFootRef: { width: "75%", paddingRight: 12 },
  runFootPage: { width: "25%", textAlign: "right" },
  // Page numbers sit in the footer band as their own fixed line: @react-pdf v4 drops render-prop
  // text inside a maxHeight-bounded parent, so the number is drawn beside the bounded box, not in it.
  pageNo: { position: "absolute", top: 791, right: 58, width: 110, textAlign: "right" },
  runFoot: {
    position: "absolute",
    // Anchored from the top at A4 height minus 28pt margin minus the 28pt cap, i.e. bottom: 28.
    // @react-pdf v4 misplaces render-prop page numbers inside bottom-anchored fixed boxes.
    top: 786,
    left: 58,
    right: 58,
    minHeight: 14,
    maxHeight: 28,
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderTopColor: RULE,
    paddingTop: 4,
  },
  h: {
    fontFamily: "InterDoc",
    fontSize: 8,
    fontWeight: 600,
    letterSpacing: 2,
    color: NAVY,
    textTransform: "uppercase",
    marginTop: 14,
    marginBottom: 6,
  },
  kv: { fontFamily: "InterDoc", fontSize: 7.6, letterSpacing: 1.2, color: MUTED, marginBottom: 2.5 },
  body: { fontSize: 10.5, marginBottom: 2.5 },
  indent: { fontSize: 10.5, marginBottom: 2.5, paddingLeft: 14 },
  gap: { height: 7 },
  backLead: { fontSize: 10, color: MUTED, textAlign: "center", lineHeight: 1.6, marginBottom: 8 },
});

const isHeading = (l: string) =>
  /^(?:[IVX]+\.|[A-Z][A-Z \u00C0-\u00DF,'()./-]{6,})$/.test(l.trim()) && l === l.toUpperCase();
const isKv = (l: string) => /^[A-Z][A-Z ]{2,}:/.test(l.trim());

function Body({ text }: { text: string }) {
  const lines = text.split("\n");
  // Trailing blank lines would only push an empty spacer onto a fresh, otherwise blank page.
  while (lines.length > 1 && !lines[lines.length - 1].trim()) lines.pop();
  // The first line is the document title; it is carried on the cover sheet.
  return (
    <>
      {lines.slice(1).map((raw, i) => {
        // Leading whitespace in a checkbox marker collapses in PDF text, so the
        // cleared and open states are spelled out instead.
        const l = raw.replace(/\s+$/, "").replace(/\[x\]/gi, "[CLEARED]").replace(/\[ \]/g, "[OPEN]");
        if (!l.trim()) return <View key={i} style={s.gap} />;
        if (isHeading(l)) return <Text key={i} style={s.h} minPresenceAhead={28}>{l.trim()}</Text>;
        if (isKv(l)) return <Text key={i} style={s.kv}>{l.trim()}</Text>;
        const lead = l.length - l.trimStart().length;
        return (
          <Text key={i} style={lead >= 2 ? s.indent : s.body}>
            {l.trim()}
          </Text>
        );
      })}
    </>
  );
}

export function deskDossierTitle(text: string) {
  return (text.split("\n")[0] || "Chancellery document").trim();
}

export type Attestation = {
  ref: string;
  digest: string;
  /** The twenty statutory clearances, four under each canonical stage gate. */
  clearances: { id: string; gate: string; name: string; passed: boolean; binding: boolean }[];
  gatesPassed: number;
  gatesTotal: number;
  floorValidated: boolean;
};

/** Splits a long unbroken token (a minted reference, a hex digest) into fixed-width lines. */
const chunk = (v: string, n: number) => (v.match(new RegExp(`.{1,${n}}`, "g")) ?? [v]);
/** Wraps a hyphenated reference at its hyphens, falling back to hard breaks for any over-long segment. */
const wrapRef = (v: string, n: number) =>
  v.split(/(?<=[-/])/).flatMap((seg) => chunk(seg, n)).reduce<string[]>((out, seg) => {
    const last = out[out.length - 1];
    if (last !== undefined && (last + seg).length <= n) out[out.length - 1] = last + seg;
    else out.push(seg);
    return out;
  }, []);

const at = StyleSheet.create({
  title: { fontSize: 17, color: NAVY, textAlign: "center", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 2, lineHeight: 1.2 },
  latin: { fontSize: 10, fontStyle: "italic", color: MUTED, textAlign: "center", marginBottom: 8, lineHeight: 1.2 },
  mono: { fontFamily: "Courier", fontSize: 8, color: INK, lineHeight: 1.35 },
  box: { borderWidth: 0.8, borderColor: NAVY, padding: 8, marginBottom: 10 },
  label: { fontFamily: "InterDoc", fontSize: 7.4, letterSpacing: 1.4, color: MUTED, textTransform: "uppercase", marginBottom: 6 },
  gateHead: { flexDirection: "row", marginTop: 4, paddingBottom: 1, borderBottomWidth: 0.6, borderBottomColor: NAVY },
  gateHeadName: { flex: 1, fontFamily: "InterDoc", fontSize: 7.4, letterSpacing: 1.3, color: NAVY, textTransform: "uppercase", lineHeight: 1.2 },
  gateRow: { flexDirection: "row", alignItems: "center", borderBottomWidth: 0.4, borderBottomColor: RULE, paddingVertical: 0.6 },
  gateMark: { width: 22, fontFamily: "Courier", fontSize: 8.5, color: NAVY, lineHeight: 1.2 },
  gateId: { width: 24, fontFamily: "Courier", fontSize: 8.5, color: MUTED, lineHeight: 1.2 },
  gateName: { flex: 1, fontSize: 9.4, color: INK, lineHeight: 1.2 },
  gateState: { width: 92, fontFamily: "InterDoc", fontSize: 7.4, letterSpacing: 1.2, textAlign: "right", color: MUTED, textTransform: "uppercase", lineHeight: 1.2 },
  para: { fontSize: 9.6, color: INK, marginTop: 8, lineHeight: 1.35 },
  sigs: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  sigCol: { width: "46%" },
  sigLine: { borderBottomWidth: 0.6, borderBottomColor: INK, height: 22 },
  sealBox: { borderWidth: 0.6, borderColor: BRASS, borderStyle: "dashed", minHeight: 50, paddingVertical: 6, paddingHorizontal: 8, alignItems: "center", justifyContent: "center" },
  sealMono: { fontFamily: "Courier", fontSize: 6.6, color: NAVY, lineHeight: 1.3, textAlign: "center" },
  sigCap: { fontFamily: "InterDoc", fontSize: 7.2, letterSpacing: 1.2, color: MUTED, textTransform: "uppercase", marginTop: 5 },
});

export async function buildDeskDossier({
  attestation,
  text,
  deskTitle,
  eyebrow,
  reference,
  profile,
}: {
  /** Registry dispatch for this export; adds the Instrument of Attestation page. */
  attestation?: Attestation;
  text: string;
  deskTitle: string;
  eyebrow: string;
  reference: string;
  profile: MissionProfile;
}) {
  const classification = profile.classification.trim() || "Unrestricted, working draft";
  const theatre = profile.theatre.trim() || "No active mission named";

  const doc = (
    <Document
      title={`Vinculum Security Chancellery Document · ${deskTitle}`}
      author={AUTHOR_NAME}
      subject={eyebrow}
    >
      <Page size="A4" style={s.cover}>
        <View style={s.coverFrame}>
          <View style={s.center}>
            <Image src={mark} style={s.emblem} />
            <Text style={s.wordmark}>Vinculum Security</Text>
            <Text style={s.motto}>Pro Omni Humanitate</Text>
            <View style={s.hair} />
            <Text style={s.series}>Chancellery Working Document · {eyebrow}</Text>
            <Text style={s.docTitle}>{deskTitle}</Text>
            <Text style={s.sub}>A Doctrine of Relational Security</Text>
          </View>
          <View style={s.ledger}>
            {[
              ["Document reference", reference],
              ["Mission or theatre", theatre],
              ["Parties of record", profile.parties.trim() || "Not recorded"],
              ["Drafting officer", profile.officer.trim() || "Not recorded"],
              ["Registered works", "Statutorily registered and legally protected intellectual property. Formally protected under statutory copyright law and international conventions. All statutory rights reserved"],
              ["Classification", classification],
            ].map(([k, v]) => (
              <View key={k} style={s.ledgerRow}>
                <Text style={s.ledgerKey}>{k}</Text>
                <Text style={s.ledgerVal}>{v}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>

      <Page size="A4" style={s.page}>
        <View style={s.runHead} fixed>
          <Text style={[s.runText, s.runHeadLabel]}>Vinculum Security · {eyebrow.length > 38 ? `${eyebrow.slice(0, 36).trimEnd()}…` : eyebrow}</Text>
          <Text style={[s.runText, s.runHeadClass]}>{classification.length > 34 ? `${classification.slice(0, 32).trimEnd()}…` : classification}</Text>
        </View>
        <View style={s.runFoot} fixed>
          <Text style={[s.runText, s.runFootRef]}>{reference}</Text>
        </View>
        <Text style={[s.runText, s.pageNo]} fixed render={({ pageNumber, totalPages }) => `${pageNumber} of ${totalPages}`} />
        <Text style={s.docTitle}>{deskTitle}</Text>
        <View style={s.gap} />
        <Body text={text} />
      </Page>

      {attestation && (
        <Page size="A4" style={s.page}>
          <View style={s.runHead} fixed>
            <Text style={[s.runText, s.runHeadLabel]}>Vinculum Security · Instrument of attestation · Sigillum Cancellariae</Text>
            <Text style={[s.runText, s.runHeadClass]}>{classification.length > 34 ? `${classification.slice(0, 32).trimEnd()}…` : classification}</Text>
          </View>
          <View style={s.runFoot} fixed>
              <Text style={[s.runText, s.runFootRef]}>{attestation.ref}</Text>
          </View>
          <Text style={[s.runText, s.pageNo]} fixed render={({ pageNumber, totalPages }) => `${pageNumber} of ${totalPages}`} />
          <Text style={at.title}>Instrument of Attestation</Text>
          <Text style={at.latin}>Exequatur canonicalis · unalterable record</Text>
          <View style={at.box} wrap={false}>
            <Text style={at.label}>Protocol registry</Text>
            <Text style={at.mono}>REF NO  : {attestation.ref}</Text>
            <Text style={at.mono}>DIGEST  : {attestation.digest.slice(0, 32)}</Text>
            <Text style={at.mono}>{"\u00A0".repeat(10)}{attestation.digest.slice(32)}</Text>
            <Text style={at.mono}>
              STATUS  : {attestation.clearances.filter((c) => c.passed).length}/{attestation.clearances.length} STATUTORY CLEARANCES // {attestation.gatesPassed}/{attestation.gatesTotal} GATES
            </Text>
            <Text style={at.mono}>FLOOR   : VIABLE FLOOR 3.0 {attestation.floorValidated ? "VALIDATED" : "BREACHED"}</Text>
          </View>
          <Text style={at.label}>Schedule of statutory clearances</Text>
          {[...new Set(attestation.clearances.map((c) => c.gate))].map((gate) => {
            const rows = attestation.clearances.filter((c) => c.gate === gate);
            const locked = rows.some((c) => c.binding && !c.passed);
            return (
              <View key={gate} wrap={false}>
                <View style={at.gateHead}>
                  <Text style={at.gateHeadName}>{gate}</Text>
                  <Text style={[at.gateState, { color: NAVY }]}>{locked ? "Gate locked" : "Gate cleared"}</Text>
                </View>
                {rows.map((c) => (
                  <View key={c.id} style={at.gateRow}>
                    <Text style={at.gateMark}>{c.passed ? "[X]" : "[ ]"}</Text>
                    <Text style={at.gateId}>{c.id}</Text>
                    <Text style={at.gateName}>{c.name}</Text>
                    <Text style={at.gateState}>{c.binding ? (c.passed ? "Satisfied" : "Open") : c.passed ? "Advisory · met" : "Advisory"}</Text>
                  </View>
                ))}
              </View>
            );
          })}
          <Text style={at.para}>
            The Chancellery attests that the annexed document for {profile.theatre.trim() || "the theatre under review"} was compiled from the mission state bearing the
            digest above, computed in the practitioner's own browser, and that any alteration of that state yields a different digest.
            Binding clearances decide each gate; advisory clearances are recorded for the file and do not lock the mission.
          </Text>
          <View style={at.sigs} wrap={false}>
            <View style={at.sigCol}>
              <View style={at.sigLine} />
              <Text style={at.sigCap}>Plenipotentiary · signature</Text>
              <View style={[at.sigLine, { height: 18 }]} />
              <Text style={at.sigCap}>Name and office</Text>
            </View>
            <View style={at.sigCol}>
              <View style={at.sealBox}>
                <Text style={at.sigCap}>Great Seal</Text>
                {/* Reference and digest are chunked so they always wrap inside the seal, the PDF equivalent of overflow-wrap: anywhere. */}
                {wrapRef(attestation.ref, 22).map((line, i) => (
                  <Text key={`r${i}`} style={[at.sealMono, i === 0 ? { marginTop: 4 } : {}]}>{line}</Text>
                ))}
                {chunk(attestation.digest, 16).map((line, i) => (
                  <Text key={`d${i}`} style={[at.sealMono, i === 0 ? { marginTop: 3 } : {}]}>{line}</Text>
                ))}
              </View>
              <Text style={at.sigCap}>Seal imprint</Text>
            </View>
          </View>
        </Page>
      )}

      <Page size="A4" style={s.cover}>
        <View style={s.coverFrame}>
          <View />
          <View style={s.center}>
            <Image src={mark} style={s.emblemSm} />
            <Text style={[s.wordmark, { fontSize: 16, letterSpacing: 4.5 }]}>Vinculum Security</Text>
            <Text style={s.motto}>Pro Omni Humanitate</Text>
            <View style={s.hair} />
            <Text style={s.backLead}>
              Compiled under Vinculum Security: The Fortified Doctrine and Vinculum Diplomacy: The
              Practitioner Handbook. Every reading in this document is rule-based and was computed in the
              practitioner's own browser. Nothing entered was stored or transmitted.
            </Text>
            <Text style={s.backLead}>
              {AUTHOR_NAME}. Statutorily registered and legally protected intellectual property. Formally protected under statutory copyright law and international conventions. All statutory rights reserved.
              CC BY-NC-SA 4.0.
            </Text>
          </View>
          <View style={s.ledger}>
            <View style={s.ledgerRow}>
              <Text style={s.ledgerKey}>Record</Text>
              <Text style={s.ledgerVal}>{SITE_URL}</Text>
            </View>
            <View style={s.ledgerRow}>
              <Text style={s.ledgerKey}>Classification</Text>
              <Text style={s.ledgerVal}>{classification}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );

  return pdf(doc).toBlob();
}
