/**
 * Snowbell is a fictional cat. She talks to people in lolcat
 * language. She is silly and fun.
 */

import { ChatWithCat } from "@/components/chat-with-cat";

export const metadata = {
  title: "Talk to Snowbell",
  description: "Talk to Snowbell",
};

export default async function TalkToSnowbell() {
  return (
    <div className="flex h-[calc(100svh-3.5rem)] overflow-hidden">
      <ChatWithCat />
    </div>
  );
}
