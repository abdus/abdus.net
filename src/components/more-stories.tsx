import { Post } from "@/interfaces/post";
import { PostPreview } from "./post-preview";
import Link from "next/link";

type Props = {
  posts: Post[];
  tags?: string[];
};

//function segregatePostsByYear(posts: Post[]) {
//const postsByYear = posts.reduce((acc, post) => {
//const year = new Date(post.date).getFullYear();
//if (!acc[year]) {
//acc[year] = [];
//}
//acc[year].push(post);
//acc[year] = acc[year].sort(
//(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//);

//return acc;
//}, {} as Record<number, Post[]>);

//return postsByYear;
//}

export function MoreStories({ posts, tags }: Props) {
  //const postsByYear = segregatePostsByYear(posts);
  //const years = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <section className="grid md:grid-cols-4 gap-4">
      <div className="flex flex-col md:col-span-3">
        {posts
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .map((post) => (
            <PostPreview
              key={post.slug}
              title={post.title}
              date={post.date}
              slug={post.slug}
              excerpt={post.excerpt}
              archetype={post.archetype}
            />
          ))}
      </div>

      <div className="">
        <div className="flex gap-x-4 gap-y-2 md:gap-2 flex-wrap">
          {tags?.map((tag) => (
            <Link key={tag} href={`/tags/${tag}`} className="underline">
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
