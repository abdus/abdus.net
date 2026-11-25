"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { applyTheme, type ThemePreference } from "@/lib/theme";

const links = [
  { href: "/posts", label: "Writing", match: (p: string) => /^\/(posts|notes|tags)/.test(p) },
  { href: "/projects", label: "Projects", match: (p: string) => p.startsWith("/projects") },
  { href: "/about", label: "About", match: (p: string) => /^\/(about|testimonials)/.test(p) },
];

const ORDER: ThemePreference[] = ["system", "light", "dark"];
const LABEL: Record<ThemePreference, string> = {
  system: "Theme: automatic",
  light: "Theme: light",
  dark: "Theme: dark",
};

/**
 * One plain line of text at the top of the column, and it scrolls away with the
 * page. No bar, no glass, no pill: where you are is simply the darker word.
 * On articles a hairline along the top edge shows reading progress.
 */
export function Nav() {
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
    <>
      <nav aria-label="Primary" className="mx-auto w-full max-w-[42rem] px-6 pt-4 sm:pt-6">
        <div className="flex items-center justify-between text-[14px] sm:text-[15px]">
          <Link
            href="/"
            aria-label="Abdus, home"
            aria-current={pathname === "/" ? "page" : undefined}
            className="flex min-h-11 items-center font-medium text-fg"
          >
            Abdus
          </Link>

          <div className="flex items-center gap-3.5 sm:gap-7">
            {links.map(({ href, label, match }) => {
              const active = match(pathname);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center transition-colors",
                    active ? "text-fg" : "text-fg-2 hover:text-fg"
                  )}
                >
                  {label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={cycleTheme}
              aria-label={`${LABEL[theme]}. Change theme`}
              title={LABEL[theme]}
              className="flex h-11 w-8 items-center justify-end text-fg-2 transition-colors hover:text-fg sm:w-6"
            >
              <ThemeGlyph theme={theme} />
            </button>
          </div>
        </div>
      </nav>

      {isArticle && (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px]" aria-hidden>
          <div ref={progress} className="h-full origin-left scale-x-0 bg-tint" />
        </div>
      )}
    </>
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
