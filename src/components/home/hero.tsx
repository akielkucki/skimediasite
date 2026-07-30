import Image from "next/image";
import { HeroMedia } from "@/components/motion/primitives";
import { MaskIn, RiseIn } from "@/components/motion/on-load";
import { Arrow, ButtonLink } from "@/components/ui/button";
import { Kicker, SponsoredBadge } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import { formatDate } from "@/lib/utils";
import type { Article, Video } from "@/types/content";

/**
 * The opening frame.
 *
 * One photograph, one headline, one primary action, one secondary action —
 * and nothing else competing with them. The scale of the type against a
 * full-bleed mountain crop is doing the work; controls are kept out of it.
 *
 * The entrance is CSS-only (see `on-load.tsx`) so the headline paints with the
 * first frame instead of waiting for hydration. The only JavaScript here is
 * the scroll-linked scale on the image, which degrades to a static crop.
 */
export function HomeHero({ article, video }: { article: Article; video: Video | null }) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="grain relative flex min-h-[76svh] flex-col justify-end overflow-hidden pb-12 pt-20 sm:min-h-[82svh] sm:pb-16"
    >
      <HeroMedia>
        <Image
          src={article.hero.src}
          alt={article.hero.alt}
          fill
          priority
          sizes="100vw"
          placeholder={article.hero.blurDataURL ? "blur" : undefined}
          blurDataURL={article.hero.blurDataURL}
          className="object-cover"
          style={article.hero.focalPoint ? { objectPosition: article.hero.focalPoint } : undefined}
        />
      </HeroMedia>

      {/*
        Two stacked scrims. The vertical one has to be strong enough to carry
        white type over the *brightest* part of any crop an editor might
        publish — snowfields are close to paper white — so it reaches ~85%
        opacity across the whole copy block rather than fading in at the very
        bottom. The corner wash keeps the masthead legible independently.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-void from-40% via-void/88 via-72% to-transparent to-94%"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(100%_75%_at_6%_82%,rgba(5,7,10,0.88),transparent_62%)]"
      />

      <div className="gutter relative z-10 flex flex-col gap-6 sm:gap-8">
        {/*
          The eyebrow sits highest in the copy block, where the scrim is
          weakest — measured at 1.4:1 against a bright crop. Each label
          therefore carries its own opaque chip (the same motif as the card
          category tabs) so contrast holds against any photograph an editor
          publishes, not just this one.
        */}
        <RiseIn delay={0.1}>
          <div className="flex flex-wrap items-center gap-2">
            <Kicker accent className="bg-void/90 px-2.5 py-1.5 backdrop-blur-sm">
              {siteConfig.editorialTagline}
            </Kicker>
            <Kicker className="bg-void/90 px-2.5 py-1.5 text-pale backdrop-blur-sm">
              {article.category.label}
            </Kicker>
            {article.sponsored ? <SponsoredBadge sponsor={article.sponsor} /> : null}
          </div>
        </RiseIn>

        <h1
          id="hero-heading"
          className="display max-w-[15ch] text-balance text-[clamp(2.75rem,10vw,8.5rem)] text-ice"
        >
          {/* Word-by-word mask so the headline arrives like a title card. */}
          {article.title.split(" ").map((word, i) => (
            <MaskIn
              key={`${word}-${i}`}
              as="span"
              delay={0.12 + i * 0.08}
              className="inline-block overflow-hidden pr-[0.22em] align-bottom"
            >
              {word}
            </MaskIn>
          ))}
        </h1>

        <RiseIn delay={0.42} className="max-w-2xl">
          <p className="text-pretty leading-relaxed text-pale sm:text-lg">{article.dek}</p>
        </RiseIn>

        <RiseIn delay={0.52}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <ButtonLink href={`/articles/${article.slug}`} size="lg">
              Read the feature
              <Arrow />
            </ButtonLink>
            {video ? (
              <ButtonLink href={`/tv/${video.slug}`} variant="secondary" size="lg">
                Watch on {siteConfig.shortName} TV
              </ButtonLink>
            ) : null}
          </div>
        </RiseIn>

        <RiseIn delay={0.6}>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-mist">
            <span>{article.author.name}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            {article.readingTime ? (
              <>
                <span aria-hidden="true">·</span>
                <span>{article.readingTime} min read</span>
              </>
            ) : null}
          </p>
        </RiseIn>
      </div>
    </section>
  );
}
