import { imageUrl } from "./client";
import { estimateReadingTime } from "@/lib/utils";
import type {
  Article,
  Author,
  CaptionTrack,
  ImageAsset,
  Promotion,
  RichTextBlock,
  Show,
  SiteSettings,
  SocialIconKey,
  Sponsor,
  Video,
  VideoSource,
} from "@/types/content";
import type { AccessLevel, SponsorTier } from "@/config/site";

/**
 * Sanity document → app content type.
 *
 * Deliberately defensive: an editor can always publish something incomplete,
 * and a missing field should degrade a card, not crash a route. Anything
 * genuinely required (a slug, a title) is checked by the caller.
 */

type Raw = Record<string, unknown>;

const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : fallback);
const num = (v: unknown, fallback = 0): number => (typeof v === "number" ? v : fallback);
const bool = (v: unknown, fallback = false): boolean => (typeof v === "boolean" ? v : fallback);
const arr = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

export function mapImage(raw: unknown, width = 1920, height?: number): ImageAsset | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Raw;
  const src = imageUrl(r.assetRef, width, height);
  if (!src) return undefined;

  const hotspot = r.focalPoint as { x?: number; y?: number } | undefined;
  return {
    src,
    // Sanity crops to the requested box, so the intrinsic ratio is known.
    width,
    height: height ?? Math.round(width * (9 / 16)),
    alt: str(r.alt),
    credit: str(r.credit) || undefined,
    caption: str(r.caption) || undefined,
    focalPoint: hotspot?.x
      ? `${(hotspot.x * 100).toFixed(1)}% ${((hotspot.y ?? 0.5) * 100).toFixed(1)}%`
      : undefined,
  };
}

/** Required-image variant: substitutes a typed blank rather than returning undefined. */
function mapImageRequired(raw: unknown, width = 1920, height?: number): ImageAsset {
  return (
    mapImage(raw, width, height) ?? {
      src: "",
      alt: "",
      width,
      height: height ?? Math.round(width * (9 / 16)),
    }
  );
}

export function mapVideoSource(raw: unknown): VideoSource | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Raw;
  switch (r.provider) {
    case "youtube":
      return r.videoId
        ? {
            provider: "youtube",
            videoId: str(r.videoId),
            startAt: r.startAt ? num(r.startAt) : undefined,
          }
        : null;
    case "vimeo":
      return r.videoId
        ? { provider: "vimeo", videoId: str(r.videoId), hash: str(r.hash) || undefined }
        : null;
    case "hosted":
      return r.url
        ? { provider: "hosted", url: str(r.url), mimeType: str(r.mimeType) || undefined }
        : null;
    case "external":
      return r.url
        ? { provider: "external", url: str(r.url), label: str(r.label) || undefined }
        : null;
    default:
      return null;
  }
}

export function mapAuthor(raw: unknown): Author {
  const r = (raw ?? {}) as Raw;
  return {
    _id: str(r._id, "author-unknown"),
    name: str(r.name, "Newsroom"),
    slug: str(r.slug, "newsroom"),
    role: str(r.role) || undefined,
    bio: str(r.bio) || undefined,
    image: mapImage(r.image, 400, 400),
    social: arr<{ label: string; href: string }>(r.social),
  };
}

export function mapSponsor(raw: unknown): Sponsor | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Raw;
  if (!r._id) return undefined;
  return {
    _id: str(r._id),
    name: str(r.name),
    slug: str(r.slug),
    description: str(r.description) || undefined,
    website: str(r.website) || undefined,
    tier: (str(r.tier, "supporting") as SponsorTier) ?? "supporting",
    featured: bool(r.featured),
    logo: {
      color: mapImage(r.logoColor, 480, 200),
      mono: mapImage(r.logoMono, 480, 200),
    },
    activeFrom: str(r.activeFrom) || undefined,
    activeUntil: str(r.activeUntil) || undefined,
  };
}

