import Image from "next/image";
import { MediaRow } from "@/components/tv/media-row";
import { EditorialRule, MaskReveal, Reveal } from "@/components/motion/primitives";
import { Arrow, ButtonLink } from "@/components/ui/button";
import { Kicker } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import { cn, formatDuration } from "@/lib/utils";
import { OWNERSHIP_LABELS } from "@/lib/video";
import type { MediaCollection, Video } from "@/types/content";

/**
 * The editorial → TV transition.
 *
 * This is the one place on the homepage where the surface changes character:
 * the page drops to full black, the type stops behaving like a masthead and
 * starts behaving like a title card, and a content row appears. It should read
 * as walking from a newsroom into a screening room.
 */
export function TvBand({
  featured,
  collection,
}: {
  featured: Video;
  collection: MediaCollection | null;
}) {
  const ownership = OWNERSHIP_LABELS[featured.ownership];

  return (
    <section aria-labelledby="tv-band-heading" className="relative bg-void">
      {/* Torn-edge divider: a hard diagonal cut into the black. */}
      <div
        aria-hidden="true"
        className="h-16 bg-charcoal [clip-path:polygon(0_0,100%_0,100%_35%,0_100%)] sm:h-24"
      />

      <div className="grain relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 opacity-25">
          <Image
            src={(featured.cover ?? featured.thumbnail).src}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-void via-void/80 to-void"
        />

        <div className="gutter relative z-10 flex flex-col gap-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,30rem)] lg:items-end">
            <div className="flex flex-col gap-6">
              <Kicker accent>Now streaming</Kicker>
              <MaskReveal>
                <h2
                  id="tv-band-heading"
                  className="display text-[clamp(2.75rem,9vw,7rem)] leading-[0.82] text-ice"
                >
                  {siteConfig.shortName}
                  <span className="block text-accent">TV</span>
                </h2>
              </MaskReveal>
              <Reveal delay={0.1}>
                <p className="max-w-md text-pretty text-mist">
                  Films, series and original edits — free to watch, no account, no paywall.
                  Everything is labelled with who actually made it.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <ButtonLink href="/tv" variant="accent" size="lg" className="self-start">
                  Enter the TV platform
                  <Arrow />
                </ButtonLink>
              </Reveal>
            </div>

            <Reveal delay={0.2} className="flex flex-col gap-4">
              <div className="relative aspect-video overflow-hidden border border-steel/30">
                <Image
                  src={(featured.cover ?? featured.thumbnail).src}
                  alt={(featured.cover ?? featured.thumbnail).alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  placeholder={featured.thumbnail.blurDataURL ? "blur" : undefined}
                  blurDataURL={featured.thumbnail.blurDataURL}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void/90 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                  <span className="kicker text-ice">{formatDuration(featured.duration)}</span>
                  <span
                    className={cn(
                      "kicker px-2 py-1",
                      ownership.tone === "original"
                        ? "bg-accent text-void"
                        : "border border-ice/40 text-ice",
                    )}
                  >
                    {ownership.short}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="display text-2xl text-ice">
                  <a href={`/tv/${featured.slug}`} className="hover:text-accent">
                    {featured.title}
                  </a>
                </h3>
                <p className="text-sm leading-relaxed text-mist">{featured.summary}</p>
              </div>
            </Reveal>
          </div>

          <EditorialRule />
        </div>

        {collection ? (
          <div className="relative z-10 mt-10">
            <MediaRow collection={collection} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
