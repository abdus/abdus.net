import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllTags, getPostsByTag } from "@/lib/api";
import { HOME_OG_IMAGE_URL } from "@/lib/constants";
import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { MoreStories } from "@/app/_components/more-stories";

export default async function Post({ params }: Params) {
  const paramsAwaited = await params;
  const decodedTag = decodeURIComponent(paramsAwaited.tag);
  const posts = getPostsByTag(decodedTag);

  return (
    <main>
      <Container>
        <Header />

        <div className="max-w-5xl mx-auto">
          <h2 className="mb-8 text-5xl md:text-6xl font-bold tracking-tighter leading-tight">
            Posts tagged with{" "}
            <span className="text-red-500">{decodedTag}</span>
          </h2>

          <MoreStories posts={posts.filter((post) => !post.draft)} />
        </div>
      </Container>
    </main>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Params = { params: any };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const paramsAwaited = await params;
  const decodedTag = decodeURIComponent(paramsAwaited.tag);
  const title = `Posts tagged with ${decodedTag}`;

  return {
    title,
    openGraph: { title, images: [HOME_OG_IMAGE_URL] },
  };
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({ tag }));
}
