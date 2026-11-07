import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/editorial/article-card";
import { AuthorByline } from "@/components/editorial/byline";
import { RichText } from "@/components/editorial/rich-text";
import { ShareControls } from "@/components/editorial/share";
import { VideoCard } from "@/components/tv/video-card";
import { MediaPlayer } from "@/components/tv/media-player";
import { SponsorAttribution } from "@/components/sponsors/logo-cloud";
import { WideLayout } from "@/components/layout/wide-layout";
import { EditorialRule, Reveal } from "@/components/motion/primitives";
import { MaskIn } from "@/components/motion/on-load";
import {
  Kicker,
  SectionHeading,
  SponsorDisclosure,
  SponsoredBadge,
} from "@/components/ui/primitives";
import { ContentViewTracker } from "@/components/analytics/trackers";
import { siteConfig } from "@/config/site";
import { getArticle, getArticleSlugs, getRelatedArticles, getVideosByIds } from "@/lib/cms";
import { articleJsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { plainText, safeJsonLd } from "@/lib/utils";

/**
 * Article detail.
 *
 * The body renders on an ice-white "paper" slab — a deliberate inversion of
 * the dark shell that reads like a printed insert and keeps long-form copy at
 * comfortable reading contrast, at a measured width, in a serif.
 */

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/articles/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Story not found" };

  return pageMetadata({
    title: article.title,
    description: article.dek || plainText(article.body, 160),
    path: `/articles/${article.slug}`,
    image: article.hero,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    authors: [article.author.name],
    section: article.category.label,
    tags: article.tags,
    seo: article.seo,
  });
}

export default async function ArticlePage({ params }: PageProps<"/articles/[slug]">) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const [related, relatedVideos] = await Promise.all([
    getRelatedArticles(article, 3),
    getVideosByIds(article.relatedVideoIds ?? []),
  ]);

  // Drop the in-article ad roughly a third of the way down, never before the
  // third block (so it can't land between the headline and the first idea).
  const adAfterBlock =
    article.body.length >= 8 ? Math.max(3, Math.floor(article.body.length / 3)) : undefined;

  const indexPath = "/news";

  return (
    <article>
      {siteConfig.monetization.analyticsProvider ? (
        <ContentViewTracker
          event={{
            name: "article_view",
            slug: article.slug,
            kind: article.kind,
            sponsored: article.sponsored,
          }}
        />
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd(article)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "News", path: indexPath },
              { name: article.title, path: `/articles/${article.slug}` },
            ]),
          ),
        }}
      />

      {/* ── Headline block ───────────────────────────────────────────── */}
      <header className="gutter pb-10 pt-16 sm:pt-24">
        <div className="mx-auto flex max-w-4xl flex-col gap-6">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-3">
            <Link href={indexPath} className="kicker text-mist transition-colors hover:text-ice">
              News
            </Link>
            <span aria-hidden="true" className="text-steel">
              /
            </span>
            <Link
              href={`${indexPath}?category=${article.category.slug}`}
              className="kicker text-accent"
            >
              {article.category.label}
            </Link>
          </nav>

          {article.sponsored ? (
            <SponsoredBadge sponsor={article.sponsor} className="self-start" />
          ) : null}

          <MaskIn>
            <h1 className="display text-balance leading-[0.9] text-[clamp(2.25rem,6.5vw,5rem)] text-ice">
              {article.title}
            </h1>
          </MaskIn>

          <p className="text-pretty text-lg leading-relaxed text-pale sm:text-xl">{article.dek}</p>

          <AuthorByline
            author={article.author}
            publishedAt={article.publishedAt}
            updatedAt={article.updatedAt}
            readingTime={article.readingTime}
          />
        </div>
      </header>

      {/* ── Hero media ───────────────────────────────────────────────── */}
      <figure className="gutter">
        <div className="mx-auto max-w-6xl">
          {article.heroVideo ? (
            <MediaPlayer
              source={article.heroVideo}
              title={article.title}
              poster={article.hero}
              preload
            />
          ) : (
            <div className="relative aspect-[16/9] overflow-hidden bg-charcoal">
              <Image
                src={article.hero.src}
                alt={article.hero.alt}
                fill
                // The LCP element: the route's single intentional preload.
                preload
                sizes="(max-width: 1280px) 100vw, 1152px"
                placeholder={article.hero.blurDataURL ? "blur" : undefined}
                blurDataURL={article.hero.blurDataURL}
                className="object-cover"
                style={
                  article.hero.focalPoint ? { objectPosition: article.hero.focalPoint } : undefined
                }
              />
            </div>
          )}
          {article.hero.caption || article.hero.credit ? (
            <figcaption className="mt-3 flex flex-wrap gap-x-4 text-xs text-steel">
              {article.hero.caption ? <span>{article.hero.caption}</span> : null}
              {article.hero.credit ? <span>{article.hero.credit}</span> : null}
            </figcaption>
          ) : null}
        </div>
      </figure>

      {/* ── Body: the paper slab ─────────────────────────────────────── */}
      <div className="mt-14 bg-paper py-16 sm:py-20">
        <WideLayout className="gutter">
          <div className="mx-auto max-w-[42rem]">
            {article.sponsored ? (
              <div className="mb-10">
                <SponsorDisclosure sponsor={article.sponsor} />
              </div>
            ) : null}

            <RichText blocks={article.body} adAfterBlock={adAfterBlock} />

            <div className="mt-14 flex flex-col gap-8 border-t border-ink/15 pt-8">
              {article.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`${indexPath}?tag=${encodeURIComponent(tag)}`}
                      className="kicker border border-ink/20 px-2.5 py-1.5 text-slate transition-colors hover:border-ink hover:text-ink"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              ) : null}

              <ShareControls title={article.title} tone="light" />

              {article.sponsor ? (
                <div className="border-t border-ink/15 pt-8">
                  <p className="kicker mb-3 text-slate/70">Supported by</p>
                  <p className="display text-2xl text-ink">{article.sponsor.name}</p>
                  {article.sponsor.description ? (
                    <p className="mt-2 max-w-prose text-sm text-slate">
                      {article.sponsor.description}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <AuthorByline author={article.author} variant="full" tone="light" />
            </div>
          </div>
        </WideLayout>
      </div>

      {/* ── Related ──────────────────────────────────────────────────── */}
      {related.length > 0 ? (
        <section aria-labelledby="related-heading" className="gutter py-16 sm:py-24">
          <SectionHeading
            kicker="Keep reading"
            title="Related stories"
            className="mb-10"
            level={2}
          />
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, i) => (
              <Reveal key={item._id} delay={i * 0.05}>
                <ArticleCard article={item} />
              </Reveal>
            ))}
          </div>
          <EditorialRule className="mt-16" />
        </section>
      ) : null}

      {relatedVideos.length > 0 ? (
        <section aria-labelledby="related-video-heading" className="gutter pb-24">
          <SectionHeading
            kicker="Watch"
            title="Related video"
            href="/tv"
            linkLabel="All video"
            className="mb-10"
          />
          <div className="flex flex-wrap gap-6">
            {relatedVideos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        </section>
      ) : null}

      {article.sponsor && !article.sponsored ? (
        <div className="gutter pb-16">
          <Kicker>Sponsor</Kicker>
          <SponsorAttribution sponsor={article.sponsor} className="mt-3" />
        </div>
      ) : null}
    </article>
  );
}
