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

/**
 * A quiet pill that appears only while something is playing on Spotify.
 * Refreshes every 30s and when the tab regains focus.
 */
export default function NowPlaying({ className }: { className?: string }) {
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

  return (
    <a
      href={data.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex max-w-full animate-fade-up items-center gap-3 rounded-full",
        "bg-surface py-1.5 pl-1.5 pr-4 text-[13px] transition-colors hover:bg-fg/[0.08]",
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
      <span className="flex h-3 items-end gap-[2px]" aria-hidden>
        {[0, 0.2, 0.4].map((delay) => (
          <span
            key={delay}
            className="h-full w-[2px] origin-bottom animate-eq-bar rounded-full bg-tint"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </span>
      <span className="min-w-0 truncate text-fg-2">
        <span className="sr-only">Now playing: </span>
        <span className="text-fg">{data.title}</span>
        <span className="text-fg-3"> · {data.artist}</span>
      </span>
    </a>
  );
}
