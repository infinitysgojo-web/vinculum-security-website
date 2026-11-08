import { useState, type ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";
import SovereignCustomDrawer from "./SovereignCustomDrawer";
import { Button } from "@/components/ui/button";
import {
  BOND_NAMES,
  ENFORCEMENT_MECHANISMS,
  clampScore,
  useEngine,
  type BondVector,
  type CustomCovenant,
  type CustomGate,
  type CustomNote,
  type CustomParty,
  type CustomPhrase,
  type CustomPrecedent,
  type CustomShock,
  type CustomTrack,
  type CustomTrap,
  type Signals,
  type SpoilerRisk,
} from "./engine";

/**
 * Sovereign Custom Mode. Every desk carries one inscription tray. Whatever is inscribed
 * here is written straight onto the MissionEngine bus, so it reaches every downstream
 * desk, the registry digest and the transmittal manifest. Nothing leaves the browser.
 */

const field = "w-full min-w-0 border border-input bg-background px-3 py-2.5 text-sm min-h-11";
const lab = "mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-primary/70";
const btn =
  "inline-flex min-h-11 items-center justify-center gap-2 border border-brass/50 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:border-accent hover:text-accent disabled:opacity-40";
const uid = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2, 10));

type ListKey =
  | "customParties" | "customTraps" | "customShocks" | "customCovenants" | "customGates"
  | "customTracks" | "customPrecedents" | "customPhrases" | "customNotes";

/** Read and write one inscription list on the bus. */
function useList<T>(key: ListKey | "customRules") {
  const { signals, publish } = useEngine();
  const list = ((signals as Record<string, unknown>)[key] as T[] | undefined) ?? [];
  const set = (next: T[]) => publish(`inscription:${key}`, { [key]: next.length ? next : undefined } as Signals);
  return [list, set] as const;
}

function Row({ children, onRemove, label }: { children: ReactNode; onRemove: () => void; label: string }) {
  return (
    <li className="flex min-w-0 items-start justify-between gap-3 border border-border bg-background p-3">
      <div className="min-w-0 flex-1 text-sm leading-relaxed text-foreground/85 [overflow-wrap:anywhere]">{children}</div>
      <button type="button" onClick={onRemove} className="shrink-0 p-2 text-muted-foreground hover:text-destructive" aria-label={`Remove ${label}`}>
        <Trash2 size={14} aria-hidden />
      </button>
    </li>
  );
}

const Num = ({ id, value, onChange, min, max, step = 0.1, labelText }: { id: string; value: number; onChange: (n: number) => void; min: number; max: number; step?: number; labelText: string }) => (
  <label htmlFor={id} className="block min-w-0">
    <span className={lab}>{labelText}</span>
    <input id={id} type="number" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className={field} />
  </label>
);

/* ------------------------------------------------------------------ */
/* Forms                                                               */
/* ------------------------------------------------------------------ */

