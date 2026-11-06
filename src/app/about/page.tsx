import { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/container";
import { PageTitle } from "@/components/page-title";
import { Reveal } from "@/components/reveal";
import { Avatar } from "@/components/avatar";
import { authorLine } from "@/components/testimonial-card";
import testimonialData from "@/data/testimonials.json";
import { SITE } from "@/lib/constants";

/*
 * The one idea: the person behind the homepage, told as a story in my own words.
 * Where I come from and how I got here, what I care about when I build, what I do away
 * from the keyboard (with my own photos), what one teammate says, and how to say hello.
 * Prose and photos only: no timeline, no logos, no skills list.
 */

export const metadata: Metadata = {
  title: "About",
  description:
    "Abdus Azad is a software engineer in Bengaluru. He grew up in Assam, has built for the web since 2020, and rides and treks whenever he can.",
};

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

const PHOTOS = [
  { src: "/assets/now/coast-beach.webp", alt: "Me on my motorcycle on a wide, empty beach under a big sky" },
  { src: "/assets/now/coast-hills.webp", alt: "Green hills rolling away in Wayanad under a blue sky" },
  { src: "/assets/now/coast-palms.webp", alt: "A curve of beach with palm trees and scattered rocks" },
];

const VALUES = [
  {
    lead: "Measure it, before and after.",
    body: "I'd rather show the graph than say something got faster. If I can't measure a change, I'm not sure it happened.",
  },
  {
    lead: "Fix the cause, not the symptom.",
    body: "When something breaks at 2 am, the fix that night matters less than the change that stops it breaking the same way again.",
  },
  {
    lead: "Write it down.",
    body: "Runbooks, post-mortems, and this site. Future me forgets everything, and so does everyone else.",
  },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal as="section" className="mt-20 first:mt-0 sm:mt-24">
      <h2 className="text-[24px] font-semibold tracking-[-0.025em] text-fg">{title}</h2>
      <div className="mt-5 space-y-5 text-[18px] leading-[1.75] text-fg-2">{children}</div>
    </Reveal>
  );
}

export default function AboutPage() {
  const quote = testimonialData.testimonials.find((t) => t.author.name === "Matt Smith");

  return (
    <main>
      <PageTitle
        title="About"
        lede="I'm Abdus, a software engineer in Bengaluru. I grew up in Assam, and I've been building things for the web since 2020."
      />

      <Container>
        <Section title="How I got here">
          <p>
            I studied computer applications at Gauhati University, and started working before I&apos;d
            finished: a front-end internship at{" "}
            <Link href="https://mailmodo.com" className="link" {...external}>
              Mailmodo
            </Link>{" "}
            in 2020, building interactive emails. Around the same time I helped look after the{" "}
            <Link href="https://zerotomastery.io" className="link" {...external}>
              Zero to Mastery
            </Link>{" "}
            developer community, my first taste of keeping something big running.
          </p>
          <p>
            Then came two years at Level SuperMind, a meditation and wellness app, where I started as an
            engineer and ended up leading a small team. After that I went remote, building the backend for
            AutoGolf in the US, and then took a full-stack role at Unitron AI.
          </p>
          <p>
            In 2025 I joined{" "}
            <Link href="https://neosapien.ai" className="link" {...external}>
              NeoSapien
            </Link>
            , where we make Neo 1, a pendant that turns your conversations into memories you can search. I
            came in to build the app and slowly moved down the stack. Today I look after{" "}
            <Link href="/#work" className="link">
              everything it runs on
            </Link>
            .
          </p>
        </Section>

        <Section title="What I care about">
          {VALUES.map((v) => (
            <p key={v.lead}>
              <span className="font-medium text-fg">{v.lead}</span> {v.body}
            </p>
          ))}
        </Section>

        <Section title="Away from the keyboard">
          <p>
            I ride a motorcycle and go trekking whenever I can, and I take a camera everywhere. In
            September I rode from Bengaluru down to the coast and up into the tea hills of Wayanad;{" "}
            <Link href="/now" className="link">
              the ride is on my now page
            </Link>
            .
          </p>
          <div className="!mt-8 grid grid-cols-3 gap-2 sm:gap-3">
            {PHOTOS.map((p) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={p.src}
                src={p.src}
                alt={p.alt}
                loading="lazy"
                className="aspect-[4/5] w-full rounded-2xl object-cover ring-1 ring-line/10"
              />
            ))}
          </div>
          <p className="!mt-4 text-[13px] text-fg-3">
            More on{" "}
            <Link href="https://www.instagram.com/azabdus/" className="text-fg-2 hover:text-tint" {...external}>
              Instagram
            </Link>
            .
          </p>
        </Section>

        {quote && (
          <Section title="What people say">
            <figure>
              <blockquote
                className="text-[20px] font-light leading-[1.6] text-fg-2 [&_strong]:font-normal [&_strong]:text-fg"
                dangerouslySetInnerHTML={{ __html: `“${quote.summary}”` }}
              />
              <figcaption className="mt-5 flex items-center gap-3 text-[14px] leading-tight">
                <Avatar name={quote.author.name} src={quote.author.avatar} className="size-8 text-[32px]" />
                <span>
                  <span className="block text-fg">{quote.author.name}</span>
                  <span className="block text-fg-3">{authorLine(quote.author)}</span>
                </span>
              </figcaption>
            </figure>
            <p className="text-[15px]">
              <Link href="/testimonials" className="text-fg-2 transition-colors hover:text-tint">
                More from people I&apos;ve worked with →
              </Link>
            </p>
          </Section>
        )}

        <Section title="Say hello">
          <p>
            Email is the best way to reach me:{" "}
            <Link href={`mailto:${SITE.email}`} className="link">
              {SITE.email}
            </Link>
            . I&apos;m also on{" "}
            <Link href={SITE.github} className="link" {...external}>
              GitHub
            </Link>{" "}
            and{" "}
            <Link href={SITE.linkedin} className="link" {...external}>
              LinkedIn
            </Link>
            , and my{" "}
            <Link href={SITE.resume} className="link">
              résumé
            </Link>{" "}
            is here if you need it.
          </p>
        </Section>
      </Container>
    </main>
  );
}
