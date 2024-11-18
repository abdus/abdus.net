import Container from "@/app/_components/container";
import { MoreStories } from "@/app/_components/more-stories";
import { getAllNotes, getAllPosts } from "@/lib/api";
import Header from "./_components/header";

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
