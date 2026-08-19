import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { realSocialLinks } from "./env";
import { absoluteUrl, isoDuration } from "./utils";
import { embedUrlFor } from "./video";
import type { Article, ImageAsset, SeoFields, Video } from "@/types/content";

/**
 * Metadata helpers.
 *
 * Every page builds its metadata through `pageMetadata` so the title template,
 * canonical URL, Open Graph and Twitter card stay consistent and the brand
 * name is only ever read from `siteConfig`.
 */

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  image?: ImageAsset;
  type?: "website" | "article" | "video.other";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
  seo?: SeoFields;
};

export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
  seo,
}: PageMetaInput): Metadata {
  const resolvedTitle = seo?.title ?? title;
  const resolvedDescription = seo?.description ?? description;
  const resolvedImage = seo?.image ?? image;
  const canonical = seo?.canonical ?? absoluteUrl(path);

  const images = resolvedImage
    ? [
        {
          url: absoluteUrl(resolvedImage.src),
          width: resolvedImage.width,
          height: resolvedImage.height,
          alt: resolvedImage.alt || resolvedTitle,
        },
      ]
    : [
        {
          url: absoluteUrl(siteConfig.seo.defaultOgImage),
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ];

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical },
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
    keywords: tags?.length ? tags : undefined,
    openGraph: {
      type: type === "video.other" ? "video.other" : type,
      title: resolvedTitle,
      description: resolvedDescription,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.seo.locale,
      images,
      ...(type === "article" ? { publishedTime, modifiedTime, authors, section, tags } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: images.map((i) => i.url),
      ...(siteConfig.seo.twitterHandle ? { site: siteConfig.seo.twitterHandle } : {}),
    },
  };
}

/* ── Structured data ───────────────────────────────────────────────────── */

export function organisationJsonLd() {
  // `sameAs` lists only social links that point at a real profile; generic
  // platform roots from the seed config are dropped, not shipped as fake
  // handles. The publisher logo is included only when a real one exists.
  const sameAs = realSocialLinks(siteConfig.social.filter((s) => s.icon !== "rss")).map(
    (s) => s.href,
  );
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    email: siteConfig.contactEmail,
    ...(siteConfig.wordmark.image
      ? { logo: { "@type": "ImageObject", url: absoluteUrl(siteConfig.wordmark.image) } }
      : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/news?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function articleJsonLd(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": article.kind === "news" ? "NewsArticle" : "Article",
    headline: article.title,
    description: article.dek,
    image: article.hero.src ? [absoluteUrl(article.hero.src)] : undefined,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    articleSection: article.category.label,
    keywords: article.tags.join(", "),
    wordCount: undefined,
    author: {
      "@type": "Person",
      name: article.author.name,
      jobTitle: article.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      ...(siteConfig.wordmark.image
        ? { logo: { "@type": "ImageObject", url: absoluteUrl(siteConfig.wordmark.image) } }
        : {}),
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/articles/${article.slug}`),
    },
    // Sponsored editorial must declare itself to search engines too.
    ...(article.sponsored
      ? {
          sponsor: article.sponsor
            ? { "@type": "Organization", name: article.sponsor.name }
            : undefined,
          isAccessibleForFree: true,
        }
      : { isAccessibleForFree: true }),
  };
}

export function videoJsonLd(video: Video) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description || video.summary,
    thumbnailUrl: video.thumbnail.src ? [absoluteUrl(video.thumbnail.src)] : undefined,
    uploadDate: video.releaseDate,
    duration: isoDuration(video.duration),
    embedUrl: embedUrlFor(video.source),
    contentUrl: video.source.provider === "hosted" ? absoluteUrl(video.source.url) : undefined,
    isFamilyFriendly: true,
    isAccessibleForFree: true,
    director: video.director ? { "@type": "Person", name: video.director } : undefined,
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    ...(video.series
      ? {
          partOfSeries: { "@type": "CreativeWorkSeries", name: video.series.title },
          seasonNumber: video.series.season,
          episodeNumber: video.series.episode,
        }
      : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
