"use client";

import { useEffect, useState } from "react";
import { Avatar } from "./avatar";
import { cn } from "@/lib/utils";

export type Quote = { html: string; name: string; role: string; avatar?: string };

/** One quote at a time, crossfading. Pauses on hover, focus, or reduced motion. */
export function QuoteCarousel({ quotes }: { quotes: Quote[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || quotes.length < 2) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % quotes.length), 7000);
    return () => clearTimeout(t);
  }, [index, paused, quotes.length]);

  return (
    <div
      className="text-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Every quote occupies the same cell, so height never jumps. */}
      <div className="grid">
        {quotes.map((q, i) => (
          <figure
            key={q.name}
            aria-hidden={i !== index}
            className={cn(
              "col-start-1 row-start-1 transition-all duration-1000 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
              i === index ? "opacity-100 blur-0" : "pointer-events-none opacity-0 blur-[2px]"
            )}
          >
            <blockquote
              className="display text-balance text-[26px] leading-[1.3] text-fg-2 sm:text-[34px] [&_strong]:font-light [&_strong]:text-fg"
              dangerouslySetInnerHTML={{ __html: `“${q.html}”` }}
            />
            <figcaption className="mt-10 flex flex-col items-center gap-3">
              <Avatar name={q.name} src={q.avatar} className="size-11 text-[44px]" />
              <span className="text-[14px] text-fg">{q.name}</span>
              <span className="-mt-2 text-[13px] text-fg-3">{q.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-10 flex justify-center gap-1" role="tablist" aria-label="Choose a quote">
        {quotes.map((q, i) => (
          <button
            key={q.name}
            role="tab"
            aria-selected={i === index}
            aria-label={`Quote from ${q.name}`}
            onClick={() => setIndex(i)}
            className="grid h-6 w-6 place-items-center"
          >
            <span
              className={cn(
                "block h-1.5 rounded-full transition-all duration-500",
                i === index ? "w-5 bg-fg" : "w-1.5 bg-fg/20 hover:bg-fg/40"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
