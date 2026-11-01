import { Metadata } from "next";
import Container from "@/components/container";
import { PageTitle } from "@/components/page-title";
import { ProjectIndex, ProjectRow } from "@/components/project-list";
import { currentProjects, earlyProjects, projectsByYear } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I've built, newest first.",
};

export default function ProjectsPage() {
  const now = currentProjects();
  const early = earlyProjects();

  return (
    <main>
      <PageTitle
        title="Projects"
        lede="Things I've built, newest first. Most started as a way to learn something."
      />
      <Container>
        {now.length > 0 && (
          <section aria-labelledby="now" className="mb-20">
            <h2 id="now" className="mb-1 flex items-center gap-2 text-[17px] font-medium text-fg">
              <span className="relative flex size-2" aria-hidden>
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-tint/60 [animation-duration:2.4s]" />
                <span className="relative inline-flex size-2 rounded-full bg-tint" />
              </span>
              Working on now
            </h2>
            <ul>
              {now.map((p) => (
                <ProjectRow key={p.title} project={p} size="lg" />
              ))}
            </ul>
          </section>
        )}

        <div className="space-y-16">
          {projectsByYear().map(([year, items]) => (
            <section key={year} aria-label={String(year)}>
              <h2 className="mb-1 text-[17px] font-medium tabular-nums text-fg-3">{year}</h2>
              <ProjectIndex projects={items} />
            </section>
          ))}
        </div>

        {early.length > 0 && (
          <details className="group mt-20">
            <summary className="flex cursor-pointer list-none items-baseline justify-between border-b border-line/10 pb-4 [&::-webkit-details-marker]:hidden">
              <span className="text-[17px] font-medium text-fg">
                Earlier projects{" "}
                <span className="font-normal text-fg-3">· {early.length}</span>
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
            <ProjectIndex projects={early} />
          </details>
        )}
      </Container>
    </main>
  );
}
