import { Metadata } from "next";
import Container from "@/components/container";
import { PageTitle } from "@/components/page-title";
import { ProjectList, ProjectGrid } from "@/components/project-list";
import { SectionHeader } from "@/components/section-header";
import { featuredProjects, visibleOrganizations } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I have built: tools, apps, libraries and experiments.",
};

export default function ProjectsPage() {
  return (
    <main>
      <Container>
        <PageTitle
          title="Projects"
          lede="Tools, apps, libraries and experiments. Some are polished, most were built to learn something."
        />

        <section className="mb-28">
          <SectionHeader title="Selected" />
          <ProjectGrid projects={featuredProjects()} />
        </section>

        <SectionHeader title="Everything else" />
        <ProjectList organizations={visibleOrganizations()} />
      </Container>
    </main>
  );
}
