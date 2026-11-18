import { Document, Page, Text, View, StyleSheet, Font, Svg, Polygon, Line, pdf } from "@react-pdf/renderer";
import serifRegular from "@/assets/fonts/CormorantGaramond-Regular.ttf";
import serifSemiBold from "@/assets/fonts/CormorantGaramond-SemiBold.ttf";
import serifItalic from "@/assets/fonts/CormorantGaramond-Italic.ttf";
import sansRegular from "@/assets/fonts/Inter-Regular.ttf";
import sansSemiBold from "@/assets/fonts/Inter-SemiBold.ttf";
import { Neatline, NEAT_BRASS, NEAT_NAVY } from "@/components/pdf/Neatline";
import { digestLines, radarPoints, type ExecSummary } from "./executiveBrief";

/**
 * [mission-slug]-briefing.pdf: the 1-Page Executive Action Summary in the Vinculum
 * institutional PDF style (classical double neatline), generated in the browser.
 */

Font.register({ family: "ExecSerif", fonts: [{ src: serifRegular, fontWeight: 400 }, { src: serifSemiBold, fontWeight: 600 }, { src: serifItalic, fontWeight: 400, fontStyle: "italic" }] });
Font.register({ family: "ExecSans", fonts: [{ src: sansRegular, fontWeight: 400 }, { src: sansSemiBold, fontWeight: 600 }] });
Font.registerHyphenationCallback((w) => [w]);

const INK = "#2B2B2B";
const MUTED = "#5F6470";
const RULE = "#C9CBD1";
const RED = "#9B3B2E";
const GREEN = "#2F6B4F";

const s = StyleSheet.create({
  page: { padding: 36, fontFamily: "ExecSans", fontSize: 7.5, color: INK },
  inner: { padding: 14 },
  band: { backgroundColor: NEAT_NAVY, marginHorizontal: -14, marginTop: -14, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 9, borderBottomWidth: 2, borderBottomColor: NEAT_BRASS },
  eyebrow: { fontSize: 6, letterSpacing: 1.6, color: NEAT_BRASS, textTransform: "uppercase" },
  title: { fontFamily: "ExecSerif", fontSize: 19, color: "#FFFFFF", marginTop: 2 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 6, borderBottomWidth: 0.6, borderBottomColor: NEAT_BRASS, paddingBottom: 6 },
  meta: { width: "33%", marginBottom: 3 },
  metaK: { fontSize: 6.4, letterSpacing: 1.2, color: MUTED, textTransform: "uppercase" },
  metaV: { fontSize: 7.5 },
  cols: { flexDirection: "row", marginTop: 10 },
  left: { width: "40%", paddingRight: 10 },
  right: { width: "60%", paddingLeft: 10, borderLeftWidth: 0.4, borderLeftColor: RULE },
  h: { fontSize: 6.4, letterSpacing: 1.4, color: NEAT_NAVY, textTransform: "uppercase", fontWeight: 600, marginBottom: 4, marginTop: 8, borderLeftWidth: 2, borderLeftColor: NEAT_BRASS, paddingLeft: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 0.3, borderBottomColor: RULE, paddingVertical: 2 },
  big: { fontFamily: "ExecSerif", fontSize: 16, color: NEAT_NAVY },
  cell: { fontSize: 7 },
  badge: { fontSize: 6.4, fontWeight: 600, letterSpacing: 0.8 },
  foot: { marginTop: 10, borderTopWidth: 0.6, borderTopColor: NEAT_BRASS, paddingTop: 5, fontSize: 6.4, color: MUTED },
});

function Radar({ scores }: { scores: (number | null)[] }) {
  const size = 132;
  const pts = radarPoints(scores, size);
  const ring = (t: number) => radarPoints([1 + 4 * t, 1 + 4 * t, 1 + 4 * t, 1 + 4 * t], size).map((p) => `${p.x},${p.y}`).join(" ");
  const axes = radarPoints([5, 5, 5, 5], size);
  return (
    <Svg width={size} height={size}>
      {[0.25, 0.5, 0.75, 1].map((t) => <Polygon key={t} points={ring(t)} stroke={RULE} strokeWidth={0.5} fill="none" />)}
      {axes.map((p, i) => <Line key={i} x1={size / 2} y1={size / 2} x2={p.x} y2={p.y} stroke={RULE} strokeWidth={0.5} />)}
      <Polygon points={pts.map((p) => `${p.x},${p.y}`).join(" ")} stroke={NEAT_NAVY} strokeWidth={1} fill={NEAT_BRASS} fillOpacity={0.35} />
    </Svg>
  );
}

