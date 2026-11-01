import Link from "next/link";
import Container from "@/components/container";
import { PageTitle } from "@/components/page-title";
import { PostList } from "@/components/post-list";
import { Post } from "@/interfaces/post";
import { cn } from "@/lib/utils";

type Props = {
  posts: Post[];
  tags: { tag: string; count: number }[];
  activeTag?: string;
  eyebrow?: string;
  title: string;
  lede?: string;
};

export function ContentListPage({ posts, tags, activeTag, eyebrow, title, lede }: Props) {
  return (
    <main>
      <PageTitle eyebrow={eyebrow} title={title} lede={lede} />
      <Container>
        <PostList posts={posts} groupByYear />

        {tags.length > 0 && (
          <nav aria-label="Topics" className="mt-24">
            <h2 className="mb-4 text-[17px] font-medium text-fg">Topics</h2>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[15px]">
              {activeTag && (
                <li>
                  <Link href="/posts" className="text-tint">
                    All writing
                  </Link>
                </li>
              )}
              {tags.map(({ tag, count }) => (
                <li key={tag}>
                  <Link
                    href={`/tags/${encodeURIComponent(tag)}`}
                    aria-current={tag === activeTag ? "page" : undefined}
                    className={cn(
                      "transition-colors",
                      tag === activeTag ? "text-fg" : "text-fg-2 hover:text-fg"
                    )}
                  >
                    {tag}
                    <sup className="ml-0.5 text-[10px] tabular-nums text-fg-3">{count}</sup>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </Container>
    </main>
  );
}
