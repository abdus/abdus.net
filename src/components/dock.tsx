"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { applyTheme, type ThemePreference } from "@/lib/theme";

const links = [
  { href: "/", label: "Home", match: (p: string) => p === "/" },
  { href: "/posts", label: "Writing", match: (p: string) => /^\/(posts|notes|tags)/.test(p) },
  { href: "/projects", label: "Work", match: (p: string) => p.startsWith("/projects") },
  { href: "/about", label: "About", match: (p: string) => /^\/(about|testimonials)/.test(p) },
];

const ORDER: ThemePreference[] = ["system", "light", "dark"];
const LABEL: Record<ThemePreference, string> = {
  system: "Theme: automatic",
  light: "Theme: light",
  dark: "Theme: dark",
};

/**
 * The site's one piece of chrome: a glass dock that floats at the bottom.
 * Holds navigation and the theme switch; on articles its edge fills with
 * reading progress.
 */
export function Dock() {
  const pathname = usePathname() || "/";
  const isArticle = /^\/(posts|notes)\/.+/.test(pathname);
  const [theme, setTheme] = useState<ThemePreference>("system");
  const progress = useRef<HTMLDivElement>(null);

  // Sync with the preference the head script already applied.
  useEffect(() => {
    const stored = document.documentElement.dataset.theme as ThemePreference | undefined;
    if (stored && ORDER.includes(stored)) setTheme(stored);
  }, []);

  // Follow the OS while in automatic mode.
  useEffect(() => {
    if (theme !== "system") return;
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  // Reading progress, rAF-throttled.
  useEffect(() => {
    if (!isArticle) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      const value = max > 0 ? Math.min(1, scrollY / max) : 0;
      progress.current?.style.setProperty("transform", `scaleX(${value})`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, [isArticle, pathname]);

  const cycleTheme = () => {
    const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
    setTheme(next);
    applyTheme(next);
  };

  return (
    <nav
      aria-label="Primary"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
    >
      <div
        className={cn(
          "pointer-events-auto relative flex items-center gap-0.5 overflow-hidden rounded-full p-1",
          "bg-glass/70 backdrop-blur-2xl backdrop-saturate-[1.8]",
          "shadow-[0_0_0_0.5px_rgb(var(--line)/0.12),0_8px_32px_-8px_rgb(0_0_0/0.25),0_2px_6px_-2px_rgb(0_0_0/0.08)]"
        )}
      >
        {links.map(({ href, label, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-full px-3.5 py-2 text-[13px] font-medium tracking-[-0.01em] transition-colors duration-300 sm:px-4",
                active ? "bg-fg text-bg" : "text-fg-2 hover:text-fg"
              )}
            >
              {label}
            </Link>
          );
        })}

        <span className="mx-1 h-4 w-px bg-line/15" aria-hidden />

        <button
          type="button"
          onClick={cycleTheme}
          aria-label={`${LABEL[theme]}. Change theme`}
          title={LABEL[theme]}
          className="grid size-9 place-items-center rounded-full text-fg-2 transition-colors hover:text-fg"
        >
          <ThemeGlyph theme={theme} />
        </button>

        {isArticle && (
          <div className="absolute inset-x-4 bottom-0 h-[2px] overflow-hidden rounded-full" aria-hidden>
            <div ref={progress} className="h-full origin-left scale-x-0 bg-tint" />
          </div>
        )}
      </div>
    </nav>
  );
}

/** One circle, three states: half-filled (auto), open (light), filled (dark). */
function ThemeGlyph({ theme }: { theme: ThemePreference }) {
  return (
    <svg viewBox="0 0 20 20" className="size-[18px]" aria-hidden>
      <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M10 3a7 7 0 0 1 0 14Z"
        fill="currentColor"
        className="transition-opacity duration-500 ease-out"
        style={{ opacity: theme === "light" ? 0 : 1 }}
      />
      <path
        d="M10 3a7 7 0 0 0 0 14Z"
        fill="currentColor"
        className="transition-opacity duration-500 ease-out"
        style={{ opacity: theme === "dark" ? 1 : 0 }}
      />
    </svg>
  );
}
