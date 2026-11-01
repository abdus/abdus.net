import Link from "next/link";
import NowPlaying from "./now-playing";
import { currentProjects } from "@/data/projects";

/**
 * A one-glance status on the home page: what I'm building, and what's playing.
 * Driven by the same `current` flag as the projects page, so the two never disagree.
 */
export function NowCard() {
  const project = currentProjects()[0];
  if (!project) return null;
  const href = project.site || project.source || "/projects";
  const external = href.startsWith("http");

  return (
    <section
      aria-label="What I'm doing now"
      className="group relative -mx-3 rounded-2xl px-3 py-3.5 transition-colors hover:bg-tint/[0.05] sm:-mx-4 sm:px-4"
      style={{ boxShadow: "inset 0 0 0 0.5px rgb(var(--tint) / 0.22)" }}
    >
      <div className="flex items-center gap-3">
        {project.icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.icon} alt="" width={32} height={32} className="size-8 shrink-0 rounded-[9px]" />
        ) : (
          <span className="size-8 shrink-0 rounded-[9px] bg-surface" aria-hidden />
        )}

        <p className="min-w-0 flex-1 text-[15px] leading-snug">
          <span className="mr-1.5 inline-flex items-center gap-1.5 align-[1px] text-[13px] font-medium text-tint">
            <span className="relative flex size-1.5" aria-hidden>
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-tint/60 [animation-duration:2.4s]" />
              <span className="relative inline-flex size-1.5 rounded-full bg-tint" />
            </span>
            Now
          </span>
          <Link
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="text-fg-2 after:absolute after:inset-0 after:rounded-2xl"
          >
            Building <span className="text-fg transition-colors group-hover:text-tint">{project.title}</span>
            {project.nowLine && <>, {project.nowLine}</>}.
          </Link>
        </p>

        {project.status && (
          <span className="hidden shrink-0 rounded-full bg-tint/[0.08] px-2.5 py-1 text-[12px] font-medium text-tint sm:inline">
            {project.status}
          </span>
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-4">
        <NowPlaying variant="line" className="min-w-0" />
        <Link
          href="/now"
          className="relative z-10 ml-auto shrink-0 text-[13px] text-fg-3 transition-colors hover:text-tint"
        >
          More on what I&apos;m up to →
        </Link>
      </div>
    </section>
  );
}
