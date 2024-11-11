import markdownToHtml from "@/lib/markdownToHtml";
import Container from "../_components/container";
import Header from "../_components/header";
import { cn } from "@/lib/utils";
import { Merriweather } from "next/font/google";

const font = Merriweather({ weight: ["400"], subsets: ["latin"] });

const md = `
## About Me

Hey, I am Abdus. I am a Software Engineer currently working at a early stage 
start-up. I mostly work with (but not limited to) Node and React.

I also love travelling and trekking.

#### Contact Info

I am always reachable via Email [abdus@abdus.net](mailto:abdus@abdus.net).
If you are in LinkedIn, feel free to [connect](https://linkedin.com/in/thisisabdus).

That's all about me! I will keep this page updated incase any exciting things
happens in my life(hopefully).`;

export default function AboutPage() {
  return (
    <div>
      <Header />
      <Container className="max-w-4xl">
        <div
          className={cn("prose", font.className)}
          dangerouslySetInnerHTML={{ __html: markdownToHtml(md) }}
        />
      </Container>
    </div>
  );
}
