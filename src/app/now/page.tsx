import { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/container";
import DateFormatter from "@/components/date-formatter";
import NowPlaying from "@/components/now-playing";
import { PageTitle } from "@/components/page-title";
import { Reveal } from "@/components/reveal";
import { ArrowUpRight } from "@/components/icons";
import { NOW } from "@/data/now";

export const metadata: Metadata = {
  title: "Now",
  description: "What I'm focused on at this point in my life.",
};

export default function NowPage() {
  return (
    <main>
      <PageTitle
        eyebrow={
          <>
            Updated <DateFormatter dateString={NOW.updated} />
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