function BriefingDoc({ m }: { m: ExecSummary }) {
  const meta: [string, string][] = [
    ["Sovereign parties", m.masthead.parties],
    ["Active theatre", m.masthead.theatre],
    ["Accredited envoy", m.masthead.envoy],
    ["Assessment (UTC)", m.masthead.assessedUtc],
    ["Handling", m.masthead.classification],
    ["Seal stamp", m.masthead.seal],
  ];
  return (
    <Document title={`${m.masthead.title} · Executive Action Summary`} author="Vinculum Chancellery">
      <Page size="A4" orientation="portrait" style={s.page}>
        <Neatline inner={s.inner}>
          <View style={s.band}>
            <Text style={s.eyebrow}>Vinculum Chancellery · Executive Action Summary</Text>
            <Text style={s.title}>{m.masthead.title}</Text>
          </View>
          <View style={s.metaRow}>
            {meta.map(([k, v]) => (
              <View key={k} style={s.meta}>
                <Text style={s.metaK}>{k}</Text>
                {k === "Seal stamp" && /^SHA-256 [0-9a-f]{64}$/i.test(v) ? (
                  <View><Text style={s.metaV}>SHA-256</Text>{digestLines(v.slice(8)).map((line, index) => <Text key={index} style={s.metaV}>{line}</Text>)}</View>
                ) : <Text style={s.metaV}>{v}</Text>}
              </View>
            ))}
          </View>
          <View style={s.cols}>
            <View style={s.left}>
              <Text style={s.h}>Bond ratings (1.0 to 5.0)</Text>
              <Radar scores={m.bonds.map((b) => b.score)} />
              {m.bonds.map((b) => (
                <View key={b.name} style={s.row}>
                  <Text style={s.cell}>{b.name}</Text>
                  <Text style={s.cell}>{b.score === null ? "—" : `${b.score.toFixed(1)} · ${b.band}`}</Text>
                </View>
              ))}
              <Text style={s.h}>Indices</Text>
              <View style={s.row}><Text style={s.cell}>Rupture index R</Text><Text style={s.big}>{m.rupture === null ? "—" : `${m.rupture}%`}</Text></View>
              <View style={s.row}><Text style={s.cell}>Band</Text><Text style={s.cell}>{m.ruptureBand}</Text></View>
              <View style={s.row}><Text style={s.cell}>Exposure U</Text><Text style={s.cell}>{m.exposure === null ? "—" : `${m.exposure} pts`}</Text></View>
              <View style={s.row}><Text style={s.cell}>Mean bond</Text><Text style={s.cell}>{m.meanBond === null ? "—" : m.meanBond.toFixed(2)}</Text></View>
              <View style={s.row}><Text style={s.cell}>Succession durability</Text><Text style={s.cell}>{m.survival === null ? "—" : `${m.survival}%`}</Text></View>
            </View>
            <View style={s.right}>
              <Text style={s.h}>Active inscribed shocks</Text>
              {m.shocks.length ? m.shocks.slice(0, 10).map((x, i) => <Text key={i} style={s.cell}>{`${i + 1}. ${x}`}</Text>) : <Text style={s.cell}>None active.</Text>}
              {m.shocks.length > 10 && <Text style={s.cell}>{`+ ${m.shocks.length - 10} more on the manifest.`}</Text>}
              <Text style={s.h}>Covenants · open redline flags {m.redlineFlags}</Text>
              {m.covenants.length ? m.covenants.slice(0, 8).map((c, i) => <Text key={i} style={s.cell}>{`${i + 1}. ${c.text}${c.contested ? "  [CONTESTED]" : ""}`}</Text>) : <Text style={s.cell}>No covenants of record.</Text>}
              {m.covenants.length > 8 && <Text style={s.cell}>{`+ ${m.covenants.length - 8} more on the manifest.`}</Text>}
              <Text style={s.h}>{`Evidentiary readiness gates · ${m.gatesCleared} of ${m.gates.length} cleared`}</Text>
              {m.gates.map((g) => (
                <View key={g.name} style={s.row}>
                  <Text style={s.cell}>{g.name}</Text>
                  <Text style={[s.badge, { color: g.cleared ? GREEN : RED }]}>{g.cleared ? "CLEARED" : "NOT CLEARED"}</Text>
                </View>
              ))}
            </View>
          </View>
          <Text style={s.foot}>{m.notice}</Text>
        </Neatline>
      </Page>
    </Document>
  );
}

export async function buildExecutiveBriefingPdf(m: ExecSummary): Promise<Blob> {
  return pdf(<BriefingDoc m={m} />).toBlob();
}
