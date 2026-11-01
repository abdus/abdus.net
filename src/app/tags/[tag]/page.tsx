import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllWriting, getWritingTags } from "@/lib/api";
import { HOME_OG_IMAGE_URL } from "@/lib/constants";
import { ContentListPage } from "@/components/content-list-page";

type Params = { params: Promise<{ tag: string }> };

export default async function TagPage({ params }: Params) {
  const tag = decodeURIComponent((await params).tag);
  const posts = getAllWriting().filter((post) => post.tags?.includes(tag));

  if (posts.length === 0) return notFound();

  return (
    <ContentListPage
      eyebrow="Topic"
      title={tag}
      lede={`${posts.length} ${posts.length === 1 ? "piece" : "pieces"} of writing.`}
      posts={posts}
      tags={getWritingTags()}
      activeTag={tag}
    />
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const tag = decodeURIComponent((await params).tag);
  const title = `Writing on ${tag}`;
  return { title, openGraph: { title, images: [HOME_OG_IMAGE_URL] } };
}

export async function generateStaticParams() {
  return getWritingTags().map(({ tag }) => ({ tag }));
}
