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
    acc[year] = acc[year].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

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
        <div key={year} className="mb-16">
          <h2 className="text-xl md:text-3xl mb-6 underline">{year}</h2>
          <div className="flex flex-col gap-y-8">
            {postsByYear[Number(year)].map((post) => (
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
        </div>
      ))}
    </section>
  );
}
