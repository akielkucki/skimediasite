import { FeaturedCarousel, type CarouselSlide } from "@/components/home/featured-carousel";
import { TvBand } from "@/components/home/tv-band";
import { ArticleCard } from "@/components/editorial/article-card";
import { MediaRow } from "@/components/tv/media-row";
import { SponsorLogoCloud } from "@/components/sponsors/logo-cloud";
import { AdSlot } from "@/components/ads/ad-slot";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/primitives";
import { Arrow, ButtonLink } from "@/components/ui/button";
import { EmptyState, SectionHeading } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import {
  getArticles,
  getFeaturedArticles,
  getFeaturedSponsors,
  getFeaturedVideo,
  getVideos,
} from "@/lib/cms";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/types/content";

/** Stories in the carousel, and in each of the rows below it. */
const CAROUSEL_COUNT = 5;
const ROW_COUNT = 5;

/**
 * Homepage: featured-story carousel → 5 latest videos → 5 latest stories →
 * the TV band → partners.
 *
 * A Server Component throughout — the client JavaScript on this route is the
 * header, the carousel, the motion primitives and the video row's scroll
 * buttons.
 */
export default async function HomePage() {
  const [featured, featuredVideo, sponsors, videos] = await Promise.all([
    getFeaturedArticles(CAROUSEL_COUNT),
    getFeaturedVideo(),
    getFeaturedSponsors(siteConfig.sponsors.homepageStripLimit),
    getVideos(),
  ]);

  const latest = await getLatestStories(featured.map((a) => a._id));
  // The TV band below leads with the featured film, so the row skips it.
  const latestVideos = videos.filter((v) => v._id !== featuredVideo?._id).slice(0, ROW_COUNT);

  if (featured.length === 0) {
    return (
      <div className="gutter py-32">
        <h1 className="sr-only">{siteConfig.name}</h1>
        <EmptyState
          title="Nothing published yet"
          description="Once the first story is published it will lead the homepage. Until then there is nothing to show here."
          action={<ButtonLink href="/tv">Browse the TV platform</ButtonLink>}
        />
      </div>
    );
  }

  const [leadStory, ...moreStories] = latest;

  return (
    <>
      <h1 className="sr-only">
        {siteConfig.name} — {siteConfig.editorialTagline}
      </h1>

      <FeaturedCarousel slides={featured.map(toSlide)} />

      {siteConfig.sponsors.showHomepageStrip ? <SponsorLogoCloud sponsors={sponsors} /> : null}

      {/* ── Latest videos ─────────────────────────────────────────────── */}
      {latestVideos.length > 0 ? (
        <div className="py-16 sm:py-20">
          <MediaRow
            collection={{ slug: "latest", title: "Latest videos", videos: latestVideos }}
            link={{ href: "/tv", label: "Watch on TV →" }}
          />
        </div>
      ) : null}

      <div className="gutter empty:hidden">
        <AdSlot placement="home-inline" className="pb-16" />
      </div>

      {/* ── Latest stories ────────────────────────────────────────────── */}
      <section aria-label="Latest stories" className="gutter pb-16 sm:pb-24">
        <SectionHeading
          kicker="Dispatches"
          title="Latest stories"
          href="/news"
          linkLabel="All news"
          className="mb-10"
        />
        {leadStory ? (
          <div className="flex flex-col gap-14">
            <Reveal>
              <ArticleCard article={leadStory} variant="wide" />
            </Reveal>
            {moreStories.length > 0 ? (
              <StaggerGroup className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                {moreStories.map((article) => (
                  <StaggerItem key={article._id}>
                    <ArticleCard article={article} />
                  </StaggerItem>
                ))}
              </StaggerGroup>
            ) : null}
          </div>
        ) : (
          <EmptyState
            title="No stories yet"
            description="Reporting will appear here as it is filed."
          />
        )}
      </section>

      {/* ── Editorial → TV ───────────────────────────────────────────── */}
      {featuredVideo ? <TvBand featured={featuredVideo} collection={null} /> : null}

      {/* ── Partners ─────────────────────────────────────────────────── */}
      <section aria-label="Partnerships" className="gutter py-16 sm:py-24">
        <SectionHeading
          kicker="Partnerships"
          title="Who backs this work"
          href="/sponsors"
          linkLabel="All sponsors"
          className="mb-10"
        />
        <div className="grid gap-10 lg:grid-cols-[minmax(0,32rem)_1fr] lg:items-start">
          <Reveal>
            <p className="text-pretty leading-relaxed text-mist">
              Everything on this site is free to read and free to watch. That is paid for by brand
              partnerships, sponsored editorial and display placements — all of which are labelled,
              every time, wherever they appear.
            </p>
            <ButtonLink href="/contact?intent=sponsorship" variant="secondary" className="mt-6">
              Become a sponsor
              <Arrow />
            </ButtonLink>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
              {sponsors.map((sponsor) => (
                <a
                  key={sponsor._id}
                  href={`/sponsors#${sponsor.slug}`}
                  className="display text-lg text-mist transition-colors hover:text-ice"
                >
                  {sponsor.name}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/**
 * The newest stories that aren't already in the carousel. On a young site
 * with only a handful of articles, repeat the carousel stories rather than
 * leave the row near-empty.
 */
async function getLatestStories(carouselIds: string[]): Promise<Article[]> {
  const fresh = await getArticles({ limit: ROW_COUNT, excludeIds: carouselIds });
  if (fresh.items.length >= ROW_COUNT) return fresh.items;
  return (await getArticles({ limit: ROW_COUNT })).items;
}

function toSlide(article: Article): CarouselSlide {
  return {
    id: article._id,
    href: `/articles/${article.slug}`,
    title: article.title,
    dek: article.dek,
    category: article.category.label,
    image: {
      src: article.hero.src,
      alt: article.hero.alt,
      blurDataURL: article.hero.blurDataURL,
      focalPoint: article.hero.focalPoint,
    },
    author: article.author.name,
    date: formatDate(article.publishedAt),
    dateTime: article.publishedAt,
    readingTime: article.readingTime,
    sponsored: article.sponsored,
    sponsor: article.sponsor?.name,
  };
}
