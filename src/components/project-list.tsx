import Link from "next/link";
import type { Organization, Project } from "@/data/projects";
import { ArrowUpRight } from "./icons";

const isExternal = (href: string) => href.startsWith("http");
const linkProps = (href: string) =>
  isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};

/** Selected work: a numbered index with thin numerals. */
export function ProjectIndex({ projects }: { projects: Project[] }) {
  return (
    <ol className="focus-list">
      {projects.map((project, i) => {
        const href = project.link || project.repo || "#";
        return (
          <li key={project.title}>
            <Link
              href={href}
              {...linkProps(href)}
              className="group grid grid-cols-[3.25rem_1fr] gap-x-4 border-b border-line/[0.07] py-7 sm:grid-cols-[4.5rem_1fr]"
            >
              <span className="display text-[32px] leading-none tabular-nums text-fg-3 sm:text-[40px]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="flex items-center gap-2 text-[19px] tracking-[-0.01em] text-fg">
                  {project.title}
                  <ArrowUpRight className="size-3.5 text-fg-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
                <span className="mt-2 block text-[15px] leading-relaxed text-fg-2">
                  {project.description}
                </span>
                <span className="mt-3 block text-[12px] text-fg-3">
                  {project.tags.join("  ·  ")}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

/** The archive: quiet, grouped rows. */
export function ProjectList({ organizations }: { organizations: Organization[] }) {
  return (
    <div className="space-y-20">
      {organizations.map((org) => (
        <section key={org.name} aria-label={org.name}>
          <h2 className="eyebrow mb-4 border-b border-line/10 pb-4">{org.name}</h2>
          <ul className="focus-list">
            {org.projects.map((project) => {
              const href = project.link || project.repo || "#";
              return (
                <li key={project.title}>
                  <Link href={href} {...linkProps(href)} className="block border-b border-line/[0.07] py-5">
                    <span className="flex items-baseline gap-3">
                      <span className="text-[17px] text-fg">{project.title}</span>
                      {project.deprecated && (
                        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-fg-3">
                          Archived
                        </span>
                      )}
                    </span>
                    <span className="mt-1.5 block text-[15px] leading-relaxed text-fg-2">
                      {project.description}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
