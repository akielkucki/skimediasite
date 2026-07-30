import Image from "next/image";
import Link from "next/link";
import { Kicker, SponsoredBadge } from "@/components/ui/primitives";
import { cn, formatShortDate } from "@/lib/utils";
import type { Article } from "@/types/content";

/**
 * The editorial card, in three densities.
 *
 * `default`  — image over headline; the workhorse in index grids.
 * `wide`     — horizontal split, used for the first item in a section.
 * `compact`  — text-only row with a rule, used in sidebars and "latest" lists.
 *
 * Deliberately *not* a rounded box with a shadow: the card is a crop, a rule
 * and type. Hover and keyboard focus both lift the image and shift the rule,
 * so nothing depends on hover alone.
 */

type Variant = "default" | "wide" | "compact";

export function ArticleCard({
  article,
  variant = "default",
  priority = false,
  index,
  className,
}: {
  article: Article;
  variant?: Variant;
  priority?: boolean;
  /** When supplied, renders a two-digit editorial index number. */
  index?: number;
  className?: string;
}) {
  if (variant === "compact")
    return <CompactCard article={article} index={index} className={className} />;

  const wide = variant === "wide";

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-5",
        wide && "md:grid md:grid-cols-2 md:items-center md:gap-10",
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-charcoal",
          wide ? "aspect-[16/10]" : "aspect-[4/3]",
        )}
      >
        <Image
          src={article.hero.src}
          alt={article.hero.alt}
          fill
          sizes={
            wide
              ? "(max-width: 768px) 100vw, 50vw"
              : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          }
          placeholder={article.hero.blurDataURL ? "blur" : undefined}
          blurDataURL={article.hero.blurDataURL}
          priority={priority}
          className={cn(
            "object-cover transition-transform duration-700 ease-[var(--ease-cinematic)]",
            "group-hover:scale-[1.04] group-focus-within:scale-[1.04]",
          )}
          style={article.hero.focalPoint ? { objectPosition: article.hero.focalPoint } : undefined}
        />
        {/* Category tab, set into the crop like a printed index tab. */}
        <span className="kicker absolute bottom-0 left-0 bg-void/85 px-3 py-2 text-ice backdrop-blur-sm">
          {article.category.label}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {index !== undefined ? (
          <span className="display text-3xl leading-none text-steel/50">
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}

        {article.sponsored ? (
          <SponsoredBadge sponsor={article.sponsor} className="self-start" />
        ) : null}

        <h3
          className={cn(
            "display text-balance leading-[0.95] text-ice",
            wide ? "text-[clamp(1.75rem,3.6vw,2.75rem)]" : "text-[clamp(1.35rem,2.4vw,1.75rem)]",
          )}
        >
          {/* The whole card is clickable via this stretched link — one tab
              stop, one accessible name, no nested interactive elements. */}
          <Link href={`/articles/${article.slug}`} className="after:absolute after:inset-0">
            <span className="bg-gradient-to-r from-accent to-accent bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px] group-focus-within:bg-[length:100%_1px]">
              {article.title}
            </span>
          </Link>
        </h3>

        <p
          className={cn(
            "text-mist",
            wide ? "text-base leading-relaxed" : "line-clamp-3 text-sm leading-relaxed",
          )}
        >
          {article.dek}
        </p>

        <CardMeta article={article} />
      </div>
    </article>
  );
}

function CompactCard({
  article,
  index,
  className,
}: {
  article: Article;
  index?: number;
  className?: string;
}) {
  return (
    <article className={cn("group relative border-t border-steel/25 py-5", className)}>
      <div className="flex gap-5">
        {index !== undefined ? (
          <span className="display shrink-0 text-2xl leading-none text-steel/50">
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}
        <div className="flex flex-col gap-2">
          <Kicker>{article.category.label}</Kicker>
          <h3 className="display text-balance leading-[0.95] text-ice sm:text-xl">
            <Link href={`/articles/${article.slug}`} className="after:absolute after:inset-0">
              <span className="transition-colors group-hover:text-accent group-focus-within:text-accent">
                {article.title}
              </span>
            </Link>
          </h3>
          <CardMeta article={article} />
        </div>
      </div>
    </article>
  );
}

export function CardMeta({ article, className }: { article: Article; className?: string }) {
  return (
    <p className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-steel", className)}>
      <span>{article.author.name}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={article.publishedAt}>{formatShortDate(article.publishedAt)}</time>
      {article.readingTime ? (
        <>
          <span aria-hidden="true">·</span>
          <span>{article.readingTime} min read</span>
        </>
      ) : null}
    </p>
  );
}
