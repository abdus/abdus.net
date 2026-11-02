"use client";

import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";

const BASE = "https://abdus.github.io/ipo-analyser";

type Component = { key: string; label: string; points: number; maximum: number; detail: string; available: boolean };

type Ipo = {
  slug: string;
  name: string;
  segment: string;
  status: string;
  close_date: string | null;
  implied_gain_pct: number | null;
  history: { date: string; gmp: number }[];
  score: { total: number; signal: string; components: Component[] } | null;
};

/** Signal colours, as [from, to] for gradients. */
const TONE: Record<string, [string, string]> = {
  positive: ["#2dd4bf", "#22c55e"],
  neutral: ["#fbbf24", "#f97316"],
  weak: ["#fb7185", "#e11d48"],
};
const tone = (signal: string) => TONE[signal] ?? ["#94a3b8", "#64748b"];
const TEXT: Record<string, string> = { positive: "text-emerald-500", neutral: "text-amber-500", weak: "text-rose-500" };

const ago = (iso: string) => {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
  if (mins < 60) return `${mins} min ago`;
  const h = Math.round(mins / 60);
  return h < 48 ? `${h} h ago` : `${Math.round(h / 24)} days ago`;
};

const day = (d: string) =>
  new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

const ipoHref = (slug: string) => `${BASE}/ipo/${slug}/`;

/** Open IPOs, strongest signal first, plus when the data was refreshed. Shared by both views. */
function useIpoSignals() {
  const [state, setState] = useState<{ ipos: Ipo[]; updated: string | null } | null>(null);
  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/api/ipos.json`).then((r) => r.json()),
      fetch(`${BASE}/api/status.json`).then((r) => r.json()),
    ])
      .then(([list, status]) => {
        const ipos = (list.data as Ipo[])
          .filter((i) => i.status === "open" && i.score)
          .sort((a, b) => b.score!.total - a.score!.total);
        setState({ ipos, updated: status.generated_at ?? null });
      })
      .catch(() => setState({ ipos: [], updated: null }));
  }, []);
  return state;
}

/** The score out of 100, as a ring drawn with the signal's gradient. */
function ScoreRing({ score, signal, size = 88 }: { score: number; signal: string; size?: number }) {
  const id = useId();
  const [from, to] = tone(signal);
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className="shrink-0 -rotate-90" aria-hidden>
      <defs>
        <linearGradient id={`${id}-ring`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="8" />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={`url(#${id}-ring)`}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${(c * score) / 100} ${c}`}
        className="transition-[stroke-dasharray] duration-1000 ease-out"
      />
    </svg>
  );
}

