import { useRef, useState } from "react";
import { FileUp, ShieldCheck, ShieldAlert, ScrollText } from "lucide-react";
import { bondLabel, verifyApostilleText, verifyArchiveText, type AttestationReceipt, type Check } from "@/lib/attestation";

/**
 * Air-Gapped Attestation & Dispatch Verifier. Checks a .vinculum mission archive
 * or a pasted NV/VINC- apostille entirely in this browser: the SHA-256 state
 * digest, the archive seal, the Merkle session root, the twenty statutory
 * clearances (Articles 1.1 to 5.4) and the 3.0 viable floor. Nothing is uploaded,
 * fetched or stored.
 */
export default function AttestationVerifier() {
  const [receipt, setReceipt] = useState<AttestationReceipt | null>(null);
  const [text, setText] = useState("");
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [inspectedAt, setInspectedAt] = useState("");
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const run = async (job: () => Promise<AttestationReceipt>) => {
    setBusy(true);
    try {
      setReceipt(await job());
      setInspectedAt(new Date().toISOString().replace(/\.\d{3}Z$/, "Z"));
    } finally {
      setBusy(false);
    }
  };

  const readFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => void run(() => verifyArchiveText(String(reader.result)));
    reader.readAsText(file);
  };

  const btn =
    "inline-flex items-center justify-center gap-2 border border-brass/50 px-4 py-2.5 min-h-11 text-[10px] uppercase tracking-[0.18em] font-semibold text-primary hover:border-accent hover:text-accent transition-colors disabled:opacity-50";

  return (
    <div className="border border-brass/50 bg-card/40 p-5 md:p-7 min-w-0" data-testid="attestation-verifier">
      <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent">Air-gapped attestation verifier</p>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground leading-relaxed">
        Inspect a sealed mission archive or a chancellery apostille. Every digest is recomputed in this browser with
        native Web Crypto; nothing is uploaded, fetched or kept.
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-2 min-w-0">
        <div
          className={`flex min-h-44 min-w-0 flex-col items-center justify-center gap-3 border border-dashed p-5 text-center transition-colors ${dragging ? "border-accent bg-background" : "border-brass/60 bg-background/60"}`}
          onDragOver={(e) => {
            if (!e.dataTransfer.types.includes("Files")) return;
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            if (!e.dataTransfer.files.length) return;
            e.preventDefault();
            setDragging(false);
            readFile(e.dataTransfer.files[0]);
          }}
        >
          <FileUp size={18} className="text-accent" aria-hidden />
          <p className="font-serif text-primary text-lg leading-tight">Mission archive</p>
          <p className="text-xs text-muted-foreground">Drop a .vinculum file here, or choose one from this device.</p>
          <button type="button" className={btn} onClick={() => fileRef.current?.click()} disabled={busy}>
            Choose archive
          </button>
          {fileName && <p className="max-w-full truncate font-mono text-[10px] text-muted-foreground">{fileName}</p>}
          <input
            ref={fileRef}
            type="file"
            accept=".vinculum,application/json"
            className="hidden"
            aria-label="Mission archive to verify"
            data-testid="verifier-file"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) readFile(f);
              e.target.value = "";
            }}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <label htmlFor="verifier-text" className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/70">
            Apostille or chancellery minute
          </label>
          <textarea
            id="verifier-text"
            data-testid="verifier-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={7}
            spellCheck={false}
            placeholder={"+--- VINCULUM PROTOCOL REGISTRY // SIGILLUM CANCELLARIAE ---+\nREF NO  : NV/VINC-…"}
            className="w-full min-w-0 resize-y border border-input bg-background px-3 py-2.5 font-mono text-xs leading-relaxed"
          />
          <button
            type="button"
            className={`${btn} self-start`}
            disabled={busy || !text.trim()}
            data-testid="verifier-submit"
            onClick={() => void run(() => verifyApostilleText(text))}
          >
            <ScrollText size={13} /> Verify apostille
          </button>
        </div>
      </div>

      {receipt && <Receipt r={receipt} inspectedAt={inspectedAt} />}
    </div>
  );
}

const SEAL_LABEL: Record<AttestationReceipt["verdict"], string> = {
  confirmed: "[CONFIRMED IDENTICAL]",
  mismatch: "[DIGEST MISMATCH]",
  unverifiable: "[DIGEST RECORDED · NOT RECOMPUTED]",
  invalid: "[NOT A VINCULUM RECORD]",
};