function RulesForm({ onApplyVector }: { onApplyVector?: (b: BondVector) => void }) {
  const [rules, setRules] = useList<string>("customRules");
  const [notes, setNotes] = useList<CustomNote>("customNotes");
  const [rule, setRule] = useState("");
  const [vec, setVec] = useState<[number, number, number, number]>([3, 3, 3, 3]);
  const [why, setWhy] = useState("");
  const vecNotes = notes.filter((n) => n.desk === "diagnostics");
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 [&>*]:min-w-0">
      <div className="space-y-3">
        <p className={lab}>Sovereign boundary rule</p>
        <textarea value={rule} onChange={(e) => setRule(e.target.value)} rows={2} className={field} placeholder="Clan elders retain sole jurisdiction over grazing disputes" aria-label="Sovereign boundary rule" />
        <button type="button" className={btn} disabled={!rule.trim()} onClick={() => { setRules([...rules, rule.trim()]); setRule(""); }}>
          <Plus size={13} aria-hidden /> Inscribe rule
        </button>
        {rules.length > 0 && (
          <ul className="space-y-2">
            {rules.map((r, i) => (
              <Row key={`${r}-${i}`} label="rule" onRemove={() => setRules(rules.filter((_, j) => j !== i))}>{r}</Row>
            ))}
          </ul>
        )}
      </div>
      {onApplyVector && (
        <div className="space-y-3">
          <p className={lab}>Custom vector preset</p>
          <div className="grid grid-cols-2 gap-2">
            {BOND_NAMES.map((n, i) => (
              <Num key={n} id={`cv-${i}`} labelText={n.replace("-Relational", "")} min={1} max={5} value={vec[i]} onChange={(x) => setVec((v) => v.map((y, j) => (j === i ? clampScore(x) : y)) as [number, number, number, number])} />
            ))}
          </div>
          <input value={why} onChange={(e) => setWhy(e.target.value)} className={field} placeholder="Rationale for this calibration" aria-label="Vector rationale" />
          <button
            type="button"
            className={btn}
            onClick={() => {
              onApplyVector({ interpersonal: vec[0], communal: vec[1], intergenerational: vec[2], institutional: vec[3] });
              setNotes([...notes.filter((n) => n.desk !== "diagnostics"), { id: uid(), desk: "diagnostics", kind: "Custom vector", title: `(${vec.map((x) => x.toFixed(1)).join(", ")})`, body: why.trim() }]);
            }}
          >
            Apply vector to the mission
          </button>
          {vecNotes.map((n) => (
            <p key={n.id} className="font-mono text-[11px] text-muted-foreground">Applied {n.title}{n.body ? ` · ${n.body}` : ""}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function PartyForm() {
  const [list, setList] = useList<CustomParty>("customParties");
  const [d, setD] = useState<Omit<CustomParty, "id">>({ name: "", constituency: "", vulnerability: 3, leverage: 3, spoilerRisk: "Low", vetoPower: false });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 [&>*]:min-w-0">
        <label className="block"><span className={lab}>Party name</span><input className={field} value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} placeholder="Highland pastoralist council" /></label>
        <label className="block"><span className={lab}>Constituency or social base</span><input className={field} value={d.constituency} onChange={(e) => setD({ ...d, constituency: e.target.value })} placeholder="Seasonal herders, three clans" /></label>
        <Num id="cp-lev" labelText="Leverage (1 to 5)" min={1} max={5} value={d.leverage} onChange={(x) => setD({ ...d, leverage: clampScore(x) })} />
        <Num id="cp-vul" labelText="Vulnerability (1 to 5)" min={1} max={5} value={d.vulnerability} onChange={(x) => setD({ ...d, vulnerability: clampScore(x) })} />
        <label className="block"><span className={lab}>Spoiler risk</span>
          <select className={field} value={d.spoilerRisk} onChange={(e) => setD({ ...d, spoilerRisk: e.target.value as SpoilerRisk })}>
            {(["Low", "Medium", "High", "Critical"] as const).map((r) => <option key={r}>{r}</option>)}
          </select>
        </label>
        <label className="flex min-h-11 items-center gap-3 self-end text-xs text-foreground/85">
          <input type="checkbox" checked={d.vetoPower} onChange={(e) => setD({ ...d, vetoPower: e.target.checked })} className="accent-[hsl(var(--accent))]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">Holds a veto</span>
        </label>
      </div>
      <button type="button" className={btn} disabled={!d.name.trim()} onClick={() => { setList([...list, { ...d, name: d.name.trim(), id: uid() }]); setD({ ...d, name: "", constituency: "" }); }}>
        <Plus size={13} aria-hidden /> Inscribe party
      </button>
      {list.length > 0 && (
        <ul className="space-y-2">
          {list.map((p) => (
            <Row key={p.id} label={p.name} onRemove={() => setList(list.filter((x) => x.id !== p.id))}>
              <span className="font-semibold text-primary">{p.name}</span>
              {p.constituency ? ` · ${p.constituency}` : ""} · leverage {p.leverage.toFixed(1)} · vulnerability {p.vulnerability.toFixed(1)} · spoiler {p.spoilerRisk}
              {p.vetoPower ? " · veto" : ""}
            </Row>
          ))}
        </ul>
      )}
    </div>
  );
}

function ShockForm({ prefix = "" }: { prefix?: string }) {
  const [list, setList] = useList<CustomShock>("customShocks");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [dv, setDv] = useState<[number, number, number, number]>([0, -0.5, 0, 0]);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 [&>*]:min-w-0">
        <label className="block"><span className={lab}>{prefix ? "Succession shock" : "Shock package"}</span><input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder={prefix ? "Unannounced death of the guarantor head of state" : "Drought, hyperinflation and a cross-border raid"} /></label>
        <label className="block"><span className={lab}>Description</span><input className={field} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What happens, and to whom" /></label>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {BOND_NAMES.map((n, i) => (
          <Num key={n} id={`cs-${prefix}${i}`} labelText={`Δ ${n.replace("-Relational", "")}`} min={-4} max={4} value={dv[i]} onChange={(x) => setDv((v) => v.map((y, j) => (j === i ? Math.max(-4, Math.min(4, Math.round(x * 10) / 10)) : y)) as [number, number, number, number])} />
        ))}
      </div>
      <button
        type="button"
        className={btn}
        disabled={!name.trim()}
        onClick={() => {
          setList([...list, { id: uid(), name: `${prefix}${name.trim()}`, description: desc.trim(), deltas: { interpersonal: dv[0], communal: dv[1], intergenerational: dv[2], institutional: dv[3] } }]);
          setName("");
          setDesc("");
        }}
      >
        <Plus size={13} aria-hidden /> Inscribe and apply shock
      </button>
      {list.length > 0 && (
        <ul className="space-y-2">
          {list.map((x) => (
            <Row key={x.id} label={x.name} onRemove={() => setList(list.filter((y) => y.id !== x.id))}>
              <span className="font-semibold text-primary">{x.name}</span>
              <span className="font-mono text-xs"> · Δ {[x.deltas.interpersonal, x.deltas.communal, x.deltas.intergenerational, x.deltas.institutional].map((n) => (n > 0 ? `+${n.toFixed(1)}` : n.toFixed(1))).join(" / ")}</span>
            </Row>
          ))}
        </ul>
      )}
      <p className="text-xs text-muted-foreground">Inscribed shocks lower the live bond vector every desk reads, add load to the sentinel rupture index and join the compound shock count.</p>
    </div>
  );
}

