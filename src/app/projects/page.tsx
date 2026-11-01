import { Metadata } from "next";
import Container from "@/components/container";
import { PageTitle } from "@/components/page-title";
import { ProjectIndex, ProjectList } from "@/components/project-list";
import { SectionLabel } from "@/components/section-label";
import { featuredProjects, visibleOrganizations } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I have built: tools, apps, libraries and experiments.",
};

export default function ProjectsPage() {
  const featured = new Set(featuredProjects().map((p) => p.title));
  const rest = visibleOrganizations()
    .map((org) => ({ ...org, projects: org.projects.filter((p) => !featured.has(p.title)) }))
    .filter((org) => org.projects.length > 0);

  return (
    <main>
      <PageTitle
        title="Projects"
        lede="Things I've built over the years. Some are useful, most were built to learn something."
      />
      <Container>
        <SectionLabel>Favourites</SectionLabel>
        <ProjectIndex projects={featuredProjects()} />

        <div className="mt-20">
          <ProjectList organizations={rest} />
        </div>
      </Container>
    </main>
  );
}
