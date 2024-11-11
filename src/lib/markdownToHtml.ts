import { remark } from "remark";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

export default function markdownToHtml(markdown: string) {
  const result = remark()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(remarkGfm)
    .use(rehypeRaw)
    .use(rehypeStringify)
    .processSync(markdown);
  return result.toString();
}