function TrapForm() {
  const [list, setList] = useList<CustomTrap>("customTraps");
  const [d, setD] = useState({ name: "", condition: "", warningSymptom: "", countermeasure: "" });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 [&>*]:min-w-0">
        <label className="block"><span className={lab}>Trap name</span><input className={field} value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} placeholder="Pasture-rights capture" /></label>
        <label className="block"><span className={lab}>Trigger condition</span><input className={field} value={d.condition} onChange={(e) => setD({ ...d, condition: e.target.value })} placeholder="Dry-season corridors closed by one clan" /></label>
        <label className="block"><span className={lab}>Early warning</span><input className={field} value={d.warningSymptom} onChange={(e) => setD({ ...d, warningSymptom: e.target.value })} placeholder="Elders absent from joint grazing councils" /></label>
        <label className="block"><span className={lab}>Mandatory counter-measure</span><input className={field} value={d.countermeasure} onChange={(e) => setD({ ...d, countermeasure: e.target.value })} placeholder="Joint corridor verification each season" /></label>
      </div>
      <button type="button" className={btn} disabled={!d.name.trim()} onClick={() => { setList([...list, { ...d, name: d.name.trim(), id: uid(), active: true }]); setD({ name: "", condition: "", warningSymptom: "", countermeasure: "" }); }}>
        <Plus size={13} aria-hidden /> Inscribe trap
      </button>
      {list.length > 0 && (
        <ul className="space-y-2">
          {list.map((t) => (
            <Row key={t.id} label={t.name} onRemove={() => setList(list.filter((x) => x.id !== t.id))}>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={t.active} onChange={(e) => setList(list.map((x) => (x.id === t.id ? { ...x, active: e.target.checked } : x)))} className="accent-[hsl(var(--accent))]" />
                <span className="font-semibold text-primary">{t.name}</span>
                <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{t.active ? "Active" : "Dormant"}</span>
              </label>
              {t.countermeasure && <span className="block text-xs text-muted-foreground">Counter-measure: {t.countermeasure}</span>}
            </Row>
          ))}
        </ul>
      )}
    </div>
  );
}

