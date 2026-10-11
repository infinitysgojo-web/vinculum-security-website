import { Document, Page, Text, View, Image, StyleSheet, Font, pdf } from "@react-pdf/renderer";
import { AUTHOR_NAME, SITE_URL } from "@/lib/seo-entities";
import mark from "@/assets/vinculum-mark.png";
import serifRegular from "@/assets/fonts/CormorantGaramond-Regular.ttf";
import serifItalic from "@/assets/fonts/CormorantGaramond-Italic.ttf";
import serifSemiBold from "@/assets/fonts/CormorantGaramond-SemiBold.ttf";
import sansRegular from "@/assets/fonts/Inter-Regular.ttf";
import sansSemiBold from "@/assets/fonts/Inter-SemiBold.ttf";
import { MASTER_DEPOSITION, type DepositionVolume } from "@/content/masterDepositionData";
import { sha256 } from "./integrity";

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
const INK = "#222222";
const BRASS = "#B38235";
const RULE = "#C5C8D0";
const MUTED = "#555A66";
const BG_LIGHT = "#FAF9F6";

const styles = StyleSheet.create({
  coverPage: { fontFamily: "Cormorant", color: INK, backgroundColor: "#FFFFFF" },
  coverFrame: {
    margin: 28,
    borderWidth: 1.2,
    borderColor: NAVY,
    flexGrow: 1,
    paddingTop: 48,
    paddingBottom: 28,
    paddingHorizontal: 38,
    justifyContent: "space-between",
  },
  center: { alignItems: "center" },
  emblem: { width: 62, height: 62, objectFit: "contain", marginBottom: 16 },
  emblemSm: { width: 40, height: 40, objectFit: "contain", marginBottom: 12 },
  wordmark: { fontSize: 22, letterSpacing: 5.5, color: NAVY, textTransform: "uppercase" },
  motto: { fontSize: 10, fontStyle: "italic", color: MUTED, marginTop: 7 },
  hairline: { width: 170, borderBottomWidth: 0.6, borderBottomColor: BRASS, marginVertical: 18 },
  seriesBadge: {
    fontFamily: "InterDoc",
    fontSize: 7,
    letterSpacing: 2.4,
    color: MUTED,
    textTransform: "uppercase",
    textAlign: "center",
  },
  docTitle: {
    fontSize: 22,
    letterSpacing: 1.8,
    color: NAVY,
    textTransform: "uppercase",
    textAlign: "center",
    marginTop: 14,
    lineHeight: 1.25,
  },
  docSub: { fontSize: 11, color: MUTED, textAlign: "center", marginTop: 10, fontStyle: "italic" },
  metadataLedger: { borderTopWidth: 0.8, borderTopColor: RULE, paddingTop: 14 },
  ledgerRow: { flexDirection: "row", marginBottom: 4.5 },
  ledgerKey: {
    fontFamily: "InterDoc",
    fontSize: 6.8,
    letterSpacing: 1.6,
    color: MUTED,
    textTransform: "uppercase",
    width: 140,
  },
  ledgerVal: { fontSize: 9.5, color: INK, flex: 1 },

  // Content Pages
  bodyPage: {
    paddingTop: 82,
    paddingBottom: 62,
    paddingHorizontal: 56,
    fontFamily: "Cormorant",
    fontSize: 10.5,
    lineHeight: 1.55,
    color: INK,
    backgroundColor: "#FFFFFF",
  },
  runHead: {
    position: "absolute",
    top: 36,
    left: 56,
    right: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.6,
    borderBottomColor: RULE,
    paddingBottom: 6,
  },
  runFoot: {
    position: "absolute",
    top: 785,
    left: 56,
    right: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.6,
    borderTopColor: RULE,
    paddingTop: 6,
  },
  runText: {
    fontFamily: "InterDoc",
    fontSize: 6.2,
    letterSpacing: 1.5,
    color: MUTED,
    textTransform: "uppercase",
  },
  volumeHeading: {
    fontFamily: "InterDoc",
    fontSize: 8.5,
    fontWeight: 600,
    letterSpacing: 2.2,
    color: BRASS,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  volumeTitle: {
    fontSize: 18,
    letterSpacing: 1.2,
    color: NAVY,
    textTransform: "uppercase",
    marginBottom: 16,
    lineHeight: 1.25,
  },
  sectionHeading: {
    fontFamily: "InterDoc",
    fontSize: 7.8,
    fontWeight: 600,
    letterSpacing: 1.4,
    color: NAVY,
    textTransform: "uppercase",
    marginTop: 14,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.5,
    color: INK,
    marginBottom: 6,
    textAlign: "justify",
  },
  dividerGap: { height: 12 },
  backLead: { fontSize: 9.5, color: MUTED, textAlign: "center", lineHeight: 1.6, marginBottom: 8 },
});

export async function generateMasterDepositionPdf(theatreName = "Global Sovereign Archive") {
  const issued = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  const rawTextForHash = MASTER_DEPOSITION.map((v) => v.sections.map((s) => s.body.join("\n")).join("\n")).join("\n");
  const seal = await sha256(rawTextForHash);
  const shortSeal = seal.slice(0, 16).toUpperCase();

  const doc = (
    <Document
      title="Vinculum Security · Master Architectural & Operational Deposition"
      author={AUTHOR_NAME}
      subject="The 50-Page Master Chancellery Monograph on Deterministic Relational Law"
    >
      {/* 1. FRONT COVER SHEET */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverFrame}>
          <View style={styles.center}>
            <Image src={mark} style={styles.emblem} />
            <Text style={styles.wordmark}>Vinculum Security</Text>
            <Text style={styles.motto}>Pro Omni Humanitate</Text>
            <View style={styles.hairline} />
            <Text style={styles.seriesBadge}>Restricted Chancellery Deposition · Master Monograph</Text>
            <Text style={styles.docTitle}>Architectural, Mathematical & Operational Deposition</Text>
            <Text style={styles.docSub}>A Doctrine of Relational Security and Deterministic Relational Law</Text>
          </View>
          <View style={styles.metadataLedger}>
            {[
              ["Document Reference", `VS-DEPOSITION-${new Date().getFullYear()}`],
              ["Originator & Author", AUTHOR_NAME],
              ["Jurisdictional Seat", "Nairobi, Kenya"],
              ["Mission Theatre", theatreName],
              ["Date of Sealing", issued],
              ["SHA-256 State Seal", shortSeal],
              ["Statutory Status", "Statutorily Registered & Protected Intellectual Property"],
              ["Classification", "Restricted Chancellery Deposition (Academic & Diplomatic)"],
            ].map(([k, v]) => (
              <View key={k} style={styles.ledgerRow}>
                <Text style={styles.ledgerKey}>{k}</Text>
                <Text style={styles.ledgerVal}>{v}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>

      {/* 2. BODY VOLUMES */}
      {MASTER_DEPOSITION.map((vol, vIdx) => (
        <Page key={vol.volume} size="A4" style={styles.bodyPage}>
          <View style={styles.runHead} fixed>
            <Text style={styles.runText}>Vinculum Security · {vol.eyebrow}</Text>
            <Text style={styles.runText}>RESTRICTED CHANCELLERY DEPOSITION</Text>
          </View>
          <View style={styles.runFoot} fixed>
            <Text style={styles.runText}>SEAL: {shortSeal}</Text>
            <Text style={styles.runText} render={({ pageNumber }) => `Page ${pageNumber}`} />
          </View>

          <Text style={styles.volumeHeading}>{vol.volume}</Text>
          <Text style={styles.volumeTitle}>{vol.title}</Text>

          {vol.sections.map((sec, sIdx) => (
            <View key={sIdx} wrap={false} style={{ marginBottom: 10 }}>
              <Text style={styles.sectionHeading}>{sec.heading}</Text>
              {sec.body.map((p, pIdx) => (
                <Text key={pIdx} style={styles.paragraph}>
                  {p}
                </Text>
              ))}
            </View>
          ))}
        </Page>
      ))}

      {/* 3. STATUTORY BACK COVER */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverFrame}>
          <View />
          <View style={styles.center}>
            <Image src={mark} style={styles.emblemSm} />
            <Text style={[styles.wordmark, { fontSize: 16, letterSpacing: 4.5 }]}>Vinculum Security</Text>
            <Text style={styles.motto}>Pro Omni Humanitate</Text>
            <View style={styles.hairline} />
            <Text style={styles.backLead}>
              Compiled under the Doctrine of Relational Security and Deterministic Relational Law. Every mathematical
              reading, stage-gate, and proof is computed strictly client-side under sovereign air-gapped guarantees.
            </Text>
            <Text style={styles.backLead}>
              {"\u00A9"} {new Date().getFullYear()} {AUTHOR_NAME}. All statutory rights reserved. Protected under
              statutory copyright law, the Berne Convention, and international treaties.
            </Text>
          </View>
          <View style={styles.metadataLedger}>
            <View style={styles.ledgerRow}>
              <Text style={styles.ledgerKey}>Institutional Record</Text>
              <Text style={styles.ledgerVal}>{SITE_URL}</Text>
            </View>
            <View style={styles.ledgerRow}>
              <Text style={styles.ledgerKey}>Verification Seal</Text>
              <Text style={styles.ledgerVal}>{seal}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );

  return pdf(doc).toBlob();
}
