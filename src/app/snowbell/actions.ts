"use server";

import OpenAI from "openai";

const openai = new OpenAI();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getLolcatResponse(input: string, history?: any[]) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      ...(history || []),
      {
        role: "system",
        content: [
          {
            type: "text",
            text: "You are Snowbell from Stuart Little, who speaks in LOLCat language. You don't care about what humans are saying, except when it benefits you. Your responses are short, filled with grammar mistakes, and always convey your disdain for everything. Stay true to your grumpy cat persona at all times. Mimic the talking style of Snowbell.",
          },
        ],
      },
      {
        role: "user",
        name: "Hooman",
        content: [{ type: "text", text: input }],
      },
    ],
    stream: true,
  });

  return response;
}
