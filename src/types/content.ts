/**
 * The application's content contract.
 *
 * Every page and component reads these shapes — never a CMS-specific type.
 * `src/lib/cms/` is responsible for mapping Sanity documents (or the local
 * mock data) onto them, which is what lets the site run with or without a CMS
 * and what would let a different CMS be swapped in behind the same interface.
 */

import type { AccessLevel, SponsorTier } from "@/config/site";

/* ── Media primitives ──────────────────────────────────────────────────── */

export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Photographer / agency credit, rendered under hero and inline images. */
  credit?: string;
  caption?: string;
  /** Low-quality base64 placeholder, when the source can provide one. */
  blurDataURL?: string;
  /** CSS object-position, for art-directing crops from the CMS. */
  focalPoint?: string;
};

export type VideoProvider = "youtube" | "vimeo" | "hosted" | "external";

/**
 * Structured video source. Deliberately *not* raw embed HTML — components
 * build the (privacy-conscious) embed URL themselves from these fields.
 */
export type VideoSource =
  | { provider: "youtube"; videoId: string; startAt?: number }
  | { provider: "vimeo"; videoId: string; hash?: string }
  | { provider: "hosted"; url: string; mimeType?: string }
  | { provider: "external"; url: string; label?: string };

export type CaptionTrack = {
  src: string;
  srcLang: string;
  label: string;
  kind?: "subtitles" | "captions";
  default?: boolean;
};

/* ── People & brands ───────────────────────────────────────────────────── */

export type Author = {
  _id: string;
  name: string;
  slug: string;
  role?: string;
  bio?: string;
  image?: ImageAsset;
  social?: { label: string; href: string }[];
};

export type Sponsor = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  website?: string;
  tier: SponsorTier;
  featured: boolean;
  /** Two variants so logos read correctly on light and dark surfaces. */
  logo: { color?: ImageAsset; mono?: ImageAsset };
  activeFrom?: string;
  activeUntil?: string;
};

/* ── Editorial ─────────────────────────────────────────────────────────── */

export type ArticleKind = "news" | "blog" | "feature" | "opinion";

/** Portable-text-like block model, rendered by `<RichText />`. */
export type RichTextBlock =
  | { _type: "paragraph"; _key: string; text: RichTextSpan[] }
  | { _type: "heading"; _key: string; level: 2 | 3; text: string }
  | { _type: "pullQuote"; _key: string; quote: string; attribution?: string }
  | { _type: "image"; _key: string; image: ImageAsset }
  | { _type: "video"; _key: string; source: VideoSource; title: string; poster?: ImageAsset }
  | { _type: "list"; _key: string; style: "bullet" | "number"; items: RichTextSpan[][] }
  | { _type: "divider"; _key: string };

export type RichTextSpan = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  href?: string;
};

export type Article = {
  _id: string;
  title: string;
  slug: string;
  kind: ArticleKind;
  /** The standfirst / summary shown under the headline and in cards. */
  dek: string;
  hero: ImageAsset;
  /** Optional hero video that replaces the still on detail pages. */
  heroVideo?: VideoSource;
  body: RichTextBlock[];
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  category: { slug: string; label: string };
  tags: string[];
  featured: boolean;
  /** Estimated minutes; computed from `body` when the CMS omits it. */
  readingTime?: number;
  sponsored: boolean;
  sponsor?: Sponsor;
  seo?: SeoFields;
  relatedArticleIds?: string[];
  relatedVideoIds?: string[];
  /** Dormant — every item resolves as free at launch. */
  accessLevel: AccessLevel;
};

/* ── Video ─────────────────────────────────────────────────────────────── */

/** How much of the work is actually ours — surfaced on every detail page. */
export type ProductionOwnership =
  "original" | "co-production" | "partner" | "licensed" | "embedded";

export type Video = {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  source: VideoSource;
  /** 16:9 still used in content rows. */
  thumbnail: ImageAsset;
  /** Wide cinematic art for the TV hero and detail backdrop. */
  cover?: ImageAsset;
  /** Portrait key art, used where a poster shape reads better. */
  poster?: ImageAsset;
  /** Runtime in seconds. */
  duration: number;
  releaseDate: string;
  categories: string[];
  tags: string[];
  credits?: { role: string; name: string }[];
  director?: string;
  ownership: ProductionOwnership;
  sponsor?: Sponsor;
  featured: boolean;
  series?: { slug: string; title: string; season: number; episode: number };
  captions?: CaptionTrack[];
  seo?: SeoFields;
  /** Dormant — every item resolves as free at launch. */
  accessLevel: AccessLevel;
  /** Short label rendered as a badge on cards, e.g. "New", "4K". */
  badges?: string[];
};

export type Show = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  cover: ImageAsset;
  poster?: ImageAsset;
  featured: boolean;
  ownership: ProductionOwnership;
  seasons: { number: number; title?: string; episodeIds: string[] }[];
};

/** A titled, ordered strip of videos on /tv. */
export type MediaCollection = {
  slug: string;
  title: string;
  description?: string;
  videos: Video[];
  /** Renders the row with poster-shaped cards instead of landscape stills. */
  shape?: "landscape" | "poster";
  /** Total catalogue size — when larger than `videos.length` the row was
   *  capped and links through to the full collection. */
  total?: number;
};

/* ── Promotions ────────────────────────────────────────────────────────── */

export type Promotion = {
  _id: string;
  /** Internal-only name for editors. */
  label: string;
  /** Matches an `AdPlacementKey`. */
  placement: string;
  creativeType: "image" | "script" | "house";
  image?: ImageAsset;
  href?: string;
  headline?: string;
  body?: string;
  sponsor?: Sponsor;
  startDate?: string;
  endDate?: string;
  active: boolean;
};

/* ── SEO ───────────────────────────────────────────────────────────────── */

export type SeoFields = {
  title?: string;
  description?: string;
  image?: ImageAsset;
  noIndex?: boolean;
  canonical?: string;
};

/* ── Query helpers ─────────────────────────────────────────────────────── */

export type ArticleQuery = {
  kind?: ArticleKind | ArticleKind[];
  category?: string;
  tag?: string;
  search?: string;
  limit?: number;
  offset?: number;
  excludeIds?: string[];
};

export type Paginated<T> = {
  items: T[];
  total: number;
  hasMore: boolean;
};
