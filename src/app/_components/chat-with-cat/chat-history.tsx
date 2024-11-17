"use client";

import { cn } from "@/lib/utils";
import { ChatWithCat } from "@/lib/schema";
import { CatIcon } from "lucide-react";

type Props = { chats: ChatWithCat[]; isThinking: boolean };

export function ChatHistory({ chats, isThinking }: Props) {
  return (
    <div className="w-full max-h-svh grow overflow-auto space-y-2 px-4">
      {chats.map((chat, i) => {
        return (
          <div
            key={i}
            style={{ overflowAnchor: "none" }}
            className={cn("w-full max-w-[85%] flex items-start", {
              "mr-0 ml-auto": "cat" !== chat.from,
              "justify-end": "cat" !== chat.from,
            })}
          >
            {chat.from === "cat" && (
              <CatIcon className="mr-2 size-[1.3em] min-w-[1.3em] mt-2 text-gray-500" />
            )}
            <div
              className={cn("py-1 rounded-md items-end", {
                "px-2": chat.from === "cat",
                "bg-gray-100": chat.from === "cat",
              })}
            >
              {chat.message}
            </div>
          </div>
        );
      })}

      {isThinking && (
        <div
          style={{ overflowAnchor: "none" }}
          className={cn(
            "w-full max-w-[85%] flex items-start",
            "justify-start ml-0 opacity-50"
          )}
        >
          <CatIcon className="mr-2 size-[1.3em] min-w-[1.3em] mt-2 text-gray-500" />
          <div
            className={cn(
              "py-1 rounded-md items-end px-2 bg-gray-100",
              "animate-pulse"
            )}
          >
            Snowbell is thinking with one brain cell...
          </div>
        </div>
      )}

      <div style={{ overflowAnchor: "auto", height: "1px", width: `100%` }} />
    </div>
  );
}
