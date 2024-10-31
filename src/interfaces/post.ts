import { type Author } from "./author";

export type Post = {
  slug: string;
  title: string;
  date: string;
  coverImage: string;
  author: Author;
  excerpt: string;
  meta?: {
    image: string | null;
    description: string | null;
  };
  content: string;
  draft?: boolean;
};
