import type { Config } from "tailwindcss";

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "media",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Text"',
          "var(--font-inter)",
          "system-ui",
          "sans-serif",
        ],
        display: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          "var(--font-inter)",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          '"SF Mono"',
          "ui-monospace",
          "var(--font-mono)",
          "Menlo",
          "monospace",
        ],
      },
      colors: {
        // Site palette
        bg: token("bg"),
        surface: token("surface"),
        fg: {
          DEFAULT: token("fg"),
          2: token("fg-2"),
          3: token("fg-3"),
        },
        line: token("line"),
        tint: token("tint"),

        // shadcn/ui palette
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      letterSpacing: {
        tightest: "-0.035em",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 6px)",
      },
      keyframes: {
        "eq-bar": {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "eq-bar": "eq-bar 1s ease-in-out infinite",
        "fade-up": "fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
      typography: () => ({
        site: {
          css: {
            "--tw-prose-body": "rgb(var(--fg) / 0.86)",
            "--tw-prose-headings": "rgb(var(--fg))",
            "--tw-prose-lead": "rgb(var(--fg-2))",
            "--tw-prose-links": "rgb(var(--tint))",
            "--tw-prose-bold": "rgb(var(--fg))",
            "--tw-prose-counters": "rgb(var(--fg-3))",
            "--tw-prose-bullets": "rgb(var(--fg-3))",
            "--tw-prose-hr": "rgb(var(--line) / 0.1)",
            "--tw-prose-quotes": "rgb(var(--fg))",
            "--tw-prose-quote-borders": "rgb(var(--line) / 0.15)",
            "--tw-prose-captions": "rgb(var(--fg-3))",
            "--tw-prose-code": "rgb(var(--fg))",
            "--tw-prose-pre-code": "#e5e5ea",
            "--tw-prose-pre-bg": "#1d1d1f",
            "--tw-prose-th-borders": "rgb(var(--line) / 0.15)",
            "--tw-prose-td-borders": "rgb(var(--line) / 0.08)",
          },
        },
      }),
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
export default config;
