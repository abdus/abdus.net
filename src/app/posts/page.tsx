import { getAllPosts, getAllTags } from "@/lib/api";
import { ContentListPage } from "@/components/content-list-page";

export default function PostsPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <ContentListPage 
      title="All Posts"
      posts={posts}
      tags={tags}
    />
  );
}
