import Link from "next/link";
import type { Organization, Project } from "@/data/projects";
import { ArrowUpRight } from "./icons";
import { cn } from "@/lib/utils";

const isExternal = (href: string) => href.startsWith("http");

function ProjectLinks({ project }: { project: Project }) {
  const items = [
    project.link && { href: project.link, label: isExternal(project.link) ? "Visit" : "Open" },
    project.repo && project.repo !== project.link && { href: project.repo, label: "Source" },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <div className="flex gap-4">
      {items.map(({ href, label }) => (
        <Link
          key={label}
          href={href}
          className="link-arrow text-[14px]"
          {...(isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {label}
          <ArrowUpRight />
        </Link>
      ))}
    </div>
  );
}

/** Full archive: grouped, one row per project. */
export function ProjectList({ organizations }: { organizations: Organization[] }) {
  return (
    <div className="space-y-16">
      {organizations.map((org) => (
        <section
          key={org.name}
          className="grid gap-3 md:grid-cols-[11rem_1fr] md:gap-8"
          aria-label={org.name}
        >
          <h2 className="font-display text-[15px] font-medium text-fg-3 md:pt-5">
            {org.name}
          </h2>
          <ul className="border-t border-line/10">
            {org.projects.map((project) => (
              <li
                key={project.title}
                className="flex flex-col gap-2 border-b border-line/10 py-5"
              >
                <div className="flex items-baseline gap-3">
                  <h3 className="text-[17px] font-medium text-fg">{project.title}</h3>
                  {project.deprecated && (
                    <span className="rounded-full bg-fg/[0.06] px-2 py-0.5 text-[11px] font-medium text-fg-2">
                      Archived
                    </span>
                  )}
                </div>
                <p className="text-[15px] leading-relaxed text-fg-2">
                  {project.description}
                </p>
                <div className="mt-1 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                  <p className="text-[13px] text-fg-3">{project.tags.join(" · ")}</p>
                  <ProjectLinks project={project} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** Home page: a calm 2-up grid of tiles. */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {projects.map((project) => {
        const href = project.link || project.repo || "#";
        return (
          <li key={project.title}>
            <Link
              href={href}
              {...(isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={cn(
                "group flex h-full flex-col rounded-3xl bg-surface p-7",
                "transition-[transform,background-color] duration-300 ease-out",
                "hover:-translate-y-0.5 hover:bg-fg/[0.07]"
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-[19px] font-semibold tracking-tight text-fg">
                  {project.title}
                </h3>
                <ArrowUpRight className="size-4 text-fg-3 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-tint" />
              </div>
              <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-fg-2">
                {project.description}
              </p>
              <p className="mt-auto pt-6 text-[13px] text-fg-3">
                {project.tags.join(" · ")}
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
