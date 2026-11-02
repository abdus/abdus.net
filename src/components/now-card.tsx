import Link from "next/link";
import NowPlaying from "./now-playing";
import { currentProjects } from "@/data/projects";

/**
 * A one-glance status on the home page: what I'm building, and what's playing.
 * Clicks: anywhere on the card → /now; the project name → its site; the song title → Spotify.
 */
export function NowCard() {
  const project = currentProjects()[0];
  if (!project) return null;
  const href = project.site || project.source;

  return (
    <section
      aria-label="What I'm doing now"
      className="group relative -mx-3 rounded-2xl px-3 py-3.5 transition-colors hover:bg-tint/[0.05] sm:-mx-4 sm:px-4"
      style={{ boxShadow: "inset 0 0 0 0.5px rgb(var(--tint) / 0.22)" }}
    >
      {/* The whole card leads to the /now page. Links inside sit above it. */}
      <Link href="/now" aria-label="What I'm up to now" className="absolute inset-0 rounded-2xl" />

      <div className="flex items-center gap-3">
        {project.icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.icon} alt="" width={32} height={32} className="size-8 shrink-0 rounded-[9px]" />
        ) : (
          <span className="size-8 shrink-0 rounded-[9px] bg-surface" aria-hidden />
        )}

        <p className="pointer-events-none min-w-0 flex-1 text-[15px] leading-snug text-fg-2">
          {/* Plain inline text, so "Now" shares the sentence's baseline; the dot is centred on its x-height. */}
          <span className="mr-1.5 whitespace-nowrap text-[13px] font-medium text-tint">
            <span className="relative mr-1.5 inline-flex size-1.5 -translate-y-[1.5px] align-middle" aria-hidden>
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-tint/60 [animation-duration:2.4s]" />
              <span className="relative inline-flex size-1.5 rounded-full bg-tint" />
            </span>
            Now
          </span>
          Building{" "}
          {href ? (
            <Link
              href={href}
              {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="pointer-events-auto relative z-10 text-fg underline decoration-line/20 underline-offset-[3px] transition-colors hover:text-tint hover:decoration-tint/40"
            >
              {project.title}
            </Link>
          ) : (
            <span className="text-fg">{project.title}</span>
          )}
          {project.nowLine && <>, {project.nowLine}</>}.
        </p>

        {project.status && (
          <span className="pointer-events-none hidden shrink-0 rounded-full bg-tint/[0.08] px-2.5 py-1 text-[12px] font-medium text-tint sm:inline">
            {project.status}
          </span>
        )}
      </div>

      <NowPlaying variant="line" className="mt-2.5" />
    </section>
  );
}
