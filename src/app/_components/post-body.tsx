import { cn } from "@/lib/utils";
import { Lora } from "next/font/google";
import { SyntaxHighlight } from "./syntax-highlight";

const font = Lora({ subsets: ["latin"], weight: ["400"] });

type Props = { content: string };

export function PostBody({ content }: Props) {
  return (
    <>
      <div
        className={cn(
          `max-w-2xl mx-auto prose text-foreground/90 text-[1.2em]`,
          font.className
        )}
      >
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>

      <SyntaxHighlight />
    </>
  );
}
