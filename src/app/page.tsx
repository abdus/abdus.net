import Container from "@/components/container";
import { MoreStories } from "@/components/more-stories";
import { getAllNotes, getAllNoteTags, getAllPosts, getAllTags } from "@/lib/api";
import Header from "@/components/header";
import { About } from "@/components/about";
import { TestimonialSummary } from "@/components/testimonial-summary";

export default function Index() {
  const allTags = [...new Set([...getAllTags(), ...getAllNoteTags()])]
  const allPosts = getAllPosts();
  const allNotes = getAllNotes();

  return (
    <main className="h-full overflow-auto">
      <Header />
      <About />
      <Container className="max-w-4xl">
        {allPosts.length > 0 && (
          <MoreStories
            tags={allTags}
            posts={[...allPosts, ...allNotes].filter((post) => !post.draft)}
          />
        )}
        <TestimonialSummary />
      </Container>
    </main>
  );
}
