import Link from "next/link";
import { Post } from "@/interfaces/post";
import { hrefFor } from "@/lib/api";
import DateFormatter from "./date-formatter";

type Props = {
  posts: Post[];
  /** Group under year labels (archive) or a flat list (home). */
  groupByYear?: boolean;
};

export function PostList({ posts, groupByYear = false }: Props) {
  if (!groupByYear) {
    return (
      <ul className="focus-list">
        {posts.map((post) => (
          <PostRow key={`${post.archetype}-${post.slug}`} post={post} />
        ))}
      </ul>
    );
  }

  const years = new Map<number, Post[]>();
  for (const post of posts) {
    const year = new Date(post.date).getFullYear();
    years.set(year, [...(years.get(year) || []), post]);
  }

  return (
    <div className="space-y-16">
      {[...years.entries()].map(([year, items]) => (
        <section key={year} aria-label={String(year)}>
          <h2 className="mb-2 text-[17px] font-medium tabular-nums text-fg-3">{year}</h2>
          <ul className="focus-list">
            {items.map((post) => (
              <PostRow key={`${post.archetype}-${post.slug}`} post={post} dateFormat="MMM d" />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function PostRow({ post, dateFormat = "MMM yyyy" }: { post: Post; dateFormat?: string }) {
  return (
    <li>
      <Link
        href={hrefFor(post)}
        className="flex items-baseline gap-6 border-b border-line/[0.07] py-5"
      >
        <span className="min-w-0 flex-1 text-[18px] leading-snug tracking-[-0.01em] text-fg sm:text-[19px]">
          {post.title}
          {post.archetype === "note" && (
            <span className="ml-2 text-[14px] text-fg-3">· note</span>
          )}
        </span>
        <DateFormatter
          dateString={post.date}
          format={dateFormat}
          className="shrink-0 text-[13px] tabular-nums text-fg-3"
        />
      </Link>
    </li>
  );
}
