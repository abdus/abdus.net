import Link from "next/link";
import type { Project } from "@/data/projects";
import { ArrowUpRight } from "./icons";

/**
 * The one project I'm on right now. No box around it: it stands apart through
 * scale, the live dot, and the real app screen in a phone, not a marketing page.
 */
export function CurrentProject({ project }: { project: Project }) {
  const href = project.site || project.source;

  return (
    <section
      aria-labelledby="now"
      className="grid items-center gap-12 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-12"
    >
      <div>
        <p className="flex items-center gap-2 text-[14px]">
          <span className="relative flex size-2" aria-hidden>
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-tint/60 [animation-duration:2.4s]" />
            <span className="relative inline-flex size-2 rounded-full bg-tint" />
          </span>
          <span id="now" className="font-medium text-tint">Working on now</span>
          {project.status && <span className="text-fg-3">· {project.status}</span>}
        </p>

        <h2 className="display mt-4 text-[48px] leading-none sm:text-[60px]">{project.title}</h2>
        <p className="mt-5 text-[17px] leading-[1.65] text-fg-2 sm:text-[18px]">{project.description}</p>

        {project.stats && (
          <dl className="mt-9 grid grid-cols-3 gap-4 border-t border-line/[0.08] pt-6 sm:gap-6">
            {project.stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="display whitespace-nowrap text-[24px] leading-none tabular-nums sm:text-[28px]">{s.value}</dd>
                <dd className="mt-2 text-[12px] leading-snug text-fg-3 sm:text-[13px]">{s.label}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px]">
          {href && (
            <Link
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-tint hover:underline hover:underline-offset-4"
            >
              {href.replace(/^https?:\/\//, "")}
              <ArrowUpRight className="size-3.5" />
            </Link>
          )}
          <span className="text-fg-3">{project.tech}</span>
        </div>
      </div>

      {project.screen && (
        <Link
          href={href || "#"}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${project.title}`}
          className="group relative mx-auto block w-[230px] sm:w-[220px]"
        >
          {/* A soft glow in the accent colour, so the phone sits in light rather than in a box. */}
          <span
            aria-hidden
            className="absolute inset-x-[-8%] top-[10%] h-[70%] rounded-full bg-tint/25 blur-3xl sm:inset-x-[-30%]"
          />
          <span className="relative block rounded-[42px] bg-[#111] p-[8px] shadow-[0_30px_60px_-25px_rgb(0_0_0/0.45),0_0_0_0.5px_rgb(255_255_255/0.08)_inset] transition-transform duration-700 ease-out group-hover:-translate-y-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.screen}
              alt={`${project.title} showing a month of spending, by category and by day`}
              width={676}
              height={1234}
              className="block aspect-[676/1234] w-full rounded-[34px] bg-white object-cover"
            />
          </span>
        </Link>
      )}
    </section>
  );
}
