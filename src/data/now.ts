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
};

export const NOW = {
  updated: "2026-11-01",
  intro:
    "What I'm focused on at this point in my life. My day job is software engineering at an early-stage startup; this is everything around it.",
  items: [
    {
      label: "Building",
      title: "Teaching a tiny model to read my bank's texts",
      body:
        "Spends turns the payment SMS your bank already sends into a clear picture of where your money goes. I labelled 15,017 of my own messages, then fine-tuned a half-billion-parameter model to read them. It now beats my hand-written rules, and it runs entirely on the phone. Nothing leaves it.",
      stats: [
        { value: "0.75 s", label: "to read one SMS on my Pixel 7a" },
        { value: "98.7%", label: "accurate, vs 95.3% for my hand-written rules" },
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
      title: "Travel and trekking, whenever I can",
      body: "Outside work, I travel and go trekking whenever I can.",
    },
  ] satisfies NowItem[],
};
