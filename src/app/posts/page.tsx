import { Metadata } from "next";
import { getAllWriting, getWritingTags } from "@/lib/api";
import { ContentListPage } from "@/components/content-list-page";

export const metadata: Metadata = {
  title: "Writing",
  description: "Posts and notes on software, tools and the web.",
};

export default function PostsPage() {
  const posts = getAllWriting();

  return (
    <ContentListPage
      title="Writing"
      lede="Notes on software, tools, and the occasional detour."
      posts={posts}
      tags={getWritingTags()}
    />
  );
}
