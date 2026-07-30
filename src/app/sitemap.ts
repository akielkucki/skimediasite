import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getArticles, getVideos } from "@/lib/cms";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, videos] = await Promise.all([getArticles(), getVideos()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "hourly", priority: 1 },
    { url: `${siteConfig.url}/news`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${siteConfig.url}/blog`, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteConfig.url}/tv`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/sponsors`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteConfig.url}/contact`, changeFrequency: "yearly", priority: 0.3 },
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
