import { HomeHero } from "@/components/home/hero";
import { TvBand } from "@/components/home/tv-band";
import { ArticleCard } from "@/components/editorial/article-card";
import { SponsorLogoCloud } from "@/components/sponsors/logo-cloud";
import { AdSlot } from "@/components/ads/ad-slot";
import { EditorialRule, Reveal, StaggerGroup, StaggerItem } from "@/components/motion/primitives";
import { Arrow, ButtonLink } from "@/components/ui/button";
import { EmptyState, SectionHeading } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import {
  getArticles,
  getCollections,
  getFeaturedSponsors,
  getFeaturedVideo,
  getLeadArticle,
} from "@/lib/cms";

/**
 * Editorial homepage.
 *
 * A Server Component throughout — the only client JavaScript on this route is
 * the header, the motion primitives and the TV row's scroll buttons.
 */
export default async function HomePage() {
  const [lead, featuredVideo, sponsors] = await Promise.all([
    getLeadArticle(),
    getFeaturedVideo(),
    getFeaturedSponsors(siteConfig.sponsors.homepageStripLimit),
  ]);

  const excludeIds = lead ? [lead._id] : [];

  const [news, blog, features, collections] = await Promise.all([
    getArticles({ kind: "news", limit: 4, excludeIds }),
    getArticles({ kind: ["blog", "opinion"], limit: 3, excludeIds }),
    getArticles({ kind: "feature", limit: 2, excludeIds }),
    getCollections("latest"),
  ]);

  if (!lead) {
    return (
      <div className="gutter py-32">
        <EmptyState
          title="Nothing published yet"
          description="Once the first story is published it will lead the homepage. Until then there is nothing to show here."
          action={<ButtonLink href="/tv">Browse the TV platform</ButtonLink>}
        />
      </div>
    );
  }

  return (
    <>
      <HomeHero article={lead} video={featuredVideo} />

      {siteConfig.sponsors.showHomepageStrip ? <SponsorLogoCloud sponsors={sponsors} /> : null}

      {/* ── Latest news ───────────────────────────────────────────────── */}
      <section aria-labelledby="latest-news" className="gutter py-16 sm:py-24">
        <SectionHeading
          kicker="Dispatches"
          title="Latest skiing news"
          href="/news"
          linkLabel="All news"
          className="mb-10"
        />
        {news.items.length > 0 ? (
          <StaggerGroup className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {news.items.map((article) => (
              <StaggerItem key={article._id}>
                <ArticleCard article={article} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        ) : (
          <EmptyState
            title="No news yet"
            description="Reporting will appear here as it is filed."
          />
        )}
      </section>

      <div className="gutter">
        <AdSlot placement="home-inline" className="pb-16" />
      </div>

      {/* ── Features: the wide editorial break ────────────────────────── */}
      {features.items.length > 0 ? (
        <section
          aria-labelledby="features-heading"
          className="grain border-y border-steel/20 bg-charcoal py-16 sm:py-24"
        >
          <div className="gutter">
            <SectionHeading
              kicker="Long read"
              title="Features"
              href="/news"
              linkLabel="More reporting"
              className="mb-12"
            />
            <div className="flex flex-col gap-16">
              {features.items.map((article, i) => (
                <Reveal key={article._id} delay={i * 0.05}>
                  <ArticleCard article={article} variant="wide" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Blog & opinion ───────────────────────────────────────────── */}
      <section aria-labelledby="blog-heading" className="gutter py-16 sm:py-24">
        <SectionHeading
          kicker="Columns"
          title="Opinion & culture"
          href="/blog"
          linkLabel="All blog"
          className="mb-10"
        />
        {blog.items.length > 0 ? (
          <StaggerGroup className="grid gap-x-8 gap-y-12 md:grid-cols-3">
            {blog.items.map((article, i) => (
              <StaggerItem key={article._id}>
                <ArticleCard article={article} index={i} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        ) : (
          <EmptyState title="No columns yet" />
        )}
        <EditorialRule className="mt-16" />
      </section>

      {/* ── Editorial → TV ───────────────────────────────────────────── */}
      {featuredVideo ? (
        <TvBand featured={featuredVideo} collection={collections[0] ?? null} />
      ) : null}

      {/* ── Partners ─────────────────────────────────────────────────── */}
      <section aria-labelledby="partners-heading" className="gutter py-16 sm:py-24">
        <SectionHeading
          kicker="Partnerships"
          title="Who backs this work"
          href="/sponsors"
          linkLabel="Partner with us"
          className="mb-10"
        />
        <div className="grid gap-10 lg:grid-cols-[minmax(0,32rem)_1fr] lg:items-start">
          <Reveal>
            <p className="text-pretty leading-relaxed text-mist">
              Everything on this site is free to read and free to watch. That is paid for by brand
              partnerships, sponsored editorial and display placements — all of which are labelled,
              every time, wherever they appear.
            </p>
            <ButtonLink href="/sponsors" variant="secondary" className="mt-6">
              See partnership formats
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
