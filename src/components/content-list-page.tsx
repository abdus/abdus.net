import Container from "@/components/container";
import { MoreStories } from "@/components/more-stories";
import Header from "@/components/header";
import { Post } from "@/interfaces/post";

type Props = {
  title: string;
  posts: Post[];
  tags: string[];
};

export function ContentListPage({ title, posts, tags }: Props) {
  return (
    <main className="overflow-auto pb-20">
      <Header />
      <Container className="max-w-4xl">
        <h1 className="text-2xl md:text-3xl tracking-tight mb-8 text-gray-900">
          {title}
        </h1>
        {posts.length > 0 && (
          <MoreStories
            tags={tags}
            posts={posts.filter((post) => !post.draft)}
          />
        )}
      </Container>
    </main>
  );
}
