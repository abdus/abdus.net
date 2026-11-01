import Link from "next/link";
import { Post } from "@/interfaces/post";
import Container from "@/components/container";
import { PostBody } from "@/components/post-body";
import { PostHeader } from "@/components/post-header";
import { PostTags } from "@/components/post-tags";
import { ReadingProgress } from "@/components/reading-progress";
import { ArrowLeft, ArrowRight } from "@/components/icons";
import { getAllWriting, hrefFor, readingTime } from "@/lib/api";
import { cn } from "@/lib/utils";

type Props = {
  post: Post;
  content: string;
};

export function ContentPage({ post, content }: Props) {
  const all = getAllWriting();
  const index = all.findIndex(
    (p) => p.slug === post.slug && p.archetype === post.archetype
  );
  const newer = index > 0 ? all[index - 1] : undefined;
  const older = index >= 0 ? all[index + 1] : undefined;

  return (
    <main>
      <ReadingProgress />
      <article>
        <Container size="text">
          <PostHeader
            title={post.title}
            date={post.date}
            minutes={readingTime(post.content)}
            kind={post.archetype === "note" ? "Note" : undefined}
          />
          <PostBody content={content} />

          <footer className="mt-20 space-y-12">
            <PostTags tags={post.tags} />

            {(older || newer) && (
              <nav
                aria-label="More writing"
                className="grid gap-4 border-t border-line/10 pt-12 sm:grid-cols-2"
              >
                {older ? <Neighbour post={older} label="Previous" /> : <span />}
                {newer && <Neighbour post={newer} label="Next" align="right" />}
              </nav>
            )}

            <Link href="/posts" className="link-arrow">
              <ArrowLeft /> All writing
            </Link>
          </footer>
        </Container>
      </article>
    </main>
  );
}

function Neighbour({
  post,
  label,
  align = "left",
}: {
  post: Post;
  label: string;
  align?: "left" | "right";
}) {
  return (
    <Link
      href={hrefFor(post)}
      className={cn(
        "group flex flex-col gap-2 rounded-3xl bg-surface p-6 transition-colors hover:bg-fg/[0.07]",
        align === "right" && "sm:items-end sm:text-right"
      )}
    >
      <span className="eyebrow flex items-center gap-1">
        {align === "left" && <ArrowLeft />}
        {label}
        {align === "right" && <ArrowRight />}
      </span>
      <span className="text-[17px] font-medium leading-snug text-fg">{post.title}</span>
    </Link>
  );
}
