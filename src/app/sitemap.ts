import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getArticles, getCollections, getVideos } from "@/lib/cms";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, videos, collections] = await Promise.all([
    getArticles(),
    getVideos(),
    getCollections(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "hourly", priority: 1 },
    { url: `${siteConfig.url}/news`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${siteConfig.url}/tv`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/sponsors`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteConfig.url}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    ...collections.map((c) => ({
      url: `${siteConfig.url}/tv/collections/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];

  return [
    ...staticRoutes,
    ...articles.items.map((article) => ({
      url: `${siteConfig.url}/articles/${article.slug}`,
      lastModified: new Date(article.updatedAt ?? article.publishedAt),
      changeFrequency: "weekly" as const,
      priority: article.featured ? 0.8 : 0.6,
    })),
    ...videos.map((video) => ({
      url: `${siteConfig.url}/tv/${video.slug}`,
      lastModified: new Date(video.releaseDate),
      changeFrequency: "weekly" as const,
      priority: video.featured ? 0.8 : 0.6,
    })),
  ];
}
