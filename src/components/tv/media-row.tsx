"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { VideoCard } from "./video-card";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { MediaCollection } from "@/types/content";

/**
 * A horizontally scrolling content row.
 *
 * Keyboard access is handled by not fighting the browser: the cards are plain
 * links, so tabbing through them scrolls each one into view natively. The
 * arrow buttons are an *additional* affordance for pointer users, and they are
 * hidden from assistive tech (`aria-hidden`) precisely because they duplicate
 * navigation that tabbing already provides.
 *
 * On touch devices the row is a native overflow scroller with snap points —
 * no JS involved in the gesture at all.
 */
export function MediaRow({
  collection,
  className,
  priorityFirst = false,
}: {
  collection: MediaCollection;
  className?: string;
  priorityFirst?: boolean;
}) {
  const scroller = useRef<HTMLUListElement>(null);
  const reduced = useReducedMotion();
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const headingId = useId();

  const sync = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    sync();
    const el = scroller.current;
    if (!el) return;
    // A passive scroll listener on the element itself — not on window — so
    // this costs nothing when the row is off screen.
    el.addEventListener("scroll", sync, { passive: true });
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      observer.disconnect();
    };
  }, [sync]);

  const scrollBy = (direction: "prev" | "next") => {
    const el = scroller.current;
    if (!el) return;
    const amount = Math.max(el.clientWidth * 0.8, 280);
    el.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: reduced ? "auto" : "smooth",
    });
    track({ name: "tv_row_scroll", collection: collection.slug, direction });
  };

  return (
    <section aria-labelledby={headingId} className={cn("flex flex-col gap-4", className)}>
      <div className="gutter flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h2 id={headingId} className="display text-[clamp(1.25rem,2.6vw,1.75rem)] text-ice">
            {collection.title}
          </h2>
          {collection.description ? (
            <p className="max-w-lg text-sm text-mist">{collection.description}</p>
          ) : null}
        </div>

        <div aria-hidden="true" className="hidden shrink-0 gap-2 md:flex">
          <RowButton direction="prev" disabled={atStart} onClick={() => scrollBy("prev")} />
          <RowButton direction="next" disabled={atEnd} onClick={() => scrollBy("next")} />
        </div>
      </div>

      {/*
        `scroll-pl-*` must mirror the horizontal padding. Without it a
        `snap-start` item snaps its left edge to the *container* edge, which
        scrolls the row underneath the gutter and clips the first card.
      */}
      <ul
        ref={scroller}
        className="no-scrollbar flex snap-x snap-proximity gap-5 overflow-x-auto scroll-smooth px-5 pb-2 scroll-pl-5 md:px-10 md:scroll-pl-10 xl:px-16 xl:scroll-pl-16"
      >
        {collection.videos.map((video, i) => (
          <li key={video._id} className="snap-start">
            <VideoCard video={video} shape={collection.shape} priority={priorityFirst && i < 2} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function RowButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      tabIndex={-1}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex size-10 items-center justify-center border border-steel/40 text-ice transition-colors",
        "hover:border-ice hover:bg-ice/10",
        "disabled:pointer-events-none disabled:opacity-30",
      )}
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="size-4"
      >
        <path d={direction === "next" ? "M5 2l6 6-6 6" : "M11 2L5 8l6 6"} strokeLinecap="square" />
      </svg>
    </button>
  );
}
