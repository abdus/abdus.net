import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/container";
import { ArrowUpRight } from "@/components/icons";
import { PageTitle } from "@/components/page-title";
import { ProjectIcon } from "@/components/project-icon";
import { SmsReading } from "@/components/sms-reading";
import { projects } from "@/data/projects";

// The one idea: watch one SMS become a transaction, then see how it got that good.

const POST = "/posts/from-regex-to-a-small-language-model";
const IMAGES = "/assets/posts/from-regex-to-a-small-language-model";
const description =
  "The model inside Spends: half a billion parameters, fine-tuned to read Indian bank SMS on the phone.";

export const metadata: Metadata = {
  title: "Pocket Ledger",
  description,
  alternates: { canonical: "/projects/pocket-ledger" },
  openGraph: {
    title: "Pocket Ledger",
    description,
    url: "/projects/pocket-ledger",
    images: [{ url: `${IMAGES}/cover.webp`, width: 1600, height: 840 }],
  },
  twitter: { card: "summary_large_image" },
};

const STATS = [
  { value: "99.0%", label: "every field right, on 3,540 messages it never saw" },
  { value: "1.5 s", label: "to read one SMS on a Pixel 7a" },
  { value: "352 MB", label: "for the whole model, offline" },
];

const ATTEMPTS = [
  { name: "Hand-written rules", score: "93.5%", note: "Every new bank template needed a new rule." },
  { name: "Classic machine learning", score: "81%", note: "One bank changed one template, and it fell apart." },
  { name: "0.5B model, untuned", score: "8.1%", note: "With the whole labelling guideline in its prompt." },
  { name: "0.5B model, fine-tuned", score: "97.4%", note: "Read all 496 messages in the template it had never seen." },
  { name: "With 60 more examples", score: "98.5%", note: "From its two weakest spots." },
];

function Heading({ children }: { children: string }) {
  return <h2 className="display mb-5 text-[28px] leading-[1.2]">{children}</h2>;
}

export default function PocketLedgerPage() {
  const project = projects.find((p) => p.slug === "pocket-ledger")!;

  return (
    <main>
      <PageTitle
        eyebrow={
          <Link href="/projects" className="inline-flex min-h-11 items-center transition-colors hover:text-fg">
            ← Projects
          </Link>
        }
        title={
          <span className="flex items-center gap-5">
            <ProjectIcon project={project} />
            Pocket Ledger
          </span>
        }
        lede="The model inside Spends. It reads an Indian bank SMS and writes down how much moved, which way, and to whom, without leaving the phone."
      />
      <Container className="space-y-20 text-[17px] leading-[1.7] text-fg-2">
        <section aria-label="Results and links">
          <dl className="grid grid-cols-3 gap-4 sm:gap-8">
            {STATS.map((s) => (
              <div key={s.value}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="display whitespace-nowrap text-[26px] leading-none tabular-nums sm:text-[40px]">{s.value}</dd>
                <dd className="mt-2 text-[13px] leading-snug text-fg-3">{s.label}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 flex flex-wrap gap-x-6 text-[15px]">
            <a href={project.site} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1 text-tint hover:underline hover:underline-offset-4">
              Try the playground <ArrowUpRight className="size-3.5" />
            </a>
            <Link href={POST} className="inline-flex min-h-11 items-center text-tint hover:underline hover:underline-offset-4">
              How I built it →
            </Link>
          </p>
        </section>

        <section>
          <Heading>One message, six fields</Heading>
          <SmsReading />
        </section>

        <section>
          <Heading>How it got here</Heading>
          <p>
            I labelled 15,017 of my own SMS, split them by date and tested each attempt on messages
            from 2026. A message counts only if all six fields are right.
          </p>
          <ul className="mt-6">
            {ATTEMPTS.map((a) => (
              <li key={a.name} className="flex items-baseline justify-between gap-6 border-b border-line/[0.07] py-4">
                <span>
                  <span className="block text-fg">{a.name}</span>
                  <span className="block text-[15px] leading-relaxed text-fg-3">{a.note}</span>
                </span>
                <span className="display text-[24px] tabular-nums">{a.score}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6">
            The dataset has since grown to 41,706 SMS. The retrained model is the one at the top of
            this page, and its 99.0% comes from a newer test set, so it isn&apos;t a direct
            comparison with this list.
          </p>
        </section>

        <section>
          <Heading>On the phone</Heading>
          <p>
            It is Qwen2.5-0.5B, fine-tuned with LoRA and squeezed to 4 bits, running on llama.cpp
            inside the app. A 1.5B version was almost three times the download, so the smaller one
            won. Spends downloads the model after install, and your messages stay on the phone.
          </p>
          <p className="mt-5">
            Training data included my own SMS, so I tried to get private names back out of it before
            shipping. It didn&apos;t write a single one.
          </p>
          <picture>
            <source media="(max-width: 640px)" srcSet={`${IMAGES}/app-gallery-m.webp`} width={1440} height={3066} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${IMAGES}/app-gallery.webp`}
              alt="Spends: the month, a payment, budgets and capture settings"
              width={3200}
              height={1821}
              loading="lazy"
              className="mt-8 h-auto w-full rounded-2xl ring-1 ring-line/10"
            />
          </picture>
        </section>

        <section>
          <Heading>What&apos;s next</Heading>
          <p>
            The app doesn&apos;t show how sure the model is yet. I want it to ask about only the shaky
            answers, then learn from them.
          </p>
        </section>
      </Container>
    </main>
  );
}