const BANNER: Record<AttestationReceipt["verdict"], string> = {
  confirmed: "SOVEREIGN RECORD SEALED & UNALTERED",
  mismatch: "RECORD ALTERED OR DAMAGED · DO NOT RELY ON ITS CONTENTS",
  unverifiable: "DIGEST RECORDED · RECOMPUTE NEEDS THE ARCHIVE",
  invalid: "INSPECTION REFUSED",
};

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-border/70 py-2.5 sm:grid-cols-[14rem_1fr] sm:gap-4 min-w-0">
      <dt className="text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">{k}</dt>
      <dd className="min-w-0 font-mono text-xs text-primary [overflow-wrap:anywhere]">{children}</dd>
    </div>
  );
}

const STATUS_TEXT: Record<Check["status"], string> = { match: "IDENTICAL", mismatch: "MISMATCH", absent: "RECORDED ONLY" };

function Receipt({ r, inspectedAt }: { r: AttestationReceipt; inspectedAt: string }) {
  const good = r.verdict === "confirmed";
  const bad = r.verdict === "mismatch" || r.verdict === "invalid";
  return (
    <section
      className={`mt-6 border-2 border-double bg-background p-4 sm:p-6 min-w-0 ${good ? "border-accent" : bad ? "border-destructive" : "border-brass"}`}
      data-testid="verifier-receipt"
      data-verdict={r.verdict}
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-primary/70">Westphalian inspection receipt</p>
        <p className="font-mono text-[10px] text-muted-foreground">Inspected {inspectedAt} (UTC) · zero network egress</p>
      </div>
      <p
        className={`mt-3 flex items-center gap-2 border px-3 py-2 text-[11px] uppercase tracking-[0.18em] font-semibold ${good ? "border-accent text-accent" : bad ? "border-destructive text-destructive" : "border-brass text-primary"}`}
        data-testid="verifier-banner"
      >
        {good ? <ShieldCheck size={14} className="shrink-0" /> : <ShieldAlert size={14} className="shrink-0" />}
        <span className="min-w-0 [overflow-wrap:anywhere]">{BANNER[r.verdict]}</span>
      </p>

      {r.verdict === "invalid" ? (
        <p className="mt-4 text-sm text-destructive">{r.reason}</p>
      ) : (
        <dl className="mt-4">
          <Row k="Reference">{r.reference ? `${r.reference} · well-formed registry reference` : "None recorded"}</Row>
          {r.source === "archive" && <Row k="Schema">{`${r.schema} · version ${r.version}`}</Row>}
          <Row k="Cryptographic seal">
            <span data-testid="verifier-seal" className={good ? "text-accent" : bad ? "text-destructive" : ""}>{SEAL_LABEL[r.verdict]}</span>
          </Row>
          <Row k="Statutory clearances">
            {r.clearances ? (
              <span data-testid="verifier-clearances">
                {r.clearances.passed} / {r.clearances.total} Mandated Articles Cleared
              </span>
            ) : (
              "Not recorded"
            )}
          </Row>
          <Row k="Viable floor (3.0)">
            {r.floor ? (
              r.floor.breaches.length ? (
                <span className="text-destructive" data-testid="verifier-floor">
                  BREACH · {r.floor.breaches.map((i) => `${bondLabel(i)} ${r.floor!.vector[i].toFixed(1)}`).join(", ")} at or below {r.floor.floor.toFixed(1)}
                </span>
              ) : (
                <span data-testid="verifier-floor">HELD · every bond above {r.floor.floor.toFixed(1)} ({r.floor.vector.map((x) => x.toFixed(1)).join(" / ")})</span>
              )
            ) : (
              "No bond vector recorded"
            )}
          </Row>
          {r.merkleRoot && <Row k="Merkle session root">{r.merkleRoot}</Row>}
          {r.timestamp && <Row k="Sealed at">{r.timestamp}</Row>}
          {r.checks.map((c) => (
            <Row key={c.label} k={c.label}>
              <span className={c.status === "mismatch" ? "text-destructive" : c.status === "match" ? "text-accent" : "text-muted-foreground"}>
                {STATUS_TEXT[c.status]}
              </span>
              {c.recorded && <span className="block text-muted-foreground">recorded {c.recorded}</span>}
              {c.computed && c.status !== "absent" && <span className="block text-muted-foreground">computed {c.computed}</span>}
              {c.note && <span className="block text-muted-foreground font-sans">{c.note}</span>}
            </Row>
          ))}
        </dl>
      )}
    </section>
  );
}
