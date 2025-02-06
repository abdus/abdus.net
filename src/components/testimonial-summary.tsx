import Link from "next/link"
import testimonialData from "@/data/testimonials.json"

// Select specific testimonials by author name and add section titles
const testimonialSections = [
  {
    title: "On Long-term Collaboration",
    testimonial: testimonialData.testimonials.find(t => t.author.name === "Matt Smith")!
  },
  {
    title: "On Community Impact",
    testimonial: testimonialData.testimonials.find(t => t.author.name === "Andrei Neagoie")!
  },
  {
    title: "On Technical Excellence",
    testimonial: testimonialData.testimonials.find(t => t.author.name === "Omkar Gunjal")!
  },
  {
    title: "On Work Ethics",
    testimonial: testimonialData.testimonials.find(t => t.author.name === "Manisha Sharma")!
  }
].map(section => ({
  ...section,
  testimonial: {
    ...section.testimonial,
    summary: section.testimonial.summary.replace(/<strong>/g, '<span class="font-normal text-blue-600">').replace(/<\/strong>/g, '</span>')
  }
}))

export function TestimonialSummary() {
  return (
    <section className="py-12 md:py-20">
      <div className="space-y-16 max-w-4xl mx-auto mb-12">
        {testimonialSections.map((section, index) => (
          <div 
            key={index} 
            className="relative"
          >
            <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-4">{section.title}</h3>
            <div className="mb-4">
              <div 
                className="text-lg text-gray-800 mb-4"
                dangerouslySetInnerHTML={{ __html: section.testimonial.summary }}
              />
              <div className="text-sm flex items-center">
                <div className="h-px w-16 md:w-24 bg-gray-300 mr-4" />
                <div>
                  <span className="font-medium text-gray-900">{section.testimonial.author.name}</span>
                  <div className="text-gray-500">
                    {section.testimonial.author.job_title.length > 0 ? (
                      <>{section.testimonial.author.job_title.join(", ")} at </>
                    ) : null}
                    {section.testimonial.author.organization}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="">
        <Link 
          href="/testimonials" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          Read more testimonials
          <svg 
            className="w-4 h-4 ml-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </Link>
      </div>
    </section>
  )
}
