import { Post } from "@/interfaces/post";
import Container from "@/components/container";
import Header from "@/components/header";
import { PostBody } from "@/components/post-body";
import { PostHeader } from "@/components/post-header";
import { PostTags } from "@/components/post-tags";

type Props = {
  post: Post;
  content: string;
};

export function ContentPage({ post, content }: Props) {
  return (
    <main className="overflow-auto pb-20">
      <Header />
      <article className="py-8">
        <Container>
          <div className="max-w-4xl mx-auto">
            <PostHeader title={post.title} date={post.date} />
            <PostBody content={content} />
            <div className="mt-12">
              <PostTags tags={post.tags} />
            </div>
          </div>
        </Container>
      </article>
    </main>
  );
}
