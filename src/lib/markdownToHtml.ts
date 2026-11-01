import hljs from "highlight.js/lib/common";
import { remark } from "remark";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

// Minimal hast shapes; avoids pulling in @types/hast.
type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: { className?: unknown };
  children?: HastNode[];
};

const textOf = (node: HastNode): string =>
  node.type === "text" ? node.value || "" : (node.children || []).map(textOf).join("");

/** Highlight fenced code at build time so no highlighter ships to the browser. */
function rehypeHighlight() {
  const walk = (node: HastNode) => {
    if (node.type === "element" && node.tagName === "pre") {
      const code = node.children?.find(
        (c) => c.type === "element" && c.tagName === "code"
      );
      if (code) {
        const classes = Array.isArray(code.properties?.className)
          ? (code.properties!.className as string[])
          : [];
        const lang = classes
          .find((c) => c.startsWith("language-"))
          ?.slice("language-".length);
        const source = textOf(code);
        const html =
          lang && hljs.getLanguage(lang)
            ? hljs.highlight(source, { language: lang, ignoreIllegals: true }).value
            : hljs.highlightAuto(source).value;
        code.properties = { ...code.properties, className: [...classes, "hljs"] };
        code.children = [{ type: "raw", value: html }];
      }
      return;
    }
    node.children?.forEach(walk);
  };
  return (tree: HastNode) => walk(tree);
}

export default function markdownToHtml(markdown: string) {
  const result = remark()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .processSync(markdown);
  return result.toString();
}
