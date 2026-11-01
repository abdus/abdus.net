import Link from "next/link";
import { ArrowRight } from "@/components/icons";
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
      <Container size="text">
        <article>
          <PostHeader title={post.title} date={post.date} />
          <PostBody content={content} />
          {post.slug === "about" && (
            <p className="mt-16 border-t border-line/10 pt-10">
              <Link href="/testimonials" className="link-arrow">
                What people I&apos;ve worked with say <ArrowRight />
              </Link>
            </p>
          )}
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
