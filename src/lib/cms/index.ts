import { cache } from "react";
import { isCmsConfigured, sanityClient } from "./client";
import { mapArticle, mapAuthor, mapPromotion, mapShow, mapSponsor, mapVideo } from "./map";
import * as q from "./queries";
import { articles as mockArticles } from "@/data/articles";
import { authors as mockAuthors } from "@/data/authors";
import { promotions as mockPromotions } from "@/data/promotions";
import { sponsors as mockSponsors } from "@/data/sponsors";
import { shows as mockShows, videos as mockVideos } from "@/data/videos";
import { siteConfig } from "@/config/site";
import { demoContentEnabled, isProduction } from "@/lib/env";
import { reportError, reportWarning } from "@/lib/monitoring";
import { estimateReadingTime, matchesSearch } from "@/lib/utils";
import type {
  Article,
  ArticleQuery,
  Author,
  MediaCollection,
  Paginated,
  Promotion,
  Show,
  Sponsor,
  Video,
} from "@/types/content";

/**
 * The content API. Every page imports from here and from nowhere else.
 *
 * Source resolution, per call:
 *
 *   1. CMS configured, query succeeds     → CMS result. In production an empty
 *      result **stays empty** — it is never silently replaced with seed data.
 *   2. CMS configured, query fails        → in production: an empty result,
 *      reported through the monitoring hook. Fictional seed articles must
 *      never masquerade as journalism because an API call failed.
 *   3. No CMS, or (in development) an empty/failed CMS read → local seed data,
 *      but only where `demoContentEnabled` allows it (always in development;
 *      in production only behind NEXT_PUBLIC_ENABLE_DEMO_CONTENT=true).
 *
 * Malformed CMS documents are skipped, counted and reported — one bad publish
 * degrades one card, not a route.
 */

const REVALIDATE = siteConfig.cms.revalidateSeconds;

/** Seed data, or nothing at all when seed content is not permitted. */
function seed<T>(list: T[]): T[] {
  return demoContentEnabled ? list : [];
}

async function fromCms<T>(
  query: string,
  params: Record<string, unknown>,
  map: (raw: unknown) => T | null | undefined,
  tag: string,
): Promise<T[] | null> {
  if (!sanityClient) return null;
  try {
    const raw = await sanityClient.fetch<unknown[]>(query, params, {
      next: { revalidate: REVALIDATE, tags: [tag] },
    });
    const rows = Array.isArray(raw) ? raw : [];
    const mapped = rows.map(map).filter((x): x is T => x != null);
    if (mapped.length < rows.length) {
      reportWarning("cms", `skipped malformed ${tag} documents`, {
        tag,
        skipped: rows.length - mapped.length,
      });
    }
    // Development nicety: an empty dataset usually means "not seeded yet", so
    // fall through to local content. Production returns the truth.
    if (mapped.length === 0 && !isProduction) return null;
    return mapped;
  } catch (error) {
    reportError("cms", error, { tag });
    return isProduction ? [] : null;
  }
}

/** True when pages are rendering from `src/data/` rather than a CMS. */
export function usingLocalContent() {
  return !isCmsConfigured && demoContentEnabled;
}

/* ── Articles ──────────────────────────────────────────────────────────── */

const allArticles = cache(async (): Promise<Article[]> => {
  const cms = await fromCms(q.articlesQuery, {}, mapArticle, "article");
  const list = cms ?? seed(mockArticles);
  return [...list].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
});

/**
 * Filtered, paginated article reads.
 *
 * When Sanity is configured, filtering/search/pagination run inside GROQ so
 * the archive is never fetched wholesale into application memory. The seed
 * path filters in memory (it is a small fixed array).
 */
