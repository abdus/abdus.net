import { cn } from "@/lib/utils";
import { SyntaxHighlight } from "./syntax-highlight";

type Props = { content: string };

export function PostBody({ content }: Props) {
  return (
    <>
      <div
        className={cn(
          "prose prose-site max-w-none",
          "text-[18px] leading-[1.75]",
          "prose-headings:font-display prose-headings:font-semibold prose-headings:tracking-tight",
          "prose-h2:mt-16 prose-h2:text-[28px] prose-h3:mt-12 prose-h3:text-[22px] prose-h4:text-[18px]",
          "prose-p:my-6",
          "prose-a:font-normal prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-4",
          "prose-strong:font-semibold",
          "prose-code:rounded-md prose-code:bg-fg/[0.06] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.88em] prose-code:font-normal",
          "prose-pre:my-8",
          "prose-img:rounded-2xl",
          "prose-blockquote:border-l-2 prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:text-fg-2",
          "prose-li:my-2 prose-hr:my-16"
        )}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <SyntaxHighlight />
    </>
  );
}