function CovenantForm({ placeholder }: { placeholder: string }) {
  const [list, setList] = useList<CustomCovenant>("customCovenants");
  const [d, setD] = useState<Omit<CustomCovenant, "id">>({ title: "", obligation: "", enforcementMechanism: "Independent Trustee", mandatedArticleRef: "" });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 [&>*]:min-w-0">
        <label className="block"><span className={lab}>Covenant title</span><input className={field} value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} placeholder={placeholder} /></label>
        <label className="block"><span className={lab}>Enforcement mechanism</span>
          <select className={field} value={d.enforcementMechanism} onChange={(e) => setD({ ...d, enforcementMechanism: e.target.value as CustomCovenant["enforcementMechanism"] })}>
            {ENFORCEMENT_MECHANISMS.map((m) => <option key={m}>{m}</option>)}
          </select>
        </label>
        <label className="block sm:col-span-2"><span className={lab}>Obligation</span><textarea rows={2} className={field} value={d.obligation} onChange={(e) => setD({ ...d, obligation: e.target.value })} placeholder="The obligation binds the office, not the officeholder, and survives any change of government." /></label>
        <label className="block"><span className={lab}>Clearance article (optional)</span><input className={field} value={d.mandatedArticleRef} onChange={(e) => setD({ ...d, mandatedArticleRef: e.target.value })} placeholder="4.3" /></label>
      </div>
      <button type="button" className={btn} disabled={!d.title.trim()} onClick={() => { setList([...list, { ...d, title: d.title.trim(), obligation: d.obligation.trim(), mandatedArticleRef: d.mandatedArticleRef?.trim() || undefined, id: uid() }]); setD({ ...d, title: "", obligation: "", mandatedArticleRef: "" }); }}>
        <Plus size={13} aria-hidden /> Inscribe covenant
      </button>
      {list.length > 0 && (
        <ul className="space-y-2">
          {list.map((c) => (
            <Row key={c.id} label={c.title} onRemove={() => setList(list.filter((x) => x.id !== c.id))}>
              <span className="font-semibold text-primary">{c.title}</span> · {c.enforcementMechanism}
              {c.obligation && <span className="block text-xs text-muted-foreground">{c.obligation}</span>}
            </Row>
          ))}
        </ul>
      )}
      <p className="text-xs text-muted-foreground">Inscribed covenants join the covenant register: they count towards the Structural Covenants gate and succession durability, and the Verification Ledger lists them for verification.</p>
    </div>
  );
}

