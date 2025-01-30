/**
 * Freya is the name of a Fictional Cat. She talks to people in lolcat
 * language. She is silly and fun.
 */

import { ChatWithCat } from "@/components/chat-with-cat";

export const metadata = {
  title: "Talk to Snowbell",
  description: "Talk to Snowbell",
};

export default async function TalkToFreya() {
  return <div className="h-full overflow-hidden flex"><ChatWithCat /></div>;
}
