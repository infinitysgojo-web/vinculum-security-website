import type { ReactNode } from "react";
import { Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";

/**
 * Bound-volume covers shared by every dossier: a full-bleed navy board with a brass spine band,
 * a gilt double frame with corner ornaments, and a parchment ledger panel. Requires the
 * "Cormorant" and "InterDoc" font families registered by the calling document.
 */
const NAVY = "#14284A";
const NAVY_DEEP = "#0E1D37";
const BRASS = "#D4A24C";
const BRASS_SOFT = "#B8894A";
const PARCHMENT = "#F6EFE2";
const INK = "#2B2B2B";
const MUTED = "#5F6470";

const c = StyleSheet.create({
  page: { backgroundColor: NAVY, fontFamily: "Cormorant", color: PARCHMENT, flexDirection: "row" },
  spine: { width: 30, backgroundColor: NAVY_DEEP, borderRightWidth: 1.2, borderRightColor: BRASS, alignItems: "center", justifyContent: "center" },
  spineRule: { width: 0.6, flexGrow: 1, backgroundColor: BRASS_SOFT, marginVertical: 40 },
  board: { flexGrow: 1, padding: 22 },
  frameA: { flexGrow: 1, borderWidth: 1.4, borderColor: BRASS, padding: 4 },
  frameB: { flexGrow: 1, borderWidth: 0.4, borderColor: BRASS, paddingVertical: 40, paddingHorizontal: 34, justifyContent: "space-between", position: "relative" },
  corner: { position: "absolute", width: 14, height: 14, borderColor: BRASS },
  center: { alignItems: "center" },
  series: { fontFamily: "InterDoc", fontSize: 6.8, letterSpacing: 3, color: BRASS, textTransform: "uppercase", textAlign: "center" },
  ring: { width: 92, height: 92, borderRadius: 46, borderWidth: 1, borderColor: BRASS, alignItems: "center", justifyContent: "center", marginTop: 26, marginBottom: 18, backgroundColor: PARCHMENT },
  ringSm: { width: 64, height: 64, borderRadius: 32, borderWidth: 1, borderColor: BRASS, alignItems: "center", justifyContent: "center", marginBottom: 14, backgroundColor: PARCHMENT },
  emblem: { width: 62, height: 62, objectFit: "contain" },
  emblemSm: { width: 42, height: 42, objectFit: "contain" },
  wordmark: { fontSize: 24, letterSpacing: 7, color: PARCHMENT, textTransform: "uppercase" },
  motto: { fontSize: 11, fontStyle: "italic", color: BRASS, marginTop: 6 },
  ornament: { flexDirection: "row", alignItems: "center", marginVertical: 16 },
  ornLine: { width: 70, height: 0.6, backgroundColor: BRASS },
  ornDot: { width: 5, height: 5, transform: "rotate(45deg)", backgroundColor: BRASS, marginHorizontal: 8 },
  kicker: { fontFamily: "InterDoc", fontSize: 7, letterSpacing: 2.8, color: BRASS, textTransform: "uppercase", textAlign: "center", marginBottom: 14 },
  titleWrap: { borderTopWidth: 0.8, borderBottomWidth: 0.8, borderColor: BRASS, paddingVertical: 20, paddingHorizontal: 6, width: "100%" },
  title: { fontSize: 28, lineHeight: 1.18, letterSpacing: 1.5, color: PARCHMENT, textTransform: "uppercase", textAlign: "center" },
  subtitle: { fontSize: 12, fontStyle: "italic", color: PARCHMENT, opacity: 0.85, textAlign: "center", marginTop: 14 },
  panel: { backgroundColor: PARCHMENT, borderWidth: 0.6, borderColor: BRASS, paddingVertical: 12, paddingHorizontal: 14, color: INK },
  row: { flexDirection: "row", marginBottom: 3.5 },
  key: { fontFamily: "InterDoc", fontSize: 6.2, letterSpacing: 1.6, color: MUTED, textTransform: "uppercase", width: "32%", paddingTop: 1.5 },
  val: { fontSize: 9.6, color: INK, width: "68%", lineHeight: 1.3 },
  notice: { width: "100%", paddingRight: 16, fontSize: 7.6, fontStyle: "italic", color: MUTED, marginTop: 8, paddingTop: 7, borderTopWidth: 0.5, borderTopColor: BRASS_SOFT, lineHeight: 1.35 },
  lead: { fontSize: 11, lineHeight: 1.55, color: PARCHMENT, textAlign: "center", marginTop: 10, paddingHorizontal: 18 },
});

function Corners() {
  const w = 1.2;
  return (
    <>
      <View style={[c.corner, { top: 6, left: 6, borderTopWidth: w, borderLeftWidth: w }]} />
      <View style={[c.corner, { top: 6, right: 6, borderTopWidth: w, borderRightWidth: w }]} />
      <View style={[c.corner, { bottom: 6, left: 6, borderBottomWidth: w, borderLeftWidth: w }]} />
      <View style={[c.corner, { bottom: 6, right: 6, borderBottomWidth: w, borderRightWidth: w }]} />
    </>
  );
}

function Ornament() {
  return (
    <View style={c.ornament}>
      <View style={c.ornLine} />
      <View style={c.ornDot} />
      <View style={c.ornLine} />
    </View>
  );
}

function Board({ children }: { children: ReactNode }) {
  return (
    <Page size="A4" style={c.page}>
      <View style={c.spine}>
        <View style={c.spineRule} />
      </View>
      <View style={c.board}>
        <View style={c.frameA}>
          <View style={c.frameB}>
            <Corners />
            {children}
          </View>
        </View>
      </View>
    </Page>
  );
}

export type LedgerRow = [string, string];

function Ledger({ rows, notice }: { rows: LedgerRow[]; notice?: string }) {
  return (
    <View style={c.panel} wrap={false}>
      {rows.map(([k, v]) => (
        <View key={k} style={c.row}>
          <Text style={c.key}>{k}</Text>
          <Text style={c.val}>{v}</Text>
        </View>
      ))}
      {notice && <Text style={c.notice}>{notice}</Text>}
    </View>
  );
}

export function FrontCover({ mark, series, kicker, title, subtitle, rows, notice }: {
  mark: string; series: string; kicker: string; title: string; subtitle?: string; rows: LedgerRow[]; notice?: string;
}) {
  return (
    <Board>
      <View style={c.center}>
        <Text style={c.series}>{series}</Text>
        <View style={c.ring}><Image src={mark} style={c.emblem} /></View>
        <Text style={c.wordmark}>Vinculum Security</Text>
        <Text style={c.motto}>Pro Omni Humanitate</Text>
        <Ornament />
      </View>
      <View style={c.center}>
        <Text style={c.kicker}>{kicker}</Text>
        <View style={c.titleWrap}><Text style={c.title}>{title}</Text></View>
        {subtitle && <Text style={c.subtitle}>{subtitle}</Text>}
      </View>
      <Ledger rows={rows} notice={notice} />
    </Board>
  );
}

export function BackCover({ mark, lead, rows, notice, children }: {
  mark: string; lead: string[]; rows: LedgerRow[]; notice?: string; children?: ReactNode;
}) {
  return (
    <Board>
      <View />
      <View style={c.center}>
        <View style={c.ringSm}><Image src={mark} style={c.emblemSm} /></View>
        <Text style={[c.wordmark, { fontSize: 17, letterSpacing: 5 }]}>Vinculum Security</Text>
        <Text style={c.motto}>Pro Omni Humanitate</Text>
        <Ornament />
        {lead.map((p, i) => <Text key={i} style={c.lead}>{p}</Text>)}
      </View>
      <View>
        <Ledger rows={rows} notice={notice} />
        {children && <View style={{ marginTop: 10 }}>{children}</View>}
      </View>
    </Board>
  );
}