function GateForm() {
  const [list, setList] = useList<CustomGate>("customGates");
  const [label, setLabel] = useState("");
  return (
    <div className="space-y-4">
      <label className="block"><span className={lab}>Readiness gate</span><input className={field} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Joint border patrol verification sign-off" /></label>
      <button type="button" className={btn} disabled={!label.trim()} onClick={() => { setList([...list, { id: uid(), label: label.trim(), verified: false }]); setLabel(""); }}>
        <Plus size={13} aria-hidden /> Inscribe gate
      </button>
      {list.length > 0 && (
        <ul className="space-y-2">
          {list.map((g) => (
            <Row key={g.id} label={g.label} onRemove={() => setList(list.filter((x) => x.id !== g.id))}>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={g.verified} onChange={(e) => setList(list.map((x) => (x.id === g.id ? { ...x, verified: e.target.checked } : x)))} className="accent-[hsl(var(--accent))]" />
                <span className="text-primary">{g.label}</span>
                <span className={`text-[10px] uppercase tracking-[0.14em] ${g.verified ? "text-emerald" : "text-destructive"}`}>{g.verified ? "Attested" : "Awaiting attestation"}</span>
              </label>
            </Row>
          ))}
        </ul>
      )}
    </div>
  );
}

function TrackForm() {
  const [list, setList] = useList<CustomTrack>("customTracks");
  const [d, setD] = useState({ name: "", phase: 0, description: "" });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_8rem] [&>*]:min-w-0">
        <label className="block"><span className={lab}>Track III name</span><input className={field} value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} placeholder="Council of elders and women's assembly" /></label>
        <Num id="ct-phase" labelText="Phase (0 to 6)" min={0} max={6} step={1} value={d.phase} onChange={(x) => setD({ ...d, phase: Math.max(0, Math.min(6, Math.round(x))) })} />
        <label className="block sm:col-span-2"><span className={lab}>Sync points</span><input className={field} value={d.description} onChange={(e) => setD({ ...d, description: e.target.value })} placeholder="Reports to the joint commission after each communal round" /></label>
      </div>
      <button type="button" className={btn} disabled={!d.name.trim()} onClick={() => { setList([...list, { ...d, name: d.name.trim(), id: uid() }]); setD({ name: "", phase: 0, description: "" }); }}>
        <Plus size={13} aria-hidden /> Inscribe track
      </button>
      {list.length > 0 && (
        <ul className="space-y-2">
          {list.map((t) => (
            <Row key={t.id} label={t.name} onRemove={() => setList(list.filter((x) => x.id !== t.id))}>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-semibold text-primary">{t.name}</span>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  Phase
                  <input type="range" min={0} max={6} step={1} value={t.phase} onChange={(e) => setList(list.map((x) => (x.id === t.id ? { ...x, phase: Number(e.target.value) } : x)))} className="w-28 accent-[hsl(var(--accent))]" aria-label={`${t.name} phase`} />
                  <span className="font-mono text-primary">{t.phase}</span>
                </label>
              </div>
            </Row>
          ))}
        </ul>
      )}
      <p className="text-xs text-muted-foreground">If Track I leads an inscribed track by more than the communal tolerance, a Track III shear alert is raised on every desk.</p>
    </div>
  );
}

function PrecedentForm() {
  const [list, setList] = useList<CustomPrecedent>("customPrecedents");
  const [name, setName] = useState("");
  const [lesson, setLesson] = useState("");
  const [sc, setSc] = useState<[number, number, number, number]>([3, 3, 3, 3]);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 [&>*]:min-w-0">
        <label className="block"><span className={lab}>Precedent</span><input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="Karamoja disarmament accord" /></label>
        <label className="block"><span className={lab}>Core treaty lesson</span><input className={field} value={lesson} onChange={(e) => setLesson(e.target.value)} placeholder="Disarmament without livestock protection collapsed" /></label>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {BOND_NAMES.map((n, i) => (
          <Num key={n} id={`pp-${i}`} labelText={n.replace("-Relational", "")} min={1} max={5} value={sc[i]} onChange={(x) => setSc((v) => v.map((y, j) => (j === i ? clampScore(x) : y)) as [number, number, number, number])} />
        ))}
      </div>
      <button type="button" className={btn} disabled={!name.trim()} onClick={() => { setList([...list, { id: uid(), name: name.trim(), lesson: lesson.trim(), scores: sc }]); setName(""); setLesson(""); }}>
        <Plus size={13} aria-hidden /> Inscribe precedent
      </button>
      {list.length > 0 && (
        <ul className="space-y-2">
          {list.map((p) => (
            <Row key={p.id} label={p.name} onRemove={() => setList(list.filter((x) => x.id !== p.id))}>
              <span className="font-semibold text-primary">{p.name}</span> <span className="font-mono text-xs">({p.scores.map((x) => x.toFixed(1)).join(", ")})</span>
            </Row>
          ))}
        </ul>
      )}
      <p className="text-xs text-muted-foreground">Inscribed precedents are drawn on the mirror radar as dashed outlines and compared in the divergence record.</p>
    </div>
  );
}

