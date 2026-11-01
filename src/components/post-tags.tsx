import Link from "next/link";

export function PostTags({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null;
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[14px]" aria-label="Topics">
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            href={`/tags/${encodeURIComponent(tag)}`}
            className="text-fg-3 transition-colors hover:text-fg"
          >
            #{tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
