import Link from "next/link";

/** A plain heading in the voice of the page, with an optional quiet link. */
export function SectionLabel({ children, href, link }: { children: string; href?: string; link?: string }) {
  return (
    <div className="mb-2 flex items-baseline justify-between">
      <h2 className="text-[17px] font-medium text-fg">{children}</h2>
      {href && (
        <Link href={href} className="text-[14px] text-fg-3 transition-colors hover:text-fg">
          {link} →
        </Link>
      )}
    </div>
  );
}
