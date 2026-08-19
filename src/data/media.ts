import { photos, type PhotoKey } from "./photos.generated";
import { placeholders, type PlaceholderKey } from "./placeholders.generated";
import { siteConfig } from "@/config/site";
import type { ImageAsset } from "@/types/content";

/**
 * Image helpers for the seed/demo content.
 *
 * `photo()` builds an `ImageAsset` from the curated Pexels set in
 * /public/photos (see scripts/import-pexels.mjs). Photographer name, profile
 * URL and photo page are recorded in src/data/photos.generated.ts, and the
 * credit line renders in editorial figcaptions.
 *
 * `art()` builds one from the procedurally-drawn alpine artwork
 * (scripts/generate-placeholders.mjs) — retained as a brand motif for
 * empty states, texture and data illustration, not as editorial photography.
 */

export function photo(
  key: PhotoKey,
  extra: Partial<Pick<ImageAsset, "alt" | "caption" | "focalPoint">> = {},
): ImageAsset {
  const p = photos[key];
  return {
    src: p.src,
    width: p.width,
    height: p.height,
    blurDataURL: p.blurDataURL,
    alt: p.alt,
    credit: p.credit,
    ...("focalPoint" in p && p.focalPoint ? { focalPoint: p.focalPoint } : {}),
    ...extra,
  };
}

/** The committed 2:3 portrait crop of a photo, for TV key art. */
export function posterPhoto(key: PhotoKey, alt?: string): ImageAsset {
  const p = photos[key];
  const poster = "poster" in p ? p.poster : undefined;
  if (!poster) return photo(key, alt ? { alt } : {});
  return {
    src: poster.src,
    width: poster.width,
    height: poster.height,
    blurDataURL: poster.blurDataURL,
    alt: alt ?? photos[key].alt,
    credit: p.credit,
  };
}

/** Procedural contour/ridgeline artwork — brand motif, not photography. */
export function art(
  key: PlaceholderKey,
  alt: string,
  extra: Partial<Pick<ImageAsset, "credit" | "caption" | "focalPoint">> = {},
): ImageAsset {
  const p = placeholders[key];
  return {
    src: p.src,
    width: p.width,
    height: p.height,
    blurDataURL: p.blurDataURL,
    alt,
    credit: `Illustration — ${siteConfig.shortName}`,
    ...extra,
  };
}
