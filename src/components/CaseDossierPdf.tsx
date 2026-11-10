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
import { mathReading, holdsFloor, bondBand, VIABLE_FLOOR } from "@/components/desk/engine";
import { FrontCover, BackCover } from "@/components/pdf/BookCover";
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
const PARCHMENT = "#FBF7F1";
const CRIMSON = "#8B1E1E";
const SLATE = "#2F3A4A";

const s = StyleSheet.create({
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

  // Cover
  cover: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    fontFamily: "Cormorant",
    color: INK,
    backgroundColor: PARCHMENT,
  },
  frameOuter: { margin: 26 },
  coverFrame: {
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
    borderTopWidth: 1.6,
    borderBottomWidth: 1.6,
    borderColor: CRIMSON,
    paddingVertical: 22,
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
  // Running header and footer: strictly bounded so body copy can never collide with them.
  masthead: {
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
  mastheadName: { fontSize: 9.5, lineHeight: 1.1, letterSpacing: 2.2, color: NAVY, textTransform: "uppercase" },
  mastheadMotto: { fontSize: 6.8, lineHeight: 1.1, fontStyle: "italic", color: MUTED },
  mastheadRight: { width: "35%", alignItems: "flex-end", overflow: "hidden" },
  mastheadMeta: {
    fontFamily: "InterDoc",
    fontSize: 5.8,
    letterSpacing: 1.4,
    lineHeight: 1.3,
    color: MUTED,
    textTransform: "uppercase",
  },
  footer: {
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
  footerText: { fontFamily: "InterDoc", fontSize: 5.8, letterSpacing: 0.6, color: MUTED, lineHeight: 1.4 },
  footerLeft: { width: "80%", paddingRight: 12 },
  footerPage: { width: "20%", textAlign: "right" },
  pageNo: { position: "absolute", top: 791, right: 58, width: 110, textAlign: "right" },
  statutoryNotice: { fontSize: 8.2, color: MUTED, lineHeight: 1.5, marginTop: 6 },

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

  // Continuum Scorecard Grid
  grid: { flexDirection: "row", marginTop: 6, marginBottom: 6 },
  cell: {
    width: "25%",
    backgroundColor: PARCHMENT,
    borderWidth: 0.5,
    borderColor: BRASS,
    paddingVertical: 9,
    paddingHorizontal: 7,
  },
  cellNum: { fontFamily: "InterDoc", fontSize: 5.8, letterSpacing: 1.4, color: BRASS, textTransform: "uppercase" },
  cellName: { fontFamily: "InterDoc", fontSize: 6.4, letterSpacing: 0.9, color: NAVY, textTransform: "uppercase", marginTop: 2, lineHeight: 1.25, minHeight: 16 },
  cellScore: { fontSize: 19, color: NAVY, marginTop: 4, lineHeight: 1.1 },
  cellScale: { fontSize: 10, color: MUTED },
  cellClass: { fontSize: 8.6, fontStyle: "italic", color: MUTED, marginTop: 2, lineHeight: 1.2 },
  chipRow: { flexDirection: "row", marginTop: 6 },
  chipText: { fontFamily: "Courier", fontSize: 6.8, lineHeight: 1.2, paddingTop: 2, paddingBottom: 1, paddingHorizontal: 3, borderWidth: 0.5 },
  summary: {
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: BRASS,
    borderTopWidth: 1,
    borderTopColor: NAVY,
    marginBottom: 12,
  },
  sumCell: { width: "33.33%", paddingVertical: 6, paddingHorizontal: 7 },
  sumLabel: { fontFamily: "InterDoc", fontSize: 5.6, letterSpacing: 1.3, color: MUTED, textTransform: "uppercase" },
  sumValue: { fontFamily: "Courier", fontSize: 9, color: NAVY, marginTop: 2 },
  rationaleName: { fontFamily: "InterDoc", fontSize: 6.2, letterSpacing: 1.2, color: NAVY, textTransform: "uppercase", width: "26%", paddingTop: 2, paddingRight: 8 },
  rationaleText: { fontSize: 10, width: "74%" },

  h2: {
    fontSize: 13.5,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: NAVY,
    marginTop: 24,
    marginBottom: 8,
    paddingVertical: 5,
    paddingLeft: 9,
    borderLeftWidth: 2.4,
    borderLeftColor: BRASS,
    borderBottomWidth: 0.5,
    borderBottomColor: RULE,
    backgroundColor: PARCHMENT,
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
  contents: { borderTopWidth: 0.6, borderBottomWidth: 0.6, borderColor: BRASS, paddingVertical: 8, marginTop: 14, marginBottom: 4 },
  contentsLabel: { fontFamily: "InterDoc", fontSize: 6, letterSpacing: 2, color: MUTED, textTransform: "uppercase", marginBottom: 4 },
  contentsRow: { flexDirection: "row", fontSize: 10, color: NAVY, marginBottom: 1 },
  contentsNum: { width: 26, fontWeight: 600 },
  endMark: { fontFamily: "InterDoc", fontSize: 6.4, letterSpacing: 2.4, color: MUTED, textTransform: "uppercase", textAlign: "center", marginTop: 26, paddingTop: 8, borderTopWidth: 0.6, borderTopColor: BRASS },
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

function Scorecard({ scores }: { scores: number[] }) {
  const v = [scores[0], scores[1], scores[2], scores[3]] as [number, number, number, number];
  const m = mathReading(v);
  return (
    <View wrap={false}>
      <View style={s.grid}>
        {DOMAINS.map((d, i) => {
          const ok = holdsFloor(v[i]);
          return (
            <View key={d} style={i > 0 ? [s.cell, { borderLeftWidth: 0 }] : s.cell}>
              <Text style={s.cellNum}>Domain {["I", "II", "III", "IV"][i]}</Text>
              <Text style={s.cellName}>{d}</Text>
              <Text style={s.cellScore}>
                {v[i].toFixed(1)} <Text style={s.cellScale}>/ 5.0</Text>
              </Text>
              <Text style={s.cellClass}>{bondBand(v[i])} band</Text>
              <View style={s.chipRow}>
                <Text style={[s.chipText, { color: ok ? SLATE : CRIMSON, borderColor: ok ? BRASS : CRIMSON }]}>
                  {ok ? "[VIABLE]" : "[ACUTE STRAIN]"}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
      <View style={s.summary}>
        <View style={s.sumCell}>
          <Text style={s.sumLabel}>Arithmetic mean</Text>
          <Text style={s.sumValue}>{m.mean.toFixed(2)} / 5.00</Text>
        </View>
        <View style={s.sumCell}>
          <Text style={s.sumLabel}>Variance (population)</Text>
          <Text style={s.sumValue}>{m.variance.toFixed(3)}</Text>
        </View>
        <View style={s.sumCell}>
          <Text style={s.sumLabel}>Canonical limiting bond</Text>
          <Text style={s.sumValue}>
            {DOMAINS[m.limitingIndex]} · {m.limitingScore.toFixed(1)}
          </Text>
        </View>
      </View>
    </View>
  );
}

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
      <Text style={[s.footerText, s.footerLeft]}>Vinculum Security · Unrestricted · Public record</Text>
      <View style={s.footerPage} />
    </View>
  );

  // Drawn beside the bounded footer, not inside it: @react-pdf v4 drops render-prop text in a maxHeight parent.
  const PageNo = () => (
    <Text
      style={[s.footerText, s.pageNo]}
      fixed
      render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
    />
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
      <FrontCover
        mark={mark}
        series="Chancellery Dossier · Applied Case Engagement"
        kicker={`Section ${c.ref} · ${c.region} · ${c.era}`}
        title={c.title}
        subtitle={`Primary pillar: ${c.pillar}`}
        rows={[
          ["Document reference", docRef],
          ["Doctrine section", c.ref],
          ["Prepared by", AUTHOR_NAME],
          ["Classification", "Unrestricted · Public record"],
        ]}
        notice="Registered and protected under statutory copyright law. All statutory rights reserved."
      />

      {/* ---------------- BODY ---------------- */}
      <Page size="A4" style={s.page}>
        <Masthead />
        <Footer />
        <PageNo />

        <Text style={s.docTitle}>{c.title}</Text>
        <Text style={s.docSub}>
          Section {c.ref} · {c.region} · {c.era} · Primary pillar: {c.pillar}
        </Text>

        <Text style={s.h3}>Continuum Scorecard</Text>
        <Scorecard scores={c.scores} />

        <Rows
          rows={[
            { label: "Document reference", value: docRef },
            { label: "Prepared by", value: AUTHOR_NAME },
            { label: "Theater", value: c.region },
            { label: "Period of record", value: c.era },
            { label: "Canonical record", value: url },
          ]}
        />

        <View style={s.contents} wrap={false}>
          <Text style={s.contentsLabel}>Compartments of this dossier</Text>
          {[
            ["I.", "Executive Overview"],
            ["II.", "The Four-Bond Continuum Matrix"],
            ["III.", "Doctrinal Findings"],
            ["IV.", "Applied Protocols for Envoys"],
            ["V.", "Sources of Record"],
          ].map(([n, t]) => (
            <View key={n} style={s.contentsRow}>
              <Text style={s.contentsNum}>{n}</Text>
              <Text>{t}</Text>
            </View>
          ))}
        </View>

        <Text style={s.h2} minPresenceAhead={36}>I. Executive Overview</Text>
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

        <Text style={s.h2} minPresenceAhead={60}>II. The Four-Bond Continuum Matrix</Text>
        <Text style={s.body}>
          The Continuum Scorecard on the opening page of this dossier records each domain score. The rationale
          for each reading follows.
        </Text>
        <Text style={s.h3}>Diagnostic rationale by domain</Text>
        <View style={s.table}>
          {DOMAINS.map((d, i) => (
            <View key={d} style={s.row} wrap={false}>
              <Text style={s.rationaleName}>{d}</Text>
              <Text style={[s.td, s.rationaleText]}>{c.rationales[i]}</Text>
            </View>
          ))}
        </View>
        <Text style={s.note}>
          Scores run 1 to 5 within each bond domain. Higher values indicate stronger observed bond
          integrity at the period of record. Scores are diagnostic instruments for deliberation, not
          certifications of compliance. A bond holds the canonical {VIABLE_FLOOR.toFixed(1)} viable floor only when it
          scores above it; at or below the floor it is marked as acute strain.
        </Text>

        <View style={s.quote} wrap={false}>
          <Text style={s.quoteText}>{c.quote}</Text>
          <Text style={s.quoteCite}>
            {c.shortTitle}, Section {c.ref}
          </Text>
        </View>

        <Text style={s.h2} minPresenceAhead={36}>III. Doctrinal Findings</Text>
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

        <Text style={s.h2} minPresenceAhead={36}>IV. Applied Protocols for Envoys</Text>
        <Text style={s.h3}>Handbook § 12 · What a Vinculum diplomat does</Text>
        <Text style={s.body}>{c.practice}</Text>
        <Text style={s.h3}>Transferable directive</Text>
        <Text style={s.body}>{c.takeaway}</Text>

        <Text style={s.h2} minPresenceAhead={36}>V. Sources of Record</Text>
        {c.sources.map((src, i) => (
          <View key={i} style={s.listItem}>
            <Text style={s.listNum}>{String(i + 1).padStart(2, "0")}</Text>
            <Text style={s.source}>{src}</Text>
          </View>
        ))}
        <Text style={s.endMark} wrap={false}>End of dossier · {docRef}</Text>
      </Page>

      <BackCover
        mark={mark}
        lead={[
          `This dossier is drawn from Vinculum Security: The Fortified Doctrine, Expanded Version, Final Edition, Section ${c.ref}, and Vinculum Diplomacy: The Practitioner Handbook, Final Edition, Section 12. Both works are by ${AUTHOR_NAME}.`,
        ]}
        rows={[
          ["Document reference", docRef],
          ["Canonical record", url],
          ["Licence", "CC BY-NC-SA 4.0"],
          ["Classification", "Unrestricted · Public record"],
        ]}
        notice={`${AUTHOR_NAME}. An original work registered and protected under statutory copyright law and international conventions. Any use beyond the licence stated above requires the author’s written permission. All statutory rights reserved.`}
      />
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
