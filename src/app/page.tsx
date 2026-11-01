import Link from "next/link";
import Container from "@/components/container";
import NowPlaying from "@/components/now-playing";
import { PostList } from "@/components/post-list";
import { ProjectGrid } from "@/components/project-list";
import { SectionHeader } from "@/components/section-header";
import { TestimonialSummary } from "@/components/testimonial-summary";
import { ArrowRight } from "@/components/icons";
import { featuredProjects } from "@/data/projects";
import { getAllWriting } from "@/lib/api";
import { SITE } from "@/lib/constants";

export default function Home() {
  const writing = getAllWriting().slice(0, 6);
  const projects = featuredProjects();

  return (
    <main>
      <Container>
        {/* Hero */}
        <section className="pb-24 pt-16 sm:pb-32 sm:pt-28">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/me.jpg"
            alt="Abdus Azad"
            width={72}
            height={72}
            className="size-[72px] animate-fade-up rounded-full object-cover ring-1 ring-line/10"
          />

          <h1
            className="mt-8 max-w-[48rem] animate-fade-up font-display text-[38px] font-semibold leading-[1.06] tracking-tightest sm:text-[64px] lg:text-[72px]"
            style={{ animationDelay: "80ms" }}
          >
            <span className="text-fg">Abdus Azad.</span>{" "}
            <span className="text-fg-3">
              Software engineer, building fast and considered things for the web.
            </span>
          </h1>

          <p
            className="mt-8 max-w-[34rem] animate-fade-up text-[19px] leading-relaxed text-fg-2 sm:text-[21px]"
            style={{ animationDelay: "160ms" }}
          >
            I work mostly with Node and React at an early-stage startup, and
            write about what I learn along the way. Away from the keyboard, I
            travel and trek.
          </p>

          <div
            className="mt-10 flex animate-fade-up flex-wrap items-center gap-x-6 gap-y-4"
            style={{ animationDelay: "240ms" }}
          >
            <a
              href={`mailto:${SITE.email}`}
              className="rounded-full bg-tint px-5 py-2.5 text-[15px] font-medium text-white transition-[filter,transform] hover:brightness-110 active:scale-[0.98]"
            >
              Get in touch
            </a>
            <Link href={SITE.resume} className="link-arrow">
              Résumé <ArrowRight />
            </Link>
            <a
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="link-arrow"
            >
              GitHub <ArrowRight />
            </a>
          </div>

          <NowPlaying className="mt-12" />
        </section>

        <div className="space-y-28 sm:space-y-36">
          <section>
            <SectionHeader title="Latest writing" href="/posts" linkLabel="All writing" />
            <PostList posts={writing} />
          </section>

          <section>
            <SectionHeader title="Selected projects" href="/projects" linkLabel="All projects" />
            <ProjectGrid projects={projects} />
          </section>

          <TestimonialSummary />
        </div>
      </Container>
    </main>
  );
}
