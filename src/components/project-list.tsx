import Link from "next/link";
import type { Organization, Project } from "@/data/projects";
import { ArrowUpRight } from "./icons";

const isExternal = (href: string) => href.startsWith("http");
const linkProps = (href: string) =>
  isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};

/** A short, plain list: name and one line. */
export function ProjectIndex({ projects }: { projects: Project[] }) {
  return (
    <ul className="focus-list">
      {projects.map((project) => {
        const href = project.link || project.repo || "#";
        return (
          <li key={project.title}>
            <Link
              href={href}
              {...linkProps(href)}
              className="group block border-b border-line/[0.07] py-5"
            >
              <span className="flex items-center gap-1.5 text-[18px] tracking-[-0.01em] text-fg">
                {project.title}
                <ArrowUpRight className="size-3.5 text-fg-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
              <span className="mt-1 block text-[15px] leading-relaxed text-fg-2">
                {project.description}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** The archive: quiet, grouped rows. */
export function ProjectList({ organizations }: { organizations: Organization[] }) {
  return (
    <div className="space-y-20">
      {organizations.map((org) => (
        <section key={org.name} aria-label={org.name}>
          <h2 className="mb-2 text-[17px] font-medium text-fg">{org.name}</h2>
          <ul className="focus-list">
            {org.projects.map((project) => {
              const href = project.link || project.repo || "#";
              return (
                <li key={project.title}>
                  <Link href={href} {...linkProps(href)} className="block border-b border-line/[0.07] py-5">
                    <span className="flex items-baseline gap-3">
                      <span className="text-[17px] text-fg">{project.title}</span>
                      {project.deprecated && (
                        <span className="text-[13px] text-fg-3">archived</span>
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
