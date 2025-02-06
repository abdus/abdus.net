import { cn } from "@/lib/utils";
import { Merriweather } from "next/font/google";
import { SyntaxHighlight } from "./syntax-highlight";

const font = Merriweather({ subsets: ["latin"], weight: ["400"] });

type Props = { content: string };

export function PostBody({ content }: Props) {
  return (
    <>
      <div
        className={cn(
          "prose max-w-none text-gray-600",
          "prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight",
          "prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4",
          "prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4",
          "prose-p:my-6 prose-p:leading-relaxed",
          "prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline",
          "prose-strong:font-semibold prose-strong:text-gray-900",
          "prose-code:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded",
          "prose-pre:bg-gray-100 prose-pre:p-4 prose-pre:rounded-lg",
          "prose-img:rounded-lg",
          "prose-ul:my-6 prose-li:my-2",
          font.className
        )}
      >
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>

      <SyntaxHighlight />
    </>
  );
}
