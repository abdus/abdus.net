import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import { Post } from "@/interfaces/post";

/** Titles are plain text; drop markdown code ticks. */
function cleanTitle(title: unknown): string {
  return String(title ?? "").replace(/`/g, "");
}

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

  return { ...data, title: cleanTitle(data.title), slug: realSlug, content } as Post;
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

  return { ...data, title: cleanTitle(data.title), slug: realSlug, content, archetype: "note" } as Post;
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

/** Everything published (posts + notes), newest first. */
export function getAllWriting(): Post[] {
  return [...getAllPosts(), ...getAllNotes()]
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Unique tags across published writing, most used first. */
export function getWritingTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of getAllWriting()) {
    for (const tag of post.tags || []) {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

const HTML_TAG =
  /<\/?(?:a|b|br|code|details|div|em|figcaption|figure|h[1-6]|i|img|kbd|li|ol|p|picture|source|span|strong|sub|summary|sup|table|tbody|td|th|thead|tr|ul)\b[^<>\n]*>/gi;

/** Minutes to read, counting only words a reader sees (no HTML tags, attributes or image URLs). */
export function readingTime(markdown: string): number {
  const text = markdown
    // Real HTML tags only (so Vim keys like <C-w> or `<name>` still count as words).
    .replace(HTML_TAG, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1"); // links: keep the text, drop the URL
  const words = text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  return Math.max(1, Math.round(words / 230));
}

export function hrefFor(post: Pick<Post, "slug" | "archetype">): string {
  return post.archetype === "note" ? `/notes/${post.slug}` : `/posts/${post.slug}`;
}
