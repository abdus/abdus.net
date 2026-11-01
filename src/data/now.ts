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
  /** A few photos, portrait (4:5). */
  photos?: { src: string; alt: string }[];
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
      label: "Riding",
      title: "Turning motorcycle rides into a heads-up display",
      body:
        "Rider HUD records speed, lean angle and route from my phone while I ride, lines it up with action-camera footage, and burns a HUD into the video. Fully offline. The Android recorder works end to end; iOS is next.",
      stats: [{ value: "21 min", label: "first ride recorded, synced and rendered" }],
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
        { src: "/assets/now/coast-to-hills-1.webp", alt: "Me on my motorcycle on a wide, empty beach under a blue sky" },
        { src: "/assets/now/coast-to-hills-2.webp", alt: "Sunset over the sea, a wave breaking on dark rocks" },
        { src: "/assets/now/coast-to-hills-3.webp", alt: "Green hills and tea gardens in Wayanad under scattered cloud" },
        { src: "/assets/now/coast-to-hills-4.webp", alt: "My motorcycle parked by a tea garden with a mountain behind, above a map of the route" },
      ],
    },
  ] satisfies NowItem[],
};
