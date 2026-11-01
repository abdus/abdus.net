import Link from "next/link";
import { Post } from "@/interfaces/post";
import Container from "@/components/container";
import { PostBody } from "@/components/post-body";
import { PostHeader } from "@/components/post-header";
import { PostTags } from "@/components/post-tags";
import { getAllWriting, hrefFor, readingTime } from "@/lib/api";

type Props = {
  post: Post;
  content: string;
};

export function ContentPage({ post, content }: Props) {
  const all = getAllWriting();
  const index = all.findIndex((p) => p.slug === post.slug && p.archetype === post.archetype);
  const next = index >= 0 ? all[index + 1] ?? all[0] : undefined;

  return (
    <main>
      <article>
        <PostHeader
          title={post.title}
          date={post.date}
          minutes={readingTime(post.content)}
          kind={post.archetype === "note" ? "Note" : undefined}
        />
        <Container>
          <PostBody content={content} />
          <div className="mt-20 flex justify-center">
            <PostTags tags={post.tags} />
          </div>
        </Container>
      </article>

      {next && next.slug !== post.slug && (
        <Container className="mt-40 text-center">
          <p className="eyebrow">Read next</p>
          <Link
            href={hrefFor(next)}
            className="display mt-6 block text-balance text-[32px] leading-[1.15] transition-colors hover:text-tint sm:text-[44px]"
          >
            {next.title}
          </Link>
        </Container>
      )}
    </main>
  );
}
