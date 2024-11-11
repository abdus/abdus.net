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
    <div>
      <h3 className="leading-tight text-[1.4em]">
        <Link
          href={`/${getPathSegment(archetype)}/${slug}`}
          className="hover:underline"
        >
          {title}{" "}
          {archetype && (
            <small className="px-2 rounded-md bg-yellow-200 ml-2">
              {archetype}
            </small>
          )}
        </Link>
      </h3>

      <div className="text-[1.2em] text-foreground/70">
        <DateFormatter dateString={date} format="LLL d, yyyy" />
      </div>
    </div>
  );
}

function getPathSegment(archetype: string) {
  switch (archetype) {
    case "note":
      return "notes";
    case "post":
    default:
      return "posts";
  }
}
