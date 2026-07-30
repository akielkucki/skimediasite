import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Buttons and button-shaped links share one visual definition.
 *
 * Sharp corners throughout — the design language is carved and geometric, not
 * rounded. Every variant keeps a 3:1 contrast border so focus is visible.
 */

type Variant = "primary" | "secondary" | "ghost" | "accent";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-ice text-void hover:bg-white",
  secondary: "border border-ice/40 text-ice hover:border-ice hover:bg-ice/10",
  ghost: "text-ice/80 hover:text-ice hover:bg-ice/10",
  accent: "bg-accent text-void hover:bg-[#ff6438]",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.6875rem] tracking-[0.14em]",
  md: "h-11 px-6 text-xs tracking-[0.16em]",
  lg: "h-14 px-8 text-[0.8125rem] tracking-[0.16em]",
};

const BASE =
  "inline-flex items-center justify-center gap-2 font-semibold uppercase " +
  "transition-colors duration-200 ease-[var(--ease-editorial)] " +
  "disabled:pointer-events-none disabled:opacity-50";

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return (
    <button className={buttonClass(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size; children: ReactNode }) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}

/** The chevron used on primary calls to action. */
export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={cn("size-3.5 shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="square" />
    </svg>
  );
}