function PhraseForm() {
  const [list, setList] = useList<CustomPhrase>("customPhrases");
  const [d, setD] = useState({ phrase: "", replacement: "", rationale: "" });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 [&>*]:min-w-0">
        <label className="block"><span className={lab}>Prohibited phrase</span><input className={field} value={d.phrase} onChange={(e) => setD({ ...d, phrase: e.target.value })} placeholder="subject to availability of resources" /></label>
        <label className="block"><span className={lab}>Relational replacement</span><input className={field} value={d.replacement} onChange={(e) => setD({ ...d, replacement: e.target.value })} placeholder="funded from a ring-fenced line that no single party may reallocate" /></label>
        <label className="block sm:col-span-2"><span className={lab}>Statutory rationale</span><input className={field} value={d.rationale} onChange={(e) => setD({ ...d, rationale: e.target.value })} placeholder="An unfunded obligation is a deferred rupture" /></label>
      </div>
      <button type="button" className={btn} disabled={!d.phrase.trim()} onClick={() => { setList([...list, { ...d, phrase: d.phrase.trim(), replacement: d.replacement.trim(), id: uid() }]); setD({ phrase: "", replacement: "", rationale: "" }); }}>
        <Plus size={13} aria-hidden /> Inscribe rule
      </button>
      {list.length > 0 && (
        <ul className="space-y-2">
          {list.map((p) => (
            <Row key={p.id} label={p.phrase} onRemove={() => setList(list.filter((x) => x.id !== p.id))}>
              <span className="line-through text-destructive">{p.phrase}</span> <span className="text-muted-foreground">to read</span> <span className="text-emerald">{p.replacement || "(strike)"}</span>
            </Row>
          ))}
        </ul>
      )}
      <p className="text-xs text-muted-foreground">Inscribed phrases are flagged in the clause under review and replaced by the chancellery substitutions.</p>
    </div>
  );
}

type NoteSpec = { kind: string; titleLabel: string; titlePh: string; bodyLabel: string; bodyPh: string; rows?: number };

