import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import type { Sponsor } from "@/types/content";

/* ── Kicker / eyebrow ──────────────────────────────────────────────────── */

export function Kicker({
  children,
  className,
  accent = false,
}: {
  children: ReactNode;
  className?: string;
  accent?: boolean;
}) {
  return (
    <span className={cn("kicker", accent ? "text-accent" : "text-mist", className)}>
      {children}
    </span>
  );
}

/* ── Section heading ───────────────────────────────────────────────────── */

export function SectionHeading({
  kicker,
  title,
  href,
  linkLabel = "See all",
  className,
  level = 2,
}: {
  kicker?: string;
  title: string;
  href?: string;
  linkLabel?: string;
  className?: string;
  level?: 2 | 3;
}) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="flex flex-col gap-3">
        {kicker ? <Kicker accent>{kicker}</Kicker> : null}
        <Heading className="display leading-[0.92] text-[clamp(1.75rem,4.5vw,3rem)] text-ice">
          {title}
        </Heading>
      </div>
      {href ? (
        <Link
          href={href}
          className="kicker group inline-flex items-center gap-2 text-mist transition-colors hover:text-ice"
        >
          {linkLabel}
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      ) : null}
    </div>
  );
}

/* ── Tags ──────────────────────────────────────────────────────────────── */

export function Tag({
  children,
  href,
  className,
}: {
  children: ReactNode;
  href?: string;
  className?: string;
}) {
  const style = cn(
    "kicker inline-flex items-center border border-steel/40 px-2.5 text-mist",
    // Linked tags are touch targets and must clear 44px; static ones stay slim.
    href ? "min-h-11 transition-colors hover:border-ice hover:text-ice" : "py-1.5",
    className,
  );
  return href ? (
    <Link href={href} className={style}>
      {children}
    </Link>
  ) : (
    <span className={style}>{children}</span>
  );
}

/* ── Sponsored disclosure ──────────────────────────────────────────────── */

/**
 * Sponsored-content badge. Deliberately high-contrast rather than subtle —
 * disclosure that is easy to miss is not disclosure.
 */
export function SponsoredBadge({ sponsor, className }: { sponsor?: Sponsor; className?: string }) {
  return (
    <span
      className={cn(
        "kicker inline-flex items-center gap-2 border border-accent/60 bg-accent/10 px-2.5 py-1.5 text-accent",
        className,
      )}
    >
      {siteConfig.sponsors.sponsoredBadgeLabel}
      {sponsor ? <span className="text-ice/70">· {sponsor.name}</span> : null}
    </span>
  );
}

/** Full disclosure block, shown on sponsored article pages. */
export function SponsorDisclosure({ sponsor }: { sponsor?: Sponsor }) {
  return (
    <aside className="border-l-2 border-accent bg-charcoal/60 p-5 text-sm text-mist">
      <p className="kicker mb-2 text-accent">Disclosure</p>
      <p className="leading-relaxed">
        {sponsor ? (
          <>
            This story was produced with financial support from{" "}
            <strong className="font-semibold text-ice">{sponsor.name}</strong>.{" "}
          </>
        ) : null}
        {siteConfig.sponsors.sponsoredDisclosure}
      </p>
    </aside>
  );
}

/* ── Sponsor logo ──────────────────────────────────────────────────────── */

/**
 * Sponsor "logo".
 *
 * Seed sponsors are invented brands with no real logo files, so this renders a
 * typographic lockup instead — which cannot be mistaken for a real brand asset
 * and reads correctly in both monochrome and colour contexts. When the CMS
 * supplies `logo.mono` / `logo.color`, swap this for an `<Image />`; the
 * `ImageAsset` shape is already on the type.
 */
export function SponsorLogo({
  sponsor,
  className,
  tone = "mono",
}: {
  sponsor: Sponsor;
  className?: string;
  tone?: "mono" | "color";
}) {
  return (
    <span
      className={cn(
        "display inline-flex items-center justify-center px-1 text-center text-lg leading-none tracking-tight",
        tone === "mono" ? "text-mist" : "text-ice",
        className,
      )}
    >
      {sponsor.name}
    </span>
  );
}

/* ── Empty & loading states ────────────────────────────────────────────── */

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-4 border border-dashed border-steel/40 p-10",
        className,
      )}
    >
      {/* Contour-line motif, reused from the site's visual language. */}
      <svg aria-hidden="true" viewBox="0 0 120 40" className="h-10 w-28 text-steel/50">
        <path d="M0 32 Q30 8 60 22 T120 12" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M0 38 Q30 18 60 30 T120 22" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <h3 className="display leading-[0.95] text-2xl text-ice">{title}</h3>
      {description ? <p className="max-w-md text-sm text-mist">{description}</p> : null}
      {action}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("animate-pulse bg-graphite", className)} />;
}

/** Card-shaped skeleton used by every `loading.tsx`. */
export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-4">
          <Skeleton className="aspect-[4/3] w-full" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
}
