import Link from "next/link";

/** A whisper, not a headline: small caps label with an optional quiet link. */
export function SectionLabel({ children, href, link }: { children: string; href?: string; link?: string }) {
  return (
    <div className="mb-8 flex items-baseline justify-between border-b border-line/10 pb-4">
      <h2 className="eyebrow">{children}</h2>
      {href && (
        <Link href={href} className="text-[13px] text-fg-2 transition-colors hover:text-fg">
          {link}
        </Link>
      )}
    </div>
  );
}
