import { isCmsConfigured, sanityClient } from "./client";
import { mapArticle, mapPromotion, mapShow, mapSponsor, mapVideo } from "./map";
import * as q from "./queries";
import { articles as mockArticles } from "@/data/articles";
import { promotions as mockPromotions } from "@/data/promotions";
import { sponsors as mockSponsors } from "@/data/sponsors";
import { shows as mockShows, videos as mockVideos } from "@/data/videos";
import { siteConfig } from "@/config/site";
import { estimateReadingTime, matchesSearch } from "@/lib/utils";
import type {
  Article,
  ArticleQuery,
  MediaCollection,
  Paginated,
  Promotion,
  Show,
  Sponsor,
  Video,
} from "@/types/content";

/**
 * The content API.
 *
 * Every page imports from here and from nowhere else. Two sources sit behind
 * it — Sanity, and the local seed data — and the choice is made per call:
 *
 *   1. No `NEXT_PUBLIC_SANITY_PROJECT_ID`  → local seed data.
 *   2. CMS configured but the query fails  → local seed data, with a warning.
 *   3. CMS configured and returns nothing  → local seed data (an empty dataset
 *      almost always means "not seeded yet", not "the publication has no
 *      articles"), again with a warning.
 *
 * That third rule is what makes `npm run dev` useful the moment credentials
 * are added but before any content exists.
 */

const REVALIDATE = siteConfig.cms.revalidateSeconds;

async function fromCms<T>(
  query: string,
  params: Record<string, unknown>,
  map: (raw: unknown) => T | null,
  tag: string,
): Promise<T[] | null> {
  if (!sanityClient) return null;
  try {
    const raw = await sanityClient.fetch<unknown[]>(query, params, {
      next: { revalidate: REVALIDATE, tags: [tag] },
    });
    const mapped = (Array.isArray(raw) ? raw : []).map(map).filter((x): x is T => x !== null);
    return mapped.length > 0 ? mapped : null;
  } catch (error) {
    console.warn(`[cms] query "${tag}" failed, falling back to local content.`, error);
    return null;
  }
}

/** True when pages are being rendered from `src/data/` rather than a CMS. */
export function usingLocalContent() {
  return !isCmsConfigured;
}

/* ── Articles ──────────────────────────────────────────────────────────── */

async function allArticles(): Promise<Article[]> {
  const cms = await fromCms(q.articlesQuery, {}, mapArticle, "article");
  const list = cms ?? mockArticles;
  return [...list].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getArticles(query: ArticleQuery = {}): Promise<Paginated<Article>> {
  const { kind, category, tag, search, limit, offset = 0, excludeIds = [] } = query;
  const kinds = kind ? (Array.isArray(kind) ? kind : [kind]) : null;

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

export async function getArticle(slug: string): Promise<Article | null> {
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
    } catch (error) {
      console.warn(`[cms] article "${slug}" failed, falling back to local content.`, error);
    }
  }
  const local = mockArticles.find((a) => a.slug === slug) ?? null;
  return local
    ? { ...local, readingTime: local.readingTime ?? estimateReadingTime(local.body) }
    : null;
}

export async function getArticleSlugs(): Promise<string[]> {
  if (sanityClient) {
    try {
      const slugs = await sanityClient.fetch<string[]>(
        q.articleSlugsQuery,
        {},
        {
          next: { revalidate: REVALIDATE, tags: ["article"] },
        },
      );
      if (slugs?.length) return slugs;
    } catch {
      /* fall through to local slugs */
    }
  }
  return mockArticles.map((a) => a.slug);
}

/** The single lead story for the homepage. */
export async function getLeadArticle(): Promise<Article | null> {
  const { items } = await getArticles({ limit: 1 });
  const featured = (await allArticles()).find((a) => a.featured && a.kind === "feature");
  return featured ?? items[0] ?? null;
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

/* ── Videos ────────────────────────────────────────────────────────────── */

async function allVideos(): Promise<Video[]> {
  const cms = await fromCms(q.videosQuery, {}, mapVideo, "video");
  const list = cms ?? mockVideos;
  return [...list].sort(
    (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(),
  );
}

export async function getVideos(): Promise<Video[]> {
  return allVideos();
}

export async function getVideo(slug: string): Promise<Video | null> {
  if (sanityClient) {
    try {
      const raw = await sanityClient.fetch<unknown>(
        q.videoBySlugQuery,
        { slug },
        { next: { revalidate: REVALIDATE, tags: ["video", `video:${slug}`] } },
      );
      const mapped = mapVideo(raw);
      if (mapped) return mapped;
    } catch (error) {
      console.warn(`[cms] video "${slug}" failed, falling back to local content.`, error);
    }
  }
  return mockVideos.find((v) => v.slug === slug) ?? null;
}

export async function getVideoSlugs(): Promise<string[]> {
  if (sanityClient) {
    try {
      const slugs = await sanityClient.fetch<string[]>(
        q.videoSlugsQuery,
        {},
        {
          next: { revalidate: REVALIDATE, tags: ["video"] },
        },
      );
      if (slugs?.length) return slugs;
    } catch {
      /* fall through */
    }
  }
  return mockVideos.map((v) => v.slug);
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

export async function getCollections(filterSlug?: string): Promise<MediaCollection[]> {
  const all = await allVideos();
  const definitions = filterSlug
    ? ROW_DEFINITIONS.filter((d) => d.slug === filterSlug)
    : ROW_DEFINITIONS;

  return definitions
    .map((def) => ({
      slug: def.slug,
      title: def.title,
      description: def.description,
      shape: def.shape,
      videos: all.filter(def.match),
    }))
    .filter((row) => row.videos.length > 0);
}

/* ── Shows ─────────────────────────────────────────────────────────────── */

export async function getShows(): Promise<Show[]> {
  const cms = await fromCms(q.showsQuery, {}, mapShow, "show");
  return cms ?? mockShows;
}

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

export async function getSponsors(): Promise<Sponsor[]> {
  const cms = await fromCms(q.sponsorsQuery, {}, (raw) => mapSponsor(raw) ?? null, "sponsor");
  return cms ?? mockSponsors;
}

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

export async function getPromotion(placement: string): Promise<Promotion | null> {
  const cms = await fromCms(q.promotionsQuery, {}, mapPromotion, "promotion");
  const all = cms ?? mockPromotions;
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
