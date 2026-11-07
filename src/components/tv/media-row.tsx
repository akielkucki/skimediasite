import Link from "next/link";
import { useId } from "react";
import { RowScroller } from "./row-scroller";
import { VideoCard } from "./video-card";
import { cn } from "@/lib/utils";
import type { MediaCollection } from "@/types/content";

/**
 * A horizontally scrolling content row.
 *
 * A Server Component: the heading and every `VideoCard` render to HTML on the
 * server, and only the tiny `RowScroller` (arrow buttons + scroll-state
 * tracking) hydrates. Native horizontal scrolling and scroll snap are
 * preserved — see row-scroller.tsx.
 *
 * Rows on the programmed /tv front are capped; when a collection holds more,
 * the heading links through to the full collection view.
 */
export function MediaRow({
  collection,
  className,
  link,
}: {
  collection: MediaCollection;
  className?: string;
  /** Overrides the automatic "All N →" link, e.g. to point at /tv. */
  link?: { href: string; label: string };
}) {
  const headingId = useId();
  const capped = (collection.total ?? collection.videos.length) > collection.videos.length;
  const headingLink =
    link ??
    (capped
      ? { href: `/tv/collections/${collection.slug}`, label: `All ${collection.total} →` }
      : null);

  return (
    <section aria-labelledby={headingId} className={cn("flex flex-col", className)}>
      <RowScroller
        collectionSlug={collection.slug}
        heading={
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h2 id={headingId} className="display text-[clamp(1.25rem,2.6vw,1.75rem)] text-ice">
                {collection.title}
              </h2>
              {headingLink ? (
                <Link
                  href={headingLink.href}
                  className="kicker inline-flex min-h-11 items-center text-mist transition-colors hover:text-ice"
                >
                  {headingLink.label}
                </Link>
              ) : null}
            </div>
            {collection.description ? (
              <p className="max-w-lg text-sm text-mist">{collection.description}</p>
            ) : null}
          </div>
        }
      >
        {collection.videos.map((video) => (
          <li key={video._id} className="snap-start">
            <VideoCard video={video} shape={collection.shape} />
          </li>
        ))}
      </RowScroller>
    </section>
  );
}
