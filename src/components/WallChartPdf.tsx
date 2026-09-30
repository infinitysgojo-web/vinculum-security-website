import { Document, Page, Text, View, Image, StyleSheet, Font, pdf } from "@react-pdf/renderer";
import { AUTHOR_NAME, SITE_URL } from "@/lib/seo-entities";
import mark from "@/assets/vinculum-mark.png";
import serifRegular from "@/assets/fonts/CormorantGaramond-Regular.ttf";
import serifItalic from "@/assets/fonts/CormorantGaramond-Italic.ttf";
import serifSemiBold from "@/assets/fonts/CormorantGaramond-SemiBold.ttf";
import sansRegular from "@/assets/fonts/Inter-Regular.ttf";
import sansSemiBold from "@/assets/fonts/Inter-SemiBold.ttf";

/**
 * The Doctrinal Reference Chart: a single-sheet wall chart compiled from
 * "Vinculum Security: The Fortified Doctrine, Expanded Version, Final Edition"
 * (Sections III, V, VI and VIII) and the Practitioner Handbook.
 * Generated entirely in the browser; nothing is sent or stored.
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
Font.registerHyphenationCallback((word) => [word]);

const NAVY = "#1B3A6B";
const INK = "#2B2B2B";
const BRASS = "#D4A24C";
const RULE = "#C9CBD1";
const MUTED = "#5F6470";
const CREAM = "#FBF7F1";

export const CONTINUUM = [
  {
    n: "I",
    name: "Interpersonal",
    body: "Bonds between two named individuals, regardless of role.",
    inquiry: "Would this relationship survive a bad-faith moment intact?",
  },
  {
    n: "II",
    name: "Communal",
    body: "Bonds between an individual or institution and a group within a single generational cohort.",
    inquiry: "Does this actor's authority survive contact with the community, not just the institution?",
  },
  {
    n: "III",
    name: "Intergenerational",
    body: "Bonds between distinct generational cohorts, carrying knowledge and standing between youth and elders.",
    inquiry: "Are youth present at the table, or only in the room?",
  },
  {
    n: "IV",
    name: "Institutional-Relational",
    body: "Bonds between an institution and the population it is mandated to serve.",
    inquiry: "Would this bond survive a change in personnel or office?",
  },
];

export const CLASSIFICATION = [
  ["Two named individuals, regardless of role", "Interpersonal"],
  ["An individual or institution and a group, within a single generational cohort", "Communal"],
  ["Two distinct generational cohorts, youth and elders or successive practitioner generations", "Intergenerational, which takes precedence over Communal where age-cohort is the defining feature"],
  ["An institution and the population it serves, tested across a change of personnel or office", "Institutional-Relational"],
];

export const PARTY_RULES = [
  ["Children", "Institutional-Relational, Communal as protected party", "Never subject to communal-standing verification. Assessed on best interest and evolving capacities."],
  ["Youth", "Intergenerational", "Active co-assessors of bond theater aimed at their own generation, not only recipients of participation."],
  ["Elders", "Intergenerational", "Testimony carries additional evidentiary weight on intergenerational bond integrity."],
  ["Women", "Communal, Institutional-Relational", "Assessed jointly with the WPS four pillars; a gender chapter is tracked as its own line, never folded in."],
  ["Government or State", "Institutional-Relational", "Never the sole assessor of its own institutional-relational score."],
  ["Civil society, traditional leaders", "Communal", "Function partly as independent verifiers of other parties' communal bonds."],
  ["Ex-combatants", "Institutional-Relational, Communal", "Reintegration scored on formal programming and communal acceptance; neither is sufficient alone."],
];

export const SAFEGUARDS = [
  ["Risk one, delay-justification", "A government invokes relational preservation to delay accountability. The invocation is itself scored as a low institutional-relational signal, never a warrant for reduced scrutiny."],
  ["Risk two, dissident-delegitimization", "The communal-standing test is turned against dissidents. It applies only to actors claiming representative authority, never to an individual's right to be heard, and never to children."],
  ["Risk three, R2P defence misuse", "A state cites a high bond score against atrocity-based intervention. Bond scores are entirely subordinate to R2P's own factual triggers."],
];

export const TRAPS = [
  ["The Elite-Pact Mirage", "Principals are aligned while communities and the successor generation disengage.", "Suspend principal-level announcements until a communal verification round reports."],
  ["The Generational Cliff", "The successor generation holds no stake in the settlement.", "Constitute a standing intergenerational review with a decision it can actually alter."],
  ["Unanchored Repair", "Communal goodwill has no institution to settle into.", "Give the implementing body statutory footing and a budget protected from reallocation."],
  ["Bond Theater", "Process is recorded in place of changed outcomes.", "Apply the outcome test: name one decision each consultation altered, or record non-compliance."],
  ["Systemic Bond Collapse", "All four bonds are under simultaneous strain.", "Treat the settlement as lapsed in practice and reopen the mandate, not the schedule."],
];

const s = StyleSheet.create({
  page: {
    paddingTop: 26,
    paddingBottom: 24,
    paddingHorizontal: 26,
    fontFamily: "Cormorant",
    fontSize: 8,
    color: INK,
    backgroundColor: "#FFFFFF",
  },
  frame: { borderWidth: 0.9, borderColor: NAVY, flexGrow: 1, padding: 16 },
  head: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  emblem: { width: 34, height: 34, objectFit: "contain", marginRight: 12 },
  wordmark: { fontSize: 17, letterSpacing: 4.5, color: NAVY, textTransform: "uppercase" },
  headSub: { fontFamily: "InterDoc", fontSize: 6.2, letterSpacing: 2.2, color: MUTED, textTransform: "uppercase", marginTop: 3 },
  headRight: { marginLeft: "auto", alignItems: "flex-end" },
  headRightLine: { fontFamily: "InterDoc", fontSize: 5.8, letterSpacing: 1.4, color: MUTED, textTransform: "uppercase" },
  brassRule: { height: 1.6, backgroundColor: BRASS, marginBottom: 10 },

  definition: { borderWidth: 0.6, borderColor: RULE, backgroundColor: CREAM, padding: 10, marginBottom: 10 },
  defLabel: { fontFamily: "InterDoc", fontSize: 5.8, letterSpacing: 2, color: NAVY, textTransform: "uppercase", marginBottom: 5 },
  defText: { fontSize: 11.5, lineHeight: 1.4, color: NAVY },
  defCite: { fontFamily: "InterDoc", fontSize: 5.6, letterSpacing: 1.2, color: MUTED, textTransform: "uppercase", marginTop: 5 },

  row: { flexDirection: "row", marginBottom: 10 },
  col: { flex: 1 },
  gap: { width: 10 },

  card: { borderWidth: 0.6, borderColor: RULE, padding: 9, flexGrow: 1 },
  cardTitle: { fontFamily: "InterDoc", fontSize: 6, letterSpacing: 1.8, color: NAVY, textTransform: "uppercase", marginBottom: 6 },

  bond: { marginBottom: 6, paddingBottom: 5, borderBottomWidth: 0.4, borderBottomColor: RULE },
  bondHead: { flexDirection: "row", alignItems: "baseline" },
  bondNum: { fontSize: 9, color: BRASS, width: 16 },
  bondName: { fontSize: 10.5, color: NAVY },
  bondBody: { fontSize: 7.6, color: INK, marginTop: 2, lineHeight: 1.35 },
  bondInquiry: { fontSize: 8.4, fontStyle: "italic", color: NAVY, marginTop: 3 },

  line: { flexDirection: "row", marginBottom: 4 },
  lineKey: { width: "46%", fontSize: 7.4, color: INK, paddingRight: 6, lineHeight: 1.3 },
  lineVal: { flex: 1, fontSize: 7.4, color: NAVY, lineHeight: 1.3 },

  pRow: { marginBottom: 4.5 },
  pName: { fontSize: 8.6, color: NAVY },
  pLens: { fontFamily: "InterDoc", fontSize: 5.6, letterSpacing: 1.1, color: BRASS, textTransform: "uppercase", marginTop: 1 },
  pNote: { fontSize: 7.3, color: INK, lineHeight: 1.3, marginTop: 1 },

  weight: { borderLeftWidth: 1.4, borderLeftColor: BRASS, paddingLeft: 8, marginTop: 6 },
  weightText: { fontSize: 8.2, fontStyle: "italic", color: NAVY, lineHeight: 1.35 },

  trap: { marginBottom: 4.5 },
  trapName: { fontSize: 8.8, color: NAVY },
  trapRead: { fontSize: 7.3, color: INK, lineHeight: 1.3 },
  trapCounter: { fontSize: 7.3, color: MUTED, lineHeight: 1.3, fontStyle: "italic" },

  foot: { marginTop: "auto", borderTopWidth: 0.6, borderTopColor: RULE, paddingTop: 7, flexDirection: "row", justifyContent: "space-between" },
  footText: { fontFamily: "InterDoc", fontSize: 5.6, letterSpacing: 1, color: MUTED, textTransform: "uppercase" },
});

function Bonds() {
  return (
    <View style={s.card}>
      <Text style={s.cardTitle}>I. The Vinculum Continuum and its diagnostic inquiries</Text>
      {CONTINUUM.map((b) => (
        <View key={b.n} style={s.bond}>
          <View style={s.bondHead}>
            <Text style={s.bondNum}>{b.n}</Text>
            <Text style={s.bondName}>{b.name}</Text>
          </View>
          <Text style={s.bondBody}>{b.body}</Text>
          <Text style={s.bondInquiry}>"{b.inquiry}"</Text>
        </View>
      ))}
      <Text style={{ fontSize: 7.2, color: MUTED, lineHeight: 1.3 }}>
        Each level is scored 1 to 5 against citable public reporting, and all four levels are scored for
        every case, whether or not a level flatters the doctrine.
      </Text>
    </View>
  );
}

function Rules() {
  return (
    <View style={s.card}>
      <Text style={s.cardTitle}>II. Classification rules and the weighting principle</Text>
      {CLASSIFICATION.map(([k, v]) => (
        <View key={k} style={s.line}>
          <Text style={s.lineKey}>If the bond is between {k.charAt(0).toLowerCase() + k.slice(1)}</Text>
          <Text style={s.lineVal}>{v}</Text>
        </View>
      ))}
      <View style={s.weight}>
        <Text style={s.weightText}>
          A severed intergenerational bond is treated as the least compensable by strength in the other
          three levels, derived from Menkiti's gradational account of personhood.
        </Text>
      </View>
      <Text style={{ fontSize: 7.2, color: MUTED, marginTop: 6, lineHeight: 1.3 }}>
        Falsifiability, Section IV: a case scoring uniformly high across all four levels that then
        collapses for reasons unrelated to any bond domain would falsify the central claim.
      </Text>
    </View>
  );
}

function Parties() {
  return (
    <View style={s.card}>
      <Text style={s.cardTitle}>III. Party-differentiated application</Text>
      {PARTY_RULES.map(([name, lens, note]) => (
        <View key={name} style={s.pRow}>
          <Text style={s.pName}>{name}</Text>
          <Text style={s.pLens}>{lens}</Text>
          <Text style={s.pNote}>{note}</Text>
        </View>
      ))}
    </View>
  );
}

function Guards() {
  return (
    <View style={s.card}>
      <Text style={s.cardTitle}>IV. Abuse-resistance safeguards</Text>
      {SAFEGUARDS.map(([name, note]) => (
        <View key={name} style={s.pRow}>
          <Text style={s.pName}>{name}</Text>
          <Text style={s.pNote}>{note}</Text>
        </View>
      ))}
      <View style={s.weight}>
        <Text style={s.weightText}>
          The doctrine values just and freely sustained bonds, not bonds as such. Any invocation that
          entrenches injustice or silences dissent has inverted the claim.
        </Text>
      </View>
      <Text style={[s.cardTitle, { marginTop: 9 }]}>V. The five latent traps</Text>
      {TRAPS.map(([name, reading, counter]) => (
        <View key={name} style={s.trap}>
          <Text style={s.trapName}>{name}</Text>
          <Text style={s.trapRead}>{reading}</Text>
          <Text style={s.trapCounter}>Counter-measure: {counter}</Text>
        </View>
      ))}
    </View>
  );
}

function Chart({ landscape }: { landscape: boolean }) {
  const year = new Date().getFullYear();
  return (
    <Page size={landscape ? "A3" : "A3"} orientation={landscape ? "landscape" : "portrait"} style={s.page}>
      <View style={s.frame}>
        <View style={s.head}>
          <Image src={mark} style={s.emblem} />
          <View>
            <Text style={s.wordmark}>Vinculum Security</Text>
            <Text style={s.headSub}>A Doctrine of Relational Security  ·  Pro Omni Humanitate</Text>
          </View>
          <View style={s.headRight}>
            <Text style={s.headRightLine}>Doctrinal Reference Chart</Text>
            <Text style={s.headRightLine}>{AUTHOR_NAME}</Text>
            <Text style={s.headRightLine}>KECOBO Reg. No. RZ100967</Text>
          </View>
        </View>
        <View style={s.brassRule} />

        <View style={s.definition}>
          <Text style={s.defLabel}>Canonical definition, Section III.A</Text>
          <Text style={s.defText}>
            Security is not the absence of threat to a state or an individual, but the presence and
            integrity of the relational bonds, between persons, communities, and generations, that make
            protection, dignity, and peace possible in the first place.
          </Text>
          <Text style={s.defCite}>
            The proper unit of security analysis is the bond, Section III.B
          </Text>
        </View>

        {landscape ? (
          <>
            <View style={s.row}>
              <View style={s.col}><Bonds /></View>
              <View style={s.gap} />
              <View style={s.col}><Rules /></View>
              <View style={s.gap} />
              <View style={s.col}><Parties /></View>
              <View style={s.gap} />
              <View style={s.col}><Guards /></View>
            </View>
          </>
        ) : (
          <>
            <View style={s.row}>
              <View style={s.col}><Bonds /></View>
              <View style={s.gap} />
              <View style={s.col}><Rules /></View>
            </View>
            <View style={s.row}>
              <View style={s.col}><Parties /></View>
              <View style={s.gap} />
              <View style={s.col}><Guards /></View>
            </View>
          </>
        )}

        <View style={s.foot}>
          <Text style={s.footText}>© {year} {AUTHOR_NAME}  ·  CC BY-NC-ND 4.0</Text>
          <Text style={s.footText}>{SITE_URL.replace(/^https?:\/\//, "")}/doctrine</Text>
          <Text style={s.footText}>Unrestricted · Public record</Text>
        </View>
      </View>
    </Page>
  );
}

export function wallChartFileName(landscape: boolean) {
  return `Vinculum-Security-Doctrinal-Reference-Chart-${landscape ? "A3-landscape" : "A3-portrait"}.pdf`;
}

export async function buildWallChartPdf(landscape: boolean) {
  return pdf(
    <Document
      title="Vinculum Security · Doctrinal Reference Chart"
      author={AUTHOR_NAME}
      subject="The Vinculum Continuum, classification rules, party-differentiated application, safeguards and latent traps"
      creator="Vinculum Security"
    >
      <Chart landscape={landscape} />
    </Document>
  ).toBlob();
}
