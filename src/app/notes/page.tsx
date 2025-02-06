import { getAllNotes, getAllNoteTags } from "@/lib/api";
import { ContentListPage } from "@/components/content-list-page";

export default function NotesPage() {
  const notes = getAllNotes();
  const tags = getAllNoteTags();

  return (
    <ContentListPage 
      title="All Notes"
      posts={notes}
      tags={tags}
    />
  );
}
