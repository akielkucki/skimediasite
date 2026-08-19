import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { MaskIn } from "@/components/motion/on-load";
import { ButtonLink } from "@/components/ui/button";
import { Kicker } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import { contactFormEnabled } from "@/lib/env";
import { CONTACT_INTENTS } from "@/lib/forms";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Editorial tips, video submissions, sponsorship enquiries and technical issues — how to reach the right desk.",
  path: "/contact",
});

/**
 * Fully static: the optional `?intent=` preselection is applied client-side
 * by the form after mount, so the page itself renders once at build time.
 *
 * When no form-delivery provider is configured, the submission UI is hidden
 * entirely and the page leads with direct mailto routes instead — no public
 * visitor ever sees "no provider connected" plumbing.
 */
export default function ContactPage() {
  return (
    <div className="gutter py-16 sm:py-24">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-5">
            <Kicker accent>Get in touch</Kicker>
            <MaskIn>
              <h1 className="display text-[clamp(2.75rem,8vw,5.5rem)] text-ice">Contact</h1>
            </MaskIn>
            <p className="max-w-md text-pretty leading-relaxed text-mist">
              Pick the reason that fits and the message reaches the right desk. We read everything;
              we reply to most things within two working days.
            </p>
          </div>

          <dl className="flex flex-col gap-6 border-t border-steel/20 pt-8">
            {CONTACT_INTENTS.map((intent) => (
              <div key={intent.value} className="flex flex-col gap-1">
                <dt className="kicker text-ice">{intent.label}</dt>
                <dd className="text-sm leading-relaxed text-mist">
                  {intent.description}{" "}
                  <a
                    href={`mailto:${siteConfig[intent.routesTo]}`}
                    className="text-steel underline underline-offset-4 transition-colors hover:text-ice"
                  >
                    {siteConfig[intent.routesTo]}
                  </a>
                </dd>
              </div>
            ))}
          </dl>

          {siteConfig.addressLines.length > 0 ? (
            <div className="border-t border-steel/20 pt-8 text-sm text-steel">
              <p className="kicker mb-3 text-steel">Post</p>
              <address className="not-italic leading-relaxed">
                {siteConfig.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>
          ) : null}
        </div>

        {contactFormEnabled ? (
          <div className="border border-steel/25 p-6 sm:p-10">
            <ContactForm />
          </div>
        ) : (
          <div className="flex flex-col items-start gap-5 border border-steel/25 p-6 sm:p-10">
            <Kicker accent>Email us directly</Kicker>
            <h2 className="display text-3xl text-ice">One address reaches the newsroom</h2>
            <p className="max-w-md text-sm leading-relaxed text-mist">
              Write to us and we&rsquo;ll route it to the right desk. Include what you have, and how
              we can verify it if it&rsquo;s a tip.
            </p>
            <ButtonLink href={`mailto:${siteConfig.contactEmail}`} size="lg">
              {siteConfig.contactEmail}
            </ButtonLink>
          </div>
        )}
      </div>
    </div>
  );
}
