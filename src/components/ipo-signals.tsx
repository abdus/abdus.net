"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "./icons";

const BASE = "https://abdus.github.io/ipo-analyser";

type Ipo = {
  slug: string;
  name: string;
  segment: string;
  status: string;
  close_date: string | null;
  implied_gain_pct: number | null;
  score: { total: number; signal: string; provisional?: boolean } | null;
};

const SIGNAL_TONE: Record<string, string> = {
  positive: "text-emerald-500",
  neutral: "text-amber-500",
  weak: "text-rose-500",
};

const ago = (iso: string) => {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
  if (mins < 60) return `${mins} min ago`;
  const h = Math.round(mins / 60);
  return h < 48 ? `${h} h ago` : `${Math.round(h / 24)} days ago`;
};

const day = (d: string) =>
  new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

/** Live from IPO Analyser: the IPOs open for bidding right now, strongest signal first. */
export default function IpoSignals() {
  const [ipos, setIpos] = useState<Ipo[] | null>(null);
  const [updated, setUpdated] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/api/ipos.json`).then((r) => r.json()),
      fetch(`${BASE}/api/status.json`).then((r) => r.json()),
    ])
      .then(([list, status]) => {
        const open = (list.data as Ipo[])
          .filter((i) => i.status === "open" && i.score)
          .sort((a, b) => b.score!.total - a.score!.total)
          .slice(0, 3);
        setIpos(open);
        setUpdated(status.generated_at ?? null);
      })
      .catch(() => setIpos([]));
  }, []);

  if (!ipos?.length) return null;
  const [top, ...rest] = ipos;

  return (
    <section className="py-12 sm:py-14 animate-in fade-in duration-500">
      <p className="text-[13px] font-medium text-tint">Watching</p>
      <h2 className="display mt-2 text-balance text-[26px] leading-[1.2] sm:text-[30px]">
        Today&apos;s strongest IPO signal
      </h2>

      <a
        href={`${BASE}/ipo/${top.slug}/`}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-6 flex items-end justify-between gap-6 rounded-2xl p-5 ring-1 ring-line/10 transition-colors hover:bg-fg/[0.03] sm:p-6"
      >
        <span className="min-w-0">
          <span className="block truncate text-[20px] text-fg transition-colors group-hover:text-tint sm:text-[22px]">
            {top.name}
          </span>
          <span className="mt-1 block text-[14px] text-fg-3">
            {top.segment === "sme" ? "SME" : "Mainboard"}
            {top.close_date && <> · bids close {day(top.close_date)}</>}
            {top.implied_gain_pct != null && (
              <> · implied listing gain {top.implied_gain_pct >= 0 ? "+" : ""}{top.implied_gain_pct.toFixed(1)}%</>
            )}
          </span>
        </span>
        <span className="shrink-0 text-right">
          <span className="display block text-[40px] leading-none tabular-nums">{top.score!.total}</span>
          <span className={`mt-1 block text-[13px] capitalize ${SIGNAL_TONE[top.score!.signal] ?? "text-fg-3"}`}>
            {top.score!.signal}
          </span>
        </span>
      </a>

      {rest.length > 0 && (
        <ul className="mt-2">
          {rest.map((i) => (
            <li key={i.slug} className="border-b border-line/[0.07] last:border-0">
              <a
                href={`${BASE}/ipo/${i.slug}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 px-1 py-3"
              >
                <span className="min-w-0 truncate text-[15px] text-fg-2 transition-colors group-hover:text-tint">
                  {i.name}
                </span>
                <span className="shrink-0 text-[14px] tabular-nums text-fg-3">
                  {i.score!.total} · <span className={SIGNAL_TONE[i.score!.signal] ?? ""}>{i.score!.signal}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-5 text-[13px] leading-relaxed text-fg-3">
        Live from{" "}
        <a href={`${BASE}/`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-fg-2 hover:text-tint">
          IPO Analyser
          <ArrowUpRight className="size-3" />
        </a>
        {updated && <>, updated {ago(updated)}</>}. A score out of 100 from grey-market premiums, demand and the
        market. Grey-market premiums are unofficial, so this is research, not advice.
      </p>
    </section>
  );
}
