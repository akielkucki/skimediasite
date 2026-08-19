import type { Metadata } from "next";
import { MaskIn } from "@/components/motion/on-load";
import { Kicker } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy & terms",
  description: `How ${siteConfig.name} handles data: what we collect, what we don't, and how to reach us about it.`,
  path: "/privacy",
});

/**
 * Privacy & terms.
 *
 * Written to be true of this codebase as shipped: no analytics run unless a
 * provider is configured, forms are forwarded (not stored) and never logged in
 * full, and embedded players load nothing until clicked. If the deployment's
 * behaviour changes — analytics enabled, a mailing list connected — this page
 * is the surface that must change with it.
 */
export default function PrivacyPage() {
  const analyticsOn = siteConfig.monetization.analyticsProvider !== null;

  return (
    <div className="gutter py-16 sm:py-24">
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        <div className="flex flex-col gap-5">
          <Kicker accent>The small print</Kicker>
          <MaskIn>
            <h1 className="display text-[clamp(2.5rem,7vw,4.5rem)] text-ice">
              Privacy &amp; terms
            </h1>
          </MaskIn>
          <p className="text-pretty leading-relaxed text-mist">
            Everything on this site is free to read and watch, without an account. Here is what that
            means for your data.
          </p>
        </div>

        <div className="flex flex-col gap-8 text-sm leading-relaxed text-mist">
          <section className="border-t border-steel/20 pt-8">
            <h2 className="display mb-3 text-xl text-ice">What we collect</h2>
            {analyticsOn ? (
              <p>
                We measure aggregate usage — which pages are read, which films are played, which
                searches are made — without building individual profiles. We do not use advertising
                trackers and we do not sell data.
              </p>
            ) : (
              <p>
                Nothing, by default. This site runs no analytics scripts and sets no tracking
                cookies. Standard server logs (IP address, requested page) exist transiently for
                security and capacity purposes, as on any web server.
              </p>
            )}
          </section>

          <section className="border-t border-steel/20 pt-8">
            <h2 className="display mb-3 text-xl text-ice">Forms</h2>
            <p>
              If you write to us through a form on this site, what you submit is forwarded to the
              relevant desk so we can reply. Submissions are not used for marketing, are not sold,
              and full form contents are never written to our logs.
            </p>
          </section>

          <section className="border-t border-steel/20 pt-8">
            <h2 className="display mb-3 text-xl text-ice">Embedded video</h2>
            <p>
              Films hosted on YouTube or Vimeo load nothing from those platforms until you press
              play. When you do, the provider&rsquo;s own privacy policy applies to playback. We use
              YouTube&rsquo;s no-cookie player and ask Vimeo not to track where the provider offers
              it.
            </p>
          </section>

          <section className="border-t border-steel/20 pt-8">
            <h2 className="display mb-3 text-xl text-ice">Advertising &amp; sponsorship</h2>
            <p>
              Commercial placements on this site are clearly labelled wherever they appear. We do
              not run third-party ad-tech that profiles readers.
            </p>
          </section>

          <section className="border-t border-steel/20 pt-8">
            <h2 className="display mb-3 text-xl text-ice">Content</h2>
            <p>
              Editorial content is provided in good faith but conditions in the mountains change
              fast — nothing here replaces an avalanche bulletin, a forecast, or your own judgement.
              All content is © {siteConfig.name} or its licensors.
            </p>
          </section>

          <section className="border-t border-steel/20 pt-8">
            <h2 className="display mb-3 text-xl text-ice">Questions</h2>
            <p>
              Anything about your data, or a correction to this page:{" "}
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="text-ice underline underline-offset-4"
              >
                {siteConfig.contactEmail}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
