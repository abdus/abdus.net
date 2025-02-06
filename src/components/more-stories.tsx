import { Post } from "@/interfaces/post";
import { PostPreview } from "./post-preview";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  posts: Post[];
  tags?: string[];
  showAllPostsLink?: boolean
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

export function MoreStories({ posts, tags, showAllPostsLink }: Props) {
  //const postsByYear = segregatePostsByYear(posts);
  //const years = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <main className="my-12">
      <h2 className="text-2xl md:text-3xl underline">Posts</h2>
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

        <div className="hidden md:block">
          <div className="flex gap-x-4 gap-y-2 md:gap-2 flex-wrap">
            {tags?.map((tag) => (
              <Link key={tag} href={`/tags/${tag}`} className="underline">
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className={cn("mt-6", showAllPostsLink ? "inline-flex" : "hidden")}>
        <Link 
          href="/posts"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          All Posts
          <svg 
            className="w-4 h-4 ml-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </Link>
      </div>
    </main>
  );
}
