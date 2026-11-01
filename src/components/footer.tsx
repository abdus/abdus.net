import Link from "next/link";
import { SITE } from "@/lib/constants";

const links = [
  { href: `mailto:${SITE.email}`, label: "Email" },
  { href: SITE.github, label: "GitHub" },
  { href: SITE.linkedin, label: "LinkedIn" },
  { href: SITE.resume, label: "Résumé" },
  { href: "/feed.xml", label: "RSS" },
];

export function Footer() {
  return (
    <footer className="mt-32 border-t border-line/10">
      <div className="mx-auto flex w-full max-w-[60rem] flex-col gap-4 px-6 py-10 text-[13px] text-fg-3 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {SITE.name}.
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
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
      </div>
    </footer>
  );
}

export default Footer;
