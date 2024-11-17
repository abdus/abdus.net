/**
 * Freya is the name of a Fictional Cat. She talks to people in lolcat
 * language. She is silly and fun.
 */

import { ChatWithCat } from "@/app/_components/chat-with-cat";

export const metadata = {
  title: "Talk to Snowbell",
  description: "Talk to Freya, the Fictional Cat.",
};

export default async function TalkToFreya() {
  return <div className="h-full overflow-hidden flex"><ChatWithCat /></div>;
}
