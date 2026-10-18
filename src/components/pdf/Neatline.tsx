import type { ComponentProps, ReactNode } from "react";
import { View, StyleSheet } from "@react-pdf/renderer";

type Style = Exclude<ComponentProps<typeof View>["style"], undefined | unknown[]>;

/**
 * Classical diplomatic double neatline for @react-pdf documents: a navy outer rule,
 * a 3.5pt breathing margin and an antique-brass inner hairline, with hairline brass
 * crosshair ticks (+) at the four internal corners.
 */
export const NEAT_NAVY = "#1B3A6B";
export const NEAT_BRASS = "#D4A24C";

const TICK = 9;
const INSET = 4;

const n = StyleSheet.create({
  outer: { borderWidth: 0.85, borderColor: NEAT_NAVY, padding: 3.5, flexGrow: 1 },
  inner: { borderWidth: 0.35, borderColor: NEAT_BRASS, flexGrow: 1, position: "relative" },
  tick: { position: "absolute", width: TICK, height: TICK },
  h: { position: "absolute", left: 0, top: (TICK - 0.35) / 2, width: TICK, height: 0.35, backgroundColor: NEAT_BRASS },
  v: { position: "absolute", top: 0, left: (TICK - 0.35) / 2, width: 0.35, height: TICK, backgroundColor: NEAT_BRASS },
});

function Tick({ at }: { at: Style }) {
  return (
    <View style={[n.tick, at]}>
      <View style={n.h} />
      <View style={n.v} />
    </View>
  );
}

export function Neatline({ outer, inner, children }: { outer?: Style; inner?: Style; children: ReactNode }) {
  return (
    <View style={outer ? [n.outer, outer] : n.outer}>
      <View style={inner ? [n.inner, inner] : n.inner}>
        <Tick at={{ top: INSET, left: INSET }} />
        <Tick at={{ top: INSET, right: INSET }} />
        <Tick at={{ bottom: INSET, left: INSET }} />
        <Tick at={{ bottom: INSET, right: INSET }} />
        {children}
      </View>
    </View>
  );
}
