import Container from "@/components/container";
import { MoreStories } from "@/components/more-stories";
import { getAllNotes, getAllPosts } from "@/lib/api";
import Header from "@/components/header";

export default function Index() {
  const allPosts = getAllPosts();
  const allNotes = getAllNotes();

  return (
    <main className="h-full overflow-auto">
      <Header />
      <Container className="max-w-4xl">
        {allPosts.length > 0 && (
          <MoreStories
            posts={[...allPosts, ...allNotes].filter((post) => !post.draft)}
          />
        )}
      </Container>
    </main>
  );
}
