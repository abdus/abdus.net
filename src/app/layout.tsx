import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Footer from "@/app/_components/footer";
import { HOME_OG_IMAGE_URL } from "@/lib/constants";
import { Alegreya, Courier_Prime } from "next/font/google";

import "./globals.css";

const mono = Courier_Prime({ subsets: ["latin"], weight: ['400'] });
const font = Alegreya({ subsets: ["latin"], weight: ['400', '700'] });

export const metadata: Metadata = {
  title: `Abdus Azad`,
  description: `Personal blog of Abdus Azad`,
  openGraph: { images: [HOME_OG_IMAGE_URL] },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#000000"
        />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#000" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      </head>
      <body
        className={cn(font.className, mono.className, "bg-background")}
      >
        <div className="min-h-svh">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
