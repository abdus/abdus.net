import Link from "next/link";
import { Post } from "@/interfaces/post";
import { hrefFor } from "@/lib/api";
import DateFormatter from "./date-formatter";
import { cn } from "@/lib/utils";

type Props = {
  posts: Post[];
  /** Group under year headings (archive view) or a flat list (home). */
  groupByYear?: boolean;
};

export function PostList({ posts, groupByYear = false }: Props) {
  if (!groupByYear) {
    return (
      <ul className="border-t border-line/10">
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
    <div className="space-y-14">
      {[...years.entries()].map(([year, items]) => (
        <section
          key={year}
          className="grid gap-3 md:grid-cols-[7rem_1fr] md:gap-0"
          aria-label={String(year)}
        >
          <h2 className="font-display text-[15px] font-medium tabular-nums text-fg-3 md:pt-[1.15rem]">
            {year}
          </h2>
          <ul className="border-t border-line/10">
            {items.map((post) => (
              <PostRow
                key={`${post.archetype}-${post.slug}`}
                post={post}
                dateFormat="MMM d"
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function PostRow({
  post,
  dateFormat = "MMM d, yyyy",
}: {
  post: Post;
  dateFormat?: string;
}) {
  return (
    <li className="border-b border-line/10">
      <Link
        href={hrefFor(post)}
        className={cn(
          "group -mx-3 flex items-baseline gap-4 rounded-xl px-3 py-4",
          "transition-colors duration-200 hover:bg-fg/[0.035]"
        )}
      >
        <span className="min-w-0 flex-1 text-[17px] leading-snug text-fg">
          {post.title}
          {post.archetype === "note" && (
            <span className="ml-2 inline-block translate-y-[-1px] rounded-full bg-fg/[0.06] px-2 py-0.5 align-middle text-[11px] font-medium text-fg-2">
              Note
            </span>
          )}
        </span>
        <DateFormatter
          dateString={post.date}
          format={dateFormat}
          className="shrink-0 text-[14px] tabular-nums text-fg-3"
        />
      </Link>
    </li>
  );
}
