"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = { name: string; src?: string; className?: string };

/** Monochrome portrait; falls back to initials so a broken image never shows. */
export function Avatar({ name, src, className }: Props) {
  const [failed, setFailed] = useState(!src);
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span
      className={cn(
        "relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-surface text-fg-2 ring-1 ring-line/10",
        className
      )}
      aria-hidden
    >
      {failed ? (
        <span className="text-[0.38em] font-medium tracking-wide">{initials}</span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="size-full object-cover grayscale"
        />
      )}
    </span>
  );
}
