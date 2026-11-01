import { ReactNode } from "react";

type Props = {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
};

/** The one large headline each page gets. */
export function PageTitle({ eyebrow, title, lede }: Props) {
  return (
    <header className="animate-fade-up pb-12 pt-16 sm:pb-16 sm:pt-24">
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h1 className="font-display text-[40px] font-semibold leading-[1.05] tracking-tightest text-fg sm:text-[56px]">
        {title}
      </h1>
      {lede && (
        <p className="mt-5 max-w-[36rem] text-[19px] leading-relaxed text-fg-2 sm:text-[21px]">
          {lede}
        </p>
      )}
    </header>
  );
}
