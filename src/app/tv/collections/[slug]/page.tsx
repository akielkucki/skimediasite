import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TvCollectionNav } from "@/components/tv/collection-nav";
import { VideoCard } from "@/components/tv/video-card";
import { Kicker } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getCollection, getCollectionSlugs } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export function generateStaticParams() {
  return getCollectionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/tv/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) return { title: "Collection not found" };
  return pageMetadata({
    title: `${collection.title} — ${siteConfig.shortName} TV`,
    description:
      collection.description ??
      `Every film in the ${collection.title} collection on ${siteConfig.shortName} TV.`,
    path: `/tv/collections/${slug}`,
  });
}

/**
 * A full collection: the deep-browsing counterpart to the capped rows on the
 * /tv front. Static per collection (ISR), so browsing never re-renders the
 * whole platform.
 */
export default async function CollectionPage({ params }: PageProps<"/tv/collections/[slug]">) {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) notFound();

  return (
    <>
      <TvCollectionNav activeSlug={slug} />

      <div className="gutter py-14 sm:py-20">
        <Kicker accent>{siteConfig.shortName} TV</Kicker>
        <h1 className="display mt-4 text-[clamp(2.25rem,6vw,4rem)] text-ice">{collection.title}</h1>
        {collection.description ? (
          <p className="mt-4 max-w-xl text-pretty text-mist">{collection.description}</p>
        ) : null}
        <p className="kicker mt-4 text-steel">
          {collection.total} {collection.total === 1 ? "title" : "titles"}
        </p>

        <div className="mt-12 flex flex-wrap gap-x-6 gap-y-10">
          {collection.videos.map((video) => (
            <VideoCard key={video._id} video={video} shape={collection.shape} />
          ))}
        </div>

        <div className="mt-16">
          <ButtonLink href="/tv" variant="secondary">
            Back to all programming
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
