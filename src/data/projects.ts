export type TerminalLine = { text: string; prompt?: boolean; dim?: boolean };

export type Media =
  | { kind: "image"; src: string; alt: string; label: string }
  | { kind: "terminal"; title: string; lines: TerminalLine[]; caption?: string };

export type Project = {
  title: string;
  /** Year the project started. */
  year: number;
  /** One line, in my words. */
  description: string;
  /** Main language or stack, shown as a quiet label. */
  tech: string;
  /** Live site, if it is still up. */
  site?: string;
  /** Public source. Leave out for private repos. */
  source?: string;
  /** Shown on the home page. */
  featured?: boolean;
  /** What I'm working on right now. */
  current?: boolean;
  /** Early learning projects, folded away at the bottom. */
  early?: boolean;
  /** No longer running or maintained. */
  retired?: boolean;
  /** A real glimpse of the thing: a screenshot or a terminal session. */
  media?: Media;
};

const gh = (repo: string) => `https://github.com/abdus/${repo}`;

export const projects: Project[] = [
  {
    title: "Spends",
    year: 2026,
    description:
      "An Android app that builds your spending history from bank and UPI messages. No bank login, no manual entry, no cloud.",
    tech: "Flutter",
    site: "https://spends.abdus.net",
    featured: true,
    current: true,
    media: {
      kind: "image",
      src: "/assets/projects/spends.webp",
      alt: "The Spends website, showing the app's monthly spending screen",
      label: "spends.abdus.net",
    },
  },
  {
    title: "Snowbell",
    year: 2024,
    description: "A fictional cat you could chat with, who only ever answered in lolcat.",
    tech: "Next.js · OpenAI",
    retired: true,
  },
  {
    title: "Harbor",
    year: 2024,
    description:
      "An HTTP load balancer built from scratch on Rust's standard library, to learn how networking really works.",
    tech: "Rust",
    source: gh("harbor"),
    featured: true,
    media: {
      kind: "terminal",
      title: "siege",
      lines: [
        { text: "siege -t1M -c1000 http://0.0.0.0:8080", prompt: true },
        { text: "Lifting the server siege...", dim: true },
        { text: "Transactions:          173012 hits" },
        { text: "Availability:          100.00 %" },
        { text: "Transaction rate:      2855.93 trans/sec" },
        { text: "Failed transactions:   0" },
      ],
      caption: "A minute at 1,000 concurrent connections, on my Ryzen 5 machine.",
    },
  },
  {
    title: "Rust Redis",
    year: 2023,
    description: "A small Redis-compatible server that speaks the RESP2 protocol.",
    tech: "Rust",
    source: gh("rust-redis"),
    featured: true,
    media: {
      kind: "terminal",
      title: "redis-cli",
      lines: [
        { text: "redis-cli -p 6379", prompt: true },
        { text: "127.0.0.1:6379> PING" },
        { text: "Hello from the Other Side" },
      ],
    },
  },
  {
    title: "Lynx Bar",
    year: 2022,
    description: "A searchable directory of well-made web apps.",
    tech: "Next.js",
    source: gh("awesome-websites"),
    retired: true,
  },
  {
    title: "Nginx Pretty Index",
    year: 2021,
    description: "A beautiful auto-index page for Nginx, made with nothing but XSLT, HTML and CSS.",
    tech: "XSLT",
    source: gh("nginx-pretty-index"),
    featured: true,
    media: {
      kind: "image",
      src: "/assets/projects/nginx-pretty-index.webp",
      alt: "A directory listing styled by Nginx Pretty Index, with a search box and a game-world wallpaper",
      label: "Nginx autoindex",
    },
  },
  {
    title: "MiniGrep",
    year: 2021,
    description: "A small take on GNU grep, minus regular expressions. Written to learn Rust.",
    tech: "Rust",
    source: gh("minigrep"),
  },
  {
    title: "Image Resizer",
    year: 2021,
    description: "Resizes local or remote images on the fly by a scale factor.",
    tech: "Java · Spring Boot",
    source: gh("java-image-resizer"),
  },
  {
    title: "DogeGram",
    year: 2021,
    description: "An Instagram look-alike, but for memes.",
    tech: "Next.js",
    source: gh("doge-gram"),
  },
  {
    title: "Flixx",
    year: 2021,
    description: "An Android app for browsing films by genre, powered by The Movie Database.",
    tech: "React Native",
    source: gh("flixx"),
  },
  {
    title: "Focus Time",
    year: 2021,
    description: "A tiny Android app that helps you stay on one task.",
    tech: "React Native",
    source: gh("focus-time"),
  },
  {
    title: "Webpack TypeScript Starter",
    year: 2021,
    description: "A starting point for TypeScript projects, with Webpack and CSS Modules set up.",
    tech: "TypeScript",
    source: gh("webpack-typescript-starter"),
  },
  {
    title: "Hugo Theme Fiber",
    year: 2020,
    description: "A minimal theme for Hugo blogs.",
    tech: "Hugo",
    source: gh("hugo-theme-fiber"),
    media: {
      kind: "image",
      src: "/assets/projects/hugo-theme-fiber.webp",
      alt: "A blog home page using Hugo Theme Fiber, listing posts with dates and excerpts",
      label: "Hugo Theme Fiber",
    },
  },
  {
    title: "ctrl-v",
    year: 2020,
    description: "A no-login pastebin you can deploy yourself in a minute, built on Netlify Functions.",
    tech: "Node.js",
    site: "https://paste.abdus.net",
    source: gh("ctrl-v"),
  },
  {
    title: "accueil.vim",
    year: 2020,
    description: "My first Vim plugin, for a handful of text-formatting chores.",
    tech: "Vimscript",
    source: gh("accueil.vim"),
  },
  {
    title: "Scripts",
    year: 2020,
    description: "Small scripts that automate the repetitive parts of my day.",
    tech: "Bash",
    source: gh("scripts"),
  },
  {
    title: "React DropDown",
    year: 2019,
    description: "A customisable dropdown menu component for React.",
    tech: "React",
    source: gh("react-dropdown"),
  },

  // Where it started.
  {
    title: "React Chrome Extension",
    year: 2020,
    description: "A template for building Chrome extensions with React.",
    tech: "React",
    source: gh("react-chrome-ext"),
    early: true,
  },
  {
    title: "GoldenFalcon",
    year: 2018,
    description: "A command-line tool for sending email, built on Nodemailer.",
    tech: "Node.js",
    source: gh("goldenfalcon"),
    early: true,
  },
  {
    title: "Photo Editor",
    year: 2018,
    description: "Blur, brightness, contrast and more, using CSS filters, with export.",
    tech: "JavaScript",
    site: "https://abdus.github.io/photo-editor/",
    source: gh("photo-editor"),
    early: true,
  },
  {
    title: "Gradient Generator",
    year: 2018,
    description: "Make CSS gradients. Built to learn the DOM.",
    tech: "JavaScript",
    site: "https://abdus.github.io/background-gradient-generator/",
    source: gh("background-gradient-generator"),
    early: true,
  },
  {
    title: "Pixel Art Maker",
    year: 2018,
    description: "Draw by colouring a grid of squares. Part of the Google India front-end scholarship.",
    tech: "JavaScript",
    site: "https://abdus.github.io/pixel-art-maker/",
    source: gh("pixel-art-maker"),
    early: true,
  },
  {
    title: "LinkClick",
    year: 2018,
    description: "A Chrome extension for reaching favourite sites quickly. The first thing I built after learning to code.",
    tech: "JavaScript",
    source: gh("linkclick"),
    early: true,
  },
  {
    title: "InspiroTab",
    year: 2018,
    description: "A new-tab page with a wallpaper and a quote.",
    tech: "JavaScript",
    source: gh("InspiroTab"),
    early: true,
  },
];

export const featuredProjects = () => projects.filter((p) => p.featured);
/** Favourites worth a proper look: they have something to show. */
export const showcaseProjects = () =>
  projects.filter((p) => p.media && !p.current && !p.early && !p.retired);
export const currentProjects = () => projects.filter((p) => p.current);

/** Everything not shown above (current, showcased, early), by year, newest first. */
export function projectsByYear(): [number, Project[]][] {
  const years = new Map<number, Project[]>();
  for (const p of projects) {
    if (p.current || p.early || p.media) continue;
    years.set(p.year, [...(years.get(p.year) || []), p]);
  }
  return [...years.entries()].sort((a, b) => b[0] - a[0]);
}

export const earlyProjects = () => projects.filter((p) => p.early);
