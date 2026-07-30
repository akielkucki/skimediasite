import type { Metadata } from "next";
import Link from "next/link";
import { TvHero } from "@/components/tv/tv-hero";
import { MediaRow } from "@/components/tv/media-row";
import { VideoCard } from "@/components/tv/video-card";
import { AdSlot } from "@/components/ads/ad-slot";
import { SponsorLogoCloud } from "@/components/sponsors/logo-cloud";
import { EmptyState, Kicker } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getCollections, getFeaturedSponsors, getFeaturedVideo, getVideos } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";
import { cn, matchesSearch } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: `${siteConfig.shortName} TV`,
  description:
    "Ski films, original series, athlete profiles, destination stories and technique — free to watch, with every production clearly credited.",
  path: "/tv",
});

export default async function TvPage({ searchParams }: PageProps<"/tv">) {
  const params = await searchParams;
  const collectionFilter = single(params.collection);
  const query = single(params.q);

  const [featured, sponsors] = await Promise.all([getFeaturedVideo(), getFeaturedSponsors(6)]);

  /* Search mode: a flat grid of matches rather than programmed rows. */
  if (query) {
    const all = await getVideos();
    const matches = all.filter((v) =>
      matchesSearch([v.title, v.summary, v.description, ...v.categories, ...v.tags], query),
    );

    return (
      <div className="gutter py-20 sm:py-28">
        <Kicker accent>{siteConfig.shortName} TV</Kicker>
        <h1 className="display mt-4 text-[clamp(2.25rem,6vw,4rem)] text-ice">
          {matches.length} {matches.length === 1 ? "result" : "results"} for “{query}”
        </h1>
        <div className="mt-10">
          {matches.length > 0 ? (
            <div className="flex flex-wrap gap-x-6 gap-y-10">
              {matches.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nothing matches that"
              description="Try a broader term, a category, or browse the programmed rows."
              action={<ButtonLink href="/tv">Back to TV</ButtonLink>}
            />
          )}
        </div>
      </div>
    );
  }

  const collections = await getCollections(collectionFilter);

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

      {/* TV-specific navigation, driven by `siteConfig.tvNav`. */}
      <nav
        aria-label="TV collections"
        className="gutter no-scrollbar sticky top-[4.25rem] z-30 flex gap-2 overflow-x-auto border-y border-steel/20 bg-void/92 py-3 backdrop-blur-md"
      >
        {siteConfig.tvNav.map((item) => {
          const slug = new URL(item.href, "https://x").searchParams.get("collection") ?? undefined;
          const active = collectionFilter === slug;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "true" : undefined}
              className={cn(
                "kicker shrink-0 border px-4 py-2.5 transition-colors",
                active
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-steel/35 text-mist hover:border-ice hover:text-ice",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-14 py-14">
        {collections.length > 0 ? (
          collections.map((collection, i) => (
            <div key={collection.slug} className="flex flex-col gap-14">
              <MediaRow collection={collection} priorityFirst={i === 0} />
              {/* One optional inline placement, after the second row only. */}
              {i === 1 ? (
                <div className="gutter">
                  <AdSlot placement="tv-row-inline" />
                </div>
              ) : null}
            </div>
          ))
        ) : (
          <div className="gutter">
            <EmptyState
              title="Nothing in this collection yet"
              description="Try another collection, or browse everything."
              action={<ButtonLink href="/tv">All video</ButtonLink>}
            />
          </div>
        )}
      </div>

      <SponsorLogoCloud sponsors={sponsors} label="Programming partners" className="mb-6" />
    </>
  );
}

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
