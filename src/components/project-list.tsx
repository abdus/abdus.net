import Link from "next/link";
import type { Project } from "@/data/projects";
import { ArrowUpRight } from "./icons";
import { ProjectMedia } from "./project-media";
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
          <ArrowUpRight className="size-3" />
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

/** A project with something to show: preview first, then the words. */
export function ProjectShowcase({ project, stars }: { project: Project; stars?: Stars }) {
  const href = primaryHref(project);
  return (
    <article className="group/card">
      {href && project.media?.kind === "image" ? (
        <Link href={href} {...linkProps(href)} aria-label={`Open ${project.title}`} className="block">
          <ProjectMedia media={project.media} />
        </Link>
      ) : (
        project.media && <ProjectMedia media={project.media} />
      )}
      <div className="mt-6">
        <Title project={project} className="text-[22px]" />
        <p className="mt-1.5 text-[16px] leading-relaxed text-fg-2">{project.description}</p>
        <div className="mt-3">
          <Meta project={project} stars={stars} />
        </div>
      </div>
    </article>
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
