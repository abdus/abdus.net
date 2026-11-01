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
      <Container>
        <PageTitle eyebrow={eyebrow} title={title} lede={lede} />

        {tags.length > 0 && (
          <nav aria-label="Topics" className="-mx-6 mb-14 overflow-x-auto px-6">
            <ul className="flex w-max gap-2 pb-1">
              <TagChip href="/posts" label="All" active={!activeTag} />
              {tags.map(({ tag }) => (
                <TagChip
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  label={tag}
                  active={tag === activeTag}
                />
              ))}
            </ul>
          </nav>
        )}

        <PostList posts={posts} groupByYear />
      </Container>
    </main>
  );
}

function TagChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "block whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] transition-colors",
          active ? "bg-fg text-bg" : "bg-surface text-fg-2 hover:text-fg"
        )}
      >
        {label}
      </Link>
    </li>
  );
}
