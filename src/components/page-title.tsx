import { ReactNode } from "react";
import Container from "./container";

type Props = {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
};

/** Pages open like a blog page, not a billboard: left-aligned, in the reading column. */
export function PageTitle({ eyebrow, title, lede }: Props) {
  return (
    <Container className="pb-16 pt-20 sm:pb-20 sm:pt-28">
      <header className="animate-in fade-in slide-in-from-bottom-1 duration-700">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="display text-balance text-[40px] leading-[1.08] sm:text-[52px]">{title}</h1>
        {lede && (
          <p className="mt-5 max-w-[34rem] text-[17px] leading-relaxed text-fg-2 sm:text-[19px]">
            {lede}
          </p>
        )}
      </header>
    </Container>
  );
}
