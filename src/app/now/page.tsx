import { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/container";
import DateFormatter from "@/components/date-formatter";
import NowPlaying from "@/components/now-playing";
import { PageTitle } from "@/components/page-title";
import { Reveal } from "@/components/reveal";
import { ArrowUpRight } from "@/components/icons";
import { NOW } from "@/data/now";
import { projects } from "@/data/projects";
import { getAllWriting, hrefFor } from "@/lib/api";
import LocalTime from "@/components/local-time";

type Shipped = { date: string; title: string; note: string; href?: string };

/** What went out lately: project releases plus anything I wrote, within two months of the last update. */
function latelyShipped(): Shipped[] {
  const since = new Date(NOW.updated).getTime() - 60 * 864e5;
  const fromProjects: Shipped[] = projects
    .filter((p) => p.shipped)
    .map((p) => ({ date: p.shipped!.date, title: p.title, note: p.shipped!.note, href: p.site || p.source }));
  const fromWriting: Shipped[] = getAllWriting().map((post) => ({
    date: new Date(post.date).toISOString().slice(0, 10),
    title: post.title,
    note: post.archetype === "note" ? "A note" : "A new post",
    href: hrefFor(post),
  }));
  return [...fromProjects, ...fromWriting]
    .filter((s) => new Date(s.date).getTime() >= since)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);
}

const shortDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

export const metadata: Metadata = {
  title: "Now",
  description: "What I'm focused on at this point in my life.",
};

export default function NowPage() {
  const shipped = latelyShipped();
  return (
    <main>
      <PageTitle
        eyebrow={
          <>
            Updated <DateFormatter dateString={NOW.updated} />
            <LocalTime />
          </>
        }
        title="Now"
        lede={NOW.intro}
      />

      <Container>
        <div className="divide-y divide-line/[0.07] border-t border-line/[0.07]">
          {NOW.items.map((item, i) => (
            <Reveal as="section" key={item.label} className="py-12 sm:py-14" delay={i === 0 ? 0 : 60}>
              <p className="text-[13px] font-medium text-tint">{item.label}</p>
              <h2 className="display mt-2 text-balance text-[26px] leading-[1.2] sm:text-[30px]">
                {item.title}
              </h2>
              <p className="mt-4 text-[17px] leading-[1.7] text-fg-2">{item.body}</p>

              {item.stats && (
                <dl
                  className={
                    item.stats.length > 1
                      ? "mt-8 grid grid-cols-3 gap-4 sm:gap-8"
                      : "mt-8"
                  }
                >
                  {item.stats.map((s) => (
                    <div key={s.label}>
                      <dt className="sr-only">{s.label}</dt>
                      <dd className="display text-[26px] leading-none tabular-nums sm:text-[40px]">
                        {s.value}
                      </dd>
                      <dd className="mt-2 text-[13px] leading-snug text-fg-3">{s.label}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {item.photos && (
                <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                  {item.photos.map((ph) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={ph.src}
                      src={ph.src}
                      alt={ph.alt}
                      loading="lazy"
                      className="aspect-[4/5] w-full rounded-xl object-cover ring-1 ring-line/10"
                    />
                  ))}
                </div>
              )}

              {item.link && (
                <Link
                  href={item.link.href}
                  {...(item.link.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="mt-6 inline-flex items-center gap-1 text-[15px] text-tint hover:underline hover:underline-offset-4"
                >
                  {item.link.label}
                  <ArrowUpRight className="size-3.5" />
                </Link>
              )}
            </Reveal>
          ))}

          {shipped.length > 0 && (
            <section className="py-12 sm:py-14">
              <p className="text-[13px] font-medium text-tint">Lately shipped</p>
              <ul className="mt-5">
                {shipped.map((s) => {
                  const body = (
                    <>
                      <span className="w-14 shrink-0 pt-[3px] text-[13px] tabular-nums text-fg-3">
                        {shortDate(s.date)}
                      </span>
                      <span className="min-w-0">
                        <span className="text-[17px] text-fg transition-colors group-hover:text-tint">{s.title}</span>
                        <span className="mt-0.5 block text-[15px] leading-relaxed text-fg-2">{s.note}</span>
                      </span>
                    </>
                  );
                  return (
                    <li key={s.title + s.date} className="border-b border-line/[0.07] last:border-0">
                      {s.href ? (
                        <Link
                          href={s.href}
                          {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="group flex gap-4 py-3.5"
                        >
                          {body}
                        </Link>
                      ) : (
                        <div className="flex gap-4 py-3.5">{body}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* Live from Spotify. */}
          <section className="py-12 sm:py-14">
            <p className="text-[13px] font-medium text-tint">Listening</p>
            <div className="mt-4">
              <NowPlaying
                fallback={
                  <p className="text-[17px] text-fg-2">
                    Nothing playing right now. Check back in a bit.
                  </p>
                }
              />
            </div>
          </section>
        </div>

        <p className="mt-16 text-[14px] leading-relaxed text-fg-3">
          This is a{" "}
          <Link href="https://nownownow.com/about" className="link" target="_blank" rel="noopener noreferrer">
            now page
          </Link>
          , an idea from Derek Sivers. If you have a site of your own, you should make one too.
        </p>
      </Container>
    </main>
  );
}
