import Link from "next/link";
import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
  archetype?: string;
};

export function PostPreview({ title, date, slug, archetype = "" }: Props) {
  return (
    <div className="flex flex-col items-baseline border-b last:border-0 py-4">
      <div className="text-lg md:text-xl mb-1">
        <Link
          href={`/${getPathSegment(archetype)}/${slug}`}
          className="hover:underline"
        >
          {title}
        </Link>
        {archetype && (
          <>
            · {archetype}
          </>
        )}
      </div>

      <div className="text-gray-500 whitespace-nowrap">
        <DateFormatter dateString={date} format="MMM dd, yyyy" />
      </div>

    </div>
  );
}

function getPathSegment(archetype: string) {
  const t = archetype.toLocaleLowerCase()

  switch(t) {
    case "note":
      return "notes"
    default:
      return "posts"
  }
}
