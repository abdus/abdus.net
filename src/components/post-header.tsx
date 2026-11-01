import DateFormatter from "./date-formatter";
import Container from "./container";

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
    <Container className="pb-12 pt-20 sm:pb-16 sm:pt-28">
      <header className="animate-in fade-in slide-in-from-bottom-1 duration-700">
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
        <h1 className="display text-balance text-[36px] leading-[1.1] sm:text-[48px]">{title}</h1>
      </header>
    </Container>
  );
}
