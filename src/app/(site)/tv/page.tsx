import type { Metadata } from "next";
import Link from "next/link";
import { TvHero } from "@/components/tv/tv-hero";
import { MediaRow } from "@/components/tv/media-row";
import { TvCollectionNav } from "@/components/tv/collection-nav";
import { AdSlot } from "@/components/ads/ad-slot";
import { SponsorLogoCloud } from "@/components/sponsors/logo-cloud";
import { EmptyState } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getCollections, getFeaturedSponsors, getFeaturedVideo } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: `${siteConfig.shortName} TV`,
  description:
    "Ski films, athlete profiles and event coverage — free to watch, with every production clearly credited.",
  path: "/tv",
});

/**
 * The TV front.
 *
 * Fully static (ISR): the programmed rows never depend on the request.
 * Deeper browsing lives on /tv/collections/[slug] (also static) and search on
 * /tv/search — which is what lets this heavy page ship as a prerendered file
 * with one-shot compression instead of a streamed dynamic render.
 */
export default async function TvPage() {
  const [featured, sponsors, collections] = await Promise.all([
    getFeaturedVideo(),
    getFeaturedSponsors(6),
    getCollections(),
  ]);

  if (!featured) {
    return (
      <div className="gutter py-32">
        <EmptyState
          title="No video published yet"
          description="Films and series will appear here once they're published."
          action={<ButtonLink href="/news">Read the news instead</ButtonLink>}
        />
      </div>
    );
  }

  return (
    <>
      <TvHero video={featured} />

      <TvCollectionNav />

      <div className="flex flex-col gap-14 py-14">
        {collections.length > 0 ? (
          collections.map((collection, i) => (
            <div key={collection.slug} className="flex flex-col gap-14">
              <MediaRow collection={collection} />
              {/* One optional inline placement, after the second row only. */}
              {i === 1 ? (
                <div className="gutter empty:hidden">
                  <AdSlot placement="tv-row-inline" />
                </div>
              ) : null}
            </div>
          ))
        ) : (
          <div className="gutter">
            <EmptyState
              title="Nothing programmed yet"
              description="Rows appear here as videos are published and tagged."
              action={<Link href="/news">Read the news instead</Link>}
            />
          </div>
        )}
      </div>

      <SponsorLogoCloud sponsors={sponsors} label="Programming partners" className="mb-6" />
    </>
  );
}
