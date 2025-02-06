import { redirect } from "next/navigation";

export default function NotesPage() {
  redirect('/posts')
  return null
}
