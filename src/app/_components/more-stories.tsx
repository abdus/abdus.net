import { Post } from "@/interfaces/post";
import { PostPreview } from "./post-preview";

type Props = {
  posts: Post[];
};

function segregatePostsByYear(posts: Post[]) {
  const postsByYear = posts.reduce((acc, post) => {
    const year = new Date(post.date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<number, Post[]>);

  return postsByYear;
}

export function MoreStories({ posts }: Props) {
  const postsByYear = segregatePostsByYear(posts);
  const years = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <section>
      {years.map((year) => (
        <div key={year} className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 underline">
            {year}
          </h2>
          <div className="flex flex-col gap-y-8">
            {postsByYear[Number(year)].map((post) => (
              <PostPreview
                key={post.slug}
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
                slug={post.slug}
                excerpt={post.excerpt}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
