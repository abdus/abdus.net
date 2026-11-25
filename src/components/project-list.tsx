import Link from "next/link";
import type { Project } from "@/data/projects";
import { ArrowUpRight } from "./icons";
import { ProjectMedia } from "./project-media";
import { ProjectIcon } from "./project-icon";
import { cn } from "@/lib/utils";

export type Stars = Record<string, number>;

const isExternal = (href: string) => href.startsWith("http");
const linkProps = (href: string) =>
  isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};

/** Where the project's name takes you: the thing itself, else its code. Retired sites go nowhere. */
const primaryHref = (p: Project) => (p.retired ? p.source : p.site || p.source);

const starsFor = (p: Project, stars?: Stars) =>
  p.source ? stars?.[p.source.toLowerCase().replace(/\/$/, "")] : undefined;

function Meta({ project, stars }: { project: Project; stars?: Stars }) {
  const count = starsFor(project, stars);
  const links = [
    !project.retired && project.site && { href: project.site, label: project.siteLabel || "Website" },
    project.source && { href: project.source, label: "Source" },
    ...(project.links || []),
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px]">
      <span className="text-fg-3">{project.tech}</span>
      {!!count && count > 1 && (
        <span className="tabular-nums text-fg-3" title={`${count} stars on GitHub`}>
          ★ {count}
        </span>
      )}
      {links.map(({ href, label }) => (
        <Link
          key={label}
          href={href}
          {...linkProps(href)}
          className="inline-flex items-center gap-0.5 text-fg-2 transition-colors hover:text-tint"
        >
          {label}
          {isExternal(href) ? <ArrowUpRight className="size-3" /> : <span aria-hidden>→</span>}
        </Link>
      ))}
    </div>
  );
}

function Title({ project, className }: { project: Project; className?: string }) {
  const href = primaryHref(project);
  const text = (
    <span
      className={cn(
        "tracking-[-0.01em] transition-colors",
        project.retired ? "text-fg-2" : "text-fg group-hover/title:text-tint",
        className
      )}
    >
      {project.title}
    </span>
  );
  return (
    <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
      {href ? (
        <Link href={href} {...linkProps(href)} className="group/title">
          {text}
        </Link>
      ) : (
        text
      )}
      {(project.retired || project.badge) && (
        <span className="rounded-full bg-fg/[0.06] px-2 py-0.5 text-[11px] font-medium text-fg-3">
          {project.retired ? "Retired" : project.badge}
        </span>
      )}
    </span>
  );
}

/** Compact row: name, one line, meta. */
export function ProjectRow({ project, stars }: { project: Project; stars?: Stars }) {
  return (
    <li className="border-b border-line/[0.07] py-5">
      <Title project={project} className="text-[18px]" />
      <p className={cn("mt-1 text-[15px] leading-relaxed", project.retired ? "text-fg-3" : "text-fg-2")}>
        {project.description}
      </p>
      <div className="mt-2.5">
        <Meta project={project} stars={stars} />
      </div>
    </li>
  );
}

/** A small, still glimpse of the project, beside its row on wider screens. */
function Thumb({ project }: { project: Project }) {
  const { media } = project;
  if (!media) return null;
  const frame =
    "block aspect-[16/10] w-[168px] overflow-hidden rounded-xl bg-surface ring-1 ring-line/10";
  if (media.kind === "terminal") {
    return (
      <span aria-hidden className={cn(frame, "bg-[#161618] px-2.5 py-3 font-mono text-[5.5px] leading-[2] text-[#e5e5ea]")}>
        {media.lines.map((l, i) => (
          <span key={i} className={cn("block whitespace-pre", l.dim && "text-white/45")}>
            {l.prompt && <span className="text-[#30d158]">$ </span>}
            {l.text}
          </span>
        ))}
      </span>
    );
  }
  return (
    <span className={frame}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={media.thumb ?? media.src} alt="" width={168} height={105} loading="lazy" className="size-full object-cover object-top" />
    </span>
  );
}

/**
 * The one idea: each project reads like an entry on a home screen. Icon, name,
 * what it is, where to get it. The full preview and story open underneath.
 */
export function ProjectShowcase({ project, stars }: { project: Project; stars?: Stars }) {
  return (
    <li className="group/item border-b border-line/[0.07] py-7">
      <div className="flex items-start gap-4 sm:gap-5">
        <ProjectIcon project={project} />
        <div className="min-w-0 flex-1">
          <Title project={project} className="text-[19px] font-medium" />
          {project.kind && <p className="mt-0.5 text-[13px] text-fg-3">{project.kind}</p>}
          <p className="mt-2 text-[15px] leading-relaxed text-fg-2">
            {project.short ?? project.description}
          </p>
          <div className="mt-3">
            <Meta project={project} stars={stars} />
          </div>
        </div>
        <div className="hidden shrink-0 sm:block">
          {project.slug ? (
            <Link href={`/projects/${project.slug}`} aria-label={`More about ${project.title}`} className="block">
              <Thumb project={project} />
            </Link>
          ) : (
            <Thumb project={project} />
          )}
        </div>
      </div>
      {project.slug && (
        <Link
          href={`/projects/${project.slug}`}
          className="ml-16 mt-1 inline-flex min-h-11 items-center text-[13px] text-tint sm:ml-[76px]"
        >
          More about it →<span className="sr-only"> ({project.title})</span>
        </Link>
      )}
      {project.media && !project.slug && (
        <details className="group/more mt-1">
          <summary
           
            className="ml-16 inline-flex min-h-11 cursor-pointer list-none items-center text-[13px] text-tint sm:ml-[76px] [&::-webkit-details-marker]:hidden"
          >
            <span className="group-open/more:hidden">Preview</span>
            <span className="hidden group-open/more:inline">Close preview</span>
            <span className="sr-only"> of {project.title}</span>
          </summary>
          <div className="pt-2 animate-in fade-in slide-in-from-top-1 duration-300">
            {project.short && (
              <p className="mb-5 text-[16px] leading-relaxed text-fg-2">{project.description}</p>
            )}
            <ProjectMedia media={project.media} />
          </div>
        </details>
      )}
    </li>
  );
}

/** A plain list of projects (home page, by-year lists, early projects). */
export function ProjectIndex({ projects, stars }: { projects: Project[]; stars?: Stars }) {
  return (
    <ul className="focus-list">
      {projects.map((p) => (
        <ProjectRow key={p.title} project={p} stars={stars} />
      ))}
    </ul>
  );
}
