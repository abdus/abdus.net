import Link from 'next/link'

type MediaItem = {
  type: 'image' | 'video'
  url: string
  alt?: string
}

type Project = {
  title: string
  description: string
  link?: string
  repo?: string
  tags: string[]
  isVisible?: boolean
  deprecated?: boolean
  media?: MediaItem[]
}

export type Organization = {
  name: string
  projects: Project[]
  isVisible?: boolean
}

type Props = {
  organizations: Organization[]
}

export function ProjectList({ organizations }: Props) {
  const visibleOrgs = organizations.filter(org => org.isVisible !== false)

  return (
    <div className="space-y-16">
      <p>
        A list of projects I&apos;ve worked on.
      </p>

      {visibleOrgs.map((org, orgIndex) => (
        <div key={orgIndex} className="space-y-6">
          <h2 className="text-lg border-b pb-2">{org.name}</h2>

          <div className="prose">
            {org.projects
              .filter(project => project.isVisible !== false)
              .map((project, index) => (
                <ul key={index} className="">
                  <li>
                    <span className=''>
                      <Link href={project.link || project.repo || '#'} className="hover:underline no-underline text-blue-600 font-medium" target='_blank'>
                        {project.title}
                      </Link>
                    </span>: {project.description}{' '}{project.deprecated && (
                      <span className="text-sm text-yellow-600 font-normal">
                        [Deprecated]
                      </span>
                    )}
                  </li>
                </ul>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
