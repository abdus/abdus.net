import { PawPrint } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatWithCat, chatWithCatSchema } from "@/lib/schema";

type Props = {
  pushNewChat: (chat: ChatWithCat) => void;
  setIsThinking: (isThinking: boolean) => void;
};

export function ChatInput({ pushNewChat, setIsThinking }: Props) {
  return (
    <form
      className="w-full flex gap-1 items-end px-4"
      onSubmit={async (e) => {
        try {
          e.preventDefault();

          const form = e.currentTarget;
          const formData = new FormData(form);
          const chatInput = formData.get("chat")?.toString() || "";

          if (!chatInput) return;

          // clear the form
          form?.reset();

          const history = (() => {
            try {
              const storageKey = "chat-with-cat-history";
              const storedChats = sessionStorage.getItem(storageKey);
              const chats = (
                storedChats ? JSON.parse(storedChats) : []
              ) as ChatWithCat[];

              const validChats = chats.filter((chat) => {
                const resp = chatWithCatSchema.safeParse({
                  ...chat,
                  createdAt: new Date(chat.createdAt),
                });

                return resp.success;
              });

              return validChats;
            } catch (err) {
              console.error(
                "Failed to get chat history from local storage",
                err
              );
              return [];
            }
          })();

          // optismistically add the chat to the UI
          pushNewChat({
            to: "cat",
            from: "hooman",

            isRead: false,
            message: chatInput,

            createdAt: new Date(),
          });

          setIsThinking(true);
          const resp = await fetch("/api/tools/cat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: chatInput, history }),
          });

          if (!resp.ok) {
            console.error("Failed to send message to the server");
            return;
          }

          const reader = resp.body?.getReader();

          if (!reader) {
            console.error("Failed to get a reader from the response");
            return;
          }

          const decoder = new TextDecoder();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              break;
            }

            if (value) {
              const text = decoder.decode(value, { stream: true });
              const line = text
                .split("\n")
                .filter(Boolean)
                .map((line) => line.replace(/^0:"/g, "").replace(/"$/g, ""))
                .join("");

              buffer += line;
            }
          }

          setIsThinking(false);

          pushNewChat({
            to: "hooman",
            from: "cat",

            isRead: false,
            message: buffer,

            createdAt: new Date(),
          });
        } catch (err) {
          console.error("Failed to send message to the server", err);
        } finally {
          setIsThinking(false);
        }
      }}
    >
      <div className="shadow-inner shadow w-full rounded-lg">
        <Input
          name="chat"
          className="w-full border-0 rounded-lg focus-visible:ring-0"
          autoComplete="off"
          placeholder="Type a message..."
          tabIndex={1}
        />
      </div>

      <Button
        size="icon"
        variant="ghost"
        tabIndex={2}
        className="aspect-square flex items-center justify-center shadow-inner shadow"
      >
        <PawPrint />
      </Button>
    </form>
  );
}
