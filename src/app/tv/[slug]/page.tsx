import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaPlayer } from "@/components/tv/media-player";
import { VideoCard } from "@/components/tv/video-card";
import { ShareControls } from "@/components/editorial/share";
import { SponsorAttribution } from "@/components/sponsors/logo-cloud";
import { AdSlot } from "@/components/ads/ad-slot";
import { Reveal } from "@/components/motion/primitives";
import { Kicker, SectionHeading, Tag } from "@/components/ui/primitives";
import { getRelatedVideos, getShowForVideo, getVideo, getVideoSlugs } from "@/lib/cms";
import { breadcrumbJsonLd, pageMetadata, videoJsonLd } from "@/lib/seo";
import { cn, formatDate, formatDuration, formatYear, safeJsonLd } from "@/lib/utils";
import { OWNERSHIP_LABELS } from "@/lib/video";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getVideoSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/tv/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideo(slug);
  if (!video) return { title: "Video not found" };

  return pageMetadata({
    title: video.title,
    description: video.summary || video.description,
    path: `/tv/${video.slug}`,
    image: video.cover ?? video.thumbnail,
    type: "video.other",
    tags: video.tags,
    seo: video.seo,
  });
}

export default async function VideoPage({ params }: PageProps<"/tv/[slug]">) {
  const { slug } = await params;
  const video = await getVideo(slug);
  if (!video) notFound();

  const [related, series] = await Promise.all([getRelatedVideos(video, 6), getShowForVideo(video)]);

  const ownership = OWNERSHIP_LABELS[video.ownership];
  const backdrop = video.cover ?? video.thumbnail;
  const episodes = series?.episodes.filter((e) => e._id !== video._id) ?? [];

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(videoJsonLd(video)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "TV", path: "/tv" },
              { name: video.title, path: `/tv/${video.slug}` },
            ]),
          ),
        }}
      />

      {/* ── Cinematic backdrop ───────────────────────────────────────── */}
      <div className="grain relative">
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <Image
            src={backdrop.src}
            alt=""
            fill
            sizes="100vw"
            placeholder={backdrop.blurDataURL ? "blur" : undefined}
            blurDataURL={backdrop.blurDataURL}
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-void/70 via-void/85 to-void" />
        </div>

        <div className="gutter relative z-10 pb-14 pt-16 sm:pt-24">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-3">
            <Link href="/tv" className="kicker text-mist transition-colors hover:text-ice">
              TV
            </Link>
            {video.series ? (
              <>
                <span aria-hidden="true" className="text-steel">
                  /
                </span>
                <span className="kicker text-accent">{video.series.title}</span>
              </>
            ) : null}
          </nav>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
            <div className="flex flex-col gap-6">
              <h1 className="display text-balance leading-[0.9] text-[clamp(2.25rem,6.5vw,4.75rem)] text-ice">
                {video.title}
              </h1>

              <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs uppercase tracking-[0.14em] text-mist">
                <span>{formatYear(video.releaseDate)}</span>
                <span aria-hidden="true">·</span>
                <span>{formatDuration(video.duration)}</span>
                {video.series ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>
                      Season {video.series.season}, episode {video.series.episode}
                    </span>
                  </>
                ) : null}
                <span
                  className={cn(
                    "px-2 py-1",
                    ownership.tone === "original"
                      ? "bg-accent text-void"
                      : "border border-ice/40 text-ice",
                  )}
                >
                  {ownership.short}
                </span>
              </p>

              <MediaPlayer
                source={video.source}
                title={video.title}
                poster={backdrop}
                captions={video.captions}
                duration={video.duration}
                slug={video.slug}
                ownership={video.ownership}
                priority
              />

              <p className="max-w-2xl text-pretty leading-relaxed text-pale">{video.description}</p>

              <ShareControls title={video.title} />
            </div>

            {/* ── Details rail ───────────────────────────────────────── */}
            <aside
              id="details"
              className="flex flex-col gap-8 border-t border-steel/25 pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
            >
              <div>
                <Kicker>Production</Kicker>
                <p className="mt-3 text-sm leading-relaxed text-mist">{ownership.long}</p>
              </div>

              {video.sponsor ? (
                <div>
                  <Kicker>Sponsorship</Kicker>
                  <SponsorAttribution
                    sponsor={video.sponsor}
                    prefix={video.ownership === "partner" ? "Supplied by" : "Presented by"}
                    className="mt-3"
                  />
                  <p className="mt-2 text-xs leading-relaxed text-steel">
                    This film was financially supported by the brand named above. The relationship
                    is disclosed here and on the film itself.
                  </p>
                </div>
              ) : null}

              {video.director ? (
                <div>
                  <Kicker>Director</Kicker>
                  <p className="mt-3 text-sm text-ice">{video.director}</p>
                </div>
              ) : null}

              {video.credits && video.credits.length > 0 ? (
                <div>
                  <Kicker>Credits</Kicker>
                  <dl className="mt-3 flex flex-col gap-2 text-sm">
                    {video.credits.map((credit) => (
                      <div key={`${credit.role}-${credit.name}`} className="flex gap-3">
                        <dt className="w-32 shrink-0 text-steel">{credit.role}</dt>
                        <dd className="text-ice">{credit.name}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}

              <div>
                <Kicker>Released</Kicker>
                <p className="mt-3 text-sm text-ice">
                  <time dateTime={video.releaseDate}>{formatDate(video.releaseDate)}</time>
                </p>
              </div>

              {video.categories.length > 0 ? (
                <div>
                  <Kicker>Categories</Kicker>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {video.categories.map((category) => (
                      <Tag key={category} href={`/tv?collection=${category}`}>
                        {category.replace(/-/g, " ")}
                      </Tag>
                    ))}
                  </div>
                </div>
              ) : null}

              {video.captions && video.captions.length > 0 ? (
                <div>
                  <Kicker>Accessibility</Kicker>
                  <p className="mt-3 text-sm text-mist">
                    Captions available in {video.captions.map((c) => c.label).join(", ")}.
                  </p>
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </div>

      <div className="gutter">
        <AdSlot placement="tv-row-inline" className="pb-12" />
      </div>

      {/* ── More episodes ────────────────────────────────────────────── */}
      {series && episodes.length > 0 ? (
        <section aria-labelledby="episodes-heading" className="gutter pb-16">
          <SectionHeading
            kicker={`Season ${video.series?.season}`}
            title={`More from ${series.show.title}`}
            className="mb-8"
          />
          <div className="flex flex-wrap gap-x-6 gap-y-10">
            {episodes.map((episode) => (
              <VideoCard key={episode._id} video={episode} />
            ))}
          </div>
        </section>
      ) : null}

      {/* ── Related ──────────────────────────────────────────────────── */}
      {related.length > 0 ? (
        <section aria-labelledby="related-video-heading" className="gutter pb-24">
          <SectionHeading
            kicker="Keep watching"
            title="Related video"
            href="/tv"
            className="mb-8"
          />
          <div className="flex flex-wrap gap-x-6 gap-y-10">
            {related.map((item, i) => (
              <Reveal key={item._id} delay={i * 0.04}>
                <VideoCard video={item} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
