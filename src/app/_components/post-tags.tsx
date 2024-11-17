import Link from "next/link";

export function PostTags(props: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-4 mt-12 text-red-600">
      {props.tags.map((tag) => (
        <Link
          key={tag}
          href={`/tags/${tag}`}
          className="font-medium text-[1.4em]"
        >
          # {tag}
        </Link>
      ))}
    </div>
  );
}
