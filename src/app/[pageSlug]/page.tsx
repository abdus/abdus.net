import { Metadata } from "next";
import { getPageBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import Container from "@/components/container";
import { PostBody } from "@/components/post-body";
import markdownToHtml from "@/lib/markdownToHtml";
import { HOME_OG_IMAGE_URL } from "@/lib/constants";
import { PostHeader } from "@/components/post-header";

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
      <article>
        <PostHeader title={post.title} date={post.date} />
        <Container>
          <PostBody content={content} />
        </Container>
      </article>
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
