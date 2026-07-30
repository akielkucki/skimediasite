import { siteConfig } from "@/config/site";
import { getArticles } from "@/lib/cms";
import { absoluteUrl } from "@/lib/utils";

export const revalidate = 900;

/** Escapes text for inclusion in an XML node. */
const xml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const { items } = await getArticles({ limit: 40 });

  const entries = items
    .map((article) => {
      const url = absoluteUrl(`/articles/${article.slug}`);
      return `    <item>
      <title>${xml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${xml(article.dek)}</description>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <category>${xml(article.category.label)}</category>
      <dc:creator>${xml(article.author.name)}</dc:creator>${
        // Sponsored editorial declares itself in the feed too, not just on site.
        article.sponsored ? `\n      <category>Sponsored</category>` : ""
      }
    </item>`;
    })
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(siteConfig.name)}</title>
    <link>${siteConfig.url}</link>
    <description>${xml(siteConfig.description)}</description>
    <language>en-gb</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml" />
${entries}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=900, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
