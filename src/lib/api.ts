import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import { Post } from "@/interfaces/post";

const postsDirectory = join(process.cwd(), "content/_posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);

  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { ...data, slug: realSlug, content } as Post;
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post) => !!post)
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

export function getPostsByTag(tag: string): Post[] {
  const posts = getAllPosts();
  return posts.filter((post) => post.tags.includes(tag));
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const allTags = posts.flatMap((post) => post.tags);
  return Array.from(new Set(allTags));
}

/** Notes */
const notesDirectory = join(process.cwd(), "content/_notes");

export function getNoteSlugs() {
  return fs.readdirSync(notesDirectory);
}

export function getNoteBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(notesDirectory, `${realSlug}.md`);

  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { ...data, slug: realSlug, content, archetype: "note" } as Post;
}

export function getAllNotes(): Post[] {
  const slugs = getNoteSlugs();
  const notes = slugs
    .map((slug) => getNoteBySlug(slug))
    .filter((note) => !!note);
  return notes;
}

export function getNotesByTag(tag: string): Post[] {
  const notes = getAllNotes();
  return notes.filter((note) => note.tags.includes(tag));
}

export function getAllNoteTags(): string[] {
  const notes = getAllNotes();
  const allTags = notes.flatMap((note) => note.tags);
  return Array.from(new Set(allTags));
}

/** pages **/
export function getPageBySlug(slug: string): Post | null {
  const fullPath = join(process.cwd(), `content/_pages/${slug}.md`);

  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { ...data, slug, content, archetype: "page" } as Post;
}

export function getAllPages(): Post[] {
  const slugs = fs.readdirSync(join(process.cwd(), "content/_pages"));
  const pages = slugs
    .map((slug) => getPageBySlug(slug.replace(/\.md$/, "")))
    .filter((page) => !!page);
  return pages;
}
