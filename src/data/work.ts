/**
 * My day job, for the home page.
 *
 * Public page, my employer's data: results are percentages only, never absolute figures,
 * and no customer names, money or security details. Source: ~/Documents/brag-sheet.md.
 */

export type Moment = {
  title: string;
  /** The figure, e.g. "70". Always a percentage. */
  value: string;
  label: string;
};

export type PastJob = {
  company: string;
  href?: string;
  /** What I was there, phrased to sit in a sentence: "led product engineering at". */
  did: string;
};

export const WORK = {
  company: "NeoSapien",
  href: "https://neosapien.ai",
  /** The journey of one conversation, drawn as a line. Icons live in components/work.tsx. */
  flow: [
    { icon: "neo", label: "Neo 1 hears it" },
    { icon: "phone", label: "Your phone relays it" },
    { icon: "servers", label: "Our servers make sense of it" },
    { icon: "search", label: "You search it later" },
  ] as const,
  /** The stretch of that line that's mine: from the Bluetooth link to the end. */
  mine: "The part I look after",
  moments: [
    { title: "Faster memories", value: "70", label: "less time between a conversation ending and its memory being ready" },
    { title: "Quieter nights", value: "78", label: "fewer outages a quarter since I set up alerting and on-call from scratch" },
    { title: "Steady under load", value: "91", label: "fewer server errors, while traffic grew 560%" },
  ] satisfies Moment[],
};

export const PAST_JOBS: PastJob[] = [
  { company: "Unitron AI", did: "was a senior full-stack engineer at" },
  { company: "AutoGolf", did: "built the backend for" },
  { company: "Level SuperMind", href: "https://level.game", did: "led product engineering at" },
  { company: "Mailmodo", href: "https://mailmodo.com", did: "started out as an intern at" },
];