/** Sanity Portable Text block → our `RichTextBlock` union. */
export function mapBody(raw: unknown): RichTextBlock[] {
  return arr<Raw>(raw)
    .map((block, index): RichTextBlock | null => {
      const key = str(block._key, `b${index}`);

      // Portable Text default blocks carry style + children.
      if (block._type === "block") {
        const style = str(block.style, "normal");
        const children = arr<Raw>(block.children);
        const markDefs = arr<Raw>(block.markDefs);
        const spans = children.map((c) => {
          const marks = arr<string>(c.marks);
          const linkDef = markDefs.find((d) => marks.includes(str(d._key)));
          return {
            text: str(c.text),
            bold: marks.includes("strong") || undefined,
            italic: marks.includes("em") || undefined,
            href: linkDef ? str(linkDef.href) || undefined : undefined,
          };
        });

        if (style === "h2" || style === "h3") {
          return {
            _type: "heading",
            _key: key,
            level: style === "h2" ? 2 : 3,
            text: spans.map((s) => s.text).join(""),
          };
        }
        if (style === "blockquote") {
          return { _type: "pullQuote", _key: key, quote: spans.map((s) => s.text).join("") };
        }
        if (block.listItem === "bullet" || block.listItem === "number") {
          return {
            _type: "list",
            _key: key,
            style: block.listItem === "number" ? "number" : "bullet",
            items: [spans],
          };
        }
        return { _type: "paragraph", _key: key, text: spans };
      }

      if (block._type === "pullQuote") {
        return {
          _type: "pullQuote",
          _key: key,
          quote: str(block.quote),
          attribution: str(block.attribution) || undefined,
        };
      }
      // Studio block names are `inlineImage` / `inlineVideo` (Sanity reserves
      // `image`); the bare names are still accepted for older documents.
      if (block._type === "inlineImage" || block._type === "image") {
        const image = mapImage(block.image ?? block, 1600);
        return image ? { _type: "image", _key: key, image } : null;
      }
      if (block._type === "inlineVideo" || block._type === "video") {
        const source = mapVideoSource(block.source);
        return source
          ? {
              _type: "video",
              _key: key,
              source,
              title: str(block.title, "Video"),
              poster: mapImage(block.poster, 1600),
            }
          : null;
      }
      if (block._type === "divider") return { _type: "divider", _key: key };

      return null;
    })
    .filter((b): b is RichTextBlock => b !== null)
    .reduce<RichTextBlock[]>((acc, block) => {
      // Portable Text emits one document per list item; merge runs of them.
      const prev = acc[acc.length - 1];
      if (block._type === "list" && prev?._type === "list" && prev.style === block.style) {
        prev.items.push(...block.items);
        return acc;
      }
      acc.push(block);
      return acc;
    }, []);
}

export function mapArticle(raw: unknown): Article | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Raw;
  if (!r.slug || !r.title) return null;

  const bodyBlocks = mapBody(r.body);
  const category = (r.category ?? {}) as Raw;

  return {
    _id: str(r._id),
    title: str(r.title),
    slug: str(r.slug),
    kind: (str(r.kind, "news") as Article["kind"]) ?? "news",
    dek: str(r.dek),
    hero: mapImageRequired(r.hero, 2000),
    heroVideo: mapVideoSource(r.heroVideo) ?? undefined,
    body: bodyBlocks,
    author: mapAuthor(r.author),
    publishedAt: str(r.publishedAt, new Date().toISOString()),
    updatedAt: str(r.updatedAt) || undefined,
    category: {
      slug: str(category.slug, "uncategorised"),
      label: str(category.label, "Uncategorised"),
    },
    tags: arr<string>(r.tags),
    featured: bool(r.featured),
    readingTime: r.readingTime ? num(r.readingTime) : estimateReadingTime(bodyBlocks),
    sponsored: bool(r.sponsored),
    sponsor: mapSponsor(r.sponsor),
    seo: r.seo
      ? {
          title: str((r.seo as Raw).title) || undefined,
          description: str((r.seo as Raw).description) || undefined,
          image: mapImage((r.seo as Raw).image, 1200, 630),
          noIndex: bool((r.seo as Raw).noIndex) || undefined,
          canonical: str((r.seo as Raw).canonical) || undefined,
        }
      : undefined,
    relatedArticleIds: arr<string>(r.relatedArticleIds),
    relatedVideoIds: arr<string>(r.relatedVideoIds),
    accessLevel: (str(r.accessLevel, "free") as AccessLevel) ?? "free",
  };
}

