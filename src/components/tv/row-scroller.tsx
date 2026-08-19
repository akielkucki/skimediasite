"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * The only hydrated part of a TV content row: the horizontal scroller and its
 * pointer-user arrow buttons. The row heading and every card are rendered on
 * the server and passed in as slots — their markup streams as HTML and is
 * never re-serialised as component props.
 *
 * Keyboard access is handled by not fighting the browser: cards are plain
 * links, so tabbing through them scrolls each one into view natively. The
 * arrow buttons duplicate that for pointer users and are `aria-hidden`.
 *
 * On touch devices the row is a native overflow scroller with snap points —
 * no JavaScript involved in the gesture at all.
 */
export function RowScroller({
  collectionSlug,
  heading,
  children,
}: {
  collectionSlug: string;
  /** Server-rendered heading block, laid out beside the arrow buttons. */
  heading: ReactNode;
  children: ReactNode;
}) {
  const scroller = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

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
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: reduced ? "auto" : "smooth",
    });
    track({ name: "tv_row_scroll", collection: collectionSlug, direction });
  };

  return (
    <>
      <div className="gutter flex items-end justify-between gap-4">
        {heading}
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
        className="no-scrollbar mt-4 flex snap-x snap-proximity gap-5 overflow-x-auto scroll-smooth px-5 pb-2 scroll-pl-5 md:px-10 md:scroll-pl-10 xl:px-16 xl:scroll-pl-16"
      >
        {children}
      </ul>
    </>
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
        "flex size-11 items-center justify-center border border-steel/40 text-ice transition-colors",
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
