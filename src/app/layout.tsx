import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { createAvatar } from "@dicebear/core";
import { adventurerNeutral } from "@dicebear/collection";
import { HOME_OG_IMAGE_URL, SITE } from "@/lib/constants";
import { Dock } from "@/components/dock";
import { themeScript } from "@/lib/theme";
import Footer from "@/components/footer";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const createFavIcon = (size: number) => ({
  url: createAvatar(adventurerNeutral, {
    size,
    seed: "Az",
    mouth: ["variant04"],
  }).toDataUri(),
  type: "image/svg+xml",
  sizes: `${size}x${size}`,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name, template: `%s — ${SITE.name}` },
  description: SITE.description,
  icons: [16, 32, 96, 180, 192, 512].map(createFavIcon),
  openGraph: {
    siteName: SITE.name,
    type: "website",
    images: [HOME_OG_IMAGE_URL],
  },
  alternates: {
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#161618" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(inter.variable, mono.variable)}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-svh flex-col font-sans">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
        >
          Skip to content
        </a>
        <div id="content" className="flex grow flex-col">
          {children}
        </div>
        <Footer />
        <Dock />
      </body>
    </html>
  );
}
