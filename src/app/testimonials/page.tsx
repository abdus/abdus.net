import Container from "@/components/container"
import Header from "@/components/header"
import { Testimonial } from "@/components/testimonial-card"
import testimonialData from "@/data/testimonials.json"

export default function TestimonialsPage() {
  return (
    <div className="overflow-auto">
      <Header />
      <Container className="max-w-4xl">
        <div className="py-4 md:py-16">
          <h1 className="text-3xl md:text-4xl mb-8">Testimonials</h1>
          
          <div className="prose mb-12">
            <p>
              Here are some kind words from people I&apos;ve had the pleasure of working with.
              I&apos;m grateful for their support and the opportunities to collaborate with them.
            </p>
          </div>

          <div className="divide-y">
            {testimonialData.testimonials.map((testimonial, index) => (
              <Testimonial
                key={index}
                recommendation={testimonial.recommendation}
                summary={testimonial.summary}
                author={testimonial.author}
              />
            ))}
          </div>
        </div>
      </Container>
    </div>
  )
}

export const metadata = {
  title: 'Testimonials',
  description: 'Kind words from people I\'ve worked with throughout my career.',
}
