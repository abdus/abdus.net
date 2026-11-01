import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  date?: string;
  minutes?: number;
  kind?: string;
};

export function PostHeader({ title, date, minutes, kind }: Props) {
  const meta = [
    kind,
    date && <DateFormatter key="d" dateString={date} />,
    minutes && `${minutes} min read`,
  ].filter(Boolean);

  return (
    <header className="mx-auto max-w-[50rem] px-6 pb-20 pt-28 text-center sm:pb-24 sm:pt-40">
      {meta.length > 0 && (
        <p className="eyebrow mb-8 flex flex-wrap items-center justify-center gap-x-3 animate-in fade-in duration-700">
          {meta.map((m, i) => (
            <span key={i} className="flex items-center gap-x-3">
              {i > 0 && <span aria-hidden className="text-fg-3/50">/</span>}
              {m}
            </span>
          ))}
        </p>
      )}
      <h1 className="display text-balance text-[40px] leading-[1.06] animate-in fade-in slide-in-from-bottom-2 duration-1000 sm:text-[64px]">
        {title}
      </h1>
    </header>
  );
}
