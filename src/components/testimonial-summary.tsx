import testimonialData from "@/data/testimonials.json";
import { Summary, authorLine } from "./testimonial-card";
import { SectionHeader } from "./section-header";

const PICKS = ["Matt Smith", "Andrei Neagoie", "Omkar Gunjal"];

const picks = PICKS.map((name) =>
  testimonialData.testimonials.find((t) => t.author.name === name)
).filter((t): t is (typeof testimonialData.testimonials)[number] => !!t);

export function TestimonialSummary() {
  return (
    <section>
      <SectionHeader title="Kind words" href="/testimonials" linkLabel="Read all" />
      <div className="grid gap-4 md:grid-cols-3">
        {picks.map((t) => (
          <figure
            key={t.author.name}
            className="flex flex-col rounded-3xl bg-surface p-7"
          >
            <blockquote>
              <Summary html={t.summary} className="text-[16px] leading-relaxed" />
            </blockquote>
            <figcaption className="mt-auto pt-6 text-[13px] leading-tight">
              <p className="font-medium text-fg">{t.author.name}</p>
              <p className="mt-1 text-fg-3">{authorLine(t.author)}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
