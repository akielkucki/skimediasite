import { siteConfig } from "@/config/site";
import type { RichTextBlock } from "@/types/content";

/** Minimal class joiner. Components avoid emitting conflicting utilities, so
 *  no `tailwind-merge` dependency is needed. */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Stable across server and client — always formats in UTC so hydration
 *  never mismatches on a machine in a different timezone. */
export function formatDate(
  iso: string,
  opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" },
) {
  return new Intl.DateTimeFormat("en-GB", { ...opts, timeZone: "UTC" }).format(new Date(iso));
}

export function formatShortDate(iso: string) {
  return formatDate(iso, { day: "numeric", month: "short", year: "numeric" });
}

export function formatYear(iso: string) {
  return formatDate(iso, { year: "numeric" });
}

/** Seconds → "1h 24m" / "8m 30s", for runtime metadata. */
export function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return s > 0 ? `${m}m ${s}s` : `${m}m`;
  return `${s}s`;
}

/** ISO-8601 duration for schema.org `VideoObject.duration`. */
export function isoDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s ? `${s}S` : ""}` || "PT0S";
}

/** Word count across a rich-text body, used when the CMS omits reading time. */
export function estimateReadingTime(body: RichTextBlock[]) {
  let words = 0;
  for (const block of body) {
    if (block._type === "paragraph") {
      words += block.text.reduce((n, span) => n + span.text.split(/\s+/).length, 0);
    } else if (block._type === "heading") {
      words += block.text.split(/\s+/).length;
    } else if (block._type === "pullQuote") {
      words += block.quote.split(/\s+/).length;
    } else if (block._type === "list") {
      words += block.items.reduce(
        (n, item) => n + item.reduce((m, span) => m + span.text.split(/\s+/).length, 0),
        0,
      );
    }
  }
  return Math.max(1, Math.round(words / siteConfig.readingSpeedWpm));
}

export function plainText(body: RichTextBlock[], maxChars = 320) {
  const out: string[] = [];
  for (const block of body) {
    if (block._type === "paragraph") out.push(block.text.map((s) => s.text).join(""));
    if (out.join(" ").length > maxChars) break;
  }
  return out.join(" ").slice(0, maxChars).trim();
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Resolves a path against the configured origin. Absolute URLs pass through. */
export function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${siteConfig.url}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

/** JSON-LD must never be able to break out of its script tag. */
export function safeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Case/diacritic-insensitive haystack match used by the index filters. */
export function matchesSearch(haystack: string[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const blob = haystack.join(" ").toLowerCase();
  return q.split(/\s+/).every((term) => blob.includes(term));
}
