import { Metadata } from "next";
import Container from "@/components/container";
import { PageTitle } from "@/components/page-title";
import { Testimonial } from "@/components/testimonial-card";
import testimonialData from "@/data/testimonials.json";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Kind words from people I've worked with throughout my career.",
};

export default function TestimonialsPage() {
  return (
    <main>
      <PageTitle
        title="Kind words"
        lede="From people I've had the pleasure of building things with."
      />
      <Container>
        <div>
          {testimonialData.testimonials.map((t) => (
            <Testimonial key={t.author.name} {...t} />
          ))}
        </div>
      </Container>
    </main>
  );
}
