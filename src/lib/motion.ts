import type { Transition, Variants } from "motion/react";

/**
 * Shared motion vocabulary.
 *
 * Two easings, three durations, and a small set of variants — reused
 * everywhere so the site's movement reads as one system rather than a pile of
 * one-off animations. Everything animates `opacity` / `transform` only, which
 * keeps the work on the compositor and guarantees no layout shift.
 */

export const EASE_EDITORIAL: Transition["ease"] = [0.2, 0.65, 0.3, 1];
export const EASE_CINEMATIC: Transition["ease"] = [0.16, 1, 0.3, 1];

export const DURATION = {
  quick: 0.28,
  base: 0.6,
  cinematic: 1.05,
} as const;

/** Viewport config shared by every scroll-triggered entrance. */
export const IN_VIEW = { once: true, amount: 0.25, margin: "0px 0px -10% 0px" } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_EDITORIAL },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.base, ease: EASE_EDITORIAL } },
};

/** Clip-path wipe used for headline and image reveals. */
export const maskUp: Variants = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)", y: "12%" },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    y: "0%",
    transition: { duration: DURATION.cinematic, ease: EASE_CINEMATIC },
  },
};

/** Horizontal rule that draws itself in — the "editorial divider". */
export const drawLine: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: DURATION.cinematic, ease: EASE_CINEMATIC },
  },
};

export const stagger = (delayChildren = 0, staggerChildren = 0.07): Variants => ({
  hidden: {},
  visible: { transition: { delayChildren, staggerChildren } },
});

/** Cards lift toward the viewer on hover/focus rather than growing a shadow. */
export const cardLift: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 30,
  mass: 0.6,
};

/**
 * Reduced-motion fallback. Applying this variant set means elements arrive at
 * their final state immediately — visible, correct, no movement.
 */
export const staticVariants: Variants = {
  hidden: { opacity: 1, y: 0, scaleX: 1, clipPath: "inset(0% 0% 0% 0%)" },
  visible: {
    opacity: 1,
    y: 0,
    scaleX: 1,
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0 },
  },
};
