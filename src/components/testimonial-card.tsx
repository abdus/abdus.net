type Author = {
  name: string
  avatar: string
  organization: string
  country: string
  job_title: string[]
}

type TestimonialProps = {
  recommendation: string
  summary: string
  author: Author
}

export function Testimonial({ recommendation, summary, author }: TestimonialProps) {
  const formattedSummary = summary.replace(/<strong>/g, '<span class="font-normal text-blue-600">').replace(/<\/strong>/g, '</span>')

  return (
    <div className="py-12 first:pt-0 last:pb-0">
      <div className="flex items-start gap-6">
        <div className="relative h-16 w-16 flex-shrink-0">
          <img
            src={author.avatar}
            alt={`${author.name}'s avatar`}
            className="rounded-full"
          />
        </div>

        <div className="flex-1">
          <div className="mb-4">
            <p className="font-medium text-gray-900">{author.name}</p>
            <div className="text-sm text-gray-500">
              {author.job_title.length > 0 && (
                <span>{author.job_title.join(", ")} at </span>
              )}
              <span>{author.organization}</span>
              <span> • {author.country}</span>
            </div>
          </div>

          <div>
            <div
              className="mb-4 text-lg font-medium text-gray-800"
              dangerouslySetInnerHTML={{ __html: formattedSummary }}
            />
            <div className="relative">
              <span className="text-4xl text-gray-200 font-serif absolute -top-3 -left-4">&quote;</span>
              <p className="text-gray-600 relative z-10 whitespace-pre-line pl-2">{recommendation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
