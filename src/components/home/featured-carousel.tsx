"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Arrow, ButtonLink } from "@/components/ui/button";
import { Kicker } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types/content";

/** What one slide needs — trimmed on the server so article bodies never ship. */
export type CarouselSlide = {
  id: string;
  href: string;
  title: string;
  dek: string;
  category: string;
  image: Pick<ImageAsset, "src" | "alt" | "blurDataURL" | "focalPoint">;
  author: string;
  /** Pre-formatted on the server so the client can't drift a timezone. */
  date: string;
  dateTime: string;
  readingTime?: number;
  sponsor?: string;
  sponsored: boolean;
};

const INTERVAL_MS = 7000;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * The homepage opener: the five featured stories, one at a time.
 *
 * Auto-advances every 7s, but stops while it's hovered or has keyboard focus,
 * when the visitor presses pause, and entirely under prefers-reduced-motion.
 * Inactive slides are `inert`, so tabbing only ever reaches the story on
 * screen; the numbered tabs underneath jump straight to any story.
 */
export function FeaturedCarousel({ slides }: { slides: CarouselSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const reducedMotion = useMediaQuery(REDUCED_MOTION);
  const touchX = useRef<number | null>(null);

  const count = slides.length;
  const running = count > 1 && !paused && !held && !reducedMotion;

  const go = (next: number) => setIndex(((next % count) + count) % count);

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [running, index, count]);

  if (count === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured stories"
      className="relative overflow-hidden bg-void"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
      }}
      onTouchStart={(e) => {
        touchX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchX.current;
        const end = e.changedTouches[0]?.clientX;
        touchX.current = null;
        if (start == null || end == null || Math.abs(end - start) < 48) return;
        go(end < start ? index + 1 : index - 1);
      }}
    >
      {/* Every slide shares one grid cell, so the frame is as tall as the
          tallest story and nothing jumps when a longer headline arrives. */}
      <div className="grid" aria-live={running ? "off" : "polite"}>
        {slides.map((slide, i) => {
          const active = i === index;
          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={!active}
              inert={!active}
              className={cn(
                "grain relative flex min-h-[78svh] flex-col justify-end pb-32 pt-24 [grid-area:1/1] sm:min-h-[84svh] sm:pb-40",
                "transition-opacity duration-700 ease-[var(--ease-editorial)]",
                active ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0",
              )}
            >
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={slide.image.src}
                  alt={slide.image.alt}
                  fill
                  // The first slide is the route's LCP element.
                  preload={i === 0}
                  sizes="100vw"
                  placeholder={slide.image.blurDataURL ? "blur" : undefined}
                  blurDataURL={slide.image.blurDataURL}
                  className={cn(
                    "object-cover transition-transform duration-[2400ms] ease-[var(--ease-cinematic)]",
                    active ? "scale-100" : "scale-105",
                  )}
                  style={
                    slide.image.focalPoint ? { objectPosition: slide.image.focalPoint } : undefined
                  }
                />
              </div>
              {/* Same two scrims as the old single hero: strong enough for
                  white type over the brightest snowfield an editor uploads. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-void from-35% via-void/85 via-70% to-transparent to-95%"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(100%_75%_at_6%_82%,rgba(5,7,10,0.88),transparent_62%)]"
              />

              <div className="gutter relative z-10 flex flex-col gap-5 sm:gap-7">
                <div className="flex flex-wrap items-center gap-2">
                  <Kicker accent className="bg-void/90 px-2.5 py-1.5 backdrop-blur-sm">
                    Featured
                  </Kicker>
                  <Kicker className="bg-void/90 px-2.5 py-1.5 text-pale backdrop-blur-sm">
                    {slide.category}
                  </Kicker>
                  {slide.sponsored ? (
                    <span className="kicker inline-flex items-center gap-2 border border-accent/60 bg-void/90 px-2.5 py-1.5 text-accent">
                      {siteConfig.sponsors.sponsoredBadgeLabel}
                      {slide.sponsor ? (
                        <span className="text-ice/70">· {slide.sponsor}</span>
                      ) : null}
                    </span>
                  ) : null}
                </div>

                <h2 className="display max-w-[16ch] text-balance text-[clamp(2.5rem,8vw,7rem)] text-ice">
                  {slide.title}
                </h2>

                <p className="line-clamp-3 max-w-2xl text-pretty leading-relaxed text-pale sm:text-lg">
                  {slide.dek}
                </p>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                  <ButtonLink href={slide.href} size="lg" className="self-start">
                    Read the story
                    <Arrow />
                  </ButtonLink>
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-mist">
                    <span>{slide.author}</span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={slide.dateTime}>{slide.date}</time>
                    {slide.readingTime ? (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{slide.readingTime} min read</span>
                      </>
                    ) : null}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Controls ───────────────────────────────────────────────────── */}
      {count > 1 ? (
        <div className="gutter absolute inset-x-0 bottom-0 z-20 flex items-end gap-4 pb-6 sm:pb-8">
          <div className="flex shrink-0 items-center gap-1">
            <ControlButton
              label={paused ? "Play slideshow" : "Pause slideshow"}
              onClick={() => setPaused((p) => !p)}
            >
              {paused ? <PlayGlyph /> : <PauseGlyph />}
            </ControlButton>
            <ControlButton label="Previous story" onClick={() => go(index - 1)}>
              <ChevronGlyph className="rotate-180" />
            </ControlButton>
            <ControlButton label="Next story" onClick={() => go(index + 1)}>
              <ChevronGlyph />
            </ControlButton>
          </div>

          <ol
            className="grid min-w-0 flex-1 gap-2 sm:gap-4"
            style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
          >
            {slides.map((slide, i) => {
              const active = i === index;
              return (
                <li key={slide.id}>
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Show story ${i + 1}: ${slide.title}`}
                    aria-current={active ? "true" : undefined}
                    className="group flex min-h-11 w-full flex-col justify-end gap-2 text-left"
                  >
                    <span className="relative block h-0.5 w-full overflow-hidden bg-ice/25">
                      {active ? (
                        <span
                          // Restart the countdown whenever the slide changes
                          // or the slideshow pauses/resumes.
                          key={`${index}-${running}`}
                          className={cn(
                            "absolute inset-0 bg-accent",
                            running && "carousel-progress",
                          )}
                          style={running ? { animationDuration: `${INTERVAL_MS}ms` } : undefined}
                        />
                      ) : null}
                    </span>
                    <span
                      className={cn(
                        "hidden text-xs leading-snug transition-colors md:line-clamp-2",
                        active ? "text-ice" : "text-mist group-hover:text-ice",
                      )}
                    >
                      <span className="kicker mr-2 text-steel">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {slide.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}
    </section>
  );
}

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-11 items-center justify-center border border-ice/30 bg-void/70 text-ice backdrop-blur-sm transition-colors hover:border-ice hover:bg-ice/10"
    >
      {children}
    </button>
  );
}

function ChevronGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={cn("size-4", className)}
    >
      <path d="M7 4l6 6-6 6" strokeLinecap="square" />
    </svg>
  );
}

function PauseGlyph() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-3.5">
      <rect x="4" y="3" width="4" height="14" />
      <rect x="12" y="3" width="4" height="14" />
    </svg>
  );
}

function PlayGlyph() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-3.5">
      <path d="M5 3l12 7-12 7V3z" />
    </svg>
  );
}
