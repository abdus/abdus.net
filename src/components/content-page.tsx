import Link from "next/link";
import { Post } from "@/interfaces/post";
import Container from "@/components/container";
import { PostBody } from "@/components/post-body";
import { PostHeader } from "@/components/post-header";
import { PostTags } from "@/components/post-tags";
import { SpendsBetaBanner } from "@/components/spends-beta-banner";
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
          {post.banner === "spends-beta" && <SpendsBetaBanner campaign={post.slug} />}
          <PostBody content={content} />
          <div className="mt-16">
            <PostTags tags={post.tags} />
          </div>
        </Container>
      </article>

      {next && next.slug !== post.slug && (
        <Container className="mt-28">
          <div className="border-t border-line/10 pt-10">
          <p className="eyebrow">Read next</p>
          <Link
            href={hrefFor(next)}
            className="display mt-2 block text-balance text-[28px] leading-[1.2] transition-colors hover:text-tint sm:text-[32px]"
          >
            {next.title}
          </Link>
          </div>
        </Container>
      )}
    </main>
  );
}
