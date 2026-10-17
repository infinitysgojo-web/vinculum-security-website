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
    paddingTop: 104,
    paddingBottom: 80,
    paddingHorizontal: 58,
    fontFamily: "Cormorant",
    fontSize: 10.5,
    lineHeight: 1.55,
    color: INK,
    backgroundColor: "#FFFFFF",
  },
  runHead: {
    position: "absolute",
    top: 38,
    left: 58,
    right: 58,
    flexDirection: "column",
    borderBottomWidth: 0.5,
    borderBottomColor: RULE,
    paddingBottom: 7,
  },
  runText: {
    fontFamily: "InterDoc",
    fontSize: 6.4,
    letterSpacing: 0.8,
    color: MUTED,
    textTransform: "uppercase",
    lineHeight: 1.5,
  },
  runHeadMeta: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  runHeadLabel: { width: "60%", paddingRight: 12 },
  runHeadClass: { width: "40%", textAlign: "right" },
  runFootRef: { width: "75%", paddingRight: 12 },
  runFootPage: { width: "25%", textAlign: "right", minHeight: 14 },
  runFoot: {
    position: "absolute",
    top: 785,
    // minHeight, not height: a fixed-height parent stops @react-pdf v4 painting render-prop page numbers.
    minHeight: 36,
    left: 58,
    right: 58,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingTop: 7,
  },
  runFootRule: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: 0.5,
    backgroundColor: RULE,
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

export async function buildDeskDossier({
  text,
  deskTitle,
  eyebrow,
  reference,
  profile,
}: {
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
          <Text style={s.runText}>Vinculum Security · Chancellery document</Text>
          <View style={s.runHeadMeta}>
            <Text style={[s.runText, s.runHeadLabel]}>{eyebrow.length > 48 ? `${eyebrow.slice(0, 46).trimEnd()}…` : eyebrow}</Text>
            <Text style={[s.runText, s.runHeadClass]}>{classification.length > 34 ? `${classification.slice(0, 32).trimEnd()}…` : classification}</Text>
          </View>
        </View>
        <View style={s.runFoot} fixed>
          <View style={s.runFootRule} />
          <Text style={[s.runText, s.runFootRef]}>{reference}</Text>
          <Text style={[s.runText, s.runFootPage]} render={({ pageNumber, totalPages }) => `${pageNumber} of ${totalPages}`} />
        </View>
        <Text style={s.docTitle}>{deskTitle}</Text>
        <View style={s.gap} />
        <Body text={text} />
      </Page>

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
