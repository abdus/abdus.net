import { ReactNode } from "react";

type Props = {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
};

/** Every page opens the same way: a large, thin, centred headline. */
export function PageTitle({ eyebrow, title, lede }: Props) {
  return (
    <header className="mx-auto max-w-[46rem] px-6 pb-20 pt-28 text-center sm:pb-28 sm:pt-40">
      {eyebrow && (
        <p className="eyebrow mb-6 animate-in fade-in duration-700">{eyebrow}</p>
      )}
      <h1 className="display text-balance text-[48px] leading-[1.02] animate-in fade-in slide-in-from-bottom-2 duration-1000 sm:text-[80px]">
        {title}
      </h1>
      {lede && (
        <p className="mx-auto mt-8 max-w-[30rem] text-balance text-[17px] leading-relaxed text-fg-2 animate-in fade-in fill-mode-both delay-200 duration-1000 sm:text-[19px]">
          {lede}
        </p>
      )}
    </header>
  );
}
