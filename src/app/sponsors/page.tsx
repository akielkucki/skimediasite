import type { Metadata } from "next";
import { SponsorForm } from "@/components/forms/sponsor-form";
import { SponsorLogo } from "@/components/ui/primitives";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/primitives";
import { MaskIn } from "@/components/motion/on-load";
import { Kicker, SectionHeading } from "@/components/ui/primitives";
import { Arrow, ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getSponsors } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Sponsorship & partnerships",
  description:
    "Partnership formats, sponsored editorial, film co-production and display placements — and how to talk to us about them.",
  path: "/sponsors",
});

/**
 * Partnership formats.
 *
 * Note the absence of audience figures. This publication is fictional and has
 * no real reach data, so inventing "1.2M monthly readers" would be a
 * fabrication a real media kit would be judged on. The placeholders below are
 * explicitly labelled instead.
 */
const FORMATS = [
  {
    name: "Presenting sponsorship",
    tier: "presenting",
    summary:
      "Season-long association with a named strand — a series, a film, or a standing editorial franchise.",
    includes: [
      "Named presence on every piece in the strand",
      "Opening and closing credit on film work",
      "First refusal on the following season",
      "Quarterly performance readout",
    ],
  },
  {
    name: "Sponsored editorial",
    tier: "season",
    summary:
      "A reported piece funded by a brand, written by our newsroom, and labelled as sponsored wherever it appears.",
    includes: [
      "Full reporting and production by our staff",
      "Sponsor named in the byline area and in a disclosure block",
      "Brand reviews for factual accuracy only — no copy approval",
      "Permanent labelling, including in feeds and search results",
    ],
  },
  {
    name: "Film co-production",
    tier: "season",
    summary:
      "Shared funding and shared credit on original documentary or edit work, programmed on the TV platform.",
    includes: [
      "Co-production credit on the film and its detail page",
      "Agreed editorial guardrails set before production",
      "Distribution across the TV platform and social",
      "Usage rights negotiated per project",
    ],
  },
  {
    name: "Display & promotional placements",
    tier: "supporting",
    summary:
      "Leaderboard, rail and in-article placements, plus promotional rows inside the TV platform.",
    includes: [
      "Leaderboard below primary navigation",
      "Desktop rail placements on wide layouts",
      "In-article and between-section inline units",
      "Every unit labelled “Advertisement” or “Promotional placement”",
    ],
  },
] as const;

const PRINCIPLES = [
  {
    title: "Everything is labelled",
    body: "Sponsored editorial carries a badge on the card, the article and the feed. Films state what we produced and what we didn't. There is no unmarked commercial content anywhere on this site.",
  },
  {
    title: "No copy approval",
    body: "Sponsors see sponsored work for factual accuracy. They do not sign off on angle, conclusion or headline. Anything that requires approval is an advertisement, and we sell those separately.",
  },
  {
    title: "News is never for sale",
    body: "The newsroom's reporting — snow, safety, industry, environment — is not available for sponsorship in any format.",
  },
];

