"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/posts", label: "Writing", match: ["/posts", "/notes", "/tags"] },
  { href: "/projects", label: "Projects", match: ["/projects"] },
  { href: "/about", label: "About", match: ["/about", "/testimonials"] },
];

export default function Header() {
  const pathname = usePathname() || "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        "border-b",
        scrolled
          ? "border-line/10 bg-bg/70 backdrop-blur-xl backdrop-saturate-150"
          : "border-transparent bg-bg/0"
      )}
    >
      <nav className="mx-auto flex h-14 w-full max-w-[60rem] items-center px-6">
        <Link
          href="/"
          className="font-display text-[17px] font-semibold tracking-tight text-fg"
          aria-label="Abdus Azad, home"
        >
          Abdus
        </Link>

        <ul className="ml-auto flex items-center gap-1 sm:gap-2">
          {links.map(({ href, label, match }) => {
            const active = match.some((m) => pathname.startsWith(m));
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[14px] transition-colors",
                    active
                      ? "bg-fg/[0.06] text-fg"
                      : "text-fg-2 hover:text-fg"
                  )}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
