import Link from "next/link";
import { TrackedLink } from "@/components/analytics/trackers";
import { SponsorLogo } from "@/components/ui/primitives";
import { StaggerGroup, StaggerItem } from "@/components/motion/primitives";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import type { Sponsor } from "@/types/content";

/**
 * Sponsor logo strip.
 *
 * Renders nothing when there are no active featured sponsors, so the section
 * disappears cleanly rather than leaving a labelled empty band.
 */
export function SponsorLogoCloud({
  sponsors,
  label = siteConfig.sponsors.stripLabel,
  className,
  tone = "mono",
}: {
  sponsors: Sponsor[];
  label?: string;
  className?: string;
  tone?: "mono" | "color";
}) {
  if (sponsors.length === 0) return null;

  return (
    <section
      aria-label={label}
      className={cn("gutter flex flex-col gap-6 border-y border-steel/20 py-10", className)}
    >
      <p className="kicker text-steel">{label}</p>
      <StaggerGroup as="div" className="flex flex-wrap items-center gap-x-12 gap-y-6">
        {sponsors.map((sponsor) => {
          const linkClass =
            "block opacity-60 transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100";
          const inner = (
            <>
              <SponsorLogo sponsor={sponsor} tone={tone} />
              <span className="sr-only">— {sponsor.tier} partner</span>
            </>
          );
          return (
            <StaggerItem key={sponsor._id}>
              {siteConfig.monetization.analyticsProvider ? (
                <TrackedLink
                  href={`/sponsors#${sponsor.slug}`}
                  className={linkClass}
                  event={{ name: "sponsor_click", sponsor: sponsor.slug, surface: label }}
                >
                  {inner}
                </TrackedLink>
              ) : (
                <Link href={`/sponsors#${sponsor.slug}`} className={linkClass}>
                  {inner}
                </Link>
              )}
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </section>
  );
}

/**
 * Attribution line used wherever a single sponsor backs a specific piece of
 * content ("Presented by …"). Distinct from the `SponsoredBadge`, which marks
 * the *content* as sponsored.
 */
export function SponsorAttribution({
  sponsor,
  prefix = "Presented by",
  className,
}: {
  sponsor: Sponsor;
  prefix?: string;
  className?: string;
}) {
  return (
    <p className={cn("flex flex-wrap items-center gap-3 text-sm text-mist", className)}>
      <span className="kicker text-steel">{prefix}</span>
      {sponsor.website ? (
        <a
          href={sponsor.website}
          rel="sponsored noopener noreferrer"
          target="_blank"
          className="transition-colors hover:text-ice"
        >
          <SponsorLogo sponsor={sponsor} tone="color" />
        </a>
      ) : (
        <SponsorLogo sponsor={sponsor} tone="color" />
      )}
    </p>
  );
}
