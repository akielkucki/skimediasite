import type { Metadata } from "next";
import { StaggerGroup, StaggerItem } from "@/components/motion/primitives";
import { MaskIn } from "@/components/motion/on-load";
import { Arrow, ButtonLink } from "@/components/ui/button";
import { EmptyState, Kicker, SponsorLogo } from "@/components/ui/primitives";
import { getActiveSponsors } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import type { Sponsor } from "@/types/content";

export const metadata: Metadata = pageMetadata({
  title: "Sponsors",
  description: "The companies that back our reporting and film.",
  path: "/sponsors",
});

/**
 * Sponsors: a logo grid, each tile linking out to the company's own site.
 *
 * Sponsors, their logos and websites are managed in the backend (Sponsors).
 * Anyone outside their active date window drops off automatically.
 */
export default async function SponsorsPage() {
  const sponsors = await getActiveSponsors();

  return (
    <>
      <section className="gutter border-b border-steel/20 pb-12 pt-16 sm:pt-24">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex max-w-2xl flex-col gap-5">
            <Kicker accent>Partners</Kicker>
            <MaskIn>
              <h1 className="display text-[clamp(2.75rem,9vw,6.5rem)] text-ice">Our sponsors</h1>
            </MaskIn>
            <p className="text-pretty leading-relaxed text-mist">
              Everything we publish is free to read and watch. These are the companies that make
              that possible.
            </p>
          </div>
          <ButtonLink
            href="/contact?intent=sponsorship"
            variant="secondary"
            className="self-start sm:self-auto"
          >
            Become a sponsor
            <Arrow />
          </ButtonLink>
        </div>
      </section>

      <section aria-label="Sponsor logos" className="gutter py-14 sm:py-20">
        {sponsors.length > 0 ? (
          <StaggerGroup as="ul" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {sponsors.map((sponsor) => (
              <StaggerItem as="li" key={sponsor._id}>
                <SponsorTile sponsor={sponsor} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        ) : (
          <EmptyState
            title="No sponsors listed yet"
            description="Partners appear here once they're added in the backend."
          />
        )}
      </section>
    </>
  );
}

function SponsorTile({ sponsor }: { sponsor: Sponsor }) {
  const tile = (
    <>
      <span className="flex flex-1 items-center justify-center p-6">
        <SponsorLogo sponsor={sponsor} tone="color" className="text-xl sm:text-2xl" />
      </span>
      <span className="flex items-center justify-between gap-2 border-t border-steel/20 px-4 py-3 text-xs text-steel">
        <span className="truncate">{sponsor.name}</span>
        {sponsor.website ? (
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
            ↗
          </span>
        ) : null}
      </span>
    </>
  );

  const className =
    "group flex aspect-[4/3] scroll-mt-32 flex-col border border-steel/25 bg-charcoal/40 transition-colors";

  // `id` keeps the footer's /sponsors#slug links landing on the right tile.
  return sponsor.website ? (
    <a
      id={sponsor.slug}
      href={sponsor.website}
      target="_blank"
      rel="sponsored noopener noreferrer"
      aria-label={`${sponsor.name} — visit their website (opens in a new tab)`}
      className={cn(className, "hover:border-ice/60 hover:bg-charcoal")}
    >
      {tile}
    </a>
  ) : (
    <div id={sponsor.slug} className={className}>
      {tile}
    </div>
  );
}
