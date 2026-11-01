import Link from "next/link";
import type { Project } from "@/data/projects";
import { ArrowUpRight } from "./icons";
import { cn } from "@/lib/utils";

const isExternal = (href: string) => href.startsWith("http");
const linkProps = (href: string) =>
  isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};

/** Where the project's name should take you: the thing itself, else its code. */
const primaryHref = (p: Project) => p.site || p.source;

function ProjectLinks({ project }: { project: Project }) {
  const links = [
    project.site && { href: project.site, label: isExternal(project.site) ? "Website" : "Try it" },
    project.source && { href: project.source, label: "Source" },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
      <span className="text-fg-3">{project.tech}</span>
      {links.map(({ href, label }) => (
        <Link
          key={label}
          href={href}
          {...linkProps(href)}
          className="inline-flex items-center gap-0.5 text-fg-2 transition-colors hover:text-tint"
        >
          {label}
          {isExternal(href) && <ArrowUpRight className="size-3" />}
        </Link>
      ))}
    </span>
  );
}

export function ProjectRow({ project, size = "md" }: { project: Project; size?: "md" | "lg" }) {
  const href = primaryHref(project);
  const title = (
    <span className={cn("tracking-[-0.01em] text-fg transition-colors group-hover/title:text-tint", size === "lg" ? "text-[22px]" : "text-[18px]")}>
      {project.title}
    </span>
  );

  return (
    <li className="border-b border-line/[0.07] py-5">
      {href ? (
        <Link href={href} {...linkProps(href)} className="group/title">
          {title}
        </Link>
      ) : (
        title
      )}
      <p className={cn("mt-1 leading-relaxed text-fg-2", size === "lg" ? "text-[17px]" : "text-[15px]")}>
        {project.description}
      </p>
      <div className="mt-2.5 text-[13px]">
        <ProjectLinks project={project} />
      </div>
    </li>
  );
}

/** A plain list of projects (home page, early projects). */
export function ProjectIndex({ projects }: { projects: Project[] }) {
  return (
    <ul className="focus-list">
      {projects.map((p) => (
        <ProjectRow key={p.title} project={p} />
      ))}
    </ul>
  );
}
