import Link from "next/link";
import Container from "@/components/container";
import NowPlaying from "@/components/now-playing";
import { PostList } from "@/components/post-list";
import { ProjectIndex } from "@/components/project-list";
import { QuoteCarousel } from "@/components/quote-carousel";
import { Reveal } from "@/components/reveal";
import { SectionLabel } from "@/components/section-label";
import { authorLine } from "@/components/testimonial-card";
import testimonialData from "@/data/testimonials.json";
import { featuredProjects } from "@/data/projects";
import { getAllWriting } from "@/lib/api";
import { SITE } from "@/lib/constants";

const QUOTED = ["Matt Smith", "Andrei Neagoie", "Omkar Gunjal", "Manisha Sharma"];

export default function Home() {
  const writing = getAllWriting().slice(0, 5);
  const projects = featuredProjects();
  const quotes = QUOTED.flatMap((name) => {
    const t = testimonialData.testimonials.find((t) => t.author.name === name);
    return t
      ? [{ html: t.summary, name, role: authorLine(t.author), avatar: t.author.avatar }]
      : [];
  });

  return (
    <main>
      {/* One sentence, alone in the room. */}
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 pb-24 text-center">
        <p className="eyebrow animate-in fade-in duration-1000">{SITE.name}</p>
        <h1 className="display mt-8 max-w-[15ch] text-balance text-[52px] leading-[1.02] animate-in fade-in slide-in-from-bottom-3 fill-mode-both delay-150 duration-1000 sm:text-[88px] lg:text-[104px]">
          I build software for&nbsp;the&nbsp;web.
        </h1>
        <p className="mt-8 max-w-[26rem] text-balance text-[17px] leading-relaxed text-fg-2 animate-in fade-in fill-mode-both delay-500 duration-1000 sm:text-[19px]">
          And I write down what I learn along the way.
        </p>
        <div className="mt-10 animate-in fade-in fill-mode-both delay-700 duration-1000">
          <NowPlaying />
        </div>

        <div
          className="absolute bottom-28 left-1/2 h-10 w-px -translate-x-1/2 overflow-hidden bg-line/10 animate-in fade-in fill-mode-both delay-1000 duration-1000"
          aria-hidden
        >
          <div className="h-1/2 w-full animate-[scroll-cue_2.4s_ease-in-out_infinite] bg-fg/50" />
        </div>
      </section>

      <Container>
        <Reveal as="section" className="text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/me.jpg"
            alt="Abdus Azad"
            width={88}
            height={88}
            className="mx-auto size-[88px] rounded-full object-cover"
          />
          <p className="mx-auto mt-10 max-w-[34rem] text-balance text-[21px] font-light leading-[1.6] text-fg-2 sm:text-[24px]">
            I&apos;m Abdus, a software engineer at an early-stage startup, working
            mostly in <span className="text-fg">Node</span> and{" "}
            <span className="text-fg">React</span>. Away from the keyboard, I
            travel and trek.
          </p>
        </Reveal>

        <div className="mt-48 space-y-48">
          <Reveal as="section">
            <SectionLabel href="/posts" link="All writing">Writing</SectionLabel>
            <PostList posts={writing} />
          </Reveal>

          <Reveal as="section">
            <SectionLabel href="/projects" link="All work">Selected work</SectionLabel>
            <ProjectIndex projects={projects} />
          </Reveal>

          <Reveal as="section">
            <SectionLabel href="/testimonials" link="All">Kind words</SectionLabel>
            <div className="pt-8">
              <QuoteCarousel quotes={quotes} />
            </div>
          </Reveal>

          <Reveal as="section" className="text-center">
            <h2 className="display text-[48px] leading-none sm:text-[72px]">Say hello.</h2>
            <p className="mt-8 text-[17px] text-fg-2">
              The best way to reach me is{" "}
              <Link href={`mailto:${SITE.email}`} className="link">
                {SITE.email}
              </Link>
            </p>
          </Reveal>
        </div>
      </Container>
    </main>
  );
}