export async function getArticles(query: ArticleQuery = {}): Promise<Paginated<Article>> {
  const { kind, category, tag, search, limit, offset = 0, excludeIds = [] } = query;
  const kinds = kind ? (Array.isArray(kind) ? kind : [kind]) : null;

  if (sanityClient) {
    const params = {
      kinds,
      category: category ?? null,
      // `tag` is a reserved key in the Sanity client's QueryParams.
      tagFilter: tag ?? null,
      // GROQ `match` uses word-prefix semantics; mirror the seed behaviour.
      search: search ? `*${search.trim()}*` : null,
      excludeIds,
      offset,
      end: limit ? offset + limit : 10_000,
    };
    try {
      const [rows, total] = await Promise.all([
        sanityClient.fetch<unknown[]>(q.articlesFilteredQuery, params, {
          next: { revalidate: REVALIDATE, tags: ["article"] },
        }),
        sanityClient.fetch<number>(q.articlesFilteredCountQuery, params, {
          next: { revalidate: REVALIDATE, tags: ["article"] },
        }),
      ]);
      const items = (Array.isArray(rows) ? rows : [])
        .map(mapArticle)
        .filter((a): a is Article => a !== null);
      return { items, total, hasMore: offset + items.length < total };
    } catch (error) {
      reportError("cms", error, { tag: "article:filtered" });
      if (isProduction) return { items: [], total: 0, hasMore: false };
      /* development falls through to seed data below */
    }
  }

  const filtered = (await allArticles()).filter((article) => {
    if (kinds && !kinds.includes(article.kind)) return false;
    if (category && article.category.slug !== category) return false;
    if (tag && !article.tags.includes(tag)) return false;
    if (excludeIds.includes(article._id)) return false;
    if (
      search &&
      !matchesSearch(
        [article.title, article.dek, article.category.label, article.author.name, ...article.tags],
        search,
      )
    ) {
      return false;
    }
    return true;
  });

  const items = limit ? filtered.slice(offset, offset + limit) : filtered.slice(offset);
  return {
    items,
    total: filtered.length,
    hasMore: offset + items.length < filtered.length,
  };
}

export const getArticle = cache(async (slug: string): Promise<Article | null> => {
  if (sanityClient) {
    try {
      const raw = await sanityClient.fetch<unknown>(
        q.articleBySlugQuery,
        { slug },
        { next: { revalidate: REVALIDATE, tags: ["article", `article:${slug}`] } },
      );
      const mapped = mapArticle(raw);
      if (mapped) {
        return { ...mapped, readingTime: mapped.readingTime ?? estimateReadingTime(mapped.body) };
      }
      if (isProduction) return null;
    } catch (error) {
      reportError("cms", error, { tag: "article:slug" });
      if (isProduction) return null;
    }
  }
  const local = seed(mockArticles).find((a) => a.slug === slug) ?? null;
  return local
    ? { ...local, readingTime: local.readingTime ?? estimateReadingTime(local.body) }
    : null;
});

export async function getArticleSlugs(): Promise<string[]> {
  if (sanityClient) {
    try {
      const slugs = await sanityClient.fetch<string[]>(
        q.articleSlugsQuery,
        {},
        { next: { revalidate: REVALIDATE, tags: ["article"] } },
      );
      if (slugs?.length || isProduction) return slugs ?? [];
    } catch (error) {
      reportError("cms", error, { tag: "article:slugs" });
      if (isProduction) return [];
    }
  }
  return seed(mockArticles).map((a) => a.slug);
}

/** The single lead story for the homepage. */
export async function getLeadArticle(): Promise<Article | null> {
  const all = await allArticles();
  const featured = all.find((a) => a.featured && a.kind === "feature");
  return featured ?? all[0] ?? null;
}

