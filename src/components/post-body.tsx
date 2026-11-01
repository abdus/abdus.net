import { cn } from "@/lib/utils";
import { SyntaxHighlight } from "./syntax-highlight";

type Props = { content: string };

export function PostBody({ content }: Props) {
  return (
    <>
      <div
        className={cn(
          "prose prose-site max-w-none",
          "text-[18px] leading-[1.8] tracking-[-0.003em]",
          "prose-headings:font-display prose-headings:font-light prose-headings:tracking-[-0.02em]",
          "prose-h2:mt-20 prose-h2:text-[32px] prose-h3:mt-14 prose-h3:text-[24px] prose-h4:text-[19px] prose-h4:font-normal",
          "prose-p:my-6",
          "prose-a:font-normal prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-4",
          "prose-strong:font-semibold",
          "prose-code:rounded-md prose-code:bg-fg/[0.06] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.88em] prose-code:font-normal",
          "prose-pre:my-8",
          "prose-img:rounded-2xl prose-img:mx-auto",
          "prose-blockquote:border-l prose-blockquote:pl-6 prose-blockquote:font-light prose-blockquote:not-italic prose-blockquote:text-[21px] prose-blockquote:text-fg-2",
          "prose-li:my-2 prose-hr:my-16"
        )}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <SyntaxHighlight />
    </>
  );
}
