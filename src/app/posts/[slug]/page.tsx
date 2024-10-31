import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import { HOME_OG_IMAGE_URL } from "@/lib/constants";
import markdownToHtml from "@/lib/markdownToHtml";
//import Alert from "@/app/_components/alert";
import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { PostBody } from "@/app/_components/post-body";
import { PostHeader } from "@/app/_components/post-header";

export default async function Post({ params }: Params) {
  const paramsAwaited = await params;
  const post = paramsAwaited.slug && getPostBySlug(paramsAwaited.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");

  return (
    <main>
      <Container>
        <Header />
        <article className="mb-32">
          <PostHeader title={post.title} date={post.date} />
          <PostBody content={content} />
        </article>
      </Container>
    </main>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Params = { params: any };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const paramsAwaited = await params;
  const post = paramsAwaited.slug && getPostBySlug(paramsAwaited.slug);

  if (!post) {
    return notFound();
  }

  const title = `${post.title}`;

  return {
    title,
    openGraph: { title, images: [post?.meta?.image || HOME_OG_IMAGE_URL] },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
