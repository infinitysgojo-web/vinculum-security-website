import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
  pdf,
} from "@react-pdf/renderer";
import { AUTHOR_NAME, SITE_URL } from "@/lib/seo-entities";
import { DOMAINS, type CaseStudy } from "@/content/cases";
import mark from "@/assets/vinculum-mark.png";
import serifRegular from "@/assets/fonts/CormorantGaramond-Regular.ttf";
import serifItalic from "@/assets/fonts/CormorantGaramond-Italic.ttf";
import serifSemiBold from "@/assets/fonts/CormorantGaramond-SemiBold.ttf";
import sansRegular from "@/assets/fonts/Inter-Regular.ttf";
import sansSemiBold from "@/assets/fonts/Inter-SemiBold.ttf";

/**
 * Publication-grade executive dossier, generated as a real PDF file.
 * Independent of the browser print pipeline, so no browser headers,
 * footers, URLs or timestamps are ever stamped into the document.
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

const s = StyleSheet.create({
  page: {
    paddingTop: 92,
    paddingBottom: 66,
    paddingHorizontal: 58,
    fontFamily: "Cormorant",
    fontSize: 10.5,
    lineHeight: 1.55,
    color: INK,
    backgroundColor: "#FFFFFF",
  },

  // Cover
  cover: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    fontFamily: "Cormorant",
    color: INK,
    backgroundColor: "#FFFFFF",
  },
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
  coverTop: { alignItems: "center" },
  emblem: { width: 68, height: 68, objectFit: "contain", marginBottom: 22 },
  emblemSm: { width: 48, height: 48, objectFit: "contain", marginBottom: 16 },
  coverWordmark: {
    fontSize: 23,
    letterSpacing: 6,
    color: NAVY,
    textTransform: "uppercase",
  },
  coverMotto: {
    fontSize: 11,
    fontStyle: "italic",
    color: MUTED,
    marginTop: 10,
  },
  coverHair: {
    width: 190,
    borderBottomWidth: 0.6,
    borderBottomColor: BRASS,
    marginTop: 16,
    marginBottom: 12,
  },
  coverLabel: {
    fontFamily: "InterDoc",
    fontSize: 6.6,
    letterSpacing: 2.4,
    color: MUTED,
    textTransform: "uppercase",
  },
  coverMid: { alignItems: "center" },
  coverSeries: {
    fontFamily: "InterDoc",
    fontSize: 7.2,
    letterSpacing: 2.6,
    color: NAVY,
    textTransform: "uppercase",
    marginBottom: 20,
  },
  coverTitleWrap: {
    borderTopWidth: 1.1,
    borderBottomWidth: 1.1,
    borderColor: NAVY,
    paddingVertical: 20,
    width: "100%",
  },
  coverTitle: {
    fontSize: 27,
    textAlign: "center",
    color: NAVY,
    textTransform: "uppercase",
    lineHeight: 1.18,
  },
  coverSub: {
    fontFamily: "InterDoc",
    fontSize: 7.4,
    letterSpacing: 2.6,
    color: MUTED,
    textTransform: "uppercase",
    marginTop: 18,
  },
  coverPillar: { fontSize: 11, fontStyle: "italic", color: INK, marginTop: 8 },
  coverFoot: { borderTopWidth: 0.8, borderTopColor: NAVY, paddingTop: 14 },
  coverFootRow: { flexDirection: "row", marginBottom: 10 },
  coverFootCell: { width: "33.33%", paddingRight: 10 },
  coverFootLabel: {
    fontFamily: "InterDoc",
    fontSize: 5.6,
    letterSpacing: 1.5,
    color: MUTED,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  coverFootValue: { fontSize: 9.5, color: INK },

  // Running masthead / footer
  masthead: {
    position: "absolute",
    top: 26,
    left: 58,
    right: 58,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomWidth: 0.7,
    borderBottomColor: NAVY,
    paddingBottom: 6,
  },
  mastheadName: { fontSize: 11, letterSpacing: 2.2, color: NAVY, textTransform: "uppercase" },
  mastheadMotto: { fontSize: 7.5, fontStyle: "italic", color: MUTED },
  mastheadRight: { alignItems: "flex-end" },
  mastheadMeta: {
    fontFamily: "InterDoc",
    fontSize: 5.8,
    letterSpacing: 1.4,
    color: MUTED,
    textTransform: "uppercase",
  },
  footer: {
    position: "absolute",
    top: 782,
    left: 58,
    right: 58,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: RULE,
    paddingTop: 6,
  },
  footerText: { fontFamily: "InterDoc", fontSize: 5.8, letterSpacing: 1.2, color: MUTED },

  // Opening block
  docTitle: { fontSize: 22, color: NAVY, marginBottom: 8, lineHeight: 1.25 },
  docSub: {
    fontFamily: "InterDoc",
    fontSize: 6.8,
    letterSpacing: 2,
    color: MUTED,
    textTransform: "uppercase",
    marginBottom: 18,
  },

  // Tables
  table: { borderTopWidth: 0.6, borderTopColor: RULE, marginBottom: 16 },
  row: { flexDirection: "row", borderBottomWidth: 0.6, borderBottomColor: RULE },
  th: {
    fontFamily: "InterDoc",
    fontSize: 6.2,
    letterSpacing: 1.3,
    color: NAVY,
    textTransform: "uppercase",
    paddingVertical: 7,
    paddingRight: 10,
  },
  td: { fontSize: 10, paddingVertical: 7, paddingRight: 10 },

  h2: {
    fontSize: 14,
    color: NAVY,
    marginTop: 20,
    marginBottom: 4,
    borderBottomWidth: 0.7,
    borderBottomColor: BRASS,
    paddingBottom: 5,
  },
  h3: {
    fontFamily: "InterDoc",
    fontSize: 6.6,
    letterSpacing: 1.8,
    color: MUTED,
    textTransform: "uppercase",
    marginTop: 14,
    marginBottom: 6,
  },
  abstract: {
    fontSize: 11,
    fontStyle: "italic",
    color: NAVY,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 12,
    borderLeftWidth: 1.6,
    borderLeftColor: BRASS,
  },
  body: { fontSize: 10.5, marginBottom: 8, textAlign: "justify" },
  note: { fontSize: 8.8, color: MUTED, fontStyle: "italic", marginTop: 8 },
  quote: {
    marginTop: 14,
    marginBottom: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 0.6,
    borderBottomWidth: 0.6,
    borderColor: RULE,
  },
  quoteText: { fontSize: 12, fontStyle: "italic", color: NAVY, textAlign: "center" },
  quoteCite: {
    fontFamily: "InterDoc",
    fontSize: 6,
    letterSpacing: 1.6,
    color: MUTED,
    textTransform: "uppercase",
    textAlign: "center",
    marginTop: 8,
  },
  listItem: { flexDirection: "row", marginBottom: 7 },
  listNum: { fontFamily: "InterDoc", fontSize: 7.5, color: BRASS, width: 20, paddingTop: 2 },
  listText: { fontSize: 10.5, flex: 1, textAlign: "justify" },
  source: { fontSize: 9.3, flex: 1, color: INK },
  pattern: { fontSize: 10.2, marginTop: 8, color: INK },
  patternLead: { fontFamily: "InterDoc", fontSize: 6.4, letterSpacing: 1.4, color: NAVY },

  // Back cover
  backFrame: {
    margin: 26,
    borderWidth: 0.9,
    borderColor: NAVY,
    flexGrow: 1,
    paddingVertical: 60,
    paddingHorizontal: 48,
    alignItems: "center",
    justifyContent: "space-between",
  },
  backLead: {
    fontSize: 11,
    textAlign: "center",
    color: INK,
    lineHeight: 1.7,
    width: "88%",
    marginHorizontal: "6%",
  },
  colophon: {
    fontSize: 8.2,
    textAlign: "center",
    color: MUTED,
    lineHeight: 1.7,
    width: "100%",
    borderTopWidth: 0.5,
    borderTopColor: RULE,
    paddingTop: 12,
  },
});

function Rows({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <View style={s.table}>
      {rows.map((r) => (
        <View key={r.label} style={s.row} wrap={false}>
          <Text style={[s.th, { width: "30%" }]}>{r.label}</Text>
          <Text style={[s.td, { width: "70%" }]}>{r.value}</Text>
        </View>
      ))}
    </View>
  );
}

export function DossierDocument({ c }: { c: CaseStudy }) {
  const url = `${SITE_URL}/cases/${c.slug}`;
  const issued = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const docRef = `VS-CE-${c.ref.replace("VII.", "VII-")}`;

  const Masthead = () => (
    <View style={s.masthead} fixed>
      <View>
        <Text style={s.mastheadName}>Vinculum Security</Text>
        <Text style={s.mastheadMotto}>Pro Omni Humanitate</Text>
      </View>
      <View style={s.mastheadRight}>
        <Text style={s.mastheadMeta}>Executive Dossier</Text>
        <Text style={s.mastheadMeta}>{docRef}</Text>
      </View>
    </View>
  );

  const Footer = () => (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>Unrestricted · Public Record · Statutorily registered and legally protected intellectual property. Formally protected under statutory copyright law and international conventions. All statutory rights reserved</Text>
      <Text
        style={s.footerText}
        fixed
        render={({ pageNumber, totalPages }) => `${pageNumber} of ${totalPages}`}
      />
    </View>
  );

  return (
    <Document
      title={`Vinculum Security Executive Dossier · ${c.title}`}
      author={AUTHOR_NAME}
      subject={`Applied Case Engagement, Section ${c.ref}`}
      keywords={c.keywords}
      creator="Vinculum Security"
      producer="Vinculum Security"
    >
      {/* ---------------- FRONT COVER ---------------- */}
      <Page size="A4" style={s.cover}>
        <View style={s.coverFrame}>
          <View style={s.coverTop}>
            <Image style={s.emblem} src={mark} />
            <Text style={s.coverWordmark}>Vinculum Security</Text>
            <Text style={s.coverMotto}>Pro Omni Humanitate</Text>
            <View style={s.coverHair} />
            <Text style={s.coverLabel}>A Doctrine of Relational Security</Text>
          </View>

          <View style={s.coverMid}>
            <Text style={s.coverSeries}>Executive Dossier · Applied Case Engagement</Text>
            <View style={s.coverTitleWrap}>
              <Text style={s.coverTitle}>{c.title}</Text>
            </View>
            <Text style={s.coverSub}>
              {c.region} · {c.era}
            </Text>
            <Text style={s.coverPillar}>Primary pillar: {c.pillar}</Text>
          </View>

          <View style={s.coverFoot}>
            <View style={s.coverFootRow}>
              <View style={s.coverFootCell}>
                <Text style={s.coverFootLabel}>Document reference</Text>
                <Text style={s.coverFootValue}>{docRef}</Text>
              </View>
              <View style={s.coverFootCell}>
                <Text style={s.coverFootLabel}>Doctrine section</Text>
                <Text style={s.coverFootValue}>{c.ref}</Text>
              </View>
              <View style={s.coverFootCell}>
                <Text style={s.coverFootLabel}>Prepared by</Text>
                <Text style={s.coverFootValue}>{AUTHOR_NAME}</Text>
              </View>
            </View>
            <View style={s.coverFootRow}>
              <View style={s.coverFootCell}>
                <Text style={s.coverFootLabel}>Date of issue</Text>
                <Text style={s.coverFootValue}>{issued}</Text>
              </View>
              <View style={s.coverFootCell}>
                <Text style={s.coverFootLabel}>Registration</Text>
                <Text style={s.coverFootValue}>Statutorily registered and legally protected intellectual property. Formally protected under statutory copyright law and international conventions. All statutory rights reserved</Text>
              </View>
              <View style={s.coverFootCell}>
                <Text style={s.coverFootLabel}>Classification</Text>
                <Text style={s.coverFootValue}>Unrestricted · Public Record</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>

      {/* ---------------- BODY ---------------- */}
      <Page size="A4" style={s.page}>
        <Masthead />
        <Footer />

        <Text style={s.docTitle}>{c.title}</Text>
        <Text style={s.docSub}>
          Section {c.ref} · {c.region} · {c.era} · Primary pillar: {c.pillar}
        </Text>

        <Rows
          rows={[
            { label: "Document reference", value: docRef },
            { label: "Date of issue", value: issued },
            { label: "Prepared by", value: AUTHOR_NAME },
            { label: "Registration", value: "Statutorily registered and legally protected intellectual property. Formally protected under statutory copyright law and international conventions. All statutory rights reserved" },
            { label: "Theater", value: c.region },
            { label: "Period of record", value: c.era },
            { label: "Canonical record", value: url },
          ]}
        />

        <Text style={s.h2}>I. Executive Overview</Text>
        <Text style={s.abstract}>{c.summary}</Text>
        {c.narrative.map((p, i) => (
          <Text key={i} style={s.body}>
            {p}
          </Text>
        ))}

        <Text style={s.h3}>Conflict vector and record</Text>
        <Rows
          rows={[
            ...c.facts.map((f) => ({ label: f.label, value: f.value })),
            { label: "Threat classification", value: c.threats.join("; ") },
          ]}
        />

        <Text style={s.h2}>II. The Four-Bond Continuum Matrix</Text>
        <View style={s.table}>
          <View style={[s.row, { borderBottomWidth: 0.8, borderBottomColor: NAVY }]}>
            <Text style={[s.th, { width: "24%" }]}>Bond domain</Text>
            <Text style={[s.th, { width: "13%" }]}>Score</Text>
            <Text style={[s.th, { width: "63%" }]}>Diagnostic rationale</Text>
          </View>
          {DOMAINS.map((d, i) => (
            <View key={d} style={s.row} wrap={false}>
              <Text style={[s.td, { width: "24%", color: NAVY }]}>{d}</Text>
              <Text style={[s.td, { width: "13%" }]}>{c.scores[i]} / 5</Text>
              <Text style={[s.td, { width: "63%" }]}>{c.rationales[i]}</Text>
            </View>
          ))}
        </View>
        <Text style={s.note}>
          Scores run 1 to 5 within each bond domain. Higher values indicate stronger observed bond
          integrity at the period of record. Scores are diagnostic instruments for deliberation, not
          certifications of compliance.
        </Text>

        <View style={s.quote} wrap={false}>
          <Text style={s.quoteText}>{c.quote}</Text>
          <Text style={s.quoteCite}>
            {c.shortTitle}, Section {c.ref}
          </Text>
        </View>

        <Text style={s.h2}>III. Doctrinal Findings</Text>
        {c.finding.map((p, i) => (
          <View key={i} style={s.listItem}>
            <Text style={s.listNum}>{String(i + 1).padStart(2, "0")}</Text>
            <Text style={s.listText}>{p}</Text>
          </View>
        ))}
        <Text style={s.pattern}>
          <Text style={s.patternLead}>CROSS-CASE POSITION. </Text>
          {c.pattern}
        </Text>

        <Text style={s.h2}>IV. Applied Protocols for Envoys</Text>
        <Text style={s.h3}>Handbook § 12 · What a Vinculum diplomat does</Text>
        <Text style={s.body}>{c.practice}</Text>
        <Text style={s.h3}>Transferable directive</Text>
        <Text style={s.body}>{c.takeaway}</Text>

        <Text style={s.h2}>V. Sources of Record</Text>
        {c.sources.map((src, i) => (
          <View key={i} style={s.listItem}>
            <Text style={s.listNum}>{String(i + 1).padStart(2, "0")}</Text>
            <Text style={s.source}>{src}</Text>
          </View>
        ))}
      </Page>

      {/* ---------------- BACK COVER ---------------- */}
      <Page size="A4" style={s.cover}>
        <View style={s.backFrame}>
          <View style={s.coverTop}>
            <Image style={s.emblemSm} src={mark} />
            <Text style={[s.coverWordmark, { fontSize: 17, letterSpacing: 4.5 }]}>
              Vinculum Security
            </Text>
            <Text style={s.coverMotto}>Pro Omni Humanitate</Text>
            <View style={s.coverHair} />
            <Text style={s.coverLabel}>A Doctrine of Relational Security</Text>
          </View>

          <Text style={s.backLead}>
            This dossier is drawn from Vinculum Security: The Fortified Doctrine, Expanded Version,
            Final Edition, Section {c.ref}, and Vinculum Diplomacy: The Practitioner Handbook, Final
            Edition, Section 12. Both works are by {AUTHOR_NAME}.
          </Text>

          <View style={s.colophon}>
            <Text>
              © {new Date().getFullYear()} {AUTHOR_NAME}. All rights reserved.
            </Text>
            <Text>
              Statutorily registered and legally protected intellectual property. Formally protected under statutory copyright law and international conventions. All statutory rights reserved. Released under
              Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA
              4.0).
            </Text>
            <Text>
              Document reference {docRef} · Issued {issued} · Unrestricted public record.
            </Text>
            <Text>{url}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

/** Builds the dossier and returns it as a downloadable PDF file blob. */
export async function buildDossierPdf(c: CaseStudy): Promise<Blob> {
  return pdf(<DossierDocument c={c} />).toBlob();
}

/** Filename used for the downloaded dossier. */
export function dossierFileName(c: CaseStudy): string {
  const slug = c.shortTitle.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `Vinculum-Security-Executive-Dossier-${slug}.pdf`;
}
