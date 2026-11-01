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
    <header className="animate-fade-up pb-12 pt-16 sm:pb-16 sm:pt-24">
      {meta.length > 0 && (
        <p className="eyebrow mb-4 flex flex-wrap items-center gap-x-2">
          {meta.map((m, i) => (
            <span key={i} className="flex items-center gap-x-2">
              {i > 0 && <span aria-hidden>·</span>}
              {m}
            </span>
          ))}
        </p>
      )}
      <h1 className="font-display text-[36px] font-semibold leading-[1.08] tracking-tightest text-fg sm:text-[52px]">
        {title}
      </h1>
    </header>
  );
}
