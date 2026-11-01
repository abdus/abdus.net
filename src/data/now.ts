/**
 * The /now page (https://nownownow.com/about): what I'm focused on at this point in my life.
 * Keep it honest and current. Bump `updated` whenever you touch it; a stale now page is worse than none.
 */

export type NowStat = { value: string; label: string };

export type NowItem = {
  /** One word, shown small: Building, Riding, Reading… */
  label: string;
  title: string;
  body: string;
  stats?: NowStat[];
  link?: { href: string; label: string };
  /**
   * A small photo mosaic. The first photo is the wide hero; then "tall" takes two rows,
   * "wide" two columns, and anything else a single cell.
   */
  photos?: { src: string; alt: string; shape?: "tall" | "wide" }[];
};

export const NOW = {
  updated: "2026-11-02",
  intro:
    "What I'm focused on at this point in my life. My day job is software engineering at an early-stage startup; this is everything around it.",
  items: [
    {
      label: "Building",
      title: "Teaching a tiny model to read my bank's texts",
      body:
        "Spends turns the payment SMS your bank already sends into a clear picture of where your money goes. I labelled 15,017 of my own messages, then fine-tuned a half-billion-parameter model to read them. It now beats my hand-written rules, and it runs entirely on the phone. Nothing leaves it.",
      stats: [
        { value: "1.5 s", label: "to read one SMS on my Pixel 7a" },
        { value: "98.5%", label: "fully right, vs 93.5% for my hand-written rules" },
        { value: "352 MB", label: "for the whole model, offline" },
      ],
      link: { href: "https://spends.abdus.net", label: "spends.abdus.net" },
    },
    {
      label: "Reading",
      title: "A digest that reads the internet for me",
      body:
        "agent-wire is my personal digest of the best writing on building with AI agents. Every six hours it checks the blogs and people I follow, scores each post against what I care about, and keeps about ten, with the best of the discussion underneath. I started it this week.",
    },
    {
      label: "Away from the keyboard",
      title: "Down the coast, up into the hills",
      body:
        "In September I rode from Bengaluru through Mysuru and Coorg, down to the sea at Kannur, then up into the tea hills of Wayanad. Five days on the bike, at the tail end of the monsoon.",
      photos: [
        { src: "/assets/now/coast-sunset.webp", alt: "Me photographing the sunset from a rocky beach, waves breaking on the rocks beside me" },
        { src: "/assets/now/coast-beach.webp", alt: "Me on my motorcycle on a wide, empty beach under a blue sky", shape: "tall" },
        { src: "/assets/now/coast-hills.webp", alt: "Tea gardens and green hills rolling away in Wayanad under a blue sky", shape: "wide" },
        { src: "/assets/now/coast-route.webp", alt: "My motorcycle by a tea garden with a mountain behind, above a map of the route from Bengaluru to Wayanad" },
        { src: "/assets/now/coast-palms.webp", alt: "A curve of beach with palm trees and scattered rocks" },
      ],
      link: { href: "https://www.instagram.com/azabdus/", label: "More photos on Instagram" },
    },
  ] satisfies NowItem[],
};
