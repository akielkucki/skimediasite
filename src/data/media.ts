import { placeholders, type PlaceholderKey } from "./placeholders.generated";
import { siteConfig } from "@/config/site";
import type { ImageAsset } from "@/types/content";

/**
 * Builds an `ImageAsset` from the locally generated placeholder set.
 *
 * These are procedurally-drawn alpine compositions, not photography — see
 * scripts/generate-placeholders.mjs. Swap in real imagery by publishing it
 * through the CMS, or by replacing the files in /public/placeholders.
 */
export function img(
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
    credit: `Placeholder artwork — ${siteConfig.shortName}`,
    ...extra,
  };
}
