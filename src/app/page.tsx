import Link from "next/link";
import Container from "@/components/container";
import { NowCard } from "@/components/now-card";
import { Avatar } from "@/components/avatar";
import { PostList } from "@/components/post-list";
import { ProjectIndex } from "@/components/project-list";
import { Reveal } from "@/components/reveal";
import { SectionLabel } from "@/components/section-label";
import { authorLine } from "@/components/testimonial-card";
import testimonialData from "@/data/testimonials.json";
import { featuredProjects } from "@/data/projects";
import { getAllWriting } from "@/lib/api";
import { SITE } from "@/lib/constants";

const QUOTED = ["Matt Smith", "Omkar Gunjal"];

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export default function Home() {
  const writing = getAllWriting().slice(0, 5);
  const projects = featuredProjects();
  const quotes = QUOTED.flatMap((name) => {
    const t = testimonialData.testimonials.find((t) => t.author.name === name);
    return t ? [t] : [];
  });

  return (
    <main>
      <Container>
        {/* A hello, in my own words. */}
        <section className="pb-20 pt-16 sm:pb-24 sm:pt-28">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/me.webp"
            alt="Abdus Azad"
            width={88}
            height={88}
            className="size-[88px] rounded-full object-cover ring-1 ring-line/10 animate-in fade-in zoom-in-95 duration-700"
          />

          <h1 className="display mt-8 text-[40px] leading-[1.1] animate-in fade-in slide-in-from-bottom-1 fill-mode-both delay-100 duration-700 sm:text-[52px]">
            Hi, I&apos;m Abdus.
          </h1>

          <div className="mt-6 animate-in fade-in fill-mode-both delay-150 duration-700">
            <NowCard />
          </div>

          <div className="mt-6 space-y-5 text-[18px] leading-[1.7] text-fg-2 animate-in fade-in fill-mode-both delay-200 duration-700 sm:text-[19px]">
            <p>
              I&apos;m a software engineer at an early-stage startup, where I
              mostly work with <span className="text-fg">Node</span> and{" "}
              <span className="text-fg">React</span>. This is where I write
              down what I learn along the way, and keep the things I&apos;ve
              made.
            </p>
            <p>Outside work, I travel and go trekking whenever I can.</p>
            <p>
              The best way to reach me is{" "}
              <Link href={`mailto:${SITE.email}`} className="link">
                email
              </Link>
              . I&apos;m also on{" "}
              <Link href={SITE.github} className="link" {...external}>
                GitHub
              </Link>{" "}
              and{" "}
              <Link href={SITE.linkedin} className="link" {...external}>
                LinkedIn
              </Link>
              , and my{" "}
              <Link href={SITE.resume} className="link">
                résumé
              </Link>{" "}
              is here if you need it.
            </p>
          </div>

        </section>

        <div className="space-y-24 sm:space-y-28">
          <Reveal as="section">
            <SectionLabel href="/posts" link="All writing">Recent writing</SectionLabel>
            <PostList posts={writing} />
          </Reveal>

          <Reveal as="section">
            <SectionLabel href="/projects" link="All projects">Things I&apos;ve made</SectionLabel>
            <ProjectIndex projects={projects} />
          </Reveal>

          <Reveal as="section">
            <SectionLabel href="/testimonials" link="More">What people say</SectionLabel>
            <div className="divide-y divide-line/[0.07]">
              {quotes.map((t) => (
                <figure key={t.author.name} className="py-6">
                  <blockquote
                    className="text-[18px] font-light leading-[1.6] text-fg-2 [&_strong]:font-normal [&_strong]:text-fg"
                    dangerouslySetInnerHTML={{ __html: `“${t.summary}”` }}
                  />
                  <figcaption className="mt-4 flex items-center gap-3 text-[14px] leading-tight">
                    <Avatar name={t.author.name} src={t.author.avatar} className="size-8 text-[32px]" />
                    <span>
                      <span className="block text-fg">{t.author.name}</span>
                      <span className="block text-fg-3">{authorLine(t.author)}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </main>
  );
}
