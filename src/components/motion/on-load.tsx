import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * On-load reveals for above-the-fold content.
 *
 * These are Server Components with **no JavaScript at all** — the animation is
 * a CSS keyframe with `animation-fill-mode: both`. That matters: the
 * scroll-triggered `Reveal` primitives hide their content until Motion
 * hydrates and animates it, which is fine below the fold but unacceptable for
 * a hero headline, where it would delay LCP and leave a no-JS visitor staring
 * at an empty frame.
 *
 * `prefers-reduced-motion` is honoured by the global rule in globals.css,
 * which collapses the duration and lands straight on the finished state.
 */

type Props = {
  children: ReactNode;
  className?: string;
  /** Seconds. Staggering a hero is what makes it read as a title card. */
  delay?: number;
  as?: ElementType;
};

/** Clip-path wipe — for headlines and hero imagery. */
export function MaskIn({ children, className, delay = 0, as: Tag = "div" }: Props) {
  return (
    <Tag
      className={cn("reveal-mask", className)}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}

/** Fade and rise — for decks, metadata and calls to action. */
export function RiseIn({ children, className, delay = 0, as: Tag = "div" }: Props) {
  return (
    <Tag
      className={cn("reveal-rise", className)}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}

/**
 * Hero media entrance: a slow scale-settle as the page loads. Pure CSS, so the
 * opening frame needs no JavaScript and the photograph paints with the first
 * frame. The wrapper's box is fixed, so this can never cause layout shift.
 */
export function HeroMedia({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <div className="hero-settle absolute inset-0">{children}</div>
    </div>
  );
}
