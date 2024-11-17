import { OpenAIStream, StreamingTextResponse } from "ai";
import { getLolcatResponse } from "@/app/tools/cat/actions";
import { ChatWithCat, chatWithCatSchema } from "@/lib/schema";

export async function POST(req: Request) {
  const json = await req.json();
  const { sessionId, message, history } = json || {};
  const historyFormatted = history
    .filter(
      (chat: ChatWithCat) =>
        chatWithCatSchema.safeParse({
          ...chat,
          createdAt: new Date(chat.createdAt),
        }).success
    )
    .map((chat: ChatWithCat) => ({
      role: 'user',
      name: chat.from,
      content: [{ type: "text", text: chat.message }],
    }));

  const response = await getLolcatResponse(message, historyFormatted);
  const responseStream = OpenAIStream(response);
  return new StreamingTextResponse(responseStream);
}
