import { getAllWriting, hrefFor } from "@/lib/api";
import { SITE } from "@/lib/constants";

export const dynamic = "force-static";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function GET() {
  const items = getAllWriting()
    .map((post) => {
      const url = `${SITE.url}${hrefFor(post)}`;
      return `    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escape(SITE.name)}</title>
    <link>${SITE.url}</link>
    <description>${escape(SITE.description)}</description>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