function NoteForm({ desk, spec, reading }: { desk: string; spec: NoteSpec; reading?: (s: Signals) => string }) {
  const { signals } = useEngine();
  const [all, setAll] = useList<CustomNote>("customNotes");
  const list = all.filter((n) => n.desk === desk);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 [&>*]:min-w-0">
        <label className="block"><span className={lab}>{spec.titleLabel}</span><input className={field} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={spec.titlePh} /></label>
        <label className="block"><span className={lab}>{spec.bodyLabel}</span><textarea rows={spec.rows ?? 3} className={field} value={body} onChange={(e) => setBody(e.target.value)} placeholder={spec.bodyPh} /></label>
      </div>
      <Button variant="outline" type="button" className={btn} disabled={!title.trim() || !body.trim()} onClick={() => { if (!title.trim() || !body.trim()) return; setAll([...all, { id: uid(), desk, kind: spec.kind, title: title.trim(), body: body.trim() }]); setTitle(""); setBody(""); }}>
        <Plus size={13} aria-hidden /> Inscribe
      </Button>
      {list.length > 0 && (
        <ul className="space-y-2">
          {list.map((n) => (
            <Row key={n.id} label={n.title} onRemove={() => setAll(all.filter((x) => x.id !== n.id))}>
              <span className="font-semibold text-primary">{n.title}</span>
              {n.body && <span className="block whitespace-pre-wrap text-xs text-muted-foreground">{n.body}</span>}
              {reading && <span className="mt-1 block font-mono text-[11px] text-accent">{reading(signals)}</span>}
            </Row>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Resilience of the mission against an inscribed hostile posture, read from the live vector. */
function hostileReading(s: Signals): string {
  if (!s.bonds) return "No bond vector on the bus: resilience cannot be read.";
  const inst = s.bonds.institutional;
  const lim = s.weakestScore ?? Math.min(inst, s.bonds.communal);
  if (inst >= 3 && lim >= 3) return `Absorbable: institutional ${inst.toFixed(1)}, limiting bond ${lim.toFixed(1)}, both at or above the 3.0 floor.`;
  if (inst >= 3) return `Exposed on the ${(s.weakestBond ?? "limiting").toLowerCase()} bond at ${lim.toFixed(1)}: institutions hold, but the maneuver lands on the weak bond.`;
  return `Critical: institutional bond ${inst.toFixed(1)} sits below the 3.0 floor, so the posture can break the process outright.`;
}

/* ------------------------------------------------------------------ */
/* Desk configuration                                                  */
/* ------------------------------------------------------------------ */

const NOTES: Record<string, NoteSpec> = {
  legal: { kind: "Sovereign tribunal", titleLabel: "Custom tribunal or traditional assembly", titlePh: "Council of Elders sitting as a customary court", bodyLabel: "Evidentiary burdens, customary procedure and oaths of record", bodyPh: "Testimony taken under the clan oath; compensation in livestock is the remedy of record." },
  adversarial: { kind: "Hostile posture", titleLabel: "Custom hostile maneuver", titlePh: "Counterpart leaks draft memorandum to partisan media during ceasefire recess", bodyLabel: "Expected effect", bodyPh: "Communal trust collapses before the next session." },
  counterpart: { kind: "Counterpart tactic", titleLabel: "Adversarial tactic", titlePh: "Delegation head insists on a private side letter", bodyLabel: "Targeted vulnerability and custom examination question", bodyPh: "Targets the institutional bond. Ask: which office will hold this letter after you leave?" },
  verification: { kind: "Verification protocol", titleLabel: "Sovereign verification protocol", titlePh: "Satellite monitoring with local elder ground attestation", bodyLabel: "Mechanism, cadence and evidence standard", bodyPh: "Quarterly imagery review; elders attest on site within fourteen days." },
  briefing: { kind: "Chancery seal and salutation", titleLabel: "Diplomatic credentials and mission prefix", titlePh: "Special Envoy for the Northern Corridor", bodyLabel: "Salutation and seal motto", bodyPh: "The Mission avails itself of this opportunity to renew the assurances of its highest consideration." },
  binder: { kind: "Sovereign annex", titleLabel: "Annex title", titlePh: "Annex C: Seasonal grazing corridors", bodyLabel: "Annex text or table (one row per line)", bodyPh: "Corridor | From | To | Custodian", rows: 6 },
};

const TITLES: Record<string, { title: string; description: string }> = {
  diagnostics: { title: "Custom vector and boundary rules", description: "Inscribe local red-lines and a bespoke calibration. Rules print in the boundary rules card and in every transmittal." },
  audit: { title: "Custom frontline actors", description: "Inscribe actors the standard roster does not capture. They join the audit checklist, the asymmetry matrix and every manifest." },
  mirror: { title: "Custom precedent", description: "Inscribe a precedent outside the eight documented cases with its four historical bond scores." },
  legal: { title: "Sovereign tribunal or traditional assembly", description: "Record the customary forum, its evidentiary burdens and oaths. The forum enters the bus and the litigation record." },
  adversarial: { title: "Custom hostile posture", description: "Inscribe a bespoke maneuver and read its effect against the live bond vector." },
  clauses: { title: "Sovereign covenant drafter", description: "Draft bespoke provisions with an enforcement mechanism. They count towards the covenant gates." },
  redliner: { title: "Custom prohibited phrases", description: "Inscribe toxic phrasing, its relational replacement and the rationale." },
  multiparty: { title: "Custom stakeholders", description: "Inscribe parties with leverage, vulnerability, spoiler risk and veto. The asymmetry matrix recalculates at once." },
  compound: { title: "Sovereign shock package builder", description: "Name a regional compound shock and its bond deltas. It depresses the live vector across the whole chain." },
  sentinel: { title: "Custom latent traps", description: "Inscribe a trap unique to local custom. Active traps load the rupture index and join the trap register." },
  readiness: { title: "Sovereign readiness gates", description: "Define milestones that require attestation before readiness can be certified." },
  counterpart: { title: "Custom counterpart tactic", description: "Inscribe a tactic, the vulnerability it targets and your examination question." },
  succession: { title: "Custom succession shock", description: "Inscribe an unannounced transition and its bond deltas, then read clause durability." },
  tracks: { title: "Track III: civil society or communal assembly", description: "Add tertiary dialogue tracks and watch their sync with Track I." },
  verification: { title: "Sovereign verification protocol", description: "Record bespoke verification mechanisms. Inscribed covenants from every desk appear in this ledger." },
  handover: { title: "Bespoke handover covenant", description: "Bind successor delegations to briefing review and continuity acknowledgments." },
  briefing: { title: "Chancery seal and salutation", description: "Inscribe credentials, mission prefix and seal motto. Reference numbering stays collision-free." },
  binder: { title: "Sovereign annex", description: "Freeform annexes, demarcations and supplementary declarations for the binder." },
};

function deskCount(desk: string, s: Signals): number {
  const notes = (s.customNotes ?? []).filter((n) => n.desk === desk).length;
  switch (desk) {
    case "diagnostics": return (s.customRules?.length ?? 0) + notes;
    case "audit": case "multiparty": return s.customParties?.length ?? 0;
    case "mirror": return s.customPrecedents?.length ?? 0;
    case "clauses": case "handover": return s.customCovenants?.length ?? 0;
    case "redliner": return s.customPhrases?.length ?? 0;
    case "compound": case "succession": return s.customShocks?.length ?? 0;
    case "sentinel": return s.customTraps?.length ?? 0;
    case "readiness": return s.customGates?.length ?? 0;
    case "tracks": return s.customTracks?.length ?? 0;
    default: return notes;
  }
}

export default function SovereignInscriptionTray({ deskId, onApplyVector }: { deskId: string; onApplyVector?: (b: BondVector) => void }) {
  const { signals } = useEngine();
  const t = TITLES[deskId];
  if (!t) return null;
  let body: ReactNode;
  switch (deskId) {
    case "diagnostics": body = <RulesForm onApplyVector={onApplyVector} />; break;
    case "audit": case "multiparty": body = <PartyForm />; break;
    case "mirror": body = <PrecedentForm />; break;
    case "clauses": body = <CovenantForm placeholder="Office-continuity guarantee" />; break;
    case "handover": body = <CovenantForm placeholder="Successor delegation briefing covenant" />; break;
    case "redliner": body = <PhraseForm />; break;
    case "compound": body = <ShockForm />; break;
    case "succession": body = <ShockForm prefix="Succession: " />; break;
    case "sentinel": body = <TrapForm />; break;
    case "readiness": body = <GateForm />; break;
    case "tracks": body = <TrackForm />; break;
    default: body = <NoteForm desk={deskId} spec={NOTES[deskId]} reading={deskId === "adversarial" ? hostileReading : undefined} />;
  }
  return (
    <SovereignCustomDrawer title={t.title} description={t.description} count={deskCount(deskId, signals)}>
      {body}
    </SovereignCustomDrawer>
  );
}
