import { randomUUID } from "crypto";
import { db } from "@vercel/postgres";
import { cookies } from "next/headers";
import { getLolcatResponse } from "@/lib/openai";
import { ChatWithCat, chatWithCatSchema } from "@/lib/schema";

export async function POST(req: Request) {
  const json = await req.json();
  const { message, history } = json || {};
  const threadId = (await cookies()).get("threadId")?.value || randomUUID();
  const historyFormatted = history
    .filter(
      (chat: ChatWithCat) =>
        chatWithCatSchema.safeParse({
          ...chat,
          createdAt: new Date(chat.createdAt),
        }).success
    )
    .map((chat: ChatWithCat) => ({
      role: "user",
      name: chat.from,
      content: [{ type: "text", text: chat.message }],
    }));

  // store the chat history in the db
  db.query(
    `INSERT INTO snowbell_chat_history (
      thread_id, 
      message, 
      "from",
      "to"
    ) VALUES ($1, $2, $3, $4)`,
    [threadId, message.substring(0, 1000), "user", "cat"]
  ).catch((err) => console.error("Failed to store chat history", err));

  const response = await getLolcatResponse(message, historyFormatted);
  const completion =
    response.choices.shift()?.message.content ||
    "Snowbell is sleeping right now. Come back later.";

  db.query(
    `INSERT INTO snowbell_chat_history (
      thread_id, 
      message, 
      "from",
      "to"
    ) VALUES ($1, $2, $3, $4)`,
    [threadId, completion, "cat", "user"]
  ).catch((err) => console.error("Failed to store chat history", err));

  // set the threadId in the cookie
  (await cookies()).set("threadId", threadId, {
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  });

  return new Response(JSON.stringify({ resp: completion }), {
    headers: { "Content-Type": "application/json" },
  });
}