export function mapVideo(raw: unknown): Video | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Raw;
  const source = mapVideoSource(r.source);
  if (!r.slug || !r.title || !source) return null;

  const series = (r.series ?? null) as Raw | null;

  return {
    _id: str(r._id),
    title: str(r.title),
    slug: str(r.slug),
    summary: str(r.summary),
    description: str(r.description),
    source,
    thumbnail: mapImageRequired(r.thumbnail, 1280, 720),
    cover: mapImage(r.cover, 2000, 1125),
    poster: mapImage(r.poster, 800, 1200),
    duration: num(r.duration),
    releaseDate: str(r.releaseDate, new Date().toISOString()),
    categories: arr<string>(r.categories),
    tags: arr<string>(r.tags),
    badges: arr<string>(r.badges),
    credits: arr<{ role: string; name: string }>(r.credits),
    director: str(r.director) || undefined,
    ownership: (str(r.ownership, "original") as Video["ownership"]) ?? "original",
    sponsor: mapSponsor(r.sponsor),
    featured: bool(r.featured),
    series: series?.slug
      ? {
          slug: str(series.slug),
          title: str(series.title),
          season: num(r.season, 1),
          episode: num(r.episode, 1),
        }
      : undefined,
    captions: arr<Raw>(r.captions)
      .filter((c) => c.src)
      .map((c): CaptionTrack => ({
        src: str(c.src),
        srcLang: str(c.srcLang, "en"),
        label: str(c.label, "Captions"),
        kind: (str(c.kind, "captions") as CaptionTrack["kind"]) ?? "captions",
        default: bool(c.default),
      })),
    seo: r.seo
      ? {
          title: str((r.seo as Raw).title) || undefined,
          description: str((r.seo as Raw).description) || undefined,
          image: mapImage((r.seo as Raw).image, 1200, 630),
          noIndex: bool((r.seo as Raw).noIndex) || undefined,
        }
      : undefined,
    accessLevel: (str(r.accessLevel, "free") as AccessLevel) ?? "free",
  };
}

export function mapShow(raw: unknown): Show | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Raw;
  if (!r.slug || !r.title) return null;
  return {
    _id: str(r._id),
    title: str(r.title),
    slug: str(r.slug),
    description: str(r.description),
    cover: mapImageRequired(r.cover, 2000, 1125),
    poster: mapImage(r.poster, 800, 1200),
    featured: bool(r.featured),
    ownership: (str(r.ownership, "original") as Show["ownership"]) ?? "original",
    seasons: arr<Raw>(r.seasons).map((s) => ({
      number: num(s.number, 1),
      title: str(s.title) || undefined,
      episodeIds: arr<string>(s.episodeIds),
    })),
  };
}

export function mapPromotion(raw: unknown): Promotion | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Raw;
  if (!r.placement) return null;
  return {
    _id: str(r._id),
    label: str(r.label, "Untitled promotion"),
    placement: str(r.placement),
    creativeType: (str(r.creativeType, "house") as Promotion["creativeType"]) ?? "house",
    image: mapImage(r.image, 800),
    href: str(r.href) || undefined,
    headline: str(r.headline) || undefined,
    body: str(r.body) || undefined,
    sponsor: mapSponsor(r.sponsor),
    startDate: str(r.startDate) || undefined,
    endDate: str(r.endDate) || undefined,
    active: bool(r.active, true),
  };
}

const SOCIAL_ICONS: SocialIconKey[] = ["instagram", "youtube", "x", "tiktok", "rss"];

/** The Site settings singleton. Blank strings stay blank so site.ts fills them. */
export function mapSiteSettings(raw: unknown): SiteSettings | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Raw;
  const adSlots: SiteSettings["adSlots"] = {};
  for (const slot of arr<Raw>(r.adSlots)) {
    const placement = str(slot.placement);
    if (placement && typeof slot.enabled === "boolean") adSlots[placement] = slot.enabled;
  }
  return {
    contact: {
      contactEmail: str(r.contactEmail).trim() || undefined,
      editorialEmail: str(r.editorialEmail).trim() || undefined,
      sponsorshipEmail: str(r.sponsorshipEmail).trim() || undefined,
      phone: str(r.phone).trim() || undefined,
      officeHours: str(r.officeHours).trim() || undefined,
      addressLines: str(r.address)
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      social: arr<Raw>(r.social)
        .map((s) => ({
          label: str(s.label),
          href: str(s.href),
          icon: str(s.icon) as SocialIconKey,
        }))
        .filter((s) => s.label && s.href && SOCIAL_ICONS.includes(s.icon)),
    },
    adSlots,
    googleAds: bool(r.googleAds, true),
  };
}
