import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "../../_components/header";
import Container from "../../_components/container";
import { PostBody } from "../../_components/post-body";
import markdownToHtml from "@/lib/markdownToHtml";
import { HOME_OG_IMAGE_URL } from "@/lib/constants";
import { PostHeader } from "../../_components/post-header";
import { getAllPages, getPageBySlug } from "@/lib/api";

type Props = { params: Promise<{ pageSlug: string }> };

export default async function PageRenderer(props: Props) {
  const paramsAwaited = await props.params;
  const post = paramsAwaited.pageSlug && getPageBySlug(paramsAwaited.pageSlug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");

  return (
    <main>
      <Header />
      <Container className="max-w-4xl">
        <article className="mb-32">
          <PostHeader title={post.title} date={post.date} />
          <PostBody content={content} />
        </article>
      </Container>
    </main>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const paramsAwaited = await params;
  const page = paramsAwaited.pageSlug && getPageBySlug(paramsAwaited.pageSlug);

  if (!page) {
    return notFound();
  }

  const title = page.title;

  return {
    title,
    openGraph: { title, images: [page?.meta?.image || HOME_OG_IMAGE_URL] },
  };
}

export async function generateStaticParams() {
  const pages = getAllPages();

  return pages.map((post) => ({
    slug: post.slug,
  }));
}
