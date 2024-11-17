"use client";

import Container from "../container";
import { ChatInput } from "./chat-input";
import { useEffect, useState } from "react";
import { ChatHistory } from "./chat-history";
import { chatWithCatSchema, type ChatWithCat } from "@/lib/schema";

export function ChatWithCat() {
  const [chats, setChats] = useState<ChatWithCat[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const pushNewChat = (chat: ChatWithCat) => {
    setChats((prevChats) => [...prevChats, chat]);
  };

  useEffect(() => {
    const storageKey = "chat-with-cat-history";
    const validChats = chats.filter(
      (chat) => chatWithCatSchema.safeParse(chat).success
    );

    sessionStorage.setItem(storageKey, JSON.stringify(validChats));
  }, [chats]);

  return (
    <Container className="grow pb-2 px-0 overflow-hidden flex flex-col max-w-3xl max-h-[94vh]">
      <ChatHistory chats={chats} isThinking={isThinking} />
      <ChatInput pushNewChat={pushNewChat} setIsThinking={setIsThinking} />
    </Container>
  );
}
