"use client";

import { useEffect, useState } from "react";
import type { TopTrack } from "@/lib/spotify";

/** My most-played tracks this month. Renders nothing until Spotify has something to say. */
export default function TopTracks() {
  const [tracks, setTracks] = useState<TopTrack[]>([]);

  useEffect(() => {
    fetch("/api/top-tracks")
      .then((r) => r.json())
      .then((d) => setTracks(d.tracks || []))
      .catch(() => {});
  }, []);

  if (!tracks.length) return null;

  return (
    <div className="mt-10 animate-in fade-in duration-500">
      <p className="text-[13px] text-fg-3">On repeat this month</p>
      <ol className="mt-3">
        {tracks.map((t, i) => (
          <li key={t.url} className="border-b border-line/[0.07] last:border-0">
            <a
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 py-2.5"
            >
              <span className="w-4 text-right text-[13px] tabular-nums text-fg-3">{i + 1}</span>
              {t.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.image} alt="" className="size-9 rounded-md" loading="lazy" />
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] text-fg transition-colors group-hover:text-tint">
                  {t.title}
                </span>
                <span className="block truncate text-[13px] text-fg-3">{t.artist}</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
