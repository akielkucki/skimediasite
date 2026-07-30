import type { Metadata } from "next";
import Image from "next/image";
import { AuthorByline } from "@/components/editorial/byline";
import { EditorialRule, Reveal } from "@/components/motion/primitives";
import { MaskIn } from "@/components/motion/on-load";
import { Arrow, ButtonLink } from "@/components/ui/button";
import { Kicker, SectionHeading } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import { authors } from "@/data/authors";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: `${siteConfig.name} is an independent ski publication covering news, long-form reporting and original film.`,
  path: "/about",
});

const COMMITMENTS = [
  {
    title: "Free at the point of reading",
    body: "Everything on this site is free — no paywall, no account, no metered articles. That is a deliberate choice, and it is funded by clearly-labelled partnerships rather than by subscriptions.",
  },
  {
    title: "Disclosure, every time",
    body: "Sponsored editorial is badged on the card, on the article and in the feed. Film pages state exactly what we produced, co-produced, licensed or merely embedded.",
  },
  {
    title: "Safety reporting stays independent",
    body: "Avalanche and safety coverage is never sponsored, in any format, by anyone — including companies that make safety equipment.",
  },
  {
    title: "We publish our corrections",
    body: "When we get something wrong we update the piece, date the update, and say what changed. Corrections are not quietly folded into the copy.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="gutter border-b border-steel/20 pb-16 pt-16 sm:pt-24">
        <div className="flex max-w-4xl flex-col gap-6">
          <Kicker accent>{siteConfig.tagline}</Kicker>
          <MaskIn>
            <h1 className="display text-[clamp(2.75rem,9vw,7rem)] text-ice">
              About
              <span className="block text-accent">{siteConfig.shortName}</span>
            </h1>
          </MaskIn>
          <p className="text-pretty text-lg leading-relaxed text-pale sm:text-xl">
            {siteConfig.description}
          </p>
        </div>
      </section>

      <section className="gutter py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div className="flex flex-col gap-6 text-pretty leading-relaxed text-mist">
            <p className="text-lg text-pale">
              We cover skiing as a subject that deserves reporting, not just coverage: snow science
              and avalanche forecasting, the economics of resorts and instruction, the environment
              that mountain communities depend on, and the culture and film that grew up around all
              of it.
            </p>
            <p>
              The publication runs two things at once. An editorial desk that files news, features
              and columns; and a film team that makes documentary and edits for the TV platform.
              Those two halves share a newsroom, an argument about what matters, and a standard for
              what gets labelled.
            </p>
            <p>
              We are independent. No resort group, brand or lift company owns any part of this
              publication, and nobody outside the newsroom sees a story before it publishes except
              for factual checks.
            </p>
            <ButtonLink href="/contact" className="mt-2 self-start">
              Get in touch
              <Arrow />
            </ButtonLink>
          </div>

          <Reveal delay={0.1} className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/placeholders/alpine-06.jpg"
              alt="Abstract alpine ridgeline artwork"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void/70 to-transparent" />
          </Reveal>
        </div>
      </section>

      <section
        aria-labelledby="commitments-heading"
        className="grain border-y border-steel/20 bg-charcoal py-16 sm:py-24"
      >
        <div className="gutter">
          <SectionHeading kicker="Standards" title="What we commit to" className="mb-12" />
          <div className="grid gap-x-10 gap-y-12 md:grid-cols-2">
            {COMMITMENTS.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05}>
                <span className="display block text-4xl text-steel/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display mt-3 text-2xl text-ice">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mist">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="newsroom-heading" className="gutter py-16 sm:py-24">
        <SectionHeading kicker="Who writes this" title="The newsroom" className="mb-12" />
        <div className="grid gap-10 md:grid-cols-2">
          {authors
            .filter((a) => a.slug !== "newsroom")
            .map((author, i) => (
              <Reveal key={author._id} delay={i * 0.04}>
                <AuthorByline author={author} variant="full" />
              </Reveal>
            ))}
        </div>
        <EditorialRule className="mt-16" />
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-steel">
          Bylines shown here are development placeholders while the publication is being built.
          Replace them by publishing real author records through the CMS.
        </p>
      </section>

      <section className="gutter pb-24">
        <div className="flex flex-col gap-6 border border-steel/25 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12">
          <div>
            <h2 className="display text-2xl text-ice sm:text-3xl">Something we should look at?</h2>
            <p className="mt-2 max-w-md text-sm text-mist">
              Tips, documents and film submissions all go to the desk that handles them.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/contact?intent=editorial-tip">Send a tip</ButtonLink>
            <ButtonLink href="/contact?intent=video-submission" variant="secondary">
              Submit a film
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
