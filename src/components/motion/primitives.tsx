"use client";

import { createElement, useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-triggered reveal primitives.
 *
 * Implemented with one shared IntersectionObserver and CSS transitions — no
 * animation library, no React state, no re-render on reveal. The observer adds
 * `is-visible` directly to the element and unobserves it; the transition
 * itself lives in globals.css (see "Scroll reveals").
 *
 * `prefers-reduced-motion` is honoured in CSS: the hidden initial state is
 * removed entirely, so content is simply visible.
 *
 * The `data-reveal` attribute keeps the <noscript> backstop in the root layout
 * working: without JavaScript nothing stays hidden.
 */

type RevealTag = "div" | "section" | "li" | "ul" | "article" | "header" | "figure" | "p";

type RevealProps = {
  children?: ReactNode;
  className?: string;
  /** Seconds, matching the previous API. */
  delay?: number;
  /** `as` keeps semantics correct — a reveal wrapper shouldn't force a div. */
  as?: RevealTag;
};

let observer: IntersectionObserver | null = null;

function useRevealRef() {
  return useCallback((node: Element | null) => {
    if (!node) return;
    observer ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer?.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer?.unobserve(node);
  }, []);
}

function RevealBase({
  children,
  className,
  delay = 0,
  as = "div",
  revealClass,
}: RevealProps & { revealClass: string }) {
  const ref = useRevealRef();
  return createElement(
    as,
    {
      ref,
      "data-reveal": "",
      className: cn(revealClass, className),
      style: delay ? { transitionDelay: `${delay}s` } : undefined,
    },
    children,
  );
}

/** Fade-and-rise entrance. The workhorse. */
export function Reveal(props: RevealProps) {
  return <RevealBase {...props} revealClass="reveal-io" />;
}

/**
 * Container that cascades its children. Children get their stagger from CSS
 * sibling order (see `.reveal-group` in globals.css), so `StaggerItem` costs
 * nothing per item.
 */
export function StaggerGroup({ children, className, delay = 0, as = "div" }: RevealProps) {
  const ref = useRevealRef();
  return createElement(
    as,
    {
      ref,
      "data-reveal": "",
      className: cn("reveal-group", className),
      style: delay ? { transitionDelay: `${delay}s` } : undefined,
    },
    children,
  );
}

/** Child of `StaggerGroup`. Inherits its timing from sibling order. */
export function StaggerItem({ children, className, as = "div" }: RevealProps) {
  return createElement(
    as,
    { "data-reveal": "", className: cn("reveal-item", className) },
    children,
  );
}

/** Clip-path wipe for headlines. */
export function MaskReveal(props: RevealProps) {
  return <RevealBase {...props} revealClass="reveal-mask-io" />;
}

/** The animated editorial divider. Draws from the left on entry. */
export function EditorialRule({ className, delay = 0 }: { className?: string; delay?: number }) {
  const ref = useRevealRef();
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-reveal=""
      className={cn("reveal-rule h-px w-full origin-left bg-steel/40", className)}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    />
  );
}
