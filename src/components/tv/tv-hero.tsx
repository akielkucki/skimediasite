import Image from "next/image";
import { MediaPlayer } from "./media-player";
import { HeroMedia, MaskIn, RiseIn } from "@/components/motion/on-load";
import { Arrow, ButtonLink } from "@/components/ui/button";
import { Kicker } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import { cn, formatDuration, formatYear } from "@/lib/utils";
import { OWNERSHIP_LABELS } from "@/lib/video";
import type { Video } from "@/types/content";

/**
 * The /tv billboard.
 *
 * Streaming-shaped — a wide backdrop, key art, a "watch now" action — but the
 * type is the publication's, not a platform's: condensed uppercase over a
 * cold, near-monochrome frame rather than a coloured brand wash.
 *
 * No video autoplays here. The backdrop is a still; playback only begins on an
 * explicit click, which is also when any third-party player code is fetched.
 */
export function TvHero({ video }: { video: Video }) {
  const ownership = OWNERSHIP_LABELS[video.ownership];
  const backdrop = video.cover ?? video.thumbnail;

  return (
    <section
      aria-labelledby="tv-hero-heading"
      className="grain relative flex min-h-[78svh] flex-col justify-end overflow-hidden pb-14 pt-28"
    >
      <HeroMedia>
        <Image
          src={backdrop.src}
          alt={backdrop.alt}
          fill
          // The LCP element: the route's single intentional image preload.
          preload
          sizes="100vw"
          placeholder={backdrop.blurDataURL ? "blur" : undefined}
          blurDataURL={backdrop.blurDataURL}
          className="object-cover"
        />
      </HeroMedia>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-void from-28% via-void/80 via-60% to-void/25"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(100deg,rgba(5,7,10,0.94)_0%,rgba(5,7,10,0.45)_58%,transparent_88%)]"
      />

      <div className="gutter relative z-10 grid gap-10 lg:grid-cols-[minmax(0,34rem)_minmax(0,30rem)] lg:items-end">
        <div className="flex flex-col gap-6">
          {/* Chips rather than bare labels: the eyebrow sits where the scrim is
              weakest, so each label carries its own opaque backing. */}
          <div className="flex flex-wrap items-center gap-2">
            <Kicker accent className="bg-void/90 px-2.5 py-1.5 backdrop-blur-sm">
              {siteConfig.shortName} TV
            </Kicker>
            <Kicker className="bg-void/90 px-2.5 py-1.5 text-pale backdrop-blur-sm">
              Featured
            </Kicker>
          </div>

          <MaskIn delay={0.06}>
            <h1
              id="tv-hero-heading"
              className="display text-balance text-[clamp(2.5rem,8vw,6rem)] text-ice"
            >
              {video.title}
            </h1>
          </MaskIn>

          <RiseIn delay={0.18}>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs uppercase tracking-[0.14em] text-mist">
              <span>{formatYear(video.releaseDate)}</span>
              <span aria-hidden="true">·</span>
              <span>{formatDuration(video.duration)}</span>
              <span aria-hidden="true">·</span>
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
              {video.badges?.map((badge) => (
                <span key={badge} className="border border-steel/50 px-2 py-1">
                  {badge}
                </span>
              ))}
            </p>
          </RiseIn>

          <RiseIn delay={0.24}>
            <p className="max-w-lg text-pretty leading-relaxed text-pale">{video.summary}</p>
          </RiseIn>

          <RiseIn delay={0.3}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <ButtonLink href={`/tv/${video.slug}`} size="lg">
                Watch now
                <Arrow />
              </ButtonLink>
              <ButtonLink href={`/tv/${video.slug}#details`} variant="secondary" size="lg">
                More info
              </ButtonLink>
            </div>
          </RiseIn>
        </div>

        {/* Inline preview so the billboard isn't only a still — but it stays
            click-to-play, and loads no player code until then. */}
        <RiseIn delay={0.34} className="hidden lg:block">
          <MediaPlayer
            source={video.source}
            title={`${video.title} — preview`}
            poster={video.thumbnail}
            duration={video.duration}
            captions={video.captions}
            slug={video.slug}
            ownership={video.ownership}
          />
        </RiseIn>
      </div>
    </section>
  );
}
