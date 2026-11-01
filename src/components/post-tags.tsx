import Link from "next/link";

export function PostTags({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null;
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Topics">
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            href={`/tags/${encodeURIComponent(tag)}`}
            className="block rounded-full bg-surface px-3.5 py-1.5 text-[13px] text-fg-2 transition-colors hover:text-fg"
          >
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
