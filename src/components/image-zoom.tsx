"use client";

import { useEffect, useState } from "react";

type Shown = { src: string; alt: string };

/**
 * Tap any image in a post to see it full screen. Tap again to zoom in (scroll to pan);
 * pinch-zoom works on phones. Esc, the close button, or tapping the backdrop closes it.
 */
export function ImageZoom() {
  const [shown, setShown] = useState<Shown | null>(null);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const img = (e.target as HTMLElement | null)?.closest?.("img");
      if (!img || !img.closest(".post-body") || img.closest("a")) return;
      e.preventDefault();
      setZoomed(false);
      setShown({ src: img.currentSrc || img.src, alt: img.alt });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!shown) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setShown(null);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [shown]);

  if (!shown) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={shown.alt || "Image"}
      className="fixed inset-0 z-[70] overflow-auto bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && setShown(null)}
    >
      <button
        type="button"
        onClick={() => setShown(null)}
        aria-label="Close"
        className="fixed right-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-white/15 text-[22px] leading-none text-white backdrop-blur transition-colors hover:bg-white/25"
      >
        ×
      </button>
      <div
        className={
          zoomed
            ? "min-h-full w-max p-4"
            : "flex min-h-full items-center justify-center p-4 sm:p-10"
        }
        onClick={(e) => e.target === e.currentTarget && setShown(null)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shown.src}
          alt={shown.alt}
          onClick={() => setZoomed((z) => !z)}
          className={
            zoomed
              ? "block w-[250vw] max-w-none cursor-zoom-out rounded-lg bg-white sm:w-[200vw]"
              : "block max-h-[90vh] w-full max-w-[1400px] cursor-zoom-in rounded-lg bg-white object-contain"
          }
        />
      </div>
    </div>
  );
}
