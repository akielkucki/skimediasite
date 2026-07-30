import { createClient, type SanityClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { siteConfig } from "@/config/site";

/**
 * Sanity connection.
 *
 * The site is designed to run with **no** CMS credentials at all: if the
 * project id is missing, `sanityClient` is null and the content layer falls
 * back to the local seed data in `src/data/`. Nothing throws, nothing warns
 * loudly in production, and every page still renders.
 */

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export const isCmsConfigured = Boolean(projectId);

export const sanityClient: SanityClient | null = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: siteConfig.cms.apiVersion,
      // Published content only, served from the CDN. Draft/preview reads use
      // a separate token-bearing client — see `previewClient` below.
      useCdn: true,
      perspective: "published",
    })
  : null;

/**
 * Preview-ready: a token-bearing client that can read drafts. Wire this to
 * Next.js Draft Mode to build a preview route (see docs/CMS.md). Returns null
 * unless both the project id and a read token are present.
 */
export function previewClient(): SanityClient | null {
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!projectId || !token) return null;
  return createClient({
    projectId,
    dataset,
    apiVersion: siteConfig.cms.apiVersion,
    useCdn: false,
    perspective: "drafts",
    token,
  });
}

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

/** Sanity image ref → CDN URL. Returns null when no CMS is configured. */
export function imageUrl(source: unknown, width: number, height?: number) {
  if (!builder || !source) return null;
  let b = builder
    .image(source as never)
    .width(width)
    .auto("format")
    .fit("crop");
  if (height) b = b.height(height);
  return b.url();
}

/** Hostname the CMS serves images from — mirrored in next.config.ts. */
export const SANITY_IMAGE_HOST = "cdn.sanity.io";
