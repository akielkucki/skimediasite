"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import {
  EASE_CINEMATIC,
  IN_VIEW,
  drawLine,
  fadeUp,
  maskUp,
  stagger,
  staticVariants,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The app's four motion primitives. Server Components compose these; nothing
 * else in the tree needs to be a Client Component to get animation.
 *
 * Every one of them checks `prefers-reduced-motion` and, when set, renders the
 * final state with no transition at all.
 */

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** `as` keeps semantics correct — a reveal wrapper shouldn't force a div. */
  as?: "div" | "section" | "li" | "ul" | "article" | "header" | "figure" | "p";
};

/** Scroll-triggered entrance. The workhorse. */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      data-reveal=""
      className={className}
      variants={reduced ? staticVariants : fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={IN_VIEW}
      transition={reduced ? { duration: 0 } : { delay }}
    >
      {children}
    </Component>
  );
}

/** Container that cascades its `Reveal`-shaped children. */
export function StaggerGroup({
  children,
  className,
  delay = 0,
  step = 0.07,
  as = "div",
}: RevealProps & { step?: number }) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      data-reveal=""
      className={className}
      variants={reduced ? staticVariants : stagger(delay, step)}
      initial="hidden"
      whileInView="visible"
      viewport={IN_VIEW}
    >
      {children}
    </Component>
  );
}

/** Child of `StaggerGroup`. Inherits the parent's timing. */
export function StaggerItem({ children, className, as = "div" }: RevealProps) {
  const reduced = useReducedMotion();
  const Component = motion[as];
  return (
    <Component data-reveal="" className={className} variants={reduced ? staticVariants : fadeUp}>
      {children}
    </Component>
  );
}

/**
 * Clip-path wipe for headlines and hero imagery. `immediate` runs on mount
 * (hero) instead of waiting for the element to scroll into view.
 */
export function MaskReveal({
  children,
  className,
  delay = 0,
  immediate = false,
  as = "div",
}: RevealProps & { immediate?: boolean }) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      data-reveal=""
      className={className}
      variants={reduced ? staticVariants : maskUp}
      initial="hidden"
      {...(immediate ? { animate: "visible" } : { whileInView: "visible", viewport: IN_VIEW })}
      transition={reduced ? { duration: 0 } : { delay }}
    >
      {children}
    </Component>
  );
}

/** The animated editorial divider. Draws from the left on entry. */
export function EditorialRule({ className, delay = 0 }: { className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      data-reveal=""
      className={cn("h-px w-full origin-left bg-steel/40", className)}
      variants={reduced ? staticVariants : drawLine}
      initial="hidden"
      whileInView="visible"
      viewport={IN_VIEW}
      transition={reduced ? { duration: 0 } : { delay }}
    />
  );
}

/**
 * Controlled parallax. The child is oversized by `overscan` so the translation
 * never exposes an edge — which is also why this can't cause layout shift: the
 * wrapper's box is fixed and only the inner layer moves.
 */
export function ParallaxLayer({
  children,
  className,
  /** Travel distance as a fraction of the element height. Keep it small. */
  strength = 0.12,
  overscan = 1.18,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  overscan?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`${-strength * 100}%`, `${strength * 100}%`]);

  if (reduced) {
    return (
      <div ref={ref} className={cn("relative overflow-hidden", className)}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ y, height: `${overscan * 100}%`, top: `${((1 - overscan) / 2) * 100}%` }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Hero-only: a slow scale-down as the page loads, then a gentle scale-up on
 * scroll. Gives the opening frame a sense of scale without any camera-shake.
 */
export function HeroMedia({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25]);

  if (reduced) {
    return (
      <div ref={ref} className={cn("absolute inset-0", className)}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("absolute inset-0", className)}>
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ scale, opacity }}
        initial={{ scale: 1.16 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: EASE_CINEMATIC }}
      >
        {children}
      </motion.div>
    </div>
  );
}
