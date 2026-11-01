import Link from "next/link";
import { ArrowRight } from "./icons";

type Props = {
  title: string;
  href?: string;
  linkLabel?: string;
};

export function SectionHeader({ title, href, linkLabel = "See all" }: Props) {
  return (
    <div className="mb-6 flex items-baseline justify-between gap-4">
      <h2 className="font-display text-[24px] font-semibold tracking-tight text-fg sm:text-[28px]">
        {title}
      </h2>
      {href && (
        <Link href={href} className="link-arrow">
          {linkLabel}
          <ArrowRight />
        </Link>
      )}
    </div>
  );
}
