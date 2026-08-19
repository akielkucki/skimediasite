import Image from "next/image";
import Link from "next/link";
import { PlayGlyph } from "./media-player";
import { cn, formatDuration, formatYear } from "@/lib/utils";
import { OWNERSHIP_LABELS } from "@/lib/video";
import type { Video } from "@/types/content";

/**
 * A card in a TV row.
 *
 * `landscape` is a 16:9 still; `poster` is 2:3 key art for the film rows.
 * Both are a single link — one tab stop — and both reveal their metadata on
 * hover *and* on keyboard focus via `group-focus-within`.
 */
export function VideoCard({
  video,
  shape = "landscape",
  className,
}: {
  video: Video;
  shape?: "landscape" | "poster";
  className?: string;
}) {
  const poster = shape === "poster";
  const image = poster ? (video.poster ?? video.thumbnail) : video.thumbnail;
  const ownership = OWNERSHIP_LABELS[video.ownership];

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-3",
        // Row items are fixed-width so the strip scrolls predictably.
        poster ? "w-44 sm:w-52" : "w-72 sm:w-80",
        className,
      )}
    >
      <Link
        href={`/tv/${video.slug}`}
        className={cn(
          "relative block overflow-hidden bg-charcoal outline-offset-4",
          poster ? "aspect-[2/3]" : "aspect-video",
          "transition-transform duration-300 ease-[var(--ease-cinematic)]",
          "group-hover:-translate-y-1.5 group-focus-within:-translate-y-1.5",
        )}
      >
        {/* Fixed-size (not `fill`) on purpose: cards render at a known width,
            so Next emits a compact 1x/2x srcset instead of a nine-entry
            responsive one — that srcset is repeated for every card in both
            the HTML and the RSC payload, and it dominated /tv's page weight.
            No LQIP either: a base64 blur per card is incompressible payload
            ×2 per image, and the charcoal ground already covers the load. */}
        <Image
          src={image.src}
          alt={image.alt}
          width={poster ? 208 : 320}
          height={poster ? 312 : 180}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-cinematic)] group-hover:scale-105"
        />

        <span className="absolute inset-0 bg-gradient-to-t from-void/85 via-void/10 to-transparent" />

        {/* Play affordance appears on hover or focus, never hover-only. */}
        <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
          <span className="flex size-12 items-center justify-center border border-ice/70 bg-void/60 backdrop-blur-sm">
            <PlayGlyph className="ml-0.5 size-4 text-ice" />
          </span>
        </span>

        <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-2.5">
          <span className="kicker text-ice/90">{formatDuration(video.duration)}</span>
          {video.badges?.[0] ? (
            <span className="kicker bg-accent px-2 py-1 text-void">{video.badges[0]}</span>
          ) : null}
        </span>

        <span className="sr-only">{video.title}</span>
      </Link>

      <div className="flex flex-col gap-1.5">
        <h3 className="display text-balance text-base leading-[0.98] text-ice transition-colors group-hover:text-accent group-focus-within:text-accent">
          {video.title}
        </h3>
        <p className="flex flex-wrap items-center gap-x-2 text-[0.6875rem] uppercase tracking-[0.12em] text-steel">
          <span>{formatYear(video.releaseDate)}</span>
          <span aria-hidden="true">·</span>
          <span className={ownership.tone === "original" ? "text-mist" : undefined}>
            {ownership.short}
          </span>
          {video.series ? (
            <>
              <span aria-hidden="true">·</span>
              <span>
                S{video.series.season} E{video.series.episode}
              </span>
            </>
          ) : null}
        </p>
        {!poster ? (
          <p className="line-clamp-2 text-xs leading-relaxed text-mist">{video.summary}</p>
        ) : null}
      </div>
    </article>
  );
}
