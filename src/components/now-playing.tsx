"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface NowPlayingData {
  album: string;
  albumImageUrl: string;
  artist: string;
  isPlaying: boolean;
  songUrl: string;
  title: string;
}

/** Equaliser bars: the "something is playing" signal. */
function Bars() {
  return (
    <span className="flex h-3 items-end gap-[2px]" aria-hidden>
      {[0, 0.2, 0.4].map((delay) => (
        <span
          key={delay}
          className="h-full w-[2px] origin-bottom animate-eq-bar rounded-full bg-tint"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </span>
  );
}

/**
 * Appears only while something is playing on Spotify.
 * Refreshes every 30s and when the tab regains focus.
 * `pill` stands alone; `line` sits inside the home page "Now" card.
 */
export default function NowPlaying({
  className,
  variant = "pill",
}: {
  className?: string;
  variant?: "pill" | "line";
}) {
  const [data, setData] = useState<NowPlayingData | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/now-playing");
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch {
        /* Spotify is a nicety; fail silently. */
      }
    };

    load();
    const interval = setInterval(load, 30_000);
    window.addEventListener("focus", load);
    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener("focus", load);
    };
  }, []);

  if (!data?.isPlaying) return null;

  // Inside the Now card the whole card leads to the current project;
  // only the song title links to Spotify (it sits above the card's stretched link).
  if (variant === "line") {
    return (
      <p
        className={cn(
          "pointer-events-none flex min-w-0 items-center gap-3 text-[14px] animate-in fade-in duration-500",
          className
        )}
      >
        <span className="grid w-8 shrink-0 place-items-center">
          <Bars />
        </span>
        <span className="min-w-0 truncate text-fg-2">
          <span className="text-fg-3">Listening to </span>
          <a
            href={data.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto relative z-10 text-fg underline decoration-line/20 underline-offset-[3px] transition-colors hover:text-tint hover:decoration-tint/40"
          >
            {data.title}
          </a>
          <span className="text-fg-3"> · {data.artist}</span>
        </span>
      </p>
    );
  }

  return (
    <a
      href={data.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex max-w-full items-center gap-3 rounded-full",
        "py-1.5 pl-1.5 pr-4 text-[13px] ring-1 ring-line/10 transition-colors hover:bg-fg/[0.04]",
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={data.albumImageUrl}
        alt=""
        width={28}
        height={28}
        className="size-7 shrink-0 rounded-full object-cover"
      />
      <Bars />
      <span className="min-w-0 truncate text-fg-2">
        <span className="sr-only">Now playing: </span>
        <span className="text-fg">{data.title}</span>
        <span className="text-fg-3"> · {data.artist}</span>
      </span>
    </a>
  );
}
