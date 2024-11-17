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
          `prose text-[#334155] text-[1.2em]`,
          font.className
        )}
      >
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>

      <SyntaxHighlight />
    </>
  );
}
