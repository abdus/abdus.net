import Link from "next/link";
import { SITE } from "@/lib/constants";

const links = [
  { href: SITE.github, label: "GitHub" },
  { href: SITE.linkedin, label: "LinkedIn" },
  { href: SITE.resume, label: "Résumé" },
  { href: "/feed.xml", label: "RSS" },
];

export function Footer() {
  return (
    <footer className="mt-40 pb-36 text-center">
      <div className="mx-auto max-w-[42rem] px-6">
        <div className="mx-auto mb-12 h-px w-10 bg-line/15" aria-hidden />
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] text-fg-2">
          {links.map(({ href, label }) => (
            <li key={label}>
              <Link
                href={href}
                className="transition-colors hover:text-fg"
                {...(href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[12px] text-fg-3">
          © {new Date().getFullYear()} {SITE.name}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
