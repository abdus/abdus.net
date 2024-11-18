import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Footer from "@/components/footer";
import { createAvatar } from "@dicebear/core";
import { adventurerNeutral } from "@dicebear/collection";
import { HOME_OG_IMAGE_URL } from "@/lib/constants";
import { Alegreya, Courier_Prime } from "next/font/google";

import "./globals.css";

const mono = Courier_Prime({ subsets: ["latin"], weight: ["400"] });
const font = Alegreya({ subsets: ["latin"], weight: ["400", "700"] });

const createFavIcon = (size: number) => {
  const icon = createAvatar(adventurerNeutral, {
    size,
    seed: "Az",
    mouth: ["variant04"],
  }).toDataUri();

  return {
    url: icon,
    type: "image/svg+xml",
    sizes: `${size}x${size}`,
  };
};

export const metadata: Metadata = {
  title: `Abdus Azad`,
  icons: [
    createFavIcon(16),
    createFavIcon(32),
    createFavIcon(96),
    createFavIcon(180),
    createFavIcon(192),
    createFavIcon(512),
  ],
  description: `Personal blog of Abdus Azad`,
  openGraph: { images: [HOME_OG_IMAGE_URL] },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="light">
      <head>
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#000" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      </head>
      <body className={cn(font.className, mono.className, "bg-background")}>
        <div className="h-svh flex flex-col overflow-hidden">
          <div className="grow flex flex-col overflow-hidden">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
