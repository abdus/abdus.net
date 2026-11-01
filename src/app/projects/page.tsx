import { Metadata } from "next";
import Container from "@/components/container";
import { PageTitle } from "@/components/page-title";
import { ProjectIndex, ProjectShowcase } from "@/components/project-list";
import { Reveal } from "@/components/reveal";
import {
  currentProjects,
  earlyProjects,
  projectsByYear,
  showcaseProjects,
} from "@/data/projects";
import { getStars } from "@/lib/github";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I've built, newest first.",
};

export default async function ProjectsPage() {
  const stars = await getStars();
  const now = currentProjects();
  const favourites = showcaseProjects();
  const early = earlyProjects();

  return (
    <main>
      <PageTitle
        title="Projects"
        lede="Things I've built. Most started as a way to learn something; a few turned into things I use every day."
      />
      <Container>
        {now.length > 0 && (
          <section
            aria-labelledby="now"
            className={[
              "relative -mx-3 mb-28 overflow-hidden rounded-[28px] p-5 sm:-mx-8 sm:p-8",
              "bg-gradient-to-b from-tint/[0.07] via-tint/[0.025] to-transparent",
              "shadow-[inset_0_0_0_0.5px_rgb(var(--tint)/0.25)]",
            ].join(" ")}
          >
            {/* A slow glow in the corner: the one thing on the page that's alive. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 size-72 animate-[glow_9s_ease-in-out_infinite] rounded-full bg-tint/20 blur-3xl"
            />
            <div className="relative mb-6 flex flex-wrap items-center justify-between gap-3">
              <h2 id="now" className="flex items-center gap-2 text-[15px] font-medium text-tint">
                <span className="relative flex size-2" aria-hidden>
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-tint/60 [animation-duration:2.4s]" />
                  <span className="relative inline-flex size-2 rounded-full bg-tint" />
                </span>
                Working on now
              </h2>
              {now[0]?.status && (
                <span className="rounded-full bg-bg/70 px-2.5 py-1 text-[12px] font-medium text-fg-2 shadow-[inset_0_0_0_0.5px_rgb(var(--line)/0.15)] backdrop-blur">
                  {now[0].status}
                </span>
              )}
            </div>
            <div className="relative space-y-16">
              {now.map((p) => (
                <ProjectShowcase key={p.title} project={p} stars={stars} />
              ))}
            </div>
          </section>
        )}

        {favourites.length > 0 && (
          <section aria-labelledby="favourites" className="mb-28">
            <h2 id="favourites" className="mb-6 text-[17px] font-medium text-fg">
              A few favourites
            </h2>
            <div className="space-y-20">
              {favourites.map((p) => (
                <Reveal key={p.title}>
                  <ProjectShowcase project={p} stars={stars} />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        <h2 className="mb-8 text-[17px] font-medium text-fg">Everything else</h2>
        <div className="space-y-12">
          {projectsByYear().map(([year, items]) => (
            <section key={year} aria-label={String(year)}>
              <h3 className="mb-1 text-[15px] font-medium tabular-nums text-fg-3">{year}</h3>
              <ProjectIndex projects={items} stars={stars} />
            </section>
          ))}
        </div>

        {early.length > 0 && (
          <details className="group mt-20">
            <summary className="flex cursor-pointer list-none items-baseline justify-between border-b border-line/10 pb-4 [&::-webkit-details-marker]:hidden">
              <span className="text-[17px] font-medium text-fg">
                Earlier projects <span className="font-normal text-fg-3">· {early.length}</span>
              </span>
              <span className="text-[14px] text-fg-3 transition-colors group-hover:text-fg">
                <span className="group-open:hidden">Show</span>
                <span className="hidden group-open:inline">Hide</span>
              </span>
            </summary>
            <p className="mt-5 text-[15px] leading-relaxed text-fg-2">
              Where it started: small things I built while learning HTML, CSS
              and JavaScript, mostly in 2018.
            </p>
            <ProjectIndex projects={early} stars={stars} />
          </details>
        )}
      </Container>
    </main>
  );
}