/** GMP over time as a soft gradient area, only when there is a real line to draw. */
function GmpChart({ history, signal }: { history: Ipo["history"]; signal: string }) {
  const id = useId();
  const values = history.map((h) => h.gmp);
  if (values.length < 3 || Math.max(...values) === Math.min(...values)) return null;
  const [from, to] = tone(signal);
  const W = 300, H = 72, pad = 4;
  const min = Math.min(...values), max = Math.max(...values);
  const pts = values.map((v, i) => [
    pad + (i * (W - 2 * pad)) / (values.length - 1),
    pad + (1 - (v - min) / (max - min)) * (H - 2 * pad),
  ]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${pts.at(-1)![0].toFixed(1)},${H} L${pts[0][0].toFixed(1)},${H} Z`;
  return (
    <div className="mt-6">
      <p className="text-[12px] text-fg-3">
        Grey-market premium, last {history.length} days · ₹{values[0]} → ₹{values.at(-1)}
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 h-16 w-full" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={to} stopOpacity="0.35" />
            <stop offset="100%" stopColor={to} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${id}-line`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${id}-fill)`} />
        <path d={line} fill="none" stroke={`url(#${id}-line)`} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

/** What the score is made of: one gradient bar per factor. */
function Breakdown({ components, signal }: { components: Component[]; signal: string }) {
  const [from, to] = tone(signal);
  return (
    <ul className="mt-6 space-y-2.5">
      {components.map((c) => (
        <li key={c.key} className="grid grid-cols-[minmax(0,9.5rem)_1fr_auto] items-center gap-3 text-[13px]">
          <span className="truncate text-fg-2" title={c.detail}>
            {c.label}
          </span>
          <span className="h-1.5 overflow-hidden rounded-full bg-fg/[0.07]">
            {c.available && (
              <span
                className="block h-full rounded-full"
                style={{
                  width: `${Math.max(4, (c.points / c.maximum) * 100)}%`,
                  backgroundImage: `linear-gradient(90deg, ${from}, ${to})`,
                }}
              />
            )}
          </span>
          <span className="w-16 text-right tabular-nums text-fg-3">
            {c.available ? `${Math.round(c.points)}/${c.maximum}` : "no data"}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** /now: the strongest open IPO with its score, breakdown and trend; two runners-up below. */
export default function IpoSignals() {
  const state = useIpoSignals();
  if (!state?.ipos.length) return null;
  const [top, ...others] = state.ipos;
  const rest = others.slice(0, 2);
  const [from, to] = tone(top.score!.signal);

  return (
    <section className="py-12 sm:py-14 animate-in fade-in duration-500">
      <p className="text-[13px] font-medium text-tint">Watching</p>
      <h2 className="display mt-2 text-balance text-[26px] leading-[1.2] sm:text-[30px]">
        Today&apos;s strongest IPO signal
      </h2>

      <a
        href={ipoHref(top.slug)}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative mt-6 block overflow-hidden rounded-2xl p-5 ring-1 ring-line/10 transition-colors hover:bg-fg/[0.02] sm:p-6"
      >
        {/* A faint wash of the signal colour in the corner. */}
        <span
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full opacity-[0.12] blur-3xl"
          style={{ backgroundImage: `radial-gradient(circle, ${to}, ${from} 60%, transparent 70%)` }}
        />

        <div className="relative flex items-center justify-between gap-5">
          <div className="min-w-0">
            <p className="truncate text-[20px] text-fg transition-colors group-hover:text-tint sm:text-[22px]">
              {top.name}
            </p>
            <p className="mt-1 text-[14px] leading-snug text-fg-3">
              {top.segment === "sme" ? "SME" : "Mainboard"}
              {top.close_date && <> · bids close {day(top.close_date)}</>}
            </p>
            {top.implied_gain_pct != null && (
              <p className="mt-3 text-[14px] text-fg-2">
                Implied listing gain{" "}
                <span className="tabular-nums text-fg">
                  {top.implied_gain_pct >= 0 ? "+" : ""}
                  {top.implied_gain_pct.toFixed(1)}%
                </span>
              </p>
            )}
          </div>
          <div className="relative grid shrink-0 place-items-center">
            <ScoreRing score={top.score!.total} signal={top.score!.signal} />
            <span className="absolute text-center">
              <span className="display block text-[26px] leading-none tabular-nums">{top.score!.total}</span>
              <span className={cn("mt-0.5 block text-[11px] capitalize", TEXT[top.score!.signal])}>
                {top.score!.signal}
              </span>
            </span>
          </div>
        </div>

        <div className="relative">
          <GmpChart history={top.history} signal={top.score!.signal} />
          <Breakdown components={top.score!.components} signal={top.score!.signal} />
        </div>
      </a>

      {rest.length > 0 && (
        <ul className="mt-2">
          {rest.map((i) => (
            <li key={i.slug} className="border-b border-line/[0.07] last:border-0">
              <a
                href={ipoHref(i.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-1 py-3"
              >
                <span className="min-w-0 flex-1 truncate text-[15px] text-fg-2 transition-colors group-hover:text-tint">
                  {i.name}
                </span>
                <span className="hidden h-1 w-24 overflow-hidden rounded-full bg-fg/[0.07] sm:block" aria-hidden>
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: `${i.score!.total}%`,
                      backgroundImage: `linear-gradient(90deg, ${tone(i.score!.signal)[0]}, ${tone(i.score!.signal)[1]})`,
                    }}
                  />
                </span>
                <span className="w-24 shrink-0 text-right text-[14px] tabular-nums text-fg-3">
                  {i.score!.total} · <span className={TEXT[i.score!.signal]}>{i.score!.signal}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-5 text-[13px] leading-relaxed text-fg-3">
        Live from{" "}
        <a href={`${BASE}/`} target="_blank" rel="noopener noreferrer" className="text-fg-2 hover:text-tint">
          IPO Analyser ↗
        </a>
        {state.updated && <>, updated {ago(state.updated)}</>}. A score out of 100 from grey-market premiums, demand
        and the market. Grey-market premiums are unofficial, so this is research, not advice.
      </p>
    </section>
  );
}