export async function getRelatedArticles(article: Article, limit = 3): Promise<Article[]> {
  const all = await allArticles();
  const explicit = (article.relatedArticleIds ?? [])
    .map((id) => all.find((a) => a._id === id))
    .filter((a): a is Article => Boolean(a));

  if (explicit.length >= limit) return explicit.slice(0, limit);

  // Fill the remainder by category, then by shared tag.
  const seen = new Set([article._id, ...explicit.map((a) => a._id)]);
  const scored = all
    .filter((a) => !seen.has(a._id))
    .map((a) => ({
      article: a,
      score:
        (a.category.slug === article.category.slug ? 2 : 0) +
        a.tags.filter((t) => article.tags.includes(t)).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return [...explicit, ...scored.map((x) => x.article)].slice(0, limit);
}

/**
 * Facets for the index pages: distinct tags plus per-category counts. In CMS
 * mode this reads slugs and tags only — the archive itself is never fetched
 * to build a filter bar.
 */
export async function getArticleFacets(
  kinds: Article["kind"][],
): Promise<{ tags: string[]; categoryCounts: Record<string, number> }> {
  if (sanityClient) {
    try {
      const raw = await sanityClient.fetch<{ tags: string[]; categories: string[] }>(
        q.articleFacetsQuery,
        { kinds },
        { next: { revalidate: REVALIDATE, tags: ["article"] } },
      );
      const categoryCounts: Record<string, number> = {};
      for (const slug of raw?.categories ?? []) {
        if (slug) categoryCounts[slug] = (categoryCounts[slug] ?? 0) + 1;
      }
      return { tags: (raw?.tags ?? []).filter(Boolean).sort(), categoryCounts };
    } catch (error) {
      reportError("cms", error, { tag: "article:facets" });
      if (isProduction) return { tags: [], categoryCounts: {} };
    }
  }

  const all = (await allArticles()).filter((a) => kinds.includes(a.kind));
  const categoryCounts: Record<string, number> = {};
  for (const a of all) {
    categoryCounts[a.category.slug] = (categoryCounts[a.category.slug] ?? 0) + 1;
  }
  return {
    tags: [...new Set(all.flatMap((a) => a.tags))].sort(),
    categoryCounts,
  };
}

/* ── Authors ───────────────────────────────────────────────────────────── */

export const getAuthors = cache(async (): Promise<Author[]> => {
  const cms = await fromCms(q.authorsQuery, {}, (raw) => mapAuthor(raw), "author");
  return cms ?? seed(mockAuthors);
});

/* ── Videos ────────────────────────────────────────────────────────────── */

const allVideos = cache(async (): Promise<Video[]> => {
  const cms = await fromCms(q.videosQuery, {}, mapVideo, "video");
  const list = cms ?? seed(mockVideos);
  return [...list].sort(
    (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(),
  );
});

export async function getVideos(): Promise<Video[]> {
  return allVideos();
}

/** Server-side search over the catalogue, pushed into GROQ when possible. */
export async function searchVideos(query: string): Promise<Video[]> {
  if (sanityClient) {
    try {
      const rows = await sanityClient.fetch<unknown[]>(
        q.videosSearchQuery,
        { search: `*${query.trim()}*` },
        { next: { revalidate: REVALIDATE, tags: ["video"] } },
      );
      return (Array.isArray(rows) ? rows : []).map(mapVideo).filter((v): v is Video => v !== null);
    } catch (error) {
      reportError("cms", error, { tag: "video:search" });
      if (isProduction) return [];
    }
  }
  const all = await allVideos();
  return all.filter((v) =>
    matchesSearch([v.title, v.summary, v.description, ...v.categories, ...v.tags], query),
  );
}

export const getVideo = cache(async (slug: string): Promise<Video | null> => {
  if (sanityClient) {
    try {
      const raw = await sanityClient.fetch<unknown>(
        q.videoBySlugQuery,
        { slug },
        { next: { revalidate: REVALIDATE, tags: ["video", `video:${slug}`] } },
      );
      const mapped = mapVideo(raw);
      if (mapped) return mapped;
      if (isProduction) return null;
    } catch (error) {
      reportError("cms", error, { tag: "video:slug" });
      if (isProduction) return null;
    }
  }
  return seed(mockVideos).find((v) => v.slug === slug) ?? null;
});

export async function getVideoSlugs(): Promise<string[]> {
  if (sanityClient) {
    try {
      const slugs = await sanityClient.fetch<string[]>(
        q.videoSlugsQuery,
        {},
        { next: { revalidate: REVALIDATE, tags: ["video"] } },
      );
      if (slugs?.length || isProduction) return slugs ?? [];
    } catch (error) {
      reportError("cms", error, { tag: "video:slugs" });
      if (isProduction) return [];
    }
  }
  return seed(mockVideos).map((v) => v.slug);
}

export async function getFeaturedVideo(): Promise<Video | null> {
  const all = await allVideos();
  return all.find((v) => v.featured) ?? all[0] ?? null;
}

export async function getVideosByIds(ids: string[]): Promise<Video[]> {
  if (!ids.length) return [];
  const all = await allVideos();
  return ids.map((id) => all.find((v) => v._id === id)).filter((v): v is Video => Boolean(v));
}

export async function getRelatedVideos(video: Video, limit = 6): Promise<Video[]> {
  const all = await allVideos();
  return all
    .filter((v) => v._id !== video._id)
    .map((v) => ({
      video: v,
      score:
        v.categories.filter((c) => video.categories.includes(c)).length * 2 +
        v.tags.filter((t) => video.tags.includes(t)).length +
        (v.series?.slug && v.series.slug === video.series?.slug ? 5 : 0),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.video);
}

/**
 * The programmed rows on /tv.
 *
 * Row membership comes from each video's `categories` array, so editors
 * curate the TV homepage by tagging videos — no code change required to
 * reorder or repopulate a row.
 */
const ROW_DEFINITIONS: Array<{
  slug: string;
  title: string;
  description?: string;
  match: (v: Video) => boolean;
  shape?: MediaCollection["shape"];
}> = [
  {
    slug: "latest",
    title: "Latest releases",
    description: "Everything we've published in the last few weeks.",
    match: (v) => v.categories.includes("latest") || v.categories.includes("featured"),
  },
  {
    slug: "original-series",
    title: "Original series",
    description: "Recurring programming made by our film team.",
    match: (v) => Boolean(v.series),
  },
  {
    slug: "ski-films",
    title: "Ski films",
    match: (v) => v.categories.includes("films"),
    shape: "poster",
  },
  {
    slug: "athlete-profiles",
    title: "Athlete profiles",
    match: (v) => v.categories.includes("athletes"),
  },
  {
    slug: "destination-stories",
    title: "Destination stories",
    match: (v) => v.categories.includes("destinations"),
  },
  {
    slug: "technique",
    title: "Technique & education",
    description: "Practical instruction, filmed in the conditions being described.",
    match: (v) => v.categories.includes("technique") || v.categories.includes("education"),
  },
  {
    slug: "events",
    title: "Event coverage",
    match: (v) => v.categories.includes("events"),
  },
  {
    slug: "gear",
    title: "Gear stories",
    match: (v) => v.categories.includes("gear"),
  },
  {
    slug: "staff-picks",
    title: "Staff picks",
    description: "What the newsroom would put on tonight.",
    match: (v) => v.categories.includes("staff-picks"),
  },
  {
    slug: "with-partners",
    title: "Made with partners",
    description: "Co-productions and partner-supplied films, labelled as such.",
    match: (v) => v.ownership !== "original",
  },
];

/** Cards per row on the programmed /tv front. Deeper browsing goes through
 *  the collection filter, so the front page stays light. */
const ROW_CAP = 6;

export async function getCollections(filterSlug?: string): Promise<MediaCollection[]> {
  const all = await allVideos();
  const definitions = filterSlug
    ? ROW_DEFINITIONS.filter((d) => d.slug === filterSlug)
    : ROW_DEFINITIONS;

  return definitions
    .map((def) => {
      const matches = all.filter(def.match);
      return {
        slug: def.slug,
        title: def.title,
        description: def.description,
        shape: def.shape,
        videos: filterSlug ? matches : matches.slice(0, ROW_CAP),
        total: matches.length,
      };
    })
    .filter((row) => row.videos.length > 0);
}

/** Programmed collection slugs, for prerendering /tv/collections/[slug]. */
export function getCollectionSlugs(): string[] {
  return ROW_DEFINITIONS.map((d) => d.slug);
}

/**
 * A single, uncapped collection. Unknown slugs fall back to a plain category
 * match so `/tv/collections/technique` and a raw video category both resolve.
 */
export async function getCollection(slug: string): Promise<MediaCollection | null> {
  const all = await allVideos();
  const def = ROW_DEFINITIONS.find((d) => d.slug === slug);
  const matches = def ? all.filter(def.match) : all.filter((v) => v.categories.includes(slug));
  if (matches.length === 0) return null;

  return {
    slug,
    title: def?.title ?? slug.replace(/-/g, " "),
    description: def?.description,
    shape: def?.shape,
    videos: matches,
    total: matches.length,
  };
}

/* ── Shows ─────────────────────────────────────────────────────────────── */

export const getShows = cache(async (): Promise<Show[]> => {
  const cms = await fromCms(q.showsQuery, {}, mapShow, "show");
  return cms ?? seed(mockShows);
});

export async function getShowForVideo(
  video: Video,
): Promise<{ show: Show; episodes: Video[] } | null> {
  if (!video.series) return null;
  const shows = await getShows();
  const show = shows.find((s) => s.slug === video.series?.slug);
  if (!show) return null;
  const season = show.seasons.find((s) => s.number === video.series?.season) ?? show.seasons[0];
  const episodes = await getVideosByIds(season?.episodeIds ?? []);
  return { show, episodes };
}

/* ── Sponsors ──────────────────────────────────────────────────────────── */

export const getSponsors = cache(async (): Promise<Sponsor[]> => {
  const cms = await fromCms(q.sponsorsQuery, {}, (raw) => mapSponsor(raw) ?? null, "sponsor");
  return cms ?? seed(mockSponsors);
});

export async function getFeaturedSponsors(limit?: number): Promise<Sponsor[]> {
  const all = await getSponsors();
  const now = Date.now();
  const active = all.filter((s) => {
    if (!s.featured) return false;
    if (s.activeFrom && new Date(s.activeFrom).getTime() > now) return false;
    if (s.activeUntil && new Date(s.activeUntil).getTime() < now) return false;
    return true;
  });
  return limit ? active.slice(0, limit) : active;
}

/* ── Promotions ────────────────────────────────────────────────────────── */

const allPromotions = cache(async (): Promise<Promotion[]> => {
  const cms = await fromCms(q.promotionsQuery, {}, mapPromotion, "promotion");
  return cms ?? seed(mockPromotions);
});

export async function getPromotion(placement: string): Promise<Promotion | null> {
  const all = await allPromotions();
  const now = Date.now();

  return (
    all.find((p) => {
      if (p.placement !== placement || !p.active) return false;
      if (p.startDate && new Date(p.startDate).getTime() > now) return false;
      if (p.endDate && new Date(p.endDate).getTime() < now) return false;
      return true;
    }) ?? null
  );
}