export default async function SponsorsPage() {
  const sponsors = await getSponsors();
  const byTier = siteConfig.sponsors.tiers.map((tier) => ({
    tier,
    sponsors: sponsors.filter((s) => s.tier === tier),
  }));

  return (
    <>
      {/* ── Masthead ─────────────────────────────────────────────────── */}
      <section className="gutter border-b border-steel/20 pb-14 pt-16 sm:pt-24">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div className="flex flex-col gap-6">
            <Kicker accent>Partnerships</Kicker>
            <MaskIn>
              <h1 className="display text-[clamp(2.75rem,9vw,7rem)] text-ice">
                Partner with
                <span className="block text-accent">{siteConfig.shortName}</span>
              </h1>
            </MaskIn>
            <p className="max-w-xl text-pretty leading-relaxed text-mist">
              Everything we publish is free. That is paid for by brands who want to reach people who
              take skiing seriously — and who are comfortable being named while doing it.
            </p>
            <div className="flex flex-wrap gap-4">
              <ButtonLink href="#enquire" size="lg">
                Start a conversation
                <Arrow />
              </ButtonLink>
              <ButtonLink href="#formats" variant="secondary" size="lg">
                See the formats
              </ButtonLink>
            </div>
          </div>

          <Reveal delay={0.1} className="border border-steel/25 p-6">
            <Kicker>Audience & positioning</Kicker>
            <p className="mt-4 text-sm leading-relaxed text-mist">
              An independent ski publication covering news, long-form reporting and original film,
              read by skiers who tour, compete, guide, teach and work in the industry.
            </p>
            <dl className="mt-6 flex flex-col gap-4 border-t border-steel/25 pt-6 text-sm">
              {[
                ["Monthly audience", "Figure not yet available"],
                ["Newsletter subscribers", "Figure not yet available"],
                ["Video minutes watched", "Figure not yet available"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between gap-4">
                  <dt className="text-steel">{label}</dt>
                  <dd className="text-right text-ice">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-xs leading-relaxed text-steel">
              These are deliberate placeholders. We publish audited figures in the media kit rather
              than estimates on a web page — ask and we&rsquo;ll send the current numbers.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Current partners ─────────────────────────────────────────── */}
      <section aria-labelledby="current-partners" className="gutter py-16 sm:py-20">
        <SectionHeading kicker="Currently" title="Who we work with" className="mb-10" />
        <div className="flex flex-col gap-10">
          {byTier
            .filter((group) => group.sponsors.length > 0)
            .map((group) => (
              <div key={group.tier} className="border-t border-steel/20 pt-6">
                <h3 className="kicker mb-5 text-steel">{group.tier} partners</h3>
                <StaggerGroup as="ul" className="flex flex-wrap gap-x-10 gap-y-6">
                  {group.sponsors.map((sponsor) => (
                    <StaggerItem as="li" key={sponsor._id}>
                      <div id={sponsor.slug} className="flex max-w-xs flex-col gap-2 scroll-mt-32">
                        {sponsor.website ? (
                          <a
                            href={sponsor.website}
                            rel="sponsored noopener noreferrer"
                            target="_blank"
                            className="transition-opacity hover:opacity-70"
                          >
                            <SponsorLogo sponsor={sponsor} tone="color" />
                          </a>
                        ) : (
                          <SponsorLogo sponsor={sponsor} tone="color" />
                        )}
                        {sponsor.description ? (
                          <p className="text-xs leading-relaxed text-steel">
                            {sponsor.description}
                          </p>
                        ) : null}
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </div>
            ))}
        </div>
      </section>

      {/* ── Formats ──────────────────────────────────────────────────── */}
      <section
        id="formats"
        aria-labelledby="formats-heading"
        className="grain scroll-mt-28 border-y border-steel/20 bg-charcoal py-16 sm:py-24"
      >
        <div className="gutter">
          <SectionHeading kicker="Media kit" title="Partnership formats" className="mb-12" />
          <StaggerGroup as="div" className="grid gap-px bg-steel/20 md:grid-cols-2">
            {FORMATS.map((format) => (
              <StaggerItem key={format.name} className="bg-charcoal p-8">
                <div className="flex flex-col gap-4">
                  <Kicker accent>{format.tier}</Kicker>
                  <h3 className="display text-2xl text-ice">{format.name}</h3>
                  <p className="text-sm leading-relaxed text-mist">{format.summary}</p>
                  <ul className="mt-2 flex flex-col gap-2">
                    {format.includes.map((item) => (
                      <li key={item} className="flex gap-3 text-sm text-pale">
                        <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ── Principles ───────────────────────────────────────────────── */}
      <section aria-labelledby="principles-heading" className="gutter py-16 sm:py-24">
        <SectionHeading kicker="How we work" title="The rules we don't bend" className="mb-12" />
        <div className="grid gap-10 md:grid-cols-3">
          {PRINCIPLES.map((principle, i) => (
            <Reveal key={principle.title} delay={i * 0.06}>
              <span className="display block text-4xl text-steel/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="display mt-3 text-xl text-ice">{principle.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mist">{principle.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Enquiry ──────────────────────────────────────────────────── */}
      <section
        id="enquire"
        aria-labelledby="enquire-heading"
        className={cn("gutter scroll-mt-28 border-t border-steel/20 py-16 sm:py-24")}
      >
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col gap-5">
            <Kicker accent>Enquiries</Kicker>
            <h2 id="enquire-heading" className="display text-[clamp(2rem,5vw,3.5rem)] text-ice">
              Tell us what you&rsquo;re trying to do
            </h2>
            <p className="max-w-md text-pretty leading-relaxed text-mist">
              We&rsquo;ll come back with formats that actually fit, a current media kit with audited
              figures, and availability for the season.
            </p>
            <p className="text-sm text-steel">
              Or write directly:{" "}
              <a
                href={`mailto:${siteConfig.sponsorshipEmail}`}
                className="text-ice underline underline-offset-4"
              >
                {siteConfig.sponsorshipEmail}
              </a>
            </p>
          </div>
          <SponsorForm />
        </div>
      </section>
    </>
  );
}
